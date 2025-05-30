const Interview = require('../models/Interview');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

// ... existing code ...

const findMatchingInterviewers = async (req, res) => {
  const { requiredSkills, date, startTime, duration } = req.body;

  try {
    // Validate input
    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        message: 'Please provide required skills'
      });
    }

    if (!date || !startTime || !duration) {
      return res.status(400).json({
        message: 'Please provide date, start time, and duration'
      });
    }

    console.log('Searching for interviewers with:', {
      requiredSkills,
      date,
      startTime,
      duration
    });

    // Find interviewers with matching skills and availability
    const matchingInterviewers = await User.find({
      role: 'interviewer',
      // Make sure interviewer has all required skills (case-insensitive)
      skills: {
        $all: requiredSkills.map(skill => new RegExp('^' + skill + '$', 'i'))
      },
      // Check availability
      availability: {
        $elemMatch: {
          date: date,
          startTime: startTime,
          duration: { $gte: duration }
        }
      }
    }).select('name email skills yearsOfExperience rating interviewsCount availability');

    // Filter out interviewers who have conflicting interviews
    const availableInterviewers = await Promise.all(
      matchingInterviewers.map(async (interviewer) => {
        const conflictingInterview = await Interview.findOne({
          interviewer: interviewer._id,
          date: date,
          startTime: startTime,
          status: { $in: ['pending', 'accepted'] }
        });

        if (!conflictingInterview) {
          return interviewer;
        }
        return null;
      })
    );

    // Remove null values (interviewers with conflicts)
    const filteredInterviewers = availableInterviewers.filter(interviewer => interviewer !== null);

    console.log(`Found ${filteredInterviewers.length} matching interviewers`);

    res.status(StatusCodes.OK).json(
      filteredInterviewers.map(interviewer => ({
        _id: interviewer._id,
        name: interviewer.name,
        email: interviewer.email,
        skills: interviewer.skills,
        yearsOfExperience: interviewer.yearsOfExperience,
        rating: interviewer.rating,
        interviewsCount: interviewer.interviewsCount,
        availableSlots: interviewer.availability.filter(slot => 
          slot.date === date && 
          slot.startTime === startTime &&
          slot.duration >= duration
        )
      }))
    );
  } catch (error) {
    console.error('Error finding matching interviewers:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to find matching interviewers'
    });
  }
};

const requestInterview = async (req, res) => {
  const { interviewerId, jobTitle, requiredSkills, date, startTime, duration } = req.body;
  const companyId = req.user.userId;

  try {
    // Validate all required fields
    if (!interviewerId || !jobTitle || !requiredSkills || !date || !startTime || !duration) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Check if interviewer exists and is available
    const interviewer = await User.findOne({
      _id: interviewerId,
      role: 'interviewer',
      'availability.date': date,
      'availability.startTime': startTime
    });

    if (!interviewer) {
      return res.status(400).json({
        message: 'Interviewer is not available for the selected time slot'
      });
    }

    // Check if interview slot is already booked
    const existingInterview = await Interview.findOne({
      interviewer: interviewerId,
      date,
      startTime,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingInterview) {
      return res.status(400).json({
        message: 'This time slot is already booked'
      });
    }

    // Create new interview request
    const interview = await Interview.create({
      company: companyId,
      interviewer: interviewerId,
      jobTitle,
      requiredSkills,
      date,
      startTime,
      duration,
      status: 'pending'
    });

    // Populate interviewer and company details
    await interview.populate('interviewer', 'name email');
    await interview.populate('company', 'companyName');

    // Send notification to interviewer (implement your notification system here)
    // For now, we'll just console.log
    console.log(`New interview request for ${interviewer.name} from ${req.user.companyName}`);

    res.status(StatusCodes.CREATED).json({
      message: 'Interview request sent successfully',
      interview
    });
  } catch (error) {
    console.error('Error creating interview request:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to create interview request'
    });
  }
};

const updateInterviewStatus = async (req, res) => {
  const { interviewId } = req.params;
  const { status } = req.body;
  const userId = req.user.userId;

  try {
    const interview = await Interview.findOne({
      _id: interviewId,
      interviewer: userId
    });

    if (!interview) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Interview not found'
      });
    }

    interview.status = status;
    await interview.save();

    res.status(StatusCodes.OK).json({
      message: 'Interview status updated successfully',
      interview
    });
  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to update interview status'
    });
  }
};

module.exports = {
  // ... existing exports ...
  findMatchingInterviewers,
  requestInterview,
  updateInterviewStatus
}; 
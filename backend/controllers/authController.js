const { StatusCodes } = require('http-status-codes');
const Company = require('../models/Company');
const Interviewer = require('../models/Interviewer');
const { BadRequestError, UnauthenticatedError } = require('../errors');

// Company Registration
const registerCompany = async (req, res) => {
  try {
    console.log('Registering company with data:', JSON.stringify(req.body));
    
    // Validate required fields
    const { name, email, password, domain, size, industry } = req.body;
    
    if (!name || !email || !password || !domain || !size || !industry) {
      console.log('Missing required fields:', { 
        name: !!name, 
        email: !!email, 
        password: !!password, 
        domain: !!domain, 
        size: !!size, 
        industry: !!industry 
      });
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        msg: 'Please provide all required fields' 
      });
    }
    
    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      console.log('Company with this email already exists');
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        msg: 'An account with this email already exists' 
      });
    }
    
    // Create the company
    const company = await Company.create(req.body);
    const token = company.createJWT();
    
    console.log('Company registered successfully:', company._id);
    
    res.status(StatusCodes.CREATED).json({ 
      user: { 
        id: company._id,
        name: company.name,
        email: company.email,
        userType: 'company'
      }, 
      token 
    });
  } catch (error) {
    console.error('Error registering company:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        msg: messages.join(', ') 
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      msg: 'Registration failed. Please try again later.' 
    });
  }
};

// Company Login
const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const company = await Company.findOne({ email }).select('+password');
  if (!company) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await company.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const token = company.createJWT();
  res.status(StatusCodes.OK).json({ 
    user: { 
      id: company._id,
      name: company.name,
      email: company.email,
      userType: 'company'
    }, 
    token 
  });
};

// Interviewer Registration
const registerInterviewer = async (req, res) => {
  try {
    console.log('Registering interviewer with data:', JSON.stringify(req.body));
    
    // Validate required fields
    const { name, email, password, workDetails, yearsOfExperience, phoneNumber } = req.body;
    
    if (!name || !email || !password || !workDetails || !yearsOfExperience || !phoneNumber) {
      console.log('Missing required fields:', { 
        name: !!name, 
        email: !!email, 
        password: !!password, 
        workDetails: !!workDetails, 
        yearsOfExperience: !!yearsOfExperience, 
        phoneNumber: !!phoneNumber 
      });
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        msg: 'Please provide all required fields' 
      });
    }
    
    // Check if user already exists
    const existingInterviewer = await Interviewer.findOne({ email });
    if (existingInterviewer) {
      console.log('Interviewer with this email already exists');
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        msg: 'An account with this email already exists' 
      });
    }
    
    // Create the interviewer
    const interviewer = await Interviewer.create(req.body);
    const token = interviewer.createJWT();
    
    console.log('Interviewer registered successfully:', interviewer._id);
    
    res.status(StatusCodes.CREATED).json({ 
      user: { 
        id: interviewer._id,
        name: interviewer.name,
        email: interviewer.email,
        userType: 'interviewer'
      }, 
      token 
    });
  } catch (error) {
    console.error('Error registering interviewer:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        msg: messages.join(', ') 
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      msg: 'Registration failed. Please try again later.' 
    });
  }
};

// Interviewer Login
const loginInterviewer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const interviewer = await Interviewer.findOne({ email }).select('+password');
  if (!interviewer) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await interviewer.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const token = interviewer.createJWT();
  res.status(StatusCodes.OK).json({ 
    user: { 
      id: interviewer._id,
      name: interviewer.name,
      email: interviewer.email,
      userType: 'interviewer'
    }, 
    token 
  });
};

module.exports = {
  registerCompany,
  loginCompany,
  registerInterviewer,
  loginInterviewer
}; 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Interview = require('./models/Interview');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livehire', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Demo Companies
const companies = [
  {
    email: 'techcorp@example.com',
    password: 'password123',
    role: 'company',
    companyName: 'TechCorp Solutions',
    domain: 'Software Development',
    companySize: '51-200',
    industry: 'Technology'
  },
  {
    email: 'datadrive@example.com',
    password: 'password123',
    role: 'company',
    companyName: 'DataDrive Analytics',
    domain: 'Data Science',
    companySize: '11-50',
    industry: 'Data Analytics'
  },
  {
    email: 'webwizards@example.com',
    password: 'password123',
    role: 'company',
    companyName: 'WebWizards',
    domain: 'Web Development',
    companySize: '1-10',
    industry: 'Web Services'
  },
  {
    email: 'aiinnovate@example.com',
    password: 'password123',
    role: 'company',
    companyName: 'AI Innovate',
    domain: 'Artificial Intelligence',
    companySize: '201-500',
    industry: 'AI & Machine Learning'
  },
  {
    email: 'cloudtech@example.com',
    password: 'password123',
    role: 'company',
    companyName: 'CloudTech Systems',
    domain: 'Cloud Computing',
    companySize: '501+',
    industry: 'Cloud Infrastructure'
  },
  {
    email: 'securesoft@example.com',
    password: 'password123',
    role: 'company',
    companyName: 'SecureSoft',
    domain: 'Cybersecurity',
    companySize: '51-200',
    industry: 'Information Security'
  }
];

// Demo Interviewers
const interviewers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'interviewer',
    name: 'John Doe',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: 5,
    rating: 4.7,
    availability: [
      { day: 'Monday', slots: ['10:00 AM', '2:00 PM'] },
      { day: 'Wednesday', slots: ['11:00 AM', '3:00 PM'] },
      { day: 'Friday', slots: ['9:00 AM', '1:00 PM'] }
    ]
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'interviewer',
    name: 'Jane Smith',
    skills: ['Python', 'Django', 'Machine Learning'],
    experience: 7,
    rating: 4.9,
    availability: [
      { day: 'Tuesday', slots: ['9:00 AM', '3:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '2:00 PM'] },
      { day: 'Friday', slots: ['12:00 PM', '4:00 PM'] }
    ]
  },
  {
    email: 'michael.johnson@example.com',
    password: 'password123',
    role: 'interviewer',
    name: 'Michael Johnson',
    skills: ['Java', 'Spring', 'Microservices'],
    experience: 8,
    rating: 4.8,
    availability: [
      { day: 'Monday', slots: ['9:00 AM', '1:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '2:00 PM'] },
      { day: 'Thursday', slots: ['11:00 AM', '3:00 PM'] }
    ]
  },
  {
    email: 'sarah.chen@example.com',
    password: 'password123',
    role: 'interviewer',
    name: 'Sarah Chen',
    skills: ['Python', 'TensorFlow', 'Deep Learning', 'Computer Vision'],
    experience: 6,
    rating: 4.9,
    availability: [
      { day: 'Monday', slots: ['11:00 AM', '3:00 PM'] },
      { day: 'Wednesday', slots: ['9:00 AM', '2:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '4:00 PM'] }
    ]
  },
  {
    email: 'alex.kumar@example.com',
    password: 'password123',
    role: 'interviewer',
    name: 'Alex Kumar',
    skills: ['AWS', 'Docker', 'Kubernetes', 'DevOps'],
    experience: 9,
    rating: 4.8,
    availability: [
      { day: 'Tuesday', slots: ['10:00 AM', '2:00 PM'] },
      { day: 'Thursday', slots: ['9:00 AM', '3:00 PM'] },
      { day: 'Friday', slots: ['11:00 AM', '5:00 PM'] }
    ]
  },
  {
    email: 'emma.wilson@example.com',
    password: 'password123',
    role: 'interviewer',
    name: 'Emma Wilson',
    skills: ['Cybersecurity', 'Network Security', 'Ethical Hacking'],
    experience: 7,
    rating: 4.7,
    availability: [
      { day: 'Monday', slots: ['9:00 AM', '4:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '3:00 PM'] },
      { day: 'Thursday', slots: ['1:00 PM', '5:00 PM'] }
    ]
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear the database
    await User.deleteMany({});
    await Interview.deleteMany({});
    
    console.log('Database cleared');
    
    // Hash passwords and insert companies
    const saltRounds = 10;
    const hashedCompanies = await Promise.all(
      companies.map(async (company) => {
        const salt = await bcrypt.genSalt(saltRounds);
        company.password = await bcrypt.hash(company.password, salt);
        return company;
      })
    );
    
    const savedCompanies = await User.insertMany(hashedCompanies);
    console.log(`${savedCompanies.length} companies seeded`);
    
    // Hash passwords and insert interviewers
    const hashedInterviewers = await Promise.all(
      interviewers.map(async (interviewer) => {
        const salt = await bcrypt.genSalt(saltRounds);
        interviewer.password = await bcrypt.hash(interviewer.password, salt);
        return interviewer;
      })
    );
    
    const savedInterviewers = await User.insertMany(hashedInterviewers);
    console.log(`${savedInterviewers.length} interviewers seeded`);
    
    // Create some demo interviews
    const demoInterviews = [
      {
        company: savedCompanies[0]._id,
        interviewer: savedInterviewers[0]._id,
        candidate: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com'
        },
        jobDetails: {
          title: 'Frontend Developer',
          description: 'We are looking for a Frontend Developer with React experience.',
          requiredSkills: ['JavaScript', 'React', 'CSS']
        },
        schedule: {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          startTime: '10:00 AM',
          duration: 60
        },
        status: 'pending',
        codingTest: {
          timeLimit: 30,
          difficulty: 'medium',
          passingScore: 70
        },
        evaluation: {
          technicalSkills: {
            problemSolving: 4,
            codeQuality: 4,
            debugging: 4
          },
          softSkills: {
            communication: 4,
            teamwork: 4,
            attitude: 4
          },
          recommendation: 'hire',
          summary: 'Strong candidate with good technical and soft skills.'
        },
        roomId: `room-${Date.now()}-1`
      },
      {
        company: savedCompanies[1]._id,
        interviewer: savedInterviewers[1]._id,
        candidate: {
          name: 'Alice Williams',
          email: 'alice.williams@example.com'
        },
        jobDetails: {
          title: 'Data Scientist',
          description: 'Looking for a Data Scientist with Python and ML experience.',
          requiredSkills: ['Python', 'Machine Learning', 'SQL']
        },
        schedule: {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          startTime: '2:00 PM',
          duration: 90
        },
        status: 'accepted',
        codingTest: {
          timeLimit: 45,
          difficulty: 'hard',
          passingScore: 80
        },
        evaluation: {
          technicalSkills: {
            problemSolving: 5,
            codeQuality: 4,
            debugging: 5
          },
          softSkills: {
            communication: 5,
            teamwork: 4,
            attitude: 5
          },
          recommendation: 'strong_hire',
          summary: 'Exceptional candidate with outstanding technical abilities and great communication skills.'
        },
        roomId: `room-${Date.now()}-2`
      },
      {
        company: savedCompanies[2]._id,
        interviewer: savedInterviewers[2]._id,
        candidate: {
          name: 'David Brown',
          email: 'david.brown@example.com'
        },
        jobDetails: {
          title: 'Backend Developer',
          description: 'Seeking a Backend Developer with Java experience.',
          requiredSkills: ['Java', 'Spring Boot', 'Microservices']
        },
        schedule: {
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
          startTime: '11:00 AM',
          duration: 60
        },
        status: 'completed',
        codingTest: {
          timeLimit: 40,
          difficulty: 'medium',
          passingScore: 75
        },
        evaluation: {
          technicalSkills: {
            problemSolving: 3,
            codeQuality: 4,
            debugging: 3
          },
          softSkills: {
            communication: 4,
            teamwork: 4,
            attitude: 4
          },
          recommendation: 'consider',
          summary: 'Good candidate with room for improvement in problem-solving skills.'
        },
        roomId: `room-${Date.now()}-3`
      },
      {
        company: savedCompanies[3]._id,
        interviewer: savedInterviewers[3]._id,
        candidate: {
          name: 'Emily Zhang',
          email: 'emily.zhang@example.com'
        },
        jobDetails: {
          title: 'AI Research Engineer',
          description: 'Looking for an AI Engineer with deep learning expertise.',
          requiredSkills: ['Python', 'TensorFlow', 'Deep Learning']
        },
        schedule: {
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          startTime: '10:00 AM',
          duration: 90
        },
        status: 'pending',
        codingTest: {
          timeLimit: 45,
          difficulty: 'hard',
          passingScore: 85
        },
        evaluation: {
          technicalSkills: {
            problemSolving: 5,
            codeQuality: 5,
            debugging: 4
          },
          softSkills: {
            communication: 5,
            teamwork: 4,
            attitude: 5
          },
          recommendation: 'strong_hire',
          summary: 'Outstanding candidate with exceptional AI/ML skills and great problem-solving abilities.'
        },
        roomId: `room-${Date.now()}-4`
      },
      {
        company: savedCompanies[4]._id,
        interviewer: savedInterviewers[4]._id,
        candidate: {
          name: 'Ryan Martinez',
          email: 'ryan.martinez@example.com'
        },
        jobDetails: {
          title: 'DevOps Engineer',
          description: 'Seeking a DevOps Engineer with strong cloud infrastructure experience.',
          requiredSkills: ['AWS', 'Docker', 'Kubernetes']
        },
        schedule: {
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          startTime: '2:00 PM',
          duration: 60
        },
        status: 'pending',
        codingTest: {
          timeLimit: 40,
          difficulty: 'medium',
          passingScore: 75
        },
        evaluation: {
          technicalSkills: {
            problemSolving: 4,
            codeQuality: 5,
            debugging: 5
          },
          softSkills: {
            communication: 4,
            teamwork: 5,
            attitude: 4
          },
          recommendation: 'hire',
          summary: 'Strong DevOps candidate with excellent infrastructure automation skills.'
        },
        roomId: `room-${Date.now()}-5`
      },
      {
        company: savedCompanies[5]._id,
        interviewer: savedInterviewers[5]._id,
        candidate: {
          name: 'Sophie Anderson',
          email: 'sophie.anderson@example.com'
        },
        jobDetails: {
          title: 'Security Engineer',
          description: 'Looking for a Security Engineer with penetration testing experience.',
          requiredSkills: ['Cybersecurity', 'Network Security', 'Ethical Hacking']
        },
        schedule: {
          date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          startTime: '11:00 AM',
          duration: 75
        },
        status: 'pending',
        codingTest: {
          timeLimit: 50,
          difficulty: 'hard',
          passingScore: 80
        },
        evaluation: {
          technicalSkills: {
            problemSolving: 5,
            codeQuality: 4,
            debugging: 5
          },
          softSkills: {
            communication: 5,
            teamwork: 4,
            attitude: 5
          },
          recommendation: 'strong_hire',
          summary: 'Excellent security professional with strong ethical hacking skills and security mindset.'
        },
        roomId: `room-${Date.now()}-6`
      }
    ];
    
    const savedInterviews = await Interview.insertMany(demoInterviews);
    console.log(`${savedInterviews.length} interviews seeded`);
    
    console.log('Database seeding completed successfully');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase(); 
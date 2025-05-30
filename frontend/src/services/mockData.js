// Mock interviewer data
export const mockInterviewers = [
  {
    _id: '1',
    name: 'Aaditya Jaiswal',
    profileImage: 'https://randomuser.me/api/portraits/men/81.jpg',
    yearsOfExperience: 8,
    skills: ['FRONTEND DEVELOPMENT', 'React', 'Vue.js', 'TypeScript'],
    interviewsCount: 156,
    rating: 4.8,
    availableSlots: [
      { startTime: '10:00 AM' },
      { startTime: '2:00 PM' },
      { startTime: '4:00 PM' }
    ],
    hourlyRate: 150,
    specialization: 'Frontend Architecture',
    location: 'Bangalore, India'
  },
  {
    _id: '2',
    name: 'Aayush Nema',
    profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
    yearsOfExperience: 6,
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
    interviewsCount: 98,
    rating: 4.7,
    availableSlots: [
      { startTime: '11:00 AM' },
      { startTime: '3:00 PM' },
      { startTime: '5:00 PM' }
    ],
    hourlyRate: 140,
    specialization: 'Backend Development',
    location: 'Mumbai, India'
  },
  {
    _id: '3',
    name: 'Aayushi Maigale',
    profileImage: 'https://randomuser.me/api/portraits/women/79.jpg',
    yearsOfExperience: 10,
    skills: ['JAVA', 'Spring Boot', 'Microservices', 'JUnit'],
    interviewsCount: 203,
    rating: 4.9,
    availableSlots: [
      { startTime: '9:00 AM' },
      { startTime: '1:00 PM' },
      { startTime: '4:00 PM' }
    ],
    hourlyRate: 160,
    specialization: 'Enterprise Java Applications',
    location: 'Pune, India'
  },
  {
    _id: '4',
    name: 'Aarjav Jain',
    profileImage: 'https://randomuser.me/api/portraits/men/71.jpg',
    yearsOfExperience: 7,
    skills: ['FRONTEND DEVELOPMENT', 'Angular', 'JavaScript', 'CSS3'],
    interviewsCount: 134,
    rating: 4.6,
    availableSlots: [
      { startTime: '10:30 AM' },
      { startTime: '2:30 PM' },
      { startTime: '4:30 PM' }
    ],
    hourlyRate: 145,
    specialization: 'UI/UX Development',
    location: 'Delhi, India'
  },
  {
    _id: '5',
    name: 'Aadeesh Jain',
    profileImage: 'https://randomuser.me/api/portraits/men/67.jpg',
    yearsOfExperience: 9,
    skills: ['Node.js', 'GraphQL', 'AWS', 'Docker'],
    interviewsCount: 167,
    rating: 4.8,
    availableSlots: [
      { startTime: '11:30 AM' },
      { startTime: '3:30 PM' },
      { startTime: '5:30 PM' }
    ],
    hourlyRate: 155,
    specialization: 'Cloud Architecture',
    location: 'Hyderabad, India'
  },
  {
    _id: '6',
    name: 'Lisa Wang',
    yearsOfExperience: 12,
    skills: ['JAVA', 'Hibernate', 'Oracle', 'Design Patterns'],
    interviewsCount: 245,
    rating: 4.9,
    availableSlots: [
      { startTime: '9:30 AM' },
      { startTime: '1:30 PM' },
      { startTime: '3:30 PM' }
    ],
    hourlyRate: 170,
    specialization: 'Enterprise Architecture'
  }
];

// Function to filter interviewers by skills
export const filterInterviewersBySkills = (requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return mockInterviewers;
  }

  const normalizedRequiredSkills = requiredSkills.map(skill => 
    skill.toUpperCase().trim()
  );

  return mockInterviewers.filter(interviewer => {
    const normalizedInterviewerSkills = interviewer.skills.map(skill => 
      skill.toUpperCase().trim()
    );
    
    return normalizedRequiredSkills.some(requiredSkill =>
      normalizedInterviewerSkills.includes(requiredSkill)
    );
  });
}; 
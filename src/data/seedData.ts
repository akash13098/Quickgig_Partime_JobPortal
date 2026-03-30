export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'seeker' | 'employer';
  avatar: string;
  phone: string;
  location: string;
  skills: string[];
  availability: string[];
  rating: number;
  totalRatings: number;
  bio: string;
}

export interface Job {
  id: string;
  employerId: string;
  title: string;
  company: string;
  description: string;
  pay: number;
  payType: 'hour' | 'day' | 'shift';
  shift: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Flexible';
  shiftTime: string;
  location: string;
  city: string;
  category: string;
  urgent: boolean;
  postedAt: string;
  status: 'active' | 'closed';
  requirements: string[];
  slots: number;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  status: 'applied' | 'accepted' | 'rejected';
  appliedAt: string;
  note?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participants: string[];
  jobId: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  read: boolean;
  timestamp: string;
  type: 'application' | 'accepted' | 'rejected' | 'message' | 'system';
  link?: string;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  jobId: string;
  score: number;
  comment: string;
  createdAt: string;
}

export const seedUsers: User[] = [
  {
    id: 'seeker-1',
    name: 'Arjun Mehta',
    email: 'arjun@demo.com',
    password: 'demo123',
    role: 'seeker',
    avatar: '',
    phone: '+91 98765 43210',
    location: 'Indiranagar, Bangalore',
    skills: ['Event Management', 'Customer Service', 'Data Entry'],
    availability: ['Weekends', 'Evenings'],
    rating: 4.5,
    totalRatings: 12,
    bio: 'Energetic college student looking for part-time gigs on weekends.',
  },
  {
    id: 'seeker-2',
    name: 'Priya Sharma',
    email: 'priya@demo.com',
    password: 'demo123',
    role: 'seeker',
    avatar: '',
    phone: '+91 87654 32109',
    location: 'Andheri, Mumbai',
    skills: ['Teaching', 'Content Writing', 'Social Media'],
    availability: ['Mornings', 'Weekdays'],
    rating: 4.8,
    totalRatings: 23,
    bio: 'Freelance writer and tutor with 3 years experience.',
  },
  {
    id: 'employer-1',
    name: 'Rajesh Kumar',
    email: 'rajesh@demo.com',
    password: 'demo123',
    role: 'employer',
    avatar: '',
    phone: '+91 76543 21098',
    location: 'Koramangala, Bangalore',
    skills: [],
    availability: [],
    rating: 4.2,
    totalRatings: 8,
    bio: 'Hiring manager at EventPro Solutions. Looking for reliable part-time staff.',
  },
  {
    id: 'employer-2',
    name: 'Neha Patel',
    email: 'neha@demo.com',
    password: 'demo123',
    role: 'employer',
    avatar: '',
    phone: '+91 65432 10987',
    location: 'Bandra, Mumbai',
    skills: [],
    availability: [],
    rating: 4.6,
    totalRatings: 15,
    bio: 'Restaurant owner seeking delivery and kitchen staff.',
  },
];

export const seedJobs: Job[] = [
  {
    id: 'job-1',
    employerId: 'employer-1',
    title: 'Event Coordinator',
    company: 'EventPro Solutions',
    description: 'Help coordinate corporate events including setup, guest management, and teardown. Must be punctual and well-groomed.',
    pay: 800,
    payType: 'day',
    shift: 'Morning',
    shiftTime: '8:00 AM - 12:00 PM',
    location: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    category: 'Events',
    urgent: true,
    postedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: 'active',
    requirements: ['Good communication', 'Punctual', 'Presentable'],
    slots: 3,
  },
  {
    id: 'job-2',
    employerId: 'employer-2',
    title: 'Delivery Partner (Evening)',
    company: 'FreshBite Kitchen',
    description: 'Evening food delivery within 5km radius. Own vehicle preferred. Tips included.',
    pay: 400,
    payType: 'shift',
    shift: 'Evening',
    shiftTime: '6:00 PM - 10:00 PM',
    location: 'Andheri West, Mumbai',
    city: 'Mumbai',
    category: 'Delivery',
    urgent: false,
    postedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    status: 'active',
    requirements: ['Own vehicle', 'Know local area', 'Phone with GPS'],
    slots: 5,
  },
  {
    id: 'job-3',
    employerId: 'employer-1',
    title: 'Data Entry Operator',
    company: 'DataFirst Corp',
    description: 'Remote data entry work. Flexible hours. Must have own laptop and stable internet.',
    pay: 250,
    payType: 'hour',
    shift: 'Flexible',
    shiftTime: 'Any 4 hours',
    location: 'Remote',
    city: 'Remote',
    category: 'Data Entry',
    urgent: false,
    postedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    status: 'active',
    requirements: ['Typing speed 40+ WPM', 'Own laptop', 'Attention to detail'],
    slots: 10,
  },
  {
    id: 'job-4',
    employerId: 'employer-2',
    title: 'Café Barista',
    company: 'Brew & Bean Café',
    description: 'Weekend barista at our hip Bandra café. Training provided for coffee art.',
    pay: 500,
    payType: 'day',
    shift: 'Morning',
    shiftTime: '7:00 AM - 1:00 PM',
    location: 'Bandra, Mumbai',
    city: 'Mumbai',
    category: 'Food & Beverage',
    urgent: true,
    postedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    status: 'active',
    requirements: ['Friendly personality', 'Weekend availability', 'Hygiene conscious'],
    slots: 2,
  },
  {
    id: 'job-5',
    employerId: 'employer-1',
    title: 'Campus Brand Ambassador',
    company: 'TechStart Inc.',
    description: 'Promote our app on your college campus. Earn per signup + base pay.',
    pay: 300,
    payType: 'day',
    shift: 'Afternoon',
    shiftTime: '12:00 PM - 4:00 PM',
    location: 'HSR Layout, Bangalore',
    city: 'Bangalore',
    category: 'Marketing',
    urgent: false,
    postedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    status: 'active',
    requirements: ['College student', 'Social media savvy', 'Outgoing personality'],
    slots: 8,
  },
  {
    id: 'job-6',
    employerId: 'employer-2',
    title: 'Photography Assistant',
    company: 'ClickFrame Studios',
    description: 'Assist professional photographers at wedding shoots. Carry equipment and manage lighting.',
    pay: 1200,
    payType: 'day',
    shift: 'Morning',
    shiftTime: '9:00 AM - 5:00 PM',
    location: 'Powai, Mumbai',
    city: 'Mumbai',
    category: 'Creative',
    urgent: false,
    postedAt: new Date(Date.now() - 96 * 3600000).toISOString(),
    status: 'active',
    requirements: ['Basic photography knowledge', 'Physical fitness', 'Own transport'],
    slots: 2,
  },
  {
    id: 'job-7',
    employerId: 'employer-1',
    title: 'Warehouse Packer',
    company: 'QuickShip Logistics',
    description: 'Pack and sort parcels at our warehouse. Night shift premium included.',
    pay: 350,
    payType: 'shift',
    shift: 'Night',
    shiftTime: '10:00 PM - 6:00 AM',
    location: 'Whitefield, Bangalore',
    city: 'Bangalore',
    category: 'Logistics',
    urgent: true,
    postedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    status: 'active',
    requirements: ['Physical stamina', 'Night shift OK', 'ID proof'],
    slots: 15,
  },
  {
    id: 'job-8',
    employerId: 'employer-2',
    title: 'Tutor - Mathematics',
    company: 'BrightMinds Academy',
    description: 'Teach Class 8-10 students mathematics. Online or at our Juhu center.',
    pay: 500,
    payType: 'hour',
    shift: 'Evening',
    shiftTime: '4:00 PM - 7:00 PM',
    location: 'Juhu, Mumbai',
    city: 'Mumbai',
    category: 'Education',
    urgent: false,
    postedAt: new Date(Date.now() - 120 * 3600000).toISOString(),
    status: 'active',
    requirements: ['Strong in Math', 'Patient with students', 'Graduate degree'],
    slots: 3,
  },
  {
    id: 'job-9',
    employerId: 'employer-1',
    title: 'Social Media Manager (Part-Time)',
    company: 'VibeCheck Digital',
    description: 'Manage Instagram and Twitter for a D2C fashion brand. Create reels and stories.',
    pay: 600,
    payType: 'day',
    shift: 'Flexible',
    shiftTime: 'Any 3 hours',
    location: 'Remote',
    city: 'Remote',
    category: 'Marketing',
    urgent: false,
    postedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    status: 'active',
    requirements: ['Instagram expertise', 'Canva/Figma skills', 'Creative mindset'],
    slots: 1,
  },
  {
    id: 'job-10',
    employerId: 'employer-2',
    title: 'Reception & Front Desk',
    company: 'Zenith Co-Working',
    description: 'Greet visitors, manage bookings, and handle calls at our co-working space.',
    pay: 450,
    payType: 'day',
    shift: 'Morning',
    shiftTime: '9:00 AM - 2:00 PM',
    location: 'Koramangala, Bangalore',
    city: 'Bangalore',
    category: 'Admin',
    urgent: false,
    postedAt: new Date(Date.now() - 168 * 3600000).toISOString(),
    status: 'active',
    requirements: ['Professional demeanor', 'MS Office', 'Multilingual preferred'],
    slots: 1,
  },
];

export const seedApplications: Application[] = [];
export const seedChats: Chat[] = [];
export const seedMessages: Message[] = [];
export const seedNotifications: Notification[] = [];
export const seedRatings: Rating[] = [];

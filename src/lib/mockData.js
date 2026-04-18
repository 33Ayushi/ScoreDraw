// Mock data store for demo purposes
// In production, all data comes from Supabase

export const mockCharities = [
  {
    id: '1',
    name: 'Children\'s Golf Foundation',
    description: 'Introducing golf to underprivileged children across the UK. We provide equipment, coaching, and course access to young people who would never otherwise experience the sport.',
    category: 'Youth Development',
    image_url: '/charities/children-golf.jpg',
    featured: true,
    website: 'https://example.com/cgf',
    total_raised: 4523000,
    events: [
      { title: 'Summer Junior Open', date: '2026-07-15', location: 'St Andrews' },
      { title: 'Youth Coaching Day', date: '2026-08-02', location: 'Royal Birkdale' }
    ]
  },
  {
    id: '2',
    name: 'Golf for Veterans',
    description: 'Supporting military veterans through therapeutic golf programmes. Our courses help with PTSD recovery, building community, and reintegration into civilian life.',
    category: 'Veterans Support',
    image_url: '/charities/veterans-golf.jpg',
    featured: true,
    website: 'https://example.com/gfv',
    total_raised: 6789000,
    events: [
      { title: 'Veterans Charity Day', date: '2026-06-20', location: 'Wentworth' },
      { title: 'Heroes Open', date: '2026-09-10', location: 'Gleneagles' }
    ]
  },
  {
    id: '3',
    name: 'Green Earth Initiative',
    description: 'Promoting environmental sustainability in golf course management. We work with courses worldwide to reduce chemical usage and protect natural habitats.',
    category: 'Environment',
    image_url: '/charities/green-earth.jpg',
    featured: false,
    website: 'https://example.com/gei',
    total_raised: 3456000,
    events: [
      { title: 'Eco Golf Summit', date: '2026-05-18', location: 'Pebble Beach' }
    ]
  },
  {
    id: '4',
    name: 'Disability Golf Alliance',
    description: 'Making golf accessible to people with physical and learning disabilities. We adapt equipment, train coaches, and create inclusive playing environments.',
    category: 'Accessibility',
    image_url: '/charities/disability-golf.jpg',
    featured: true,
    website: 'https://example.com/dga',
    total_raised: 5214000,
    events: [
      { title: 'Inclusive Open Championship', date: '2026-08-25', location: 'Carnoustie' }
    ]
  },
  {
    id: '5',
    name: 'Mental Health Through Sport',
    description: 'Using golf as a tool for mental health recovery. Our programmes combine outdoor activity with peer support groups and professional counselling.',
    category: 'Mental Health',
    image_url: '/charities/mental-health.jpg',
    featured: false,
    website: 'https://example.com/mhts',
    total_raised: 2890000,
    events: [
      { title: 'Wellbeing Walk & Play', date: '2026-07-08', location: 'Royal Troon' }
    ]
  },
  {
    id: '6',
    name: 'Community Links Trust',
    description: 'Building community golf spaces in urban areas. We transform unused land into accessible practice facilities and social hubs.',
    category: 'Community',
    image_url: '/charities/community-links.jpg',
    featured: false,
    website: 'https://example.com/clt',
    total_raised: 4120000,
    events: [
      { title: 'Community Cup', date: '2026-06-05', location: 'Links Park, London' }
    ]
  }
];

export const mockUsers = [
  {
    id: 'user-1',
    email: 'demo@scoredraw.in',
    name: 'Alex Thompson',
    role: 'subscriber',
    avatar_url: null,
    subscription: {
      plan_type: 'monthly',
      status: 'active',
      start_date: '2026-01-15',
      end_date: '2026-04-15',
      amount: 899
    },
    charity_id: '1',
    charity_percentage: 15,
    scores: [
      { id: 's1', score: 38, date: '2026-04-10' },
      { id: 's2', score: 32, date: '2026-03-28' },
      { id: 's3', score: 41, date: '2026-03-15' },
      { id: 's4', score: 29, date: '2026-02-20' },
      { id: 's5', score: 35, date: '2026-02-05' }
    ],
    draws: [
      { month: 'March 2026', numbers: [32, 41, 29, 35, 38], matched: 3, prize: 2500 },
      { month: 'February 2026', numbers: [29, 35, 38, 32, 41], matched: 0, prize: 0 }
    ],
    winnings: { total: 2500, pending: 2500, paid: 0 }
  }
];

export const mockDraws = [
  {
    id: 'draw-1',
    month: 'April',
    year: 2026,
    status: 'upcoming',
    type: 'random',
    winning_numbers: null,
    entries_count: 245,
    prize_pool: {
      total: 450000,
      five_match: 180000,
      four_match: 157500,
      three_match: 112500
    }
  },
  {
    id: 'draw-2',
    month: 'March',
    year: 2026,
    status: 'published',
    type: 'random',
    winning_numbers: [34, 28, 41, 19, 37],
    entries_count: 238,
    prize_pool: {
      total: 425000,
      five_match: 170000,
      four_match: 148750,
      three_match: 106250
    },
    winners: {
      five_match: [],
      four_match: [{ user_name: 'Sarah Connor', prize: 74375 }],
      three_match: [
        { user_name: 'John Smith', prize: 26562.50 },
        { user_name: 'Alex Thompson', prize: 26562.50 },
        { user_name: 'Maria Garcia', prize: 26562.50 },
        { user_name: 'James Wilson', prize: 26562.50 }
      ]
    },
    jackpot_rollover: 170000
  },
  {
    id: 'draw-3',
    month: 'February',
    year: 2026,
    status: 'published',
    type: 'algorithmic',
    winning_numbers: [31, 25, 38, 42, 17],
    entries_count: 220,
    prize_pool: {
      total: 400000,
      five_match: 160000,
      four_match: 140000,
      three_match: 100000
    },
    winners: {
      five_match: [],
      four_match: [
        { user_name: 'Emily Brown', prize: 70000 },
        { user_name: 'David Lee', prize: 70000 }
      ],
      three_match: [
        { user_name: 'Tom Hardy', prize: 33333.33 },
        { user_name: 'Lisa Park', prize: 33333.33 },
        { user_name: 'Chris Evans', prize: 33333.33 }
      ]
    },
    jackpot_rollover: 160000
  }
];

export const mockAdminStats = {
  totalUsers: 312,
  activeSubscribers: 245,
  totalPrizePool: 1275000,
  totalCharityContributions: 810000,
  monthlyRevenue: 220255,
  yearlyRevenue: 2643060,
  averageScore: 33.4,
  drawsCompleted: 5,
  pendingVerifications: 3,
  jackpotAmount: 330000
};

import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Seed initial menu data for 7 days
const initialMenu = {
  Monday: {
    Breakfast: { items: 'Aloo Paratha, Curd, Pickle, Tea/Coffee', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Dal Tadka, Mix Veg Sabzi, Roti, Rice, Salad', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Samosa, Mint Chutney, Hot Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Paneer Bhurji, Chana Masala, Roti, Rice, Kheer', time: '07:30 PM - 09:30 PM' }
  },
  Tuesday: {
    Breakfast: { items: 'Idli, Sambhar, Coconut Chutney, Milk/Tea', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Rajma Masala, Aloo Gobi, Roti, Jeera Rice, Curd', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Veg Cutlet, Tomato Ketchup, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Chicken Curry (or Matar Paneer), Yellow Dal, Roti, Rice', time: '07:30 PM - 09:30 PM' }
  },
  Wednesday: {
    Breakfast: { items: 'Poha with Sev, Jalebi, Sprouts, Tea/Coffee', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Kadi Pakoda, Bhindi Fry, Roti, Rice, Papad', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Kachori, Sweet Chutney, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Egg Curry (or Dum Aloo), Dal Makhani, Roti, Rice, Ice Cream', time: '07:30 PM - 09:30 PM' }
  },
  Thursday: {
    Breakfast: { items: 'Veg Sandwich, Boiled Eggs, Fruit Bowl, Tea/Milk', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Chole Bhature, Boondi Raita, Onion Salad', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Aloo Bonda, Green Chutney, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Veg Kofta, Dal Fry, Roti, Rice, Gulab Jamun', time: '07:30 PM - 09:30 PM' }
  },
  Friday: {
    Breakfast: { items: 'Uttapam, Tomato Onion Chutney, Sambhar, Tea/Milk', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Lauki Kofta, Black Chana Dal, Roti, Rice, Buttermilk', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Bread Pakoda, Sauce, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Butter Paneer, Dal Tadka, Garlic Naan/Roti, Rice, Custard', time: '07:30 PM - 09:30 PM' }
  },
  Saturday: {
    Breakfast: { items: 'Puri Sabzi, Halwa, Tea/Coffee', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Veg Biryani, Salan, Veg Raita, Chips', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Pav Bhaji, Hot Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Kadai Mushroom, Dal Fry, Roti, Rice, Sewai', time: '07:30 PM - 09:30 PM' }
  },
  Sunday: {
    Breakfast: { items: 'Bread Butter/Jam, Omelette, Tea/Coffee', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Shahi Paneer (or Butter Chicken), Jeera Rice, Butter Naan, Salad', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Dhokla, Green Chillies, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Special Veg Pulao, Dal Makhani, Tandoori Roti, Rasgulla', time: '07:30 PM - 09:30 PM' }
  }
};

// Seed mock review data
const initialReviews = [
  {
    id: 'rev-1',
    studentName: 'Rahul Sharma',
    hostelId: 'H4-A20',
    day: 'Monday',
    mealType: 'Breakfast',
    hadMeal: true,
    rating: 8,
    taste: 4,
    hygiene: 4,
    quantity: 5,
    ratherHave: 'Pancakes next time',
    howToImprove: 'Make the paratha a bit less oily.',
    comments: 'Really filling and delicious breakfast, loved the curd.',
    timestamp: '2026-05-18T09:15:00.000Z'
  },
  {
    id: 'rev-2',
    studentName: 'Sneha Mehta',
    hostelId: 'G3-C12',
    day: 'Monday',
    mealType: 'Lunch',
    hadMeal: true,
    rating: 5,
    taste: 3,
    hygiene: 3,
    quantity: 4,
    ratherHave: 'Paneer Curry',
    howToImprove: 'The dal was too watery and lacked salt.',
    comments: 'Average lunch today, could have been seasoned better.',
    timestamp: '2026-05-18T13:45:00.000Z'
  },
  {
    id: 'rev-3',
    studentName: 'Aman Verma',
    hostelId: 'H2-B09',
    day: 'Monday',
    mealType: 'Dinner',
    hadMeal: true,
    rating: 9,
    taste: 5,
    hygiene: 4,
    quantity: 4,
    ratherHave: 'Sweeter kheer',
    howToImprove: 'The paneer bhurji was amazing, keep it up!',
    comments: 'Fantastic dinner! Kheer was a nice touch.',
    timestamp: '2026-05-18T20:30:00.000Z'
  },
  {
    id: 'rev-4',
    studentName: 'Priya Iyer',
    hostelId: 'G1-F04',
    day: 'Tuesday',
    mealType: 'Breakfast',
    hadMeal: true,
    rating: 9,
    taste: 5,
    hygiene: 5,
    quantity: 4,
    ratherHave: 'More filter coffee',
    howToImprove: 'Everything was great, the chutney was spicy and fresh.',
    comments: 'Sambar and idli were highly authentic, loved it!',
    timestamp: '2026-05-19T08:30:00.000Z'
  },
  {
    id: 'rev-5',
    studentName: 'Vikram Singh',
    hostelId: 'H3-D24',
    day: 'Tuesday',
    mealType: 'Lunch',
    hadMeal: true,
    rating: 7,
    taste: 4,
    hygiene: 3,
    quantity: 5,
    ratherHave: 'Chana Masala',
    howToImprove: 'Improve washing of plates in the lunch rush.',
    comments: 'Rajma was thick and hot, really hit the spot.',
    timestamp: '2026-05-19T14:10:00.000Z'
  },
  {
    id: 'rev-6',
    studentName: 'Rohan Gupta',
    hostelId: 'H1-E15',
    day: 'Wednesday',
    mealType: 'Breakfast',
    hadMeal: true,
    rating: 8,
    taste: 4,
    hygiene: 4,
    quantity: 4,
    ratherHave: 'Upma',
    howToImprove: 'The jalebis were a bit soggy.',
    comments: 'Poha was light and tasty. Jalebi addition was perfect.',
    timestamp: '2026-05-20T09:00:00.000Z'
  },
  {
    id: 'rev-7',
    studentName: 'Ananya Roy',
    hostelId: 'G2-D11',
    day: 'Wednesday',
    mealType: 'Dinner',
    hadMeal: true,
    rating: 4,
    taste: 2,
    hygiene: 3,
    quantity: 3,
    ratherHave: 'Butter Naan instead of hard roti',
    howToImprove: 'Roti was hard as cardboard. Egg curry had thin gravy.',
    comments: 'Not satisfied with today’s dinner. Hope they improve the rotis.',
    timestamp: '2026-05-20T21:15:00.000Z'
  },
  {
    id: 'rev-8',
    studentName: 'Karthik Rao',
    hostelId: 'H4-C30',
    day: 'Thursday',
    mealType: 'Lunch',
    hadMeal: true,
    rating: 10,
    taste: 5,
    hygiene: 5,
    quantity: 5,
    ratherHave: 'Lassi',
    howToImprove: 'No improvements needed! Absolutely brilliant.',
    comments: 'Chole Bhature was mindblowing! Fluffy bhature and rich raita.',
    timestamp: '2026-05-21T13:20:00.000Z'
  },
  {
    id: 'rev-9',
    studentName: 'Nisha Patil',
    hostelId: 'G3-A02',
    day: 'Thursday',
    mealType: 'Snacks',
    hadMeal: true,
    rating: 7,
    taste: 3,
    hygiene: 4,
    quantity: 4,
    ratherHave: 'Samosa Chat',
    howToImprove: 'Chutney was a bit too sweet.',
    comments: 'Decent snacks, piping hot tea on a rainy evening was great.',
    timestamp: '2026-05-21T17:45:00.000Z'
  }
];

// Seed initial discussions
const initialDiscussions = [
  {
    id: 'disc-1',
    title: 'Proposal: Sunday Special Menu Voting Extension',
    content: 'Can we have more continental or Chinese options in our Sunday special menu poll? It would be great to vote for Fried Rice + Manchurian or Pasta next week instead of just Indian items.',
    author: 'Aman Verma',
    role: 'student',
    tag: 'Menu Suggestion',
    likes: 24,
    likedBy: [],
    commentsCount: 3,
    replies: [
      {
        id: 'rep-1',
        author: 'Jagdish Prasad (Caterer Manager)',
        role: 'caterer',
        content: 'Hi Aman, thank you for the suggestion. We will definitely include Veg Manchurian and Fried Rice as options in next week’s poll! Hope the students vote for it.',
        timestamp: '2026-05-21T11:30:00.000Z'
      },
      {
        id: 'rep-2',
        author: 'Priya Iyer',
        role: 'student',
        content: 'That would be awesome! I would vote for Fried Rice instantly. Thanks, Jagdish uncle!',
        timestamp: '2026-05-21T12:05:00.000Z'
      },
      {
        id: 'rep-3',
        author: 'Karthik Rao',
        role: 'student',
        content: 'Same! Let’s vote for Chinese next week.',
        timestamp: '2026-05-21T14:15:00.000Z'
      }
    ],
    timestamp: '2026-05-21T10:15:00.000Z'
  },
  {
    id: 'disc-2',
    title: 'OFFICIAL ANNOUNCEMENT: Mess Timings Maintenance on Saturday',
    content: 'Please note that Saturday lunch hours will be adjusted slightly due to chemical pest control in the mess kitchen. Timings: 01:00 PM - 03:00 PM. Apologies for any inconvenience.',
    author: 'Jagdish Prasad (Caterer Manager)',
    role: 'caterer',
    tag: 'Announcement',
    likes: 42,
    likedBy: [],
    commentsCount: 2,
    replies: [
      {
        id: 'rep-4',
        author: 'Rahul Sharma',
        role: 'student',
        content: 'Thanks for informing us in advance, team! Good to see regular hygiene maintenance.',
        timestamp: '2026-05-22T09:30:00.000Z'
      },
      {
        id: 'rep-5',
        author: 'Sneha Mehta',
        role: 'student',
        content: 'Got it. Thanks!',
        timestamp: '2026-05-22T10:10:00.000Z'
      }
    ],
    timestamp: '2026-05-22T08:00:00.000Z'
  },
  {
    id: 'disc-3',
    title: 'Issue: Plate cleanliness in the peak hours',
    content: 'Lately during peak lunch hours (01:15 PM - 01:45 PM), the metal plates feel greasy and slightly damp. Please ensure the cleaning staff uses hot water and dries them properly before putting them out.',
    author: 'Sneha Mehta',
    role: 'student',
    tag: 'Hygiene Complaint',
    likes: 18,
    likedBy: [],
    commentsCount: 1,
    replies: [
      {
        id: 'rep-6',
        author: 'Jagdish Prasad (Caterer Manager)',
        role: 'caterer',
        content: 'Hello Sneha, we take hygiene very seriously. I have instructed the kitchen cleaning staff to ensure the hot sterilizer is running continuously and plates are dried completely with clean cloths. Thank you for pointing this out.',
        timestamp: '2026-05-22T15:20:00.000Z'
      }
    ],
    timestamp: '2026-05-22T12:45:00.000Z'
  }
];

// Seed menu poll options
const initialPolls = [
  {
    id: 'poll-1',
    question: "Choose Next Sunday's Special Dinner Item!",
    options: [
      { id: 'opt-1', text: 'Veg Biryani + Paneer Tikka + Gulab Jamun', votes: 45 },
      { id: 'opt-2', text: 'Butter Naan + Paneer Butter Masala + Ice Cream', votes: 62 },
      { id: 'opt-3', text: 'Fried Rice + Veg Manchurian + Brownie', votes: 58 },
      { id: 'opt-4', text: 'Chole Bhature + Lassi + Rabri', votes: 34 }
    ],
    voters: [],
    closed: false
  }
];

const initialUsers = [
  { username: 'Rahul Sharma', role: 'student', hostelOrEmpId: 'H4-A20', fullName: 'Rahul Sharma' },
  { username: 'Sneha Mehta', role: 'student', hostelOrEmpId: 'G3-C12', fullName: 'Sneha Mehta' },
  { username: 'Aman Verma', role: 'student', hostelOrEmpId: 'H2-B09', fullName: 'Aman Verma' },
  { username: 'Priya Iyer', role: 'student', hostelOrEmpId: 'G1-F04', fullName: 'Priya Iyer' },
  { username: 'Vikram Singh', role: 'student', hostelOrEmpId: 'H3-D24', fullName: 'Vikram Singh' }
];

export const AppProvider = ({ children }) => {
  // Database connection state
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mess_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedPortal, setSelectedPortal] = useState(() => {
    return localStorage.getItem('mess_portal') || null;
  });

  // Global State Stores
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('mess_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('mess_menu');
    return saved ? JSON.parse(saved) : initialMenu;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('mess_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [discussions, setDiscussions] = useState(() => {
    const saved = localStorage.getItem('mess_discussions');
    return saved ? JSON.parse(saved) : initialDiscussions;
  });

  const [polls, setPolls] = useState(() => {
    const saved = localStorage.getItem('mess_polls');
    return saved ? JSON.parse(saved) : initialPolls;
  });

  // Notifications Queue
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('mess_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', recipient: 'student', text: 'Welcome to the new digital Mess Portal! Check out the weekly menu.', read: false, time: '2 hours ago' },
      { id: 'notif-2', recipient: 'caterer', text: 'System Update: Review Analytics dashboard has been enabled.', read: false, time: '1 day ago' }
    ];
  });

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mess_theme') || 'dark';
  });

  // Backend sync API base (connects to local server on localhost, and live Render backend in production)
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://mess-management-system.onrender.com/api'; // Replace with your actual Render URL if different!

  // Synchronize with backend database
  const fetchBackendData = async () => {
    try {
      const [menuRes, reviewsRes, discRes, pollsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/menu`),
        fetch(`${API_BASE}/reviews`),
        fetch(`${API_BASE}/discussions`),
        fetch(`${API_BASE}/polls`),
        fetch(`${API_BASE}/users`)
      ]);

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        if (menuData && Object.keys(menuData).length > 0) {
          setMenu(menuData);
        }
      }
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        const formattedReviews = reviewsData.map(r => ({
          id: r._id || r.id,
          ...r
        }));
        setReviews(formattedReviews);
      }
      if (discRes.ok) {
        const discData = await discRes.json();
        const formattedDiscs = discData.map(d => ({
          id: d._id || d.id,
          ...d,
          replies: d.replies ? d.replies.map(rep => ({ id: rep._id || rep.id, ...rep })) : []
        }));
        setDiscussions(formattedDiscs);
      }
      if (pollsRes.ok) {
        const pollsData = await pollsRes.json();
        const formattedPolls = pollsData.map(p => ({
          id: p._id || p.id,
          ...p,
          options: p.options ? p.options.map(opt => ({ id: opt._id || opt.id, ...opt })) : []
        }));
        setPolls(formattedPolls);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      setIsBackendConnected(true);
    } catch (err) {
      console.warn('📡 MongoDB server is offline. Operating in high-performance local fallback.');
      setIsBackendConnected(false);
    }
  };

  // Mount backend connection
  useEffect(() => {
    fetchBackendData();
    // Poll data every 12 seconds to keep multiple clients synchronized
    const interval = setInterval(fetchBackendData, 12000);
    return () => clearInterval(interval);
  }, []);

  // Sync to localStorage as offline safety buffer
  useEffect(() => {
    localStorage.setItem('mess_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mess_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('mess_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('mess_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('mess_polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('mess_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mess_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth Operations
  const login = async (username, password, role) => {
    if (!username || !password) {
      throw new Error('Please supply both username and password.');
    }
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Login session refused.');
      }
      
      const user = await response.json();
      setCurrentUser(user);
      setSelectedPortal(role);
      localStorage.setItem('mess_user', JSON.stringify(user));
      localStorage.setItem('mess_portal', role);
      
      fetchBackendData();
      return user;
    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('NetworkError') || !isBackendConnected) {
        console.warn('⚠️ Server offline. Simulating local credential bypass...');
        const user = {
          username,
          role,
          id: role === 'student' ? 'H1-A01' : 'CAT-01',
          fullName: role === 'student' ? username : `${username} (Caterer Manager)`
        };
        setCurrentUser(user);
        setSelectedPortal(role);
        localStorage.setItem('mess_user', JSON.stringify(user));
        localStorage.setItem('mess_portal', role);
        return user;
      }
      throw err;
    }
  };

  const signup = async (username, password, role, hostelOrEmpId) => {
    if (!username || !password || !hostelOrEmpId) {
      throw new Error('Please fill in all registration fields.');
    }

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role, hostelOrEmpId })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Signup request refused.');
      }

      const user = await response.json();
      setCurrentUser(user);
      setSelectedPortal(role);
      localStorage.setItem('mess_user', JSON.stringify(user));
      localStorage.setItem('mess_portal', role);
      
      fetchBackendData();
      return user;
    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('NetworkError') || !isBackendConnected) {
        console.warn('⚠️ Server offline. Simulating local sandbox registration...');
        const user = {
          username,
          role,
          id: hostelOrEmpId,
          fullName: role === 'student' ? username : `${username} (Caterer)`
        };
        setCurrentUser(user);
        setSelectedPortal(role);
        localStorage.setItem('mess_user', JSON.stringify(user));
        localStorage.setItem('mess_portal', role);
        setUsers(prev => {
          if (!prev.some(u => u.username === username)) {
            const newUserObj = {
              username,
              role,
              hostelOrEmpId,
              fullName: role === 'student' ? username : `${username} (Caterer)`
            };
            return [...prev, newUserObj];
          }
          return prev;
        });
        return user;
      }
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedPortal(null);
    localStorage.removeItem('mess_user');
    localStorage.removeItem('mess_portal');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Student Actions
  const addReview = async (reviewData) => {
    const payload = {
      studentName: currentUser?.fullName || 'Anonymous Student',
      hostelId: currentUser?.id || 'H1-A01',
      day: reviewData.day,
      mealType: reviewData.mealType,
      hadMeal: true,
      rating: reviewData.rating,
      taste: reviewData.taste,
      hygiene: reviewData.hygiene,
      quantity: reviewData.quantity,
      ratherHave: reviewData.ratherHave || '',
      howToImprove: reviewData.howToImprove || '',
      comments: reviewData.comments || ''
    };

    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedReview = await response.json();
        setReviews(prev => [{ id: savedReview._id || savedReview.id, ...savedReview }, ...prev]);
      } else {
        throw new Error('API server rejected review publication.');
      }
    } catch (err) {
      console.warn('⚠️ Backend issue. Storing review locally:', err.message);
      const newReview = {
        id: `rev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...payload
      };
      setReviews(prev => [newReview, ...prev]);
    }

    addNotification('caterer', `New feedback received for ${reviewData.day}'s ${reviewData.mealType} (Rating: ${reviewData.rating}/10)`);
  };

  const addDiscussion = async (title, content, tag) => {
    const payload = {
      title,
      content,
      author: currentUser?.fullName || 'Student',
      role: currentUser?.role || 'student',
      tag: tag || 'General'
    };

    try {
      const response = await fetch(`${API_BASE}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedDisc = await response.json();
        setDiscussions(prev => [{ id: savedDisc._id || savedDisc.id, ...savedDisc, replies: [] }, ...prev]);
      } else {
        throw new Error('API server rejected thread publication.');
      }
    } catch (err) {
      console.warn('⚠️ Backend issue. Posting thread locally:', err.message);
      const newDisc = {
        id: `disc-${Date.now()}`,
        likes: 0,
        likedBy: [],
        commentsCount: 0,
        replies: [],
        timestamp: new Date().toISOString(),
        ...payload
      };
      setDiscussions(prev => [newDisc, ...prev]);
    }
  };

  const addReply = async (discussionId, content) => {
    const payload = {
      author: currentUser?.fullName || 'User',
      role: currentUser?.role || 'student',
      content
    };

    try {
      const response = await fetch(`${API_BASE}/discussions/${discussionId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedDisc = await response.json();
        setDiscussions(prev => prev.map(disc => {
          if (disc.id === discussionId || disc._id === discussionId) {
            return {
              id: updatedDisc._id || updatedDisc.id,
              ...updatedDisc,
              replies: updatedDisc.replies.map(rep => ({ id: rep._id || rep.id, ...rep }))
            };
          }
          return disc;
        }));
      } else {
        throw new Error('API server rejected comment reply publication.');
      }
    } catch (err) {
      console.warn('⚠️ Backend issue. Appending reply locally:', err.message);
      setDiscussions(prev => prev.map(disc => {
        if (disc.id === discussionId) {
          return {
            ...disc,
            commentsCount: disc.commentsCount + 1,
            replies: [
              ...disc.replies,
              {
                id: `rep-${Date.now()}`,
                author: payload.author,
                role: payload.role,
                content,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return disc;
      }));
    }
  };

  const likeDiscussion = async (discussionId) => {
    if (!currentUser) return;
    const username = currentUser.username;

    try {
      const response = await fetch(`${API_BASE}/discussions/${discussionId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        const updatedDisc = await response.json();
        setDiscussions(prev => prev.map(disc => {
          if (disc.id === discussionId || disc._id === discussionId) {
            return {
              id: updatedDisc._id || updatedDisc.id,
              ...updatedDisc,
              replies: updatedDisc.replies.map(rep => ({ id: rep._id || rep.id, ...rep }))
            };
          }
          return disc;
        }));
      } else {
        throw new Error('API server rejected thread like modification.');
      }
    } catch (err) {
      console.warn('⚠️ Backend issue. Toggling like locally:', err.message);
      setDiscussions(prev => prev.map(disc => {
        if (disc.id === discussionId) {
          const hasLiked = disc.likedBy.includes(username);
          return {
            ...disc,
            likes: hasLiked ? disc.likes - 1 : disc.likes + 1,
            likedBy: hasLiked ? disc.likedBy.filter(id => id !== username) : [...disc.likedBy, username]
          };
        }
        return disc;
      }));
    }
  };

  const voteInPoll = async (pollId, optionId) => {
    if (!currentUser) return;
    const voterId = currentUser.id;

    try {
      const response = await fetch(`${API_BASE}/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId, voterId })
      });

      if (response.ok) {
        const updatedPoll = await response.json();
        setPolls(prev => prev.map(poll => {
          if (poll.id === pollId || poll._id === pollId) {
            return {
              id: updatedPoll._id || updatedPoll.id,
              ...updatedPoll,
              options: updatedPoll.options.map(opt => ({ id: opt._id || opt.id, ...opt }))
            };
          }
          return poll;
        }));
      } else {
        const errData = await response.json();
        throw new Error(errData.error || 'API server rejected vote.');
      }
    } catch (err) {
      console.warn('⚠️ Backend issue. Casting vote locally:', err.message);
      setPolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          if (poll.voters.includes(voterId)) return poll;
          return {
            ...poll,
            voters: [...poll.voters, voterId],
            options: poll.options.map(opt => {
              if (opt.id === optionId) {
                return { ...opt, votes: opt.votes + 1 };
              }
              return opt;
            })
          };
        }
        return poll;
      }));
    }
  };

  // Caterer Actions
  const updateMenuMeal = async (day, mealType, items, time) => {
    try {
      const response = await fetch(`${API_BASE}/menu`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, mealType, items, time })
      });

      if (response.ok) {
        setMenu(prev => {
          const updated = { ...prev };
          updated[day] = {
            ...updated[day],
            [mealType]: { items, time }
          };
          return updated;
        });
      } else {
        throw new Error('API server rejected menu update.');
      }
    } catch (err) {
      console.warn('⚠️ Backend issue. Storing menu update locally:', err.message);
      setMenu(prev => {
        const updated = { ...prev };
        updated[day] = {
          ...updated[day],
          [mealType]: { items, time }
        };
        return updated;
      });
    }

    addNotification('student', `Menu Update: ${day}'s ${mealType} has been changed to "${items}"`);
  };

  // Common Actions
  const addNotification = (recipient, text) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      recipient,
      text,
      read: false,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = (role) => {
    setNotifications(prev => prev.map(n => n.recipient === role ? { ...n, read: true } : n));
  };

  const clearNotifications = (role) => {
    setNotifications(prev => prev.filter(n => n.recipient !== role));
  };

  return (
    <AppContext.Provider
      value={{
        isBackendConnected,
        currentUser,
        selectedPortal,
        setSelectedPortal,
        menu,
        reviews,
        discussions,
        polls,
        notifications,
        theme,
        users,
        login,
        signup,
        logout,
        toggleTheme,
        addReview,
        addDiscussion,
        addReply,
        likeDiscussion,
        voteInPoll,
        updateMenuMeal,
        markNotificationsAsRead,
        clearNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

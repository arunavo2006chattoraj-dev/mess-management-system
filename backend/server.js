require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Database Models
const User = require('./models/User');
const Menu = require('./models/Menu');
const Review = require('./models/Review');
const Discussion = require('./models/Discussion');
const Poll = require('./models/Poll');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Middlewares
app.use(cors());
app.use(express.json());

// Check and establish MongoDB database connection
const mongoUri = process.env.MONGODB_URI;

console.log('Initiating database connection to:', mongoUri.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✓ Successfully connected to MongoDB Database!');
    await seedDatabaseIfNeeded();
  })
  .catch((err) => {
    console.error('✗ MongoDB Atlas connection failed:', err.message);
    console.log('👉 Attempting fallback to local MongoDB instance: mongodb://127.0.0.1:27017/mess_db');
    
    mongoose.connect('mongodb://127.0.0.1:27017/mess_db')
      .then(async () => {
        console.log('✓ Connected successfully to local fallback MongoDB instance!');
        await seedDatabaseIfNeeded();
      })
      .catch((localErr) => {
        console.error('✗ Local MongoDB fallback failed too:', localErr.message);
        console.log('⚠️ Server will operate in API mock state. Please verify your MongoDB service status.');
      });
  });

// --- HELPER DUMMY DATA SEEDER & MOCK DATABASE IN-MEMORY TABLES ---

const initialMenuData = [
  {
    day: 'Monday',
    Breakfast: { items: 'Aloo Paratha, Curd, Pickle, Tea/Coffee', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Dal Tadka, Mix Veg Sabzi, Roti, Rice, Salad', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Samosa, Mint Chutney, Hot Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Paneer Bhurji, Chana Masala, Roti, Rice, Kheer', time: '07:30 PM - 09:30 PM' }
  },
  {
    day: 'Tuesday',
    Breakfast: { items: 'Idli, Sambhar, Coconut Chutney, Milk/Tea', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Rajma Masala, Aloo Gobi, Roti, Jeera Rice, Curd', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Veg Cutlet, Tomato Ketchup, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Chicken Curry (or Matar Paneer), Yellow Dal, Roti, Rice', time: '07:30 PM - 09:30 PM' }
  },
  {
    day: 'Wednesday',
    Breakfast: { items: 'Poha with Sev, Jalebi, Sprouts, Tea/Coffee', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Kadi Pakoda, Bhindi Fry, Roti, Rice, Papad', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Kachori, Sweet Chutney, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Egg Curry (or Dum Aloo), Dal Makhani, Roti, Rice, Ice Cream', time: '07:30 PM - 09:30 PM' }
  },
  {
    day: 'Thursday',
    Breakfast: { items: 'Veg Sandwich, Boiled Eggs, Fruit Bowl, Tea/Milk', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Chole Bhature, Boondi Raita, Onion Salad', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Aloo Bonda, Green Chutney, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Veg Kofta, Dal Fry, Roti, Rice, Gulab Jamun', time: '07:30 PM - 09:30 PM' }
  },
  {
    day: 'Friday',
    Breakfast: { items: 'Uttapam, Tomato Onion Chutney, Sambhar, Tea/Milk', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Lauki Kofta, Black Chana Dal, Roti, Rice, Buttermilk', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Bread Pakoda, Sauce, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Butter Paneer, Dal Tadka, Garlic Naan/Roti, Rice, Custard', time: '07:30 PM - 09:30 PM' }
  },
  {
    day: 'Saturday',
    Breakfast: { items: 'Puri Sabzi, Halwa, Tea/Coffee', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Veg Biryani, Salan, Veg Raita, Chips', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Pav Bhaji, Hot Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Kadai Mushroom, Dal Fry, Roti, Rice, Sewai', time: '07:30 PM - 09:30 PM' }
  },
  {
    day: 'Sunday',
    Breakfast: { items: 'Bread Butter/Jam, Omelette, Tea/Coffee', time: '07:30 AM - 09:30 AM' },
    Lunch: { items: 'Shahi Paneer (or Butter Chicken), Jeera Rice, Butter Naan, Salad', time: '12:30 PM - 02:30 PM' },
    Snacks: { items: 'Dhokla, Green Chillies, Tea', time: '05:00 PM - 06:00 PM' },
    Dinner: { items: 'Special Veg Pulao, Dal Makhani, Tandoori Roti, Rasgulla', time: '07:30 PM - 09:30 PM' }
  }
];

const initialReviewsData = [
  {
    studentName: 'Rahul Sharma',
    hostelId: 'H4-A20',
    day: 'Monday',
    mealType: 'Breakfast',
    rating: 8,
    taste: 4,
    hygiene: 4,
    quantity: 5,
    ratherHave: 'Pancakes next time',
    howToImprove: 'Make the paratha a bit less oily.',
    comments: 'Really filling and delicious breakfast, loved the curd.'
  },
  {
    studentName: 'Sneha Mehta',
    hostelId: 'G3-C12',
    day: 'Monday',
    mealType: 'Lunch',
    rating: 5,
    taste: 3,
    hygiene: 3,
    quantity: 4,
    ratherHave: 'Paneer Curry',
    howToImprove: 'The dal was too watery and lacked salt.',
    comments: 'Average lunch today, could have been seasoned better.'
  },
  {
    studentName: 'Aman Verma',
    hostelId: 'H2-B09',
    day: 'Monday',
    mealType: 'Dinner',
    rating: 9,
    taste: 5,
    hygiene: 4,
    quantity: 4,
    ratherHave: 'Sweeter kheer',
    howToImprove: 'The paneer bhurji was amazing, keep it up!',
    comments: 'Fantastic dinner! Kheer was a nice touch.'
  },
  {
    studentName: 'Priya Iyer',
    hostelId: 'G1-F04',
    day: 'Tuesday',
    mealType: 'Breakfast',
    rating: 9,
    taste: 5,
    hygiene: 5,
    quantity: 4,
    ratherHave: 'More filter coffee',
    howToImprove: 'Everything was great, the chutney was spicy and fresh.',
    comments: 'Sambar and idli were highly authentic, loved it!'
  }
];

const initialDiscussionsData = [
  {
    title: 'Proposal: Sunday Special Menu Voting Extension',
    content: 'Can we have more continental or Chinese options in our Sunday special menu poll? It would be great to vote for Fried Rice + Manchurian or Pasta next week instead of just Indian items.',
    author: 'Aman Verma',
    role: 'student',
    tag: 'Menu Suggestion',
    likes: 24,
    replies: [
      {
        author: 'Jagdish Prasad (Caterer Manager)',
        role: 'caterer',
        content: 'Hi Aman, thank you for the suggestion. We will definitely include Veg Manchurian and Fried Rice as options in next week’s poll! Hope the students vote for it.'
      },
      {
        author: 'Priya Iyer',
        role: 'student',
        content: 'That would be awesome! I would vote for Fried Rice instantly. Thanks, Jagdish uncle!'
      }
    ]
  },
  {
    title: 'OFFICIAL ANNOUNCEMENT: Mess Timings Maintenance on Saturday',
    content: 'Please note that Saturday lunch hours will be adjusted slightly due to chemical pest control in the mess kitchen. Timings: 01:00 PM - 03:00 PM. Apologies for any inconvenience.',
    author: 'Jagdish Prasad (Caterer Manager)',
    role: 'caterer',
    tag: 'Announcement',
    likes: 42,
    replies: [
      {
        author: 'Rahul Sharma',
        role: 'student',
        content: 'Thanks for informing us in advance, team! Good to see regular hygiene maintenance.'
      }
    ]
  }
];

const initialPollsData = [
  {
    question: "Choose Next Sunday's Special Dinner Item!",
    options: [
      { text: 'Veg Biryani + Paneer Tikka + Gulab Jamun', votes: 45 },
      { text: 'Butter Naan + Paneer Butter Masala + Ice Cream', votes: 62 },
      { text: 'Fried Rice + Veg Manchurian + Brownie', votes: 58 },
      { text: 'Chole Bhature + Lassi + Rabri', votes: 34 }
    ],
    closed: false
  }
];

// Local Memory Database cache for offline state
let memoryUsers = [
  { username: 'Rahul Sharma', password: 'password123', role: 'student', hostelOrEmpId: 'H4-A20', fullName: 'Rahul Sharma' },
  { username: 'Sneha Mehta', password: 'password123', role: 'student', hostelOrEmpId: 'G3-C12', fullName: 'Sneha Mehta' },
  { username: 'Aman Verma', password: 'password123', role: 'student', hostelOrEmpId: 'H2-B09', fullName: 'Aman Verma' },
  { username: 'Priya Iyer', password: 'password123', role: 'student', hostelOrEmpId: 'G1-F04', fullName: 'Priya Iyer' },
  { username: 'Vikram Singh', password: 'password123', role: 'student', hostelOrEmpId: 'H3-D24', fullName: 'Vikram Singh' }
];
let memoryMenus = JSON.parse(JSON.stringify(initialMenuData));
let memoryReviews = JSON.parse(JSON.stringify(initialReviewsData));
let memoryDiscussions = JSON.parse(JSON.stringify(initialDiscussionsData));
let memoryPolls = JSON.parse(JSON.stringify(initialPollsData));

// Setup unique _id and id fields for local memory structures
memoryMenus.forEach((m, idx) => {
  m._id = `mem-menu-${idx}`;
  m.id = `mem-menu-${idx}`;
});

memoryReviews.forEach((r, idx) => {
  r._id = `mem-rev-${idx}`;
  r.id = `mem-rev-${idx}`;
  r.timestamp = new Date(Date.now() - idx * 3600000).toISOString();
});

memoryDiscussions.forEach((d, idx) => {
  d._id = `mem-disc-${idx}`;
  d.id = `mem-disc-${idx}`;
  d.likedBy = [];
  d.commentsCount = d.replies.length;
  d.timestamp = new Date(Date.now() - idx * 7200000).toISOString();
  if (d.replies) {
    d.replies.forEach((rep, repIdx) => {
      rep._id = `mem-rep-${idx}-${repIdx}`;
      rep.id = `mem-rep-${idx}-${repIdx}`;
      rep.timestamp = new Date().toISOString();
    });
  }
});

memoryPolls.forEach((p, idx) => {
  p._id = `mem-poll-${idx}`;
  p.id = `mem-poll-${idx}`;
  p.voters = [];
  p.options.forEach((opt, optIdx) => {
    opt._id = `mem-opt-${idx}-${optIdx}`;
    opt.id = `mem-opt-${idx}-${optIdx}`;
  });
});

async function seedDatabaseIfNeeded() {
  try {
    // 1. Seed Menus
    const menuCount = await Menu.countDocuments();
    if (menuCount === 0) {
      console.log('🌱 Database is empty. Seeding initial weekly menus...');
      await Menu.insertMany(initialMenuData);
      console.log('🌱 Menus seeded successfully!');
    }

    // 2. Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('🌱 Seeding initial student reviews...');
      await Review.insertMany(initialReviewsData);
      console.log('🌱 Reviews seeded successfully!');
    }

    // 3. Seed Discussions
    const discCount = await Discussion.countDocuments();
    if (discCount === 0) {
      console.log('🌱 Seeding initial discussion board threads...');
      await Discussion.insertMany(initialDiscussionsData);
      console.log('🌱 Discussions seeded successfully!');
    }

    // 4. Seed Polls
    const pollCount = await Poll.countDocuments();
    if (pollCount === 0) {
      console.log('🌱 Seeding weekly dining poll...');
      await Poll.insertMany(initialPollsData);
      console.log('🌱 Polls seeded successfully!');
    }

    // 5. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial mock students in MongoDB...');
      const seedUsers = [
        { username: 'Rahul Sharma', password: 'password123', role: 'student', hostelOrEmpId: 'H4-A20' },
        { username: 'Sneha Mehta', password: 'password123', role: 'student', hostelOrEmpId: 'G3-C12' },
        { username: 'Aman Verma', password: 'password123', role: 'student', hostelOrEmpId: 'H2-B09' },
        { username: 'Priya Iyer', password: 'password123', role: 'student', hostelOrEmpId: 'G1-F04' },
        { username: 'Vikram Singh', password: 'password123', role: 'student', hostelOrEmpId: 'H3-D24' }
      ];
      for (const u of seedUsers) {
        const newUser = new User(u);
        await newUser.save();
      }
      console.log('🌱 Mock student accounts seeded successfully!');
    }
  } catch (err) {
    console.error('Seeding database failed:', err);
  }
}

// --- SECURE AUTHENTICATION ENDPOINTS ---

app.post('/api/auth/signup', async (appReq, appRes) => {
  try {
    const { username, password, role, hostelOrEmpId } = appReq.body;
    if (!username || !password || !hostelOrEmpId) {
      return appRes.status(400).json({ error: 'Please supply all credentials.' });
    }

    if (mongoose.connection.readyState === 1) {
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return appRes.status(400).json({ error: 'Username already registered.' });
      }

      // Create user
      const newUser = new User({ username, password, role, hostelOrEmpId });
      await newUser.save();

      appRes.status(201).json({
        username: newUser.username,
        role: newUser.role,
        id: newUser.hostelOrEmpId,
        fullName: newUser.role === 'student' ? newUser.username : `${newUser.username} (Caterer)`
      });
    } else {
      console.log('📡 [Memory DB] Registering user in local memory cache.');
      const existing = memoryUsers.find(u => u.username === username);
      if (existing) {
        return appRes.status(400).json({ error: 'Username already registered.' });
      }
      const newUser = {
        username,
        password,
        role,
        hostelOrEmpId,
        fullName: role === 'student' ? username : `${username} (Caterer)`
      };
      memoryUsers.push(newUser);
      appRes.status(201).json({
        username: newUser.username,
        role: newUser.role,
        id: newUser.hostelOrEmpId,
        fullName: newUser.fullName
      });
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (appReq, appRes) => {
  try {
    const { username, password, role } = appReq.body;
    if (!username || !password) {
      return appRes.status(400).json({ error: 'Username and password required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ username, role });
      if (!user) {
        return appRes.status(400).json({ error: 'Account not found with this name.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return appRes.status(400).json({ error: 'Incorrect security password.' });
      }

      appRes.json({
        username: user.username,
        role: user.role,
        id: user.hostelOrEmpId,
        fullName: user.role === 'student' ? user.username : `${user.username} (Caterer Manager)`
      });
    } else {
      console.log('📡 [Memory DB] Authenticating user in local memory cache.');
      const user = memoryUsers.find(u => u.username === username && u.role === role);
      if (!user) {
        // Mock default sandbox admin login for developer bypass if memory DB is empty
        if (username === 'Jagdish' && password === 'mess123') {
          return appRes.json({
            username: 'Jagdish',
            role: 'caterer',
            id: 'CAT-01',
            fullName: 'Jagdish Prasad (Caterer Manager)'
          });
        }
        // General bypass login
        const mockUser = {
          username,
          role,
          id: role === 'student' ? 'H1-A01' : 'CAT-01',
          fullName: role === 'student' ? username : `${username} (Caterer Manager)`
        };
        return appRes.json(mockUser);
      }
      if (user.password !== password) {
        return appRes.status(400).json({ error: 'Incorrect security password.' });
      }
      appRes.json({
        username: user.username,
        role: user.role,
        id: user.hostelOrEmpId,
        fullName: user.role === 'student' ? user.username : `${user.username} (Caterer Manager)`
      });
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

// --- USER DIRECTORY APIS ---

app.get('/api/users', async (appReq, appRes) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Fetch all users and exclude their password field
      const users = await User.find({}, '-password');
      appRes.json(users);
    } else {
      console.log('📡 [Memory DB] Serving registered users directory from local memory cache.');
      // Map memory users without exposing passwords
      const safeUsers = memoryUsers.map(u => ({
        username: u.username,
        role: u.role,
        hostelOrEmpId: u.hostelOrEmpId,
        fullName: u.fullName
      }));
      appRes.json(safeUsers);
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

// --- MENU APIS ---

app.get('/api/menu', async (appReq, appRes) => {
  try {
    let menus;
    if (mongoose.connection.readyState === 1) {
      menus = await Menu.find({});
    } else {
      console.log('📡 [Memory DB] Serving menu from local memory cache.');
      menus = memoryMenus;
    }

    // Convert array to Day-keyed object
    const menuObj = {};
    menus.forEach(m => {
      menuObj[m.day] = {
        Breakfast: m.Breakfast,
        Lunch: m.Lunch,
        Snacks: m.Snacks,
        Dinner: m.Dinner
      };
    });
    appRes.json(menuObj);
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

app.put('/api/menu', async (appReq, appRes) => {
  try {
    const { day, mealType, items, time } = appReq.body;
    if (!day || !mealType) {
      return appRes.status(400).json({ error: 'Missing day or meal specifications.' });
    }

    if (mongoose.connection.readyState === 1) {
      const updatedMenu = await Menu.findOne({ day });
      if (!updatedMenu) {
        return appRes.status(404).json({ error: 'Day menu not found.' });
      }

      updatedMenu[mealType] = { items, time };
      await updatedMenu.save();

      appRes.json({ success: true, menu: updatedMenu });
    } else {
      console.log('📡 [Memory DB] Updating menu in local memory cache.');
      const menuDay = memoryMenus.find(m => m.day === day);
      if (!menuDay) {
        return appRes.status(404).json({ error: 'Day menu not found.' });
      }
      menuDay[mealType] = { items, time };
      appRes.json({ success: true, menu: menuDay });
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

// --- REVIEWS APIS ---

app.get('/api/reviews', async (appReq, appRes) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find({}).sort({ timestamp: -1 });
      appRes.json(reviews);
    } else {
      console.log('📡 [Memory DB] Serving reviews from local memory cache.');
      const sortedReviews = [...memoryReviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      appRes.json(sortedReviews);
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (appReq, appRes) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newReview = new Review(appReq.body);
      await newReview.save();
      appRes.status(201).json(newReview);
    } else {
      console.log('📡 [Memory DB] Recording review in local memory cache.');
      const newReview = {
        _id: 'mem-rev-' + Date.now(),
        id: 'mem-rev-' + Date.now(),
        timestamp: new Date().toISOString(),
        ...appReq.body
      };
      memoryReviews.push(newReview);
      appRes.status(201).json(newReview);
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

// --- FORUM DISCUSSIONS APIS ---

app.get('/api/discussions', async (appReq, appRes) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const discussions = await Discussion.find({}).sort({ timestamp: -1 });
      appRes.json(discussions);
    } else {
      console.log('📡 [Memory DB] Serving discussions from local memory cache.');
      const sortedDiscussions = [...memoryDiscussions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      appRes.json(sortedDiscussions);
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

app.post('/api/discussions', async (appReq, appRes) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newDisc = new Discussion(appReq.body);
      await newDisc.save();
      appRes.status(201).json(newDisc);
    } else {
      console.log('📡 [Memory DB] Creating thread in local memory cache.');
      const newDisc = {
        _id: 'mem-disc-' + Date.now(),
        id: 'mem-disc-' + Date.now(),
        likes: 0,
        likedBy: [],
        commentsCount: 0,
        replies: [],
        timestamp: new Date().toISOString(),
        ...appReq.body
      };
      memoryDiscussions.push(newDisc);
      appRes.status(201).json(newDisc);
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

app.post('/api/discussions/:id/reply', async (appReq, appRes) => {
  try {
    const { id } = appReq.params;
    const { author, role, content } = appReq.body;

    if (mongoose.connection.readyState === 1) {
      const disc = await Discussion.findById(id);
      if (!disc) {
        return appRes.status(404).json({ error: 'Thread not found.' });
      }

      disc.replies.push({ author, role, content });
      disc.commentsCount = disc.replies.length;
      await disc.save();

      appRes.status(201).json(disc);
    } else {
      console.log('📡 [Memory DB] Adding reply in local memory cache.');
      const disc = memoryDiscussions.find(d => d._id === id || d.id === id);
      if (!disc) {
        return appRes.status(404).json({ error: 'Thread not found.' });
      }
      const newReply = {
        _id: 'mem-rep-' + Date.now(),
        id: 'mem-rep-' + Date.now(),
        author,
        role,
        content,
        timestamp: new Date().toISOString()
      };
      disc.replies.push(newReply);
      disc.commentsCount = disc.replies.length;
      appRes.status(201).json(disc);
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

app.post('/api/discussions/:id/like', async (appReq, appRes) => {
  try {
    const { id } = appReq.params;
    const { username } = appReq.body;

    if (mongoose.connection.readyState === 1) {
      const disc = await Discussion.findById(id);
      if (!disc) {
        return appRes.status(404).json({ error: 'Discussion not found.' });
      }

      const hasLiked = disc.likedBy.includes(username);
      if (hasLiked) {
        disc.likedBy = disc.likedBy.filter(u => u !== username);
        disc.likes = disc.likes - 1;
      } else {
        disc.likedBy.push(username);
        disc.likes = disc.likes + 1;
      }

      await disc.save();
      appRes.json(disc);
    } else {
      console.log('📡 [Memory DB] Toggling like in local memory cache.');
      const disc = memoryDiscussions.find(d => d._id === id || d.id === id);
      if (!disc) {
        return appRes.status(404).json({ error: 'Discussion not found.' });
      }
      const hasLiked = disc.likedBy.includes(username);
      if (hasLiked) {
        disc.likedBy = disc.likedBy.filter(u => u !== username);
        disc.likes = disc.likes - 1;
      } else {
        disc.likedBy.push(username);
        disc.likes = disc.likes + 1;
      }
      appRes.json(disc);
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

// --- POLLS APIS ---

app.get('/api/polls', async (appReq, appRes) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const polls = await Poll.find({});
      appRes.json(polls);
    } else {
      console.log('📡 [Memory DB] Serving polls from local memory cache.');
      appRes.json(memoryPolls);
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

app.post('/api/polls/:id/vote', async (appReq, appRes) => {
  try {
    const { id } = appReq.params;
    const { optionId, voterId } = appReq.body;

    if (mongoose.connection.readyState === 1) {
      const poll = await Poll.findById(id);
      if (!poll) {
        return appRes.status(404).json({ error: 'Ballot not found.' });
      }

      if (poll.voters.includes(voterId)) {
        return appRes.status(400).json({ error: 'Voter has already cast a vote.' });
      }

      const option = poll.options.id(optionId);
      if (!option) {
        return appRes.status(404).json({ error: 'Poll option not found.' });
      }

      option.votes += 1;
      poll.voters.push(voterId);
      await poll.save();

      appRes.json(poll);
    } else {
      console.log('📡 [Memory DB] Casting vote in local memory cache.');
      const poll = memoryPolls.find(p => p._id === id || p.id === id);
      if (!poll) {
        return appRes.status(404).json({ error: 'Ballot not found.' });
      }
      if (poll.voters.includes(voterId)) {
        return appRes.status(400).json({ error: 'Voter has already cast a vote.' });
      }
      const option = poll.options.find(o => o._id === optionId || o.id === optionId);
      if (!option) {
        return appRes.status(404).json({ error: 'Poll option not found.' });
      }
      option.votes += 1;
      poll.voters.push(voterId);
      appRes.json(poll);
    }
  } catch (err) {
    appRes.status(500).json({ error: err.message });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`📡 Co-Mess Express server is broadcasting live on port ${PORT}!`);
});

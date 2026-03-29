const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const users = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123'
  },
  {
    name: 'Jane Doe',
    email: 'jane@test.com',
    password: 'password123'
  }
];

const categories = ['Music', 'Tech', 'Sports', 'Food', 'Art', 'Networking'];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    await User.deleteMany();
    await Event.deleteMany();

    const createdUsers = [];
    for (const u of users) {
      const user = new User(u);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(u.password, salt);
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }
    console.log('Users seeded');

    const events = [];
    for (let i = 1; i <= 10; i++) {
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);

      events.push({
        title: `Community Event ${i}`,
        description: `This is the description for community event ${i}. It will be an amazing gathering.`,
        category: randomCat,
        date: futureDate,
        location: {
          city: 'Sample City',
          address: `${100 + i} Main St`
        },
        bannerImage: `https://picsum.photos/seed/${i * 10}/800/400`,
        maxAttendees: Math.floor(Math.random() * 50) + 10,
        createdBy: randomUser._id
      });
    }

    await Event.insertMany(events);
    console.log('Events seeded');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();

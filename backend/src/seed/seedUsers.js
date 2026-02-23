require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectToDB = require('../db/db');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await connectToDB();

    const adminEmail = 'admin@gamefy.com';
    const userEmail = 'user@gamefy.com';

    const existingAdmin = await User.findOne({ email: adminEmail });
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('Admin12345!', 10);

      await User.create({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        username: 'GameFyAdmin'
      });

      console.log('Admin user created');
    } else {
      console.log('Admin already exists');
    }

    if (!existingUser) {
      const userPassword = await bcrypt.hash('User12345!', 10);

      await User.create({
        email: userEmail,
        password: userPassword,
        role: 'user',
        username: 'GameFyUser'
      });

      console.log('Normal user created');
    } else {
      console.log('User already exists');
    }

    console.log('Seed completed successfully');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedUsers();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');

const createAdmin = async () => {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@estatehub.com';
  const password = args[1] || 'admin123';
  const name = args[2] || 'System Administrator';

  try {
    await connectDB();

    let user = await User.findOne({ email }).select('+password');

    if (user) {
      user.name = name;
      user.password = password;
      user.role = 'admin';
      await user.save();
      console.log(`✅ Admin user '${email}' password updated successfully!`);
    } else {
      user = await User.create({
        name,
        email,
        password,
        role: 'admin',
      });
      console.log(`🎉 New Admin user '${email}' created successfully!`);
    }

    console.log('--------------------------------------------------');
    console.log(`👑 Email:    ${user.email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🛡️ Role:     ${user.role}`);
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating Admin:', err.message);
    process.exit(1);
  }
};

createAdmin();

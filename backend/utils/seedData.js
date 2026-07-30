const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Favorite = require('../models/Favorite');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Inquiry.deleteMany({});
    await Favorite.deleteMany({});

    console.log('Creating demo users...');

    const adminUser = await User.create({
      name: 'Eleanor Vance (Admin)',
      email: 'admin@estatehub.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98640 12345',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    });

    const ownerUser = await User.create({
      name: 'Bishal Sharma (Property Owner)',
      email: 'owner@estatehub.com',
      password: 'owner123',
      role: 'owner',
      phone: '+91 94350 98765',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    });

    const buyerUser = await User.create({
      name: 'Priya Kalita (Buyer/Tenant)',
      email: 'user@estatehub.com',
      password: 'user123',
      role: 'user',
      phone: '+91 88110 54321',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    });

    console.log('Creating authentic Guwahati, Assam real estate listings...');

    const sampleProperties = [
      {
        title: 'Skyline Premium 3BHK Luxury Flat in GS Road',
        description: 'Spacious 3BHK luxury apartment located right on main GS Road, Christian Basti, Guwahati. Situated opposite The Hub Mall and walking distance to Rajiv Bhawan. Features modular kitchen, 100% DG power backup, OTIS high-speed elevators, 24/7 security with CCTV, covered basement car parking, and gym.',
        price: 8500000, // ₹85 Lakhs
        propertyType: 'sale',
        category: 'apartment',
        location: {
          address: 'Flat 4B, Royal Enclave, GS Road, Opposite The Hub Mall, Christian Basti',
          city: 'Guwahati',
          state: 'Assam',
          zipcode: '781005',
        },
        bedrooms: 3,
        bathrooms: 2,
        areaSqFt: 1650,
        amenities: ['Elevator', 'Power Backup', '24/7 Security', 'Covered Parking', 'Gym', 'High Speed Wifi', 'CCTV Surveillance'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
        ],
        status: 'approved',
        owner: ownerUser._id,
        featured: true,
        views: 240,
      },
      {
        title: 'Modern Independent Bungalow in Zoo Road',
        description: 'Exclusive 4BHK independent duplex bungalow in quiet residential pocket near Assam State Zoo, Zoo Road, Guwahati. Features private garden lawn, spacious wrap-around balcony, servant quarters, modular teakwood fittings, and rainwater harvesting system.',
        price: 18500000, // ₹1.85 Cr
        propertyType: 'sale',
        category: 'house',
        location: {
          address: 'House No. 18, Zoo Narengi Road, Near Assam State Zoo Gate, Geetanagar',
          city: 'Guwahati',
          state: 'Assam',
          zipcode: '781024',
        },
        bedrooms: 4,
        bathrooms: 4,
        areaSqFt: 3200,
        amenities: ['Private Garden', 'Balcony', 'Gated Security', 'Garage', 'Water Storage', 'Solar Panel'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        ],
        status: 'approved',
        owner: ownerUser._id,
        featured: true,
        views: 180,
      },
      {
        title: 'Spacious 2BHK Furnished Flat in Ganeshguri',
        description: 'Fully furnished 2BHK rental flat near Ganeshguri flyover junction, Guwahati. Located behind Apollo Hospital and walking distance to Dispur Supermarket. Fully equipped with AC, geyser, sofa, bed set, refrigerator, and covered parking.',
        price: 25000, // ₹25,000/mo
        propertyType: 'rent',
        category: 'apartment',
        location: {
          address: 'Apartment 2A, Green View Heights, Dispur Road, Near Apollo Clinic, Ganeshguri',
          city: 'Guwahati',
          state: 'Assam',
          zipcode: '781006',
        },
        bedrooms: 2,
        bathrooms: 2,
        areaSqFt: 1100,
        amenities: ['Fully Furnished', 'AC', 'Geyser', 'Security Guard', 'Water Supply 24/7', 'Parking'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
        ],
        status: 'approved',
        owner: adminUser._id,
        featured: true,
        views: 310,
      },
      {
        title: 'Prime Commercial Office Suite in Christian Basti',
        description: 'Ready-to-occupy commercial office space on 3rd floor of Corporate Tower, GS Road, Christian Basti, Guwahati. Ideal for IT companies, banks, coaching institutes, or diagnostic labs. Features central AC, glass facade frontage, and high-speed fiber internet.',
        price: 65000, // ₹65,000/mo
        propertyType: 'rent',
        category: 'commercial',
        location: {
          address: '3rd Floor, Commercial Tower, GS Road, Opposite Post Office, Christian Basti',
          city: 'Guwahati',
          state: 'Assam',
          zipcode: '781005',
        },
        bedrooms: 0,
        bathrooms: 2,
        areaSqFt: 2400,
        amenities: ['Central AC', 'Elevator', '24/7 Security', 'Power Backup', 'Fiber Internet', 'Visitor Parking'],
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
        ],
        status: 'approved',
        owner: ownerUser._id,
        featured: false,
        views: 145,
      },
      {
        title: 'Luxury Riverview Duplex Villa in Jalukbari',
        description: 'Serene luxury villa with panoramic views of the Brahmaputra River near Gauhati University Campus, Jalukbari, Guwahati. Features manicured lawn garden, duplex architectural layout, Italian marble flooring, and smart home automation.',
        price: 24000000, // ₹2.40 Cr
        propertyType: 'sale',
        category: 'villa',
        location: {
          address: 'Plot 5, Brahmaputra Riverfront Estate, Near GU Third Gate, Jalukbari',
          city: 'Guwahati',
          state: 'Assam',
          zipcode: '781014',
        },
        bedrooms: 5,
        bathrooms: 5,
        areaSqFt: 4500,
        amenities: ['River View', 'Private Garden', 'Smart Lock', 'Car Garage', 'Terrace Garden'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
        ],
        status: 'approved',
        owner: ownerUser._id,
        featured: false,
        views: 195,
      },
      {
        title: 'Affordable 2BHK Residential Flat in Beltola',
        description: 'Budget-friendly 2BHK flat located in Lakhimi Nagar, Beltola Tiniali, Guwahati. Conveniently close to Beltola Sunday Market, Shankardev Nethralaya, and National Highway 37 bypass.',
        price: 4800000, // ₹48 Lakhs
        propertyType: 'sale',
        category: 'apartment',
        location: {
          address: 'Flat 3C, Lakhimi Enclave, Beltola Tiniali Road, Near Sankardev Nethralaya',
          city: 'Guwahati',
          state: 'Assam',
          zipcode: '781028',
        },
        bedrooms: 2,
        bathrooms: 2,
        areaSqFt: 980,
        amenities: ['Elevator', 'Security Guard', '24/7 Water', 'Car Parking'],
        images: [
          'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
        ],
        status: 'approved',
        owner: ownerUser._id,
        featured: false,
        views: 110,
      },
      {
        title: 'Modern 3BHK Flat near Downtown Dispur Capital',
        description: 'Well-appointed 3BHK flat near Secretariat Complex, Dispur, Guwahati. Close to Assam State Assembly, Down Town Hospital, and Last Gate. Excellent transport connectivity and peace of mind.',
        price: 7200000, // ₹72 Lakhs
        propertyType: 'sale',
        category: 'apartment',
        location: {
          address: 'House 12, Capitol Heights, Last Gate, Near Secretariat Complex, Dispur',
          city: 'Guwahati',
          state: 'Assam',
          zipcode: '781006',
        },
        bedrooms: 3,
        bathrooms: 2,
        areaSqFt: 1450,
        amenities: ['Power Backup', 'Elevator', '24/7 Security', 'Covered Parking', 'Intercom'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        ],
        status: 'approved',
        owner: ownerUser._id,
        featured: false,
        views: 160,
      },
    ];

    const insertedProperties = await Property.insertMany(sampleProperties);

    console.log('Creating demo inquiries...');
    await Inquiry.create({
      property: insertedProperties[0]._id,
      sender: buyerUser._id,
      owner: ownerUser._id,
      name: buyerUser.name,
      email: buyerUser.email,
      phone: buyerUser.phone,
      message: 'Hi Bishal, I want to inspect the 3BHK flat on GS Road, Christian Basti this Saturday morning. Please confirm your availability.',
      status: 'pending',
    });

    console.log('Creating demo favorites...');
    await Favorite.create({
      user: buyerUser._id,
      property: insertedProperties[0]._id,
    });
    await Favorite.create({
      user: buyerUser._id,
      property: insertedProperties[2]._id,
    });

    console.log('✅ Seed Data successfully initialized with exact Guwahati street addresses!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

if (require.main === module) {
  seedData().then(() => process.exit(0));
}

module.exports = seedData;

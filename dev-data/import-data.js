const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/user-model');
const Property = require('../models/property-model');

dotenv.config({ path: path.join(__dirname, '../config.env') });

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(db)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log('DB connection error:', err));

const property = JSON.parse(fs.readFileSync(`${__dirname}/properties.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));

const importData = async () => {
  try {
    // Import users first
    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users imported`);

    // Create a map of landlord references to actual user IDs
    const landlordMap = {};
    createdUsers.forEach((user, index) => {
      if (user.role === 'landlord') {
        landlordMap[`landlord${Math.floor(index / 2) + 1}`] = user._id;
      }
    });

    // Map landlord references in properties to actual user IDs
    const propertiesWithLandlordIds = property.map((prop) => {
      const landlordRef = prop.landlord;
      const landlordId = landlordMap[landlordRef] || landlordMap['landlord1'];
      return { ...prop, landlord: landlordId };
    });

    // Import properties with mapped landlord IDs
    await Property.create(propertiesWithLandlordIds);
    console.log(`${propertiesWithLandlordIds.length} properties imported`);
    console.log('data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Property.deleteMany();
    await User.deleteMany();
    // await Review.deleteMany();
    console.log('data deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}

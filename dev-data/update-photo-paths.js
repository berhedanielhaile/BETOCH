const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Property = require('../models/property-model');
const User = require('../models/user-model');

dotenv.config({ path: path.join(__dirname, '../config.env') });

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const updatePhotoPaths = async () => {
  try {
    await mongoose.connect(db);
    console.log('DB connection successful!');

    // Use raw MongoDB query to bypass hooks
    const properties = await mongoose.connection.db.collection('properties').find({}).toArray();
    console.log(`Found ${properties.length} properties`);

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      const propertyIndex = i + 1; // property1, property2, etc.
      
      if (property.photos && property.photos.length > 0) {
        // Update photo paths to include folder path
        const updatedPhotos = property.photos.map(photo => {
          const filename = photo.startsWith('property-') ? photo : `property-${propertyIndex}-${photo}`;
          return `/img/properties/${filename}`;
        });
        
        await mongoose.connection.db.collection('properties').updateOne(
          { _id: property._id },
          { $set: { photos: updatedPhotos } }
        );
        console.log(`Updated property ${propertyIndex}: ${property.title}`);
      }
    }

    console.log('All photo paths updated successfully!');
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

updatePhotoPaths();

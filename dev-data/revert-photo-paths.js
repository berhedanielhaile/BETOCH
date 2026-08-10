const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../config.env') });

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const revertPhotoPaths = async () => {
  try {
    await mongoose.connect(db);
    console.log('DB connection successful!');

    // Use raw MongoDB query to bypass hooks
    const properties = await mongoose.connection.db.collection('properties').find({}).toArray();
    console.log(`Found ${properties.length} properties`);

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      
      if (property.photos && property.photos.length > 0) {
        // Revert photo paths to just filenames
        const revertedPhotos = property.photos.map(photo => {
          // Extract just the filename from the full path
          const parts = photo.split('/');
          return parts[parts.length - 1];
        });
        
        await mongoose.connection.db.collection('properties').updateOne(
          { _id: property._id },
          { $set: { photos: revertedPhotos } }
        );
        console.log(`Reverted property ${i + 1}: ${property.title}`);
      }
    }

    console.log('All photo paths reverted successfully!');
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

revertPhotoPaths();

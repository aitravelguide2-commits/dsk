import { Accommodation } from './models/index.js';

async function listAccommodations() {
  try {
    const accommodations = await Accommodation.findAll();
    console.log('--- Database Accommodations ---');
    if (accommodations.length === 0) {
      console.log('No accommodations found in the database.');
    } else {
      accommodations.forEach(acc => {
        console.log(`ID: ${acc.id}, Name: ${acc.name}`);
      });
    }
    console.log('-------------------------------');
  } catch (error) {
    console.error('Error fetching accommodations:', error);
  }
}

listAccommodations();

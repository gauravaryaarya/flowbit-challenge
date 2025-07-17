const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });

const Customer = require('./models/customer.model');
const User = require('./models/user.model');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding.');

    await Customer.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing Customers and Users.');

    const tenants = [{ name: 'LogisticsCo' }, { name: 'RetailGmbH' }];
    const createdCustomers = await Customer.insertMany(tenants);
    console.log('Successfully created tenants.');
    
    const logisticsCo = createdCustomers.find(c => c.name === 'LogisticsCo');
    const retailGmbH = createdCustomers.find(c => c.name === 'RetailGmbH');

    const users = [
      { email: 'admin@logisticsco.com', password: 'Password123!', role: 'Admin', customerId: logisticsCo._id },
      { email: 'admin@retailgmbh.com', password: 'Password123!', role: 'Admin', customerId: retailGmbH._id },
    ];
    await User.create(users);
    console.log('Successfully created admin users.');

    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedDatabase();
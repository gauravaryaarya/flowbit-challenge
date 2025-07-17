const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/user.model');
const Customer = require('../models/customer.model');

const Ticket = require('../models/ticket.model');

describe('Tenant Data Isolation', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('R2: An admin from Tenant A should NOT be able to read data from Tenant B', async () => {
        await Customer.deleteMany({});
        await User.deleteMany({});
        await Ticket.deleteMany({});

        const customerA = await Customer.create({ name: 'TenantA' });
        const customerB = await Customer.create({ name: 'TenantB' });
        await User.create({ email: 'admin@tenanta.com', password: 'password', role: 'Admin', customerId: customerA._id });
        
        const loginRes = await request(app).post('/api/auth/login').send({ email: 'admin@tenanta.com', password: 'password' });
        const tokenA = loginRes.body.token;

        const ticketB = await Ticket.create({ title: 'Ticket for B', customerId: customerB._id });

        // This test assumes a /api/tickets/:id route we will build later.
        // The key is that the logic inside that route MUST check the customerId.
        const res = await request(app)
            .get(`/api/tickets/${ticketB._id}`)
            .set('Authorization', `Bearer ${tokenA}`);

        expect(res.statusCode).not.toBe(200);
    });
});

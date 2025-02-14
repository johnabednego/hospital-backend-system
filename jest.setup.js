const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const connectDatabase = require('./config/databaseConnection')

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const swaggerOptions = require('./config/swagger-ui')


const testApp = express();


testApp.use(express.json());
testApp.use('/api/auth', authRoutes);
testApp.use('/api/doctor', doctorRoutes);
testApp.use('/api/patient', patientRoutes);



let mongod;
let server;

beforeAll(async () => {
  // Close any existing mongoose connections to prevent the "active connection" issue
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }

  // Set up the in-memory MongoDB server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Connect to the in-memory MongoDB instance
  await mongoose.connect(uri);  // No need to use deprecated options

  // Start the server before tests, wait for the server to start fully
  server = testApp.listen(0, () => {
    global.serverAddress = `http://localhost:${server.address().port}`; // Assign to global object
  });

  // Wait for the server to fully initialize before proceeding with tests
  await new Promise(resolve => server.on('listening', resolve));
});

afterAll(async () => {
  // Ensure proper cleanup: close server, disconnect DB, and stop mongod
  if (server) {
    server.close(); // Ensure the server is closed after tests
  }
  await mongoose.disconnect();
  await mongod.stop(); // Stop the in-memory MongoDB instance
});

const request = require('supertest');

describe('Doctor Endpoints', () => {
  let doctorToken;
  let patientId;
  const uniquePatientEmail = `patient-${Date.now()}@example.com`; // Ensures unique email

  beforeAll(async () => {
    // Create and login as doctor (no username field)
    const doctorRes = await request(global.serverAddress)
      .post('/api/auth/signup')
      .send({
        name: 'Test Doctor',
        email: 'doctor@example.com',
        password: 'password123',
        role: 'doctor'
      });

    const loginRes = await request(global.serverAddress)
      .post('/api/auth/login')
      .send({
        email: 'doctor@example.com',
        password: 'password123'
      });

    doctorToken = loginRes.body.token; // Ensure token is valid
    console.log(doctorToken); // Log token to check if it's correct

    // Create a mock patient with a unique email for the doctor to interact with
    const patientRes = await request(global.serverAddress)
      .post('/api/auth/signup')
      .send({
        name: 'Test Patient',
        email: uniquePatientEmail, // Use a unique email
        password: 'password123',
        role: 'patient'
      });

    console.log('Patient response:', patientRes.body);

    // Safely access patient ID, with an error message in case it's missing
    if (patientRes.body && patientRes.body.user) {
      patientId = patientRes.body.user._id;
    } else {
      console.error("Patient ID not found in response");
      throw new Error("Patient creation failed or response structure is incorrect");
    }
  });

  it('should get list of patients', async () => {
    const res = await request(global.serverAddress)
      .get('/api/doctor/patients')
      .set('Authorization', `Bearer ${doctorToken}`); // Correct token syntax

    console.log(res.body); // Log response for debugging
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should submit patient note and create actionable steps', async () => {
    const res = await request(global.serverAddress)
      .post('/api/doctor/notes')
      .set('Authorization', `Bearer ${doctorToken}`)  // Correct token syntax
      .send({
        patientId,
        content: 'Patient needs to take medication X daily for 7 days'
      });

    console.log(res.body); // Log response for debugging
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('note');
    expect(res.body).toHaveProperty('actionableSteps');
  });
});

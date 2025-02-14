const request = require('supertest');

describe('Patient Endpoints', () => {
  let doctorId;

  // Function to log in a user and get the token
  const getToken = async (email, password) => {
    const authResponse = await request(global.serverAddress)
      .post('/api/auth/login')
      .send({ email, password });

    console.log('Auth Response:', authResponse.body); // Log the response to check if token is returned

    if (!authResponse.body.token) {
      throw new Error('Token not returned from login response');
    }

    return authResponse.body.token;  // Ensure this is the token
  };

  // Function to create a new patient with a dynamic email
  const createPatient = async () => {
    const dynamicEmail = `patient${Date.now()}@example.com`; // Unique email using Date.now()

    // Create a new patient
    const createResponse = await request(global.serverAddress)
      .post('/api/auth/signup')
      .send({
        email: dynamicEmail,
        password: 'patientpassword',  // Use a static password for testing
        name: 'Test Patient',
        role: 'patient',
      });

    console.log('Patient Created:', createResponse.body);  // Log the response for debugging

    return dynamicEmail; // Return the email so we can log in the patient later
  };

  it('should get available doctors', async () => {
    const patientEmail = await createPatient();  // Dynamically create a patient
    const patientToken = await getToken(patientEmail, 'patientpassword');  // Get token dynamically for each test

    console.log('Patient Token:', patientToken);  // Log the token to verify it's valid

    const res = await request(global.serverAddress)
      .get('/api/patient/doctors')
      .set('Authorization', `Bearer ${patientToken}`);

    console.log('Available Doctors Response:', res.body);  // Log the response body to inspect what is returned

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should select doctor', async () => {
    const patientEmail = await createPatient();  // Dynamically create a patient
    const patientToken = await getToken(patientEmail, 'patientpassword');  // Get token dynamically for each test

    // Ensure doctorId is valid before proceeding with test
    if (!doctorId) {
      throw new Error('Doctor ID is not defined');
    }

    const res = await request(global.serverAddress)
      .post('/api/patient/select-doctor')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ doctorId });

    expect(res.statusCode).toBe(200);
    expect(res.body.patient).toHaveProperty('assignedDoctor', doctorId);
  });

  it('should get actionable steps', async () => {
    const patientEmail = await createPatient();  // Dynamically create a patient
    const patientToken = await getToken(patientEmail, 'patientpassword');  // Get token dynamically for each test

    const res = await request(global.serverAddress)
      .get('/api/patient/actionable-steps')
      .set('Authorization', `Bearer ${patientToken}`);

    console.log('Actionable Steps Response:', res.body);  // Log the response body

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should mark step as complete', async () => {
    const patientEmail = await createPatient();  // Dynamically create a patient
    const patientToken = await getToken(patientEmail, 'patientpassword');  // Get token dynamically for each test

    // First, get steps to make sure there are actionable steps
    const stepsRes = await request(global.serverAddress)
      .get('/api/patient/actionable-steps')
      .set('Authorization', `Bearer ${patientToken}`);

    console.log('Steps Response:', stepsRes.body);  // Log to verify steps are returned

    // Check if there are steps before proceeding with the test
    if (stepsRes.body.length === 0) {
      throw new Error('No actionable steps found');
    }

    const stepId = stepsRes.body[0]._id;

    const res = await request(global.serverAddress)
      .post(`/api/patient/complete-step/${stepId}`)
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('completed', true);
  });
});

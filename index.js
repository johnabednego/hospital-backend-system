require('dotenv').config();
const express = require('express');
const connectDatabase = require('./config/databaseConnection')

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const swaggerOptions = require('./config/swagger-ui')

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));



app.listen(PORT, async () => {
    try {
        connectDatabase()
        console.log(`Server running on port ${PORT}`)
    } catch (error) {
        console.error(error)
    }
}
);


module.exports = app;

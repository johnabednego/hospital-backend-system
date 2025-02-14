const ActionableStep = require('../models/ActionableStep');
const User = require('../models/User');

const doctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' });
        res.send(doctors);
    } catch (error) {
        res.status(500).send(error);
    }
}


const selectDoctor = async (req, res) => {
    try {
        const patient = await User.findById(req.user.userId);
        const doctor = await User.findById(req.body.doctorId);

        patient.assignedDoctor = doctor._id;
        doctor.patients.push(patient._id);

        await patient.save();
        await doctor.save();

        res.send({ patient, doctor });
    } catch (error) {
        res.status(500).send(error);
    }
}

const actionableSteps = async (req, res) => {
    try {
        const steps = await ActionableStep.find({
            patientId: req.user.userId,
            completed: false
        });
        res.send(steps);
    } catch (error) {
        res.status(500).send(error);
    }
}

const completeStep = async (req, res) => {
    try {
        const step = await ActionableStep.findOne({
            _id: req.params.stepId,
            patientId: req.user.userId
        });

        if (!step) {
            return res.status(404).send({ error: 'Step not found' });
        }

        step.completed = true;
        await step.save();
        res.send(step);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    doctors,
    selectDoctor,
    actionableSteps,
    completeStep
}
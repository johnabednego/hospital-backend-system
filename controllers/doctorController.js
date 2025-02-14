const { encrypt } = require('../utils/encryption');
const { processNote } = require('../services/llm');
const { scheduleReminder } = require('../services/scheduler');
const Note = require('../models/Note');
const ActionableStep = require('../models/ActionableStep');
const User = require('../models/User');


const patients = async (req, res) => {
    try {
        const doctor = await User.findById(req.user.userId).populate('patients');
        res.send(doctor.patients);
    } catch (error) {
        res.status(500).send(error);
    }
}

const notes = async (req, res) => {
    try {
        // Encrypt note content
        const encryptedData = encrypt(req.body.content, process.env.ENCRYPTION_KEY);

        // Save the new note
        const note = new Note({
            doctorId: req.user.userId,
            patientId: req.body.patientId,
            encryptedContent: encryptedData.content,
            iv: encryptedData.iv
        });
        await note.save();

        console.log("Saved note:", note);

        // Process the note with LLM
        const actionableSteps = await processNote(req.body.content);

        if (!actionableSteps || (!actionableSteps.checklist.length && !actionableSteps.plan.length)) {
            console.warn("No actionable steps extracted from LLM.");
        } else {
            console.log("Extracted actionable steps:", actionableSteps);
        }

        // Cancel existing actionable steps
        await ActionableStep.deleteMany({ patientId: req.body.patientId });
        console.log("Deleted previous actionable steps for patient:", req.body.patientId);

        // Create new actionable steps
        const stepsToCreate = [];

        actionableSteps.checklist.forEach(task => {
            stepsToCreate.push({
                patientId: req.body.patientId,
                noteId: note._id,
                type: 'checklist',
                description: task
            });
        });

        actionableSteps.plan.forEach(action => {
            stepsToCreate.push({
                patientId: req.body.patientId,
                noteId: note._id,
                type: 'plan',
                description: action.description,
                schedule: new Date(action.startDate),
                totalRepeats: action.duration
            });
        });

        if (stepsToCreate.length > 0) {
            await ActionableStep.insertMany(stepsToCreate);
            console.log("Saved actionable steps:", stepsToCreate);
        }

        // Schedule reminders for plans
        for (const step of stepsToCreate.filter(s => s.type === 'plan')) {
            scheduleReminder(step);
        }

        res.status(201).send({ note, actionableSteps });
    } catch (error) {
        console.error("Error in notes function:", error);
        res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = { patients, notes }
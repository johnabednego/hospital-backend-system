const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { patients, notes } = require('../controllers/doctorController')

/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Doctor-specific operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - patientId
 *         - content
 *       properties:
 *         patientId:
 *           type: string
 *           description: ID of the patient
 *         content:
 *           type: string
 *           description: Content of the medical note
 */

/**
 * @swagger
 * /api/doctor/patients:
 *   get:
 *     tags: [Doctor]
 *     summary: Get doctor's patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/patients', auth, patients);

/**
 * @swagger
 * /api/doctor/notes:
 *   post:
 *     tags: [Doctor]
 *     summary: Submit a note for a patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: Note created successfully
 */
router.post('/notes', auth, notes);


module.exports = router;
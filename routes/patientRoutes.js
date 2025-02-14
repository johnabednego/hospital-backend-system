const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { doctors, selectDoctor, actionableSteps, completeStep } = require('../controllers/patientController')


/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Patient-specific operations
 */

/**
 * @swagger
 * /api/patient/doctors:
 *   get:
 *     tags: [Patient]
 *     summary: Get available doctors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/doctors', auth, doctors);

/**
 * @swagger
 * /api/patient/select-doctor:
 *   post:
 *     tags: [Patient]
 *     summary: Select a doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *             properties:
 *               doctorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor selected successfully
 */
router.post('/select-doctor', auth, selectDoctor);

/**
 * @swagger
 * /api/patient/actionable-steps:
 *   get:
 *     tags: [Patient]
 *     summary: Get patient's actionable steps
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of actionable steps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [checklist, plan]
 *                   description:
 *                     type: string
 *                   completed:
 *                     type: boolean
 */
router.get('/actionable-steps', auth, actionableSteps);

/**
 * @swagger
 * /api/patient/complete-step/{stepId}:
 *   post:
 *     tags: [Patient]
 *     summary: Mark an actionable step as complete
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stepId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Step marked as complete
 */
router.post('/complete-step/:stepId', auth, completeStep);

module.exports = router;
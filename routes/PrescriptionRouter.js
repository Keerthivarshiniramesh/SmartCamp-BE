const express = require('express')
const isAuth = require('../middleware/isAuth')
const { createPrescription, getPrescription } = require('../controllers/Prescription')

const PrescriptionRouter = express.Router()

PrescriptionRouter.post('/create-prescription', isAuth, createPrescription)
PrescriptionRouter.get('/get-prescription/:id', isAuth, getPrescription)

module.exports = PrescriptionRouter
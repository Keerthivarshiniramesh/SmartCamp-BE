const Express = require('express')
const isAuth = require('../middleware/isAuth')
const { createPatient, getPatient, editPatient, getAllPatient } = require('../controllers/Patient')

const PatientRouter = Express.Router()

PatientRouter.post('/create-patient', isAuth, createPatient)
PatientRouter.get('/get-patient', isAuth, getPatient)
PatientRouter.get('/get-Allpatient', isAuth, getAllPatient)

PatientRouter.post('/editPatient', isAuth, editPatient)

module.exports = PatientRouter

const Express = require('express')
const isAuth = require('../middleware/isAuth')
const { createDoctor, getDoctor, editDoctor, getAllDoctor } = require('../controllers/Doctor')
const { model } = require('mongoose')

const DoctorRouter = Express.Router()

DoctorRouter.post('/create-Doctor', isAuth, createDoctor)
DoctorRouter.get('/fetchLoginData', isAuth, getDoctor)
DoctorRouter.get('/fetchAllDoctor', isAuth, getAllDoctor)

DoctorRouter.post('/editDoctor', isAuth, editDoctor)

module.exports = DoctorRouter
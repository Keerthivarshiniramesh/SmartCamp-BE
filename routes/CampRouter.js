const Express = require('express')
const { createCamp, getAllCamps, getCamp, editCamps } = require('../controllers/Camp')
const isAuth = require('../middleware/isAuth')

const CampRouter = Express.Router()

CampRouter.post('/createCamp', isAuth, createCamp)
CampRouter.get('/getAllCamp', isAuth, getAllCamps)
CampRouter.get('/getCamp/:id', isAuth, getCamp)
CampRouter.post('/editCamp-details/:id', isAuth, editCamps)

module.exports = CampRouter
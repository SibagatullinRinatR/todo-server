const Router = require('express')
const router = new Router()
const userController = require('../controller/user.controller')

router.put('/user', userController.updateUser)
router.delete('/user/:id', userController.deleteUser)

module.exports = router
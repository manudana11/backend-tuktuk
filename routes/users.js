const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router()
const { authentication, isAdmin } = require("../middlewares/authentication");
const { imgLoad } = require("../middlewares/multer");

router.post('/',imgLoad,UserController.create)
router.put('/',authentication, imgLoad,UserController.update)
router.get('/', authentication, UserController.userData)
router.get('/getAll', authentication, UserController.getAll)
router.get('/id/:_id', authentication, UserController.getById)
router.get('/getByName/', authentication, UserController.getUserByname)
router.put('/follow/:_id', authentication, UserController.follow)
router.put('/unfollow/:_id', authentication, UserController.unfollow)
router.post('/login',UserController.login)
router.delete('/logout',authentication, UserController.logout)
router.get("/recoverPassword/:email", UserController.recoverPassword)
router.put("/resetPassword/:recoverToken", UserController.resetPassword)
router.put("/confirm/:email", UserController.confirm);


module.exports = router;


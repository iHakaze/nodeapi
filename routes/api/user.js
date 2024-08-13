const express = require('express');
const router  = express.Router();
const UserController = require('../../controller/UserController');
const verifyjwt = require("../../middlewire/verifyJWT")


router.route('/').get(verifyjwt,UserController.showuser)
.post(UserController.handlerUser)
.put(verifyjwt,UserController.updateuser)
.delete(verifyjwt,UserController.deleteContent);
router.route('/:id').get(verifyjwt,UserController.getuser);

module.exports = router;
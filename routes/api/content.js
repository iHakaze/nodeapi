const express = require('express');
const router  = express.Router();
const exampleController = require('../../controller/ContentController');
const verifyjwt = require("../../middlewire/verifyJWT")
const {ensureUploadDirectory,handleFileUpload} = require("../../middlewire/uploadMiddleware");

router.route('/').get(exampleController.ViewAll)
.post(verifyjwt,ensureUploadDirectory,handleFileUpload,exampleController.create)
.put(verifyjwt,handleFileUpload,exampleController.UpdateContent)
.delete(verifyjwt,exampleController.deleteContent);
router.route('/search').post(exampleController.Search)
router.route('/viewrecent').post(exampleController.viewrecent)
router.route('/ranks').get(exampleController.fetchDataFromDatabase)  
router.route('/:id').get(exampleController.getContentOnce);

module.exports = router;
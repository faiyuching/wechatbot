import * as express from "express";
import * as informationController from "../controllers/information.js";
import auth from "../util/auth.js";
const router = express.Router();
router.get('/listInformation', auth.required, informationController.validate.listInformation, informationController.listInformation);
router.get('/findInformation', auth.required, informationController.validate.findInformation, informationController.findInformation);
router.post('/saveInformation', auth.required, informationController.validate.saveInformation, informationController.saveInformation);
router.post('/duplicateInformation', auth.required, informationController.validate.duplicateInformation, informationController.duplicateInformation);
router.post('/uploadFile', auth.required, informationController.validate.uploadImage, informationController.validate.duplicateCheck, informationController.saveImage);
router.post('/updateInformation', auth.required, informationController.validate.updateInformation, informationController.updateInformation);
router.post('/setFriendWelcome', auth.required, informationController.validate.setFriendWelcome, informationController.setFriendWelcome);
router.post('/deleteInformation', auth.required, informationController.validate.deleteInformation, informationController.deleteInformation);
export default router;
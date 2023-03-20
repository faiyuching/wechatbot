import * as express from "express";
import * as informationTagController from "../controllers/information_tag.js";
import auth from "../util/auth.js";
const router = express.Router();
router.get('/listInformationTag', auth.required, informationTagController.validate.listInformationTag, informationTagController.listInformationTag);
router.post('/saveInformationTag', auth.required, informationTagController.validate.saveInformationTag, informationTagController.saveInformationTag);
router.post('/deleteInformationTag', auth.required, informationTagController.validate.deleteInformationTag, informationTagController.deleteInformationTag);
export default router;

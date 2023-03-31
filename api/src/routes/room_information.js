import * as express from "express";
import * as roomInformationController from "../controllers/room_information.js";
import auth from "../util/auth.js";
const router = express.Router();
router.get('/listRoomInfo', auth.required, roomInformationController.validate.listRoomInformation, roomInformationController.listRoomInformation);
router.post('/saveRoomInfo', auth.required, roomInformationController.validate.saveRoomInformation, roomInformationController.saveRoomInformation);
router.post('/updateRoomInfo', auth.required, roomInformationController.validate.updateRoomInformation, roomInformationController.updateRoomInformation);
export default router;

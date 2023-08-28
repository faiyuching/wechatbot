import * as express from "express";
import * as jinshujuController from "../controllers/jinshuju.js";
import auth from "../util/auth.js";
const router = express.Router();
router.post('/score', auth.required, jinshujuController.validate.getJinshujuScore, jinshujuController.getJinshujuScore);
export default router;
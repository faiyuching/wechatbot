import * as express from "express";
import * as wechatController from "../controllers/wechat.js";
import auth from "../util/auth.js";
const router = express.Router();
router.get('/self', wechatController.self);
router.get('/contactList', wechatController.contactList);
router.get('/roomList', wechatController.roomList);
router.get('/roomFind', wechatController.roomFind);
router.get('/roomOwner', wechatController.roomOwner);
router.get('/roomAnnounce', wechatController.roomAnnounce);
router.get('/roomMemberAll', wechatController.roomMemberAll);
router.get('/loginStatus', auth.required, wechatController.loginStatus);
router.get('/qrcode', auth.required, wechatController.qrcode);
router.post('/clearRedisCache', auth.required, wechatController.clearRedisCache);
export default router;

import express from "express";
import admin from "./admin.js";
import wechat from "./wechat.js";
import message from "./message.js";
import group from "./group.js";
import contact from "./contact.js";
import material from "./material.js";
import file from "./file.js";
import keyword from "./keyword.js";
import information from "./information.js";
const router = express.Router();
router.use('/admin', admin);
router.use('/wechat', wechat);
router.use('/message', message);
router.use('/group', group);
router.use('/contact', contact);
router.use('/material', material);
router.use('/file', file);
router.use('/keyword', keyword);
router.use('/information', information);
export default router;

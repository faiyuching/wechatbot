import * as express from "express";
import * as materialController from "../controllers/material.js";
import auth from "../util/auth.js";
const router = express.Router();
router.get('/listMaterial', auth.required, materialController.validate.listMaterial, materialController.listMaterial);
router.get('/findMaterial', auth.required, materialController.validate.findMaterial, materialController.findMaterial);
router.post('/saveMaterial', auth.required, materialController.validate.saveMaterial, materialController.saveMaterial);
router.post('/updateMaterial', auth.required, materialController.validate.updateMaterial, materialController.updateMaterial);
router.post('/deleteMaterial', auth.required, materialController.validate.deleteMaterial, materialController.deleteMaterial);
export default router;

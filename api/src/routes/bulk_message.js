import * as express from "express";
import * as bulkMessageController from "../controllers/bulk_message.js";
import auth from "../util/auth.js";
const router = express.Router();
router.get('/listBulkMessage', auth.required, bulkMessageController.validate.listBulkMessage, bulkMessageController.listBulkMessage);
router.get('/findBulkMessage', auth.required, bulkMessageController.validate.findBulkMessage, bulkMessageController.findBulkMessage);
router.post('/saveBulkMessage', auth.required, bulkMessageController.validate.saveBulkMessage, bulkMessageController.saveBulkMessage);
router.post('/updateBulkMessage', auth.required, bulkMessageController.validate.updateBulkMessage, bulkMessageController.updateBulkMessage);
router.post('/deleteBulkMessage', auth.required, bulkMessageController.validate.deleteBulkMessage, bulkMessageController.deleteBulkMessage);
export default router;

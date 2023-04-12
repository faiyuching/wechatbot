import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatRoomInformation } from "../models/wechat-common.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
const { body, validationResult, oneOf, query } = expressValidator;

export const validate = {
    listRoomInformation: [
        query('room_id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
    ],
    saveRoomInformation: [
        body('roomIds').exists().isInt().withMessage('群组id不能为空！'),
        body('infoIds').exists().isInt().withMessage('消息id不能为空！'),
    ],
    updateRoomInformation: [
        body('room_id').exists().isInt().withMessage('群组id不能为空！'),
        // body('infoIds').exists().isInt().withMessage('消息id不能为空！'),
    ],
    deleteRoomInformation: [
        body('room_id').exists().isInt().withMessage('消息id不能为空！'),
        body('information_id').exists().isInt().withMessage('标签id不能为空！'),
    ],
};
export const listRoomInformation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {};
    if (req.query.room_id) {
        where.room_id = req.query.room_id;
    }
    try {
        var items = await WechatRoomInformation.findAll({ where, order: [['id', 'ASC']] });
        var data = { items };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const saveRoomInformation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var roomIds = req.body.roomIds;
    var infoIds = req.body.infoIds;
    for(let i = 0; i < roomIds.length; i++){
        for(let j = 0; j < infoIds.length; j++){
            var roomInformationRow = await WechatRoomInformation.findOne({
                where: { room_id: roomIds[i], information_id: infoIds[j] }
            });
            if (!roomInformationRow) {
                try {
                    await WechatRoomInformation.create({ room_id: roomIds[i], information_id: infoIds[i] });
                }
                catch (error) {
                    return res.json(res_data(null, -1, error.toString()));
                }
            }
        }
    }

    return res.json(res_data());
};
export const updateRoomInformation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var where = {};
    if (typeof req.body.room_id != "undefined") {
        where.room_id = req.body.room_id;
    }
    try {
        await WechatRoomInformation.destroy({ where });
        for(let i = 0; i < req.body.infoIds.length; i++){
            var information_id = req.body.infoIds[i];
            await WechatRoomInformation.create({ information_id, room_id: req.body.room_id });
        }
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }

    return res.json(res_data());
};

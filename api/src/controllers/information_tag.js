import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatInformationTag } from "../models/wechat-common.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
const { body, validationResult, oneOf, query } = expressValidator;

export const validate = {
    listInformationTag: [
        query('information_id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
    ],
    saveInformationTag: [
        body('information_id').exists().isInt().withMessage('消息id不能为空！'),
        body('tag_id').exists().isInt().withMessage('标签id不能为空！'),
    ],
    deleteInformationTag: [
        body('information_id').exists().isInt().withMessage('消息id不能为空！'),
        body('tag_id').exists().isInt().withMessage('标签id不能为空！'),
    ],
};
export const listInformationTag = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {};
    if (req.query.information_id) {
        where.information_id = req.query.information_id;
    }
    try {
        var items = await WechatInformationTag.findAll({ where });
        var data = { items };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const saveInformationTag = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var information_id = req.body.information_id;
    var tag_id = req.body.tag_id;
    var informationTagRow = await WechatInformationTag.findOne({
        where: { information_id, tag_id }
    });
    if (informationTagRow) {
        return res.json(res_data(null, -1, "添加失败，已关联此标签!"));
    }
    try {
        await WechatInformationTag.create(req.body);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const deleteInformationTag = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    var where = {};
    where.information_id = req.body.information_id;
    where.tag_id = req.body.tag_id;

    var informationTagRow = await WechatInformationTag.findOne({ where });
    if (informationTagRow) {
        try {
            await WechatInformationTag.destroy({ where });
        }
        catch (error) {
            return res.json(res_data(null, -1, error.toString()));
        }
    }
    else{
        return res.json(res_data(null, -1, "删除失败，不存在此标签!"));
    }
    return res.json(res_data());
};

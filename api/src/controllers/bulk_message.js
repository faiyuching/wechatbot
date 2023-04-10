import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatBulkMessage, WechatInformation } from "../models/wechat-common.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
const { body, validationResult, oneOf, query } = expressValidator;
const bulkMessageOption = [
    body('status').optional({ nullable: true }).isIn([0, 1, 2, true, false]),
];
export const validate = {
    findBulkMessage: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listBulkMessage: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    saveBulkMessage: [
        body('info_ids').notEmpty().exists().withMessage('消息不能为空！'),
        body('group_ids').notEmpty().exists().withMessage('群发对象不能为空！'),
        ...bulkMessageOption,
    ],
    updateBulkMessage: [
        body('id', 'ID必须为整数！').exists().isInt(),
        ...bulkMessageOption,
    ],
    deleteBulkMessage: [
        body('id', 'ID必须为整数！').exists().isInt(),
    ],
};
export const listBulkMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {};
    if (req.query.id) {
        where.id = req.query.id;
    }
    else if (req.query.keyword) {
        where.keyword = {
            [Op.substring]: req.query.keyword
        };
    }
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatBulkMessage.findAll({
            where, limit, offset,
        });
        // items = items.map(processKeyword);
        var total = await WechatBulkMessage.count({ where });
        for(var i = 0; i < items.length; i++){
            items[i].info_ids = items[i].info_ids.split(',').map(Number)
            where = {}
            where.id = items[i].info_ids
            var informations = await WechatInformation.findAll({ where });
            for(var j = 0; j < informations.length; j++){
                informations[j].reply = JSON.parse(informations[j].reply)
            }
            items[i].dataValues.infos = informations

            items[i].group_ids = items[i].group_ids.split(',').map(Number)
        }
        
        var data = { items, total };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const findBulkMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    try {
        var data = await WechatBulkMessage.findByPk(req.query.id);
        if (data)
            data = processKeyword(data);
        data.info_ids = data.info_ids.split(',').map(Number)
        data.group_ids = data.group_ids.split(',').map(Number)
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const saveBulkMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    try {
        req.body.info_ids = req.body.info_ids.toString()
        req.body.group_ids = req.body.group_ids.toString()
        await WechatBulkMessage.create(req.body);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const updateBulkMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
    }
    try {
        req.body.info_ids = req.body.info_ids.toString()
        req.body.group_ids = req.body.group_ids.toString()
        await WechatBulkMessage.update({ ...req.body }, { where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const deleteBulkMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
    }
    try {
        await WechatBulkMessage.destroy({ where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};

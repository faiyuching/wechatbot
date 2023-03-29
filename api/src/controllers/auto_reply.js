import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatAutoReply, WechatBehaviorInformation, WechatInformation } from "../models/wechat-common.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
const { body, validationResult, oneOf, query } = expressValidator;
const autoReplyOption = [
    body('keyword').optional({ nullable: true }),
    body('status').optional({ nullable: true }).isIn([0, 1, true, false]),
];
export const validate = {
    findAutoReply: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listAutoReply: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    saveAutoReply: [
        body('keyword').notEmpty().exists().withMessage('关键字不能为空！'),
        ...autoReplyOption,
    ],
    updateAutoReply: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('keyword').notEmpty().exists().withMessage('关键字不能为空！'),
        ]),
        ...autoReplyOption,
    ],
    deleteAutoReply: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('keyword').notEmpty().exists().withMessage('关键字不能为空！'),
        ]),
    ],
};
export const listAutoReply = async (req, res, next) => {
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
        var items = await WechatAutoReply.findAll({
            where, limit, offset,
        });
        items = items.map(processKeyword);
        var total = await WechatAutoReply.count({ where });
        for(var i = 0; i < items.length; i++){
            let where = {};
            where.behavior_id = items[i].id;
            where.type = 1;
            var rels = await WechatBehaviorInformation.findAll({ where });
            var infos = []
            for(var j = 0; j < rels.length; j++){
                var info = await WechatInformation.findByPk(rels[j].information_id);
                info.reply = JSON.parse(info.reply)
                infos.push(info)
            }
            items[i].dataValues.infos = infos
        }
        var data = { items, total };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const findAutoReply = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    try {
        var data = await WechatAutoReply.findByPk(req.query.id);
        if (data)
            data = processKeyword(data);
            let where = {};
            where.behavior_id = req.query.id;
            where.type = 1;
            var rels = await WechatBehaviorInformation.findAll({ where });
            var infoIds = []
            for(var j = 0; j < rels.length; j++){
                var info = await WechatInformation.findByPk(rels[j].information_id);
                infoIds.push(info.id)
            }
            data.dataValues.infoIds = infoIds
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const saveAutoReply = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var keyword = req.body.keyword;
    var keywordRow = await WechatAutoReply.findOne({
        where: { keyword }
    });
    if (keywordRow) {
        return res.json(res_data(null, -1, "添加失败，已存在此关键词!"));
    }
    try {
        var autoReply = await WechatAutoReply.create(req.body);
        var behavior_id = autoReply.id;
        for(let i = 0; i < req.body.infoIds.length; i++){
            var information_id = req.body.infoIds[i];
            var type = 1;
            await WechatBehaviorInformation.create({ behavior_id, information_id, type });
        }
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const updateAutoReply = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
    }
    try {
        await WechatAutoReply.update({ ...req.body }, { where });
        var behavior_id = req.body.id
        where = {}
        where.behavior_id = behavior_id
        where.type = 1;
        await WechatBehaviorInformation.destroy({ where });
        for(let i = 0; i < req.body.infoIds.length; i++){
            var information_id = req.body.infoIds[i];
            var type = 1;
            await WechatBehaviorInformation.create({ behavior_id, information_id, type });
        }
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const deleteAutoReply = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    if (req.body.id && req.body.id == 1) {
        return res.json(res_data(null, -1, "默认关键词不允许删除"));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
    }
    try {
        await WechatAutoReply.destroy({ where });
        where = {}
        where.behavior_id = req.body.id
        where.type = 1;
        await WechatBehaviorInformation.destroy({ where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};

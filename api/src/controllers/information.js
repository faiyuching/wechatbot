import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatInformation } from "../models/wechat-common.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
const { body, validationResult, oneOf, query } = expressValidator;
const informationOption = [
    body('type').optional({ nullable: true }).isIn([1, 2, 3]),
    body('reply').optional({ nullable: true }),
    // body('event').optional({ nullable: true }),
    // body('status').optional({ nullable: true }).isIn([0, 1, true, false]),
];
export const validate = {
    findInformation: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listInformation: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    saveInformation: [
        body('title').notEmpty().exists().withMessage('标题不能为空！'),
        ...informationOption,
    ],
    updateInformation: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('title').notEmpty().exists().withMessage('标题不能为空！'),
        ]),
        ...informationOption,
    ],
    deleteInformation: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('title').notEmpty().exists().withMessage('标题不能为空！'),
        ]),
    ],
};
export const listInformation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {};
    if (req.query.id) {
        where.id = req.query.id;
    }
    else if (req.query.keyword) {
        where.title = {
            [Op.substring]: req.query.keyword
        };
    }
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatInformation.findAll({
            where, limit, offset,
        });
        items = items.map(processKeyword);
        var total = await WechatInformation.count({ where });
        var data = { items, total };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const findInformation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    try {
        var data = await WechatInformation.findByPk(req.query.id);
        if (data)
            data = processKeyword(data);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const saveInformation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var title = req.body.title;
    var titleRow = await WechatInformation.findOne({
        where: { title }
    });
    if (titleRow) {
        return res.json(res_data(null, -1, "添加失败，已存在此标题!"));
    }
    try {
        await WechatInformation.create(req.body);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const updateInformation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
        delete req.body.id;
    }
    else {
        where.title = req.body.title;
        delete req.body.title;
    }
    try {
        await WechatInformation.update({ ...req.body }, { where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const deleteInformation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    // if (req.body.id && req.body.id == 1) {
    //     return res.json(res_data(null, -1, "默认关键词不允许删除"));
    // }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
        delete req.body.id;
    }
    else {
        where.title = req.body.title;
        delete req.body.title;
    }
    try {
        await WechatInformation.destroy({ where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};

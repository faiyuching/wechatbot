import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatTag } from "../models/wechat-common.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
const { body, validationResult, oneOf, query } = expressValidator;
const tagOption = [
    body('value').optional({ nullable: true }),
];
export const validate = {
    findTag: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listTag: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    saveTag: [
        body('value').notEmpty().exists().withMessage('标签名不能为空！'),
        ...tagOption,
    ],
    updateTag: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('value').notEmpty().exists().withMessage('标签名不能为空！'),
        ]),
        ...tagOption,
    ],
    deleteTag: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('value').notEmpty().exists().withMessage('标签名不能为空！'),
        ]),
    ],
};
export const listTag = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {};
    if (req.query.id) {
        where.id = req.query.id;
    }
    else if (req.query.keyword) {
        where.value = {
            [Op.substring]: req.query.keyword
        };
    }
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatTag.findAll({
            where, limit, offset,
        });
        items = items.map(processKeyword);
        var total = await WechatTag.count({ where });
        var data = { items, total };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const findTag = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    try {
        var data = await WechatTag.findByPk(req.query.id);
        if (data)
            data = processKeyword(data);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const saveTag = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var value = req.body.value;
    var valueRow = await WechatTag.findOne({
        where: { value }
    });
    if (valueRow) {
        return res.json(res_data(null, -1, "添加失败，已存在此标签!"));
    }
    try {
        var data = await WechatTag.create(req.body);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const updateTag = async (req, res, next) => {
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
        where.value = req.body.value;
        delete req.body.value;
    }
    try {
        await WechatTag.update({ ...req.body }, { where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const deleteTag = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
        delete req.body.id;
    }
    else {
        where.value = req.body.value;
        delete req.body.value;
    }
    try {
        await WechatTag.destroy({ where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};

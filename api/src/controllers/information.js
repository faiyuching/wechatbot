import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data, fileMd5, detectiveTypeByFileMime, getImageSize } from "../util/server.js";
import { WechatInformation, WechatInformationTag, WechatTag, WechatRoomInformation, WechatAutoReplyInformation } from "../models/wechat-common.js";
import { WechatFile } from "../models/wechat.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
const { body, validationResult, oneOf, query } = expressValidator;
import multer from "multer";
import fs from "fs";
import path from "path";
import config from '../config.js';
const informationOption = [
    body('type').optional({ nullable: true }).isIn([1, 2, 3]),
    body('reply').optional({ nullable: true }),
    // body('event').optional({ nullable: true }),
    // body('status').optional({ nullable: true }).isIn([0, 1, true, false]),
];
// 文件上传初始化参数
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.__dirname + '/public/uploads/');
    },
    filename: (req, file, cb) => {
        const ext = (file.originalname).split('.').pop();
        const prefix = file.originalname.substring(0, file.originalname.length - ext.length - 1);
        const filename = prefix + '-' + Date.now() + "." + ext;
        cb(null, filename);
    }
});
const limits = {
    fileSize: 2 * 1024 * 1024,
};
const fileFilter = async (req, file, cb) => {
    const ext = (file.originalname).split('.').pop();
    const allowExt = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
    const allowMime = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowExt.indexOf(ext) === -1 || allowMime.indexOf(file.mimetype) === -1) {
        cb(null, false);
        return cb(new Error('文件类型错误'));
    }
    return cb(null, true);
};
const upload = multer({
    storage,
    fileFilter,
    limits,
}).single('file');
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
        body('name').notEmpty().exists().withMessage('名称不能为空！'),
        ...informationOption,
    ],
    updateInformation: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('name').notEmpty().exists().withMessage('名称不能为空！'),
        ]),
        ...informationOption,
    ],
    setFriendWelcome: [
        body('infoIds').exists().isInt().withMessage('消息id不能为空！'),
    ],
    deleteInformation: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('name').notEmpty().exists().withMessage('名称不能为空！'),
        ]),
    ],
    uploadImage: upload,
    duplicateCheck: [
        body('file').custom(async (value, { req }) => {
            req.file.md5 = fileMd5(req.file.path);
            // let oldFile = await WechatFile.getFileByMd5(req.file.md5);
            // if (oldFile) {
            //     fs.access(req.file.path, fs.F_OK, (err) => {
            //         if (err) {
            //             console.error(err);
            //             return;
            //         }
            //         fs.unlink(req.file.path, () => { });
            //     });
            //     return Promise.reject('文件已存在，请勿重复上传！');
            // }
        })
    ]
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
        where.name = {
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
        for(var i = 0; i < items.length; i++){
            let where = {};
            where.information_id = items[i].id;
            var rels = await WechatInformationTag.findAll({ where });
            var tags = []
            for(var j = 0; j < rels.length; j++){
                var tag = await WechatTag.findByPk(rels[j].tag_id);
                tags.push(tag)
            }
            items[i].dataValues.tags = tags
        }
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
        let where = {};
        where.information_id = req.query.id;
        var rels = await WechatInformationTag.findAll({ where });
        var tags = []
        for(var i = 0; i < rels.length; i++){
            var tag = await WechatTag.findByPk(rels[i].tag_id);
            tags.push(tag)
        }
        data.dataValues.tags = tags
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
    var name = req.body.name;
    var nameRow = await WechatInformation.findOne({
        where: { name }
    });
    if (nameRow) {
        return res.json(res_data(null, -1, "添加失败，已存在此名称!"));
    }
    try {
        var information = await WechatInformation.create(req.body);
        var information_id = information.id;
        for(let i = 0; i < req.body.tags.length; i++){
            var tag_id = req.body.tags[i].id;
            await WechatInformationTag.create({ information_id, tag_id });
        }
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const saveImage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    try {
        let extra = {};
        let file_type = detectiveTypeByFileMime(req.file.mimetype);
        if (file_type === 0) {
            extra = await getImageSize(req.file.path);
        }

        let data = {
            file_name: req.file.filename,
            file_type,
            file_ext: req.file.originalname.split('.').pop(),
            md5_code: req.file.md5,
            driver: 'local',
            key: req.file.path.substring('public/'.length, req.file.path.length).replace("\\", "/"),
            file_size: req.file.size,
            url: process.env.APP_DOMAIN + 'static/uploads/'+ req.file.filename,
            ...extra,
        };
        let aFile = await WechatFile.create(data);
        return res.json(res_data({
            name: req.file.originalname,
            url: data.url
        }));
    }
    catch (error) {
        fs.unlink(req.file.path, () => { });
        return res.json(res_data(error, -1, error.toString()));
    }
};
export const updateInformation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
    }
    else {
        where.name = req.body.name;
    }
    try {
        await WechatInformation.update({ ...req.body }, { where });
        var information_id = req.body.id
        where = {}
        where.information_id = information_id
        await WechatInformationTag.destroy({ where });
        for(let i = 0; i < req.body.tags.length; i++){
            var tag_id = req.body.tags[i].id;
            await WechatInformationTag.create({ information_id, tag_id });
        }
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
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
    }
    try {
        where = {}
        where.information_id = req.body.id
        var autoReply = await WechatAutoReplyInformation.findOne({ where })
        if(autoReply){
            return res.json(res_data(null, -1, "消息已被自动回复使用，无法删除"));
        }
        var roomInfo = await WechatRoomInformation.findOne({ where })
        if(roomInfo){
            return res.json(res_data(null, -1, "消息已被入群欢迎语使用，无法删除"));
        }
        where = {}
        where.id = req.body.id
        await WechatInformation.destroy({ where });
        where = {}
        where.information_id = req.body.id
        var infoRels = await WechatInformationTag.findAll({ where });
        await WechatInformationTag.destroy({ where });
        for(var i = 0; i < infoRels.length; i++){
            where = {}
            where.tag_id = infoRels[i].tag_id
            var tagRels = await WechatInformationTag.findAll({ where });
            if(tagRels.length == 0){
                where = {}
                where.id = infoRels[i].tag_id
                await WechatTag.destroy({ where });
            }
        }
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};

export const setFriendWelcome = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var where = {};
    try {
        await WechatInformation.update({ is_friend_welcome: 0 }, { where });
        for( let i = 0; i < req.body.infoIds.length; i++){
            where.id = req.body.infoIds[i];
            await WechatInformation.update({ is_friend_welcome: 1 }, { where });
        }
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }

    return res.json(res_data());
};
import * as expressValidator from "express-validator";
import { WechatAdmin } from "../models/admin.js";
import { res_data, MD5 } from "../util/server.js";
const { body, validationResult, oneOf } = expressValidator;
export const validate = {
    userLogin: [
        body('username', '必须填写用户名！').exists(),
        body('password', '必须填写密码').exists(),
    ],
    userUpdate: [
        oneOf([
            body('username', '必须指定用户名！').exists().notEmpty(),
            body('password', '必须指定密码！').notEmpty().exists(),
        ]),
    ],
};
export const login = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    const { username, password } = req.body;
    WechatAdmin.findOne({
        where: {
            username,
        },
    }).then(item => {
        if (!item) {
            throw new Error("用户不存在！");
        }
        const { id, password: pwd, nickname } = item;
        if (MD5(String(password)) != pwd) {
            throw new Error("账号密码错误！");
        }
        let data = { id, nickname };
        data.token = item.generateJWT();
        return res.json(res_data(data));
    }).catch(next);
};
export const me = function (req, res, next) {
    let id = req.payload.id;
    WechatAdmin.findOne({
        where: { id }
    }).then(item => {
        const { id, username } = item;
        let data = { id, username };
        return res.json(res_data(data));
    });
};
export const logout = function (req, res, next) {
    return res.json(res_data());
};
export const update = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    const { username, password } = req.body;
    const id = req.payload.id;
    let data = {};
    if (username)
        data.username = username;
    if (password)
        data.password = MD5(password);
    WechatAdmin.update(data, {
        where: { id }
    }).then(() => {
        return res.json(res_data());
    }).catch(next);
};

import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { UserInfo, Group, GroupUser } from "../models/wavelib.js";
import { roomSay } from "../service/index.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
import { timestampToDate } from "../util/datetime.js";
const { body, validationResult, oneOf, query } = expressValidator;
export const validate = {
    getJinshujuScore: [
        body('field_87').notEmpty().exists().withMessage('手机号不能为空！'),
        body('exam_score').notEmpty().exists().withMessage('考试得分不能为空！'),
    ],
};

export const getJinshujuScore = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var phone = req.body.field_87;
    var user = await UserInfo.findAll({
        where: { phone }
    });
    var userid = 0
    var groupid = 0
    var addtime = 0
    for( let i = 0; i < user.length; i++){
        var where = {}
        where.userid = user[i].userid
        where.grouptype = 2
        where.isvo = 1
        var group_user = await GroupUser.findAll({ where, order: [['addtime', 'DESC']] })
        if(group_user.length != 0){
            if( group_user[0].addtime > addtime){
                userid = group_user[0].userid
                groupid = group_user[0].groupid
            }
        }
    }
    if(userid != 0 && groupid != 0){
        var user = await UserInfo.findOne({ where: { userid } })
        var group = await Group.findOne({ where: { groupid } })
        if(req.body.exam_score >= 80){
            try {
                await UserInfo.update({ 
                    testtime: req.body.created_at,
                    renzhengtime: req.body.created_at,
                    isrenzheng: 1
                }, { where: { userid } });
                let room = await Bot.getInstance().Room.find({ topic: "微澜图书馆候选馆员群" })
                let link = {
                    type: 4,
                    url: "https://shimo.im/docs/fatOK9bmivgLQwuL",
                    content: user.username + "通过考试成为候任馆员，即将转入" + group.groupname + "工作群，再见！",
                    thumbnailUrl: "http://park.sanzhi.org.cn/uploadfile/user/" + user.face,
                    description: "ta是" + timestampToDate(user.addtime) + "报名的。没完成的小伙伴们请加油。",
                };
                await roomSay(room, null, link);
            }
            catch (error) {
                return res.json(res_data(null, -1, error.toString()));
            }
        }else{
            try {
                await UserInfo.update({ testtime: req.body.created_at }, { where: { userid } });
                let room = await Bot.getInstance().Room.find({ topic: "微澜图书馆候选馆员群" })
                let link = {
                    type: 4,
                    url: "https://shimo.im/docs/fatOK9bmivgLQwuL",
                    content: user.username + "开始参加馆员上岗资格考试了",
                    thumbnailUrl: "http://park.sanzhi.org.cn/uploadfile/user/" + user.face,
                    description: "ta是" + timestampToDate(user.addtime) + "报名的，祝ta顺利完成。没考的小伙伴们请加油。",
                };
                await roomSay(room, null, link);
            }
            catch (error) {
                return res.json(res_data(null, -1, error.toString()));
            }
        }
    }
    return res.json(res_data());
};

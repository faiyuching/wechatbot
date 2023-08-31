import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { UserInfo, Group, GroupUser, UserApply, Weibo } from "../models/wavelib.js";
import { roomSay } from "../service/index.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
import { timestampToDate } from "../util/datetime.js";
const { body, validationResult, oneOf, query } = expressValidator;
export const validate = {
    getJinshujuScore: [
        // body('field_87').notEmpty().exists().withMessage('手机号不能为空！'),
        // body('exam_score').notEmpty().exists().withMessage('考试得分不能为空！'),
        // body('created_at').notEmpty().exists().withMessage('交卷时间不能为空！'),
    ],
};

export const getJinshujuScore = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    let phone = req.body.entry.field_87;
    let exam_score = req.body.entry.exam_score;
    let create_time = Math.floor(Date.parse(req.body.entry.created_at)/1000);
    let user = await UserInfo.findAll({
        where: { phone }
    });
    let userid = 0
    let groupid = 0
    let addtime = 0
    for( let i = 0; i < user.length; i++){
        let where = {}
        where.userid = user[i].userid
        where.grouptype = 2
        where.isvo = 1
        let group_user = await GroupUser.findAll({ where, order: [['addtime', 'DESC']] })
        if(group_user.length != 0){
            if( group_user[0].addtime > addtime){
                userid = group_user[0].userid
                groupid = group_user[0].groupid
            }
        }
    }
    if(userid != 0 && groupid != 0){
        let user = await UserInfo.findOne({ where: { userid } })
        let group = await Group.findOne({ where: { groupid } })
        if(exam_score >= 80){
            try {
                // 更新user_info表
                await UserInfo.update({ 
                    testtime: create_time,
                    renzhengtime: create_time,
                    isrenzheng: 1,
                }, { where: { userid} });
                if(user.grade == 0){
                    console.log(3)
                    await UserInfo.update({ grade: 1,}, { where: { userid } });
                }

                // 插入user_apply表
                await UserApply.create({
                    userid: userid,
                    groupid: groupid,
                    type: 1,
                    score: exam_score,
                    addtime: create_time,
                    status: 1
                })

                // 在社区添加一条微博
                await Weibo.create({
                    userid: userid,
                    content: "通过了馆员资格考试，取得了馆员资格！",
                    addtime: create_time,
                })

                // 向”微澜图书馆候选馆员群“推送图文消息
                let room = await Bot.getInstance().Room.find({ topic: "微澜图书馆候选馆员群" })
                let link = {
                    type: 4,
                    url: "https://shimo.im/docs/fatOK9bmivgLQwuL",
                    content: user.username + "通过考试成为候任馆员，即将转入" + group.groupname + "工作群，再见！",
                    thumbnailUrl: "http://park.sanzhi.org.cn/uploadfile/user/" + user.face,
                    description: "ta是" + timestampToDate(user.addtime) + "报名的。没完成的小伙伴们请加油。",
                };
                await roomSay(room, null, link);

                // 向分馆工作群推送群消息
                room = await Bot.getInstance().Room.find({ topic: "微澜" + group.groupname + "工作群" })
                link = {
                    type: 4,
                    url: "http://park.sanzhi.org.cn/index.php?app=user&ac=duty&id=" + userid,
                    content: user.username + "通过考试成为候任馆员，即将进群，请准备欢迎！",
                    thumbnailUrl: "http://park.sanzhi.org.cn/uploadfile/user/" + user.face,
                    description: "等新人入群后，相关理事注意备注实名，以便识别",
                };
                await roomSay(room, null, link);
            }
            catch (error) {
                return res.json(res_data(null, -1, error.toString()));
            }
        }else{
            try {
                await UserInfo.update({ testtime: create_time }, { where: { userid } });
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

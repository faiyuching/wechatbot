import dispatch from "./event-dispatch-service.js";
import { addRoom, privateSay } from "./index.js";
import { msgArr } from "../util/lib.js";
import { pushJob } from "../util/queue.js";
import { WechatAutoReply, WechatAutoReplyInformation, WechatInformation, WechatRoom } from "../models/wechat-common.js";
import Bot from "../bot.js";
function emptyMsg() {
    let msgArr = []; // 返回的消息列表
    let obj = { type: 1, content: '我在呢', url: '' }; // 消息主体
    msgArr.push(obj);
    return msgArr;
}
function officialMsg() {
    console.log('字符超200字符，无效或官方消息，不做回复');
    return [{ type: 1, content: '', url: '' }];
}
async function newFriendMsg({ config, name }) {
    console.log(`新添加好友：${name}，默认回复`);
    return config.newFriendReplys || [{ type: 1, content: '', url: '' }];
}

async function roomInviteMsg({ that, msg, contact, config }) {
    for (const item of config.roomJoinKeywords) {
        if (msg.startsWith(item.keyword)) {
            let roomName = item.reply ? item.reply : msg;
            let room = await that.Room.find({ topic: roomName });
            if (room) {
                console.log(`精确匹配到加群关键词${msg},正在邀请用户进群`);
                await room.sync();
                if (await room.has(contact)) {
                    return [{ type: 1, content: `您已经加入【${roomName}】！`, url: '' }];
                }
                let replys = [{ type: 1, content: `检索群【${roomName}】成功，欢迎加入！`, url: '' }];
                let roomName = await room.topic()
                setTimeout(() => {
                    pushJob(() => {
                        addRoom(that, contact, roomName, replys)
                    });
                }, 1500);
                return replys;
            }
            else {
                return [{ type: 1, content: `检索群【${msg}】失败，请重新输入！`, url: '' }];
            }
        }
    }
    return [];
}
/**
 * 获取事件处理返回的内容
 * @param {*} event 事件名
 * @param {*} msg 消息
 * @param {*} name 用户
 * @param {*} id 用户id
 * @param avatar 用户头像
 * @returns {String}
 */
async function eventMsg({ that, msg, name, id, avatar, config, room }) {
    msg = msg.trim();
    let eventName, args;
    if (msg.indexOf(" ") !== -1) {
        [eventName, ...args] = msg.split(/ +/);
    }
    else {
        eventName = msg;
        args = null;
    }
    for (let item of config.eventKeywords) {
        if (eventName === item.keyword) {
            let res = await dispatch.dispatchEventContent(that, item.event, args, name, id, avatar, room);
            return res;
        }
    }
    return [];
}
/**
 * 关键词回复
 * @returns {Promise<*>}
 */
async function keywordsMsg({ that, msg, contact, config }) {
    var AutoReply = await WechatAutoReply.findOne({
        where: { status: 1, keyword: msg }
    });
    if(AutoReply) {
        console.log(`精确匹配到关键词${msg},正在回复用户`);
        var rels = await WechatAutoReplyInformation.findAll({
            where: { auto_reply_id: AutoReply.id }, order: [['id', 'ASC']]
        });
        for( let i = 0; i < rels.length; i++ ){
            var information = await WechatInformation.findByPk(rels[i].information_id);
            await privateSay(contact, information);
        }
    }
}
export { emptyMsg };
export { officialMsg };
export { newFriendMsg };
export { roomInviteMsg };
export { eventMsg };
export { keywordsMsg };
export default {
    emptyMsg,
    officialMsg,
    newFriendMsg,
    roomInviteMsg,
    eventMsg,
    keywordsMsg
};

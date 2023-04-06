import Bot from "../bot.js";
import cron from "node-cron";
import { Op } from "sequelize";
import { WechatBulkMessage, WechatInformation, WechatRoom } from "../models/wechat-common.js";
import { privateSay, groupSay } from "../service/index.js";
import { WechatContact } from "../models/wechat.js";

/**
 * 好友添加
 */
async function onCron() {
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const oneMinuteLater = new Date(now.getTime() + 60000);
        var messages = await WechatBulkMessage.findAll({ where: { post_at: {[Op.between]: [now, oneMinuteLater]} } });
        for(let i = 0; i < messages.length; i++){
            messages[i].group_ids = messages[i].group_ids.split(',').map(Number);
            messages[i].info_ids = messages[i].info_ids.split(',').map(Number);
            let where = {};
            where.id = messages[i].group_ids;
            switch(messages[i].type){
                case 1:
                    var groups = await WechatRoom.findAll({ where });
                    groups.forEach(async group => {
                        var room = await Bot.getInstance().Room.find({ topic: group.name });
                        where = {};
                        where.id = messages[i].info_ids;
                        var informations = await WechatInformation.findAll({ where });
                        informations.forEach(information => {
                            groupSay(room, information)
                        });
                    });
                    break;
                case 2:
                    var contacts = await WechatContact.findAll({ where });
                    contacts.forEach(async item => {
                        var contact = await Bot.getInstance().Contact.find({ name: item.name });
                        where = {}
                        where.id = messages[i].info_ids
                        var informations = await WechatInformation.findAll({ where });
                        informations.forEach(information => {
                            privateSay(contact, information)
                        });
                    });
                    break;
            }
        }
    });
}
export default onCron;

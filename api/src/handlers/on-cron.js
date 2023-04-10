import Bot from "../bot.js";
import cron from "node-cron";
import { Op } from "sequelize";
import { WechatBulkMessage, WechatInformation, WechatRoom } from "../models/wechat-common.js";
import { groupSay } from "../service/index.js";

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
            var groups = await WechatRoom.findAll({ where });
            groups.forEach(async group => {
                var room = await Bot.getInstance().Room.find({ topic: group.name });
                where = {};
                where.id = messages[i].info_ids;
                var informations = await WechatInformation.findAll({ where });
                informations.forEach(async information => {
                    where = {}
                    where.id = messages[i].id
                    try {
                        groupSay(room, information)
                        await WechatBulkMessage.update({ status: 1 }, { where });
                    }
                    catch (error) {
                        await WechatBulkMessage.update({ status: 2 }, { where });
                    }
                });
            });
        }
    });
}
export default onCron;

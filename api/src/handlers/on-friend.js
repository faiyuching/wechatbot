import Bot from "../bot.js";
import { WechatFriendWelcome } from "../models/wechat.js";
import { WechatInformation, WechatRoom } from "../models/wechat-common.js";
import { privateSay } from "../service/index.js";
import { addContactToDb } from "../service/syncData.js";
import { delay } from "../util/server.js";

/**
 * 好友添加
 */
async function onFriend(friendship) {
    let logMsg, hello;
    let config = {
        autoAcceptFriend: true
    };
    try {
        let name = friendship.contact().name();
        hello = friendship.hello();
        logMsg = name + '，发送了好友请求';
        console.log(logMsg);
        if (config.autoAcceptFriend) {
            switch (friendship.type()) {
                case Bot.getInstance().Friendship.Type.Receive:
                    // 3秒后添加好友
                    await delay(3000);
                    await friendship.accept();
                    await addContactToDb(friendship.contact());
                    break;
                case Bot.getInstance().Friendship.Type.Confirm:
                    let contact = await Bot.getInstance().Contact.load(friendship.contact().id);
                    let where = {}
                    where.is_friend_welcome = 1;
                    var infos = await WechatInformation.findAll({ where });
                    for( let i = 0; i < infos.length; i++){
                        await privateSay(contact, infos[i]);
                    }
                    break;
            }
        }
        else {
            console.log('未开启自动添加好友功能，忽略好友添加');
        }
    }
    catch (e) {
        logMsg = e;
        console.log('添加好友出错：', logMsg);
    }
}
export default onFriend;

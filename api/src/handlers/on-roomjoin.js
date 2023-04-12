import { FileBox } from "file-box";
import path from "path";
import { WechatRoomInformation, WechatInformation, WechatRoom } from "../models/wechat-common.js";
import { pushJob } from "../util/queue.js";
import Bot from "../bot.js";

/**
 * 群中有新人进入，触发欢迎语
 */
async function onRoomjoin(room, inviteeList, inviter, date) {
    const nameList = inviteeList.map((c) => c.name()).join(',');
    const roomName = await room.topic();

    let where = {}
    where.name = roomName
    var r = await WechatRoom.findOne({ where });
    if(r.is_welcome_open){
        where = {}
        where.room_id = r.id
        var items = await WechatRoomInformation.findAll({ where, order: [['id', 'ASC']] });
        for(let i = 0; i < items.length; i++){
            var information = await WechatInformation.findByPk(items[i].information_id);
            information.reply = information.reply.replace('{{username}}', nameList);
            var reply = JSON.parse(information.reply)
            switch (information.type){
                case 1:
                    room.say(reply.text);
                    break;
                case 2:
                    let obj = new (Bot.getInstance()).UrlLink({
                        url: reply.url,
                        title: reply.title,
                        thumbnailUrl: reply.thumbnailUrl[0].url,
                        description: reply.description,
                    });
                    room.say(obj);
                    break;
                case 3:
                    var rooms = await WechatRoom.findAll({
                        where: { id: reply.groupIds }
                    });
                    for( let i = 0; i < rooms.length; i++ ){
                        let roomName = rooms[i].name;
                        const room = await that.Room.find({ topic: roomName })
                        if (room) {
                        try {
                            await room.add(inviteeList)
                        } catch(e) {
                            console.error(e)
                        }
                        }
                    }
                    break;
            }
        }
    }
    // // 非微澜相关的群，不发送欢迎语
    // if (roomName.indexOf("微澜") === -1) {
    //     return;
    // }
    // var welcome = await WechatRoomWelcome.getWelcomeByIdent(room.id);
    // if (!welcome) {
    //     console.log(`群：${roomName}, ${room.id} 不存在欢迎语`);
    //     return;
    // }
    // var content = welcome.content ? welcome.content.replace('{{username}}', nameList) : `欢迎${nameList}加入本群！`;
    // console.log(`群名： ${roomName} ，加入新成员： ${nameList}, 邀请人： ${inviter}`);
    // setTimeout(() => {
    //     pushJob(async () => {
    //         room.say(content);
    //         if (welcome.img) {
    //             const file = FileBox.fromUrl(welcome.img.key);
    //             room.say(file);
    //         }
    //         if (welcome.link_title && welcome.link_img && welcome.link_url) {
    //             const linkPayload = new (Bot.getInstance()).UrlLink({
    //                 title: welcome.link_title,
    //                 description: welcome.link_desc || '',
    //                 thumbnailUrl: welcome.link_img.key,
    //                 url: welcome.link_url
    //             });
    //             room.say(linkPayload);
    //         }
    //     });
    // }, 5000);
}
export default onRoomjoin;

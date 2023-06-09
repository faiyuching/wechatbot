import Bot from "../bot.js";
import { WechatRoom, WechatContact } from "../models/wechat.js";
import { processContact } from "../util/wechat.js";
/**
 * 同步所有群组数据
 * @param {Wechaty} that
 */
async function initAllRoomData() {
    var items = await Bot.getInstance().Room.findAll();
    try {
        for(let i = 0; i < items.length; i++){
            let where = {}
            where.room_ident = items[i].id
            var group = await WechatRoom.findOne({ where });
            if(group){
                if(group.name != items[i].payload.topic){
                    await WechatRoom.update({ name: items[i].payload.topic },{ where })
                }
            }else{
                await WechatRoom.create({
                    name: items[i].payload.topic,
                    room_ident: items[i].id,
                    is_welcome_open: 1
                });
            }
        }
        // var data = items.map(item => {
        //     let { payload } = item;
        //     return {
        //         room_ident: payload.id,
        //         name: payload.topic,
        //         is_welcome_open: 1
        //     };
        // });
        // WechatRoom.bulkCreate(data, {
        //     fields: Object.keys(data[0]),
        //     updateOnDuplicate: ["name"]
        // });
    }
    catch (error) {
        console.log(`同步群组出错: ${error.toString()}`);
    }
    var groups = await WechatRoom.findAll();
    for( let i = 0; i < groups.length; i++ ){
        if( items.findIndex((item)=>{return groups[i].room_ident===item.id}) == -1 ){
            let where = {}
            where.room_ident = groups[i].room_ident
            await WechatRoom.destroy({ where });
        }
    }
}
/**
 * 同步所有联系人数据
 * @param {Wechaty} that
 */
async function initAllContactData() {
    var items = await Bot.getInstance().Contact.findAll();
    try {
        var data = items.map(processContact);
        WechatContact.bulkCreate(data, {
            fields: Object.keys(data[0]),
            updateOnDuplicate: ["weixin", "name", "friend", "alias", "avatar", "self", "start"], // 他妈的不更新，垃圾啊 
        });
    }
    catch (error) {
        console.log(`同步联系人出错: ${error.toString()}`, error);
    }
    var contacts = await WechatContact.findAll();
    for( let i = 0; i < contacts.length; i++ ){
        if( items.findIndex((item)=>{return contacts[i].contact_ident===item.id}) == -1 ){
            let where = {}
            where.contact_ident = contacts[i].contact_ident
            await WechatContact.destroy({ where });
        }
    }
}
/**
 * 同步所有群组和好友
 * @param {Wechaty} that
 */
async function initAllSyncData() {
    await initAllRoomData();
    await initAllContactData();
}
/**
 * 添加新的联系人数据到数据库
 * @param {Contact} contact
 */
function addContactToDb(contact) {
    let item = processContact(contact);
    WechatContact.bulkCreate([item], {
        fields: Object.keys(item),
        updateOnDuplicate: ["weixin", "name", "friend", "alias", "avatar", "self", "start"], // 他妈的不更新，垃圾啊 
    });
}
export { initAllSyncData };
export { initAllRoomData };
export { initAllContactData };
export { addContactToDb };
export default {
    initAllSyncData,
    initAllRoomData,
    initAllContactData,
    addContactToDb
};

import axios from "axios";
/**
 * 登出事件
 */
async function onLogout(user) {
    console.log(`用户${user}已登出`);
    axios.post('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=8d3a65d0-bb6b-4bb4-96d7-7741b235cc71', {
        msgtype: "text",
        text: {
            content: "小澜登出了！请访问管理后台重新登录",
            mentioned_list: ["KaoLaWu","YuQing","ZuoQiaoXiaoCuo"],
        }
    })
    .then(res => {
        console.log("通知小澜机器人掉线成功!")
    })
    .catch(error => {
        console.log("通知小澜机器人掉线失败!", error)
    })
}
export default onLogout;

import axios from "axios";
/**
 * 登出事件
 */
async function onLogout(user) {
    console.log(`用户${user}已登出`);
    axios.post('http://park.sanzhi.org.cn/index.php?app=wechat&ac=send2user', {
        type: 1,
        key: "xgm200707"
    })
    .then(res => {
        console.log("通知小新机器人掉线成功!")
    })
    .catch(error => {
        console.log("通知小新机器人掉线失败!", error)
    })
}
export default onLogout;

import axios from "axios";
import SMSClient from '@alicloud/sms-sdk';

let appName = process.env.APP_NAME;
let accessKeyId = process.env.AccessKeyId; // AccessKey ID
let secretAccessKey = process.env.SecretAccessKey; // AccessKey Secret
let signName = process.env.SignName; // 签名名称
let templateCode = process.env.TemplateCode; // 短信模板code
let phoneNum = process.env.PhoneNum; // 手机号

/**
 * 登出事件
 */
async function onLogout(user) {
    console.log(`用户${user}已登出`);

    if(appName == 'wavelib'){
        // 发送短信通知
        const smsClient = new SMSClient({accessKeyId, secretAccessKey})
        smsClient.sendSMS({
            PhoneNumbers: phoneNum,
            SignName: signName,
            TemplateCode: templateCode,
        }).then(result => {
            let {Code} = result;
            if (Code == 'OK') {
                console.log("短信通知小澜机器人掉线成功!")
            }else{
                console.log("result: ", result)
            }
        }).catch(err => {
            console.log("短信通知小澜机器人掉线失败!", err)
        })
        // 发送企业微信通知
        axios.post('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=8d3a65d0-bb6b-4bb4-96d7-7741b235cc71', {
            msgtype: "text",
            text: {
                content: "小澜登出了！请访问管理后台重新登录",
                mentioned_list: ["XiaoLan","YuQing"],
            }
        })
        .then(res => {
            console.log("企业微信通知小澜机器人掉线成功!")
        })
        .catch(error => {
            console.log("企业微信通知小澜机器人掉线失败!", error)
        })
    }else if(appName == 'cuzo'){
        // 发送企业微信通知
        axios.post('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c435d5f6-1eed-4fa5-821b-c03f679859bd', {
            msgtype: "text",
            text: {
                content: "走走登出了！请访问管理后台重新登录",
                mentioned_list: ["ZuoQiaoXiaoCuo","YuQing"],
            }
        })
        .then(res => {
            console.log("企业微信通知走走机器人掉线成功!")
        })
        .catch(error => {
            console.log("企业微信通知走走机器人掉线失败!", error)
        })
    }

}
export default onLogout;

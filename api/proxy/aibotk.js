// const { aiBotReq, req } = require('./superagent')
const { parseBody } = require('../util/server')
const fs = require('fs')
const path = require('path')

async function mock_func(option = {}) {
  try {
    console.log("传递的参数为：", option)
    await new Promise((resolve, reject) => {
      setTimeout(() => { resolve() }, 1500);
    });
    return content
  } catch (error) {
    console.log(`获取${content}失败`, error)
  }
}

/**
 * 获取配置文件
 * @returns {Promise<*>}
 */
async function getConfig() {
  try {
    let option = {
      method: 'GET',
      url: '/wechat/config',
      params: {},
    }
    await mock_func(option)
    return {}
    // let res = await aiBotReq(option)
    // let content = parseBody(res)
    // let cres = await updateConfig(JSON.parse(content.data.config))
    // return cres
  } catch (e) {
    console.log('获取配置文件失败:' + e)
  }
}

/**
 * 获取定时提醒任务列表
 */
async function getScheduleList() {
  try {
    let option = {
      method: 'GET',
      url: '/task',
      params: {},
    }
    await mock_func(option)
    return []
    // let res = await aiBotReq(option)
    // let text = parseBody(res)
    // let scheduleList = text.data
    // console.log('获取定时任务成功:' + scheduleList)
    // return scheduleList
  } catch (error) {
    console.log('获取定时任务失败:' + error)
  }
}

/**
 * 设置定时提醒任务
 * @param {*} obj 任务详情
 * @returns {*} 任务详情
 */
async function setSchedule(obj) {
  try {
    let option = {
      method: 'POST',
      url: '/task',
      params: obj,
    }
    await mock_func(option)
    return []
    // let res = await aiBotReq(option)
    // let content = parseBody(res)
    // return content.data
  } catch (error) {
    console.log('添加定时任务失败', error)
  }
}

/**
 * 更新定时提醒任务
 */
async function updateSchedule(id) {
  try {
    let option = {
      method: 'GET',
      url: '/task/update',
      params: { id: id },
    }
    await mock_func(option)
    // let res = await aiBotReq(option)
    console.log('更新定时任务成功')
  } catch (error) {
    console.log('更新定时任务失败', error)
  }
}

/**
 * 登录二维码推送
 * @param url
 * @param status
 * @returns {Promise<void>}
 */
async function setQrCode(url, status) {
  try {
    let option = {
      method: 'GET',
      url: '/wechat/qrcode',
      params: { qrUrl: url, qrStatus: status },
    }
    await mock_func(option)
    let res = Math.random() > 0.5 ? true : false;
    // let res = await aiBotReq(option)
    if (res) {
      console.log('推送二维码成功')
    } else {
      console.log('推送登录二维码失败')
    }
  } catch (error) {
    console.log('推送登录二维码失败', error)
  }
}

/**
 * 推送登录状态的心跳
 * @param heart
 * @returns {Promise<void>}
 */
async function sendHeartBeat(heart) {
  try {
    let option = {
      method: 'GET',
      url: '/wechat/heart',
      params: { heartBeat: heart },
    }
    await mock_func(option)
    // let res = await aiBotReq(option)
    console.log('推送心跳成功')
  } catch (error) {
    console.log('推送心跳失败', error)
  }
}

/**
 * 推送错误
 * @param error
 * @returns {Promise<void>}
 */
async function sendError(error) {
  try {
    let option = {
      method: 'GET',
      url: '/wechat/qrerror',
      params: { qrError: error },
    }
    await mock_func(option)
    // let res = await aiBotReq(option)
    console.log('推送错误成功', error)
  } catch (e) {
    console.log('推送错误失败', e)
  }
}

/**
 * 更新头像
 * @returns {Promise<void>}
 * @param url
 * @param info 用户基本信息
 */
async function sendRobotInfo(url, name, id) {
  try {
    let option = {
      method: 'POST',
      url: '/wechat/info',
      params: { avatar: url, robotName: name, robotId: id },
    }
    await mock_func(option)
    // let res = await aiBotReq(option)
    console.log('推送头像成功')
  } catch (error) {
    console.log('推送头像失败', error)
  }
}
/**
 * 更新好友
 * @returns {Promise<void>}
 * @param url
 */
async function sendFriend(friend) {
  try {
    let option = {
      method: 'POST',
      url: '/wechat/friend',
      params: { friend: friend },
    }
    await mock_func(option)
    // let res = await aiBotReq(option)
    // let content = parseBody(res)
    // if (!content.code === 200) {
    //   console.log('推送失败', content.msg)
    // }
  } catch (error) {
    console.log('推送好友列表失败')
  }
}
/**
 * 更新群
 * @returns {Promise<void>}
 * @param url
 */
async function sendRoom(room) {
  try {
    let option = {
      method: 'POST',
      url: '/wechat/room',
      params: { room: room },
    }
    await mock_func(option)
    // let res = await aiBotReq(option)
    // let content = parseBody(res)
    // if (!content.code === 200) {
    //   console.log('推送失败', content.msg)
    // }
  } catch (error) {
    console.log('推送群列表失败', error)
  }
}
/**
 * 同步群和好友列表
 */
async function asyncData(robotId, type) {
  try {
    let option = {
      method: 'get',
      url: '/wechat/asyncData',
      params: { type, robotId },
    }
    await mock_func(option)
    // let res = await aiBotReq(option)
  } catch (error) {
    console.log('同步好友列表失败', error)
  }
}

/**
 * 获取上传token
 * @returns {Promise<*>}
 */
async function getQiToken() {
  try {
    let option = {
      method: 'GET',
      url: '/wechat/qitoken',
      params: {},
    }
    await mock_func(option)
    return ''
    // let res = await aiBotReq(option)
    // let content = parseBody(res)
    // return content.data.token
  } catch (e) {
    console.log('token error', e)
  }
}
/**
 * 获取群合影配置
 */
async function getRoomPhotoConfig(roomName) {
  try {
    let option = {
      method: 'get',
      url: '/roomPhoto',
      params: { name: roomName },
    }
    await mock_func(option)
    return ''
    // let res = await aiBotReq(option)
    // let content = parseBody(res)
    // return content.data || ''
  } catch (e) {
    console.log('群合影生成错误', e)
  }
}
/**
 * 生成群合影
 * @param {*}} roomName 群名
 * @param {*} list 群成员列表
 * @param {*} contactName 触发用户
 */
async function drawRoomPhoto(roomName, list, contactName) {
  try {
    let option = {
      method: 'POST',
      url: '/roomPhoto',
      params: { name: roomName, user: contactName, list: list },
    }
    await mock_func(option)
    return []
    // let res = await aiBotReq(option)
    // let content = parseBody(res)
    // return content.data
  } catch (e) {
    console.log('群合影生成错误', e)
  }
}
/**
 * 上传base64图片到七牛云
 * @param base
 * @param name
 * @returns {Promise<void>}
 */
async function putqn(base, name) {
  try {
    const token = await getQiToken()
    const namebase = Buffer.from(name).toString('base64').replace('=', '')
    let filename = 'wechat/avatar/' + namebase + '.jpeg'
    let base_file_name = Buffer.from(filename).toString('base64').replace('+', '-').replace('/', '_')
    let options = {
      method: 'POST',
      url: 'http://upload.qiniup.com/putb64/-1/key/' + base_file_name,
      contentType: 'application/octet-stream',
      authorization: 'UpToken ' + token,
      params: base,
    }
    let res = await req(options)
    let content = parseBody(res)
    console.log('上传结果', content.key)
    return 'http://image.xkboke.com/' + content.key
  } catch (e) {
    console.log('上传失败', e.Error)
  }
}
/**
 * 更新插件版本信息
 * @param {*} version
 */
async function updatePanelVersion() {
  try {
    let option = {
      method: 'POST',
      url: '/webPanel/version',
      params: { version: pjson.version },
    }
    await mock_func(option)
    return []
    // let res = await aiBotReq(option)
    // let content = parseBody(res)
    // return content.data
  } catch (error) {
    console.log('error', error)
  }
}

module.exports = {
  getConfig,
  getScheduleList,
  setSchedule,
  updateSchedule,
  setQrCode,
  sendHeartBeat,
  sendError,
  sendRobotInfo,
  putqn,
  sendFriend,
  sendRoom,
  asyncData,
  drawRoomPhoto,
  updatePanelVersion,
  getRoomPhotoConfig,
}

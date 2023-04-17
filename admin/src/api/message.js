import request from '@/utils/request'

export function fetchSendMsgToRoom() {
  return request({
    url: '/message/findSendMsgToRoom',
    method: 'get',
  })
}

export function updateSendMsgToRoom(data) {
  return request({
    url: '/message/updateSendMsgToRoom',
    method: 'post',
    data
  })
}
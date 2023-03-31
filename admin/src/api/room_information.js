import request from '@/utils/request'

export function fetchRoomInfoList(query) {
  return request({
    url: '/room_info/listRoomInfo',
    method: 'get',
    params: query
  })
}

export function createInformation(data) {
  return request({
    url: '/room_info/saveRoomInfo',
    method: 'post',
    data
  })
}

export function updateRoomInfo(data) {
  return request({
    url: '/room_info/updateRoomInfo',
    method: 'post',
    data
  })
}

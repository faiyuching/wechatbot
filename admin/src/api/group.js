import request from '@/utils/request'

export function fetchWelcomeList(query) {
  return request({
    url: '/group/listWelcome',
    method: 'get',
    params: query
  })
}

export function fetchWelcome(id) {
  return request({
    url: '/group/findWelcome',
    method: 'get',
    params: { id }
  })
}

export function createWelcome(data) {
  return request({
    url: '/group/saveWelcome',
    method: 'post',
    data
  })
}

export function updateWelcome(data) {
  return request({
    url: '/group/updateWelcome',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: '/group/updateGroup',
    method: 'post',
    data
  })
}

export function deleteWelcome(id) {
  return request({
    url: '/group/deleteWelcome',
    method: 'post',
    data: { id } 
  })
}

export function fetchRoomList(query) {
  return request({
    url: '/group/listRoom',
    method: 'get',
    params: query
  })
}

export function fetchRoom(query) {
  return request({
    url: '/group/findRoom',
    method: 'get',
    params: query
  })
}

export function fetchAllRoom(query) {
  return request({
    url: '/group/allRoom',
    method: 'get',
    params: query
  })
}

export function syncRoomList() {
  return request({
    url: '/group/syncRoom',
    method: 'post',
  })
}

export function fetchLibraryList(query) {
  return request({
    url: '/group/listLibrary',
    method: 'get',
    params: query
  })
}

export function relateRoomLibrary(data) {
  return request({
    url: '/group/relateRoomLibrary',
    method: 'post',
    data,
  })
}
import request from '@/utils/request'
//广告控制列表
export function selectAdvertisingList(query) {
  return request({
    url: '/advertisingControl/selectControlList',
    method: 'get',
    params: query
  })
}
//广告修改
export function updateAdvertisingList(query) {
  return request({
    url: '/advertisingControl/updateControlList',
    method: 'get',
    params: query
  })
}
//广告删除
export function deleteAdvertisingInfo(query) {
  return request({
    url: '/advertisingControl/deleteControlInfo/'+query,
    method: 'put',
    params: null
  })
}
//广告状态修改
export function changeType(query) {
  return request({
    url: '/advertisingControl/changeType/'+query,
    method: 'put',
    params: null
  })
}
//二次确认状态修改
export function changeSecondConfirm(query) {
  return request({
    url: '/advertisingControl/changeSecondConfirm/'+query,
    method: 'put',
    params: null
  })
}
//新增
export function insert(query) {
  return request({
    url: '/advertisingControl/insert',
    method: 'get',
    params: query
  })
}
//新增渠道
export function insertChannel(query) {
  return request({
    url: '/advertisingControl/insertChannel',
    method: 'get',
    params: query
  })
}
//根据用户查媒体
export function selectMediaByUser(query) {
  return request({
    url: '/advertisingControl/selectMediaByUser?userName='+query,
    method: 'get',
    params: null
  })
}

//查询渠道
export function selectChannel() {
  return request({
    url: '/advertisingControl/selectChannel',
    method: 'get',
    params: null
  })
}

import request from '@/utils/request'

//查询媒体列表
export function selectList(query) {
  return request({
    url: '/management/selectList',
    method: 'get',
    params: query
  })
}
//媒体信息修改
export function updateControlList(query) {
  return request({
    url: '/management/updateInfo',
    method: 'get',
    params: query
  })
}
//媒体信息删除
export function deleteControlInfo(query) {
  return request({
    url: '/management/deleteInfo/'+query,
    method: 'put',
    params: null
  })
}
//媒体信息添加
export function insertInfo(query) {
  return request({
    url: '/management/insertInfo',
    method: 'get',
    params: query
  })
}

export function selectUser() {
  return request({
    url: '/management/selectUser',
    async:false,
    method: 'get',
    params: null
  })
}
//获取登录的用户信息
export function userInfo(varuserName) {
  return request({
    url: '/management/userInfo?varuserName='+varuserName,
    method: 'get',
    params: null
  })
}

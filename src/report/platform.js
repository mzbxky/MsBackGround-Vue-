
import request from "@/utils/request";

//查询平台
export function selectPlatformName() {
  return request({
    url: '/platform/selectPlatformName',
    method: 'get',
    params: null
  })
}
//查询平台列表
export function selectPlatformList(query) {
  return request({
    url: '/platform/selectPlatformList',
    method: 'get',
    params: query
  })
}

//批量删除
export function deleteMany(query) {
  return request({
    url: '/platform/deleteMany/'+query,
    method: 'put',
    params: null
  })
}

//修改
export function updatePlatform(query) {
  return request({
    url: '/platform/updateInfo',
    method: 'post',
    params: query
  })
}

//新增
export function insertInfo(query) {
  return request({
    url: '/platform/insertInfo',
    method: 'post',
    params: query
  })
}

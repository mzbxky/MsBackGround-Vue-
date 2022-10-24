//天级报表信息
import request from "@/utils/request";

//从三方接口获取数据
export function dayData(query) {
  return request({
    url: '/dataReport/dayData',
    method: 'get',
    params: query
  })
}
//从数据库获取数据
export function selectDayDataList(query) {
  return request({
    url: '/dataReport/selectDayDataList',
    method: 'get',
    params: query
  })
}
//总览
export function overview(query) {
  return request({
    url: '/dataReport/overview',
    method: 'get',
    params: query
  })
}

//批量删除
export function deleteManyData(query) {
  return request({
    url: '/dataReport/deleteManyData/'+query,
    method: 'put',
    params: null
  })
}
//查询媒体名称
export function selectMediaName() {
  return request({
    url: '/dataReport/selectMediaName',
    method: 'get',
    params: null
  })
}

//查询广告位
export function selectPlacementName(query) {
  return request({
    url: '/dataReport/selectPlacementName?mediaName='+query,
    method: 'get',
    params: null
  })
}

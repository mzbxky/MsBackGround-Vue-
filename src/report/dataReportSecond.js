import request from "@/utils/request";
//查询穿山甲列表
export function getReportForMySQL(query) {
  return request({
    url: '/pangolin/selectReportDataForMySQL',
    method: 'get',
    params: query
  })
}

//查询应用名称
export function selectAppName() {
  return request({
    url: '/pangolin/selectAppName',
    method: 'get',
    params: null
  })
}
//查询总结
export function selectSumList(query) {
  return request({
    url: '/pangolin/selectSumList',
    method: 'get',
    params: query
  })
}
//查询代码位
export function selectCodeBit(query) {
  return request({
    url: '/pangolin/selectCodeBit?appName='+query,
    method: 'get',
    params: null
  })
}

//查询广告位
export function selectSlotName(query,query2) {
  return request({
    url: '/pangolin/selectSlotName?appName='+query+'&codeBit='+query2,
    method: 'get',
    params: null
  })
}

//从第三方接口获取数据
export function getDataReport(query) {
  return request({
    url: '/pangolin/getDataReport',
    method: 'get',
    params: query
  })
}

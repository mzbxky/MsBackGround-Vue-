//查询数据汇总
import request from "@/utils/request";

//每个应用每天的数据
export function pageShow(query) {
  return request({
    url: '/Summary/pageShow',
    method: 'get',
    params: query
  })
}

//每个用户每天的数据

export function pageShowUser(query) {
  return request({
    url: '/Summary/pageShowUser',
    method: 'get',
    params: query
  })
}

//查询数据汇总
import request from "@/utils/request";

export function pageShow(query) {
  return request({
    url: '/Summary/pageShow',
    method: 'get',
    params: query
  })
}

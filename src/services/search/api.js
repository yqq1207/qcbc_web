import { stringify } from 'qs';
import request from '../../utils/request';

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

// 查询历史列表
export async function getHistoryList(params) {
  return request(`/wordSelect/findWordHistory?${stringify(params)}`);
}

// 查询反馈列表
export async function getFeedbackList(params) {
  return request(`/wordSelect/findUserWordBack?${stringify(params)}`);
}

// 查询关键字
export async function getHotRecommend(params) {
  return request(`/wordSelect/selectHotWord?${stringify(params)}`);
}

// 增加关键字
export async function pushHotRecommend(params) {
  return request(`/wordSelect/insertHotWord`, {
    method: 'POST',
    body: params,
  });
}

// 删除关键字
export async function delHotRecommend(params) {
  return request(`/wordSelect/delteHotWord`, {
    method: 'POST',
    body: params,
  });
}

// 修改关键字
export async function updateHotRecommend(params) {
  return request(`/wordSelect/updateHotWord`, {
    method: 'POST',
    body: params,
  });
}

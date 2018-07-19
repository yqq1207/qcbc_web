import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
// 获取tab列表
export async function getCustomTabList() {
  return request(`/index/getCustomTabList`);
}

// 删除tab
export async function delCustomTab(params) {
  return request(`/index/delCustomTab`, {
    method: 'POST',
    body: params,
  });
}

// 添加tab
export async function addCustomTab(params) {
  return request(`/index/addCustomTab`, {
    method: 'POST',
    body: params,
  });
}

// 更新tab
export async function updateCustomTab(params) {
  return request(`/index/updateCustomTab`, {
    method: 'POST',
    body: params,
  });
}

// 获取绑定的列表
export async function selectListByTabId(params) {
  return request(`/index/selectByAllTabId?${stringify(params)}`);
}

// 查询所有产品的列表
export async function selectAllList(params) {
  return request(`/index/selectStockProduct?${stringify(params)}`);
}

// 保存新增产品(挂载到tab下)
export async function saveProdcutByTabId(params) {
  return request(`/index/saveProdcutByTabId`, {
    method: 'POST',
    body: params,
  });
}

// 更新产品sort
export async function updateCustomProduct(params) {
  return request(`/index/updateCustomProduct`, {
    method: 'POST',
    body: params,
  });
}

// 删除挂载产品
export async function delCustomProduct(params) {
  return request(`/index/delCustomProduct?${stringify(params)}`);
}

// 根据itemId查询产品
export async function selectByitemIdWhereJoin(params) {
  return request(`/index/selectByitemIdWhereJoin?${stringify(params)}`);
}

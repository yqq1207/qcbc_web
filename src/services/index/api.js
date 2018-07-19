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

// banner查询列表
export async function selectBanner() {
  return request(`/index/selectBannerList`, {
    method: 'GET',
  });
}

// banner新增
export async function addBanner(params) {
  return request(`/index/addBanner`, {
    method: 'POST',
    body: params,
  });
}

// banner修改or删除
export async function updateBannerList(params) {
  return request(`/index/updateBanner`, {
    method: 'POST',
    body: params,
  });
}

// icon查询列表
export async function selectIcon() {
  return request(`/index/selectIconList`);
}

// icon新增
export async function addIcon(params) {
  return request(`/index/addIcon`, {
    method: 'POST',
    body: params,
  });
}

// icon修改Or删除
export async function updateIconList(params) {
  return request(`/index/updateIcon`, {
    method: 'POST',
    body: params,
  });
}

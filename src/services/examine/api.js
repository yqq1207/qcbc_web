import { stringify } from 'qs';
import request from '../../utils/request';

// const url = 'http://172.19.14.198:8088';
// const url = 'http://192.168.2.123:8088';
// const url = 'http://192.168.2.148:8088';
// import base from '../../utils/base';

// const { url } = base;

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
// 获取审核列表
export async function toExamineList(params) {
  return request(`/toExamine/toExamineList?${stringify(params)}`);
}

// 审核详细信息
export async function toExamineDetail(params) {
  return request(`/toExamine/toExamineDetail?${stringify(params)}`);
}

// 更新审核结果
export async function toExamineConfirm(params) {
  return request(`/toExamine/toExamineConfirm?${stringify(params)}`);
}

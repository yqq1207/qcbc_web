import { stringify } from 'qs';
import request from '../../utils/request';

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

// 查询运营类目
export async function getOperateCategory(params) {
  return request(`/category/selectOperateCategory?${stringify(params)}`);
}

// 修改类目
export async function updateOperateCategory(params) {
  console.log(params, '--------------');
  return request(`/category/updateOperateCategory`, {
    method: 'POST',
    body: params,
  });
}

// 新增类目
export async function addOperateCategory(params) {
  console.log('params', params);
  return request(`/category/addOperateCategory`, {
    method: 'POST',
    body: params,
  });
}

// 查询原层级类目
export async function categoryOldListNew(params) {
  return request(`/category/categoryOldListNew`, {
    method: 'get',
    body: params,
  });
}

// 删除类目
export async function removeOperateCategory(params) {
  return request(`/category/removeOperateCategory?${stringify(params)}`);
}

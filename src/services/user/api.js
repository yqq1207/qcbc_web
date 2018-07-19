import request from '../../utils/request';
// const url = 'http://172.19.14.198:8088';
// const url = 'http://192.168.2.123:8088';
// const url = 'http://192.168.2.148:8088';
import base from '../../utils/base';

// 注册
export async function registers(params) {
  return request(`/user/register`, {
    method: 'POST',
    body: params,
  });
}

// 登陆
export async function userLogin(params) {
  return request(`/user/login`, {
    method: 'POST',
    body: params,
  });
}

// 注销
export async function userLogout() {
  return request(`/user/logout`, {
    method: 'GET',
  });
}

// 忘记密码
export async function forget(params) {
  return request(`/user/forGetPwd`, {
    method: 'POST',
    body: params,
  });
}

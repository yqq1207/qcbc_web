import request from '../../utils/request';

// 查询关键字
export async function getLayout() {
  return request(`/index/selectCardLayout`);
}

// 修改关键字
export async function updateLayout(params) {
  return request(`/index/updateCardLayout`, {
    method: 'POST',
    body: params,
  });
}

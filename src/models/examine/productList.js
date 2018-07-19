import { Message } from 'antd';
import { routerRedux } from 'dva/router';
import { getProductList, getProductDetial, updateProduct } from '../../services/product/api';

export default {
  namespace: 'productList',

  state: {
    listData: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
      },
    },
    productDetial: {
      code: -1,
      msg: '',
      data: {},
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getProductList, payload);
      if (response.status) yield put(routerRedux.push('/user/login/page'));
      let newResponse = {};
      if (response.code === 0) {
        newResponse = {
          list: response.data.rows,
          pagination: {
            current: response.data.pageNumber,
            pageSize: response.data.pageSize,
            total: response.data.total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40'],
          },
        };
      } else {
        newResponse = {
          list: [],
          pagination: {
            current: 1,
            pageSize: 10,
            total: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40'],
          },
        };
      }
      yield put({
        type: 'saveList',
        payload: newResponse,
      });
    },
    *fetchDetial({ payload }, { call, put }) {
      const response = yield call(getProductDetial, payload);
      if (response.status) yield put(routerRedux.push('/user/login/page'));
      let newResponse = {};
      if (response.code !== 0) {
        newResponse = {
          code: -1,
          msg: '',
          data: {},
        };
      } else {
        newResponse = response;
      }
      yield put({
        type: 'saveDetial',
        payload: newResponse,
      });
    },
    *updateProduct({ payload }, { call, put }) {
      const response = yield call(updateProduct, payload);
      if (response.status) yield put(routerRedux.push('/user/login/page'));
      if (response.code === 0) {
        Message.success(response.msg);
        yield put(routerRedux.push('/examine/product-list'));
      } else Message.error(response.msg);
      yield put({
        type: 'saveDetial',
        payload: response,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        listData: action.payload,
      };
    },
    saveDetial(state, action) {
      return {
        ...state,
        productDetial: action.payload,
      };
    },
  },
};

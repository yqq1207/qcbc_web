import { routerRedux } from 'dva/router';
import { toExamineList, toExamineDetail, toExamineConfirm } from '../../services/examine/api';

export default {
  namespace: 'examineList',

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
    enterpriseDetial: {
      ShopEnterpriseCertificates: [],
      shopEnterpriseInfos: {},
    },
    shopDetial: {
      shop: {},
    },
    shopBrand: {
      shopBrandCertificates: [],
      shopBrands: {},
    },
    editResult: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(toExamineList, payload);
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
      const response = yield call(toExamineDetail, payload);
      if (response.status) yield put(routerRedux.push('/user/login/page'));
      let { type } = payload;
      type = parseInt(type, 10);
      if (type === 1) {
        yield put({
          type: 'saveEnterprise',
          payload: response,
        });
      } else if (type === 2) {
        yield put({
          type: 'saveShop',
          payload: response,
        });
      } else if (type === 3) {
        yield put({
          type: 'saveShopBrand',
          payload: response,
        });
      }
    },
    *confirm({ payload }, { call, put }) {
      const response = yield call(toExamineConfirm, payload);
      if (response.status) yield put(routerRedux.push('/user/login/page'));
      yield put({
        type: 'result',
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
    saveEnterprise(state, action) {
      return {
        ...state,
        enterpriseDetial: action.payload.data,
      };
    },
    saveShop(state, action) {
      return {
        ...state,
        shopDetial: action.payload.data,
      };
    },
    saveShopBrand(state, action) {
      return {
        ...state,
        shopBrand: action.payload.data,
      };
    },
    result(state, action) {
      console.log(action.payload);
      return {
        ...state,
        editResult: action.payload,
      };
    },
  },
};

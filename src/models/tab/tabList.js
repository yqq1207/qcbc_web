import { Message } from 'antd';
import { routerRedux } from 'dva/router';
import { getCustomTabList, delCustomTab, addCustomTab, updateCustomTab, delCustomProduct,
  selectListByTabId, selectAllList, saveProdcutByTabId, updateCustomProduct, selectByitemIdWhereJoin } from '../../services/tab/api';

export default {
  namespace: 'tabList',

  state: {
    list: [],
    editResult: {},
    totalData: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 10,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '40'],
      },
    },
    listDataByTab: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 10,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '40'],
      },
    },
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(getCustomTabList);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *delCustomTab({ payload }, { call, put }) {
      const response = yield call(delCustomTab, payload);
      yield put({
        type: 'result',
        payload: response,
      });
    },
    *addCustomTab({ payload, callback }, { call, put }) {
      console.log(payload)
      const response = yield call(addCustomTab, payload);
      yield put({
        type: 'result',
        payload: response,
      });
      if(callback) callback(response);
    },
    *updateCustomTab({ payload, callback }, { call, put }) {
      const response = yield call(updateCustomTab, payload);
      yield put({
        type: 'result',
        payload: response,
      });
      if(callback) callback(response);
    },
    *selectListByTabId({ payload }, { call, put }) {
      const response = yield call(selectListByTabId, payload);
      const newResponse = {
        list: response.data.list || [],
        pagination: {
          current: response.data.pageNum || 1,
          pageSize: response.data.pageSize || 10,
          total: response.data.total || 10,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '30', '40'],
        },
      };
      yield put({
        type: 'saveListByTab',
        payload: newResponse,
      });
    },
    *selectAllList({ payload }, { call, put }) {
      const response = yield call(selectAllList, payload);
      const newResponse = {
        list: response.data.list || [],
        pagination: {
          current: response.data.pageNum || 1,
          pageSize: response.data.pageSize || 10,
          total: response.data.total || 10,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '30', '40'],
        },
      };
      yield put({
        type: 'saveAllList',
        payload: newResponse,
      });
    },
    *selectListByItemId({ payload }, { call, put }) {
      const response = yield call(selectByitemIdWhereJoin, payload);
      const newResponse = {
        list: [response.data] || [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 10,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '30', '40'],
        },
      };
      yield put({
        type: 'saveAllList',
        payload: newResponse,
      });
    },
    *updateProdcutByTabId({ payload }, { call, put }) {
      const response = yield call(saveProdcutByTabId, payload);
      const { code, msg } = response;
      if ( code < 0 ) Message.err(msg);
      else Message.success(msg);
    },
    *updateProductSort({ payload }, { call, put }) {
      const response = yield call(updateCustomProduct, payload);
      yield put({
        type: 'result',
        payload: response,
      });
    },
    *delProduct({ payload }, { call, put }) {
      const response = yield call(delCustomProduct, payload);
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
        list: action.payload,
      };
    },
    result(state, action) {
      return {
        ...state,
        editResult: action.payload,
      };
    },
    saveAllList(state, action) {
      return {
        ...state,
        totalData: action.payload,
      }
    },
    saveListByTab(state, action) {
      return {
        ...state,
        listDataByTab: action.payload,
      }
    },
  },
}
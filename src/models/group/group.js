import { Message } from 'antd';
import { routerRedux } from 'dva/router';
import { getOperateCategory, updateOperateCategory, addOperateCategory, categoryOldListNew, removeOperateCategory } from '../../services/group/api';

export default {
  namespace: 'group',

  state: {
    groupData: [],
    categoryData: [],
    cascader: [],
  },

  effects: {
    *fetchOperateCategory({ payload, callback }, { call, put }) {
      const response = yield call(getOperateCategory, payload);
      let newResponse;
      if(response.code === 0) newResponse = response;
      else newResponse = {code: -1, data: []};
      yield put({
        type: 'saveOperateCategory',
        payload: response,
      });
      if(callback) callback(newResponse)
    },
    *fetchOperateCategorys({ payload, callback }, { call, put }) {
      const response = yield call(getOperateCategory, payload);
      let newResponse;
      if(response.code === 0) newResponse = response;
      else newResponse = {code: -1, data: []};
      yield put({
        type: 'saveList',
        payload: newResponse,
      });
      if(callback) callback(newResponse)
    },
    *editGroup({ payload, callback }, { call, put }) {
      const response = yield call(updateOperateCategory, payload);
      const { code, msg } = response;
      if(code === 0) Message.success(msg);
      else Message.error(msg);
      console.log(response);
      if(callback) callback(response);
    },
    *addGroup({ payload, callback }, { call, put }) {
      const response = yield call(addOperateCategory, payload);
      console.log(response);
      const { code, msg } = response;
      if(code === 0) Message.success(msg);
      else Message.error(msg);
      if(callback) callback(response);
    },
    *searchGroups({ payload }, { call, put }) {
      const response = yield call(categoryOldListNew, payload);
      let newResponse = response;
      if(response.code  !== 0) newResponse = {code: -1,data: []};
      yield put({
        type: 'saveCascader',
        payload: newResponse,
      });
    },
    *removeGroup({ payload, callback }, { call, put }) {
      console.log('removeGroup', payload)
      const response = yield call(removeOperateCategory, payload);
      console.log(response, '111');
      const { code, msg } = response;
      if(code === 0) Message.success(msg);
      else Message.error(msg);
      if(callback) callback(response);
    },
  },

  reducers: {
    saveOperateCategory(state, action) {
      return {
        ...state,
        groupData: action.payload.data,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        categoryData: action.payload.data,
      };
    },
    saveResult(state, action) {
      return {
        ...state,
        result: action.payload,
      }
    },
    saveCascader(state, action) {
      return {
        ...state,
        cascader: action.payload.data,
      }
    },
  },
}
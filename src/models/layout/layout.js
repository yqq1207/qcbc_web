import { Message } from 'antd';
import { getLayout, updateLayout } from '../../services/layout/api';

export default {
  namespace: 'layout',

  state: {
    layoutList: {
      list: [],
    },
    result: {
      code: -1,
      message: '',
    },
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(getLayout);
      let newResponse = { list: [] };
      if (response.code === 0) {
        newResponse = {
          list: response.data,
        };
      }
      yield put({
        type: 'saveList',
        payload: newResponse,
      });
    },
    *editLayout({ payload, callback }, { call, put }) {
      console.log('editLayout', payload);
      const response = yield call(updateLayout, payload);
      const { code, msg } = response;
      if (code === 0) {
        Message.success(msg);
      } else {
        Message.error(msg);
      }
      yield put({
        type: 'saveResult',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        layoutList: action.payload,
      };
    },
    saveResult(state, action) {
      return {
        ...state,
        result: action.payload,
      };
    },
  },
};

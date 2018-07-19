import { Message } from 'antd';
import { routerRedux } from 'dva/router';
import { getHistoryList, getFeedbackList, getHotRecommend, pushHotRecommend, delHotRecommend, updateHotRecommend } from '../../services/search/api';

export default {
  namespace: 'search',

  state: {
    historyList: {
      list: [],
      pagenation: {},
    },
    feedbackList: {
      list: [],
      pagenation: {},
    },
    hotRecommend: {
      list: [],
      pagination: {},
    },
    result: {
      code: -1,
      message: '',
    },
  },

  effects: {
    *fetchHistoryList({ payload }, { call, put }) {
      const response = yield call(getHistoryList, payload);
      let newResponse = {list: [], pagination:{}};
      if(response.code === 0) {
        newResponse = {
          list: response.data.list,
          pagination: {
            total: response.data.total,
            pageSize: response.data.pageSize,
            current: response.data.pageNum,
          },
        }
      };
      yield put({
        type: 'saveHistory',
        payload: newResponse,
      });
    },
    *fetchFeedbackList({ payload }, { call, put }) {
      const response = yield call(getFeedbackList, payload);
      let newResponse = {list: [], pagination:{}};
      if(response.code === 0) {
        newResponse = {
          list: response.data.list,
          pagination: {
            total: response.data.total,
            pageSize: response.data.pageSize,
            current: response.data.pageNum,
          },
        }
      };
      yield put({
        type: 'saveFeedback',
        payload: newResponse,
      });
    },
    *fetchHotRecommend({ payload }, { call, put }) {
      const response = yield call(getHotRecommend, payload);
      let newResponse = {list: [], pagination:{}};
      if(response.code === 0) {
        newResponse = {
          list: response.data.list,
          pagination: {
            total: response.data.total,
            pageSize: response.data.pageSize,
            current: response.data.pageNum,
          },
        }
      };
      yield put({
        type: 'saveHotRecommend',
        payload: newResponse,
      });
    },
    *addHotRecommend({ payload, callback }, { call, put }) {
      const response = yield call(pushHotRecommend, payload);
      yield put({
        type: 'saveResult',
        payload: response,
      });
      if(callback) callback(response);
    },
    *deleteHotRecommend({ payload, callback }, { call, put }) {
      const response = yield call(delHotRecommend, payload);
      const { code, msg } = response;
      if(code === 0) {
        Message.success(msg)
      } else {
        Message.error(msg)
      }
      yield put({
        type: 'saveResult',
        payload: response,
      });
      if(callback) callback(response);
    },
    *editHotRecommend({ payload, callback }, { call, put }) {
      const response = yield call(updateHotRecommend, payload);
      const { code, msg } = response;
      if(code === 0) {
        Message.success(msg)
      } else {
        Message.error(msg)
      }
      yield put({
        type: 'saveResult',
        payload: response,
      });
      if(callback) callback(response);
    },
  },

  reducers: {
    saveHistory(state, action) {
      return {
        ...state,
        historyList: action.payload,
      };
    },
    saveFeedback(state, action) {
      return {
        ...state,
        feedbackList: action.payload,
      };
    },
    saveHotRecommend(state, action) {
      return {
        ...state,
        hotRecommend: action.payload,
      };
    },
    saveResult(state, action) {
      return {
        ...state,
        result: action.payload,
      }
    },
  },
}
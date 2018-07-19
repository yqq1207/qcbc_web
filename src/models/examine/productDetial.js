import { routerRedux } from 'dva/router';
import { queryActivities } from '../../services/api';

export default {
  namespace: 'productDetial',

  state: {
    list: [],
  },

  effects: {
    *fetchDetial({ payload }, { call, put }) {
      const response = yield call(queryActivities, payload);
      if (response.status) yield put(routerRedux.push('/user/login/page'));
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *past({ payload }, { call, put }) {
      const response = yield call(queryActivities, payload);
      if (response.status) yield put(routerRedux.push('/user/login/page'));
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *refuse({ payload }, { call, put }) {
      const response = yield call(queryActivities, payload);
      if (response.status) yield put(routerRedux.push('/user/login/page'));
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
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
  },
};

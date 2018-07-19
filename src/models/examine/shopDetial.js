import { routerRedux } from 'dva/router';
import { queryActivities } from '../../services/api';

export default {
  namespace: 'shopDetial',

  state: {
    list: [],
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(queryActivities);
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

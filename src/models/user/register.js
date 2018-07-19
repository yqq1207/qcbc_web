import { Message } from 'antd';
import { routerRedux } from 'dva/router';
import { registers, userLogin, forget, userLogout } from '../../services/user/api';
import { setAuthority, setUserName } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    editResult: {
      code: -1,
      message: '',
    },
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(registers, payload);
      const { code, msg } = response;
      if (code < 0) Message.error(msg);
      else {
        Message.success(msg);
        yield put(routerRedux.push('/user/login/page'));
      }
    },
    *login({ payload }, { call, put }) {
      const response = yield call(userLogin, payload);
      const { code, msg, data } = response;
      if (code < 0) {
        if (msg.length > 50) Message.error('验证码错误');
        else Message.error('账号或密码错误');
      } else Message.success('登陆成功');
      if (data) setUserName(data.name);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 0) {
        setAuthority('admin');
        reloadAuthorized();
        yield put(routerRedux.push('/'));
        // location.reload();
      }
    },
    *forgetPassWord({ payload }, { call, put }) {
      const response = yield call(forget, payload);
      const { code, msg } = response;
      if (code < 0) Message.error(msg);
      else {
        Message.success(msg);
        yield put(routerRedux.push('/user/login/page'));
      }
    },
    *logout({ payload }, { call, put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        yield call(userLogout, payload);
      } finally {
        setAuthority('guest');
        reloadAuthorized();
        yield put(routerRedux.push('/user/login/page'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

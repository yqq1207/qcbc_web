import {
  addBanner,
  addIcon,
  selectBanner,
  selectIcon,
  updateBannerList,
  updateIconList,
} from '../services/index/api';

export default {
  namespace: 'dragList',

  state: {
    bannerList: {
      list: [],
      pagination: {},
    },
    iconList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *addBanner({ payload, callback }, { call, put }) {
      const response = yield call(addBanner, payload);
      if (!response) return;
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *addIcon({ payload, callback }, { call, put }) {
      const response = yield call(addIcon, payload);
      if (!response) return;
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *selectBanner({ payload, callback }, { call, put }) {
      const response = yield call(selectBanner, payload);
      if (!response) return;
      yield put({
        type: 'selectBannerType',
        payload: response,
      });
      if (callback) callback(response);
    },
    *selectIcon({ payload, callback }, { call, put }) {
      const response = yield call(selectIcon, payload);
      if (!response) return;
      yield put({
        type: 'selectIconType',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateBanner({ payload, callback }, { call, put }) {
      console.log('updateBanner')
      const response = yield call(updateBannerList, payload);
      if (!response) return;
      yield put({
        type: 'updateBannerType',
        payload: response,
      });
      if (callback) callback(response);
    },

    *updateIcon({ payload, callback }, { call, put }) {
      const response = yield call(updateIconList, payload);
      if (!response) return;
      yield put({
        type: 'updateBannerType',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.rows,
          pagination: {
            current: action.payload.data.pageNumber, //页码
            pageSize: action.payload.data.pageSize,
            total: action.payload.data.total, //总条数
            pageSizeOptions: ['10', '30', '50', '100'],
            showQuickJumper: true,
            showSizeChanger: true,
          },
        },
      };
    },
    update(state, action) {
      return {
        ...state,
        updateData: {
          data: action.payload,
        },
      };
    },
    uploadData(state, action) {
      return {
        ...state,
        uploadData: {
          code: action.payload.code,
          message: action.payload.message,
        },
      };
    },
    selectBannerType(state, action) {
      console.log('1233131', action.payload.data);
      return {
        ...state,
        bannerList: {
          list: action.payload.data,
          pagination: {},
        },
      };
    },
    selectIconType(state, action) {
      console.log('1233131', action.payload.data);
      return {
        ...state,
        iconList: {
          list: action.payload.data,
          pagination: {},
        },
      };
    },
    saveOrderInfo(state, action) {
      console.log('saveOrderInfo', action);
      return {
        ...state,
        orderInfoData: {
          userOrderCashes: action.payload.data.userOrderCashes,
          userOrders: action.payload.data.userOrders,
          orderInfoStatus: action.payload.status,
        },
        updateData: '',
      };
    },
    errorSave(state, action) {
      return {
        list: [],
        pagination: {},
      };
    },
    updateBannerType(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.rows,
          pagination: {
            current: action.payload.data.pageNumber, //页码
            pageSize: action.payload.data.pageSize,
            total: action.payload.data.total, //总条数
          },
        },
      };
    },
  },
};

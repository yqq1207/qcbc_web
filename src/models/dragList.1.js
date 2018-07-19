import {
  // uploadName,
  // uploadFile,
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
    data: {
      list: [],
      pagination: {},
    },
    orderInfoData: {
      userOrderCashes: {},
      userOrders: {},
    },
    updateData: {
      code: 0,
      message: '',
      data: {
        firstParent: [],
        secondParent: [],
        thirdParent: [],
        fourthParent: [],
      },
    },
    updateBannerType: {
      code: 0,
      message: '',
    },
    uploadData: {
      code: 0,
      message: '',
    },
    uploadFile: {},
    selectBannerType: {
      list: [],
      pagination: {},
    },
    selectIconType: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // *uploadName({ payload }, { call, put }) {
    //   const response = yield call(uploadName, payload);
    //   console.log('dragListresponse22222', response);
    //   if (!response) return;
    //   yield put({
    //     type: 'uploadData',
    //     payload: response,
    //   });
    // },
    *addBanner({ payload, callback }, { call, put }) {
      console.log('=======================')
      const response = yield call(addBanner, payload);
      console.log('addBanner', response);
      if (!response) return;
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *addIcon({ payload, callback }, { call, put }) {
      const response = yield call(addIcon, payload);
      console.log('addIcon', response);
      if (!response) return;
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *selectBanner({ payload, callback }, { call, put }) {
      console.log('222222222')
      const response = yield call(selectBanner, payload);
      console.log('selectBanner', response);
      if (!response) return;
      yield put({
        type: 'selectBannerType',
        payload: response,
      });
      if (callback) callback(response);
    },
    *selectIcon({ payload, callback }, { call, put }) {
      const response = yield call(selectIcon, payload);
      console.log('selectIcon', response);
      if (!response) return;
      yield put({
        type: 'selectIconType',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateBannerList({ payload, callback }, { call, put }) {
      console.log(payload, 'payload111111');
      const response = yield call(updateBannerList, payload);
      console.log('updateBannerType', response);
      if (!response) return;
      yield put({
        type: 'updateBannerType',
        payload: response,
      });
      if (callback) callback(response);
    },

    *updateIconList({ payload, callback }, { call, put }) {
      const response = yield call(updateIconList, payload);
      console.log('updateIconList', response);
      if (!response) return;
      yield put({
        type: 'updateBannerType',
        payload: response,
      });
      if (callback) callback(response);
    },

    // *uploadFile({ payload }, { call, put }) {
    //   const response = yield call(uploadFile, payload);
    //   console.log('uploadFile', response);
    //   if (!response) return;
    //   yield put({
    //     type: 'uploadFile',
    //     payload: response,
    //   });
    // },
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
      console.log(action, 'action');
      return {
        ...state,
        uploadData: {
          code: action.payload.code,
          message: action.payload.message,
        },
      };
    },
    uploadFile(state, action) {
      return {
        ...state,
        uploadFile: action.payload,
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

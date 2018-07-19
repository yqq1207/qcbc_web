import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Divider,
  Form,
  Button,
  Modal,
  Icon,
  Input,
  Badge,
  Upload,
  DatePicker,
  Select,
  Message,
} from 'antd';

import moment from 'moment';
import Drag from '../../components/DragSortingTable';
import { baseUrl } from '../../utils/base';

const FormItem = Form.Item;
const statusMap = ['success', 'error', 'error', 'processing', 'default'];
const status = ['是', '否'];
const { Option } = Select;

// const props = {
//   name: 'file',
//   action: '//jsonplaceholder.typicode.com/posts/',
//   headers: {
//     authorization: 'authorization-text',
//   },
//   onChange(info) {
//     if (info.file.status !== 'uploading') {
//       console.log(info.file, info.fileList);
//     }
//     if (info.file.status === 'done') {
//       Message.success(`${info.file.name} 上传成功`);
//     } else if (info.file.status === 'error') {
//       Message.error(`${info.file.name} 上传失败`);
//     }
//   },
// };
// @connect()
@connect(({ dragList, loading, login }) => ({
  dragList,
  loading: loading.models.orderList,
  login,
}))
@Form.create()
export default class DragList extends Component {
  columnsBanner = [
    {
      title: '名称',
      dataIndex: 'bannerName',
    },
    {
      title: '图片',
      dataIndex: 'imgSrc',
      render: record => <img src={record} alt="" style={{ width: 60, height: 60 }} />,
    },
    {
      title: '上线时间',
      dataIndex: 'upTime',
    },
    {
      title: '下线时间',
      dataIndex: 'downTime',
    },
    {
      title: '跳转地址',
      dataIndex: 'jumpUrl',
    },
    {
      title: '是否生效',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '轮播图顺序',
      dataIndex: 'sortRule',
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <Divider type="vertical" />
          <a
            onClick={() => {
              this.showUpdateModalBanner(record);
            }}
          >
            <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
          </a>
        </span>
      ),
    },
  ];

  columnsIcon = [
    {
      title: '名称',
      dataIndex: 'iconName',
    },
    {
      title: '图片',
      dataIndex: 'imgSrc',
      render: record => <img src={record} alt="" style={{ width: 60, height: 60 }} />,
    },
    {
      title: '跳转地址',
      dataIndex: 'jumpUrl',
    },
    {
      title: '是否生效',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: 'icon顺序',
      dataIndex: 'sortRule',
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <Divider type="vertical" />
          <a
            onClick={() => {
              this.showUpdateModalIcon(record);
            }}
          >
            <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
          </a>
        </span>
      ),
    },
  ];

  columnsGoodsList = [
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      render: record => <img src={record} alt="" style={{ width: 80, height: 80 }} />,
    },
    {
      title: '商品ID',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName',
    },
  ];

  columnsGoodsListLast = [
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      render: record => <img src={record} alt="" style={{ width: 80, height: 80 }} />,
    },
    {
      title: '商品ID',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'tab',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '店铺名称',
      dataIndex: 'ShopName',
      key: 'ShopName',
    },
  ];

  columnsGoodsList = [
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      render: record => <img src={record} alt="" style={{ width: 80, height: 80 }} />,
    },
    {
      title: '商品ID',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visible1: false,
      visible2: false,
      dataBanner: [],
      columnsBanner: this.columnsBanner,
      dataIcon: [],
      columnsIcon: this.columnsIcon,
      dataGoodsList: this.dataGoodsList,
      columnsGoodsList: this.columnsGoodsList,
      UpTime: '',
      DownTime: '',
      status: '',
      firstValue: '请选择',
      secondValue: '请选择',
      thirdValue: '请选择',
      fourthValue: '请选择',
      productName: '',
      userPhone: '',
      shopName: '',
      selectedRowKeys: [], // Check here to configure the default column
      bindTabSelectIsDisable: true,
      bindTab: '',
      changeSort: false,
      checkedData: '',
      checkedDataIcon: '',
      checkedDataBanner: '',
      fileName: '',
      uploadBannerData: [],
      uploadIconData: [],
      uploadMessage: '',
      uploadBannerError: true,
      uploadIconError: true,
      homePageIconBanner: '',
      homePageGoodsList: '',
      isDisable: true,
      tabList: [],
      dataBuffer: [],
      moveIndex: 0,
      editBannnerData: {},
      editIconData: {},
      isCanRequest: false,
      isCanRequest1: false,
      jumpUrlText: '',
      fileList: [],
      keyIndex: 0,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dragList/selectBanner',
    });
    dispatch({
      type: 'dragList/selectIcon',
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dragList/fetch',
    });
    dispatch({
      type: 'dragList/shopsList',
    });
    // this.props.dispatch({
    //   type: 'dragList/selectBanner',
    // });
  }

  componentDidUpdate() {
    const { isCanRequest, isCanRequest1 } = this.state;
    const { dispatch } = this.props;
    setTimeout(() => {
      if (isCanRequest) {
        this.setState({
          isCanRequest: false,
        });
        dispatch({
          type: 'dragList/selectBanner',
        });
      }
    }, 500);
    setTimeout(() => {
      if (isCanRequest1) {
        this.setState({
          isCanRequest1: false,
        });
        dispatch({
          type: 'dragList/selectIcon',
        });
      }
    }, 500);
  }

  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  componentBanner() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dragList/selectBanner',
    });
  }

  onSecondCityChange = value => {
    this.setState({
      secondCity: value,
    });
  };
  onThirdCityChange = value => {
    this.setState({
      firstValue: value,
    });
  };
  onFirstChange = value => {
    this.setState({
      firstValue: value,
      secondValue: '请选择',
      thirdValue: '请选择',
      fourthValue: '请选择',
    });
    this.props.dispatch({
      type: 'dragList/shopsList',
      payload: {
        parentId: value,
        status: 2,
        firstParent: this.props.dragList.updateData.data.firstParent,
      },
    });
  };
  onSecondChange = value => {
    console.log('value', value);
    this.setState({
      secondValue: value,
      thirdValue: '请选择',
      fourthValue: '请选择',
    });
    this.props.dispatch({
      type: 'dragList/shopsList',
      payload: {
        parentId: value,
        status: 3,
        firstParent: this.props.dragList.updateData.data.firstParent,
        secondParent: this.props.dragList.updateData.data.secondParent,
      },
    });
  };
  onThirdChange = value => {
    this.setState({
      thirdValue: value,
      fourthValue: '请选择',
    });
    this.props.dispatch({
      type: 'dragList/shopsList',
      payload: {
        parentId: value,
        status: 4,
        firstParent: this.props.dragList.updateData.data.firstParent,
        secondParent: this.props.dragList.updateData.data.secondParent,
        thirdParent: this.props.dragList.updateData.data.thirdParent,
      },
    });
  };
  onFourthChange = value => {
    console.log('value', value);
    this.setState({
      fourthValue: value,
      status: 3,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      visible1: false,
      visible2: false,
    });
  };

  bindTabSelect = value => {
    console.log(`selected ${value}`);
    this.setState({
      bindTab: value,
    });
  };
  bindTabInput = e => {
    this.setState({
      bindTab: e.target.value,
    });
    if (e.target.value) {
      this.setState({
        isDisable: false,
      });
    } else {
      this.setState({
        isDisable: true,
      });
    }
  };

  bindTabOk = () => {
    const bindTab = this.state.bindTab;
    const checkedArr = this.state.selectedRowKeys;
    checkedArr.map(e => {
      this.props.dragList.data.list[e]['type'] = bindTab;
    });
    console.log(this.props.dragList.data.list);
  };

  bindGoodsListOk = () => {
    this.setState({
      changeSort: true,
    });
  };

  onChangeUpTime = (date, dateString) => {
    console.log('dateString', dateString);
    this.setState({
      UpTime: dateString,
    });
  };

  onChangeDownTime = (date, dateString) => {
    console.log('dateString', dateString);
    this.setState({
      DownTime: dateString,
    });
  };
  showModalBanner = () => {
    this.setState({
      visible: true,
      status: 'showModalBanner',
      path: 'addBanner',
    });
  };

  showUpdateModalBanner = e => {
    console.log('dedede', e);
    this.setState({
      visible1: true,
      path: 'updateBannerList',
      editBannnerData: e,
    });
  };
  showUpdateModalIcon = e => {
    console.log('dedede1', e);
    this.setState({
      visible2: true,
      path: 'updateIconList',
      editIconData: e,
    });
  };
  showModalIcon = () => {
    this.setState({
      visible: true,
      status: 'showModalIcon',
      path: 'addIcon',
    });
  };

  nameChange = e => {
    console.log('value', e.target.value);
    this.setState({
      nameText: e.target.value,
    });
  };
  jumpUrlChange = e => {
    console.log('-----------------');
    console.log('wwwwwww', e.target.value);
    this.setState({
      jumpUrlText: e.target.value,
    });
  };
  statusChange = e => {
    console.log('qazwsx', e);
    this.setState({
      statusText: e,
    });
  };
  sortRuleChange = e => {
    console.log('value', e.target.value);
    this.setState({
      sortRuleText: e.target.value,
    });
  };

  showModal = e => {
    const { getFieldDecorator } = this.props.form;
    e = {
      bannerName: e.bannerName ? e.bannerName : '',
      upTime: e.upTime ? e.upTime : '',
      downTime: e.downTime ? e.downTime : '',
      jumpUrl: e.jumpUrl ? e.jumpUrl : '',
      status: e.status ? e.status : '',
      sortRule: e.sortRule ? e.sortRule : '',
    };
    return (
      <Modal
        title="修改轮播图"
        visible={this.state.visible1}
        //  onOk={this.handleOk}
        onCancel={this.handleCancel}
        onOk={this.handleUpdateSubmitBanner}
        destroyOnClose={true}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem label="名称">
            {getFieldDecorator('bannerName1', {
              // rules: [{ required: true, message: 'Please input your Name!' }],
              initialValue: e.bannerName,
            })(<Input placeholder="Name" onChange={this.nameChange} value={this.state.nameText} />)}
          </FormItem>
          <FormItem label="图片">
            {/*{getFieldDecorator('Img', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(*/}
            <Upload
              name="file"
              action={`${baseUrl}/index/upload`}
              type="post"
              listType="picture"
              supportServerRender={true}
              onChange={this.uploadFile}
              fileList={this.state.fileList}
            >
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>
            {/*)}*/}
          </FormItem>
          <FormItem label="上线时间">
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Select Time"
              onChange={this.onChangeUpTime}
              defaultValue={moment(e.upTime, 'YYYY/MM/DD HH:mm:ss')}
            />
          </FormItem>
          <FormItem label="下线时间">
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Select Time"
              onChange={this.onChangeDownTime}
              defaultValue={moment(e.downTime, 'YYYY/MM/DD HH:mm:ss')}
            />
          </FormItem>
          <FormItem label="跳转地址">
            {getFieldDecorator('jumpUrl1', {
              // rules: [{ required: true, message: 'Please input your jumpUrl!' }],
              initialValue: e.jumpUrl,
            })(
              <Input
                placeholder="跳转地址"
                onChange={this.jumpUrlChange}
                value={this.state.jumpUrlText}
              />
            )}
          </FormItem>
          <FormItem label="是否生效">
            {getFieldDecorator('status1', {
              // rules: [{ required: true, message: 'Please input your status!' }],
              initialValue: e.status,
            })(
              <Select
                placeholder="是否生效"
                style={{ width: '100%' }}
                onChange={this.statusChange}
                value={this.state.statusText}
              >
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('sortRule1', {
              // rules: [{ required: true, message: 'Please input your sortRule!' }],
              initialValue: e.sortRule,
            })(
              <Input
                placeholder="轮播图序列"
                onChange={this.sortRuleChange}
                value={this.state.sortRuleText}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  };

  showModal1 = e => {
    const { getFieldDecorator } = this.props.form;
    e = {
      iconName: e.iconName ? e.iconName : '',
      jumpUrl: e.jumpUrl ? e.jumpUrl : '',
      status: e.status ? e.status : '',
      sortRule: e.sortRule ? e.sortRule : '',
    };
    return (
      <Modal
        key={this.state.keyIndex}
        title="修改Icon"
        visible={this.state.visible2}
        // onOk={this.handleOk}
        onCancel={this.handleCancel}
        onOk={this.handleUpdateSubmitIcon}
        destroyOnClose={true}
      >
        <Form onSubmit={this.handleSubmitIcon} className="login-form">
          <FormItem label="名称">
            {getFieldDecorator('iconName', {
              // rules: [{ required: true, message: 'Please input your iconName!' }],
              initialValue: e.iconName,
            })(
              <Input
                placeholder="iconName"
                onChange={this.nameChange}
                value={this.state.nameText}
              />
            )}
          </FormItem>
          <FormItem label="图片">
            <Upload
              name="file"
              action={`${baseUrl}/index/upload`}
              type="post"
              listType="picture"
              supportServerRender={true}
              onChange={this.uploadFileIcon}
              fileList={this.state.fileList}
            >
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>
          </FormItem>
          <FormItem label="跳转地址">
            {getFieldDecorator('jumpUrl', {
              // rules: [{ required: true, message: 'Please input your jumpUrl!' }],
              initialValue: e.jumpUrl,
            })(
              <Input
                placeholder="跳转地址"
                onChange={this.jumpUrlChange}
                value={this.state.jumpUrlText}
              />
            )}
          </FormItem>
          <FormItem label="是否生效">
            {getFieldDecorator('status', {
              // rules: [{ required: true, message: 'Please input your status!' }],
              initialValue: e.status,
            })(
              <Select
                placeholder="是否生效"
                style={{ width: '100%' }}
                onChange={this.statusChange}
                value={this.state.statusText}
              >
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('sortRule', {
              // rules: [{ required: true, message: 'Please input your sortRule!' }],
              initialValue: e.sortRule,
            })(
              <Input
                placeholder="icon序列"
                onChange={this.sortRuleChange}
                value={this.state.sortRuleText}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  };

  handleSubmitBanner = e => {
    console.log('enter this');
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['upTime'] = this.state.UpTime;
        values['downTime'] = this.state.DownTime;
        if (this.state.uploadBannerError === false) {
          values['imgSrc'] = this.state.uploadBannerData;
        }
        console.log('addIndexBanner', values);
        const { dispatch } = this.props;
        dispatch({
          type: 'dragList/' + this.state.path,
          payload: values,
        });
        this.setState({
          visible: false,
          dataBanner: [...this.state.dataBanner, values],
          isCanRequest: true,
          fileList: [],
        });
        console.log('11111123', this.state.dataBanner);
      }
    });
  };

  handleUpdateSubmitBanner = () => {
    let updateIndexBanner = {};
    updateIndexBanner.id = this.state.editBannnerData.id;
    console.log(this.state.nameText);
    if (this.state.nameText === '' || this.state.nameText === undefined) {
      updateIndexBanner.bannerName = this.state.editBannnerData.bannerName;
    } else {
      updateIndexBanner.bannerName = this.state.nameText;
    }
    if (this.state.uploadBannerData.length <= 0) {
      updateIndexBanner.imgSrc = this.state.editBannnerData.imgSrc;
    } else {
      updateIndexBanner.imgSrc = this.state.uploadBannerData;
    }
    if (this.state.jumpUrlText === '') {
      updateIndexBanner.jumpUrl = this.state.editBannnerData.jumpUrl;
    } else {
      updateIndexBanner.jumpUrl = this.state.jumpUrlText;
    }
    if (this.state.UpTime === '') {
      updateIndexBanner.upTime = this.state.editBannnerData.upTime;
    } else {
      updateIndexBanner.upTime = this.state.UpTime;
    }
    if (this.state.DownTime === '') {
      updateIndexBanner.downTime = this.state.editBannnerData.downTime;
    } else {
      updateIndexBanner.downTime = this.state.DownTime;
    }
    if (this.state.statusText === undefined) {
      updateIndexBanner.status = this.state.editBannnerData.status;
    } else {
      updateIndexBanner.status = this.state.statusText;
    }
    if (this.state.sortRuleText === undefined) {
      updateIndexBanner.sortRule = this.state.editBannnerData.sortRule;
    } else {
      updateIndexBanner.sortRule = this.state.sortRuleText;
    }
    console.log('this.state111', this.state.editBannnerData);
    console.log('updateIndexBanner', updateIndexBanner, this.state);
    const { dispatch } = this.props;
    dispatch({
      type: 'dragList/' + this.state.path,
      payload: updateIndexBanner,
    });
    this.setState({
      visible1: false,
      isCanRequest: true,
      nameText: '',
      uploadBannerData: [],
      jumpUrlText: '',
      UpTime: '',
      DownTime: '',
      statusText: undefined,
      sortRuleText: undefined,
    });
  };

  handleSubmitIcon = e => {
    console.log('showModalIcon');
    console.log('enter this');
    e.preventDefault();
    console.log('qazwsx', this.props.form.validateFields);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.uploadIconError === false) {
          values['imgSrc'] = this.state.uploadIconData;
        }
        console.log('addIndexIcon', values);
        const { dispatch } = this.props;
        dispatch({
          type: 'dragList/' + this.state.path,
          payload: values,
        });
        this.setState({
          visible: false,
          dataIcon: [...this.state.dataIcon, values],
          isCanRequest1: true,
          fileList: [],
        });
      }
    });
  };

  handleUpdateSubmitIcon = () => {
    let { keyIndex } = this.state;
    keyIndex += 1;
    console.log('this.state111', this.state.uploadIconData);

    let updateIndexIcon = {};
    updateIndexIcon.id = this.state.editIconData.id;
    if (this.state.nameText === undefined) {
      updateIndexIcon.iconName = this.state.editIconData.iconName;
    } else {
      updateIndexIcon.iconName = this.state.nameText;
    }
    if (this.state.uploadIconData.length <= 0) {
      console.log('----------------------------');
      updateIndexIcon.imgSrc = this.state.editIconData.imgSrc;
    } else {
      console.log('+++++++++++++++++++++++++++');
      updateIndexIcon.imgSrc = this.state.uploadIconData;
    }
    if (this.state.jumpUrlText === '') {
      updateIndexIcon.jumpUrl = this.state.editIconData.jumpUrl;
    } else {
      updateIndexIcon.jumpUrl = this.state.jumpUrlText;
    }
    if (this.state.statusText === undefined) {
      console.log('121313141414', this.state.editIconData.status);
      updateIndexIcon.status = this.state.editIconData.status;
    } else {
      updateIndexIcon.status = this.state.statusText;
    }
    if (this.state.sortRuleText === undefined) {
      updateIndexIcon.sortRule = this.state.editIconData.sortRule;
    } else {
      updateIndexIcon.sortRule = this.state.sortRuleText;
    }
    console.log('updateIndexIcon', updateIndexIcon, this.state);
    const { dispatch } = this.props;
    dispatch({
      type: 'dragList/' + this.state.path,
      payload: updateIndexIcon,
    });
    this.setState({
      visible2: false,
      isCanRequest1: true,
      keyIndex: keyIndex,
      nameText: undefined,
      uploadIconData: [],
      jumpUrlText: '',
      statusText: undefined,
      sortRuleText: undefined,
    });
  };

  onRowGoodsList = e => {
    console.log(e);
    // moveIndex
    const { dataBuffer } = this.state;
    const { moveIndex } = this.state;
    // dataBuffer.pop(1);
    // dataBuffer.push(e);
    dataBuffer.splice(moveIndex, 1, e);
    console.log('dataBuffer', dataBuffer);
    this.setState({
      checkedData: e,
      dataBuffer,
    });
  };

  // handleProvinceChange = value => {
  //   this.setState({
  //     cities: cityData[value],
  //     secondCity: cityData[value][0],
  //   });
  // };

  onRowBanner = e => {
    this.setState({
      checkedDataBanner: e,
      dataBanner: e,
    });
    console.log('onRowBanner', e);
  };

  onRowIcon = e => {
    console.log('onRowIcon', e);
    this.setState({
      checkedDataIcon: e,
      dataIcon: e,
    });
  };

  InputFileName = e => {
    this.setState({
      fileName: e.target.value,
    });
  };

  // iconBannerOk = () => {
  //   const { checkedData, checkedDataIcon, checkedDataBanner } = this.state;
  //   let newCheckedData = '';
  //   if (checkedData) {
  //     newCheckedData = checkedData.map(e => {
  //       var ObjectArr = Object.keys(e);
  //       delete e[ObjectArr[0]];
  //       return e;
  //     });
  //   }
  //   const newData = {
  //     checkedDataIcon: checkedDataIcon ? checkedDataIcon : this.state.dataIcon,
  //     checkedDataBanner: checkedDataBanner ? checkedDataBanner : this.state.dataBanner,
  //   };
  //   const name = `homepage${this.state.fileName}Icon.json`;
  //   //this.doSave(JSON.stringify(newData), "json/json", name);
  //   const file = this.createFile(JSON.stringify(newData), 'json/json', name);
  //   // var formData = new FormData();
  //   // formData.append(name, file);
  //   // var request = new XMLHttpRequest();
  //   // request.open("POST", "/qcbossapi/upload.cfi");
  //   // request.send(formData);
  //   this.uploadData('/qcbossapi/upload.cfi', file);
  //   // this.setState({
  //   //   changeSort: false,
  //   // });
  //   // const data = {
  //   //   name: name,
  //   // }
  //   // this.props.dispatch({
  //   //   type: 'dragList/uploadName',
  //   //   payload: data,
  //   // });
  // };

  goBack = () => {
    this.setState({
      changeSort: false,
      isDisable: true,
    });
  };

  // 发送请求
  uploadData = (url, file) => {
    let formData = new FormData();
    formData.append('name', file);
    var request = new XMLHttpRequest();
    request.open('POST', url);
    request.send(formData);
    request.onload = e => {
      let response = e.currentTarget.response;
      response = JSON.parse(response);
      console.log('response', response, response.success, typeof response);
      if (response.success !== true) {
        Message.success('添加失败，请重试');
      } else {
        Message.success('添加成功');
        const name = response.data;
        this.setState({
          dataBuffer: [],
          tabList: [],
          changeSort: false,
        });
        const dataOfName = {
          name: name,
        };
        this.props.dispatch({
          type: 'dragList/uploadName',
          payload: dataOfName,
        });
      }
    };
  };
  // 写入文件
  doSave = (value, type, name) => {
    let blob;
    if (typeof window.Blob === 'function') {
      blob = new Blob([value], { type: type });
    } else {
      const BlobBuilder =
        window.BlobBuilder ||
        window.MozBlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MSBlobBuilder;
      const bb = new BlobBuilder();
      bb.append(value);
      blob = bb.getBlob(type);
    }
    //  upload
    const URL = window.URL || window.webkitURL;
    const bloburl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    if ('download' in anchor) {
      anchor.style.visibility = 'hidden';
      anchor.href = bloburl;
      anchor.download = name;
      document.body.appendChild(anchor);
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      anchor.dispatchEvent(evt);
      document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, name);
    } else {
      location.href = bloburl;
    }
  };
  // 创建文件
  createFile = (value, type, name) => {
    let blob;
    if (typeof window.Blob === 'function') {
      blob = new Blob([value], { type: type });
    } else {
      const BlobBuilder =
        window.BlobBuilder ||
        window.MozBlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MSBlobBuilder;
      const bb = new BlobBuilder();
      bb.append(value);
      blob = bb.getBlob(type);
    }
    var aafile = new File([blob], name);
    return aafile;
  };

  uploadJson = e => {
    console.log('json', e.file.response);
    const successResponse = e.file.response;
    console.log('this.props', this.props);
    if (successResponse && successResponse.success) {
      const jsonName = successResponse.data;
      const dataJsonName = {
        name: jsonName,
      };
      this.props.dispatch({
        type: 'dragList/uploadName',
        payload: dataJsonName,
      });
      Message.success(successResponse.err_msg);
    } else if (successResponse && successResponse.success == 'false') {
      Message.error(successResponse.err_msg);
    }
  };
  uploadFile = e => {
    const successResponse = e.file.response;
    console.log('eeewww', e.file.response);
    let fileList = e.fileList;
    fileList = fileList.slice(-1);
    console.log('eeewww123', fileList);
    this.setState({ fileList });
    if (successResponse && successResponse.code == 0) {
      this.setState({
        // ...this.state.uploadBannerData,
        uploadBannerData: e.file.response.data,
        uploadBannerError: false,
      });
      Message.success('上传成功');
    } else if (successResponse && successResponse.code != 0) {
      Message.error('上传失败');
    }
  };
  uploadFileIcon = e => {
    // const successResponse = e.file.response;
    // if (successResponse && successResponse.success) {
    //   this.setState({
    //     uploadIconData: [...this.state.uploadIconData, `${BaseUrl}/${successResponse.data}`],
    //     uploadBannerError: false,
    //   });
    //   Message.success(successResponse.err_msg);
    // } else if (successResponse && successResponse.success === false) {
    //   Message.error(successResponse.err_msg);
    // }
    const successResponse = e.file.response;
    console.log('eeewww', e.file.response);
    let fileList = e.fileList;
    fileList = fileList.slice(-1);
    console.log('eeewww123', fileList);
    this.setState({ fileList });
    if (successResponse && successResponse.code == 0) {
      console.log('--------------------------------------');
      this.setState({
        // ...this.state.uploadBannerData,
        uploadIconData: e.file.response.data,
        uploadIconError: false,
      });
      Message.success('上传成功');
    } else if (successResponse && successResponse.code != 0) {
      Message.error('上传失败');
    }
  };

  renderUpdate(updata) {
    const uploadCfg = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const renderMessage = () => {
      const { getFieldDecorator } = this.props.form;
      const statuses = this.state.status;
      if (statuses === 'showModalBanner') {
        return (
          <Modal
            title="添加轮播图"
            visible={this.state.visible}
            //  onOk={this.handleOk}
            onCancel={this.handleCancel}
            onOk={this.handleSubmitBanner}
            destroyOnClose={true}
          >
            <Form onSubmit={this.handleSubmitBanner} className="login-form">
              <FormItem label="名称">
                {getFieldDecorator('bannerName', {
                  rules: [{ required: true, message: 'Please input your Name!' }],
                  initialValue: '',
                })(<Input placeholder="Name" />)}
              </FormItem>
              <FormItem label="图片">
                {/*{getFieldDecorator('Img', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                })(*/}
                <Upload
                  name="file"
                  action={`${baseUrl}/index/upload`}
                  type="post"
                  listType="picture"
                  supportServerRender={true}
                  onChange={this.uploadFile}
                  fileList={this.state.fileList}
                >
                  <Button>
                    <Icon type="upload" /> Click to upload
                  </Button>
                </Upload>
                {/*)}*/}
              </FormItem>
              <FormItem label="上线时间">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Select Time"
                  onChange={this.onChangeUpTime}
                />
              </FormItem>
              <FormItem label="下线时间">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Select Time"
                  onChange={this.onChangeDownTime}
                />
              </FormItem>
              <FormItem label="跳转地址">
                {getFieldDecorator('jumpUrl', {
                  rules: [{ required: true, message: 'Please input your jumpUrl!' }],
                  initialValue: '',
                })(<Input placeholder="跳转地址" />)}
              </FormItem>
              <FormItem label="是否生效">
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: 'Please input your status!' }],
                  initialValue: '',
                })(
                  <Select placeholder="是否生效" style={{ width: '100%' }}>
                    <Option value="0">是</Option>
                    <Option value="1">否</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="排序">
                {getFieldDecorator('sortRule', {
                  rules: [{ required: true, message: 'Please input your sortRule!' }],
                  initialValue: '',
                })(<Input placeholder="轮播图序列" />)}
              </FormItem>
            </Form>
          </Modal>
        );
      } else if (statuses === 'showModalIcon') {
        return (
          <Modal
            title="添加Icon"
            visible={this.state.visible}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            onOk={this.handleSubmitIcon}
            destroyOnClose
          >
            <Form onSubmit={this.handleSubmitIcon} className="login-form">
              <FormItem label="名称">
                {getFieldDecorator('iconName', {
                  rules: [{ required: true, message: 'Please input your iconName!' }],
                  initialValue: '',
                })(<Input placeholder="iconName" />)}
              </FormItem>
              <FormItem label="图片">
                <Upload
                  name="file"
                  action={`${baseUrl}/index/upload`}
                  type="post"
                  listType="picture"
                  supportServerRender
                  onChange={this.uploadFileIcon}
                  fileList={this.state.fileList}
                >
                  <Button>
                    <Icon type="upload" /> Click to upload
                  </Button>
                </Upload>
              </FormItem>
              <FormItem label="跳转地址">
                {getFieldDecorator('jumpUrl', {
                  rules: [{ required: true, message: 'Please input your jumpUrl!' }],
                  initialValue: '',
                })(<Input placeholder="跳转地址" />)}
              </FormItem>
              <FormItem label="是否生效">
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: 'Please input your status!' }],
                  initialValue: '',
                })(
                  <Select placeholder="是否生效" style={{ width: '100%' }}>
                    <Option value="0">是</Option>
                    <Option value="1">否</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="排序">
                {getFieldDecorator('sortRule', {
                  rules: [{ required: true, message: 'Please input your sortRule!' }],
                  initialValue: '',
                })(<Input placeholder="icon序列" />)}
              </FormItem>
            </Form>
          </Modal>
        );
      }
    };
    if (updata === true) {
      return renderMessage();
    }
  }

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { dragList } = this.props;
    console.log('render---------------', dragList);
    // const firstParent =
    //   dragList.updateData && dragList.updateData.data ? dragList.updateData.data.firstParent : [];
    // const secondParent =
    //   dragList.updateData && dragList.updateData.data ? dragList.updateData.data.secondParent : [];
    // const thirdParent =
    //   dragList.updateData && dragList.updateData.data ? dragList.updateData.data.thirdParent : [];
    // const fourthParent =
    //   dragList.updateData && dragList.updateData.data ? dragList.updateData.data.fourthParent : [];
    // console.log('render---------------', dragList, firstParent);
    // const firstOptions = firstParent.map(e => <Option key={e.id}>{e.name}</Option>);
    // const secondOptions = secondParent.map(e => <Option key={e.id}>{e.name}</Option>);
    // const thirdOptions = thirdParent.map(e => <Option key={e.id}>{e.name}</Option>);
    // const fourthOptions = fourthParent.map(e => <Option key={e.id}>{e.name}</Option>);
    // const rowSelection = {
    //   selectedRowKeys: this.state.selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };
    let {
      dragList: { bannerList, iconList },
    } = this.props;
    if (bannerList && bannerList.list) {
      bannerList = bannerList.list;
    } else {
      bannerList = [];
    }
    if (iconList && iconList.list) {
      iconList = iconList.list;
    } else {
      iconList = [];
    }
    console.log('bannerList', bannerList);

    console.log('iconList', iconList);
    //  banner的数据
    const { editBannnerData } = this.state;
    // Icon的数据
    const { editIconData, changeSort, visible } = this.state;
    if (changeSort) {
      return this.renderChangeSort();
    } else {
      return (
        <div>
          {/*<Upload name="logo" action="qcbossapi/upload.cfi" type="post" listType="picture" supportServerRender={true} onChange={this.uploadJson}>
            <Button>
              <Icon type="upload" /> 上传json文件
            </Button>
      </Upload>*/}
          <Form>
            {this.showModal(editBannnerData)}
            {this.showModal1(editIconData)}
            {this.renderUpdate(visible)}
            {/* <Button type="primary" onClick={this.iconBannerOk} style={{ margin: 12 }}> 完成</Button> */}
            <FormItem label="轮播图">
              <Drag
                col={this.columnsBanner}
                data={bannerList}
                onRow={this.onRowBanner}
                hideOnSinglePage="true"
                destroyOnClose
              />
              <Button type="primary" onClick={this.showModalBanner}>
                添加
              </Button>
            </FormItem>
            <FormItem label="icon">
              <Drag col={this.columnsIcon} data={iconList} onRow={this.onRowIcon} />
              <Button type="primary" onClick={this.showModalIcon}>
                添加
              </Button>
            </FormItem>
          </Form>
        </div>
      );
    }
  }
}

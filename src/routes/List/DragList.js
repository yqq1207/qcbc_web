import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Divider,
  Modal,
  Table,
  Tabs,
  Button,
  Row,
  Col,
  Input,
  Upload,
  Icon,
  Message,
  Select,
  DatePicker,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { baseUrl } from '../../utils/base';

const { Option } = Select;
const FormItem = Form.Item;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const isSure = ['是', '否']
@connect(({ dragList, loading }) => ({
  dragList,
  loading: loading.models.dragList,
}))

@Form.create()
export default class GroupList extends Component {

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
      render(val) {
        return <span>{status[val]}</span>;
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
              this.toAddTab('editIcon', '添加Icon', record)
            }}
          >
            <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
          </a>
        </span>
      ),
    },
  ];

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
      render(val) {
        return <span>{status[val]}</span>;
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
              this.toAddTab('editBanner', '添加轮播图', record)
            }}
          >
            <Icon type="edit" style={{ fontSize: 16, color: '#08c' }} />
          </a>
        </span>
      ),
    },
  ];

  state = {
    isVisible: false,
    fileList: [],
    groups: 'selectBanner',
  };

  componentDidMount() {
    this.reload();
  }

  reload = (type) => {
    const { groups } = this.state;
    let newType = type;
    if (!type) {
      newType = groups
    }
    const { dispatch } = this.props;
    dispatch({
      type: `dragList/${newType}`,
    });
  }

  tableChange = e => {
    this.setState({
      groups: e,
    });
    this.reload(e);
  };

  toAddTab = (type, title, record) => {
    if (record) {
      this.setState({
        record,
      });
    }
    this.setState({
      isVisible: true,
      type,
      title,
    });
  };

  fetchList = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'search/searchlist',
      payload: { id },
    });
  };

  changeDatePicker = (value, dateString) => {
    this.setState({
      upTime: dateString[0],
      downTime: dateString[1],
    })
  }

  createAddForm = (record, type) => {
    console.log(record, type);
    const that = this;
    const props = {
      name: 'file',
      action: `${baseUrl}/index/upload`,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        that.setState({
          fileList: info.fileList,
        });
        if (info.file.status === 'done') {
          that.setState({
            url: info.file.response.data,
            isEditFile: true,
          });
          Message.success('上传成功');
        } else if (info.file.status === 'error') Message.error('上传失败');
      },
    };

    const {
      form: { getFieldDecorator },
    } = this.props;
    const { fileList, url } = this.state;

    let html = '';
    if (type) {
      const isBanner = type.indexOf('Banner') >= 0// 是对banner 还是 icon的操作
      const isEdit = type.indexOf('edit') >= 0 // 是对add 还是 edit的操作
      if (isBanner) {
        html = (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="banner名称">
                {getFieldDecorator('bannerName', {
                  rules: [{ required: true, message: '请输入banner名称!' }],
                  initialValue: isEdit ? record.bannerName : '',
                })(<Input placeholder="请输入banner名称" />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="图片地址">
                {getFieldDecorator('imgSrc', {
                  rules: [{ required: true, message: '请输入图片地址!' }],
                  initialValue: isEdit ? record.imgSrc : '',
                })(
                  <div>
                    <Upload {...props}>
                      {fileList.length >= 1 ? null : (
                        <Button>
                          <Icon type="upload" /> 上传
                        </Button>
                      )}
                    </Upload>
                    <Input
                      placeholder="请输入图片地址"
                      value={url}
                      style={{ width: 1, height: 1, opacity: 0 }}
                    />
                  </div>
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="生效失效时间">
                {getFieldDecorator('time', {
                  rules: [{ required: true, message: '请输入生效实效时间!' }],
                  initialValue: isEdit ? [moment(record.upTime, 'YYYY-MM-DD HH:mm:ss'), moment(record.downTime, 'YYYY-MM-DD HH:mm:ss')] : '',
                })(
                  <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['开始时间', '结束时间']}
                    onChange={this.changeDatePicker}
                  />
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="排序规则	">
                {getFieldDecorator('sortRule', {
                  rules: [{ required: true, message: '请输入排序规则!' }],
                  initialValue: isEdit ? record.sortRule : '',
                })(<Input type="number" placeholder="请输入排序" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="跳转地址	">
                {getFieldDecorator('jumpUrl', {
                  rules: [{ required: true, message: '请输入跳转地址!' }],
                  initialValue: isEdit ? record.jumpUrl : '',
                })(<Input placeholder="请输入跳转地址" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="是否生效	">
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请输入跳转地址!' }],
                  initialValue: isEdit ? record.sortRule : '',
                })(
                  <Select
                    placeholder="是否生效"
                    style={{ width: '100%' }}
                  >
                    <Option value="0">是</Option>
                    <Option value="1">否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        )
      } else {
        html = (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="Icon名称">
                {getFieldDecorator('iconName', {
                  rules: [{ required: true, message: '请输入Icon名称!' }],
                  initialValue: isEdit ? record.iconName : '',
                })(<Input placeholder="请输入Icon名称" />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="图片地址">
                {getFieldDecorator('imgSrc', {
                  rules: [{ required: true, message: '请输入图片地址!' }],
                  initialValue: isEdit ? record.imgSrc : '',
                })(
                  <div>
                    <Upload {...props}>
                      {fileList.length >= 1 ? null : (
                        <Button>
                          <Icon type="upload" /> 上传
                        </Button>
                      )}
                    </Upload>
                    <Input
                      placeholder="请输入图片地址"
                      value={url}
                      style={{ width: 1, height: 1, opacity: 0 }}
                    />
                  </div>
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="排序规则	">
                {getFieldDecorator('sortRule', {
                  rules: [{ required: true, message: '请输入排序规则!' }],
                  initialValue: isEdit ? record.sortRule : '',
                })(<Input type="number" placeholder="请输入排序" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="跳转地址	">
                {getFieldDecorator('jumpUrl', {
                  rules: [{ required: true, message: '请输入跳转地址!' }],
                  initialValue: isEdit ? record.jumpUrl : '',
                })(<Input placeholder="请输入跳转地址" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="是否生效	">
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请输入跳转地址!' }],
                  initialValue: isEdit ? record.status : '',
                })(
                  <Select
                    placeholder="是否生效"
                    style={{ width: '100%' }}
                  >
                    <Option value="0">是</Option>
                    <Option value="1">否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        )
      }
    }
    console.log('html', html)

    return html;
  };

  deleteTab = record => {
    const { id } = record || this.state;
    const { dispatch } = this.props;
    const that = this;
    const requestType = record ? 'second' : 'first';
    confirm({
      title: '确认删除该类目吗?',
      content: '你将要删除此类目',
      onOk() {
        dispatch({
          type: 'group/removeGroup',
          payload: { id },
          callback: () => {
            that.reload(requestType);
          },
        });
      },
      onCancel() { },
    });
  };

  handleCancel = () => {
    this.setState({
      isVisible: false,
      fileList: [],
      isEditFile: false,
    });
  };

  handleOk = () => {
    const { id, type, record, upTime, downTime } = this.state;
    // const indexSort = type.indexOf('First'); // 哪一级类目  -1 二级  >=0  一级
    // const indexType = type.indexOf('edit'); // 修改还是添加  -1 添加  >=0  修改
    const isBanner = type.indexOf('Banner') >= 0// 是对banner 还是 icon的操作
    const isEdit = type.indexOf('edit') >= 0 // 是对add 还是 edit的操作
    const { form, dispatch } = this.props;
    const that = this;
    form.validateFields((err, values) => {
      console.log(err)
      if (!err) {
        console.log('============')
        const { isEditFile, url } = this.state;
        let params = {};
        if (isBanner) {
          params = {
            ...values,
            upTime,
            downTime,
            imgSrc:url,
          }
          if (isEdit) {
            
            params = {
              ...params,
              upTime: params.time[0]['_i'],
              downTime: params.time[1]['_i'],
              id: record.id,
            }
          }
        } else {
          params = {
            ...values,
            imgSrc:url,
          };
          if (isEdit) {
            params = {
              ...params,
              id: record.id,
            }
          }
        }
        if(!isEditFile) params = {...params, imgSrc: record.imgSrc };
      // addBanner addIcon  selectBanner selectIcon updateBannerList updateIconList
        const requestUrl = isEdit ? 'update' : 'add';
        const requestType = isBanner ? 'Banner' : 'Icon';
        delete params.time;
        console.log(params, 'params');
        console.log(`${requestUrl}${requestType}`)
        dispatch({
          type: `dragList/${requestUrl}${requestType}`,
          payload: params,
          callback: (response) => {
            console.log(response)
            const { code } = response;
            if(code === 0) Message.success('操作成功');
            else Message.error('操作失败');
            that.setState({
              loading: false,
              isVisible: false,
              fileList: [],
              isEditFile: false,
            });
            that.reload();
          },
        });
      }
    });
  };

  showModal = (record, type, title) => {
    const { isVisible, loading } = this.state;
    return (
      <Modal
        visible={isVisible}
        title={title}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        {this.createAddForm(record, type)}
      </Modal>
    );
  };


  render() {
    const {
      dragList: { bannerList, iconList },
      loading,
    } = this.props;

    const { record, type, title } = this.state;

    return (
      <PageHeaderLayout title="类目管理">
        {this.showModal(record, type, title)}
        <Tabs onChange={this.tableChange}>
          <TabPane tab='banner' key='selectBanner'>
            <Button type="primary" onClick={() => this.toAddTab('addBanner', '添加轮播图')}>
              添加
            </Button>
            <Table
              loading={loading}
              dataSource={bannerList.list}
              columns={this.columnsBanner}
              onChange={this.handleStandarTableChange}
              pagenation={bannerList.pagenation}
            />
          </TabPane>
          <TabPane tab='icon' key='selectIcon'>
            <Button type="primary" onClick={() => this.toAddTab('addIcon', '添加Icon')}>
              添加
            </Button>
            <Table
              loading={loading}
              dataSource={iconList.list}
              columns={this.columnsIcon}
              onChange={this.handleStandarTableChange}
              pagenation={iconList.pagenation}
            />
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}

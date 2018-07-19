import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Table,
  Tabs,
  Button,
  Modal,
  Input,
  Message,
  Row,
  Col,
  Divider,
  Upload,
  Icon,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TabDetial from './TabDetial';
import { baseUrl } from '../../utils/base';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const buttonStyle = { margin: 10 };

@connect(({ tabList, loading, rule }) => ({
  tabList,
  loading: loading.models.tabList,
  rule,
}))
@Form.create()
export default class TabList extends Component {
  columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: val => <span title={val}>{val.substring(0, 5)}</span>,
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: val => <img src={val} alt="" style={{ width: 40, heihgt: 40 }} />,
    },
    {
      title: '排序',
      dataIndex: 'indexSort',
      key: 'indexSort',
    },
    {
      title: '新旧程度',
      dataIndex: 'oldnewdegree',
      key: 'oldnewdegree',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '服务',
      dataIndex: 'servicemarks',
      key: 'servicemarks',
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: record => (
        <div>
          <a onClick={() => this.remove(record, 'product')}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.editSortShow(record, 'editProducts')}>修改</a>
        </div>
      ),
    },
  ];

  state = {
    isShowModal: false,
    tabData: {},
    fileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'tabList/fetchList',
    })
      .then(() => {
        const {
          tabList: { list },
        } = this.props;
        this.setState({
          tabId: list[0] ? list[0].id : -1,
        });
        that.fetchList();
      })
      .catch(() => {
        this.setState({
          tabId: -1,
        });
        that.fetchList();
      });
  }

  onSubmitData = submitData => {
    const { dispatch } = this.props;
    const { tabId } = submitData[0];
    const params = {
      products: submitData,
    };
    dispatch({
      type: 'tabList/updateProdcutByTabId',
      payload: params,
    });
    setTimeout(() => {
      this.setState({
        showDetial: false,
      });
      dispatch({
        type: 'tabList/selectListByTabId',
        payload: {
          tabId,
          pageNum: 1,
          pageSize: 10,
        },
      });
    }, 1000);
  };

  onShowList = () => {
    this.setState({
      showDetial: false,
    });
  };

  goBack = () => {
    this.setState({
      showDetial: false,
    });
  };

  fetchList = id => {
    const { tabId } = this.state;
    let tabIds;
    if (id !== undefined) {
      tabIds = id;
    } else {
      tabIds = tabId;
    }
    const { dispatch } = this.props;
    const params = {
      tabId: tabIds,
      pageNum: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'tabList/selectListByTabId',
      payload: params,
    });
  };

  remove = record => {
    // delProduct
    const that = this;
    const { id } = record;
    Modal.confirm({
      title: '删除商品',
      content: '确定删除该商品吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.removeProduct(id);
      },
      onCancel() {},
    });
  };

  editSortShow = (record, type) => {
    const { id } = record;
    this.setState({
      sortId: id,
      // isShowModalEdit: true,
      isShowModal: true,
      record,
      isEditProduct: type,
    });
  };

  // 显示操作结果
  showResult = () => {
    const {
      tabList: { editResult },
    } = this.props;
    const isNull = JSON.stringify(editResult) === '{}';
    if (!isNull) {
      const { code, msg } = editResult;
      if (code < 0) Message.error(msg);
      else Message.success(msg);
    }
  };

  //  移除当前商品
  removeProduct = id => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'tabList/delProduct',
      payload: { id },
    }).then(() => {
      that.showResult();
      that.reload();
    });
    that.setState({
      isShowModalEdit: false,
    });
    setTimeout(() => {
      this.setState({
        isShowModalEdit: false,
      });
      this.reload();
    }, 1000);
  };

  tableChange = e => {
    const id = parseInt(e, 10);
    this.fetchList(id);
    this.setState({
      tabId: id,
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { tabId } = this.state;
    const params = {
      tabId,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'tabList/selectListByTabId',
      payload: params,
    });
  };

  // reload
  reload = () => {
    const { dispatch } = this.props;
    const { tabId } = this.state;
    const params = {
      tabId,
      pageNum: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'tabList/selectListByTabId',
      payload: params,
    });
  };

  // reloadAll
  reloadAll = () => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'tabList/fetchList',
    })
      .then(() => {
        const {
          tabList: { list },
        } = this.props;
        this.setState({
          tabId: list[0] ? list[0].id : -1,
        });
        that.fetchList();
      })
      .catch(() => {
        this.setState({
          tabId: -1,
        });
        that.fetchList();
      });
  };

  // 修改Tab
  editTabs = () => {
    const { tabId } = this.state;
    const {
      tabList: { list },
    } = this.props;
    const tabData = list.filter(item => item.id === tabId)[0];
    this.setState({
      tabData,
      tabType: true,
      isShowModal: true,
    });
  };

  // 修改Tab内容
  editTabDetial = () => {
    this.setState({
      showDetial: true,
    });
  };

  // 添加Tab
  addTabs = () => {
    const { isShowModal, tabData, tabType } = this.state;

    const text = tabType ? '添加' : '修改';
    return (
      <Modal
        title={`${text}Tab`}
        visible={isShowModal}
        onOk={() => this.handleOk(tabData)}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        {this.createForm(tabData, tabType)}
      </Modal>
    );
  };

  createForm = (tabData, tabType) => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { isEditProduct, fileList } = this.state;
    let html;
    let { record } = this.state;
    if (!record) record = { indexSort: '', name: '' };
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
    if (isEditProduct) {
      html = (
        <Form onSubmit={() => this.handleEditOk()}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="排序">
                {getFieldDecorator('indexSort', {
                  rules: [{ required: true, message: '请输入排序!' }],
                  initialValue: record ? record.indexSort : '',
                })(
                  <Input
                    type="number"
                    placeholder="请输入排序"
                    style={{ width: '100%' }}
                    onChange={this.changeEditSort}
                  />
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="图片上传">
                {getFieldDecorator('icon', {
                  rules: [{ required: true, message: '请输入图片地址!' }],
                  initialValue: record ? record.icon : '',
                })(
                  <div>
                    <Upload {...props}>
                      {fileList.length >= 1 ? null : (
                        <Button>
                          <Icon type="upload" /> 上传
                        </Button>
                      )}
                    </Upload>
                    {/* <Input placeholder="请输入图片地址" value={this.state.url} /> */}
                  </div>
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="商品名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入商品名!' }],
                  initialValue: record ? record.name : '',
                })(
                  <Input
                    type="text"
                    placeholder="请输入商品名"
                    defaultValue={record.name}
                    style={{ width: '100%' }}
                    onChange={this.changeEditName}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      );
    } else {
      html = (
        <Form onSubmit={() => this.handleOk(tabData)}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="Tab名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入Tab名!' }],
                  initialValue: tabType ? tabData.name : '',
                })(<Input placeholder="请输入Tab名" />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="排序">
                {getFieldDecorator('indexSort', {
                  rules: [{ required: true, message: '请输入排序!' }],
                  initialValue: tabType ? tabData.indexSort : '',
                })(<Input type="number" placeholder="请输入排序" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      );
    }
    return html;
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      console.log('uploading', info);
    }
    if (info.file.status === 'done') {
      const { fileList } = info;
      // Get this url from response in real world.
      console.log('done', info);
      this.setState({
        fileList: fileList[0],
      });
    }
  };

  beforeUpload = file => {
    const imgType = ['image/png', 'image/jpeg', 'image/bmp', 'image/jpg'];
    const { type } = file;
    const isImg = imgType.includes(type);
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImg) {
      Message.error('只能上传png，jpeg，img类型的图片');
    } else if (!isLt5M) {
      Message.error('图片必须小于5M!');
    }
    return isImg && isLt5M;
  };

  // 添加Tab
  editSort = () => {
    const { isShowModalEdit, fileList } = this.state;
    let { record } = this.state;
    const { url } = this.state;
    if (!record) record = { indexSort: '', name: '' };
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

    return (
      <Modal
        title="修改"
        visible={isShowModalEdit}
        onOk={() => this.handleEditOk()}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form onSubmit={() => this.handleEditOk()}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="排序">
                <Input
                  type="number"
                  defaultValue={record.indexSort}
                  placeholder="请输入排序"
                  style={{ width: '100%' }}
                  onChange={this.changeEditSort}
                />
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="图片上传">
                {/* <Upload
                  beforeUpload={this.beforeUpload}
                  action={`${baseUrl}/index/upload`}
                  onChange={this.handleChange}
                  listType='picture'
                  defaultFileList={fileList}
                >
                  <Button>
                    <Icon type="upload" /> 点击上传
                  </Button>
                </Upload> */}
                <Upload {...props}>
                  {fileList.length >= 1 ? null : (
                    <Button>
                      <Icon type="upload" /> 上传
                    </Button>
                  )}
                </Upload>
                <Input placeholder="请输入图片地址" value={url} />
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="商品名">
                <Input
                  type="text"
                  placeholder="请输入商品名"
                  defaultValue={record.name}
                  style={{ width: '100%' }}
                  onChange={this.changeEditName}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  };

  // 点击添加Tab
  toAddTab = () => {
    this.setState({
      isShowModal: true,
      tabType: false,
    });
  };

  handleCancel = () => {
    this.setState({
      isShowModal: false,
      isShowModalEdit: false,
      isEditProduct: '',
      fileList: [],
    });
  };

  // 删除tab
  deleteTab = () => {
    const { tabId } = this.state;
    const that = this;
    Modal.confirm({
      title: '删除Tab',
      content: '确定删除该Tab吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.removeTab(tabId);
      },
      onCancel() {},
    });
  };

  // 删除tab
  removeTab = id => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'tabList/delCustomTab',
      payload: { id },
    }).then(() => {
      that.showResult();
      that.reloadAll();
    });
  };

  // 添加Tab
  handleOk = data => {
    const { dispatch, form } = this.props;
    const that = this;
    const { isEditProduct, isEditFile, record, url } = this.state;
    const isNull = JSON.stringify(data) === '{}';
    const requestUrl = isNull ? 'addCustomTab' : 'updateCustomTab';
    form.validateFields((err, values) => {
      if (!err) {
        if (!isEditProduct) {
          let newValues = {};
          if (isNull) {
            newValues = {
              ...values,
            };
          } else {
            newValues = {
              ...values,
              id: data.id,
            };
          }
          dispatch({
            type: `tabList/${requestUrl}`,
            payload: newValues,
          }).then(() => {
            that.showResult();
            that.reloadAll();
          });
        } else {
          let newValues = values;
          if (isEditFile) {
            newValues = {
              ...newValues,
              image: url,
              id: record.id,
            };
          }
          dispatch({
            type: 'tabList/updateProductSort',
            payload: newValues,
          }).then(() => {
            that.showResult();
            that.reloadAll();
          });
        }
        that.setState({
          isShowModal: false,
          isEditProduct: '',
          fileList: [],
        });
      }
    });
  };

  //
  changeSort = e => {
    const val = e.target.value;
    this.setState({
      changeSort: val,
    });
  };

  handleEditOk = () => {
    const { dispatch } = this.props;
    const { changeSort, sortId } = this.state;
    const that = this;
    if (changeSort) {
      const params = {
        indexSort: changeSort,
        id: sortId,
      };
      dispatch({
        type: 'tabList/updateProductSort',
        payload: params,
      }).then(() => {
        that.showResult();
        that.reload();
      });
      this.setState({
        isShowModalEdit: false,
      });
    }
  };

  render() {
    const {
      tabList: { list, listDataByTab },
      loading,
    } = this.props;
    const pagination = {
      ...listDataByTab.pagination,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    const { showDetial, tabId } = this.state;

    if (showDetial) {
      return (
        <TabDetial
          data={tabId}
          goBack={this.goBack}
          onShowList={this.onShowList}
          onSubmitData={this.onSubmitData}
        />
      );
    } else {
      return (
        <PageHeaderLayout title="Tab列表">
          {this.addTabs()}
          {/* {this.editSort()} */}
          <div>
            <Button type="primary" onClick={this.toAddTab}>
              添加Tab
            </Button>
            <Button
              type="primary"
              disabled={list.length <= 0}
              style={buttonStyle}
              onClick={() => this.editTabs('sort')}
            >
              修改Tab
            </Button>
            <Button
              type="primary"
              disabled={list.length <= 0}
              style={buttonStyle}
              onClick={this.deleteTab}
            >
              删除Tab
            </Button>
            <Button
              type="primary"
              disabled={list.length <= 0}
              style={buttonStyle}
              onClick={this.editTabDetial}
            >
              新增产品
            </Button>
          </div>
          <Tabs onChange={this.tableChange}>
            {list.map(e => {
              return (
                <TabPane tab={e.name} key={e.id}>
                  <Table
                    loading={loading}
                    dataSource={listDataByTab.list}
                    columns={this.columns}
                    onChange={this.handleStandardTableChange}
                    pagination={pagination}
                  />
                </TabPane>
              );
            })}
          </Tabs>
        </PageHeaderLayout>
      );
    }
  }
}

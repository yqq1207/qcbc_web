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
  Cascader,
  Upload,
  Icon,
  Message,
  // Select,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { baseUrl } from '../../utils/base';

// const { Option } = Select;

const FormItem = Form.Item;
const { confirm } = Modal;
const { TabPane } = Tabs;
const buttonStyle = { margin: 10 };
// const fromType = [
//   {
//     value: 5,
//     text: '生活号',
//   },
//   {
//     value: 6,
//     text: '小程序',
//   },
//   {
//     value: 7,
//     text: '微信',
//   },
//   {
//     value: 8,
//     text: '京东小白',
//   },
// ];

@connect(({ group, loading }) => ({
  group,
  loading: loading.models.group,
}))
@Form.create()
export default class GroupList extends Component {
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
    },
    {
      title: '排序',
      dataIndex: 'sortRule',
      key: 'sortRule',
    },
    {
      title: '父级目录',
      dataIndex: 'parentId',
      key: 'parentId',
    },
    {
      title: 'icon',
      dataIndex: 'icon',
      key: 'icon',
      render: val => <img src={val} alt="" width={40} height={40} />,
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
          <a onClick={() => this.deleteTab(record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.toAddTab('editSecond', '修改', record)}>修改</a>
        </div>
      ),
    },
  ];

  state = {
    isVisible: false,
    fileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reload('first');
    dispatch({
      type: 'group/searchGroups',
    });
  }

  tableChange = e => {
    const { dispatch } = this.props;
    const id = parseInt(e, 10);
    this.fetchList(id);
    this.setState({
      id,
    });
    dispatch({
      type: 'group/fetchOperateCategorys',
      payload: { id: e },
    });
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

  handleChange = ({ fileList }) => this.setState({ fileList });

  createAddForm = (record, type) => {
    // const options = fromType.map(item => <Option value={item.value}>{item.text}</Option>);
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
      group: { groupData, cascader },
    } = this.props;
    const { id, fileList } = this.state; // 一级目录id
    let html;
    if (type) {
      const { url } = this.state;
      const indexSort = type.indexOf('First'); // 哪一级类目
      const indexType = type.indexOf('edit'); // 修改还是添加
      if (indexSort >= 0) {
        const DefaultValue = groupData.filter(item => item.id === id)[0];
        html = (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="类目名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入类目名!' }],
                  initialValue: indexType >= 0 ? DefaultValue.name : '',
                })(<Input placeholder="请输入类目名" />)}
              </FormItem>
            </Col>
            {/* <Col md={24} sm={24}>
              <FormItem label="类目名">
                {getFieldDecorator('from', {
                  rules: [{ required: true, message: '请输入类目名!' }],
                  initialValue: 5,
                })(<Select style={{ width: '100%' }}>{options}</Select>)}
              </FormItem>
            </Col> */}
            <Col md={24} sm={24}>
              <FormItem label="排序规则	">
                {getFieldDecorator('sortRule', {
                  rules: [{ required: true, message: '请输入排序规则!' }],
                  initialValue: indexType >= 0 ? DefaultValue.sortRule : '',
                })(<Input type="number" placeholder="请输入排序" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
        );
      } else if (indexSort < 0) {
        if (indexType >= 0) {
          html = (
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem label="类目名">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入类目名!' }],
                    initialValue: indexType >= 0 ? record.name : '',
                  })(<Input placeholder="请输入类目名" />)}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="排序规则	">
                  {getFieldDecorator('sortRule', {
                    rules: [{ required: true, message: '请输入排序规则!' }],
                    initialValue: indexType >= 0 ? record.sortRule : '',
                  })(<Input type="number" placeholder="请输入排序" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="图片地址">
                  {getFieldDecorator('icon', {
                    rules: [{ required: true, message: '请输入图片地址!' }],
                    initialValue: indexType >= 0 ? record.icon : '',
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
            </Row>
          );
        } else if (indexType < 0) {
          html = (
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem label="原类目id">
                  {getFieldDecorator('categoryIds', {
                    rules: [{ required: true, message: '请选择原类目id!' }],
                  })(
                    <Cascader
                      style={{ width: '100%' }}
                      options={cascader}
                      disabled={indexType >= 0 ? 'true' : false}
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="类目名">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入类目名!' }],
                    initialValue: indexType >= 0 ? record.name : '',
                  })(<Input placeholder="请输入类目名" />)}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="排序规则	">
                  {getFieldDecorator('sortRule', {
                    rules: [{ required: true, message: '请输入排序规则!' }],
                    initialValue: indexType >= 0 ? record.sortRule : '',
                  })(<Input type="number" placeholder="请输入排序" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="图片地址">
                  {getFieldDecorator('icon', {
                    rules: [{ required: true, message: '请输入图片地址!' }],
                    initialValue: indexType >= 0 ? record.icon : '',
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
            </Row>
          );
        }
      }
    }
    console.log(html, 'html')
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
      onCancel() {},
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
    const { id, type, record } = this.state;
    const indexSort = type.indexOf('First'); // 哪一级类目  -1 二级  >=0  一级
    const indexType = type.indexOf('edit'); // 修改还是添加  -1 添加  >=0  修改
    const { form, dispatch } = this.props;
    const that = this;
    form.validateFields((err, values) => {
      // values.imgSrc = thi
      const { isEditFile } = this.state;
      if (!err) {
        this.setState({
          loading: true,
        });
        let params;
        if (indexSort >= 0) {
          if (indexType >= 0) {
            params = {
              ...values,
              id,
            };
          } else {
            params = {
              ...values,
              type: 1,
            };
          }
        } else if (indexSort < 0) {
          if (indexType >= 0) {
            if (isEditFile) {
              params = {
                ...values,
                id: record.id,
                icon: that.state.url,
              };
            } else {
              params = {
                ...values,
                id: record.id,
              };
            }
          } else {
            params = {
              ...values,
              type: 2,
              id,
              icon: that.state.url,
            };
          }
        }
        const requestUrl = indexType >= 0 ? 'edit' : 'add';
        const requestType = indexSort >= 0 ? 'first' : 'second';
        dispatch({
          type: `group/${requestUrl}Group`,
          payload: params,
          callback: () => {
            that.setState({
              loading: false,
              isVisible: false,
              fileList: [],
              isEditFile: false,
            });
            that.reload(requestType);
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

  // reload
  reload(type) {
    const that = this;
    const { dispatch } = this.props;
    if (type) {
      const index = type.indexOf('first');
      if (index >= 0) {
        dispatch({
          type: 'group/fetchOperateCategory',
          // payload: { id: 0, from: 5 },
          payload: { id: 0 },
          callback: response => {
            const { data } = response;
            const { length } = data;
            if (length >= 1) {
              that.setState({
                id: data[0].id,
                record: data[0],
              });
              const id = data[0] ? data[0].id : -1;
              dispatch({
                type: 'group/fetchOperateCategorys',
                payload: { id },
              });
            }
          },
        });
      } else {
        const { id } = this.state;
        dispatch({
          type: 'group/fetchOperateCategorys',
          payload: { id },
        });
      }
    }
  }

  render() {
    const {
      group: { groupData, categoryData },
      loading,
    } = this.props;

    const { record, type, title } = this.state;

    const pagenation = {
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <PageHeaderLayout title="类目管理">
        {this.showModal(record, type, title)}
        <div>
          <Button type="primary" onClick={() => this.toAddTab('addFirst', '添加一级类目')}>
            添加一级类目
          </Button>
          <Button
            type="primary"
            style={buttonStyle}
            disabled={groupData.length <= 0}
            onClick={() => this.toAddTab('editFirst', '修改一级类目')}
          >
            修改一级类目
          </Button>
          <Button
            type="primary"
            style={buttonStyle}
            disabled={groupData.length <= 0}
            onClick={() => this.deleteTab()}
          >
            删除一级类目
          </Button>
        </div>
        <Tabs onChange={this.tableChange}>
          {groupData.map(e => {
            return (
              <TabPane tab={e.name} key={e.id}>
                <Button type="primary" onClick={() => this.toAddTab('addSecond', '添加二级类目')}>
                  添加二级类目
                </Button>
                <Table
                  loading={loading}
                  dataSource={categoryData}
                  columns={this.columns}
                  onChange={this.handleStandarTableChange}
                  pagenation={pagenation}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </PageHeaderLayout>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Form, Button, Modal, Row, Col, Input, Divider } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { confirm } = Modal;

@connect(({ search, loading }) => ({
  search,
  loading: loading.models.search,
}))
@Form.create()
export default class HotRecommend extends Component {
  columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'word',
      key: 'word',
    },
    {
      title: '排序',
      dataIndex: 'indexSort',
      key: 'indexSort',
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
          <a onClick={() => this.remove(record)}>删除</a>
          <Divider type="vertical" />
          {/* <a onClick={() => this.edit(record)}>修改</a> */}
          <a onClick={() => this.addHotRecommend('edit', record)}>修改</a>
        </div>
      ),
    },
  ];

  state = {
    isVisible: false,
    record: '',
  };

  componentDidMount() {
    this.reload();
  }

  // remove
  remove = record => {
    const { id } = record;
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: '确定删除吗?',
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'search/deleteHotRecommend',
          payload: { id },
          callback: () => {
            that.reload();
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // edit
  edit = record => {
    this.setState({
      isVisible: true,
      record,
    });
  };

  handleStandarTableChange = pagenation => {
    const { dispatch } = this.props;
    const params = {
      pageNum: pagenation.current,
      pageSize: pagenation.pageSize,
    };
    dispatch({
      type: 'search/fetchHotRecommend',
      payload: params,
    });
  };

  reload = () => {
    const { dispatch } = this.props;
    const params = {
      pageNum: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'search/fetchHotRecommend',
      payload: params,
    });
  };

  addHotRecommend = (type, record) => {
    this.setState({
      type,
      isVisible: true,
      loading: false,
      record,
    });
  };

  handleOk = () => {
    const { dispatch, form } = this.props;
    const { type, record } = this.state;
    const that = this;
    form.validateFields((err, values) => {
      if (!err) {
        let newValues = {
          ...values,
        };
        let url = 'addHotRecommend';
        if (type === 'edit') {
          newValues = {
            ...newValues,
            id: record.id,
          };
          url = 'editHotRecommend';
        }
        console.log(newValues);
        dispatch({
          type: `search/${url}`,
          payload: newValues,
          callback: () => {
            that.setState({
              isVisible: false,
            });
            that.reload();
          },
        });
      }
    });
  };

  createForm = (record, type) => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const html = (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <FormItem label="热门推荐">
            {getFieldDecorator('word', {
              rules: [{ required: true, message: '请输入热门推荐词!' }],
              initialValue: type === 'edit' ? record.word : '',
            })(<Input placeholder="请输入热门推荐词" />)}
          </FormItem>
        </Col>
        <Col md={24} sm={24}>
          <FormItem label="排序">
            {getFieldDecorator('indexSort', {
              rules: [{ required: true, message: '请输入排序!' }],
              initialValue: type === 'edit' ? record.indexSort : '',
            })(<Input type="number" placeholder="请输入排序" style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
      </Row>
    );
    return html;
  };

  handleCancel = () => {
    this.setState({
      isVisible: false,
    });
  };

  showAdd = (record, type) => {
    const { isVisible, loading } = this.state;

    return (
      <Modal
        visible={isVisible}
        title="添加热门推荐"
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
        {this.createForm(record, type)}
      </Modal>
    );
  };

  render() {
    const {
      search: { hotRecommend },
      loading,
    } = this.props;
    const { record, type } = this.state;
    const pagination = {
      ...hotRecommend.pagination,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '30', '40'],
    };
    return (
      <PageHeaderLayout title="热门词语、推荐词语">
        <div>
          <Button type="primary" onClick={() => this.addHotRecommend('add')}>
            添加热门搜索
          </Button>
        </div>
        {this.showAdd(record, type)}
        <Table
          loading={loading}
          dataSource={hotRecommend.list}
          columns={this.columns}
          onChange={this.handleStandarTableChange}
          pagination={pagination}
        />
      </PageHeaderLayout>
    );
  }
}

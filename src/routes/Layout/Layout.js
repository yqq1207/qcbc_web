import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Modal, Row, Col, Form, Input } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

@connect(({ layout, loading }) => ({
  layout,
  loading: loading.models.layout,
}))
@Form.create()
export default class HistoryList extends Component {
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
          <a onClick={() => this.edit(record)}>修改</a>
        </div>
      ),
    },
  ];

  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      pageNum: 10,
      pageSize: 1,
    };
    dispatch({
      type: 'layout/fetchList',
      payload: params,
    });
  }

  edit = record => {
    this.setState({
      isVisible: true,
      record,
    });
  };

  handleCancel = () => {
    this.setState({
      isVisible: false,
    });
  };

  handleOk = () => {
    const { dispatch, form } = this.props;
    const {
      record: { id },
    } = this.state;
    const that = this;
    form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          id,
        };
        dispatch({
          type: 'layout/editLayout',
          payload: params,
          callback: () => {
            that.setState({
              isVisible: false,
            });
            dispatch({
              type: 'layout/fetchList',
            });
          },
        });
      }
    });
  };

  showModal = record => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { isVisible } = this.state;

    return (
      <Modal
        visible={isVisible}
        title="修改排序"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem label="排序">
              {getFieldDecorator('indexSort', {
                rules: [{ required: true, message: '请输入排序!' }],
                initialValue: record ? record.indexSort : '',
              })(<Input type="number" placeholder="请输入Tab名" />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  };

  render() {
    const {
      layout: { layoutList },
      loading,
    } = this.props;

    const { record } = this.state;

    return (
      <PageHeaderLayout title="布局">
        {this.showModal(record)}
        <Table
          loading={loading}
          dataSource={layoutList.list}
          columns={this.columns}
          pagination={false}
        />
      </PageHeaderLayout>
    );
  }
}

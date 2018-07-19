import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Card, Form, Table, Button, Col, Row, Select, Input, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const status = ['待审核', '审核未通过', '审核通过'];
const shopStatus = [{
  value: 0,
  name: '正在审核',
}, {
  value: 1,
  name: '审核未通过',
}, {
  value: 2,
  name: '审核通过',
}];

@connect(({ productList, rule, loading }) => ({
  productList,
  rule,
  loading: loading.models.productList,
}))
@Form.create()
export default class ProductReviewList extends Component {
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
      title: '状态',
      dataIndex: 'auditState',
      render: val => <span>{status[val]}</span>,
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (record) => (
        <a
          onClick={() => this.review(record)}
          disabled={record.auditState === 0 ? false : true}
        >
          审核
        </a>
      ),
    },
  ];

  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productList/fetchList',
      payload: {
        auditState: 0,
      },
    });
  }

  review = (record) => {
    const { dispatch } = this.props;
    const { id } = record;
    dispatch(routerRedux.push({
      pathname: `/examine/product-detial/${id}`,
    }));
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
    };
    dispatch({
      type: 'productList/fetchList',
      payload: params,
    });
  };

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'productList/fetchList',
      payload: {},
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        createDate: fieldsValue.createDate ? moment(fieldsValue.createDate).format('YYYY-MM-DD') : undefined,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'productList/fetchList',
        payload: values,
      });
    });
  };

  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('auditState', {
                initialValue: 0,
              })(
                <Select placeholder="请选择审核状态" style={{ width: '100%' }}>
                  {shopStatus.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="店铺Id">
              {getFieldDecorator('shopId')(<Input placeholder="请输入店铺Id" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createDate')(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD"
                  placeholder="选择创建时间"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }

  render() {
    const {
      productList: { listData },
      loading,
    } = this.props;

    return (
      <PageHeaderLayout title="商品审核列表">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              dataSource={listData.list}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              pagination={listData.pagination}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

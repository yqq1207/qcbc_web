import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Table, Row, Col, Select, Button, Input, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ShopReviewDetialData from './ShopReviewDetialData';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const status = [
  '待审核',
  '审核未通过',
  '审核通过',
  '待审核',
  '审核未通过',
  '审核通过',
  '审核未通过',
];
const shopType = [
  {
    value: 1,
    name: '企业资质',
  },
  {
    value: 2,
    name: '店铺',
  },
  {
    value: 3,
    name: '品牌',
  },
];
const shopStatus = [
  {
    value: 0,
    name: '正在审核',
  },
  {
    value: 1,
    name: '审核未通过',
  },
  {
    value: 2,
    name: '审核通过',
  },
];

@connect(({ examineList, loading, rule }) => ({
  examineList,
  loading: loading.models.examineList,
  rule,
}))
@Form.create()
export default class ShopReviewList extends Component {
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
      dataIndex: 'status',
      render: val => <span>{status[val]}</span>,
    },
    {
      title: '店铺ID',
      dataIndex: 'shopId',
      key: 'shopId',
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: record => <a onClick={() => this.review(record)}>查看详细</a>,
    },
  ];

  state = {
    formValues: {
      type: 1,
    },
    showDetial: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'examineList/fetchList',
      payload: {
        type: 1,
      },
    });
  }

  review = record => {
    this.setState({
      showDetial: true,
      detialData: record,
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      page: pagination.current,
      rows: pagination.pageSize,
    };
    dispatch({
      type: 'examineList/fetchList',
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
      type: 'examineList/fetchList',
      payload: {
        type: 1,
      },
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
        type: fieldsValue.type ? fieldsValue.type : 1,
        createDate: fieldsValue.createDate
          ? moment(fieldsValue.createDate).format('YYYY-MM-DD')
          : undefined,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'examineList/fetchList',
        payload: values,
      });
    });
  };

  // 返回
  goback = isShow => {
    this.setState({
      showDetial: isShow,
    });
    const {
      examineList: {
        listData: { pagination },
      },
    } = this.props;
    this.handleStandardTableChange(pagination);
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="审核类型">
              {getFieldDecorator('type', {
                initialValue: 1,
              })(
                <Select placeholder="请选择审核类型" style={{ width: '100%' }}>
                  {shopType.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择审核状态" style={{ width: '100%' }}>
                  {shopStatus.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
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
                <DatePicker showTime format="YYYY-MM-DD" placeholder="选择创建时间" />
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
      examineList: { listData },
      loading,
    } = this.props;
    const { showDetial, detialData } = this.state;
    if (showDetial) {
      return (
        <ShopReviewDetialData
          data={detialData}
          goback={this.goback}
          onChange={this.handleStandardTableChange}
        />
      );
    } else {
      return (
        <PageHeaderLayout title=" 企业资质，店铺，品牌审核列表">
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
}

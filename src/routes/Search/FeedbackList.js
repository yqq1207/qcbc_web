import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ search, loading }) => ({
  search,
  loading: loading.models.search,
}))
export default class FeedbackList extends Component {
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
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      pageNum: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'search/fetchFeedbackList',
      payload: params,
    });
  }

  handleStandarTableChange = pagenation => {
    const { dispatch } = this.props;
    const params = {
      pageNum: pagenation.current,
      pageSize: pagenation.pageSize,
    };
    dispatch({
      type: 'search/fetchFeedbackList',
      payload: params,
    });
  };

  render() {
    const {
      search: { feedbackList },
      loading,
    } = this.props;
    const pagination = {
      ...feedbackList.pagination,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    return (
      <PageHeaderLayout title="用户反馈">
        <Table
          loading={loading}
          dataSource={feedbackList.list}
          columns={this.columns}
          onChange={this.handleStandarTableChange}
          pagination={pagination}
        />
      </PageHeaderLayout>
    );
  }
}

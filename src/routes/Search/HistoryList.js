import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ search, loading }) => ({
  search,
  loading: loading.models.search,
}))
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
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      pageNum: 10,
      pageSize: 1,
    };
    dispatch({
      type: 'search/fetchHistoryList',
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
      type: 'search/fetchHistoryList',
      payload: params,
    });
  };

  render() {
    const {
      search: { historyList },
      loading,
    } = this.props;
    const pagination = {
      ...historyList.pagination,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    return (
      <PageHeaderLayout title="用户历史记录">
        <Table
          loading={loading}
          dataSource={historyList.list}
          columns={this.columns}
          onChange={this.handleStandarTableChange}
          pagination={pagination}
        />
      </PageHeaderLayout>
    );
  }
}

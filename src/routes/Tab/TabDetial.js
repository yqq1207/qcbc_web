import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Table, Col, Card, Button, Row, Input } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

@connect(({ tabList, loading }) => ({
  tabList,
  loading: loading.models.tabList,
}))
@Form.create()
export default class TabDetial extends Component {
  columns = [
    {
      title: 'itemId',
      dataIndex: 'itemId',
      key: 'itemId',
      rowKey: 'itemId',
    },
    {
      title: '名称',
      dataIndex: 'productName',
      key: 'productName',
      render: val => <a title={val}>{val.substring(0, 5)}</a>,
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName',
      render: val => <a title={val}>{val.substring(0, 5)}</a>,
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
  ];

  checkedColumns = [
    {
      title: 'itemId',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: '名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
      render: val => <a title={val}>{val.substring(0, 5)}</a>,
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: record => <a onClick={() => this.remove(record)}>删除</a>,
    },
  ];

  state = {
    selectedRows: [],
    selectedRowsData: [],
  };

  componentDidMount() {
    const { data, dispatch } = this.props;
    const params = {
      tabId: data,
      pageNum: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'tabList/selectListByTabId',
      payload: params,
    });
    dispatch({
      type: 'tabList/selectAllList',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
    });
  }

  onSelect = (record, selected, selectedRows) => {
    let { selectedRowsData } = this.state;
    if (!selected) {
      const id = record.itemId;
      selectedRowsData = selectedRowsData.filter(item => item.itemId !== id);
    }
    this.setState({
      selectedRows,
      selectedRowsData,
    });
  };

  onSubmitData = () => {
    const { selectedRows, selectedRowsData } = this.state;
    const { data, onSubmitData } = this.props;
    const id = data;

    let newSelectRows = selectedRows.concat(selectedRowsData);
    newSelectRows = this.filterArr(newSelectRows);
    const submitData = newSelectRows.map((item, index) => {
      const { itemId, productName } = item;
      const submit = {
        itemId,
        indexSort: index,
        tabId: id,
        name: productName,
      };
      return submit;
    });
    onSubmitData(submitData);
  };

  // 页码
  handleStandardTableChange = pagination => {
    const { selectedRowsData, selectedRows, formValues } = this.state;
    const newSelectedRowsData = this.concatArr(selectedRows, selectedRowsData);
    this.setState({
      selectedRowsData: newSelectedRowsData,
      selectedRows: [],
    });
    const { dispatch } = this.props;
    const params = {
      id: formValues,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'tabList/selectAllList',
      payload: params,
    });
  };

  // 删除
  remove = record => {
    const removeId = record.itemId;
    const { selectedRowKeys, selectedRows, selectedRowsData } = this.state;
    const newSelectedRows = selectedRows.filter(item => item.itemId !== removeId);
    const newSelectedRowsData = selectedRowsData.filter(item => item.itemId !== removeId);
    this.setState({
      selectedRowKeys,
      selectedRows: newSelectedRows,
      selectedRowsData: newSelectedRowsData,
    });
  };

  //
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  goback = () => {
    const { onShowList } = this.props;
    onShowList(false);
  };

  // 合并去重
  concatArr = (arr1, arr2) => {
    // 不要直接使用var arr = arr1，这样arr只是arr1的一个引用，两者的修改会互相影响
    const arr = arr1.concat();
    // 或者使用slice()复制，var arr = arr1.slice(0)
    for (let i = 0; i < arr2.length; i += 1) {
      if (arr.indexOf(arr2[i]) === -1) arr.push(arr2[i]);
    }
    const newArr = this.filterArr(arr);

    return newArr;
  };

  // 去重
  filterArr = arr => {
    const newArr = [];
    for (let i = 0; i < arr.length; i += 1) {
      let flag = true;
      for (let j = 0; j < newArr.length; j += 1) {
        if (arr[i].itemId === newArr[j].itemId) {
          flag = false;
        }
      }
      if (flag) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'tabList/selectListByItemId',
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="商品Id">
              {getFieldDecorator('itemId')(<Input placeholder="请输入商品Id" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
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
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const {
      tabList: { totalData },
      loading,
    } = this.props;
    console.log('totalData', totalData);

    const { selectedRows, selectedRowsData } = this.state;
    let selectNewDat = selectedRowsData.concat(selectedRows);
    selectNewDat = this.filterArr(selectNewDat);
    return (
      <PageHeaderLayout title="新增产品">
        {this.renderForm()}
        <Col md={12} sm={24} style={{ marginRight: '1%' }}>
          <Card>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={totalData}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ y: 600, x: 800 }}
              onSelect={this.onSelect}
              selectNewDat={selectNewDat}
            />
          </Card>
        </Col>
        <Col md={11} sm={24}>
          <Card>
            <Table
              loading={loading}
              dataSource={selectNewDat}
              columns={this.checkedColumns}
              scroll={{ y: 600, x: 800 }}
            />
          </Card>
          <div>
            <Button
              type="primary"
              style={{ float: 'right' }}
              onClick={this.onSubmitData}
              disabled={selectNewDat.length <= 0}
            >
              提交
            </Button>
            <Button type="primary" style={{ float: 'right' }} onClick={this.goback}>
              返回
            </Button>
          </div>
        </Col>
      </PageHeaderLayout>
    );
  }
}

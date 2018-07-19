import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  // componentWillMount() {
  //   const { selectedRowKeys } = this.props;
  //   this.setState({
  //     selectedRowKeys,
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    // clean state
    // if (nextProps.selectedRows.length === 0) {
    //   const needTotalList = initTotalList(nextProps.columns);
    //   this.setState({
    //     // selectedRowKeys: this.props.selectedRowKeys,
    //     selectedRows: this.props.selectedRows,
    //     selectedRowKeys: [],
    //     needTotalList,
    //   });
    // } else {
    // const newkey = nextProps.selectedRows.map(i => i.itemId)
    const newkey = nextProps.selectNewDat.map(i => i.itemId);
    this.setState({
      selectedRowKeys: newkey,
    });
    // }
  }

  dadad = (record, selected, selectedRows) => {
    const { onSelect } = this.props;
    console.log(this.props);
    onSelect(record, selected, selectedRows);
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    // selectedRowKeys = selectedRows.map((item) => item.itemId);
    const selectedRowKeysEs = selectedRows.map(item => item.itemId);
    let { needTotalList } = this.state;
    needTotalList = [...needTotalList];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: selectedRowKeysEs, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    const { onChange } = this.props;
    onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys } = this.state;
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      scroll,
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      onSelect: this.dadad,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={rowKey || 'itemId'}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={scroll}
          onSelect={this.dadad}
        />
      </div>
    );
  }
}

export default StandardTable;

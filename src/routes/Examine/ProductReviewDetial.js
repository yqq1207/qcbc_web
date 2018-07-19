import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider, Button, Modal, Input, Message } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { TextArea } = Input;
const { Description } = DescriptionList;
const buttonStyle = {
  margin: '10px',
};
const status = ['待审核', '审核未通过', '审核通过'];

@connect(({ productList, loading, profile }) => ({
  productList,
  loading: loading.effects['productList/fetchDetial'],
  profile,
}))
export default class ProductReviewDetial extends Component {
  state = {
    isShowModal: false,
    inputIdea: '',
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'productList/fetchDetial',
      payload: { id },
    });
    this.setState({
      productId: id,
    });
  }

  // 点击审核意见按钮
  handleReview = review => {
    this.setState({
      isShowModal: true,
      review,
    });
  };

  // 审核意见
  inputIdea = e => {
    const { value } = e.target;
    this.setState({
      inputIdea: value,
    });
  };

  goback = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { inputIdea, review, productId } = this.state;
    if (!inputIdea) Message.error('请输入理由');
    else {
      const params = {
        reason: inputIdea,
        confirmType: review,
        id: productId,
      };
      dispatch({
        type: 'productList/updateProduct',
        payload: params,
      });
      this.handleCancel();
    }
  };

  handleCancel = () => {
    this.setState({
      isShowModal: false,
      inputIdea: '',
    });
  };

  // modal
  showModal = () => {
    const { isShowModal, review } = this.state;
    const result = review ? '通过' : '拒绝';
    if (!isShowModal) return null;
    return (
      <Modal
        title={`审核${result}`}
        visible={isShowModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <TextArea rows={4} placeholder={`请输入${result}理由`} onChange={this.inputIdea} />
      </Modal>
    );
  };

  render() {
    const {
      productList: { productDetial },
    } = this.props;
    if (productDetial.code !== 0 && JSON.stringify(productDetial.data) === '{}') {
      return null;
    } else {
      const { product } = productDetial.data;
      return (
        <PageHeaderLayout title="商品详细">
          {this.showModal()}
          <Card bordered={false}>
            <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
              <Description term="创建时间">{product.createdAt}</Description>
              <Description term="商品名称 ">{product.name}</Description>
              <Description term="审核状态">{status[product.auditState]}</Description>
              <Description term="商品ID">{product.id}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="详细信息" style={{ marginBottom: 32 }}>
              <iframe
                src={product.detail}
                title="详细信息"
                width="100%"
                height="400px"
                frameBorder="0"
              />
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="操作" style={{ marginBottom: 32 }}>
              <Button type="primary" style={buttonStyle} onClick={() => this.handleReview(2)}>
                拒绝
              </Button>
              <Button type="danger" style={buttonStyle} onClick={() => this.handleReview(1)}>
                通过
              </Button>
              <Button type="primary" style={{ float: 'right' }} onClick={this.goback}>
                返回
              </Button>
            </DescriptionList>
          </Card>
        </PageHeaderLayout>
      );
    }
  }
}

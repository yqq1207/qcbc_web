import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider, Button, Modal, Input, Message } from 'antd';
import moment from 'moment';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { TextArea } = Input;
const { Description } = DescriptionList;
const buttonStyle = {
  margin: '10px',
};
const titleList = ['企业资质', '店铺', '品牌详细'];
const shopStatus = [
  '待填写店铺信息',
  '待提交品牌信息',
  '正在审核',
  '审核不通过',
  '审核通过',
  '准备开店',
  '开店',
];
const isLocked = ['否', '是'];
const statusBols = [false, true, true, false, true, true];

@connect(({ examineList, profile, loading }) => ({
  examineList,
  profile,
  loading: loading.models.examineList,
}))
export default class ShopReviewDetial extends Component {
  state = {
    isShowModal: false,
    inputIdea: '',
  };

  componentDidMount() {
    const {
      dispatch,
      data: { id, type, status },
    } = this.props;
    const statusBol = statusBols[status];
    dispatch({
      type: 'examineList/fetchDetial',
      payload: { id, type },
    });
    this.setState({
      id,
      type,
      statusBol,
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
    this.setState({
      inputIdea: e.target.value,
    });
  };

  goback = () => {
    const { goback } = this.props;
    goback(false);
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { inputIdea, review, id, type } = this.state;
    const that = this;
    if (!inputIdea) Message.error('请输入理由');
    else {
      const params = {
        reason: inputIdea,
        confirmType: review,
        id,
        type,
      };
      dispatch({
        type: 'examineList/confirm',
        payload: params,
      })
        .then(() => {
          that.showResult();
        })
        .catch(() => that.showResult());
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

  // 显示操作结果
  showResult = () => {
    const {
      examineList: { editResult },
    } = this.props;
    const isNull = JSON.stringify(editResult) === '{}';
    if (!isNull) {
      const { code, msg } = editResult;
      if (code < 0) Message.error(msg);
      else {
        Message.success(msg);
        setTimeout(() => {
          this.goback();
        }, 1000);
      }
    }
  };

  render() {
    const {
      examineList: { enterpriseDetial, shopDetial, shopBrand },
    } = this.props;
    let {
      data: { type },
    } = this.props;
    type = parseInt(type, 10);
    const { ShopEnterpriseCertificates, shopEnterpriseInfos } = enterpriseDetial;
    const { shop } = shopDetial;
    const { shopBrandCertificates, shopBrands } = shopBrand;
    const { statusBol } = this.state;
    const title = titleList[type - 1];

    const enterPrise = () => {
      if (type === 1) {
        return (
          <div>
            <DescriptionList size="large" title="图片信息" style={{ marginBottom: 32 }}>
              <img
                src={ShopEnterpriseCertificates[0] ? ShopEnterpriseCertificates[0].image : ''}
                alt=""
                style={{ width: '100%' }}
              />
            </DescriptionList>
            <DescriptionList size="large" title="个人信息" style={{ marginBottom: 32 }}>
              <Description term="法人姓名">{shopEnterpriseInfos.realname}</Description>
              <Description term="法人电话">{shopEnterpriseInfos.telephone}</Description>
              <Description term="联系人姓名">{shopEnterpriseInfos.contactName}</Description>
              <Description term="联系人电话">{shopEnterpriseInfos.contactTelephone}</Description>
              <Description term="联系人QQ">{shopEnterpriseInfos.contactQq}</Description>
              <Description term="联系人邮箱">{shopEnterpriseInfos.contactEmail}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="企业信息" style={{ marginBottom: 32 }}>
              <Description term="企业名称">{shopEnterpriseInfos.name}</Description>
              <Description term="企业注册资金">
                {shopEnterpriseInfos.registrationCapital}
              </Description>
              <Description term="营业执照号">{shopEnterpriseInfos.businessLicenseNo}</Description>
              <Description term="生效日期">
                {moment(shopEnterpriseInfos.licenseStart).format('YYYY-MM-DD HH:mm:ss')}
              </Description>
              <Description term="失效日期">
                {moment(shopEnterpriseInfos.licenseEnd).format('YYYY-MM-DD HH:mm:ss')}
              </Description>
              <Description term="执照所在省">{shopEnterpriseInfos.businessLicenseNo}</Description>
            </DescriptionList>
          </div>
        );
      } else if (type === 2) {
        return (
          <div>
            <DescriptionList size="large" title="店铺信息" style={{ marginBottom: 32 }}>
              <Description term="创建时间">{shop.createdAt}</Description>
              <Description term="店铺名称">{shop.name}</Description>
              <Description term="店铺状态">{shopStatus[shop.status]}</Description>
              <Description term="店铺开店时间">{shop.openTime}</Description>
              <Description term="审核通过时间">{shop.approvalTime}</Description>
              <Description term="是否被冻结">{isLocked[shop.isLocked]}</Description>
              <Description term="冻结时间">{shop.lockedTime}</Description>
              <Description term="是否被封">{isLocked[shop.isDisabled]}</Description>
              <Description term="是否被激活">{isLocked[shop.isActive]}</Description>
              <Description term="是否优质商家">{isLocked[shop.isHighQuality]}</Description>
            </DescriptionList>
          </div>
        );
      } else if (type === 3) {
        return (
          <div>
            <DescriptionList size="large" title="图片信息" style={{ marginBottom: 32 }}>
              {shopBrandCertificates.map(item => <img src={item ? item.src : ''} alt="" />)}
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="品牌信息" style={{ marginBottom: 32 }}>
              <Description term="品牌名称">{shopBrands.name}</Description>
              <Description term="品牌描述">{shopBrands.description}</Description>
              <Description term="生效日期">
                {moment(shopBrands.authStart).format('YYYY-MM-DD HH:mm:ss')}
              </Description>
              <Description term="失效日期">
                {moment(shopBrands.authEnd).format('YYYY-MM-DD HH:mm:ss')}
              </Description>
            </DescriptionList>
          </div>
        );
      }
    };

    return (
      <PageHeaderLayout title={`${title}详情`}>
        {this.showModal()}
        <Card bordered={false}>
          {enterPrise()}
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="操作" style={{ marginBottom: 32 }}>
            <Button
              type="danger"
              style={buttonStyle}
              onClick={() => this.handleReview(1)}
              disabled={statusBol}
            >
              通过
            </Button>
            <Button
              type="primary"
              style={buttonStyle}
              onClick={() => this.handleReview(2)}
              disabled={statusBol}
            >
              拒绝
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

import React, { useEffect, useState } from 'react';
import { API, isMobile, showError, showInfo, showSuccess } from '../../helpers';
import {
  renderNumber,
  renderQuota,
  renderQuotaWithAmount,
} from '../../helpers/render';
import {
  Col,
  Layout,
  Row,
  Typography,
  Card,
  Button,
  Form,
  Divider,
  Space,
  Modal,
  Toast,
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import { Link } from 'react-router-dom';



const getUserLanguage = () => {
    const lang = navigator.language || navigator.userLanguage;
    if (lang.startsWith('zh-Hant') || lang === 'zh-TW' || lang === 'zh-HK') {
        return 'zh-Hant'; // 繁体中文
    } else if (lang.startsWith('zh')) {
        return 'zh'; // 简体中文
    } else {
        return 'en'; // 默认英文
    }
};

const translations = {
  'enterRedemptionCode': {
    'zh-Hant': '请输入兑换码！',
    'zh': '请输入兑换码！',
    'en': 'Please enter the redemption code!'
  },
  'topUpSuccess': {
    'zh-Hant': '兑换成功！',
    'zh': '兑换成功！',
    'en': 'Top-up successful!'
  },
  'topUpSuccessMessage': {
    'zh-Hant': '成功兑换额度：',
    'zh': '成功兑换额度：',
    'en': 'Successfully redeemed amount:'
  },
  'requestFailed': {
    'zh-Hant': '请求失败',
    'zh': '请求失败',
    'en': 'Request failed'
  },
  'topUpLinkNotSet': {
    'zh-Hant': '超级管理员未设置充值链接！',
    'zh': '超级管理员未设置充值链接！',
    'en': 'The super admin has not set the top-up link!'
  },
  'onlineTopUpNotEnabled': {
    'zh-Hant': '管理员未开启在线充值！',
    'zh': '管理员未开启在线充值！',
    'en': 'The admin has not enabled online top-up!'
  },
  'topUpAmountTooLow': {
    'zh-Hant': '充值数量不能小于',
    'zh': '充值数量不能小于',
    'en': 'Top-up amount cannot be less than'
  },
  'paymentMethodNotSet': {
    'zh-Hant': '请选择支付方式！',
    'zh': '请选择支付方式！',
    'en': 'Please select a payment method!'
  },
  'topUpError': {
    'zh-Hant': '充值失败，请重试！',
    'zh': '充值失败，请重试！',
    'en': 'Top-up failed, please try again!'
  },
    'myWallet': {
    'zh-Hant': '我的錢包',
    'zh': '我的钱包',
    'en': 'My Wallet'
  },
  'topUpConfirmation': {
    'zh-Hant': '確定要充值嗎',
    'zh': '确定要充值吗',
    'en': 'Are you sure you want to top up?'
  },
  'topUpAmount': {
    'zh-Hant': '充值數量：',
    'zh': '充值数量：',
    'en': 'Top-up amount:'
  },
  'payAmount': {
    'zh-Hant': '實付金額：',
    'zh': '实付金额：',
    'en': 'Amount to be paid:'
  },
  'confirmTopUp': {
    'zh-Hant': '是否確認充值？',
    'zh': '是否确认充值？',
    'en': 'Do you confirm the top-up?'
  },
  'balance': {
    'zh-Hant': '餘額',
    'zh': '余额',
    'en': 'Balance'
  },
  'redeemCode': {
    'zh-Hant': '兌換碼',
    'zh': '兑换码',
    'en': 'Redemption Code'
  },
  'getRedemptionCode': {
    'zh-Hant': '獲取兌換碼',
    'zh': '获取兑换码',
    'en': 'Get Redemption Code'
  },
  'redeem': {
    'zh-Hant': '兌換',
    'zh': '兑换',
    'en': 'Redeem'
  },
  'redeeming': {
    'zh-Hant': '兌換中...',
    'zh': '兑换中...',
    'en': 'Redeeming...'
  },
  'onlineRecharge': {
    'zh-Hant': '在線充值',
    'zh': '在线充值',
    'en': 'Online Recharge'
  },
  'payByAlipay': {
    'zh-Hant': '支付寶',
    'zh': '支付宝',
    'en': 'Alipay'
  },
  'payByWeChat': {
    'zh-Hant': '微信',
    'zh': '微信',
    'en': 'WeChat'
  },
  'topUpHistory': {
    'zh-Hant': '充值記錄',
    'zh': '充值记录',
    'en': 'Top-up History'
  }
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言







const TopUp = () => {
  const [redemptionCode, setRedemptionCode] = useState('');
  const [topUpCode, setTopUpCode] = useState('');
  const [topUpCount, setTopUpCount] = useState(0);
  const [minTopupCount, setMinTopUpCount] = useState(1);
  const [amount, setAmount] = useState(0.0);
  const [minTopUp, setMinTopUp] = useState(1);
  const [topUpLink, setTopUpLink] = useState('');
  const [enableOnlineTopUp, setEnableOnlineTopUp] = useState(false);
  const [userQuota, setUserQuota] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [payWay, setPayWay] = useState('');

const topUp = async () => {
  if (redemptionCode === '') {
    showInfo(getTranslation('enterRedemptionCode', userLanguage));
    return;
  }
  setIsSubmitting(true);
  try {
    const res = await API.post('/api/user/topup', {
      key: redemptionCode,
    });
    const { success, message, data } = res.data;
    if (success) {
      showSuccess(getTranslation('topUpSuccess', userLanguage));
      Modal.success({
        title: getTranslation('topUpSuccess', userLanguage),
        content: getTranslation('topUpSuccessMessage', userLanguage) + renderQuota(data),
        centered: true,
      });
      setUserQuota((quota) => {
        return quota + data;
      });
      setRedemptionCode('');
    } else {
      showError(message);
    }
  } catch (err) {
    showError(getTranslation('requestFailed', userLanguage));
  } finally {
    setIsSubmitting(false);
  }
};

const openTopUpLink = () => {
  if (!topUpLink) {
    showError(getTranslation('topUpLinkNotSet', userLanguage));
    return;
  }
  window.open(topUpLink, '_blank');
};

const preTopUp = async (payment) => {
  if (!enableOnlineTopUp) {
    showError(getTranslation('onlineTopUpNotEnabled', userLanguage));
    return;
  }
  await getAmount();
  if (topUpCount < minTopUp) {
    showError(getTranslation('topUpAmountTooLow', userLanguage) + minTopUp);
    return;
  }
  setPayWay(payment);
  setOpen(true);
};

const onlineTopUp = async () => {
  if (amount === 0) {
    await getAmount();
  }
  if (topUpCount < minTopUp) {
    showError(getTranslation('topUpAmountTooLow', userLanguage) + minTopUp);
    return;
  }
  setOpen(false);
  try {
    const res = await API.post('/api/user/pay', {
      amount: parseInt(topUpCount),
      top_up_code: topUpCode,
      payment_method: payWay,
    });
    if (res !== undefined) {
      const { message, data } = res.data;
      if (message === 'success') {
        let params = data;
        let url = res.data.url;
        let form = document.createElement('form');
        form.action = url;
        form.method = 'POST';
        let isSafari =
          navigator.userAgent.indexOf('Safari') > -1 &&
          navigator.userAgent.indexOf('Chrome') < 1;
        if (!isSafari) {
          form.target = '_blank';
        }
        for (let key in params) {
          let input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = params[key];
          form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      } else {
        showError(data);
      }
    } else {
      showError(getTranslation('topUpError', userLanguage));
    }
  } catch (err) {
    console.log(err);
  } finally {
    }
  };










const getUserQuota = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      setUserQuota(data.quota);
    } else {
      showError(message);
    }
};

useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      if (status.top_up_link) {
        setTopUpLink(status.top_up_link);
      }
      if (status.min_topup) {
        setMinTopUp(status.min_topup);
      }
      if (status.enable_online_topup) {
        setEnableOnlineTopUp(status.enable_online_topup);
      }
    }
    getUserQuota().then();
}, []);

const renderAmount = () => {
    return amount + 'RMB';
};

const getAmount = async (value) => {
    if (value === undefined) {
      value = topUpCount;
    }
    try {
      const res = await API.post('/api/user/amount', {
        amount: parseFloat(value),
        top_up_code: topUpCode,
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          setAmount(parseFloat(data));
        } else {
          setAmount(0);
          Toast.error({ content: getTranslation('topUpError', userLanguage), id: 'getAmount' });
        }
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
};

const handleCancel = () => {
    setOpen(false);
};

return (
    <div>
      <Layout>
        <Layout.Header>
          <h3>{getTranslation('myWallet', userLanguage)}</h3>
        </Layout.Header>
        <Layout.Content>
          <Modal
            title={getTranslation('topUpConfirmation', userLanguage)}
            visible={open}
            onOk={onlineTopUp}
            onCancel={handleCancel}
            maskClosable={false}
            size={'small'}
            centered={true}
          >
            <p>{getTranslation('topUpAmount', userLanguage)}{topUpCount}</p>
            <p>{getTranslation('payAmount', userLanguage)}{renderAmount()}</p>
            <p>{getTranslation('confirmTopUp', userLanguage)}</p>
          </Modal>
          <div
            style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}
          >
            <Card style={{ width: '500px', padding: '20px' }}>
              <Title level={3} style={{ textAlign: 'center' }}>
                {getTranslation('balance', userLanguage)} {renderQuota(userQuota)}
              </Title>
              <div style={{ marginTop: 20 }}>
                <Divider>{getTranslation('redeem', userLanguage)}</Divider>
                <Form>
                  <Form.Input
                    field={'redemptionCode'}
                    label={getTranslation('redeemCode', userLanguage)}
                    placeholder={getTranslation('redeemCode', userLanguage)}
                    name='redemptionCode'
                    value={redemptionCode}
                    onChange={(value) => {
                      setRedemptionCode(value);
                    }}
                  />
                  <Space>
                    {topUpLink ? (
                      <Button
                        type={'primary'}
                        theme={'solid'}
                        onClick={openTopUpLink}
                      >
                        {getTranslation('getRedemptionCode', userLanguage)}
                      </Button>
                    ) : null}
                    <Button
                      type={'warning'}
                      theme={'solid'}
                      onClick={topUp}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? getTranslation('redeeming', userLanguage) : getTranslation('redeem', userLanguage)}
                    </Button>
                  </Space>
                </Form>
              </div>
              <div style={{ marginTop: 20 }}>
                <Divider>{getTranslation('onlineRecharge', userLanguage)}</Divider>
                <Form>
                  <Form.Input
                    disabled={!enableOnlineTopUp}
                    field={'redemptionCount'}
                    label={getTranslation('payAmount', userLanguage) + renderAmount()}
                    placeholder={getTranslation('topUpAmountTooLow', userLanguage) + renderQuotaWithAmount(minTopUp)}
                    name='redemptionCount'
                    type={'number'}
                    value={topUpCount}
                    onChange={async (value) => {
                      if (value < 1) {
                        value = 1;
                      }
                      setTopUpCount(value);
                      await getAmount(value);
                    }}
                  />
                  <Space>
                    <Button
                      type={'primary'}
                      theme={'solid'}
                      onClick={async () => {
                        preTopUp('zfb');
                      }}
                    >
                      {getTranslation('payByAlipay', userLanguage)}
                    </Button>
                    <Button
                      style={{
                        backgroundColor: 'rgba(var(--semi-green-5), 1)',
                      }}
                      type={'primary'}
                      theme={'solid'}
                      onClick={async () => {
                        preTopUp('wx');
                      }}
                    >
                      {getTranslation('payByWeChat', userLanguage)}
                    </Button>
                  </Space>
                </Form>
              </div>
            </Card>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default TopUp;

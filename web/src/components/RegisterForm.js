import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API, getLogo, showError, showInfo, showSuccess, updateAPI } from '../helpers';
import Turnstile from 'react-turnstile';
import { Button, Card, Divider, Form, Icon, Layout, Modal } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import { IconGithubLogo } from '@douyinfe/semi-icons';
import { onGitHubOAuthClicked, onLinuxDOOAuthClicked } from './utils.js';
import LinuxDoIcon from './LinuxDoIcon.js';
import WeChatIcon from './WeChatIcon.js';
import TelegramLoginButton from 'react-telegram-login/src';
import { setUserData } from '../helpers/data.js';



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
  sessionExpired: { en: 'Not logged in or session has expired, please log in again!', zh: '未登录或登录已过期，请重新登录！', 'zh-Hant': '未登入或登入已過期，請重新登入！' },
  waitTurnstile: { en: 'Please wait a few seconds to retry, Turnstile is checking the user environment!', zh: '请稍后几秒重试，Turnstile 正在检查用户环境！', 'zh-Hant': '請稍後幾秒重試，Turnstile 正在檢查用戶環境！' },
  loginSuccess: { en: 'Login Successful!', zh: '登录成功！', 'zh-Hant': '登入成功！' },
  enterCredentials: { en: 'Please enter username and password!', zh: '请输入用户名和密码！', 'zh-Hant': '請輸入用戶名和密碼！' },
  defaultPasswordWarning: { en: 'You are using the default password!', zh: '您正在使用默认密码！', 'zh-Hant': '您正在使用預設密碼！' },
  defaultPasswordMessage: { en: 'Please change the default password immediately!', zh: '请立刻修改默认密码！', 'zh-Hant': '請立即修改預設密碼！' },
  wechatScan: { en: 'WeChat Scan to Login', zh: '微信扫码登录', 'zh-Hant': '微信掃碼登入' },
  submitButtonText: { en: 'Submit', zh: '提交', 'zh-Hant': '提交' },
  registerSuccess: { en: 'Registration successful!', zh: '注册成功！', 'zh-Hant': '註冊成功！' },
  passwordMismatch: { en: 'The two entered passwords do not match', zh: '两次输入的密码不一致', 'zh-Hant': '兩次輸入的密碼不一致' },
  passwordTooShort: { en: 'Password length must be at least 8 characters!', zh: '密码长度不得小于 8 位！', 'zh-Hant': '密碼長度不得小於 8 位！' },
  sendVerificationCodeSuccess: { en: 'Verification code sent successfully, please check your email!', zh: '验证码发送成功，请检查你的邮箱！', 'zh-Hant': '驗證碼發送成功，請檢查你的郵箱！' },
  wechatVerificationSuccess: { en: 'WeChat login successful!', zh: '微信登录成功！', 'zh-Hant': '微信登入成功！' },
  turnstileCheckMessage: { en: 'Please wait a few seconds to retry, Turnstile is checking the user environment!', zh: '请稍后几秒重试，Turnstile 正在检查用户环境！', 'zh-Hant': '請稍後幾秒重試，Turnstile 正在檢查用戶環境！' },
    newUserRegister: { en: 'New User Registration', zh: '新用户注册', 'zh-Hant': '新用戶註冊' },
  username: { en: 'Username', zh: '用户名', 'zh-Hant': '用戶名' },
  password: { en: 'Password', zh: '密码', 'zh-Hant': '密碼' },
  confirmPassword: { en: 'Confirm Password', zh: '确认密码', 'zh-Hant': '確認密碼' },
  passwordPlaceholder: { 
    en: 'Password, at least 8 characters, maximum 20 characters', 
    zh: '密码，最短 8 位，最长 20 位', 
    'zh-Hant': '密碼，最短 8 位，最長 20 位' 
  },
  confirmPasswordPlaceholder: { en: 'Confirm Password', zh: '确认密码', 'zh-Hant': '確認密碼' },
  email: { en: 'Email', zh: '邮箱', 'zh-Hant': '郵箱' },
  emailPlaceholder: { en: 'Enter email address', zh: '输入邮箱地址', 'zh-Hant': '輸入郵箱地址' },
  verificationCode: { en: 'Verification Code', zh: '验证码', 'zh-Hant': '驗證碼' },
  verificationCodePlaceholder: { en: 'Enter Verification Code', zh: '输入验证码', 'zh-Hant': '輸入驗證碼' },
  getVerificationCode: { en: 'Get Verification Code', zh: '获取验证码', 'zh-Hant': '獲取驗證碼' },
  register: { en: 'Register', zh: '注册', 'zh-Hant': '註冊' },
  alreadyHaveAccount: { en: 'Already have an account? ', zh: '已有账户？', 'zh-Hant': '已有賬戶？' },
  loginHere: { en: 'Click to Login', zh: '点击登录', 'zh-Hant': '點擊登入' },
  thirdPartyLogin: { en: 'Third-Party Login', zh: '第三方登录', 'zh-Hant': '第三方登入' },
  wechatScanLogin: { en: 'WeChat Scan to Login', zh: '微信扫码登录', 'zh-Hant': '微信掃碼登入' },
  wechatInstructions: { 
    en: 'Scan the QR code with WeChat, send "Verification Code" to get the code (valid for 3 minutes)', 
    zh: '微信扫码关注公众号，输入「验证码」获取验证码（三分钟内有效）', 
    'zh-Hant': '微信掃碼關注公眾號，輸入「驗證碼」獲取驗證碼（三分鐘內有效）' 
  },
  submit: { en: 'Submit', zh: '提交', 'zh-Hant': '提交' },
  turnstileMessage: { 
    en: 'Please wait a few seconds to retry, Turnstile is checking the user environment!', 
    zh: '请稍后几秒重试，Turnstile 正在检查用户环境！', 
    'zh-Hant': '請稍後幾秒重試，Turnstile 正在檢查用戶環境！' 
  }
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言
















const RegisterForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    verification_code: ''
  });
  const { username, password, password2 } = inputs;
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);
  const [status, setStatus] = useState({});
  let navigate = useNavigate();
  const logo = getLogo();

  let affCode = new URLSearchParams(window.location.search).get('aff');
  if (affCode) {
    localStorage.setItem('aff', affCode);
  }

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
      setShowEmailVerification(status.email_verification);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  });

  const onWeChatLoginClicked = () => {
    setShowWeChatLoginModal(true);
  };

  const onSubmitWeChatVerificationCode = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(getTranslation('turnstileCheckMessage', userLanguage));
      return;
    }
    const res = await API.get(
      `/api/oauth/wechat?code=${inputs.wechat_verification_code}`,
    );
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      setUserData(data);
      updateAPI();
      navigate('/');
      showSuccess(getTranslation('wechatVerificationSuccess', userLanguage));
      setShowWeChatLoginModal(false);
    } else {
      showError(message);
    }
  };

  function handleChange(name, value) {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (password.length < 8) {
      showInfo(getTranslation('passwordTooShort', userLanguage));
      return;
    }
    if (password !== password2) {
      showInfo(getTranslation('passwordMismatch', userLanguage));
      return;
    }
    if (username && password) {
      if (turnstileEnabled && turnstileToken === '') {
        showInfo(getTranslation('turnstileCheckMessage', userLanguage));
        return;
      }
      setLoading(true);
      if (!affCode) {
        affCode = localStorage.getItem('aff');
      }
      inputs.aff_code = affCode;
      const res = await API.post(
        `/api/user/register?turnstile=${turnstileToken}`,
        inputs
      );
      const { success, message } = res.data;
      if (success) {
        navigate('/login');
        showSuccess(getTranslation('registerSuccess', userLanguage));
      } else {
        showError(message);
      }
      setLoading(false);
    }
  }

  const sendVerificationCode = async () => {
    if (inputs.email === '') return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(getTranslation('turnstileCheckMessage', userLanguage));
      return;
    }
    setLoading(true);
    const res = await API.get(
      `/api/verification?email=${inputs.email}&turnstile=${turnstileToken}`
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess(getTranslation('sendVerificationCodeSuccess', userLanguage));
    } else {
      showError(message);
    }
    setLoading(false);
  };
  
  
  
  
  
  

  return (
    <div>
      <Layout>
        <Layout.Header></Layout.Header>
        <Layout.Content>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              marginTop: 120,
            }}
          >
            <div style={{ width: 500 }}>
              <Card>
                <Title heading={2} style={{ textAlign: 'center' }}>
                  {getTranslation('newUserRegister', userLanguage)}
                </Title>
                <Form size="large">
                  <Form.Input
                    field={'username'}
                    label={getTranslation('username', userLanguage)}
                    placeholder={getTranslation('username', userLanguage)}
                    name="username"
                    onChange={(value) => handleChange('username', value)}
                  />
                  <Form.Input
                    field={'password'}
                    label={getTranslation('password', userLanguage)}
                    placeholder={getTranslation('passwordPlaceholder', userLanguage)}
                    name="password"
                    type="password"
                    onChange={(value) => handleChange('password', value)}
                  />
                  <Form.Input
                    field={'password2'}
                    label={getTranslation('confirmPassword', userLanguage)}
                    placeholder={getTranslation('confirmPasswordPlaceholder', userLanguage)}
                    name="password2"
                    type="password"
                    onChange={(value) => handleChange('password2', value)}
                  />
                  {showEmailVerification ? (
                    <>
                      <Form.Input
                        field={'email'}
                        label={getTranslation('email', userLanguage)}
                        placeholder={getTranslation('emailPlaceholder', userLanguage)}
                        onChange={(value) => handleChange('email', value)}
                        name="email"
                        type="email"
                        suffix={
                          <Button onClick={sendVerificationCode} disabled={loading}>
                            {getTranslation('getVerificationCode', userLanguage)}
                          </Button>
                        }
                      />
                      <Form.Input
                        field={'verification_code'}
                        label={getTranslation('verificationCode', userLanguage)}
                        placeholder={getTranslation('verificationCodePlaceholder', userLanguage)}
                        onChange={(value) => handleChange('verification_code', value)}
                        name="verification_code"
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  <Button
                    theme="solid"
                    style={{ width: '100%' }}
                    type={'primary'}
                    size="large"
                    htmlType={'submit'}
                    onClick={handleSubmit}
                  >
                    {getTranslation('register', userLanguage)}
                  </Button>
                </Form>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}
                >
                  <Text>
                    {getTranslation('alreadyHaveAccount', userLanguage)}
                    <Link to="/login">{getTranslation('loginHere', userLanguage)}</Link>
                  </Text>
                </div>
                {status.github_oauth ||
                status.wechat_login ||
                status.telegram_oauth ||
                status.linuxdo_oauth ? (
                  <>
                    <Divider margin="12px" align="center">
                      {getTranslation('thirdPartyLogin', userLanguage)}
                    </Divider>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 20,
                      }}
                    >
                      {status.github_oauth && (
                        <Button
                          type="primary"
                          icon={<IconGithubLogo />}
                          onClick={() =>
                            onGitHubOAuthClicked(status.github_client_id)
                          }
                        />
                      )}
                      {status.linuxdo_oauth && (
                        <Button
                          icon={<LinuxDoIcon />}
                          onClick={() =>
                            onLinuxDOOAuthClicked(status.linuxdo_client_id)
                          }
                        />
                      )}
                      {status.wechat_login && (
                        <Button
                          type="primary"
                          style={{ color: 'rgba(var(--semi-green-5), 1)' }}
                          icon={<Icon svg={<WeChatIcon />} />}
                          onClick={onWeChatLoginClicked}
                        />
                      )}
                    </div>
                    {status.telegram_oauth && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: 5,
                        }}
                      >
                        <TelegramLoginButton
                          dataOnauth={onTelegramLoginClicked}
                          botName={status.telegram_bot_name}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Card>
              <Modal
                title={getTranslation('wechatScanLogin', userLanguage)}
                visible={showWeChatLoginModal}
                maskClosable={true}
                onOk={onSubmitWeChatVerificationCode}
                onCancel={() => setShowWeChatLoginModal(false)}
                okText={getTranslation('submit', userLanguage)}
                size={'small'}
                centered={true}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <img src={status.wechat_qrcode} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p>{getTranslation('wechatInstructions', userLanguage)}</p>
                </div>
                <Form size="large">
                  <Form.Input
                    field={'wechat_verification_code'}
                    placeholder={getTranslation('verificationCodePlaceholder', userLanguage)}
                    label={getTranslation('verificationCode', userLanguage)}
                    value={inputs.wechat_verification_code}
                    onChange={(value) =>
                      handleChange('wechat_verification_code', value)
                    }
                  />
                </Form>
              </Modal>
              {turnstileEnabled && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}
                >
                  <Turnstile
                    sitekey={turnstileSiteKey}
                    onVerify={(token) => {
                      setTurnstileToken(token);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default RegisterForm;

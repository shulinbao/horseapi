import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { API, showError, showInfo, showSuccess } from '../helpers';
import Turnstile from 'react-turnstile';







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
  'password_reset': {
    'en': 'Password Reset',
    'zh': '密码重置',
    'zh-Hant': '密碼重置'
  },
  'email_address': {
    'en': 'Email Address',
    'zh': '邮箱地址',
    'zh-Hant': '郵箱地址'
  },
  'submit': {
    'en': 'Submit',
    'zh': '提交',
    'zh-Hant': '提交'
  },
  'retry': {
    'en': 'Retry',
    'zh': '重试',
    'zh-Hant': '重試'
  },
  'reset_email_sent': {
    'en': 'Reset email sent, please check your inbox!',
    'zh': '重置邮件发送成功，请检查邮箱！',
    'zh-Hant': '重置郵件發送成功，請檢查郵箱！'
  },
  'please_wait_turnstile': {
    'en': 'Please wait a few seconds, Turnstile is checking the user environment!',
    'zh': '请稍后几秒重试，Turnstile 正在检查用户环境！',
    'zh-Hant': '請稍後幾秒重試，Turnstile 正在檢查用戶環境！'
  }
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言






















const PasswordResetForm = () => {
  const [inputs, setInputs] = useState({
    email: '',
  });
  const { email } = inputs;

  const [loading, setLoading] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let countdownInterval = null;
    if (disableButton && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setDisableButton(false);
      setCountdown(30);
    }
    return () => clearInterval(countdownInterval);
  }, [disableButton, countdown]);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    setDisableButton(true);
    if (!email) return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(getTranslation('please_wait_turnstile', userLanguage));
      return;
    }
    setLoading(true);
    const res = await API.get(
      `/api/reset_password?email=${email}&turnstile=${turnstileToken}`,
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess(getTranslation('reset_email_sent', userLanguage));
      setInputs({ ...inputs, email: '' });
    } else {
      showError(message);
    }
    setLoading(false);
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '48px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='' textAlign='center'>
          <Image src='/logo.png' /> {getTranslation('password_reset', userLanguage)}
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='mail'
              iconPosition='left'
              placeholder={getTranslation('email_address', userLanguage)}
              name='email'
              value={email}
              onChange={handleChange}
            />
            {turnstileEnabled ? (
              <Turnstile
                sitekey={turnstileSiteKey}
                onVerify={(token) => {
                  setTurnstileToken(token);
                }}
              />
            ) : (
              <></>
            )}
            <Button
              color='green'
              fluid
              size='large'
              onClick={handleSubmit}
              loading={loading}
              disabled={disableButton}
            >
              {disableButton ? `${getTranslation('retry', userLanguage)} (${countdown})` : getTranslation('submit', userLanguage)}
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default PasswordResetForm;

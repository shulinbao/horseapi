import React from 'react';
import TokensTable from '../../components/TokensTable';
import { Banner, Layout } from '@douyinfe/semi-ui';



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
  'bannerWarning': {
    'zh-Hant': '令牌無法精確控制使用額度，請勿直接將令牌分發給用戶。',
    'zh': '令牌无法精确控制使用额度，请勿直接将令牌分发给用户。',
    'en': 'Tokens cannot precisely control usage limits, do not distribute tokens directly to users.'
  }
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言



const Token = () => (
  <>
    <Layout>
      <Layout.Header>
		<Banner
		type="warning"
		description={getTranslation('bannerWarning', userLanguage)}
		/>
      </Layout.Header>
      <Layout.Content>
        <TokensTable />
      </Layout.Content>
    </Layout>
  </>
);

export default Token;

import React, { useEffect, useState } from 'react';
import { Layout, TabPane, Tabs } from '@douyinfe/semi-ui';
import { useNavigate, useLocation } from 'react-router-dom';

import SystemSetting from '../../components/SystemSetting';
import { isRoot } from '../../helpers';
import OtherSetting from '../../components/OtherSetting';
import PersonalSetting from '../../components/PersonalSetting';
import OperationSetting from '../../components/OperationSetting';


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
    "personalSetting": {
        "zh-Hant": "個人設定",
        "zh": "个人设置",
        "en": "Personal Settings"
    },
    "operationSetting": {
        "zh-Hant": "運營設定",
        "zh": "运营设置",
        "en": "Operation Settings"
    },
    "systemSetting": {
        "zh-Hant": "系統設定",
        "zh": "系统设置",
        "en": "System Settings"
    },
    "otherSetting": {
        "zh-Hant": "其他設定",
        "zh": "其他设置",
        "en": "Other Settings"
    }
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言



const Setting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabActiveKey, setTabActiveKey] = useState('1');
let panes = [
    {
        tab: getTranslation('personalSetting', userLanguage),
        content: <PersonalSetting />,
        itemKey: 'personal',
    },
];

if (isRoot()) {
    panes.push({
        tab: getTranslation('operationSetting', userLanguage),
        content: <OperationSetting />,
        itemKey: 'operation',
    });
    panes.push({
        tab: getTranslation('systemSetting', userLanguage),
        content: <SystemSetting />,
        itemKey: 'system',
    });
    panes.push({
        tab: getTranslation('otherSetting', userLanguage),
        content: <OtherSetting />,
        itemKey: 'other',
    });
}
  const onChangeTab = (key) => {
    setTabActiveKey(key);
    navigate(`?tab=${key}`);
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setTabActiveKey(tab);
    } else {
      onChangeTab('personal');
    }
  }, [location.search]);
  return (
    <div>
      <Layout>
        <Layout.Content>
          <Tabs
            type='line'
            activeKey={tabActiveKey}
            onChange={(key) => onChangeTab(key)}
          >
            {panes.map((pane) => (
              <TabPane itemKey={pane.itemKey} tab={pane.tab} key={pane.itemKey}>
                {tabActiveKey === pane.itemKey && pane.content}
              </TabPane>
            ))}
          </Tabs>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default Setting;

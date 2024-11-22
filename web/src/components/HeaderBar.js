import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { useSetTheme, useTheme } from '../context/Theme';

import { setStatusData } from '../helpers/data.js';


import { API, getLogo, getSystemName, isMobile, isAdmin, showSuccess } from '../helpers';
import '../index.css';

import fireworks from 'react-fireworks';

import {
  IconHelpCircle,
  IconHome,
  IconHomeStroked,
  IconKey,
  IconComment,
  IconNoteMoneyStroked,
  IconPriceTag,
  IconLayers,
  IconGift,
  IconCreditCard,
  IconHistogram,
  IconCalendarClock,
  IconSetting,
  IconUser
} from '@douyinfe/semi-icons';
import { Avatar, Dropdown, Layout, Nav, Switch } from '@douyinfe/semi-ui';
import { stringToColor } from '../helpers/render';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';

// HeaderBar Buttons
let headerButtons = [
  {
    text: '关于',
    itemKey: 'about',
    to: '/about',
    icon: <IconHelpCircle />,
  },
  {
    text: 'HorseGPT Chat',
    itemKey: 'chat',
    to: '/chat',
    icon: <IconComment />,
  },
];

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



  const loadStatus = async () => {
    const res = await API.get('/api/status');
    if (res === undefined) {
      return;
    }
    const { success, data } = res.data;
    if (success) {
      setStatusData(data);
    } else {
      showError('无法正常连接至服务器！');
    }
  };






const translations = {
    home: { en: 'Home', zh: '首页', 'zh-Hant': '首頁' },
    pricing: { en: 'Pricing', zh: '模型价格', 'zh-Hant': '模型價格' },
    channel: { en: 'Channel', zh: '渠道', 'zh-Hant': '渠道' },
    token: { en: 'Token', zh: '令牌', 'zh-Hant': '令牌' },
    redemption: { en: 'Redemption Code', zh: '兑换码', 'zh-Hant': '兌換碼' },
    topup: { en: 'Wallet', zh: '钱包', 'zh-Hant': '錢包' },
    user: { en: 'User Management', zh: '用户管理', 'zh-Hant': '用戶管理' },
    log: { en: 'Log', zh: '日志', 'zh-Hant': '日誌' },
    detail: { en: 'Dashboard', zh: '数据看板', 'zh-Hant': '數據看板' },
    setting: { en: 'Settings', zh: '设置', 'zh-Hant': '設置' },
    login: { en: 'Login', zh: '登录', 'zh-Hant': '登入' },
    register: { en: 'Register', zh: '注册', 'zh-Hant': '註冊' },
	logout: { en: 'Logout', zh: '退出', 'zh-Hant': '退出' },
};



const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();

const buttons = [
    {
        itemKey: 'home',
        to: '/',
		className: isMobile() ? 'tableMobile' : 'semi-navigation-item-normal',
        icon: isMobile() ? <IconHome /> : null,
        text: isMobile() ? '' : getTranslation('home', userLanguage), //		手机显示图标，电脑显示文字
    },
{
    itemKey: 'pricing',
    to: '/pricing',
	className: isMobile() ? 'tableHiddle' : 'semi-navigation-item-normal',
    icon: isMobile() ? <IconPriceTag /> : null,
    text: isMobile() ? '' : getTranslation('pricing', userLanguage), // 手机显示图标，电脑显示文字
},
{
    itemKey: 'channel',
    to: '/channel',
    className: isAdmin()
    ? (isMobile() ? 'tableMobile' : 'semi-navigation-item-normal')
    : 'tableHiddle',
    icon: isMobile() ? <IconLayers /> : null,
    text: isMobile() ? '' : getTranslation('channel', userLanguage), // 手机显示图标，电脑显示文字
},
{
    itemKey: 'token',
    to: '/token',
	className: isMobile() ? 'tableMobile' : 'semi-navigation-item-normal',
    icon: isMobile() ? <IconKey /> : null,
    text: isMobile() ? '' : getTranslation('token', userLanguage), // 手机显示图标，电脑显示文字
},
{
    itemKey: 'redemption',
    to: '/redemption',
	className: isAdmin()
		? (isMobile() ? 'tableMobile' : 'semi-navigation-item-normal') // 管理员：根据设备区分
		: (isMobile() ? 'tableHiddle' : 'tableHiddle'), // 非管理员：根据设备区分
    icon: isMobile() ? <IconGift /> : null,
    text: isMobile() ? '' : getTranslation('redemption', userLanguage), // 手机显示图标，电脑显示文字
},
{
    itemKey: 'topup',
    to: '/topup',
	className: isMobile() ? 'tableMobile' : 'semi-navigation-item-normal',
    icon: isMobile() ? <IconCreditCard /> : null,
    text: isMobile() ? '' : getTranslation('topup', userLanguage), // 手机显示图标，电脑显示文字
},
{
    itemKey: 'user',
    to: '/user',
	className: isAdmin() 
		? (isMobile() ? 'tableMobile' : 'semi-navigation-item-normal') 
		: 'tableHiddle',
    icon: isMobile() ? <IconUser /> : null,
    text: isMobile() ? '' : getTranslation('user', userLanguage), // 手机显示图标，电脑显示文字
},
{
    itemKey: 'log',
    to: '/log',
	className: isMobile() ? 'tableHiddle' : 'semi-navigation-item-normal',
    icon: isMobile() ? <IconHistogram /> : null,
    text: isMobile() ? '' : getTranslation('log', userLanguage), // 手机显示图标，电脑显示文字
},
{
    itemKey: 'detail',
    to: '/detail',
	className:
		localStorage.getItem('enable_data_export') === 'true'
			? (isMobile() ? 'tableHiddle' : 'semi-navigation-item-normal')
			: (isMobile() ? 'tableHiddle' : 'tableHiddle'),
    icon: isMobile() ? <IconCalendarClock /> : null,
    text: isMobile() ? '' : getTranslation('detail', userLanguage), // 手机显示图标，电脑显示文字
},
{
    itemKey: 'setting',
    to: '/setting',
	className: isMobile() ? 'tableMobile' : 'semi-navigation-item-normal',
    icon: isMobile() ? <IconSetting /> : null,
    text: isMobile() ? '' : getTranslation('setting', userLanguage), // 手机显示图标，电脑显示文字
},
];

if (localStorage.getItem('chat_link')) {
  headerButtons.splice(1, 0, {
    name: '聊天',
    to: '/chat',
    icon: 'comments',
  });
}

const HeaderBar = () => {
  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const systemName = getSystemName();
  const logo = getLogo();
  const currentDate = new Date();
  // enable fireworks on new year(1.1 and 2.9-2.24)
  const isNewYear =
    (currentDate.getMonth() === 0 && currentDate.getDate() === 1) ||
    (currentDate.getMonth() === 1 &&
      currentDate.getDate() >= 9 &&
      currentDate.getDate() <= 24);

  async function logout() {
    setShowSidebar(false);
    await API.get('/api/user/logout');
    showSuccess('Success!');
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  }

  const handleNewYearClick = () => {
    fireworks.init('root', {});
    fireworks.start();
    setTimeout(() => {
      fireworks.stop();
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    }, 3000);
  };

  const theme = useTheme();
  const setTheme = useSetTheme();

  useEffect(() => {

	loadStatus().then(() => {
		
    });


    if (theme === 'dark') {
      document.body.setAttribute('theme-mode', 'dark');
    }

    if (isNewYear) {
      console.log('Happy New Year!');
    }
  }, []);

  return (
    <>
      <Layout>
        <div style={{ width: '100%' }}>
          <Nav
            mode={'horizontal'}
            // bodyStyle={{ height: 100 }}
            renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
              const routerMap = {
                about: '/about',
                login: '/login',
				channel: '/channel',
				token: '/token',
				redemption: '/redemption',
				topup: '/topup',
				user: '/user',
				log: '/log',
				midjourney: '/midjourney',
				setting: '/setting',
				chat: '/chat',
				detail: '/detail',
				pricing: '/pricing',
				task: '/task',
				playground: '/playground',                
				register: '/register',
                home: '/',
              };
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  to={routerMap[props.itemKey]}
                >
                  {itemElement}
                </Link>
              );
            }}
            selectedKeys={[]}
            // items={headerButtons}
            onSelect={(key) => {}}
			header={
			isMobile() ? {
					logo: null,
					text: "HorseAPI",
				} : {
					logo: null,  // 在所有情况下不显示 logo
					text: "HorseGPT API",  // 也可以修改为不同的值，或者完全不显示
				}
			}
            items={buttons}
            footer={
              <>
                {isNewYear && (
                  // happy new year
                  <Dropdown
                    position='bottomRight'
                    render={
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={handleNewYearClick}>
                          Happy New Year!!!
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    }
                  >
                    <Nav.Item itemKey={'new-year'} text={'🏮'} />
                  </Dropdown>
                )}
                <Nav.Item
					itemKey={'chat'}
					icon={<IconComment />}
					className={isMobile() ? 'tableHiddle' : ''}
				/>
                <>
                {!isMobile() && (
                    <Switch
                      checkedText='🌞'
                      size={'large'}
                      checked={theme === 'dark'}
                      uncheckedText='🌙'
                      onChange={(checked) => {
                        setTheme(checked);
                      }}
                    />
                  )}
                </>
                {userState.user ? (
                  <>
                    <Dropdown
                      position='bottomRight'
                      render={
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={logout}>{getTranslation('logout', userLanguage)}</Dropdown.Item>
                        </Dropdown.Menu>
                      }
                    >
                      <Avatar
                        size='small'
                        color={stringToColor(userState.user.username)}
                        style={{ margin: 4 }}
                      >
                        {userState.user.username[0]}
                      </Avatar>
                      <span className={isMobile() ? 'tableHiddle' : ''}>{userState.user.username}</span>
                    </Dropdown>
                  </>
                ) : (
                  <>
					<Nav.Item
						itemKey={'login'}
						text={getTranslation('login', userLanguage)} // 动态设置文本
						//icon={<IconKey />}
						className={isMobile() ? 'tableHiddle' : 'semi-navigation-item-normal'}
					/>
					<Nav.Item
						itemKey={'register'}
						text={isMobile() ? '' : getTranslation('register', userLanguage)} //		手机显示图标，电脑显示文字
						
						//icon={<IconUser />}
						icon={isMobile() ? <IconUser /> : null}
						className={isMobile() ? 'tableMobile' : 'semi-navigation-item-normal'}
					/>
                  </>
                )}
              </>
            }
          ></Nav>
        </div>
      </Layout>
    </>
  );
};

export default HeaderBar;

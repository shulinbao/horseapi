import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    API,
    copy,
    isRoot,
    showError,
    showInfo,
    showSuccess,
} from '../helpers';
import Turnstile from 'react-turnstile';
import {UserContext} from '../context/User';
import {onGitHubOAuthClicked, onLinuxDOOAuthClicked} from './utils';
import {
    Avatar,
    Banner,
    Button,
    Card,
    Descriptions,
    Image,
    Input,
    InputNumber,
    Layout,
    Modal,
    Space,
    Tag,
    Typography,
} from '@douyinfe/semi-ui';
import {
    getQuotaPerUnit,
    renderQuota,
    renderQuotaWithPrompt,
    stringToColor,
} from '../helpers/render';
import TelegramLoginButton from 'react-telegram-login';





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
    "tokenReset": {
        "zh-Hant": "令牌已重置並已複製到剪貼板",
        "zh": "令牌已重置并已复制到剪贴板",
        "en": "Token has been reset and copied to clipboard"
    },
    "inviteLinkCopied": {
        "zh-Hant": "邀請鏈接已複製到剪切板",
        "zh": "邀请链接已复制到剪贴板",
        "en": "Invite link has been copied to clipboard"
    },
    "systemTokenCopied": {
        "zh-Hant": "系統令牌已複製到剪切板",
        "zh": "系统令牌已复制到剪贴板",
        "en": "System token has been copied to clipboard"
    },
    "enterUsernameToConfirmDelete": {
        "zh-Hant": "請輸入你的帳戶名以確認刪除！",
        "zh": "请输入你的账户名以确认删除！",
        "en": "Please enter your username to confirm deletion!"
    },
    "accountDeleted": {
        "zh-Hant": "帳戶已刪除！",
        "zh": "账户已删除！",
        "en": "Account has been deleted!"
    },
    "wechatBindSuccess": {
        "zh-Hant": "微信帳戶綁定成功！",
        "zh": "微信账户绑定成功！",
        "en": "WeChat account binding successful!"
    },
    "passwordMismatch": {
        "zh-Hant": "兩次輸入的密碼不一致！",
        "zh": "两次输入的密码不一致！",
        "en": "The passwords entered do not match!"
    },
    "passwordChangedSuccess": {
        "zh-Hant": "密碼修改成功！",
        "zh": "密码修改成功！",
        "en": "Password changed successfully!"
    },
    "minimumTransferAmount": {
        "zh-Hant": "劃轉金額最低為" + renderQuota(getQuotaPerUnit()),
        "zh": "划转金额最低为" + renderQuota(getQuotaPerUnit()),
        "en": "The minimum transfer amount is " + renderQuota(getQuotaPerUnit())
    },
    "retryTurnstileCheck": {
        "zh-Hant": "請稍後幾秒重試，Turnstile 正在檢查用戶環境！",
        "zh": "请稍后几秒重试，Turnstile 正在检查用户环境！",
        "en": "Please wait a few seconds and try again. Turnstile is checking the user environment!"
    },
    "emailRequired": {
        "zh-Hant": "請輸入郵箱！",
        "zh": "请输入邮箱！",
        "en": "Please enter email!"
    },
    "verificationCodeSent": {
        "zh-Hant": "驗證碼發送成功，請檢查郵箱！",
        "zh": "验证码发送成功，请检查邮箱！",
        "en": "Verification code sent successfully, please check your email!"
    },
    "emailVerificationRequired": {
        "zh-Hant": "請輸入郵箱驗證碼！",
        "zh": "请输入邮箱验证码！",
        "en": "Please enter email verification code!"
    },
    "accountBindingSuccess": {
        "zh-Hant": "郵箱帳戶綁定成功！",
        "zh": "邮箱账户绑定成功！",
        "en": "Email account binding successful!"
    },
    "copySuccess": {
        "zh-Hant": "已複製",
        "zh": "已复制",
        "en": "Copied"
    },
    "copyFailure": {
        "zh-Hant": "無法複製到剪貼板，請手動複製",
        "zh": "无法复制到剪贴板，请手动复制",
        "en": "Unable to copy to clipboard, please copy manually"
    },
    "transferAmountPrompt": {
        "zh-Hant": "請輸入要劃轉的數量",
        "zh": "请输入要划转的数量",
        "en": "Please enter the transfer amount"
    },
    "availableQuota": {
        "zh-Hant": "可用額度",
        "zh": "可用额度",
        "en": "Available quota"
    },
    "transferQuota": {
        "zh-Hant": "劃轉額度",
        "zh": "划转额度",
        "en": "Transfer quota"
    },
    "quotaPerUnit": {
        "zh-Hant": "最低劃轉額度",
        "zh": "最低划转额度",
        "en": "Minimum transfer quota"
    },
    "adminTag": {
        "zh-Hant": "管理員",
        "zh": "管理员",
        "en": "Administrator"
    },
    "userTag": {
        "zh-Hant": "普通用戶",
        "zh": "普通用户",
        "en": "Regular user"
    },
    "currentBalance": {
        "zh-Hant": "當前餘額",
        "zh": "当前余额",
        "en": "Current balance"
    },
    "historicalConsumption": {
        "zh-Hant": "歷史消耗",
        "zh": "历史消耗",
        "en": "Historical consumption"
    },
    "requestCount": {
        "zh-Hant": "請求次數",
        "zh": "请求次数",
        "en": "Request count"
    },
    "availableModels": {
        "zh-Hant": "可用模型",
        "zh": "可用模型",
        "en": "Available models"
    },
    "inviteLink": {
        "zh-Hant": "邀請鏈接",
        "zh": "邀请链接",
        "en": "Invite link"
    },
    "invitationInfo": {
        "zh-Hant": "邀請信息",
        "zh": "邀请信息",
        "en": "Invitation information"
    },
    "pendingRevenue": {
        "zh-Hant": "待使用收益",
        "zh": "待使用收益",
        "en": "Pending revenue"
    },
    "totalRevenue": {
        "zh-Hant": "總收益",
        "zh": "总收益",
        "en": "Total revenue"
    },
    "inviteCount": {
        "zh-Hant": "邀請人數",
        "zh": "邀请人数",
        "en": "Invite count"
    },
	
	
	
	
	"personalInformation": {
        "zh-Hant": "個人信息",
        "zh": "个人信息",
        "en": "Personal Information"
    },
    "email": {
        "zh-Hant": "郵箱",
        "zh": "邮箱",
        "en": "Email"
    },
    "wechat": {
        "zh-Hant": "微信",
        "zh": "微信",
        "en": "WeChat"
    },
    "github": {
        "zh-Hant": "GitHub",
        "zh": "GitHub",
        "en": "GitHub"
    },
    "telegram": {
        "zh-Hant": "Telegram",
        "zh": "Telegram",
        "en": "Telegram"
    },
    "linuxDO": {
        "zh-Hant": "LinuxDO",
        "zh": "LinuxDO",
        "en": "LinuxDO"
    },
    "bindEmail": {
        "zh-Hant": "綁定郵箱",
        "zh": "绑定邮箱",
        "en": "Bind Email"
    },
    "changeBinding": {
        "zh-Hant": "修改綁定",
        "zh": "修改绑定",
        "en": "Change Binding"
    },
    "bindWechat": {
        "zh-Hant": "綁定微信",
        "zh": "绑定微信",
        "en": "Bind WeChat"
    },
    "notEnabled": {
        "zh-Hant": "未啟用",
        "zh": "未启用",
        "en": "Not Enabled"
    },
    "bindGitHub": {
        "zh-Hant": "綁定GitHub",
        "zh": "绑定GitHub",
        "en": "Bind GitHub"
    },
    "bindTelegram": {
        "zh-Hant": "綁定Telegram",
        "zh": "绑定Telegram",
        "en": "Bind Telegram"
    },
    "bindLinuxDO": {
        "zh-Hant": "綁定LinuxDO",
        "zh": "绑定LinuxDO",
        "en": "Bind LinuxDO"
    },
    "unbound": {
        "zh-Hant": "未綁定",
        "zh": "未绑定",
        "en": "Unbound"
    },
    "bound": {
        "zh-Hant": "已綁定",
        "zh": "已绑定",
        "en": "Bound"
    },
	
	
    "generateSystemToken": {
        "zh-Hant": "生成系統訪問令牌",
        "zh": "生成系统访问令牌",
        "en": "Generate system access token"
    },
    "changePassword": {
        "zh-Hant": "修改密碼",
        "zh": "修改密码",
        "en": "Change password"
    },
    "deleteAccount": {
        "zh-Hant": "刪除個人帳戶",
        "zh": "删除个人账户",
        "en": "Delete personal account"
    },
    "bindWeChatAccount": {
        "zh-Hant": "綁定微信帳戶",
        "zh": "绑定微信账户",
        "en": "Bind WeChat account"
    },
    "wechatScanQRCode": {
        "zh-Hant": "微信掃碼關注公眾號，輸入「驗證碼」獲取驗證碼（三分鐘內有效）",
        "zh": "微信扫码关注公众号，输入「验证码」获取验证码（三分钟内有效）",
        "en": "Scan the QR code with WeChat, follow the public account, and enter the 'verification code' to get the code (valid within three minutes)"
    },
    "verificationCode": {
        "zh-Hant": "驗證碼",
        "zh": "验证码",
        "en": "Verification code"
    },
    "bindEmailAddress": {
        "zh-Hant": "綁定郵箱地址",
        "zh": "绑定邮箱地址",
        "en": "Bind email address"
    },
    "inputEmail": {
        "zh-Hant": "輸入郵箱地址",
        "zh": "输入邮箱地址",
        "en": "Enter email address"
    },
    "getVerificationCode": {
        "zh-Hant": "獲取驗證碼",
        "zh": "获取验证码",
        "en": "Get verification code"
    },
    "reSendVerificationCode": {
        "zh-Hant": "重新發送（{countdown}）",
        "zh": "重新发送（{countdown}）",
        "en": "Resend ({countdown})"
    },
    "bindingSuccess": {
        "zh-Hant": "綁定成功！",
        "zh": "绑定成功！",
        "en": "Binding successful!"
    },
    "bindingFailure": {
        "zh-Hant": "綁定失敗！",
        "zh": "绑定失败！",
        "en": "Binding failed!"
    },
    "copySuccess": {
        "zh-Hant": "已複製",
        "zh": "已复制",
        "en": "Copied"
    },
    "copyFailure": {
        "zh-Hant": "無法複製到剪貼板，請手動複製",
        "zh": "无法复制到剪贴板，请手动复制",
        "en": "Unable to copy to clipboard, please copy manually"
    },
	
	
	
	
    "verificationCode": {
        "zh-Hant": "驗證碼",
        "zh": "验证码",
        "en": "Verification code"
    },
    "accountDeletionWarning": {
        "zh-Hant": "您正在刪除自己的帳戶，將清空所有數據且不可恢復",
        "zh": "您正在删除自己的账户，将清空所有数据且不可恢复",
        "en": "You are about to delete your account. All data will be cleared and cannot be recovered."
    },
    "usernameToConfirmDeletion": {
        "zh-Hant": "輸入你的帳戶名以確認刪除",
        "zh": "输入你的账户名以确认删除",
        "en": "Enter your username to confirm deletion"
    },
    "passwordNew": {
        "zh-Hant": "新密碼",
        "zh": "新密码",
        "en": "New password"
    },
    "passwordConfirm": {
        "zh-Hant": "確認新密碼",
        "zh": "确认新密码",
        "en": "Confirm new password"
    },
    "actionConfirm": {
        "zh-Hant": "確認",
        "zh": "确认",
        "en": "Confirm"
    },
    "confirm": {
        "zh-Hant": "確定",
        "zh": "确定",
        "en": "Confirm"
    },
    "cancel": {
        "zh-Hant": "取消",
        "zh": "取消",
        "en": "Cancel"
    }	
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言








const PersonalSetting = () => {
    const [userState, userDispatch] = useContext(UserContext);
    let navigate = useNavigate();

    const [inputs, setInputs] = useState({
        wechat_verification_code: '',
        email_verification_code: '',
        email: '',
        self_account_deletion_confirmation: '',
        set_new_password: '',
        set_new_password_confirmation: '',
    });
    const [status, setStatus] = useState({});
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showWeChatBindModal, setShowWeChatBindModal] = useState(false);
    const [showEmailBindModal, setShowEmailBindModal] = useState(false);
    const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);
    const [turnstileEnabled, setTurnstileEnabled] = useState(false);
    const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [affLink, setAffLink] = useState('');
    const [systemToken, setSystemToken] = useState('');
    const [models, setModels] = useState([]);
    const [openTransfer, setOpenTransfer] = useState(false);
    const [transferAmount, setTransferAmount] = useState(0);

    useEffect(() => {
        // let user = localStorage.getItem('user');
        // if (user) {
        //   userDispatch({ type: 'login', payload: user });
        // }
        // console.log(localStorage.getItem('user'))

        let status = localStorage.getItem('status');
        if (status) {
            status = JSON.parse(status);
            setStatus(status);
            if (status.turnstile_check) {
                setTurnstileEnabled(true);
                setTurnstileSiteKey(status.turnstile_site_key);
            }
        }
        getUserData().then((res) => {
            console.log(userState);
        });
        loadModels().then();
        getAffLink().then();
        setTransferAmount(getQuotaPerUnit());
    }, []);

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
        return () => clearInterval(countdownInterval); // Clean up on unmount
    }, [disableButton, countdown]);

    const handleInputChange = (name, value) => {
        setInputs((inputs) => ({...inputs, [name]: value}));
    };

    const generateAccessToken = async () => {
        const res = await API.get('/api/user/token');
        const {success, message, data} = res.data;
        if (success) {
            setSystemToken(data);
            await copy(data);
            showSuccess(getTranslation("tokenReset", userLanguage));
        } else {
            showError(message);
        }
    };

    const getAffLink = async () => {
        const res = await API.get('/api/user/aff');
        const {success, message, data} = res.data;
        if (success) {
            let link = `${window.location.origin}/register?aff=${data}`;
            setAffLink(link);
        } else {
            showError(message);
        }
    };

    const getUserData = async () => {
        let res = await API.get(`/api/user/self`);
        const {success, message, data} = res.data;
        if (success) {
            userDispatch({type: 'login', payload: data});
        } else {
            showError(message);
        }
    };

    const loadModels = async () => {
        let res = await API.get(`/api/user/models`);
        const {success, message, data} = res.data;
        if (success) {
            setModels(data);
            console.log(data);
        } else {
            showError(message);
        }
    };

    const handleAffLinkClick = async (e) => {
        e.target.select();
        await copy(e.target.value);
        showSuccess(getTranslation("inviteLinkCopied", userLanguage));
    };

    const handleSystemTokenClick = async (e) => {
        e.target.select();
        await copy(e.target.value);
        showSuccess(getTranslation("systemTokenCopied", userLanguage));
    };

    const deleteAccount = async () => {
        if (inputs.self_account_deletion_confirmation !== userState.user.username) {
            showError(getTranslation("enterUsernameToConfirmDelete", userLanguage));
            return;
        }

        const res = await API.delete('/api/user/self');
        const {success, message} = res.data;

        if (success) {
            showSuccess(getTranslation("accountDeleted", userLanguage));
            await API.get('/api/user/logout');
            userDispatch({type: 'logout'});
            localStorage.removeItem('user');
            navigate('/login');
        } else {
            showError(message);
        }
    };

    const bindWeChat = async () => {
        if (inputs.wechat_verification_code === '') return;
        const res = await API.get(
            `/api/oauth/wechat/bind?code=${inputs.wechat_verification_code}`,
        );
        const {success, message} = res.data;
        if (success) {
            showSuccess(getTranslation("wechatBindSuccess", userLanguage));
            setShowWeChatBindModal(false);
        } else {
            showError(message);
        }
    };

    const changePassword = async () => {
        if (inputs.set_new_password !== inputs.set_new_password_confirmation) {
            showError(getTranslation("passwordMismatch", userLanguage));
            return;
        }
        const res = await API.put(`/api/user/self`, {
            password: inputs.set_new_password,
        });
        const {success, message} = res.data;
        if (success) {
            showSuccess(getTranslation("passwordChangedSuccess", userLanguage));
            setShowWeChatBindModal(false);
        } else {
            showError(message);
        }
        setShowChangePasswordModal(false);
    };

    const transfer = async () => {
        if (transferAmount < getQuotaPerUnit()) {
            showError(getTranslation("minimumTransferAmount", userLanguage));
            return;
        }
        const res = await API.post(`/api/user/aff_transfer`, {
            quota: transferAmount,
        });
        const {success, message} = res.data;
        if (success) {
            showSuccess(message);
            setOpenTransfer(false);
            getUserData().then();
        } else {
            showError(message);
        }
    };

    const sendVerificationCode = async () => {
        if (inputs.email === '') {
            showError(getTranslation('emailRequired', userLanguage));
            return;
        }
        setDisableButton(true);
        if (turnstileEnabled && turnstileToken === '') {
            showInfo(getTranslation("retryTurnstileCheck", userLanguage));
            return;
        }
        setLoading(true);
        const res = await API.get(
            `/api/verification?email=${inputs.email}&turnstile=${turnstileToken}`,
        );
        const {success, message} = res.data;
        if (success) {
            showSuccess(getTranslation('verificationCodeSent', userLanguage));
        } else {
            showError(message);
        }
        setLoading(false);
    };

    const bindEmail = async () => {
        if (inputs.email_verification_code === '') {
            showError(getTranslation('emailVerificationRequired', userLanguage));
            return;
        }
        setLoading(true);
        const res = await API.get(
            `/api/oauth/email/bind?email=${inputs.email}&code=${inputs.email_verification_code}`,
        );
        const {success, message} = res.data;
        if (success) {
            showSuccess(getTranslation('accountBindingSuccess', userLanguage));
            setShowEmailBindModal(false);
            userState.user.email = inputs.email;
        } else {
            showError(message);
        }
        setLoading(false);
    };

    const getUsername = () => {
        if (userState.user) {
            return userState.user.username;
        } else {
            return 'null';
        }
    };

    const handleCancel = () => {
        setOpenTransfer(false);
    };

    const copyText = async (text) => {
        if (await copy(text)) {
            showSuccess(getTranslation('copySuccess', userLanguage));
        } else {
            // setSearchKeyword(text);
				Modal.error({
					title: getTranslation('copyFailure', userLanguage),
					content: text
        });
        }
    };

    return (
        <div>
            <Layout>
                <Layout.Content>
                    <Modal
                        title={getTranslation('transferAmountPrompt', userLanguage)}
                        visible={openTransfer}
                        onOk={transfer}
                        onCancel={handleCancel}
                        maskClosable={false}
                        size={'small'}
                        centered={true}
						okText={getTranslation("confirm", userLanguage)}  // 获取“确定”按钮的翻译
						cancelText={getTranslation("cancel", userLanguage)}  // 获取“取消”按钮的翻译
                    >
                        <div style={{marginTop: 20}}>
                            <Typography.Text>{`${getTranslation('availableQuota', userLanguage)} ${renderQuotaWithPrompt(userState?.user?.aff_quota)}`}</Typography.Text>
							
							
							
                            <Input
                                style={{marginTop: 5}}
                                value={userState?.user?.aff_quota}
                                disabled={true}
                            ></Input>
                        </div>
                        <div style={{marginTop: 20}}>
                            <Typography.Text>
                                {`${getTranslation('transferQuota', userLanguage)} ${renderQuotaWithPrompt(transferAmount)} ${getTranslation('quotaPerUnit', userLanguage)} ${renderQuota(getQuotaPerUnit())}`}
                            </Typography.Text>
                            <div>
                                <InputNumber
                                    min={0}
                                    style={{marginTop: 5}}
                                    value={transferAmount}
                                    onChange={(value) => setTransferAmount(value)}
                                    disabled={false}
                                ></InputNumber>
                            </div>
                        </div>
                    </Modal>
                    <div style={{marginTop: 20}}>
                        <Card
                            title={
                                <Card.Meta
                                    avatar={
                                        <Avatar
                                            size='default'
                                            color={stringToColor(getUsername())}
                                            style={{marginRight: 4}}
                                        >
                                            {typeof getUsername() === 'string' &&
                                                getUsername().slice(0, 1)}
                                        </Avatar>
                                    }
                                    title={<Typography.Text>{getUsername()}</Typography.Text>}
                                    description={
                                        isRoot() ? (
                                            <Tag color='red'>{getTranslation('adminTag', userLanguage)}</Tag>
                                        ) : (
                                            <Tag color='blue'>{getTranslation('userTag', userLanguage)}</Tag>
                                        )
                                    }
                                ></Card.Meta>
                            }
                            headerExtraContent={
                                <>
                                    <Space vertical align='start'>
                                        <Tag color='green'>{'ID: ' + userState?.user?.id}</Tag>
                                        <Tag color='blue'>{userState?.user?.group}</Tag>
                                    </Space>
                                </>
                            }
                            footer={
                                <Descriptions row>
                                    <Descriptions.Item itemKey={getTranslation('currentBalance', userLanguage)}>
                                        {renderQuota(userState?.user?.quota)}
                                    </Descriptions.Item>
                                    <Descriptions.Item itemKey={getTranslation('historicalConsumption', userLanguage)}>
                                        {renderQuota(userState?.user?.used_quota)}
                                    </Descriptions.Item>
                                    <Descriptions.Item itemKey={getTranslation('requestCount', userLanguage)}>
                                        {userState.user?.request_count}
                                    </Descriptions.Item>
                                </Descriptions>
                            }
                        >
                            <Typography.Title heading={6}>{getTranslation('availableModels', userLanguage)}</Typography.Title>
                            <div style={{marginTop: 10}}>
                                <Space wrap>
                                    {models.map((model) => (
                                        <Tag
                                            key={model}
                                            color='cyan'
                                            onClick={() => {
                                                copyText(model);
                                            }}
                                        >
                                            {model}
                                        </Tag>
                                    ))}
                                </Space>
                            </div>
                        </Card>
                        <Card
                            style={{marginTop: 10}}
                            footer={
                                <div>
                                    <Typography.Text>{getTranslation('inviteLink', userLanguage)}</Typography.Text>
                                    <Input
                                        style={{marginTop: 10}}
                                        value={affLink}
                                        onClick={handleAffLinkClick}
                                        readOnly
                                    />
                                </div>
                            }
                        >
                            <Typography.Title heading={6}>{getTranslation('invitationInfo', userLanguage)}</Typography.Title>
                            <div style={{marginTop: 10}}>
                                <Descriptions row>
                                    <Descriptions.Item itemKey={getTranslation('pendingRevenue', userLanguage)}>
                    <span style={{color: 'rgba(var(--semi-red-5), 1)'}}>
                      {renderQuota(userState?.user?.aff_quota)}
                    </span>
                                        <Button
                                            type={'secondary'}
                                            onClick={() => setOpenTransfer(true)}
                                            size={'small'}
                                            style={{marginLeft: 10}}
                                        >
                                            {getTranslation('transferAmountPrompt', userLanguage)}
                                        </Button>
                                    </Descriptions.Item>
                                    <Descriptions.Item itemKey={getTranslation('totalRevenue', userLanguage)}>
                                        {renderQuota(userState?.user?.aff_history_quota)}
                                    </Descriptions.Item>
                                    <Descriptions.Item itemKey={getTranslation('inviteCount', userLanguage)}>
                                        {userState?.user?.aff_count}
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        </Card>
                        <Card style={{marginTop: 10}}>
                            <Typography.Title heading={6}>{getTranslation("personalInformation", userLanguage)}</Typography.Title>
                            <div style={{marginTop: 20}}>
                                <Typography.Text strong>{getTranslation("email", userLanguage)}</Typography.Text>
                                <div
                                    style={{display: 'flex', justifyContent: 'space-between'}}
                                >
                                    <div>
                                        <Input
                                            value={
                                                userState.user && userState.user.email !== ''
                                                    ? userState.user.email
                                                    : getTranslation("unbound", userLanguage)
                                            }
                                            readonly={true}
                                        ></Input>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => {
                                                setShowEmailBindModal(true);
                                            }}
                                        >
                                            {userState.user && userState.user.email !== ''
                                                ? getTranslation("changeBinding", userLanguage)
                                                : getTranslation("bindEmail", userLanguage)}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div style={{marginTop: 10}}>
                                <Typography.Text strong>{getTranslation("wechat", userLanguage)}</Typography.Text>
                                <div
                                    style={{display: 'flex', justifyContent: 'space-between'}}
                                >
                                    <div>
                                        <Input
                                            value={
                                                userState.user && userState.user.wechat_id !== ''
                                                    ? getTranslation("bound", userLanguage)
                                                    : getTranslation("unbound", userLanguage)
                                            }
                                            readonly={true}
                                        ></Input>
                                    </div>
                                    <div>
                                        <Button
                                            disabled={
                                                (userState.user && userState.user.wechat_id !== '') ||
                                                !status.wechat_login
                                            }
                                        >
                                            {status.wechat_login ? getTranslation("bindWechat", userLanguage) : getTranslation("notEnabled", userLanguage)}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div style={{marginTop: 10}}>
                                <Typography.Text strong>GitHub</Typography.Text>
                                <div
                                    style={{display: 'flex', justifyContent: 'space-between'}}
                                >
                                    <div>
                                        <Input
                                            value={
                                                userState.user && userState.user.github_id !== ''
                                                    ? userState.user.github_id
                                                    : getTranslation("unbound", userLanguage)
                                            }
                                            readonly={true}
                                        ></Input>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => {
                                                onGitHubOAuthClicked(status.github_client_id);
                                            }}
                                            disabled={
                                                (userState.user && userState.user.github_id !== '') ||
                                                !status.github_oauth
                                            }
                                        >
                                            {status.github_oauth ? getTranslation("bindGitHub", userLanguage) : getTranslation("notEnabled", userLanguage)}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div style={{marginTop: 10}}>
                                <Typography.Text strong>Telegram</Typography.Text>
                                <div
                                    style={{display: 'flex', justifyContent: 'space-between'}}
                                >
                                    <div>
                                        <Input
                                            value={
                                                userState.user && userState.user.telegram_id !== ''
                                                    ? userState.user.telegram_id
                                                    : getTranslation("unbound", userLanguage)
                                            }
                                            readonly={true}
                                        ></Input>
                                    </div>
                                    <div>
                                        {status.telegram_oauth ? (
                                            userState.user.telegram_id !== '' ? (
                                                <Button disabled={true}>{getTranslation("bound", userLanguage)}</Button>
                                            ) : (
                                                <TelegramLoginButton
                                                    dataAuthUrl='/api/oauth/telegram/bind'
                                                    botName={status.telegram_bot_name}
                                                />
                                            )
                                        ) : (
                                            <Button disabled={true}>{getTranslation("notEnabled", userLanguage)}</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={{marginTop: 10}}>
                                <Typography.Text strong>{getTranslation("linuxDO", userLanguage)}</Typography.Text>
                                <div
                                    style={{display: 'flex', justifyContent: 'space-between'}}
                                >
                                    <div>
                                        <Input
                                            value={
                                                userState.user && userState.user.linux_do_id !== ''
                                                    ? userState.user.linux_do_id
                                                    : getTranslation("unbound", userLanguage)
                                            }
                                            readonly={true}
                                        ></Input>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => {
                                                onLinuxDOOAuthClicked(status.linuxdo_client_id);
                                            }}
                                            disabled={
                                                (userState.user && userState.user.linux_do_id !== '') ||
                                                !status.linuxdo_oauth
                                            }
                                        >
                                            {status.linuxdo_oauth ? getTranslation("bindLinuxDO", userLanguage) : getTranslation("notEnabled", userLanguage)}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div style={{marginTop: 10}}>
                                <Space>
                                    <Button onClick={generateAccessToken}>
                                        {getTranslation("generateSystemToken", userLanguage)}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowChangePasswordModal(true);
                                        }}
                                    >
                                        {getTranslation("changePassword", userLanguage)}
                                    </Button>
                                    <Button
                                        type={'danger'}
                                        onClick={() => {
                                            setShowAccountDeleteModal(true);
                                        }}
                                    >
                                        {getTranslation("deleteAccount", userLanguage)}
                                    </Button>
                                </Space>

                                {systemToken && (
                                    <Input
                                        readOnly
                                        value={systemToken}
                                        onClick={handleSystemTokenClick}
                                        style={{marginTop: '10px'}}
                                    />
                                )}
                                {status.wechat_login && (
                                    <Button
                                        onClick={() => {
                                            setShowWeChatBindModal(true);
                                        }}
                                    >
                                        {getTranslation("bindWeChatAccount", userLanguage)}
                                    </Button>
                                )}
                                <Modal
                                    onCancel={() => setShowWeChatBindModal(false)}
                                    // onOpen={() => setShowWeChatBindModal(true)}
                                    visible={showWeChatBindModal}
                                    size={'small'}
									okText={getTranslation("confirm", userLanguage)}  // 获取“确定”按钮的翻译
									cancelText={getTranslation("cancel", userLanguage)}  // 获取“取消”按钮的翻译
                                >
                                    <Image src={status.wechat_qrcode}/>
                                    <div style={{textAlign: 'center'}}>
                                        <p>
                                            {getTranslation("wechatScanQRCode", userLanguage)}
                                        </p>
                                    </div>
                                    <Input
                                        placeholder={getTranslation("verificationCode", userLanguage)}
                                        name='wechat_verification_code'
                                        value={inputs.wechat_verification_code}
                                        onChange={(v) =>
                                            handleInputChange('wechat_verification_code', v)
                                        }
                                    />
                                    <Button color='' fluid size='large' onClick={bindWeChat}>
                                        {getTranslation("bindEmailAddress", userLanguage)}
                                    </Button>
                                </Modal>
                            </div>
                        </Card>
                        <Modal
                            onCancel={() => setShowEmailBindModal(false)}
                            // onOpen={() => setShowEmailBindModal(true)}
                            onOk={bindEmail}
                            visible={showEmailBindModal}
                            size={'small'}
                            centered={true}
                            maskClosable={false}
							okText={getTranslation("confirm", userLanguage)}  // 获取“确定”按钮的翻译
							cancelText={getTranslation("cancel", userLanguage)}  // 获取“取消”按钮的翻译
                        >
                            <Typography.Title heading={6}>{getTranslation("bindEmailAddress", userLanguage)}</Typography.Title>
                            <div
                                style={{
                                    marginTop: 20,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Input
                                    fluid
                                    placeholder={getTranslation("inputEmail", userLanguage)}
                                    onChange={(value) => handleInputChange('email', value)}
                                    name='email'
                                    type='email'
                                />
                                <Button
                                    onClick={sendVerificationCode}
                                    disabled={disableButton || loading}
                                >
                                    {disableButton ? `${getTranslation("reSendVerificationCode", userLanguage).replace('{countdown}', countdown)}` : getTranslation("getVerificationCode", userLanguage)}
                                </Button>
                            </div>
                            <div style={{marginTop: 10}}>
                                <Input
                                    fluid
                                    placeholder={getTranslation('verificationCode', userLanguage)}
                                    name='email_verification_code'
                                    value={inputs.email_verification_code}
                                    onChange={(value) =>
                                        handleInputChange('email_verification_code', value)
                                    }
                                />
                            </div>
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
                        </Modal>
                        <Modal
                            onCancel={() => setShowAccountDeleteModal(false)}
                            visible={showAccountDeleteModal}
                            size={'small'}
                            centered={true}
                            onOk={deleteAccount}
							okText={getTranslation("confirm", userLanguage)}  // 获取“确定”按钮的翻译
							cancelText={getTranslation("cancel", userLanguage)}  // 获取“取消”按钮的翻译
                        >
                            <div style={{marginTop: 20}}>
                                <Banner
                                    type='danger'
                                    description={getTranslation('accountDeletionWarning', userLanguage)}
                                    closeIcon={null}
                                />
                            </div>
                            <div style={{marginTop: 20}}>
                                <Input
                                    placeholder={getTranslation('usernameToConfirmDeletion', userLanguage)}
                                    name='self_account_deletion_confirmation'
                                    value={inputs.self_account_deletion_confirmation}
                                    onChange={(value) =>
                                        handleInputChange(
                                            'self_account_deletion_confirmation',
                                            value,
                                        )
                                    }
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
                            </div>
                        </Modal>
                        <Modal
                            onCancel={() => setShowChangePasswordModal(false)}
                            visible={showChangePasswordModal}
                            size={'small'}
                            centered={true}
                            onOk={changePassword}
							okText={getTranslation("confirm", userLanguage)}  // 获取“确定”按钮的翻译
							cancelText={getTranslation("cancel", userLanguage)}  // 获取“取消”按钮的翻译
                        >
                            <div style={{marginTop: 20}}>
                                <Input
                                    name='set_new_password'
                                    placeholder={getTranslation('passwordNew', userLanguage)}
                                    value={inputs.set_new_password}
                                    onChange={(value) =>
                                        handleInputChange('set_new_password', value)
                                    }
                                />
                                <Input
                                    style={{marginTop: 20}}
                                    name='set_new_password_confirmation'
                                    placeholder={getTranslation('passwordConfirm', userLanguage)}
                                    value={inputs.set_new_password_confirmation}
                                    onChange={(value) =>
                                        handleInputChange('set_new_password_confirmation', value)
                                    }
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
                            </div>
                        </Modal>
                    </div>
                </Layout.Content>
            </Layout>
        </div>
    );
};

export default PersonalSetting;

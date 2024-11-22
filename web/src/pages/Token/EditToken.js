import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  API,
  isMobile,
  showError,
  showSuccess,
  timestamp2string,
} from '../../helpers';
import { renderQuotaWithPrompt } from '../../helpers/render';
import {
  AutoComplete,
  Banner,
  Button,
  Checkbox,
  DatePicker,
  Input,
  Select,
  SideSheet,
  Space,
  Spin, TextArea,
  Typography
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { Divider } from 'semantic-ui-react';


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
  'errorInvalidTime': {
    'zh-Hant': '過期時間格式錯誤！',
    'zh': '过期时间格式错误！',
    'en': 'Invalid expiration time format!'
  },
  'successTokenUpdated': {
    'zh-Hant': '令牌更新成功！',
    'zh': '令牌更新成功！',
    'en': 'Token updated successfully!'
  },
  'titleEditToken': {
    'zh-Hant': '更新令牌信息',
    'zh': '更新令牌信息',
    'en': 'Update Token Information'
  },
  'titleCreateToken': {
    'zh-Hant': '創建新的令牌',
    'zh': '创建新的令牌',
    'en': 'Create New Token'
  },
  'submit': {
    'zh-Hant': '提交',
    'zh': '提交',
    'en': 'Submit'
  },
  'cancel': {
    'zh-Hant': '取消',
    'zh': '取消',
    'en': 'Cancel'
  },
  'neverExpires': {
    'zh-Hant': '永不過期',
    'zh': '永不过期',
    'en': 'Never Expires'
  },
  'oneHour': {
    'zh-Hant': '一小時',
    'zh': '一小时',
    'en': 'One Hour'
  },
  'oneMonth': {
    'zh-Hant': '一個月',
    'zh': '一个月',
    'en': 'One Month'
  },
  'oneDay': {
    'zh-Hant': '一天',
    'zh': '一天',
    'en': 'One Day'
  },
  'nameLabel': {
    'zh-Hant': '名稱',
    'zh': '名称',
    'en': 'Name'
  },
  'namePlaceholder': {
    'zh-Hant': '請輸入名稱',
    'zh': '请输入名称',
    'en': 'Please enter a name'
  },
  'expiredTimeLabel': {
    'zh-Hant': '過期時間',
    'zh': '过期时间',
    'en': 'Expiration Time'
  },
  'expiredTimePlaceholder': {
    'zh-Hant': '請選擇過期時間',
    'zh': '请选择过期时间',
    'en': 'Please select expiration time'
  },
  'descriptionNotice': {
    'zh-Hant': '注意，令牌的額度僅用於限制令牌本身的最大額度使用量，實際的使用受到账戶的剩餘額度限制。',
    'zh': '注意，令牌的额度仅用于限制令牌本身的最大额度使用量，实际的使用受到账户的剩余额度限制。',
    'en': 'Note: The quota of the token only limits the maximum quota usage of the token itself. The actual usage is subject to the remaining balance of the account.'
  },
  'quotaPrefix': {
    'zh-Hant': '額度',
    'zh': '额度',
    'en': 'Quota'
  },
  'inputQuotaPlaceholder': {
    'zh-Hant': '請輸入額度',
    'zh': '请输入额度',
    'en': 'Please enter quota'
  },
  'newTokenCount': {
    'zh-Hant': '新建數量',
    'zh': '新建数量',
    'en': 'New Token Count'
  },
  'quantityLabel': {
    'zh-Hant': '數量',
    'zh': '数量',
    'en': 'Quantity'
  },
  'quantityPlaceholder': {
    'zh-Hant': '請選擇或輸入創建令牌的數量',
    'zh': '请选择或输入创建令牌的数量',
    'en': 'Please select or enter the number of tokens to create'
  },
  'tokenOption10': {
    'zh-Hant': '10個',
    'zh': '10个',
    'en': '10'
  },
  'tokenOption20': {
    'zh-Hant': '20個',
    'zh': '20个',
    'en': '20'
  },
  'tokenOption30': {
    'zh-Hant': '30個',
    'zh': '30个',
    'en': '30'
  },
  'tokenOption100': {
    'zh-Hant': '100個',
    'zh': '100个',
    'en': '100'
  },
  'unlimitedQuotaToggle': {
    'zh-Hant': '取消無限額度',
    'zh': '取消无限额度',
    'en': 'Disable Unlimited Quota'
  },
  'setUnlimitedQuota': {
    'zh-Hant': '設為無限額度',
    'zh': '设为无限额度',
    'en': 'Set as Unlimited Quota'
  },
  'ipWhitelistNotice': {
    'zh-Hant': 'IP白名單（請勿過度信任此功能）',
    'zh': 'IP白名单（请勿过度信任此功能）',
    'en': 'IP Whitelist (Do not overly trust this feature)'
  },
  'ipWhitelistLabel': {
    'zh-Hant': 'IP白名單',
    'zh': 'IP白名单',
    'en': 'IP Whitelist'
  },
  'ipWhitelistPlaceholder': {
    'zh-Hant': '允許的IP，一行一個',
    'zh': '允许的IP，一行一个',
    'en': 'Allowed IPs, one per line'
  },
  'enableModelRestrictionNotice': {
    'zh-Hant': '啟用模型限制（非必要，不建議啟用）',
    'zh': '启用模型限制（非必要，不建议启用）',
    'en': 'Enable model restriction (Not necessary, not recommended)'
  },
  'modelRestrictionPlaceholder': {
    'zh-Hant': '請選擇該渠道所支援的模型',
    'zh': '请选择该渠道所支持的模型',
    'en': 'Please select the models supported by this channel'
  },
  'tokenGroupNotice': {
    'zh-Hant': '令牌分組，默認為使用者的分組',
    'zh': '令牌分组，默认为用户的分组',
    'en': 'Token group, defaults to the user’s group'
  },
  'tokenGroupPlaceholder': {
    'zh-Hant': '令牌分組，默認為使用者的分組',
    'zh': '令牌分组，默认为用户的分组',
    'en': 'Token group, defaults to the user’s group'
  },
  'noAdminGroupSetPlaceholder': {
    'zh-Hant': '管理員未設定使用者可選分組',
    'zh': '管理员未设置用户可选分组',
    'en': 'No user-selectable group set by the administrator'
  },
  "tokenCreatedSuccess": {
        "zh-Hant": "個令牌創建成功，請在列表頁面點擊複製獲取令牌！",
        "zh": "个令牌创建成功，请在列表页面点击复制获取令牌！",
        "en": "tokens created successfully. Please click to copy the token on the list page!"
  },
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言






const EditToken = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const originInputs = {
    name: '',
    remain_quota: isEdit ? 0 : 500000,
    expired_time: -1,
    unlimited_quota: false,
    model_limits_enabled: false,
    model_limits: [],
    allow_ips: '',
    group: '',
  };
  const [inputs, setInputs] = useState(originInputs);
  const {
    name,
    remain_quota,
    expired_time,
    unlimited_quota,
    model_limits_enabled,
    model_limits,
    allow_ips,
    group
  } = inputs;
  // const [visible, setVisible] = useState(false);
  const [models, setModels] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  const handleCancel = () => {
    props.handleClose();
  };
  const setExpiredTime = (month, day, hour, minute) => {
    let now = new Date();
    let timestamp = now.getTime() / 1000;
    let seconds = month * 30 * 24 * 60 * 60;
    seconds += day * 24 * 60 * 60;
    seconds += hour * 60 * 60;
    seconds += minute * 60;
    if (seconds !== 0) {
      timestamp += seconds;
      setInputs({ ...inputs, expired_time: timestamp2string(timestamp) });
    } else {
      setInputs({ ...inputs, expired_time: -1 });
    }
  };

  const setUnlimitedQuota = () => {
    setInputs({ ...inputs, unlimited_quota: !unlimited_quota });
  };

  const loadModels = async () => {
    let res = await API.get(`/api/user/models`);
    const { success, message, data } = res.data;
    if (success) {
      let localModelOptions = data.map((model) => ({
        label: model,
        value: model,
      }));
      setModels(localModelOptions);
    } else {
      showError(message);
    }
  };

  const loadGroups = async () => {
    let res = await API.get(`/api/user/self/groups`);
    const { success, message, data } = res.data;
    if (success) {
      // return data is a map, key is group name, value is group description
      // label is group description, value is group name
        let localGroupOptions = Object.keys(data).map((group) => ({
            label: data[group],
            value: group,
        }));
        setGroups(localGroupOptions);
    } else {
      showError(message);
    }
  };

  const loadToken = async () => {
    setLoading(true);
    let res = await API.get(`/api/token/${props.editingToken.id}`);
    const { success, message, data } = res.data;
    if (success) {
      if (data.expired_time !== -1) {
        data.expired_time = timestamp2string(data.expired_time);
      }
      if (data.model_limits !== '') {
        data.model_limits = data.model_limits.split(',');
      } else {
        data.model_limits = [];
      }
      setInputs(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };
  useEffect(() => {
    setIsEdit(props.editingToken.id !== undefined);
  }, [props.editingToken.id]);

  useEffect(() => {
    if (!isEdit) {
      setInputs(originInputs);
    } else {
      loadToken().then(() => {
        // console.log(inputs);
      });
    }
    loadModels();
    loadGroups();
  }, [isEdit]);

  // 新增 state 变量 tokenCount 来记录用户想要创建的令牌数量，默认为 1
  const [tokenCount, setTokenCount] = useState(1);

  // 新增处理 tokenCount 变化的函数
  const handleTokenCountChange = (value) => {
    // 确保用户输入的是正整数
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      setTokenCount(count);
    }
  };

  // 生成一个随机的四位字母数字字符串
  const generateRandomSuffix = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  const submit = async () => {
    setLoading(true);
    if (isEdit) {
      // 编辑令牌的逻辑保持不变
      let localInputs = { ...inputs };
      localInputs.remain_quota = parseInt(localInputs.remain_quota);
      if (localInputs.expired_time !== -1) {
        let time = Date.parse(localInputs.expired_time);
        if (isNaN(time)) {
          showError(getTranslation('errorInvalidTime', userLanguage));
          setLoading(false);
          return;
        }
        localInputs.expired_time = Math.ceil(time / 1000);
      }
      localInputs.model_limits = localInputs.model_limits.join(',');
      let res = await API.put(`/api/token/`, {
        ...localInputs,
        id: parseInt(props.editingToken.id),
      });
      const { success, message } = res.data;
      if (success) {
        showSuccess(getTranslation('successTokenUpdated', userLanguage));
        props.refresh();
        props.handleClose();
      } else {
        showError(message);
      }
    } else {
      // 处理新增多个令牌的情况
      let successCount = 0; // 记录成功创建的令牌数量
      for (let i = 0; i < tokenCount; i++) {
        let localInputs = { ...inputs };
        if (i !== 0) {
          // 如果用户想要创建多个令牌，则给每个令牌一个序号后缀
          localInputs.name = `${inputs.name}-${generateRandomSuffix()}`;
        }
        localInputs.remain_quota = parseInt(localInputs.remain_quota);

        if (localInputs.expired_time !== -1) {
          let time = Date.parse(localInputs.expired_time);
          if (isNaN(time)) {
            showError(getTranslation('errorInvalidTime', userLanguage));
            setLoading(false);
            break;
          }
          localInputs.expired_time = Math.ceil(time / 1000);
        }
        localInputs.model_limits = localInputs.model_limits.join(',');
        let res = await API.post(`/api/token/`, localInputs);
        const { success, message } = res.data;

        if (success) {
          successCount++;
        } else {
          showError(message);
          break; // 如果创建失败，终止循环
        }
      }

      if (successCount > 0) {
        showSuccess(
          `${successCount} ${getTranslation('tokenCreatedSuccess', userLanguage)}`,
        );
        props.refresh();
        props.handleClose();
      }
    }
    setLoading(false);
    setInputs(originInputs); // 重置表单
    setTokenCount(1); // 重置数量为默认值
  };

  return (
    <>
      <SideSheet
        placement={isEdit ? 'right' : 'left'}
		title={
			<Title level={3}>
				{isEdit
				? getTranslation('titleEditToken', userLanguage)
				: getTranslation('titleCreateToken', userLanguage)}
			</Title>
		}

        headerStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
        bodyStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
        visible={props.visiable}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              <Button theme='solid' size={'large'} onClick={submit}>
                {getTranslation('submit', userLanguage)}
              </Button>
              <Button
                theme='solid'
                size={'large'}
                type={'tertiary'}
                onClick={handleCancel}
              >
                {getTranslation('cancel', userLanguage)}
              </Button>
            </Space>
          </div>
        }
        closeIcon={null}
        onCancel={() => handleCancel()}
        width={isMobile() ? '100%' : 600}
      >
        <Spin spinning={loading}>
          <Input
            style={{ marginTop: 20 }}
            label={getTranslation('nameLabel', userLanguage)}
            name='name'
            placeholder={getTranslation('namePlaceholder', userLanguage)}
            onChange={(value) => handleInputChange('name', value)}
            value={name}
            autoComplete='new-password'
            required={!isEdit}
          />
          <Divider />
          <DatePicker
            label={getTranslation('expiredTimeLabel', userLanguage)}
            name='expired_time'
            placeholder={getTranslation('expiredTimePlaceholder', userLanguage)}
            onChange={(value) => handleInputChange('expired_time', value)}
            value={expired_time}
            autoComplete='new-password'
            type='dateTime'
          />
          <div style={{ marginTop: 20 }}>
            <Space>
              <Button
                type={'tertiary'}
                onClick={() => {
                  setExpiredTime(0, 0, 0, 0);
                }}
              >
                {getTranslation('neverExpires', userLanguage)}
              </Button>
              <Button
                type={'tertiary'}
                onClick={() => {
                  setExpiredTime(0, 0, 1, 0);
                }}
              >
                {getTranslation('oneHour', userLanguage)}
              </Button>
              <Button
                type={'tertiary'}
                onClick={() => {
                  setExpiredTime(1, 0, 0, 0);
                }}
              >
                {getTranslation('oneMonth', userLanguage)}
              </Button>
              <Button
                type={'tertiary'}
                onClick={() => {
                  setExpiredTime(0, 1, 0, 0);
                }}
              >
                {getTranslation('oneDay', userLanguage)}
              </Button>
            </Space>
          </div>

          <Divider />
          <Banner
            type={'warning'}
            description={
              getTranslation('descriptionNotice', userLanguage)
            }
          ></Banner>
          <div style={{ marginTop: 20 }}>
            <Typography.Text>{`${getTranslation('quotaPrefix', userLanguage)}${renderQuotaWithPrompt(remain_quota)}`}</Typography.Text>
          </div>
          <AutoComplete
            style={{ marginTop: 8 }}
            name='remain_quota'
            placeholder={getTranslation('inputQuotaPlaceholder', userLanguage)}
            onChange={(value) => handleInputChange('remain_quota', value)}
            value={remain_quota}
            autoComplete='new-password'
            type='number'
            // position={'top'}
            data={[
              { value: 500000, label: '1$' },
              { value: 5000000, label: '10$' },
              { value: 25000000, label: '50$' },
              { value: 50000000, label: '100$' },
              { value: 250000000, label: '500$' },
              { value: 500000000, label: '1000$' },
            ]}
            disabled={unlimited_quota}
          />

          {!isEdit && (
            <>
              <div style={{ marginTop: 20 }}>
                <Typography.Text>{getTranslation('newTokenCount', userLanguage)}</Typography.Text>
              </div>
              <AutoComplete
                style={{ marginTop: 8 }}
                label={getTranslation('quantityLabel', userLanguage)}
                placeholder={getTranslation('quantityPlaceholder', userLanguage)}
                onChange={(value) => handleTokenCountChange(value)}
                onSelect={(value) => handleTokenCountChange(value)}
                value={tokenCount.toString()}
                autoComplete='off'
                type='number'
                data={[
                  { value: 10, label: getTranslation('tokenOption10', userLanguage) },
                  { value: 20, label: getTranslation('tokenOption10', userLanguage) },
                  { value: 30, label: getTranslation('tokenOption30', userLanguage) },
                  { value: 100, label: getTranslation('tokenOption30', userLanguage) },
                ]}
                disabled={unlimited_quota}
              />
            </>
          )}

          <div>
            <Button
              style={{ marginTop: 8 }}
              type={'warning'}
              onClick={() => {
                setUnlimitedQuota();
              }}
            >
              {unlimited_quota
				? getTranslation('unlimitedQuotaToggle', userLanguage)
				: getTranslation('setUnlimitedQuota', userLanguage)}
            </Button>
          </div>
          <Divider />
          <div style={{ marginTop: 10 }}>
            <Typography.Text>{getTranslation('ipWhitelistNotice', userLanguage)}</Typography.Text>
          </div>
          <TextArea
            label={getTranslation('ipWhitelistLabel', userLanguage)}
            name='allow_ips'
            placeholder={getTranslation('ipWhitelistPlaceholder', userLanguage)}
            onChange={(value) => {
              handleInputChange('allow_ips', value);
            }}
            value={inputs.allow_ips}
            style={{ fontFamily: 'JetBrains Mono, Consolas' }}
          />
          <div style={{ marginTop: 10, display: 'flex' }}>
            <Space>
              <Checkbox
                name='model_limits_enabled'
                checked={model_limits_enabled}
                onChange={(e) =>
                  handleInputChange('model_limits_enabled', e.target.checked)
                }
              ></Checkbox>
              <Typography.Text>
                {getTranslation('enableModelRestrictionNotice', userLanguage)}
              </Typography.Text>
            </Space>
          </div>

          <Select
            style={{ marginTop: 8 }}
            placeholder={getTranslation('modelRestrictionPlaceholder', userLanguage)}
            name='models'
            required
            multiple
            selection
            onChange={(value) => {
              handleInputChange('model_limits', value);
            }}
            value={inputs.model_limits}
            autoComplete='new-password'
            optionList={models}
            disabled={!model_limits_enabled}
          />
          <div style={{ marginTop: 10 }}>
            <Typography.Text>{getTranslation('tokenGroupNotice', userLanguage)}</Typography.Text>
          </div>
          {groups.length > 0 ?
            <Select
              style={{ marginTop: 8 }}
              placeholder={getTranslation('tokenGroupPlaceholder', userLanguage)}
              name='gruop'
              required
              selection
              onChange={(value) => {
                handleInputChange('group', value);
              }}
              value={inputs.group}
              autoComplete='new-password'
              optionList={groups}
            />:
            <Select
              style={{ marginTop: 8 }}
              placeholder={getTranslation('noAdminGroupSetPlaceholder', userLanguage)}
              name='gruop'
              disabled={true}
            />
          }
        </Spin>
      </SideSheet>
    </>
  );
};

export default EditToken;

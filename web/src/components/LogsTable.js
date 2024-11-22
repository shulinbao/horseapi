import React, { useEffect, useState } from 'react';
import {
  API,
  copy,
  getTodayStartTimestamp,
  isAdmin,
  showError,
  showSuccess,
  timestamp2string,
} from '../helpers';

import {
  Avatar,
  Button, Descriptions,
  Form,
  Layout,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip
} from '@douyinfe/semi-ui';
import { ITEMS_PER_PAGE } from '../constants';
import {
  renderAudioModelPrice,
  renderModelPrice,
  renderNumber,
  renderQuota,
  stringToColor
} from '../helpers/render';
import Paragraph from '@douyinfe/semi-ui/lib/es/typography/paragraph';
import { getLogOther } from '../helpers/other.js';









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
  'totalQuota': {
    'zh-Hant': '總消耗額度: ',
    'zh': '总消耗额度: ',
    'en': 'Total Quota: '
  },
  'rpm': {
    'zh-Hant': 'RPM: ',
    'zh': 'RPM: ',
    'en': 'RPM: '
  },
  'tpm': {
    'zh-Hant': 'TPM: ',
    'zh': 'TPM: ',
    'en': 'TPM: '
  },
  'tokenName': {
    'zh-Hant': '令牌名稱',
    'zh': '令牌名称',
    'en': 'Token Name'
  },
  'modelName': {
    'zh-Hant': '模型名稱',
    'zh': '模型名称',
    'en': 'Model Name'
  },
  'startTimestamp': {
    'zh-Hant': '起始時間',
    'zh': '起始时间',
    'en': 'Start Time'
  },
  'endTimestamp': {
    'zh-Hant': '結束時間',
    'zh': '结束时间',
    'en': 'End Time'
  },
  'channelId': {
    'zh-Hant': '渠道 ID',
    'zh': '渠道 ID',
    'en': 'Channel ID'
  },
  'userName': {
    'zh-Hant': '用戶名稱',
    'zh': '用户名',
    'en': 'User Name'
  },
  'query': {
    'zh-Hant': '查詢',
    'zh': '查询',
    'en': 'Query'
  },
  'logType': {
    'zh-Hant': '全部',
    'zh': '全部',
    'en': 'All'
  },
  'recharge': {
    'zh-Hant': '充值',
    'zh': '充值',
    'en': 'Recharge'
  },
  'consume': {
    'zh-Hant': '消費',
    'zh': '消费',
    'en': 'Consume'
  },
  'manage': {
    'zh-Hant': '管理',
    'zh': '管理',
    'en': 'Manage'
  },
  'system': {
    'zh-Hant': '系統',
    'zh': '系统',
    'en': 'System'
  },
    'copySuccess': {
    'zh-Hant': '已複製：',
    'zh': '已复制：',
    'en': 'Copied: '
  },
  'copyError': {
    'zh-Hant': '無法複製到剪貼板，請手動複製',
    'zh': '无法复制到剪贴板，请手动复制',
    'en': 'Unable to copy to clipboard, please copy manually'
  },
  'userInfoTitle': {
    'zh-Hant': '用戶信息',
    'zh': '用户信息',
    'en': 'User Information'
  },
  'userName': {
    'zh-Hant': '用戶名稱',
    'zh': '用户名',
    'en': 'User Name'
  },
  'balance': {
    'zh-Hant': '餘額',
    'zh': '余额',
    'en': 'Balance'
  },
  'usedQuota': {
    'zh-Hant': '已用額度',
    'zh': '已用额度',
    'en': 'Used Quota'
  },
  'requestCount': {
    'zh-Hant': '請求次數',
    'zh': '请求次数',
    'en': 'Request Count'
  },
  'logDetails': {
    'zh-Hant': '日誌詳情',
    'zh': '日志详情',
    'en': 'Log Details'
  },
  'billingProcess': {
    'zh-Hant': '計費過程',
    'zh': '计费过程',
    'en': 'Billing Process'
  },
  'time': {
    'zh-Hant': '時間',
    'zh': '时间',
    'en': 'Time'
  },
  'channel': {
    'zh-Hant': '渠道',
    'zh': '渠道',
    'en': 'Channel'
  },
  'user': {
    'zh-Hant': '用戶',
    'zh': '用户',
    'en': 'User'
  },
  'token': {
    'zh-Hant': '令牌',
    'zh': '令牌',
    'en': 'Token'
  },
  'type': {
    'zh-Hant': '類型',
    'zh': '类型',
    'en': 'Type'
  },
  'model': {
    'zh-Hant': '模型',
    'zh': '模型',
    'en': 'Model'
  },
  'useTime': {
    'zh-Hant': '用時',
    'zh': '用时',
    'en': 'Use Time'
  },
  'prompt': {
    'zh-Hant': '提示',
    'zh': '提示',
    'en': 'Prompt'
  },
  'completion': {
    'zh-Hant': '補全',
    'zh': '补全',
    'en': 'Completion'
  },
  'quota': {
    'zh-Hant': '花費',
    'zh': '花费',
    'en': 'Quota'
  },
  'retry': {
    'zh-Hant': '重試',
    'zh': '重试',
    'en': 'Retry'
  },
  'details': {
    'zh-Hant': '詳情',
    'zh': '详情',
    'en': 'Details'
  },
  'recharge': {
    'zh-Hant': '充值',
    'zh': '充值',
    'en': 'Recharge'
  },
  'consume': {
    'zh-Hant': '消費',
    'zh': '消费',
    'en': 'Consume'
  },
  'manage': {
    'zh-Hant': '管理',
    'zh': '管理',
    'en': 'Manage'
  },
  'system': {
    'zh-Hant': '系統',
    'zh': '系统',
    'en': 'System'
  },
  'stream': {
    'zh-Hant': '流',
    'zh': '流',
    'en': 'Stream'
  },
  'nonStream': {
    'zh-Hant': '非流',
    'zh': '非流',
    'en': 'Non-Stream'
  },
  'unknown': {
    'zh-Hant': '未知',
    'zh': '未知',
    'en': 'Unknown'
  },
  'channel': {
    'zh-Hant': '渠道',
    'zh': '渠道',
    'en': 'Channel'
  },
  'consumeCall': {
    'zh-Hant': '調用消費',
    'zh': '调用消费',
    'en': 'Consume Call'
  },
  'placeholder': {
    'zh-Hant': '可選值',
    'zh': '可选值',
    'en': 'Optional Value'
  }
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言














const { Header } = Layout;

function renderTimestamp(timestamp) {
  return <>{timestamp2string(timestamp)}</>;
}

const MODE_OPTIONS = [
  { key: 'all', text: '全部用户', value: 'all' },
  { key: 'self', text: '当前用户', value: 'self' },
];

const colors = [
  'amber',
  'blue',
  'cyan',
  'green',
  'grey',
  'indigo',
  'light-blue',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'violet',
  'yellow',
];


function renderType(type) {
  switch (type) {
    case 1:
      return (
        <Tag color='cyan' size='large'>
          {getTranslation('recharge', userLanguage)}
        </Tag>
      );
    case 2:
      return (
        <Tag color='lime' size='large'>
          {getTranslation('consume', userLanguage)}
        </Tag>
      );
    case 3:
      return (
        <Tag color='orange' size='large'>
          {getTranslation('manage', userLanguage)}
        </Tag>
      );
    case 4:
      return (
        <Tag color='purple' size='large'>
          {getTranslation('system', userLanguage)}
        </Tag>
      );
    default:
      return (
        <Tag color='black' size='large'>
          {getTranslation('unknown', userLanguage)}
        </Tag>
      );
  }
}

function renderIsStream(bool) {
  if (bool) {
    return (
      <Tag color='blue' size='large'>
        {getTranslation('stream', userLanguage)}
      </Tag>
    );
  } else {
    return (
      <Tag color='purple' size='large'>
        {getTranslation('nonStream', userLanguage)}
      </Tag>
    );
  }
}








function renderUseTime(type) {
  const time = parseInt(type);
  if (time < 101) {
    return (
      <Tag color='green' size='large'>
        {' '}
        {time} s{' '}
      </Tag>
    );
  } else if (time < 300) {
    return (
      <Tag color='orange' size='large'>
        {' '}
        {time} s{' '}
      </Tag>
    );
  } else {
    return (
      <Tag color='red' size='large'>
        {' '}
        {time} s{' '}
      </Tag>
    );
  }
}

function renderFirstUseTime(type) {
  let time = parseFloat(type) / 1000.0;
  time = time.toFixed(1);
  if (time < 3) {
    return (
      <Tag color='green' size='large'>
        {' '}
        {time} s{' '}
      </Tag>
    );
  } else if (time < 10) {
    return (
      <Tag color='orange' size='large'>
        {' '}
        {time} s{' '}
      </Tag>
    );
  } else {
    return (
      <Tag color='red' size='large'>
        {' '}
        {time} s{' '}
      </Tag>
    );
  }
}














const LogsTable = () => {
  const columns = [
    {
      title: getTranslation('time', userLanguage),
      dataIndex: 'timestamp2string',
    },
    {
      title: getTranslation('channel', userLanguage),
      dataIndex: 'channel',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return isAdminUser ? (
          record.type === 0 || record.type === 2 ? (
            <div>
              {
                <Tag
                  color={colors[parseInt(text) % colors.length]}
                  size='large'
                >
                  {' '}
                  {text}{' '}
                </Tag>
              }
            </div>
          ) : (
            <></>
          )
        ) : (
          <></>
        );
      },
    },
    {
      title: getTranslation('user', userLanguage),
      dataIndex: 'username',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return isAdminUser ? (
          <div>
            <Avatar
              size='small'
              color={stringToColor(text)}
              style={{ marginRight: 4 }}
              onClick={() => showUserInfo(record.user_id)}
            >
              {typeof text === 'string' && text.slice(0, 1)}
            </Avatar>
            {text}
          </div>
        ) : (
          <></>
        );
      },
    },
    {
      title: getTranslation('token', userLanguage),
      dataIndex: 'token_name',
      render: (text, record, index) => {
        return record.type === 0 || record.type === 2 ? (
          <div>
            <Tag
              color='grey'
              size='large'
              onClick={() => {
                copyText(text);
              }}
            >
              {' '}
              {text}{' '}
            </Tag>
          </div>
        ) : (
          <></>
        );
      },
    },
    {
      title: getTranslation('type', userLanguage),
      dataIndex: 'type',
      render: (text, record, index) => {
        return <>{renderType(text)}</>;
      },
    },
    {
      title: getTranslation('model', userLanguage),
      dataIndex: 'model_name',
      render: (text, record, index) => {
        return record.type === 0 || record.type === 2 ? (
          <>
            <Tag
              color={stringToColor(text)}
              size='large'
              onClick={() => {
                copyText(text);
              }}
            >
              {' '}
              {text}{' '}
            </Tag>
          </>
        ) : (
          <></>
        );
      },
    },
    {
      title: getTranslation('useTime', userLanguage),
      dataIndex: 'use_time',
      render: (text, record, index) => {
        if (record.is_stream) {
          let other = getLogOther(record.other);
          return (
            <>
              <Space>
                {renderUseTime(text)}
                {renderFirstUseTime(other.frt)}
                {renderIsStream(record.is_stream)}
              </Space>
            </>
          );
        } else {
          return (
            <>
              <Space>
                {renderUseTime(text)}
                {renderIsStream(record.is_stream)}
              </Space>
            </>
          );
        }
      },
    },
    {
      title: getTranslation('prompt', userLanguage),
      dataIndex: 'prompt_tokens',
      render: (text, record, index) => {
        return record.type === 0 || record.type === 2 ? (
          <>{<span> {text} </span>}</>
        ) : (
          <></>
        );
      },
    },
    {
      title: getTranslation('completion', userLanguage),
      dataIndex: 'completion_tokens',
      render: (text, record, index) => {
        return parseInt(text) > 0 &&
          (record.type === 0 || record.type === 2) ? (
          <>{<span> {text} </span>}</>
        ) : (
          <></>
        );
      },
    },
    {
      title: getTranslation('quota', userLanguage),
      dataIndex: 'quota',
      render: (text, record, index) => {
        return record.type === 0 || record.type === 2 ? (
          <>{renderQuota(text, 6)}</>
        ) : (
          <></>
        );
      },
    },
    {
      title: getTranslation('retry', userLanguage),
      dataIndex: 'retry',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        let content = getTranslation('channel', userLanguage) + record.channel;
        if (record.other !== '') {
          let other = JSON.parse(record.other);
          if (other === null) {
            return <></>;
          }
          if (other.admin_info !== undefined) {
            if (
              other.admin_info.use_channel !== null &&
              other.admin_info.use_channel !== undefined &&
              other.admin_info.use_channel !== ''
            ) {
              // channel id array
              let useChannel = other.admin_info.use_channel;
              let useChannelStr = useChannel.join('->');
              content = `${getTranslation('channel', userLanguage)}${useChannelStr}`;
            }
          }
        }
        return isAdminUser ? <div>{content}</div> : <></>;
      },
    },
    {
      title: getTranslation('details', userLanguage),
      dataIndex: 'content',
      render: (text, record, index) => {
        let other = getLogOther(record.other);
        if (other == null || record.type !== 2) {
          return (
            <Paragraph
              ellipsis={{
                rows: 2,
                showTooltip: {
                  type: 'popover',
                  opts: { style: { width: 240 } },
                },
              }}
              style={{ maxWidth: 240 }}
            >
              {text}
            </Paragraph>
          );
        }


        return (
			<Paragraph
				ellipsis={{
				rows: 2,
				}}
				style={{ maxWidth: 240 }}
			>
			{getTranslation('consumeCall', userLanguage)}
			</Paragraph>
		);
      },
    },
  ];












  const [logs, setLogs] = useState([]);
  const [expandData, setExpandData] = useState({});
  const [showStat, setShowStat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStat, setLoadingStat] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [logCount, setLogCount] = useState(ITEMS_PER_PAGE);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [logType, setLogType] = useState(0);
  const isAdminUser = isAdmin();
  let now = new Date();
  // 初始化start_timestamp为今天0点
  const [inputs, setInputs] = useState({
    username: '',
    token_name: '',
    model_name: '',
    start_timestamp: timestamp2string(getTodayStartTimestamp()),
    end_timestamp: timestamp2string(now.getTime() / 1000 + 3600),
    channel: '',
  });
  const {
    username,
    token_name,
    model_name,
    start_timestamp,
    end_timestamp,
    channel,
  } = inputs;

  const [stat, setStat] = useState({
    quota: 0,
    token: 0,
  });

  const handleInputChange = (value, name) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const getLogSelfStat = async () => {
    let localStartTimestamp = Date.parse(start_timestamp) / 1000;
    let localEndTimestamp = Date.parse(end_timestamp) / 1000;
    let url = `/api/log/self/stat?type=${logType}&token_name=${token_name}&model_name=${model_name}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`;
    url = encodeURI(url);
    let res = await API.get(url);
    const { success, message, data } = res.data;
    if (success) {
      setStat(data);
    } else {
      showError(message);
    }
  };

  const getLogStat = async () => {
    let localStartTimestamp = Date.parse(start_timestamp) / 1000;
    let localEndTimestamp = Date.parse(end_timestamp) / 1000;
    let url = `/api/log/stat?type=${logType}&username=${username}&token_name=${token_name}&model_name=${model_name}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&channel=${channel}`;
    url = encodeURI(url);
    let res = await API.get(url);
    const { success, message, data } = res.data;
    if (success) {
      setStat(data);
    } else {
      showError(message);
    }
  };

  const handleEyeClick = async () => {
    if (loadingStat) {
      return;
    }
    setLoadingStat(true);
    if (isAdminUser) {
      await getLogStat();
    } else {
      await getLogSelfStat();
    }
    setShowStat(true);
    setLoadingStat(false);
  };









 const showUserInfo = async (userId) => {
  if (!isAdminUser) {
    return;
  }
  const res = await API.get(`/api/user/${userId}`);
  const { success, message, data } = res.data;
  if (success) {
    Modal.info({
      title: getTranslation('userInfoTitle', userLanguage),
      content: (
        <div style={{ padding: 12 }}>
          <p>{getTranslation('userName', userLanguage)}: {data.username}</p>
          <p>{getTranslation('balance', userLanguage)}: {renderQuota(data.quota)}</p>
          <p>{getTranslation('usedQuota', userLanguage)}：{renderQuota(data.used_quota)}</p>
          <p>{getTranslation('requestCount', userLanguage)}：{renderNumber(data.request_count)}</p>
        </div>
      ),
      centered: true,
    });
  } else {
    showError(message);
  }
};

const setLogsFormat = (logs) => {
  let expandDatesLocal = {};
  for (let i = 0; i < logs.length; i++) {
    logs[i].timestamp2string = timestamp2string(logs[i].created_at);
    logs[i].key = i;
    let other = getLogOther(logs[i].other);
    let expandDataLocal = [];
    if (isAdmin()) {

    }
    if (other?.ws || other?.audio) {
      expandDataLocal.push({
        key: getTranslation('logDetails', userLanguage),
        value: other.audio_input,
      });
      expandDataLocal.push({
        key: getTranslation('logDetails', userLanguage),
        value: other.audio_output,
      });
      expandDataLocal.push({
        key: getTranslation('logDetails', userLanguage),
        value: other.text_input,
      });
      expandDataLocal.push({
        key: getTranslation('logDetails', userLanguage),
        value: other.text_output,
      });
    }
    expandDataLocal.push({
      key: getTranslation('logDetails', userLanguage),
      value: logs[i].content,
    })
    if (logs[i].type === 2) {
      let content = '';
      if (other?.ws || other?.audio) {
        content = renderAudioModelPrice(
          other.text_input,
          other.text_output,
          other.model_ratio,
          other.model_price,
          other.completion_ratio,
          other.audio_input,
          other.audio_output,
          other?.audio_ratio,
          other?.audio_completion_ratio,
          other.group_ratio,
        );
      } else {
        content = renderModelPrice(
          logs[i].prompt_tokens,
          logs[i].completion_tokens,
          other.model_ratio,
          other.model_price,
          other.completion_ratio,
          other.group_ratio,
        );
      }
      expandDataLocal.push({
        key: getTranslation('billingProcess', userLanguage),
        value: content,
      });
    }

    expandDatesLocal[logs[i].key] = expandDataLocal;
  }

  setExpandData(expandDatesLocal);

  setLogs(logs);
};









  const loadLogs = async (startIdx, pageSize, logType = 0) => {
    setLoading(true);

    let url = '';
    let localStartTimestamp = Date.parse(start_timestamp) / 1000;
    let localEndTimestamp = Date.parse(end_timestamp) / 1000;
    if (isAdminUser) {
      url = `/api/log/?p=${startIdx}&page_size=${pageSize}&type=${logType}&username=${username}&token_name=${token_name}&model_name=${model_name}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&channel=${channel}`;
    } else {
      url = `/api/log/self/?p=${startIdx}&page_size=${pageSize}&type=${logType}&token_name=${token_name}&model_name=${model_name}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`;
    }
    url = encodeURI(url);
    const res = await API.get(url);
    const { success, message, data } = res.data;
    if (success) {
      const newPageData = data.items;
      setActivePage(data.page);
      setPageSize(data.page_size);
      setLogCount(data.total);

      setLogsFormat(newPageData);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    loadLogs(page, pageSize, logType).then((r) => {});
  };

  const handlePageSizeChange = async (size) => {
    localStorage.setItem('page-size', size + '');
    setPageSize(size);
    setActivePage(1);
    loadLogs(activePage, size)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  };

  const refresh = async () => {
    setActivePage(1);
    handleEyeClick();
    await loadLogs(activePage, pageSize, logType);
  };







const copyText = async (text) => {
  if (await copy(text)) {
    showSuccess(getTranslation('copySuccess', userLanguage) + text);
  } else {
    Modal.error({ title: getTranslation('copyError', userLanguage), content: text });
  }
};











  useEffect(() => {
    const localPageSize =
      parseInt(localStorage.getItem('page-size')) || ITEMS_PER_PAGE;
    setPageSize(localPageSize);
    loadLogs(activePage, localPageSize)
      .then()
      .catch((reason) => {
        showError(reason);
      });
    handleEyeClick();
  }, []);

  const expandRowRender = (record, index) => {
    return <Descriptions data={expandData[record.key]} />;
  };
















  return (
    <>
    <Layout>
      <Header>
        <Spin spinning={loadingStat}>
          <Space>
            <Tag color='green' size='large' style={{ padding: 15 }}>
              {getTranslation('totalQuota', userLanguage)} {renderQuota(stat.quota)}
            </Tag>
            <Tag color='blue' size='large' style={{ padding: 15 }}>
              {getTranslation('rpm', userLanguage)} {stat.rpm}
            </Tag>
            <Tag color='purple' size='large' style={{ padding: 15 }}>
              {getTranslation('tpm', userLanguage)} {stat.tpm}
            </Tag>
          </Space>
        </Spin>
      </Header>
      <Form layout='horizontal' style={{ marginTop: 10 }}>
        <>
          <Form.Input
            field='token_name'
            label={getTranslation('tokenName', userLanguage)}
            style={{ width: 176 }}
            value={token_name}
            placeholder={getTranslation('placeholder', userLanguage)}
            name='token_name'
            onChange={(value) => handleInputChange(value, 'token_name')}
          />
          <Form.Input
            field='model_name'
            label={getTranslation('modelName', userLanguage)}
            style={{ width: 176 }}
            value={model_name}
            placeholder={getTranslation('placeholder', userLanguage)}
            name='model_name'
            onChange={(value) => handleInputChange(value, 'model_name')}
          />
          <Form.DatePicker
            field='start_timestamp'
            label={getTranslation('startTimestamp', userLanguage)}
            style={{ width: 272 }}
            initValue={start_timestamp}
            value={start_timestamp}
            type='dateTime'
            name='start_timestamp'
            onChange={(value) => handleInputChange(value, 'start_timestamp')}
          />
          <Form.DatePicker
            field='end_timestamp'
            fluid
            label={getTranslation('endTimestamp', userLanguage)}
            style={{ width: 272 }}
            initValue={end_timestamp}
            value={end_timestamp}
            type='dateTime'
            name='end_timestamp'
            onChange={(value) => handleInputChange(value, 'end_timestamp')}
          />
          {isAdminUser && (
            <>
              <Form.Input
                field='channel'
                label={getTranslation('channelId', userLanguage)}
                style={{ width: 176 }}
                value={channel}
                placeholder={getTranslation('placeholder', userLanguage)}
                name='channel'
                onChange={(value) => handleInputChange(value, 'channel')}
              />
              <Form.Input
                field='username'
                label={getTranslation('userName', userLanguage)}
                style={{ width: 176 }}
                value={username}
                placeholder={getTranslation('placeholder', userLanguage)}
                name='username'
                onChange={(value) => handleInputChange(value, 'username')}
              />
            </>
          )}
          <Button
            label={getTranslation('query', userLanguage)}
            type='primary'
            htmlType='submit'
            className='btn-margin-right'
            onClick={refresh}
            loading={loading}
            style={{ marginTop: 24 }}
          >
            {getTranslation('query', userLanguage)}
          </Button>
          <Form.Section></Form.Section>
        </>
      </Form>
      <div style={{marginTop:10}}>
        <Select
          defaultValue='0'
          style={{ width: 120 }}
          onChange={(value) => {
            setLogType(parseInt(value));
            loadLogs(0, pageSize, parseInt(value));
          }}
        >
          <Select.Option value='0'>{getTranslation('logType', userLanguage)}</Select.Option>
          <Select.Option value='1'>{getTranslation('recharge', userLanguage)}</Select.Option>
          <Select.Option value='2'>{getTranslation('consume', userLanguage)}</Select.Option>
          <Select.Option value='3'>{getTranslation('manage', userLanguage)}</Select.Option>
          <Select.Option value='4'>{getTranslation('system', userLanguage)}</Select.Option>
        </Select>
      </div>
      <Table
        style={{ marginTop: 5 }}
        columns={columns}
        expandedRowRender={expandRowRender}
        expandRowByClick={true}
        dataSource={logs}
        rowKey="key"
        pagination={{
          currentPage: activePage,
          pageSize: pageSize,
          total: logCount,
          pageSizeOpts: [10, 20, 50, 100],
          showSizeChanger: true,
          onPageSizeChange: (size) => {
            handlePageSizeChange(size);
          },
          onPageChange: handlePageChange,
        }}
      />
    </Layout>
    </>
  );
};

export default LogsTable;
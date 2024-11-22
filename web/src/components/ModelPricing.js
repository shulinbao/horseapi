import React, { useContext, useEffect, useRef, useMemo, useState } from 'react';
import { API, copy, showError, showInfo, showSuccess } from '../helpers';

import {
  Banner,
  Input,
  Layout,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Popover,
  ImagePreview,
  Button,
} from '@douyinfe/semi-ui';
import {
  IconMore,
  IconVerify,
  IconUploadError,
  IconHelpCircle,
} from '@douyinfe/semi-icons';
import { UserContext } from '../context/User/index.js';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';






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
  'payPerUse': {
    'zh-Hant': '按次計費',
    'zh': '按次计费',
    'en': 'Pay Per Use',
  },
  'payPerQuantity': {
    'zh-Hant': '按量計費',
    'zh': '按量计费',
    'en': 'Pay Per Quantity',
  },
  'unknown': {
    'zh-Hant': '未知',
    'zh': '未知',
    'en': 'Unknown',
  },
  'groupCanUseModel': {
    'zh-Hant': '您的分組可以使用該模型',
    'zh': '您的分组可以使用该模型',
    'en': 'Your group can use this model',
  },
  'groupCannotUseModel': {
    'zh-Hant': '您的分組無權使用該模型',
    'zh': '您的分组无权使用该模型',
    'en': 'Your group does not have permission to use this model',
  },
    'availability': {
    'zh-Hant': '可用性',
    'zh': '可用性',
    'en': 'Availability',
  },
  'modelName': {
    'zh-Hant': '模型名稱',
    'zh': '模型名称',
    'en': 'Model Name',
  },
  'searchPlaceholder': {
    'zh-Hant': '模糊搜索',
    'zh': '模糊搜索',
    'en': 'Fuzzy Search',
  },
  'quotaType': {
    'zh-Hant': '計費類型',
    'zh': '计费类型',
    'en': 'Quota Type',
  },
  'availableGroups': {
    'zh-Hant': '可用分組',
    'zh': '可用分组',
    'en': 'Available Groups',
  },
  'groupTag': {
    'zh-Hant': '分組',
    'zh': '分组',
    'en': 'Group',
  },
  'currentGroup': {
    'zh-Hant': '當前查看的分組為：',
    'zh': '当前查看的分组为：',
    'en': 'The currently viewed group is: ',
  },
  'groupRatio': {
    'zh-Hant': '倍率為：',
    'zh': '倍率为：',
    'en': 'The ratio is: ',
  },
    'modelRatio': {
    'zh-Hant': '倍率',
    'zh': '倍率',
    'en': 'Ratio',
  },
  'modelPrice': {
    'zh-Hant': '模型價格',
    'zh': '模型价格',
    'en': 'Model Price',
  },
  'pricePerMToken': {
    'zh-Hant': '每百萬token價格',
    'zh': '每百万token价格',
    'en': 'Price per 1M tokens',
  },
  'completionPrice': {
    'zh-Hant': '補全價格',
    'zh': '补全价格',
    'en': 'Completion Price',
  },
  'helpTooltip': {
    'zh-Hant': '倍率是為了方便換算不同價格的模型<br/>點擊查看倍率說明',
    'zh': '倍率是为了方便换算不同价格的模型<br/>点击查看倍率说明',
    'en': 'The ratio is to help convert between models with different prices<br/>Click to view ratio explanation',
  },
  'defaultGroup': {
    'zh-Hant': '您的默認分組為：',
    'zh': '您的默认分组为：',
    'en': 'Your default group is: ',
  },
  'notLoggedIn': {
    'zh-Hant': '您尚未登錄，顯示的價格為默認分組倍率：',
    'zh': '您还未登录，显示的价格为默认分组倍率：',
    'en': 'You are not logged in, the displayed price is for the default group ratio: ',
  },
  'perUnitPrice': {
    'zh-Hant': '按量計費費用 = 分組倍率 × 模型倍率 × （提示token數 + 補全token數 × 補全倍率）/ 500000 （單位：美元）',
    'zh': '按量计费费用 = 分组倍率 × 模型倍率 × （提示token数 + 补全token数 × 补全倍率）/ 500000 （单位：美元）',
    'en': 'Per unit price = Group ratio × Model ratio × (Prompt tokens + Completion tokens × Completion ratio) / 500000 (Unit: USD)',
  },
  'copySelectedModel': {
    'zh-Hant': '複製選中模型',
    'zh': '复制选中模型',
    'en': 'Copy selected model',
  },
  'copySuccess': {
    'zh-Hant': '已複製：',
    'zh': '已复制：',
    'en': 'Copied: ',
  },
  'copyError': {
    'zh-Hant': '無法複製到剪貼板，請手動複製',
    'zh': '无法复制到剪贴板，请手动复制',
    'en': 'Unable to copy to clipboard, please copy manually',
  },  
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言










function renderQuotaType(type) {
  // Ensure all cases are string literals by adding quotes.
  switch (type) {
    case 1:
      return (
        <Tag color='teal' size='large'>
          {getTranslation('payPerUse', userLanguage)}
        </Tag>
      );
    case 0:
      return (
        <Tag color='violet' size='large'>
          {getTranslation('payPerQuantity', userLanguage)}
        </Tag>
      );
    default:
      return getTranslation('unknown', userLanguage);
  }
}

function renderAvailable(available) {
  return available ? (
    <Popover
        content={
          <div style={{ padding: 8 }}>{getTranslation('groupCanUseModel', userLanguage)}</div>
        }
        position='top'
        key={available}
        style={{
            backgroundColor: 'rgba(var(--semi-blue-4),1)',
            borderColor: 'rgba(var(--semi-blue-4),1)',
            color: 'var(--semi-color-white)',
            borderWidth: 1,
            borderStyle: 'solid',
        }}
    >
        <IconVerify style={{ color: 'green' }}  size="large" />
    </Popover>
  ) : (
    <Popover
        content={
          <div style={{ padding: 8 }}>{getTranslation('groupCannotUseModel', userLanguage)}</div>
        }
        position='top'
        key={available}
        style={{
            backgroundColor: 'rgba(var(--semi-blue-4),1)',
            borderColor: 'rgba(var(--semi-blue-4),1)',
            color: 'var(--semi-color-white)',
            borderWidth: 1,
            borderStyle: 'solid',
        }}
    >
        <IconUploadError style={{ color: '#FFA54F' }}  size="large" />
    </Popover>
  );
}

const ModelPricing = () => {
  const [filteredValue, setFilteredValue] = useState([]);
  const compositionRef = useRef({ isComposition: false });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [isModalOpenurl, setIsModalOpenurl] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('default');

  const rowSelection = useMemo(
      () => ({
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
          },
      }),
      []
  );

  const handleChange = (value) => {
    if (compositionRef.current.isComposition) {
      return;
    }
    const newFilteredValue = value ? [value] : [];
    setFilteredValue(newFilteredValue);
  };
  const handleCompositionStart = () => {
    compositionRef.current.isComposition = true;
  };

  const handleCompositionEnd = (event) => {
    compositionRef.current.isComposition = false;
    const value = event.target.value;
    const newFilteredValue = value ? [value] : [];
    setFilteredValue(newFilteredValue);
  };



















const columns = [
  {
    title: getTranslation('availability', userLanguage),
    dataIndex: 'available',
    render: (text, record, index) => {
       // if record.enable_groups contains selectedGroup, then available is true
      return renderAvailable(record.enable_groups.includes(selectedGroup));
    },
    sorter: (a, b) => a.available - b.available,
  },
  {
    title: (
      <Space>
        <span>{getTranslation('modelName', userLanguage)}</span>
        <Input
          placeholder={getTranslation('searchPlaceholder', userLanguage)}
          style={{ width: 200 }}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onChange={handleChange}
          showClear
        />
      </Space>
    ),
    dataIndex: 'model_name',
    render: (text, record, index) => {
      return (
        <>
          <Tag
            color='green'
            size='large'
            onClick={() => {
              copyText(text);
            }}
          >
            {text}
          </Tag>
        </>
      );
    },
    onFilter: (value, record) =>
      record.model_name.toLowerCase().includes(value.toLowerCase()),
    filteredValue,
  },
  {
    title: getTranslation('quotaType', userLanguage),
    dataIndex: 'quota_type',
    render: (text, record, index) => {
      return renderQuotaType(parseInt(text));
    },
    sorter: (a, b) => a.quota_type - b.quota_type,
  },
  {
    title: getTranslation('availableGroups', userLanguage),
    dataIndex: 'enable_groups',
    render: (text, record, index) => {
      return (
        <Space>
          {text.map((group) => {
            if (group === selectedGroup) {
              return (
                <Tag
                  color='blue'
                  size='large'
                  prefixIcon={<IconVerify />}
                >
                  {group}
                </Tag>
              );
            } else {
              return (
                <Tag
                  color='blue'
                  size='large'
                  onClick={() => {
                    setSelectedGroup(group);
                    showInfo(getTranslation('currentGroup', userLanguage) + group + getTranslation('groupRatio', userLanguage) + groupRatio[group]);
                  }}
                >
                  {group}
                </Tag>
              );
            }
          })}
        </Space>
      );
    },
  },

	
	
	
	
	
	
	
	
	
	
  {
    title: () => (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {getTranslation('modelRatio', userLanguage)}
        <Popover
          content={
            <div style={{ padding: 8 }} dangerouslySetInnerHTML={{ __html: getTranslation('helpTooltip', userLanguage) }} />
          }
          position='top'
          style={{
            backgroundColor: 'rgba(var(--semi-blue-4),1)',
            borderColor: 'rgba(var(--semi-blue-4),1)',
            color: 'var(--semi-color-white)',
            borderWidth: 1,
            borderStyle: 'solid',
          }}
        >
          <IconHelpCircle
            onClick={() => {
              setModalImageUrl('/ratio.png');
              setIsModalOpenurl(true);
            }}
          />
        </Popover>
      </span>
    ),
    dataIndex: 'model_ratio',
    render: (text, record, index) => {
      let content = text;
      let completionRatio = parseFloat(record.completion_ratio.toFixed(3));
      content = (
        <>
          <Text>{getTranslation('modelName', userLanguage)}：{record.quota_type === 0 ? text : getTranslation('unknown', userLanguage)}</Text>
          <br />
          <Text>{getTranslation('completionPrice', userLanguage)}：{record.quota_type === 0 ? completionRatio : getTranslation('unknown', userLanguage)}</Text>
          <br />
          <Text>{getTranslation('groupRatio', userLanguage)}：{groupRatio[selectedGroup]}</Text>
        </>
      );
      return <div>{content}</div>;
    },
  },
  {
    title: getTranslation('modelPrice', userLanguage),
    dataIndex: 'model_price',
    render: (text, record, index) => {
      let content = text;
      if (record.quota_type === 0) {
        let inputRatioPrice = record.model_ratio * 2 * groupRatio[selectedGroup];
        let completionRatioPrice = record.model_ratio * record.completion_ratio * 2 * groupRatio[selectedGroup];
        content = (
          <>
            <Text>{getTranslation('pricePerMToken', userLanguage)} ${inputRatioPrice} / 1M tokens</Text>
            <br />
            <Text>{getTranslation('completionPrice', userLanguage)} ${completionRatioPrice} / 1M tokens</Text>
          </>
        );
		} else {
			let price = parseFloat(text) * groupRatio[selectedGroup];
			content = <> {getTranslation('modelPrice', userLanguage)}：${price}</>;
		}
      return <div>{content}</div>;
    },
  },
];
  
  
  
  
  
  
  
  
  
  
  
  
  

  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userState, userDispatch] = useContext(UserContext);
  const [groupRatio, setGroupRatio] = useState({});

const setModelsFormat = (models, groupRatio) => {
  for (let i = 0; i < models.length; i++) {
    models[i].key = models[i].model_name;
    models[i].group_ratio = groupRatio[models[i].model_name];
  }

  models.sort((a, b) => {
    return a.quota_type - b.quota_type;
  });

  models.sort((a, b) => {
    if (a.model_name.startsWith('gpt') && !b.model_name.startsWith('gpt')) {
      return -1;
    } else if (!a.model_name.startsWith('gpt') && b.model_name.startsWith('gpt')) {
      return 1;
    } else {
      return a.model_name.localeCompare(b.model_name);
    }
  });

  setModels(models);
};

const loadPricing = async () => {
  setLoading(true);

  let url = '';
  url = `/api/pricing`;
  const res = await API.get(url);
  const { success, message, data, group_ratio } = res.data;
  if (success) {
    setGroupRatio(group_ratio);
    setSelectedGroup(userState.user ? userState.user.group : 'default');
    setModelsFormat(data, group_ratio);
  } else {
    showError(message);
  }
  setLoading(false);
};

const refresh = async () => {
  await loadPricing();
};

const copyText = async (text) => {
  if (await copy(text)) {
    showSuccess(getTranslation('copySuccess', userLanguage) + text);
  } else {
    Modal.error({ title: getTranslation('copyError', userLanguage), content: text });
  }
};

useEffect(() => {
  refresh().then();
}, []);

return (
  <>
    <Layout>
      {userState.user ? (
        <Banner
          type="success"
          fullMode={false}
          closeIcon="null"
          description={`${getTranslation('defaultGroup', userLanguage)}${userState.user.group}，${getTranslation('groupRatio', userLanguage)}${groupRatio[userState.user.group]}`}
        />
      ) : (
        <Banner
          type="warning"
          fullMode={false}
          closeIcon="null"
          description={`${getTranslation('notLoggedIn', userLanguage)}${groupRatio['default']}`}
        />
      )}
      <br />
      <Banner
        type="info"
        fullMode={false}
        description={<div>{getTranslation('perUnitPrice', userLanguage)}</div>}
        closeIcon="null"
      />
      <br />
      <Button
        theme="light"
        type="tertiary"
        style={{ width: 150 }}
        onClick={() => {
          copyText(selectedRowKeys);
        }}
        disabled={selectedRowKeys == ""}
      >
        {getTranslation('copySelectedModel', userLanguage)}
      </Button>
      <Table
        style={{ marginTop: 5 }}
        columns={columns}
        dataSource={models}
        loading={loading}
        pagination={{
          pageSize: models.length,
          showSizeChanger: false,
        }}
        rowSelection={rowSelection}
      />
      <ImagePreview
        src={modalImageUrl}
        visible={isModalOpenurl}
        onVisibleChange={(visible) => setIsModalOpenurl(visible)}
      />
    </Layout>
  </>
);
};

export default ModelPricing;
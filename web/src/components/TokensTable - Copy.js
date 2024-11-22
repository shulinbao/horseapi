import React, { useEffect, useState } from 'react';
import {
  API,
  copy,
  showError,
  showSuccess,
  timestamp2string,
} from '../helpers';

import { ITEMS_PER_PAGE } from '../constants';
import {renderGroup, renderQuota} from '../helpers/render';
import {
  Button, Divider,
  Dropdown,
  Form,
  Modal,
  Popconfirm,
  Popover, Space,
  SplitButtonGroup,
  Table,
  Tag,
} from '@douyinfe/semi-ui';

import { IconTreeTriangleDown } from '@douyinfe/semi-icons';
import EditToken from '../pages/Token/EditToken';

function renderTimestamp(timestamp) {
  return <>{timestamp2string(timestamp)}</>;
}





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
  'enabled': {
    'zh-Hant': '已啟用',
    'zh': '已启用',
    'en': 'Enabled'
  },
  'enabled_with_model_limits': {
    'zh-Hant': '已啟用：限制模型',
    'zh': '已启用：限制模型',
    'en': 'Enabled: Model Limits Applied'
  },
  'disabled': {
    'zh-Hant': '已禁用',
    'zh': '已禁用',
    'en': 'Disabled'
  },
  'expired': {
    'zh-Hant': '已過期',
    'zh': '已过期',
    'en': 'Expired'
  },
  'exhausted': {
    'zh-Hant': '已耗盡',
    'zh': '已耗尽',
    'en': 'Exhausted'
  },
  'unknown': {
    'zh-Hant': '未知狀態',
    'zh': '未知状态',
    'en': 'Unknown Status'
  },
  'used_quota': {
    'zh-Hant': '已用額度',
    'zh': '已用额度',
    'en': 'Used Quota'
  },
  'remain_quota': {
    'zh-Hant': '剩餘額度',
    'zh': '剩余额度',
    'en': 'Remaining Quota'
  },
  'created_time': {
    'zh-Hant': '創建時間',
    'zh': '创建时间',
    'en': 'Created Time'
  },
  'expired_time': {
    'zh-Hant': '過期時間',
    'zh': '过期时间',
    'en': 'Expired Time'
  },
  'unlimited': {
    'zh-Hant': '無限制',
    'zh': '无限制',
    'en': 'Unlimited'
  },
  'name': {
    'zh-Hant': '名稱',
    'zh': '名称',
    'en': 'Name'
  },
  'status': {
    'zh-Hant': '狀態',
    'zh': '状态',
    'en': 'Status'
  },
 
 
 
 
 
 
  'view': {
    'zh-Hant': '查看',
    'zh': '查看',
    'en': 'View'
  },
  'copy': {
    'zh-Hant': '複製',
    'zh': '复制',
    'en': 'Copy'
  },
  'chat': {
    'zh-Hant': '聊天',
    'zh': '聊天',
    'en': 'Chat'
  },
  'delete': {
    'zh-Hant': '刪除',
    'zh': '删除',
    'en': 'Delete'
  },
  'disable': {
    'zh-Hant': '禁用',
    'zh': '禁用',
    'en': 'Disable'
  },
  'enable': {
    'zh-Hant': '啟用',
    'zh': '启用',
    'en': 'Enable'
  },
  'edit': {
    'zh-Hant': '編輯',
    'zh': '编辑',
    'en': 'Edit'
  },
  'confirm_delete_title': {
    'zh-Hant': '確定是否要刪除此令牌？',
    'zh': '确定是否要删除此令牌？',
    'en': 'Are you sure you want to delete this token?'
  },
  'confirm_delete_content': {
    'zh-Hant': '此修改將不可逆',
    'zh': '此修改将不可逆',
    'en': 'This change is irreversible'
  },
  'contact_admin_chat_link': {
    'zh-Hant': '請聯繫管理員配置聊天鏈接',
    'zh': '请联系管理员配置聊天链接',
    'en': 'Please contact the admin to configure the chat link'
  },
  'chat_link_error': {
    'zh-Hant': '聊天鏈接配置錯誤，請聯繫管理員',
    'zh': '聊天链接配置错误，请联系管理员',
    'en': 'Chat link configuration error, please contact the administrator'
  },
  
  
  
  
  'loading': {
    'zh-Hant': '加載中',
    'zh': '加载中',
    'en': 'Loading'
  },
  'delete_success': {
    'zh-Hant': '操作成功完成！',
    'zh': '操作成功完成！',
    'en': 'Operation completed successfully!'
  },
  'search_placeholder': {
    'zh-Hant': '搜尋關鍵字',
    'zh': '搜索关键字',
    'en': 'Search Keyword'
  },
  'no_results': {
    'zh-Hant': '無結果',
    'zh': '无结果',
    'en': 'No results'
  },
  'copy_to_clipboard': {
    'zh-Hant': '已複製到剪貼板！',
    'zh': '已复制到剪贴板！',
    'en': 'Copied to clipboard!'
  },
  'copy_failed': {
    'zh-Hant': '無法複製到剪貼板，請手動複製',
    'zh': '无法复制到剪贴板，请手动复制',
    'en': 'Unable to copy to clipboard, please copy manually'
  },
  'page': {
    'zh-Hant': '頁面',
    'zh': '页面',
    'en': 'Page'
  },
  'token_deleted': {
    'zh-Hant': '令牌已刪除',
    'zh': '令牌已删除',
    'en': 'Token deleted'
  },



  'search_keyword': {
    'zh-Hant': '搜尋關鍵字',
    'zh': '搜索关键字',
    'en': 'Search Keyword'
  },
  'key': {
    'zh-Hant': '密钥',
    'zh': '密钥',
    'en': 'Key'
  },
  'query': {
    'zh-Hant': '查询',
    'zh': '查询',
    'en': 'Query'
  },
  'add_token': {
    'zh-Hant': '添加令牌',
    'zh': '添加令牌',
    'en': 'Add Token'
  },
  'copy_selected_tokens': {
    'zh-Hant': '复制所选令牌',
    'zh': '复制所选令牌',
    'en': 'Copy Selected Tokens'
  },
  'select_tokens': {
    'zh-Hant': '请至少选择一个令牌！',
    'zh': '请至少选择一个令牌！',
    'en': 'Please select at least one token!'
  },
  'copy_to_clipboard_message': {
    'zh-Hant': '已复制到剪贴板！',
    'zh': '已复制到剪贴板！',
    'en': 'Copied to clipboard!'
  },
  'copy_failed_message': {
    'zh-Hant': '无法复制到剪贴板，请手动复制',
    'zh': '无法复制到剪贴板，请手动复制',
    'en': 'Unable to copy to clipboard, please copy manually'
  }  
 
 
 
 
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言








const renderStatus = (status, model_limits_enabled = false) => {
  switch (status) {
    case 1:
      if (model_limits_enabled) {
        return (
          <Tag color='green' size='large'>
            {getTranslation('enabled_with_model_limits', userLanguage)}
          </Tag>
        );
      } else {
        return (
          <Tag color='green' size='large'>
            {getTranslation('enabled', userLanguage)}
          </Tag>
        );
      }
    case 2:
      return (
        <Tag color='red' size='large'>
          {getTranslation('disabled', userLanguage)}
        </Tag>
      );
    case 3:
      return (
        <Tag color='yellow' size='large'>
          {getTranslation('expired', userLanguage)}
        </Tag>
      );
    case 4:
      return (
        <Tag color='grey' size='large'>
          {getTranslation('exhausted', userLanguage)}
        </Tag>
      );
    default:
      return (
        <Tag color='black' size='large'>
          {getTranslation('unknown', userLanguage)}
        </Tag>
      );
  }
};

const TokensTable = () => {

  const columns = [
    {
      title: getTranslation('name', userLanguage),
      dataIndex: 'name',
    },
    {
      title: getTranslation('status', userLanguage),
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => {
        return <div>
          <Space>
            {renderStatus(text, record.model_limits_enabled)}
            {renderGroup(record.group)}
          </Space>
        </div>;
      },
    },
    {
      title: getTranslation('used_quota', userLanguage),
      dataIndex: 'used_quota',
      render: (text, record, index) => {
        return <div>{renderQuota(parseInt(text))}</div>;
      },
    },
    {
      title: getTranslation('remain_quota', userLanguage),
      dataIndex: 'remain_quota',
      render: (text, record, index) => {
        return (
          <div>
            {record.unlimited_quota ? (
              <Tag size={'large'} color={'white'}>
                {getTranslation('unlimited', userLanguage)}
              </Tag>
            ) : (
              <Tag size={'large'} color={'light-blue'}>
                {renderQuota(parseInt(text))}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: getTranslation('created_time', userLanguage),
      dataIndex: 'created_time',
      render: (text, record, index) => {
        return <div>{renderTimestamp(text)}</div>;
      },
    },
    {
      title: getTranslation('expired_time', userLanguage),
      dataIndex: 'expired_time',
      render: (text, record, index) => {
        return (
          <div>
            {record.expired_time === -1 ? getTranslation('unlimited', userLanguage) : renderTimestamp(text)}
          </div>
        );
      },
    },
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
    {
    title: '',
    dataIndex: 'operate',
    render: (text, record, index) => {
      let chats = localStorage.getItem('chats');
      let chatsArray = []
      let chatLink = localStorage.getItem('chat_link');
      let mjLink = localStorage.getItem('chat_link2');
      let shouldUseCustom = true;
      if (chatLink) {
        shouldUseCustom = false;
        chatLink += `/#/?settings={"key":"{key}","url":"{address}"}`;
        chatsArray.push({
          node: 'item',
          key: 'default',
          name: getTranslation('chat', userLanguage),
          onClick: () => {
            onOpenLink('default', chatLink, record);
          },
        });
      }
      if (mjLink) {
        shouldUseCustom = false;
        mjLink += `/#/?settings={"key":"{key}","url":"{address}"}`;
        chatsArray.push({
          node: 'item',
          key: 'mj',
          name: getTranslation('chat', userLanguage),
          onClick: () => {
            onOpenLink('mj', mjLink, record);
          },
        });
      }
      if (shouldUseCustom) {
        try {
          chats = JSON.parse(chats);
          if (Array.isArray(chats)) {
            for (let i = 0; i < chats.length; i++) {
              let chat = {}
              chat.node = 'item';
              for (let key in chats[i]) {
                if (chats[i].hasOwnProperty(key)) {
                  chat.key = i;
                  chat.name = key;
                  chat.onClick = () => {
                    onOpenLink(key, chats[i][key], record);
                  }
                }
              }
              chatsArray.push(chat);
            }
          }

        } catch (e) {
          console.log(e);
          showError(getTranslation('chat_link_error', userLanguage));
        }
      }
      return (
        <div>
          <Popover
            content={'sk-' + record.key}
            style={{ padding: 20 }}
            position='top'
          >
            <Button theme='light' type='tertiary' style={{ marginRight: 1 }}>
              {getTranslation('view', userLanguage)}
            </Button>
          </Popover>
          <Button
            theme='light'
            type='secondary'
            style={{ marginRight: 1 }}
            onClick={async (text) => {
              await copyText('sk-' + record.key);
            }}
          >
            {getTranslation('copy', userLanguage)}
          </Button>
          <SplitButtonGroup
            style={{ marginRight: 1 }}
            aria-label='项目操作按钮组'
          >
            <Button
              theme='light'
              style={{ color: 'rgba(var(--semi-teal-7), 1)' }}
              onClick={() => {
                if (chatsArray.length === 0) {
                  showError(getTranslation('contact_admin_chat_link', userLanguage));
                } else {
                  onOpenLink('default', chats[0][Object.keys(chats[0])[0]], record);
                }
              }}
            >
              {getTranslation('chat', userLanguage)}
            </Button>
            <Dropdown
              trigger='click'
              position='bottomRight'
              menu={chatsArray}
            >
              <Button
                style={{
                  padding: '8px 4px',
                  color: 'rgba(var(--semi-teal-7), 1)',
                }}
                type='primary'
                icon={<IconTreeTriangleDown />}
              ></Button>
            </Dropdown>
          </SplitButtonGroup>
          <Popconfirm
            title={getTranslation('confirm_delete_title', userLanguage)}
            content={getTranslation('confirm_delete_content', userLanguage)}
            okType={'danger'}
            position={'left'}
            onConfirm={() => {
              manageToken(record.id, 'delete', record).then(() => {
                removeRecord(record.key);
              });
            }}
          >
            <Button theme='light' type='danger' style={{ marginRight: 1 }}>
              {getTranslation('delete', userLanguage)}
            </Button>
          </Popconfirm>
          {record.status === 1 ? (
            <Button
              theme='light'
              type='warning'
              style={{ marginRight: 1 }}
              onClick={async () => {
                manageToken(record.id, 'disable', record);
              }}
            >
              {getTranslation('disable', userLanguage)}
            </Button>
          ) : (
            <Button
              theme='light'
              type='secondary'
              style={{ marginRight: 1 }}
              onClick={async () => {
                manageToken(record.id, 'enable', record);
              }}
            >
              {getTranslation('enable', userLanguage)}
            </Button>
          )}
          <Button
            theme='light'
            type='tertiary'
            style={{ marginRight: 1 }}
            onClick={() => {
              setEditingToken(record);
              setShowEdit(true);
            }}
          >
            {getTranslation('edit', userLanguage)}
          </Button>
        </div>
        );
      },
    },
  ];
  
  
  
  
  
  
  
  
  
  
  

  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [showEdit, setShowEdit] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [tokenCount, setTokenCount] = useState(pageSize);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchToken, setSearchToken] = useState('');
  const [searching, setSearching] = useState(false);
  const [chats, setChats] = useState([]);
  const [editingToken, setEditingToken] = useState({
    id: undefined,
  });

  const closeEdit = () => {
    setShowEdit(false);
    setTimeout(() => {
      setEditingToken({
        id: undefined,
      });
    }, 500);
  };

const setTokensFormat = (tokens) => {
  setTokens(tokens);
  if (tokens.length >= pageSize) {
    setTokenCount(tokens.length + pageSize);
  } else {
    setTokenCount(tokens.length);
  }
};

let pageData = tokens.slice(
  (activePage - 1) * pageSize,
  activePage * pageSize,
);

const loadTokens = async (startIdx) => {
  setLoading(true);
  const res = await API.get(`/api/token/?p=${startIdx}&size=${pageSize}`);
  const { success, message, data } = res.data;
  if (success) {
    if (startIdx === 0) {
      setTokensFormat(data);
    } else {
      let newTokens = [...tokens];
      newTokens.splice(startIdx * pageSize, data.length, ...data);
      setTokensFormat(newTokens);
    }
  } else {
    showError(getTranslation('no_results', userLanguage));
  }
  setLoading(false);
};

 const refresh = async () => {
    await loadTokens(activePage - 1);
 };

const copyText = async (text) => {
  if (await copy(text)) {
    showSuccess(getTranslation('copy_to_clipboard', userLanguage));
  } else {
    Modal.error({
      title: getTranslation('copy_failed', userLanguage),
      content: text,
      size: 'large',
    });
  }
};

  const onOpenLink = async (type, url, record) => {
    // console.log(type, url, key);
    let status = localStorage.getItem('status');
    let serverAddress = '';
    if (status) {
      status = JSON.parse(status);
      serverAddress = status.server_address;
    }
    if (serverAddress === '') {
      serverAddress = window.location.origin;
    }
    let encodedServerAddress = encodeURIComponent(serverAddress);
    url = url.replaceAll('{address}', encodedServerAddress);
    url = url.replaceAll('{key}', 'sk-' + record.key);
    // console.log(url);
    // const chatLink = localStorage.getItem('chat_link');
    // const mjLink = localStorage.getItem('chat_link2');
    // let defaultUrl;
    //
    // if (chatLink) {
    //   defaultUrl =
    //     chatLink + `/#/?settings={"key":"sk-${key}","url":"${serverAddress}"}`;
    // }
    // let url;
    // switch (type) {
    //   case 'ama':
    //     url = `ama://set-api-key?server=${encodedServerAddress}&key=sk-${key}`;
    //     break;
    //   case 'opencat':
    //     url = `opencat://team/join?domain=${encodedServerAddress}&token=sk-${key}`;
    //     break;
    //   case 'lobe':
    //     url = `https://chat-preview.lobehub.com/?settings={"keyVaults":{"openai":{"apiKey":"sk-${key}","baseURL":"${encodedServerAddress}/v1"}}}`;
    //     break;
    //   case 'next-mj':
    //     url =
    //       mjLink + `/#/?settings={"key":"sk-${key}","url":"${serverAddress}"}`;
    //     break;
    //   default:
    //     if (!chatLink) {
    //       showError('管理员未设置聊天链接');
    //       return;
    //     }
    //     url = defaultUrl;
    // }

    window.open(url, '_blank');
  };

  useEffect(() => {
    loadTokens(0)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  }, [pageSize]);

const removeRecord = (key) => {
  let newDataSource = [...tokens];
  if (key != null) {
    let idx = newDataSource.findIndex((data) => data.key === key);

    if (idx > -1) {
      newDataSource.splice(idx, 1);
      setTokensFormat(newDataSource);
    }
  }
};

const manageToken = async (id, action, record) => {
  setLoading(true);
  let data = { id };
  let res;
  switch (action) {
    case 'delete':
      res = await API.delete(`/api/token/${id}/`);
      break;
    case 'enable':
      data.status = 1;
      res = await API.put('/api/token/?status_only=true', data);
      break;
    case 'disable':
      data.status = 2;
      res = await API.put('/api/token/?status_only=true', data);
      break;
  }
  const { success, message } = res.data;
  if (success) {
    showSuccess(getTranslation('delete_success', userLanguage));
    let token = res.data.data;
    let newTokens = [...tokens];
	if (action === 'delete') {
      } else {
        record.status = token.status;
        // newTokens[realIdx].status = token.status;
      }
    setTokensFormat(newTokens);
  } else {
    showError(message);
  }
  setLoading(false);
};

const searchTokens = async () => {
  if (searchKeyword === '' && searchToken === '') {
    await loadTokens(0);
    setActivePage(1);
    return;
  }
  setSearching(true);
  const res = await API.get(
    `/api/token/search?keyword=${searchKeyword}&token=${searchToken}`,
  );
  const { success, message, data } = res.data;
  if (success) {
    setTokensFormat(data);
    setActivePage(1);
  } else {
    showError(message);
  }
  setSearching(false);
};

  const handleKeywordChange = async (value) => {
    setSearchKeyword(value.trim());
  };

  const handleSearchTokenChange = async (value) => {
    setSearchToken(value.trim());
  };

const sortToken = (key) => {
  if (tokens.length === 0) return;
  setLoading(true);
  let sortedTokens = [...tokens];
  sortedTokens.sort((a, b) => {
    return ('' + a[key]).localeCompare(b[key]);
  });
  if (sortedTokens[0].id === tokens[0].id) {
    sortedTokens.reverse();
  }
  setTokens(sortedTokens);
  setLoading(false);
};

const handlePageChange = (page) => {
  setActivePage(page);
  if (page === Math.ceil(tokens.length / pageSize) + 1) {
    loadTokens(page - 1).then((r) => {});
  }
};














const rowSelection = {
  onSelect: (record, selected) => {},
  onSelectAll: (selected, selectedRows) => {},
  onChange: (selectedRowKeys, selectedRows) => {
    setSelectedKeys(selectedRows);
  },
};

const handleRow = (record, index) => {
  if (record.status !== 1) {
    return {
      style: {
        background: 'var(--semi-color-disabled-border)',
      },
    };
  } else {
    return {};
  }
};

return (
  <>
    <EditToken
      refresh={refresh}
      editingToken={editingToken}
      visiable={showEdit}
      handleClose={closeEdit}
    ></EditToken>
    <Form
      layout='horizontal'
      style={{ marginTop: 10 }}
      labelPosition={'left'}
    >
      <Form.Input
        field='keyword'
        label={getTranslation('search_keyword', userLanguage)}
        placeholder={getTranslation('search_keyword', userLanguage)}
        value={searchKeyword}
        loading={searching}
        onChange={handleKeywordChange}
      />
      <Form.Input
        field='token'
        label={getTranslation('key', userLanguage)}
        placeholder={getTranslation('key', userLanguage)}
        value={searchToken}
        loading={searching}
        onChange={handleSearchTokenChange}
      />
      <Button
        label={getTranslation('query', userLanguage)}
        type='primary'
        htmlType='submit'
        className='btn-margin-right'
        onClick={searchTokens}
        style={{ marginRight: 8 }}
      >
        {getTranslation('query', userLanguage)}
      </Button>
    </Form>
    <Divider style={{margin:'15px 0'}}/>
    <div>
      <Button
        theme='light'
        type='primary'
        style={{ marginRight: 8 }}
        onClick={() => {
          setEditingToken({
            id: undefined,
          });
          setShowEdit(true);
        }}
      >
        {getTranslation('add_token', userLanguage)}
      </Button>
      <Button
        label={getTranslation('copy_selected_tokens', userLanguage)}
        type='warning'
        onClick={async () => {
          if (selectedKeys.length === 0) {
            showError(getTranslation('select_tokens', userLanguage));
            return;
          }
          let keys = '';
          for (let i = 0; i < selectedKeys.length; i++) {
            keys +=
              selectedKeys[i].name + '    sk-' + selectedKeys[i].key + '\n';
          }
          await copyText(keys);
        }}
      >
        {getTranslation('copy_selected_tokens', userLanguage)}
      </Button>
    </div>

    <Table
      style={{ marginTop: 20 }}
      columns={columns}
      dataSource={pageData}
      pagination={{
        currentPage: activePage,
        pageSize: pageSize,
        total: tokenCount,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        formatPageText: (page) =>
          `第 ${page.currentStart} - ${page.currentEnd} 条，共 ${tokens.length} 条`,
        onPageSizeChange: (size) => {
          setPageSize(size);
          setActivePage(1);
        },
        onPageChange: handlePageChange,
      }}
      loading={loading}
      rowSelection={rowSelection}
      onRow={handleRow}
    ></Table>
  </>
  );
};

export default TokensTable;
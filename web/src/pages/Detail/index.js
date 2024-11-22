import React, { useEffect, useRef, useState } from 'react';
import { initVChartSemiTheme } from '@visactor/vchart-semi-theme';

import { Button, Col, Form, Layout, Row, Spin } from '@douyinfe/semi-ui';
import VChart from '@visactor/vchart';
import {
  API,
  isAdmin,
  showError,
  timestamp2string,
  timestamp2string1,
} from '../../helpers';
import {
  getQuotaWithUnit,
  modelColorMap,
  renderNumber,
  renderQuota,
  renderQuotaNumberWithDigit,
  stringToColor,
} from '../../helpers/render';





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
  'modelUsageDistribution': {
    'zh-Hant': '模型消耗分布',
    'zh': '模型消耗分布',
    'en': 'Model Usage Distribution',
  },
  'modelCallCountProportion': {
    'zh-Hant': '模型调用次数占比',
    'zh': '模型调用次数占比',
    'en': 'Model Call Count Proportion',
  },
  'total': {
    'zh-Hant': '總計',
    'zh': '总计',
    'en': 'Total',
  },
    'noData': {
    'zh-Hant': '無數據',
    'zh': '无数据',
    'en': 'No Data',
  },
  'totalQuota': {
    'zh-Hant': '總配額',
    'zh': '总配额',
    'en': 'Total Quota',
  },
  'totalCalls': {
    'zh-Hant': '總調用次數',
    'zh': '总调用次数',
    'en': 'Total Calls',
  },
  'modelData': {
    'zh-Hant': '模型數據',
    'zh': '模型数据',
    'en': 'Model Data',
  },
  'quotaUsage': {
    'zh-Hant': '配額使用情況',
    'zh': '配额使用情况',
    'en': 'Quota Usage',
  },
    'startTimestamp': {
    'zh-Hant': '起始時間',
    'zh': '起始时间',
    'en': 'Start Time',
  },
  'endTimestamp': {
    'zh-Hant': '結束時間',
    'zh': '结束时间',
    'en': 'End Time',
  },
  'timeGranularity': {
    'zh-Hant': '時間粒度',
    'zh': '时间粒度',
    'en': 'Time Granularity',
  },
  'hour': {
    'zh-Hant': '小時',
    'zh': '小时',
    'en': 'Hour',
  },
  'day': {
    'zh-Hant': '天',
    'zh': '天',
    'en': 'Day',
  },
  'week': {
    'zh-Hant': '週',
    'zh': '周',
    'en': 'Week',
  },
  'username': {
    'zh-Hant': '用戶名稱',
    'zh': '用户名',
    'en': 'Username',
  },
  'optional': {
    'zh-Hant': '可選值',
    'zh': '可选值',
    'en': 'Optional',
  },
  'query': {
    'zh-Hant': '查詢',
    'zh': '查询',
    'en': 'Query',
  }
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言







const Detail = (props) => {
  const formRef = useRef();
  let now = new Date();
  const [inputs, setInputs] = useState({
    username: '',
    token_name: '',
    model_name: '',
    start_timestamp:
      localStorage.getItem('data_export_default_time') === 'hour'
        ? timestamp2string(now.getTime() / 1000 - 86400)
        : localStorage.getItem('data_export_default_time') === 'week'
          ? timestamp2string(now.getTime() / 1000 - 86400 * 30)
          : timestamp2string(now.getTime() / 1000 - 86400 * 7),
    end_timestamp: timestamp2string(now.getTime() / 1000 + 3600),
    channel: '',
    data_export_default_time: '',
  });
  const { username, model_name, start_timestamp, end_timestamp, channel } =
    inputs;
  const isAdminUser = isAdmin();
  const initialized = useRef(false);
  const [modelDataChart, setModelDataChart] = useState(null);
  const [modelDataPieChart, setModelDataPieChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quotaData, setQuotaData] = useState([]);
  const [consumeQuota, setConsumeQuota] = useState(0);
  const [times, setTimes] = useState(0);
  const [dataExportDefaultTime, setDataExportDefaultTime] = useState(
    localStorage.getItem('data_export_default_time') || 'hour',
  );

  const handleInputChange = (value, name) => {
    if (name === 'data_export_default_time') {
      setDataExportDefaultTime(value);
      return;
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

const spec_line = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [],
    },
  ],
  xField: 'Time',
  yField: 'Usage',
  seriesField: 'Model',
  stack: true,
  legends: {
    visible: true,
    selectMode: 'single',
  },
  title: {
    visible: true,
    text: getTranslation('modelUsageDistribution', userLanguage),
    subtext: '0', // Directly keeping 0 as a string here
  },
  bar: {
    state: {
      hover: {
        stroke: '#000',
        lineWidth: 1,
      },
    },
  },
  tooltip: {
    mark: {
      content: [
        {
          key: (datum) => datum['Model'],
          value: (datum) =>
            renderQuotaNumberWithDigit(parseFloat(datum['Usage']), 4),
        },
      ],
    },
    dimension: {
      content: [
        {
          key: (datum) => datum['Model'],
          value: (datum) => datum['Usage'],
        },
      ],
      updateContent: (array) => {
        array.sort((a, b) => b.value - a.value);
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
          sum += parseFloat(array[i].value);
          array[i].value = renderQuotaNumberWithDigit(
            parseFloat(array[i].value),
            4,
          );
        }
        array.unshift({
          key: getTranslation('total', userLanguage),
          value: renderQuotaNumberWithDigit(sum, 4),
        });
        return array;
      },
    },
  },
  color: {
    specified: modelColorMap,
  },
};

const spec_pie = {
  type: 'pie',
  data: [
    {
      id: 'id0',
      values: [{ type: 'null', value: '0' }],
    },
  ],
  outerRadius: 0.8,
  innerRadius: 0.5,
  padAngle: 0.6,
  valueField: 'value',
  categoryField: 'type',
  pie: {
    style: {
      cornerRadius: 10,
    },
    state: {
      hover: {
        outerRadius: 0.85,
        stroke: '#000',
        lineWidth: 1,
      },
      selected: {
        outerRadius: 0.85,
        stroke: '#000',
        lineWidth: 1,
      },
    },
  },
  title: {
    visible: true,
    text: getTranslation('modelCallCountProportion', userLanguage),
  },
  legends: {
    visible: true,
    orient: 'left',
  },
  label: {
    visible: true,
  },
  tooltip: {
    mark: {
      content: [
        {
          key: (datum) => datum['type'],
          value: (datum) => renderNumber(datum['value']),
        },
      ],
    },
  },
  color: {
    specified: modelColorMap,
  },
};
  
  
  
  
  
  
  
  
  
  

const loadQuotaData = async (lineChart, pieChart) => {
  setLoading(true);

  let url = '';
  let localStartTimestamp = Date.parse(start_timestamp) / 1000;
  let localEndTimestamp = Date.parse(end_timestamp) / 1000;
  if (isAdminUser) {
    url = `/api/data/?username=${username}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&default_time=${dataExportDefaultTime}`;
  } else {
    url = `/api/data/self/?start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&default_time=${dataExportDefaultTime}`;
  }
  const res = await API.get(url);
  const { success, message, data } = res.data;
  if (success) {
    setQuotaData(data);
    if (data.length === 0) {
      data.push({
        count: 0,
        model_name: getTranslation('noData', userLanguage),
        quota: 0,
        created_at: now.getTime() / 1000,
      });
    }
    // 根据dataExportDefaultTime重制时间粒度
    let timeGranularity = 3600;
    if (dataExportDefaultTime === 'day') {
      timeGranularity = 86400;
    } else if (dataExportDefaultTime === 'week') {
      timeGranularity = 604800;
    }
    // sort created_at
    data.sort((a, b) => a.created_at - b.created_at);
    data.forEach((item) => {
      item['created_at'] =
        Math.floor(item['created_at'] / timeGranularity) * timeGranularity;
    });
    updateChart(lineChart, pieChart, data);
  } else {
    showError(message);
  }
  setLoading(false);
};

const refresh = async () => {
  await loadQuotaData(modelDataChart, modelDataPieChart);
};

const initChart = async () => {
  let lineChart = modelDataChart;
  if (!modelDataChart) {
    lineChart = new VChart(spec_line, { dom: 'model_data' });
    setModelDataChart(lineChart);
    lineChart.renderAsync();
  }
  let pieChart = modelDataPieChart;
  if (!modelDataPieChart) {
    pieChart = new VChart(spec_pie, { dom: 'model_pie' });
    setModelDataPieChart(pieChart);
    pieChart.renderAsync();
  }
  console.log(getTranslation('modelData', userLanguage));
  await loadQuotaData(lineChart, pieChart);
};

const updateChart = (lineChart, pieChart, data) => {
  if (isAdminUser) {
    // 将所有用户合并
  }
  let pieData = [];
  let lineData = [];
  let consumeQuota = 0;
  let times = 0;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    consumeQuota += item.quota;
    times += item.count;
    // 合并model_name
    let pieItem = pieData.find((it) => it.type === item.model_name);
    if (pieItem) {
      pieItem.value += item.count;
    } else {
      pieData.push({
        type: item.model_name,
        value: item.count,
      });
    }
    // 合并created_at和model_name 为 lineData, created_at 数据类型是小时的时间戳
    // 转换日期格式
    let createTime = timestamp2string1(
      item.created_at,
      dataExportDefaultTime,
    );
    let lineItem = lineData.find(
      (it) => it.Time === createTime && it.Model === item.model_name,
    );
    if (lineItem) {
      lineItem.Usage += parseFloat(getQuotaWithUnit(item.quota));
    } else {
      lineData.push({
        Time: createTime,
        Model: item.model_name,
        Usage: parseFloat(getQuotaWithUnit(item.quota)),
      });
    }
  }
  setConsumeQuota(consumeQuota);
  setTimes(times);

  // sort by count
  pieData.sort((a, b) => b.value - a.value);
  spec_pie.title.subtext = `${getTranslation('totalCalls', userLanguage)}：${renderNumber(times)}`;
  spec_pie.data[0].values = pieData;

  spec_line.title.subtext = `${getTranslation('totalQuota', userLanguage)}：${renderQuota(consumeQuota, 2)}`;
  spec_line.data[0].values = lineData;
  pieChart.updateSpec(spec_pie);
  lineChart.updateSpec(spec_line);

  pieChart.reLayout();
  lineChart.reLayout();
};










  useEffect(() => {

    if (!initialized.current) {
      initVChartSemiTheme({
        isWatchingThemeSwitch: true,
      });
      initialized.current = true;
      initChart();
    }
  }, []);

  return (
    <>
      <Layout>
        <Layout.Header>
          <h3>{getTranslation('modelUsageDistribution', userLanguage)}</h3>
        </Layout.Header>
        <Layout.Content>
          <Form ref={formRef} layout='horizontal' style={{ marginTop: 10 }}>
            <>
              <Form.DatePicker
                field='start_timestamp'
                label={getTranslation('startTimestamp', userLanguage)}
                style={{ width: 272 }}
                initValue={start_timestamp}
                value={start_timestamp}
                type='dateTime'
                name='start_timestamp'
                onChange={(value) =>
                  handleInputChange(value, 'start_timestamp')
                }
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
              <Form.Select
                field='data_export_default_time'
                label={getTranslation('timeGranularity', userLanguage)}
                style={{ width: 176 }}
                initValue={dataExportDefaultTime}
                placeholder={getTranslation('timeGranularity', userLanguage)}
                name='data_export_default_time'
                optionList={[
                  { label: getTranslation('hour', userLanguage), value: 'hour' },
                  { label: getTranslation('day', userLanguage), value: 'day' },
                  { label: getTranslation('week', userLanguage), value: 'week' },
                ]}
                onChange={(value) =>
                  handleInputChange(value, 'data_export_default_time')
                }
              ></Form.Select>
              {isAdminUser && (
                <>
                  <Form.Input
                    field='username'
                    label={getTranslation('username', userLanguage)}
                    style={{ width: 176 }}
                    value={username}
                    placeholder={getTranslation('optional', userLanguage)}
                    name='username'
                    onChange={(value) => handleInputChange(value, 'username')}
                  />
                </>
              )}
              <Form.Section>
                <Button
                  label={getTranslation('query', userLanguage)}
                  type='primary'
                  htmlType='submit'
                  className='btn-margin-right'
                  onClick={refresh}
                  loading={loading}
                >
                  {getTranslation('query', userLanguage)}
                </Button>
              </Form.Section>
            </>
          </Form>
          <Spin spinning={loading}>
            <div style={{ height: 500 }}>
              <div
                id='model_pie'
                style={{ width: '100%', minWidth: 100 }}
              ></div>
            </div>
            <div style={{ height: 500 }}>
              <div
                id='model_data'
                style={{ width: '100%', minWidth: 100 }}
              ></div>
            </div>
          </Spin>
        </Layout.Content>
      </Layout>
    </>
  );
};

export default Detail;

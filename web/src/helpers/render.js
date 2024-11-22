import { Tag } from '@douyinfe/semi-ui';




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
  'userGroup': {
    'zh-Hant': '使用者分組',
    'zh': '用户分组',
    'en': 'User Group'
  },
  'modelPriceFormula': {
    'zh-Hant': '模型價格：$',
    'zh': '模型价格：$',
    'en': 'Model Price: $'
  },
  'groupRatio': {
    'zh-Hant': ' * 分組倍率：',
    'zh': ' * 分组倍率：',
    'en': ' * Group Ratio: '
  },
  'resultFormula': {
    'zh-Hant': ' = $',
    'zh': ' = $',
    'en': ' = $'
  },
  'hintCalculation': {
    'zh-Hant': '提示：',
    'zh': '提示：',
    'en': 'Hint: '
  },
  'completionCalculation': {
    'zh-Hant': '補全：',
    'zh': '补全：',
    'en': 'Completion: '
  },
  'audioHint': {
    'zh-Hant': '音頻提示：',
    'zh': '音频提示：',
    'en': 'Audio Hint: '
  },
  'audioCompletion': {
    'zh-Hant': '音頻補全：',
    'zh': '音频补全：',
    'en': 'Audio Completion: '
  },
  'finalFormula': {
    'zh-Hant': '（文字 + 音頻） * 分組',
    'zh': '（文字 + 音频） * 分组',
    'en': '(Text + Audio) * Group'
  },
  'priceReference': {
    'zh-Hant': '僅供參考，以實際扣費為準',
    'zh': '仅供参考，以实际扣费为准',
    'en': 'For reference only, subject to actual charges'
  },
  'equivalentAmount': {
    'zh-Hant': '（等價金額：',
    'zh': '（等价金额：',
    'en': '(Equivalent Amount: '
  }
};

const getTranslation = (key, language) => {
    return translations[key][language] || translations[key]['en'];
};

const userLanguage = getUserLanguage();  // 获取用户语言





export function renderText(text, limit) {
  if (text.length > limit) {
    return text.slice(0, limit - 3) + '...';
  }
  return text;
}

/**
 * Render group tags based on the input group string
 * @param {string} group - The input group string
 * @returns {JSX.Element} - The rendered group tags
 */
export function renderGroup(group) {
  if (group === '') {
    return (
      <Tag size='large' key='default' color='orange'>
        {getTranslation('userGroup', userLanguage)}
      </Tag>
    );
  }

  const tagColors = {
    vip: 'yellow',
    pro: 'yellow',
    svip: 'red',
    premium: 'red',
  };

  const groups = group.split(',').sort();

  return (
    <span key={group}>
      {groups.map((group) => (
        <Tag
          size='large'
          color={tagColors[group] || stringToColor(group)}
          key={group}
        >
          {group}
        </Tag>
      ))}
    </span>
  );
}

export function renderNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 10000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num;
  }
}

export function renderQuotaNumberWithDigit(num, digits = 2) {
  let displayInCurrency = localStorage.getItem('display_in_currency');
  num = num.toFixed(digits);
  if (displayInCurrency) {
    return '$' + num;
  }
  return num;
}

export function renderNumberWithPoint(num) {
  num = num.toFixed(2);
  if (num >= 100000) {
    // Convert number to string to manipulate it
    let numStr = num.toString();
    // Find the position of the decimal point
    let decimalPointIndex = numStr.indexOf('.');

    let wholePart = numStr;
    let decimalPart = '';

    // If there is a decimal point, split the number into whole and decimal parts
    if (decimalPointIndex !== -1) {
      wholePart = numStr.slice(0, decimalPointIndex);
      decimalPart = numStr.slice(decimalPointIndex);
    }

    // Take the first two and last two digits of the whole number part
    let shortenedWholePart = wholePart.slice(0, 2) + '..' + wholePart.slice(-2);

    // Return the formatted number
    return shortenedWholePart + decimalPart;
  }

  // If the number is less than 100,000, return it unmodified
  return num;
}

export function getQuotaPerUnit() {
  let quotaPerUnit = localStorage.getItem('quota_per_unit');
  quotaPerUnit = parseFloat(quotaPerUnit);
  return quotaPerUnit;
}

export function renderUnitWithQuota(quota) {
  let quotaPerUnit = localStorage.getItem('quota_per_unit');
  quotaPerUnit = parseFloat(quotaPerUnit);
  quota = parseFloat(quota);
  return quotaPerUnit * quota;
}

export function getQuotaWithUnit(quota, digits = 6) {
  let quotaPerUnit = localStorage.getItem('quota_per_unit');
  quotaPerUnit = parseFloat(quotaPerUnit);
  return (quota / quotaPerUnit).toFixed(digits);
}

export function renderQuotaWithAmount(amount) {
  let displayInCurrency = localStorage.getItem('display_in_currency');
  displayInCurrency = displayInCurrency === 'true';
  if (displayInCurrency) {
    return '$' + amount;
  } else {
    return renderUnitWithQuota(amount);
  }
}

export function renderQuota(quota, digits = 2) {
  let quotaPerUnit = localStorage.getItem('quota_per_unit');
  let displayInCurrency = localStorage.getItem('display_in_currency');
  quotaPerUnit = parseFloat(quotaPerUnit);
  displayInCurrency = displayInCurrency === 'true';
  if (displayInCurrency) {
    return '$' + (quota / quotaPerUnit).toFixed(digits);
  }
  return renderNumber(quota);
}

export function renderModelPrice(
  inputTokens,
  completionTokens,
  modelRatio,
  modelPrice = -1,
  completionRatio,
  groupRatio,
) {
  // 1 ratio = $0.002 / 1K tokens
  if (modelPrice !== -1) {
    return (
    getTranslation('modelPriceFormula', userLanguage) +
    modelPrice +
    getTranslation('groupRatio', userLanguage) +
    groupRatio +
    getTranslation('resultFormula', userLanguage) +
    modelPrice * groupRatio
  );
  } else {
    if (completionRatio === undefined) {
      completionRatio = 0;
    }
    // 这里的 *2 是因为 1倍率=0.002刀，请勿删除
    let inputRatioPrice = modelRatio * 2.0;
    let completionRatioPrice = modelRatio * 2.0 * completionRatio;
    let price =
      (inputTokens / 1000000) * inputRatioPrice * groupRatio +
      (completionTokens / 1000000) * completionRatioPrice * groupRatio;
    return (
      <>
        <article>
          <p>提示：${inputRatioPrice} * {groupRatio} = ${inputRatioPrice * groupRatio} / 1M tokens</p>
          <p>补全：${completionRatioPrice} * {groupRatio} = ${completionRatioPrice * groupRatio} / 1M tokens</p>
          <p></p>
          <p>
            提示 {inputTokens} tokens / 1M tokens * ${inputRatioPrice} + 补全{' '}
            {completionTokens} tokens / 1M tokens * ${completionRatioPrice} * 分组 {groupRatio} =
            ${price.toFixed(6)}
          </p>
          <p>仅供参考，以实际扣费为准</p>
        </article>
      </>
    );
  }
}

export function renderAudioModelPrice(
  inputTokens,
  completionTokens,
  modelRatio,
  modelPrice = -1,
  completionRatio,
  audioInputTokens,
  audioCompletionTokens,
  audioRatio,
  audioCompletionRatio,
  groupRatio,
) {
  // 1 ratio = $0.002 / 1K tokens
if (modelPrice !== -1) {
  return (
    getTranslation('modelPriceFormula', userLanguage) +
    modelPrice +
    getTranslation('groupRatio', userLanguage) +
    groupRatio +
    getTranslation('resultFormula', userLanguage) +
    modelPrice * groupRatio
  );
} else {
    if (completionRatio === undefined) {
      completionRatio = 0;
    }
    // 这里的 *2 是因为 1倍率=0.002刀，请勿删除
    let inputRatioPrice = modelRatio * 2.0;
    let completionRatioPrice = modelRatio * 2.0 * completionRatio;
    let price =
      (inputTokens / 1000000) * inputRatioPrice * groupRatio +
      (completionTokens / 1000000) * completionRatioPrice * groupRatio +
      (audioInputTokens / 1000000) * inputRatioPrice * audioRatio * groupRatio +
      (audioCompletionTokens / 1000000) * inputRatioPrice * audioRatio * audioCompletionRatio * groupRatio;
    return (
      <>
        <article>
          <p>提示：${inputRatioPrice} * {groupRatio} = ${inputRatioPrice * groupRatio} / 1M tokens</p>
          <p>补全：${completionRatioPrice} * {groupRatio} = ${completionRatioPrice * groupRatio} / 1M tokens</p>
          <p>音频提示：${inputRatioPrice} * {groupRatio} * {audioRatio} = ${inputRatioPrice * audioRatio * groupRatio} / 1M tokens</p>
          <p>音频补全：${inputRatioPrice} * {groupRatio} * {audioRatio} * {audioCompletionRatio} = ${inputRatioPrice * audioRatio * audioCompletionRatio * groupRatio} / 1M tokens</p>
          <p></p>
          <p>
            提示 {inputTokens} tokens / 1M tokens * ${inputRatioPrice} + 补全{' '}
            {completionTokens} tokens / 1M tokens * ${completionRatioPrice} +
          </p>
          <p>
            音频提示 {audioInputTokens} tokens / 1M tokens * ${inputRatioPrice} * {audioRatio} + 音频补全 {audioCompletionTokens} tokens / 1M tokens * ${inputRatioPrice} * {audioRatio} * {audioCompletionRatio}
          </p>
          <p>
            （文字 + 音频） * 分组 {groupRatio} =
            ${price.toFixed(6)}
          </p>
          <p>{getTranslation('priceReference', userLanguage)}</p>
        </article>
      </>
    );
  }
}

export function renderQuotaWithPrompt(quota, digits) {
  let displayInCurrency = localStorage.getItem('display_in_currency');
  displayInCurrency = displayInCurrency === 'true';
  if (displayInCurrency) {
    return `${getTranslation('equivalentAmount', userLanguage)}${renderQuota(quota, digits)})`;
  }
  return '';
}

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

export const modelColorMap = {
  'dall-e': 'rgb(147,112,219)', // 深紫色
  // 'dall-e-2': 'rgb(147,112,219)', // 介于紫色和蓝色之间的色调
  'dall-e-3': 'rgb(153,50,204)', // 介于紫罗兰和洋红之间的色调
  'gpt-3.5-turbo': 'rgb(184,227,167)', // 浅绿色
  // 'gpt-3.5-turbo-0301': 'rgb(131,220,131)', // 亮绿色
  'gpt-3.5-turbo-0613': 'rgb(60,179,113)', // 海洋绿
  'gpt-3.5-turbo-1106': 'rgb(32,178,170)', // 浅海洋绿
  'gpt-3.5-turbo-16k': 'rgb(149,252,206)', // 淡橙色
  'gpt-3.5-turbo-16k-0613': 'rgb(119,255,214)', // 淡桃色
  'gpt-3.5-turbo-instruct': 'rgb(175,238,238)', // 粉蓝色
  'gpt-4': 'rgb(135,206,235)', // 天蓝色
  // 'gpt-4-0314': 'rgb(70,130,180)', // 钢蓝色
  'gpt-4-0613': 'rgb(100,149,237)', // 矢车菊蓝
  'gpt-4-1106-preview': 'rgb(30,144,255)', // 道奇蓝
  'gpt-4-0125-preview': 'rgb(2,177,236)', // 深天蓝
  'gpt-4-turbo-preview': 'rgb(2,177,255)', // 深天蓝
  'gpt-4-32k': 'rgb(104,111,238)', // 中紫色
  // 'gpt-4-32k-0314': 'rgb(90,105,205)', // 暗灰蓝色
  'gpt-4-32k-0613': 'rgb(61,71,139)', // 暗蓝灰色
  'gpt-4-all': 'rgb(65,105,225)', // 皇家蓝
  'gpt-4-gizmo-*': 'rgb(0,0,255)', // 纯蓝色
  'gpt-4-vision-preview': 'rgb(25,25,112)', // 午夜蓝
  'text-ada-001': 'rgb(255,192,203)', // 粉红色
  'text-babbage-001': 'rgb(255,160,122)', // 浅珊瑚色
  'text-curie-001': 'rgb(219,112,147)', // 苍紫罗兰色
  // 'text-davinci-002': 'rgb(199,21,133)', // 中紫罗兰红色
  'text-davinci-003': 'rgb(219,112,147)', // 苍紫罗兰色（与Curie相同，表示同一个系列）
  'text-davinci-edit-001': 'rgb(255,105,180)', // 热粉色
  'text-embedding-ada-002': 'rgb(255,182,193)', // 浅粉红
  'text-embedding-v1': 'rgb(255,174,185)', // 浅粉红色（略有区别）
  'text-moderation-latest': 'rgb(255,130,171)', // 强粉色
  'text-moderation-stable': 'rgb(255,160,122)', // 浅珊瑚色（与Babbage相同，表示同一类功能）
  'tts-1': 'rgb(255,140,0)', // 深橙色
  'tts-1-1106': 'rgb(255,165,0)', // 橙色
  'tts-1-hd': 'rgb(255,215,0)', // 金色
  'tts-1-hd-1106': 'rgb(255,223,0)', // 金黄色（略有区别）
  'whisper-1': 'rgb(245,245,220)', // 米色
  'claude-3-opus-20240229': 'rgb(255,132,31)', // 橙红色
  'claude-3-sonnet-20240229': 'rgb(253,135,93)', // 橙色
  'claude-3-haiku-20240307': 'rgb(255,175,146)', // 浅橙色
  'claude-2.1': 'rgb(255,209,190)', // 浅橙色（略有区别）
};

export function stringToColor(str) {
  let sum = 0;
  // 对字符串中的每个字符进行操作
  for (let i = 0; i < str.length; i++) {
    // 将字符的ASCII值加到sum中
    sum += str.charCodeAt(i);
  }
  // 使用模运算得到个位数
  let i = sum % colors.length;
  return colors[i];
}
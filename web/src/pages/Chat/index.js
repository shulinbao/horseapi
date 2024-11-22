import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { marked } from 'marked';
import { Layout } from '@douyinfe/semi-ui';

const About = ({ chatLink }) => {
  const [aboutLoaded, setAboutLoaded] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');

  const displayAbout = () => {
    // 获取当前页面的查询字符串（即问号后的部分）
    const queryParams = window.location.search;

    // 如果查询字符串存在，构建新的链接
    let newChatLink = 'https://chat.nu.ac.cn/#/chat';
    if (queryParams) {
      // 将查询字符串附加到 chatLink 后面
      newChatLink += queryParams;
    }

    setIframeSrc(newChatLink);  // 更新 iframe 的 src
    setAboutLoaded(true);  // 设置加载完成状态
  };

  useEffect(() => {
    displayAbout();  // 调用 displayAbout 方法
  }, []);

  return (
    <>
      {aboutLoaded && iframeSrc && (  // 如果 iframeSrc 存在，则渲染 iframe
        <iframe
          src={iframeSrc}  // 使用构建后的链接
          style={{ width: '100%', height: '100vh', border: 'none' }}
        />
      )}
    </>
  );
};


export default About;

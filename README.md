<p align="center">
  <img src="horseapi.jpg" alt="Project Logo" width="200">
</p>

# HorseAPI

![Logo](horseapi.jpg)

[English](https://github.com/shulinbao/horseapi/blob/main/README-en.md)

一个基于 [Calcium-Ion/new-api](https://github.com/Calcium-Ion/new-api) 二次开发的 OpenAI 格式的 API 管理工具，主要用于自己的 HorseGPT 项目

## 使用说明

1. 本项目很多的变量已经写死，如果不想二次开发，推荐优先使用 [Calcium-Ion/new-api](https://github.com/Calcium-Ion/new-api)
2. 本项目仍处在快速开发阶段，可能会存在不稳定的情况，代码可能没有清晰的注释

## 相较 Calcium-Ion/new-api 的变化

1. 移除了 Calcium-Ion/new-api 项目的侧栏，改以顶栏的方式实现
2. 根据页面宽度及手机/电脑端自动调整顶栏
3. 多语言支持。项目自带三种语言文本（简体中文/繁体中文/英文），可根据需求进一步添加。语言根据用户设备语言自动切换

## 部署方式
### Docker 镜像
```
docker run --name horseapi -d --restart always -p 3008:3000 -e TZ=Asia/Shanghai -v /home/<用户名>/data/new-api:/data shulinbao/horseapi:v9  # 最新版本不一定是v9，请及时查看
```
请及时将`<用户名>`改为自己部署服务器中的用户名
### Docker Compose
1. 检查 `docker-compose.yml` 中的环境变量
2. 使用 `docker-compose up --build -d` 进行部署

## 已知问题
- 翻译不全：由于本人精力有限，只翻译了用户能够接触到的部分。用户接触不到的部分及 `@douyinfe/semi-ui` 中的未汉化部分暂未处理。

## 环境变量
请参考 [songquanpeng/one-api](https://github.com/songquanpeng/one-api) 的 README 文档。

## 致谢
本项目基于以下项目二次开发：
- [Calcium-Ion/new-api](https://github.com/Calcium-Ion/new-api)
- [songquanpeng/one-api](https://github.com/songquanpeng/one-api)


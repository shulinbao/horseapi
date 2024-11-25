# HorseAPI

[中文](https://github.com/shulinbao/horseapi)

A secondary development of the [Calcium-Ion/new-api](https://github.com/Calcium-Ion/new-api) project, designed as an OpenAI-compatible API management tool, primarily for the HorseGPT project.

---

## Instructions for Use

1. Many variables in this project are hard-coded. If you do not wish to modify the source code, it is recommended to use [Calcium-Ion/new-api](https://github.com/Calcium-Ion/new-api) instead.  
2. This project is under rapid development and may contain unstable features. Code comments might not be fully detailed.

---

## Changes Compared to Calcium-Ion/new-api

1. Removed the sidebar from the Calcium-Ion/new-api project and replaced it with a top navigation bar.  
2. The top navigation bar automatically adjusts based on screen width and whether the device is mobile or desktop.  
3. Added multi-language support. The project includes three languages by default (Simplified Chinese, Traditional Chinese, and English). Additional languages can be added as needed. Language selection is based on the user's device language settings.

---

## Deployment

### Docker Image
```bash
docker run --name horseapi -d --restart always -p 3008:3000 -e TZ=Asia/Shanghai -v /home/<username>/data/new-api:/data shulinbao/horseapi:v9  # Note: The latest version may not be v9, please check for updates
```
Replace `<username>` with the appropriate username on your deployment server.

### Docker Compose
1. Check the environment variables in `docker-compose.yml`.  
2. Deploy using:  
   ```bash
   docker-compose up --build -d
   ```

---

## Known Issues
- **Incomplete translations:** Due to limited resources, only user-facing parts of the application have been translated. Internal sections and untranslated elements from `@douyinfe/semi-ui` are yet to be localized.

---

## Environment Variables
Refer to the [songquanpeng/one-api](https://github.com/songquanpeng/one-api) README for details.

---

## Acknowledgments
This project is a secondary development based on the following:  
- [Calcium-Ion/new-api](https://github.com/Calcium-Ion/new-api)  
- [songquanpeng/one-api](https://github.com/songquanpeng/one-api)

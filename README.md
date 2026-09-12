# myBlog

基于 [DCSCDF (Kowalski)](https://github.com/DCSCDF) 开源个人博客项目整理而来的本地副本（**未使用 git clone**，从源码压缩包导入，无独立提交历史）。

## 目录结构

| 目录 | 来源仓库 | 说明 |
|------|----------|------|
| `frontend/` | [DCSCDF/MyBLOG_WEB](https://github.com/DCSCDF/MyBLOG_WEB) | 博客前台（Vue） |
| `admin/` | [DCSCDF/MyBLOG_WebAdmin](https://github.com/DCSCDF/MyBLOG_WebAdmin) | 后台管理（Vue） |
| `server/` | [DCSCDF/MyBLOG_SERVER](https://github.com/DCSCDF/MyBLOG_SERVER) | 后端（Spring Boot / Java） |

## 许可与致谢

上游项目版权归原作者所有。`admin`、`server` 上游声明为 MIT License，请保留各子目录内原有 LICENSE / 说明文件。

感谢原作者开源：https://github.com/DCSCDF

## 本地说明

各子项目请分别按各自 README 安装依赖与启动（前台 / 管理端通常 `npm install`，后端按 Spring Boot 方式运行）。

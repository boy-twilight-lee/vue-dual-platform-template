# Vue 双端项目迁移说明

本仓库完整迁移自 `ideological-practice-platform-front` 的当前项目文件，用于复用现有 Vue PC / H5 工程。源代码、依赖版本、环境配置、构建插件与目录结构均保留。迁移副本的目录名和包名统一为 `vue-dual-platform-template`，HTML 页面标题更新为“Vue 双端项目模板”，根目录 README 更新为模板使用文档。

## 迁移范围

- 保留 `src/`、`public/`、`plugins/`、环境文件、锁文件及工程配置。
- 保留 Element Plus、Vant、Pinia、Axios、VueUse、DOMPurify 和 VConsole。
- 保留现有 hooks、HTTP 封装、JSBridge、SVG 图标组件与版本检测插件。
- 空目录添加 `.gitkeep`，使 GitHub 模板生成时可以保留目录。
- GitHub 使用独立仓库历史，依赖和构建产物通过安装及构建生成。
- `node_modules/`、`dist/` 和本地配置遵循原有 `.gitignore`。

## 使用模板

在 GitHub 仓库页点击 **Use this template** 创建新仓库，或直接克隆。

```bash
git clone https://github.com/boy-twilight-lee/vue-dual-platform-template.git
cd vue-dual-platform-template
pnpm install --frozen-lockfile
pnpm dev
```

Node.js 版本遵循原项目 `package.json` 的 `engines`，支持 `^20.19.0 || ^22.13.0 || >=24.0.0`。本次迁移使用 Node.js 20.19.5 与 pnpm 10.32.1 验证。

开发服务器沿用原配置，端口为 `80`，基础路径为 `/question/forms/index/`。可访问 `http://localhost/question/forms/index/`。端口被占用时以终端输出的实际地址为准。

## 原有命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 使用 `.env.dev` 启动 Vite |
| `pnpm typecheck` | 执行 `vue-tsc -b` |
| `pnpm build:prod` | 使用 `.env.prod` 构建 |
| `pnpm build:test` | 使用 `.env.test` 构建 |
| `pnpm build:gray` | 使用 `.env.gray` 构建 |
| `pnpm lint` | 执行原项目带 `--fix` 的 ESLint 命令 |
| `pnpm exec eslint .` | 只检查 ESLint 问题 |
| `pnpm preview` | 预览 `dist/` |

自动导入类型由 Vite 启动或构建生成。全新克隆后，可先启动 `pnpm dev` 或执行构建，再进行依赖这些声明的类型检查。

## 原有目录

```text
src/
├── apis/                  接口目录
├── assets/
│   ├── icons-h5/          H5 SVG 图标
│   ├── icons-pc/          PC SVG 图标
│   └── imgs/              图片资源
├── components/            公共组件及 SVG 图标组件
├── components-pc/         PC 组件目录
├── constants/             常量目录
├── hooks/                 通用组合式能力及设备识别
├── layout/                布局与移动端页面过渡
├── pages/                 H5 页面目录
├── pages-pc/              PC 页面目录
├── router/                路由实例与 routes.ts 路由定义
├── store/                 Pinia 实例
│   └── mudules/           状态模块目录
├── styles/                全局 Less 样式
├── type/                  全局及构建类型声明
└── utils/
    ├── http/              HTTP 实例、响应处理与类型
    └── js-bradge/         原有 JSBridge 集成
plugins/                   版本检测插件与构建类型补充
public/                    公共静态资源
```

## 当前工程状态

路由定义位于 `src/router/routes.ts`，按原项目规则将首页重定向到 `/pc-home-list` 或 `/home-list`，`children` 当前为空。页面目录作为骨架保留，具体业务页面及路由可在后续开发中接入。

环境文件仍使用原有 `VITE_BASE_API` 与 `VITE_BASE_URL`。开发代理、JSBridge、jQuery 引用及现有部署路径均沿用源工程设置，使用时按实际运行环境配置。

## 本次验证

| 检查 | 结果 |
| --- | --- |
| 原文件内容校验 | 复制时 53 个文件逐一进行 SHA-256 比对，一致 |
| 空目录 | 8 个空目录通过 `.gitkeep` 保留 |
| `pnpm install --frozen-lockfile` | 通过 |
| `pnpm typecheck` | 通过 |
| `pnpm build:prod` | 通过 |
| `pnpm exec eslint .` | 检出源工程已有的 20 项问题，涉及格式、HTTP 变量赋值和 JSBridge 规则 |

生产构建保留了源工程的提示，包括 `/jQuery/jquery.min.js` 外部脚本引用、VConsole 的 `eval` 使用和较大的打包分块。

## 部署

构建产物位于 `dist/`。按 `.env.*` 中的 `VITE_BASE_URL` 配置服务器静态路径，并为 Vue Router History 路由设置 `index.html` 回退。版本检测插件会生成 `version.json`，部署时与其他产物一起更新。

# vue-dual-platform-template

基于 Vue 3、TypeScript 和 Vite 的 PC / H5 双端项目模板，完整继承现有工程的双端目录、组件库、共享 hooks、HTTP 封装、JSBridge 和构建配置，适合在统一工程中维护桌面 Web 与移动 Web。

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 应用框架 | Vue 3、TypeScript、Vite 6 |
| 路由与状态 | Vue Router 4、Pinia |
| PC 组件库 | Element Plus |
| H5 组件库 | Vant 4 |
| 网络请求 | Axios |
| 通用能力 | VueUse、Lodash ES、DOMPurify、VConsole |
| 样式 | Less、PostCSS、px 转 vw |
| 工程规范 | ESLint、Prettier、pnpm 锁文件 |

## 已有能力

- **双端目录** — H5 使用 `pages/`，PC 使用 `pages-pc/`，PC 专用组件使用 `components-pc/`。
- **设备识别** — 根据 UA、平台与触摸能力识别手机、平板和桌面设备，统一由 `useDevice` 提供。
- **页面布局** — 桌面端直接渲染路由，移动端保留原有页面容器与路由过渡。
- **组件与 API 自动导入** — 集成 Vue、Vue Router、Element Plus 与 Vant 的自动导入配置。
- **HTTP 封装** — 保留 Axios 实例、响应判定、Blob 处理及请求类型定义。
- **共享 hooks** — 包含组件渲染、值控制、输入裁剪、可取消任务与设备判断能力。
- **JSBridge** — 保留原有客户端桥接脚本、封装和类型声明。
- **SVG 图标** — 支持 H5、PC 图标目录及公共 `svg-icon` 组件。
- **构建能力** — 保留多环境构建、Gzip 压缩、版本检测与静态资源分包配置。

## 快速开始

Node.js 版本要求为 `^20.19.0 || ^22.13.0 || >=24.0.0`，使用 pnpm 安装依赖。

在 GitHub 点击 **Use this template** 创建自己的项目，也可以直接克隆。

```bash
git clone https://github.com/boy-twilight-lee/vue-dual-platform-template.git
cd vue-dual-platform-template
pnpm install --frozen-lockfile
pnpm dev
```

开发服务器沿用工程配置，监听端口 `80`，基础路径为 `/question/forms/index/`。默认访问地址为 `http://localhost/question/forms/index/`，以终端输出的实际地址为准。

模板当前保留业务页面骨架，首页重定向目标为 `/pc-home-list` 和 `/home-list`，对应页面及子路由需要在业务开发时补充。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 使用 `.env.dev` 启动开发服务器 |
| `pnpm typecheck` | Vue 与 TypeScript 类型检查 |
| `pnpm build:prod` | 生产环境构建 |
| `pnpm build:test` | 测试环境构建 |
| `pnpm build:gray` | 灰度环境构建 |
| `pnpm lint` | 按现有脚本检查并自动修复 ESLint 问题 |
| `pnpm exec eslint .` | 执行只读 ESLint 检查 |
| `pnpm preview` | 预览构建产物 |

`src/type/auto-imports.d.ts` 和 `src/type/components.d.ts` 遵循现有 Git 忽略配置，由 Vite 自动生成。全新克隆后先启动开发服务器或执行构建，再运行依赖这些声明的类型检查。

## 目录结构

```text
vue-dual-platform-template/
├── plugins/                         构建插件与类型声明
│   └── vite-version-check-plugin.ts  页面版本检测
├── public/                          公共静态资源
├── src/
│   ├── apis/                        业务接口目录
│   ├── assets/
│   │   ├── icons-h5/                H5 SVG 图标
│   │   ├── icons-pc/                PC SVG 图标
│   │   └── imgs/                    图片资源
│   ├── components/                  公共组件与 svg-icon
│   ├── components-pc/               PC 专用组件
│   ├── constants/                   公共常量
│   ├── hooks/                       共享组合式能力
│   ├── layout/                      页面布局与移动端过渡
│   ├── pages/                       H5 页面
│   ├── pages-pc/                    PC 页面
│   ├── router/                      路由定义
│   ├── store/                       Pinia 实例
│   ├── styles/                      全局 Less 样式
│   ├── type/                        全局类型及自动导入声明
│   ├── utils/
│   │   ├── http/                    HTTP 封装与响应处理
│   │   └── js-bradge/               客户端 JSBridge 集成
│   ├── App.vue                      应用根组件
│   └── main.ts                      应用初始化入口
├── .env.dev                         开发配置
├── .env.test                        测试配置
├── .env.gray                        灰度配置
├── .env.prod                        生产配置
├── eslint.config.js                 ESLint 配置
├── vite.config.ts                   Vite 配置
└── TEMPLATE.md                      迁移记录与验证结果
```

空目录中的 `.gitkeep` 用于保留模板结构，新增实际文件后可按项目需要处理。

## 双端页面与路由

在 `src/pages/` 创建 H5 页面，在 `src/pages-pc/` 创建 PC 页面，再到 `src/router/index.ts` 的 `children` 中注册路由。沿用现有首页规则时，可分别实现 `/home-list` 和 `/pc-home-list`。

页面可以按 `页面名/index.vue`、`index.ts` 及按需添加的 `index.less` 组织。公共模块通过入口导出，跨模块引用使用 `@/` 别名。

## 移动端适配

`vite.config.ts` 使用 `postcss-px-to-viewport-8-plugin`，基于 **375px** 设计稿将像素尺寸转换为 `vw`。配置保留 `1px` 细线，并排除 Element Plus 和 `src` 下名称以 `-pc` 结尾的一级目录，同时保留原有选择器过滤规则。

样式采用 Less，应用级样式从 `src/styles/index.less` 统一引入，组件样式按现有作用域维护。

## 环境与接口

| 配置 | 用途 |
| --- | --- |
| `VITE_BASE_API` | Axios 基础地址 |
| `VITE_BASE_URL` | 静态资源与 History 路由的基础路径 |
| `server.proxy` | `vite.config.ts` 中的开发接口代理 |

开发环境的 `VITE_BASE_API` 为 `/api`，其他环境保留原有配置。当前开发代理会去掉请求路径的 `/api` 前缀，代理目标沿用迁移工程配置，接入业务时按服务端环境调整。

本地环境覆盖可使用 `.env.dev.local` 等文件。`VITE_` 前缀字段会进入浏览器资源。

统一请求能力从 `src/utils/http` 导出。响应成功条件及错误结构遵循现有封装，接入新的后端协议时在对应模块中调整。

## 客户端与静态资源

JSBridge 的初始化入口、桥接脚本与声明均已保留。客户端相关调用应在对应宿主环境中验证。

`index.html` 沿用 `/jQuery/jquery.min.js` 外部引用，运行环境需要提供对应静态文件。SVG 图标放入 `src/assets/icons-h5/` 或 `src/assets/icons-pc/`，按已有 `svg-icon` 用法引用。

## 构建与部署

```bash
pnpm build:prod
pnpm preview
```

构建产物位于 `dist/`，部署时遵循对应环境的 `VITE_BASE_URL`。使用 Vue Router History 模式时，服务器需要将前端路由回退到该基础路径下的 `index.html`。

版本检测插件会生成 `version.json`，部署时随应用资源一起更新。Gzip 文件由构建插件生成，服务器按实际配置提供压缩资源。

## 验证状态

已完成依赖锁定安装、类型检查和生产构建。ESLint 检出原工程现有的 20 项问题，构建保留 jQuery 外部引用、VConsole `eval` 和分块体积提示。详细迁移范围与验证记录见 [TEMPLATE.md](./TEMPLATE.md)。

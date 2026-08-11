# CodeLens AI

CodeLens AI 是一个面向前端代码审查场景的全栈练习项目，提供多文件编辑、流式 Review、问题定位、修改预览与审查历史。界面参考 Cursor、VS Code 与 Linear，强调清晰、克制且可追踪的代码审查体验。

> 项目可使用 Mock Provider 演示；真实模型密钥仅配置在服务端，禁止提交到仓库。

## 核心能力

- Monaco Editor：支持 JavaScript、TypeScript、React 与 Vue，包含自动布局、字体调节和草稿保存。
- 文件工作区：新增、删除、切换文件，编辑内容实时同步到 Zustand Store。
- Code Review：通过 SSE 接收流式输出，包含加载、重试、错误与断线处理。
- 问题定位：Review Issue 与 Monaco Marker、行高亮及滚动定位联动。
- Fix Preview：使用 Monaco Diff Editor 对比修改前后内容，由用户决定接受或拒绝。
- Review History：使用 Zustand Persist 在浏览器本地保存审查记录。
- 响应式暗色界面：桌面端三栏布局，窄屏下自动收敛侧栏和审查区域。

## 技术栈

前端使用 React 19、TypeScript、Vite、React Router、Zustand、Tailwind CSS、shadcn/ui 风格基础组件、Monaco Editor、TanStack Query 与 Framer Motion。

后端使用 Node.js、Express、TypeScript、SSE 与 DeepSeek API。

## 项目结构

```text
.
├─ src/
│  ├─ app/          # 应用入口与全局 Provider
│  ├─ components/   # 可复用 UI、Editor、Review、Diff、History 组件
│  ├─ hooks/        # Review、Monaco 导航、Marker、Fix 等交互编排
│  ├─ layouts/      # Header、Sidebar 与编辑器工作区布局
│  ├─ pages/        # 路由页面
│  ├─ routes/       # 路由配置
│  ├─ services/     # AI Provider 与流式通信适配
│  ├─ stores/       # 文件、Review、History 状态
│  ├─ styles/       # 全局样式与主题变量
│  ├─ types/        # 领域类型与环境变量声明
│  └─ utils/        # 无状态工具函数
└─ server/
   ├─ controllers/  # HTTP 请求处理
   ├─ middleware/   # 统一错误中间件
   ├─ routes/       # API 路由
   ├─ services/     # Review、SSE 与 LLM 调用
   └─ types/        # 服务端请求及响应类型
```

组件负责展示，Hook 负责编排交互，Store 管理跨组件状态，Service 隔离外部通信。这样的边界便于独立测试、替换模型 Provider，并避免 UI 与数据来源耦合。

## 本地运行

环境要求：Node.js 20+、npm 10+。

### 1. 安装依赖

```bash
npm install
cd server
npm install
cd ..
```

### 2. 配置环境变量

复制根目录 `.env.example` 为 `.env`：

```dotenv
VITE_APP_NAME=CodeLens AI
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AI_PROVIDER=mock
```

复制 `server/.env.example` 为 `server/.env`。需要调用真实模型时，在本地填写 DeepSeek Key：

```dotenv
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
DEEPSEEK_API_KEY=your_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

不要在任何 `VITE_` 变量中保存密钥：这类变量会被打包到浏览器代码中。

### 3. 启动开发服务

分别打开两个终端：

```bash
# Terminal 1：前端
npm run dev
```

```bash
# Terminal 2：后端
cd server
npm run dev
```

前端默认运行在 `http://localhost:5173`，API 默认运行在 `http://localhost:3000`。

## 可用脚本

```bash
npm run dev           # 启动前端开发服务器
npm run build         # TypeScript 检查并构建前端
npm run lint          # ESLint 检查，禁止 warning
npm run typecheck     # TypeScript 类型检查
npm run format        # Prettier 格式化
npm run format:check  # 检查代码格式
```

服务端脚本在 `server/` 目录执行：

```bash
npm run dev
npm run typecheck
npm run build
npm run start
```

## API

`POST /api/review` 接收一次完整审查请求；流式审查由前端先创建会话，再通过 EventSource 订阅 SSE。Review 结果统一遵循 `ReviewResult` 类型，前端不会直接持有或调用模型密钥。

## 工程质量

- TypeScript 严格模式与领域类型约束
- ESLint、Prettier、Husky、lint-staged 提交前检查
- `@/` 路径别名统一模块引用
- 路由级按需加载，Monaco 逻辑通过 Hook 隔离
- Provider 抽象隔离 Mock 与真实 LLM
- 请求 ID 防止过期 Review 覆盖当前文件结果
- 可复用的空状态、加载状态与错误反馈

## License

当前仓库尚未声明开源许可证。如需公开分发或接受外部贡献，请先添加合适的 License 文件。

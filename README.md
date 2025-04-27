# VPS Monitor

VPS状态监控面板，用于实时查看服务器运行状态。

## 功能特点

- 实时监控服务器 CPU、内存、磁盘使用情况
- 跟踪网络流量（入站和出站）
- 显示服务器运行时间和其他关键指标
- 支持多种时间范围的数据查看（1小时、6小时、24小时、7天、30天）
- 响应式设计，适配各种设备屏幕

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Chart.js / React-Chartjs-2
- date-fns 时间处理库
- Lucide React 图标库

## 安装步骤

1. 克隆仓库
```bash
git clone xxxx
cd xxxxx
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，添加你的 API Token:
```
VITE_API_TOKEN=your_api_token_here
```

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

## 使用说明

1. 启动应用后，仪表盘会自动加载并显示服务器状态
2. 点击各个指标卡片可查看详细图表
3. 使用时间范围选择器调整数据显示范围
4. 点击"刷新数据"按钮可手动更新最新数据
5. 服务器基本信息面板显示主机名、IP地址等静态信息

## API 配置

项目默认使用 Hostinger VPS API。如需使用其他 API：

1. 修改 `src/config.ts` 中的 BASE_URL
2. 调整 `src/api` 目录下的请求处理函数
3. 确保返回数据格式符合 `src/types` 中定义的接口

## 贡献指南

欢迎提交 Pull Request 或创建 Issue 来改进项目。请确保遵循现有的代码风格并添加适当的测试。

## 许可证

MIT 
# dsh-preset-claude-code

Anthropic Claude Code 官方模式预设插件 for DeepSeek Harness (DSH)。

## 功能特性

完全复刻 Anthropic Claude Code 官方系统提示词与工程哲学：
- **极简响应**：杜绝冗长自述与寒暄，直接执行。
- **先探查后手术刀编辑**：不凭空猜测，先搜查代码，使用精确定位替换。
- **验证自愈闭环**：修改后自动运行测试或检查，遇错即读报错自愈修复。
- **开箱即用工具集**：内置终端执行、文件读写搜索、任务跟踪与计划模式。

## 安装方法

### 方式 1：通过 NPM 安装（推荐）
在 DSH 的 profile 目录中执行：
```bash
cd ~/.dsh/profiles/desktop
pnpm add dsh-preset-claude-code
# 或
npm install dsh-preset-claude-code
```

### 方式 2：本地开发安装
```bash
cd ~/.dsh/profiles/desktop
pnpm add link:/path/to/dsh-preset-claude-code
```

安装完成后，重启 DeepSeek Harness 客户端即可在新建会话中体验 Claude Code 模式。

## License
MIT

# dsh-preset-claude-code

Anthropic Claude Code 官方模式预设插件 for DeepSeek Harness (DSH)。

## 功能特性

完全复刻 Anthropic Claude Code 官方系统提示词与工程哲学：
- **极简响应**：杜绝冗长自述与寒暄，直接执行。
- **先探查后手术刀编辑**：不凭空猜测，先搜查代码，使用精确定位替换。
- **验证自愈闭环**：修改后自动运行测试或检查，遇错即读报错自愈修复。
- **开箱即用工具集**：内置终端执行、文件读写搜索、任务跟踪与计划模式。

## 安装方法

本插件是一个 **DSH bundle 包**（在 `package.json` 中声明了 `dsh.bundle.patch`），
因此用 `dsh plugin add` 安装时会被注册为 profile 的一个配置层。
若安装方式绕过了 `dsh plugin`，DSH 只会打一句
`declares no dsh.bundle — installed as a plain dependency, not a profile layer`
的 warning：**包进了 `node_modules`，但预设不会出现**。

### 方式 1：让 DSH 自己安装（推荐）

```bash
dsh plugin --profile <profile 名> add dsh-preset-claude-code
```

### 方式 2：本地开发安装

```bash
dsh plugin --profile <profile 名> add link:/path/to/dsh-preset-claude-code
```

### 验证是否真的生效

```bash
# 必须 > 0；输出 0 说明只装进了 node_modules，没进组合树
dsh --profile <profile 名> --dump-config | grep -c preset-claude-code
```

安装（或卸载）bundle 层之后需要重启客户端才会生效；
只有 `cordis.patch.yml` 的普通编辑会热重载。

安装完成后，新建会话即可在预设列表里选到 **Claude Code 模式**——
它带 `order: 0`，会排在官方 standard / ptc / minimal / cordis 之前。

## 排错

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 装完没有任何报错，但预设列表里没有 | 包没有声明 `dsh.bundle.patch`，只被当成普通依赖装了 | 确认 `package.json` 有 `dsh.bundle.patch`；用上面的 `--dump-config \| grep` 复验 |
| `--dump-config` 里有一行，客户端里却没有 | bundle 层变更没有热重载 | 重启客户端 |
| 启动时 persona 行报冲突 | persona 行是 scope-only 的，挂在 preset 外面会和 prompt registry 的 `deployment:persona-prefix` 注册撞车 | 保持它作为 preset 的 `plugins` 子行，不要单独挂 |

## 开发

```bash
npm test          # 静态校验：入口导出、bundle 声明、patch 结构
```

修改提示词后，建议把 `dsh --profile <name> --dump-config` 的输出存一份做快照比对，
确认 `prefix` / `section` 这类多行文本的换行没有被 YAML 折叠掉
（用 `|` 字面块，不要用 `>-` 折叠标量）。

## License
MIT

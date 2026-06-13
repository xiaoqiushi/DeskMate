<p align="center">
  <img src="icon.png" width="80" />
</p>
<h1 align="center">DeskMate</h1>
<p align="center">
  <a href="https://github.com/xiaoqiushi/DeskMate"><img src="https://img.shields.io/badge/下载-DeskMate-8A2BE2?style=for-the-badge" alt="Download" /></a>
</p>
<p align="center">
  <b>中文</b> | <a href="./README.en.md">English</a> | <a href="./README.ja.md">日本語</a> | <a href="./README.ko.md">한국어</a> | <a href="./README.es.md">Español</a> | <a href="./README.fr.md">Français</a>
</p>
<p align="center">
  面向 AI 编程 agent 的桌面伙伴：监控任务状态、低打扰提示完成结果，并跳转回对应的编辑器窗口或 Codex 线程。
</p>

> DeskMate 是基于原项目 [OC-Claw](https://github.com/rainnoon/oc-claw)
> 的独立二次开发版本。当前分支保留原项目的桌宠与 agent 监控基础，并继续进行
> DeskMate 品牌、任务完成提示、编辑器跳转和工作流体验等方向的改造。

## 二开重点优化

DeskMate 不是简单改名，而是在原项目基础上重点优化了“任务完成后如何回到正确现场”的体验：

- **右上角完成提示**：任务结束后改为右上角轻提示，展示任务、项目、回复摘要等信息，不再自动弹出正上方面板打断当前操作。
- **点击跳回对应编辑器**：完成提示和会话列表优先跳回对应编辑器/窗口，而不是只打开项目文件夹。
- **Codex 精确线程跳转**：Codex 会话优先使用官方 `codex://threads/<sessionId>` deep link，尽量跳到对应线程，而不是随机激活某个 Codex 窗口。
- **Cursor / VS Code 窗口匹配**：针对多个编辑器窗口，按工作区路径匹配对应窗口，减少跳到错误窗口的情况。
- **项目文件夹保留为按钮**：原来打开项目文件夹的能力保留，但从默认点击行为改为独立按钮，避免和“回到编辑器”混在一起。
- **正上方面板改为主动触发**：保留原来的详情面板和权限卡片，但等待/完成事件不再自动展开，降低对当前工作的打扰。
- **OpenClaw 连接误报修复**：本地 gateway 检测不再只认 `openclaw-gateway` 进程名，改用 lock/PID 检测，避免 Node 进程模式下误报 `gateway not running`。
- **DeskMate 独立品牌化**：应用名、Bundle ID、安装脚本、官网、更新 manifest、Cursor 辅助扩展等信息已切换到 DeskMate。

<p align="center">
  <b>编程模式</b><br/>
  <sub>macOS：OpenClaw、Claude Code、Cursor、Codex</sub><br/>
  <sub>Windows：OpenClaw、Claude Code、Cursor</sub>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/74b8bbf8-ddcf-4149-a91e-d18d5c24fec6" width="600" />
</p>
<p align="center">
  <b>桌宠模式</b>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/2a143250-174a-406e-8a43-fd30db7ce071" width="600" />
</p>

## 功能概览

- 实时响应 OpenClaw / Claude Code / Codex / Cursor agent 活动状态（工作、空闲、等待）
- 不只是打开应用，而是尽量跳回具体工作现场：支持 Codex 线程 deep link、Cursor/VS Code 工作区窗口匹配，以及完成提示点击后回到对应编辑器
- 任务完成信息显示在右上角提示，不再自动打断当前操作；提示里保留任务、项目、回复摘要和跳转入口
- 桌面宠物角色，工作时播放动画，休息时打盹（macOS 刘海或 Windows 任务栏）
- 自动发现本地 OpenClaw agent，显示 session 列表、聊天记录、调用量/token 统计图表
- 通过 Hook 监听本地 Claude Code、Codex 和 Cursor 会话，查看实时对话
- 通过 SSH 连接远程服务器上的 OpenClaw 实例
- 自定义角色动画，将不同 agent 配对不同角色
- 可自定义岛屿背景，支持裁剪工具
- 完成提示音 & 等待提示音

## 前置条件

- macOS 或 Windows
- 已安装 [OpenClaw](https://github.com/nicepkg/openclaw)、[Claude Code](https://docs.anthropic.com/en/docs/claude-code)、[Codex](https://github.com/openai/codex) 和/或 [Cursor](https://www.cursor.com)

## 工作原理

```
OpenClaw Agents ──→ JSONL session 文件 ──→ 健康轮询 ──→ 活动状态
Claude Code     ──→ Hooks ──→ 事件解析 ──→ 活动状态
Codex           ──→ Hooks ──→ 事件解析 ──→ 活动状态
Cursor          ──→ Hooks ──→ 事件解析 ──→ 活动状态
                                              ↓
                          角色动画 ← 状态机 ← 提示音效
```

DeskMate 通过轮询 OpenClaw session 文件检测 agent 活动，并通过安装的 Hook 监听 Claude Code、Codex 和 Cursor。活动状态驱动刘海岛屿上的角色动画；完成提示和会话列表则负责把你带回对应编辑器窗口、工作区或 Codex 线程。

## 技术栈

- **Tauri v2** + **React** + **TypeScript** — 前端
- **Rust** — 后端，负责系统交互、SSH 隧道和 API 通信
- macOS / Windows 原生 API 实现窗口管理与定位

## 开发

```bash
cd frontend
npm install
npx tauri dev
```

## 贡献

欢迎提交 Bug 报告、功能建议和 Pull Request。

## 友情链接

感谢 [LINUX DO](https://linux.do/) 朋友们的支持与反馈。

## 致谢

- [OC-Claw](https://github.com/rainnoon/oc-claw) — 原始上游项目
- [Notchi](https://github.com/sk-ruban/notchi) — 刘海伴侣概念和草地岛屿的设计灵感
- [Vibe Island](https://github.com/vibeislandapp/vibe-island) — 交互设计参考

## 许可证

MIT

---

<p align="center">
  <img src="assets/powered-by-kaon.png" height="28" />
</p>
<p align="center">
  <sub>最初诞生于 KAON Hackathon</sub>
</p>

<p align="center">
  <img src="icon.png" width="80" />
</p>
<h1 align="center">DeskMate</h1>
<p align="center">
  <a href="https://github.com/xiaoqiushi/DeskMate"><img src="https://img.shields.io/badge/Download-DeskMate-8A2BE2?style=for-the-badge" alt="Download" /></a>
</p>
<p align="center">
  <b>English</b> | <a href="./README.md">中文</a>
</p>
<p align="center">
  A desktop companion for AI coding agents, with task monitoring, completion alerts, and editor window jumps.
</p>

> DeskMate is a secondary development based on [OC-Claw](https://github.com/rainnoon/oc-claw).

## Fork changes

- The default README is Chinese. English documentation is kept in [README.en.md](./README.en.md).
- App name, Bundle ID, install scripts, website, update manifest, and Cursor helper extension metadata have been changed to DeskMate.
- Task completion alerts are shown in the top-right corner instead of automatically opening the top panel.
- The top panel is retained and changed to manual trigger for details and permission-related information.
- Completion alerts and session entries prioritize jumping to the corresponding editor window.
- Codex sessions support `codex://threads/<sessionId>` for thread jumps.
- Cursor / VS Code windows are matched by workspace path when multiple windows are open.
- Opening the project folder is retained as a separate button.
- OpenClaw gateway detection now uses lock/PID checks to reduce false reports.

<p align="center">
  <b>Code Mode</b><br/>
  <sub>macOS: OpenClaw, Claude Code, Cursor, Codex</sub><br/>
  <sub>Windows: OpenClaw, Claude Code, Cursor</sub>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/74b8bbf8-ddcf-4149-a91e-d18d5c24fec6" width="600" />
</p>
<p align="center">
  <b>Pet Mode</b>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/2a143250-174a-406e-8a43-fd30db7ce071" width="600" />
</p>

## What it does

- Reacts to OpenClaw / Claude Code / Codex / Cursor agent activity in real time (working, idle, waiting)
- Supports Codex thread deep links, Cursor/VS Code workspace-window matching, and editor-focused actions for completion toasts
- Shows completion details in a top-right toast with task, project, reply summary, and jump actions
- Desktop pet character animates when agents work and sleeps when idle (macOS notch or Windows taskbar)
- Auto-discovers local OpenClaw agents with session lists, chat history, and daily calls/tokens charts
- Listens to local Claude Code, Codex, and Cursor sessions via hooks, view live conversations
- Connect to remote OpenClaw instances running on servers via SSH
- Custom character animations, pair different agents with different characters
- Customizable island backgrounds with crop tool
- Completion & waiting sound effects

## Requirements

- macOS or Windows
- [OpenClaw](https://github.com/nicepkg/openclaw), [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Codex](https://github.com/openai/codex), and/or [Cursor](https://www.cursor.com) installed

## How it works

```
OpenClaw Agents ──→ JSONL session files ──→ Health polling ──→ Activity state
Claude Code     ──→ Hooks ──→ Event parser ──→ Activity state
Codex           ──→ Hooks ──→ Event parser ──→ Activity state
Cursor          ──→ Hooks ──→ Event parser ──→ Activity state
                                                    ↓
                    Animated sprites ← State machine ← Sound effects
```

DeskMate polls OpenClaw session files to detect agent activity, and listens to Claude Code, Codex, and Cursor via installed hooks. Activity states drive character animations on the notch island, while completion toasts and session rows can take you back to the corresponding editor window, workspace, or Codex thread.

## Tech Stack

- **Tauri v2** + **React** + **TypeScript** — frontend
- **Rust** — backend for system interaction, SSH tunneling, and API communication
- macOS / Windows native APIs for window management and positioning

## Development

```bash
cd frontend
npm install
npx tauri dev
```

## Contributing

Bug reports, feature suggestions, and pull requests are welcome.

## Friendship Link

Thanks for the support and feedback from the friends at [LINUX DO](https://linux.do/).

## Credits

- [OC-Claw](https://github.com/rainnoon/oc-claw) — original upstream project
- [Notchi](https://github.com/sk-ruban/notchi) — design inspiration for notch companion concept and grass island
- [Vibe Island](https://github.com/vibeislandapp/vibe-island) — interaction design reference

## License

MIT

---

<p align="center">
  <img src="assets/powered-by-kaon.png" height="28" />
</p>
<p align="center">
  <sub>Originally created at KAON Hackathon</sub>
</p>

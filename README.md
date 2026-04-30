<p align="center">
  <img src="icon.png" width="80" />
</p>
<h1 align="center">OC-Claw</h1>
<p align="center">
  <a href="https://www.oc-claw.ai"><img src="https://img.shields.io/badge/Download_OC--Claw-oc--claw.ai-8A2BE2?style=for-the-badge" alt="Download" /></a>
</p>
<p align="center">
  <b>English</b> | <a href="./README.zh.md">中文</a> | <a href="./README.ja.md">日本語</a> | <a href="./README.ko.md">한국어</a> | <a href="./README.es.md">Español</a> | <a href="./README.fr.md">Français</a>
</p>
<p align="center">
  A desktop pet that monitors your AI coding agents in real time. Supports macOS and Windows.
</p>

<p align="center">
  <b>Pet Mode</b>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/2a143250-174a-406e-8a43-fd30db7ce071" width="600" />
</p>
<p align="center">
  <b>macOS — Efficiency Mode (OpenClaw, Claude Code, Cursor, Codex)</b>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/74b8bbf8-ddcf-4149-a91e-d18d5c24fec6" width="600" />
</p>
<p align="center">
  <b>Windows (OpenClaw, Claude Code)</b>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/74b8bbf8-ddcf-4149-a91e-d18d5c24fec6" width="600" />
</p>

## What it does

- Reacts to OpenClaw / Claude Code / Codex / Cursor agent activity in real time (working, idle, waiting)
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

OC-Claw polls OpenClaw session files to detect agent activity, and listens to Claude Code, Codex, and Cursor via installed hooks. Activity states drive character animations on the notch island, with an expandable panel for session details, chat history, and metrics.

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

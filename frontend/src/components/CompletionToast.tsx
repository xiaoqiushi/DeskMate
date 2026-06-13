import { useEffect, useMemo, useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { AlertCircle, CheckCircle2, ExternalLink, FolderOpen, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { SpritePet } from './SpritePet'
import type { CodexPet } from '../lib/codexPet'

interface CompletionToastPayload {
  sessionId: string
  source?: string
  projectName?: string
  cwd?: string
  userPrompt?: string
  lastResponse?: string
  updatedAt?: number
  autoClose?: boolean
  status?: 'completed' | 'waiting' | 'failed'
  pet?: CodexPet | null
}

function sourceLabel(source?: string) {
  if (source === 'cursor') return 'Cursor'
  if (source === 'codex') return 'Codex'
  return 'Claude'
}

function sourceClass(source?: string) {
  if (source === 'cursor') return 'bg-[#1a2f3f] text-[#5eb5f7]'
  if (source === 'codex') return 'bg-[#1d2f26] text-[#6dd29c]'
  return 'bg-[#3f211d] text-[#e87a65]'
}

function timeAgo(updatedAt?: number) {
  if (!updatedAt) return '<1m'
  const diff = Date.now() - updatedAt
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '<1m'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function responseText(payload: CompletionToastPayload) {
  const raw = (payload.lastResponse || '').trim()
  if (raw && raw !== '✓') return raw
  const label = sourceLabel(payload.source)
  if (payload.status === 'waiting') return `${label} 正在等待输入或权限确认。点击查看编辑器窗口。`
  if (payload.status === 'failed') return `${label} 任务结束时出现异常。点击查看编辑器窗口。`
  return `${label} 已完成任务。点击查看编辑器窗口。`
}

function compactResponse(payload: CompletionToastPayload) {
  return responseText(payload)
    .replace(/[#*_`>\-[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function CompletionToast() {
  const [payload, setPayload] = useState<CompletionToastPayload | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setPayload(null)
    invoke('hide_completion_toast').catch(() => {})
  }

  const openEditor = (p = payload) => {
    if (!p) return
    if (p.source === 'cursor') {
      invoke('focus_cursor_terminal', { sessionId: p.sessionId }).catch(() => {})
    } else {
      invoke('jump_to_claude_terminal', { sessionId: p.sessionId }).catch(() => {})
    }
    close()
  }

  const openProject = (p = payload) => {
    if (!p?.cwd) return
    invoke('open_claude_session_project', { sessionId: p.sessionId }).catch(() => {})
  }

  useEffect(() => {
    let mounted = true
    const applyPayload = (next: CompletionToastPayload | null) => {
      if (!mounted) return
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
      setPayload(next)
      if (next?.autoClose) {
        closeTimerRef.current = setTimeout(() => close(), 5000)
      }
    }

    invoke<CompletionToastPayload | null>('get_completion_toast_payload')
      .then((next) => applyPayload(next))
      .catch(() => {})

    const unlisten = listen<CompletionToastPayload>('completion-toast-payload', (event) => {
      applyPayload(event.payload)
    })

    return () => {
      mounted = false
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      unlisten.then((fn) => fn())
    }
  }, [])

  const preview = useMemo(() => (payload ? responseText(payload) : ''), [payload])

  if (!payload) return null

  const label = sourceLabel(payload.source)
  const hasProject = !!payload.cwd
  const status = payload.status || 'completed'
  const isWaiting = status === 'waiting'
  const isFailed = status === 'failed'
  const statusText = isWaiting ? '等待' : isFailed ? '异常' : '完成'
  const StatusIcon = isWaiting || isFailed ? AlertCircle : CheckCircle2
  const statusClass = isWaiting
    ? 'text-amber-300'
    : isFailed
      ? 'text-red-300'
      : 'text-emerald-400'

  return (
    <div className="w-full h-full p-2">
      <div
        className="h-full rounded-2xl bg-black/95 shadow-2xl overflow-hidden"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <div
          role="button"
          tabIndex={0}
          className="flex h-full w-full flex-col text-left hover:bg-white/[0.025] transition-colors"
          onClick={() => openEditor()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openEditor()
            }
          }}
          title="查看编辑器"
        >
          <div className="flex min-w-0 items-start gap-3 px-4 pt-4 pb-2">
            <div className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center">
              {payload.pet ? (
                <SpritePet pet={payload.pet} state="idle" size={35} />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              )}
              <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-emerald-400 border border-black/70" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                <span className="min-w-0 max-w-[42%] truncate text-[14px] font-bold text-slate-100">{payload.projectName || 'unknown'}</span>
                <span className="shrink-0 text-[13px] text-slate-600">·</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-normal text-slate-500">
                  {payload.userPrompt || '任务已完成'}
                </span>
              </div>
              <div className="mt-2 flex min-w-0 items-center gap-2">
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-[12px] font-semibold ${sourceClass(payload.source)}`}>{label}</span>
                <span className={`inline-flex shrink-0 items-center gap-1 text-[12px] ${statusClass}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {statusText}
                </span>
                <span className="shrink-0 text-[12px] text-slate-600">{timeAgo(payload.updatedAt)}</span>
              </div>
            </div>
            <span
              role="button"
              tabIndex={0}
              className="shrink-0 rounded-md p-1 text-slate-500 hover:bg-white/[0.07] hover:text-slate-200"
              onClick={(e) => {
                e.stopPropagation()
                close()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  close()
                }
              }}
              title="关闭"
            >
              <X className="h-4 w-4" />
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden px-4 pb-2 pl-[64px]">
            <div className="text-[12px] leading-[1.55] text-slate-400">
              <div className="mb-1 truncate">
                <span className="text-slate-600">你：</span>
                {payload.userPrompt || '任务已完成'}
              </div>
              <div className="markdown-content line-clamp-3 text-slate-300">
                <ReactMarkdown>{preview || compactResponse(payload)}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] px-4 py-2.5">
            {hasProject && (
              <span
                role="button"
                tabIndex={0}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#27272a] px-2.5 py-1 text-[11px] font-normal text-slate-300 hover:bg-[#303033] hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  openProject()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    openProject()
                  }
                }}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                打开项目
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-900/50 px-2.5 py-1 text-[11px] font-normal text-emerald-300 hover:bg-emerald-800/50 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" />
              查看编辑器
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

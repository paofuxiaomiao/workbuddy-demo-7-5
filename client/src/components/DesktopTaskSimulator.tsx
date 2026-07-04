// WorkBuddy 桌面整理任务模拟
// 还原 AI 执行任务时的步骤进度、文件操作动画

import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Circle, Loader2, FolderOpen, FileText, Image, Archive, ChevronDown, ChevronRight } from 'lucide-react';

interface TaskStep {
  id: string;
  label: string;
  detail: string;
  status: 'pending' | 'running' | 'done';
  subSteps?: string[];
  files?: string[];
}

const INITIAL_STEPS: TaskStep[] = [
  {
    id: 'scan',
    label: '扫描桌面文件',
    detail: '读取桌面目录，统计文件类型和数量',
    status: 'pending',
    subSteps: ['读取 /Users/mojo/Desktop/', '识别文件类型', '统计文件大小'],
  },
  {
    id: 'analyze',
    label: '分析文件结构',
    detail: '按类型、日期、项目归类分析',
    status: 'pending',
    subSteps: ['按扩展名分类', '提取文件创建日期', '识别项目关联性'],
  },
  {
    id: 'create_folders',
    label: '创建整理文件夹',
    detail: '在桌面创建分类文件夹',
    status: 'pending',
    files: ['📁 文档/', '📁 图片/', '📁 表格/', '📁 压缩包/', '📁 归档/2025/'],
  },
  {
    id: 'move_docs',
    label: '移动文档文件',
    detail: '将 23 个文档移入对应文件夹',
    status: 'pending',
    files: ['周报_2026_W26.docx → 文档/', '产品需求文档v3.pdf → 文档/', '会议纪要_0630.docx → 文档/', '...共 23 个文件'],
  },
  {
    id: 'move_images',
    label: '移动图片文件',
    detail: '将 47 个图片移入图片文件夹，删除 6 个重复文件',
    status: 'pending',
    files: ['screenshot_001.png → 图片/', 'banner_draft.jpg → 图片/', '⚠️ 删除重复: logo_copy.png (×6)', '...共 47 个文件'],
  },
  {
    id: 'move_archives',
    label: '处理压缩包',
    detail: '将 5 个压缩包移入归档文件夹',
    status: 'pending',
    files: ['项目备份_202506.zip → 归档/', 'node_modules_backup.tar.gz → 归档/'],
  },
  {
    id: 'cleanup',
    label: '清理临时文件',
    detail: '删除 .DS_Store 等系统临时文件',
    status: 'pending',
    subSteps: ['删除 .DS_Store (×12)', '清理 Thumbs.db (×3)', '移除空文件夹 (×4)'],
  },
  {
    id: 'report',
    label: '生成整理报告',
    detail: '输出整理结果摘要',
    status: 'pending',
  },
];

const FINAL_REPORT = `## 🎉 桌面整理完成！

**整理结果摘要：**

| 操作 | 数量 |
|------|------|
| 移动文件 | 83 个 |
| 创建文件夹 | 5 个 |
| 删除重复文件 | 6 个 |
| 清理临时文件 | 19 个 |
| 节省空间 | 约 234 MB |

**桌面现在只保留：**
- 📁 文档/（23个文件）
- 📁 图片/（41个文件）
- 📁 表格/（8个文件）
- 📁 压缩包/（5个文件）
- 📁 归档/2025/（历史文件）

整理前桌面有 **95 个文件**，现在只有 **5 个文件夹**，清爽多了！`;

export default function DesktopTaskSimulator({ onClose }: { onClose: () => void }) {
  const [steps, setSteps] = useState<TaskStep[]>(INITIAL_STEPS.map(s => ({ ...s })));
  const [currentStep, setCurrentStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [report, setReport] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 100);
  };

  const runStep = (idx: number) => {
    if (idx >= INITIAL_STEPS.length) {
      setRunning(false);
      setDone(true);
      // 打字机显示报告
      let i = 0;
      const interval = setInterval(() => {
        i += 8;
        if (i >= FINAL_REPORT.length) {
          setReport(FINAL_REPORT);
          clearInterval(interval);
        } else {
          setReport(FINAL_REPORT.slice(0, i));
        }
        scrollToBottom();
      }, 20);
      return;
    }

    setCurrentStep(idx);
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status: 'running' } : s));
    setExpandedSteps(prev => { const n = new Set(Array.from(prev)); n.add(INITIAL_STEPS[idx].id); return n; });
    scrollToBottom();

    const delay = 800 + Math.random() * 1200;
    timerRef.current = setTimeout(() => {
      setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status: 'done' } : s));
      runStep(idx + 1);
    }, delay);
  };

  const start = () => {
    if (running || done) return;
    setRunning(true);
    runStep(0);
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps(INITIAL_STEPS.map(s => ({ ...s })));
    setCurrentStep(-1);
    setRunning(false);
    setDone(false);
    setReport('');
    setExpandedSteps(new Set());
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const toggleExpand = (id: string) => {
    setExpandedSteps(prev => {
      const next = new Set(Array.from(prev));
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderMarkdown = (text: string): string => text
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-gray-900 mt-3 mb-2">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/^---$/gm, '<hr class="border-gray-100 my-2"/>')
    .replace(/^\| (.+) \|$/gm, (line) => {
      const cells = line.split('|').filter(c => c.trim() && !c.match(/^[\s-]+$/));
      return cells.length ? '<tr>' + cells.map(c => `<td class="border border-gray-100 px-3 py-1.5 text-sm">${c.trim()}</td>`).join('') + '</tr>' : '';
    })
    .replace(/(<tr>[\s\S]*?<\/tr>)+/g, rows => `<table class="w-full border-collapse border border-gray-100 rounded-lg my-2">${rows}</table>`)
    .replace(/^- (.+)$/gm, '<div class="flex gap-2 my-0.5"><span class="text-[#00C48C]">•</span><span>$1</span></div>')
    .replace(/\n/g, '<br/>');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl flex overflow-hidden"
        style={{ width: 900, height: 620, animation: 'modalIn 0.2s cubic-bezier(0.23,1,0.32,1) forwards' }}
      >
        {/* 左侧：任务信息 */}
        <div className="w-64 bg-gray-50 border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs">W</div>
              <span className="text-sm font-semibold text-gray-800">WorkBuddy</span>
            </div>
            <p className="text-xs text-gray-500">桌面整理任务模拟</p>
          </div>

          {/* 用户消息 */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="bg-gray-800 text-white rounded-xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed">
              帮我分析一下桌面上的文件，整理一下
            </div>
          </div>

          {/* 任务信息 */}
          <div className="px-4 py-3 flex-1">
            <p className="text-xs font-medium text-gray-500 mb-2">任务信息</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between"><span>工作空间</span><span className="text-gray-400">~/Desktop</span></div>
              <div className="flex justify-between"><span>模式</span><span className="text-[#00C48C]">Craft</span></div>
              <div className="flex justify-between"><span>模型</span><span className="text-gray-400">DeepSeek V4</span></div>
              <div className="flex justify-between"><span>步骤</span><span className="text-gray-400">{currentStep + 1}/{INITIAL_STEPS.length}</span></div>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="px-4 py-4 border-t border-gray-100 space-y-2">
            {!running && !done && (
              <button
                onClick={start}
                className="w-full py-2 bg-[#00C48C] text-white text-sm rounded-xl font-medium hover:bg-[#00A876] transition-colors"
              >
                ▶ 开始执行
              </button>
            )}
            {(running || done) && (
              <button
                onClick={reset}
                className="w-full py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
              >
                重新演示
              </button>
            )}
          </div>
        </div>

        {/* 右侧：执行过程 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">任务执行过程</span>
              {running && (
                <div className="flex items-center gap-1 text-xs text-[#00C48C]">
                  <Loader2 size={12} className="animate-spin" />
                  <span>执行中...</span>
                </div>
              )}
              {done && (
                <div className="flex items-center gap-1 text-xs text-[#00C48C]">
                  <CheckCircle2 size={12} />
                  <span>已完成</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <X size={15} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            {/* 步骤列表 */}
            {steps.map((step, idx) => (
              <div key={step.id} className={`rounded-xl border transition-all ${
                step.status === 'running' ? 'border-[#00C48C]/40 bg-[#00C48C]/5' :
                step.status === 'done' ? 'border-gray-100 bg-white' :
                'border-gray-100 bg-gray-50/50'
              }`}>
                <button
                  className="flex items-center gap-3 w-full px-4 py-3 text-left"
                  onClick={() => (step.files || step.subSteps) && toggleExpand(step.id)}
                >
                  {/* 状态图标 */}
                  <div className="flex-shrink-0">
                    {step.status === 'done' && <CheckCircle2 size={16} className="text-[#00C48C]" />}
                    {step.status === 'running' && <Loader2 size={16} className="text-[#00C48C] animate-spin" />}
                    {step.status === 'pending' && <Circle size={16} className="text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>
                        {step.label}
                      </span>
                      {step.status === 'running' && (
                        <span className="text-xs text-[#00C48C] animate-pulse">进行中</span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-500'}`}>
                      {step.detail}
                    </p>
                  </div>
                  {(step.files || step.subSteps) && step.status !== 'pending' && (
                    expandedSteps.has(step.id) ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {/* 展开详情 */}
                {expandedSteps.has(step.id) && (step.files || step.subSteps) && (
                  <div className="px-4 pb-3 space-y-1">
                    {(step.subSteps || step.files || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500 py-0.5">
                        <div className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                        <span className="font-mono">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* 完成报告 */}
            {report && (
              <div className="mt-4 p-4 bg-[#00C48C]/5 border border-[#00C48C]/20 rounded-xl">
                <div
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(report) }}
                />
              </div>
            )}

            {/* 等待开始提示 */}
            {!running && !done && currentStep === -1 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl mb-3">🗂️</div>
                <p className="text-sm text-gray-500">点击左侧「开始执行」，观看 AI 整理桌面的完整过程</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

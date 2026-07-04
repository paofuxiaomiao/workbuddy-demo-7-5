// 进度条组件 - 显示在主界面右下角
// 追踪用户探索进度，提示还差几步触发彩蛋

import { useState } from 'react';
import { Gift, ChevronUp, ChevronDown } from 'lucide-react';
import { TOTAL_CATEGORIES } from '@/hooks/useProgress';

interface ProgressBarProps {
  completedCategories: number;
  isAllComplete: boolean;
  progress?: Record<string, number>;
  onEggClick?: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  feature_click: '点击功能介绍 ×5',
  chat_complete: '完成一次对话',
  task_complete: '执行桌面整理任务',
  workspace_select: '选择工作空间',
  guide_chapter: '阅读功能指南',
  settings_tab: '打开设置页面 ×3',
  expert_click: '查看专家面板',
  automation_click: '查看自动化模板',
  preset_chat: '使用预设对话问题',
};

const TARGETS_DISPLAY: Record<string, number> = {
  feature_click: 5, chat_complete: 1, task_complete: 1, workspace_select: 1,
  guide_chapter: 3, settings_tab: 3, expert_click: 1, automation_click: 1, preset_chat: 1,
};

export default function ProgressBar({ completedCategories, isAllComplete, progress = {}, onEggClick }: ProgressBarProps) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round((completedCategories / TOTAL_CATEGORIES) * 100);

  const handleClick = () => {
    if (isAllComplete && onEggClick) {
      onEggClick();
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-40 select-none"
      style={{ animation: 'slideInRight 0.4s cubic-bezier(0.23,1,0.32,1) forwards' }}
    >
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10"
        style={{ minWidth: 210, maxWidth: 250 }}
      >
        {/* 主体 */}
        <button
          onClick={handleClick}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: isAllComplete ? '#00C48C' : 'rgba(0,196,140,0.2)' }}>
              <Gift size={16} className={isAllComplete ? 'text-white' : 'text-[#00C48C]'} />
            </div>
            {/* 进度环 */}
            <svg className="absolute -inset-1 w-11 h-11" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="19" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <circle cx="22" cy="22" r="19" fill="none" stroke="#00C48C" strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 19}`}
                strokeDashoffset={`${2 * Math.PI * 19 * (1 - pct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-semibold text-white">
              {isAllComplete ? '🎉 探索完成！' : '探索进度'}
            </p>
            <p className="text-xs text-gray-400">
              {isAllComplete ? '点击领取彩蛋 🎁' : `${completedCategories}/${TOTAL_CATEGORIES} 项已完成`}
            </p>
          </div>
          {!isAllComplete && (
            expanded
              ? <ChevronDown size={13} className="text-gray-500 flex-shrink-0" />
              : <ChevronUp size={13} className="text-gray-500 flex-shrink-0" />
          )}
        </button>

        {/* 进度条 */}
        <div className="px-4 pb-3">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: isAllComplete
                  ? '#00C48C'
                  : 'linear-gradient(90deg, #00C48C, #6366F1)',
              }} />
          </div>
          <p className="text-xs text-gray-600 mt-1 text-right">{pct}%</p>
        </div>

        {/* 展开的任务列表 */}
        {expanded && !isAllComplete && (
          <div className="border-t border-white/10 px-4 py-3 space-y-2 max-h-52 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-2 font-medium">完成以下探索解锁彩蛋 🎁</p>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const current = progress[key] || 0;
              const target = TARGETS_DISPLAY[key] || 1;
              const done = current >= target;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all"
                    style={{
                      borderColor: done ? '#00C48C' : 'rgba(255,255,255,0.15)',
                      background: done ? '#00C48C' : 'transparent',
                    }}
                  >
                    {done && <span style={{ fontSize: 9, color: 'white', lineHeight: 1 }}>✓</span>}
                  </div>
                  <span className={`text-xs leading-relaxed transition-all ${done ? 'text-[#00C48C] line-through opacity-60' : 'text-gray-400'}`}>
                    {label}
                    {target > 1 && !done && (
                      <span className="ml-1 text-gray-600">({current}/{target})</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

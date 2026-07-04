// 全局进度追踪 Hook
// 追踪用户的探索行为：点击功能介绍、完成对话、看完教程章节等
// 达到目标数量后触发彩蛋

import { useState, useEffect, useCallback } from 'react';

export type ProgressEvent =
  | 'feature_click'     // 点击功能介绍（侧边抽屉）
  | 'chat_complete'     // 完成一次对话
  | 'task_complete'     // 完成桌面整理任务
  | 'workspace_select'  // 选择工作空间
  | 'guide_chapter'     // 阅读功能指南章节
  | 'settings_tab'      // 打开设置子页面
  | 'expert_click'      // 点击专家卡片
  | 'automation_click'  // 点击自动化模板
  | 'preset_chat'       // 使用预设对话问题

// 每种事件的目标次数
const TARGETS: Record<ProgressEvent, number> = {
  feature_click: 5,     // 点击5个功能介绍
  chat_complete: 1,     // 完成1次对话
  task_complete: 1,     // 完成1次任务
  workspace_select: 1,  // 选择1次工作空间
  guide_chapter: 3,     // 阅读3个章节
  settings_tab: 3,      // 打开3个设置页面
  expert_click: 1,      // 点击1次专家
  automation_click: 1,  // 点击1次自动化
  preset_chat: 1,       // 使用1次预设问题
};

export const TOTAL_CATEGORIES = Object.keys(TARGETS).length; // 9个类别

const STORAGE_KEY = 'wb_progress';

function loadProgress(): Record<ProgressEvent, number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {} as Record<ProgressEvent, number>;
}

function saveProgress(p: Record<ProgressEvent, number>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<ProgressEvent, number>>(loadProgress);
  const [eggTriggered, setEggTriggered] = useState(false);

  // 计算已完成的类别数
  const completedCategories = Object.entries(TARGETS).filter(
    ([key, target]) => (progress[key as ProgressEvent] || 0) >= target
  ).length;

  const isAllComplete = completedCategories >= TOTAL_CATEGORIES;

  // 检查是否已经看过彩蛋
  useEffect(() => {
    const seen = localStorage.getItem('wb_egg_seen');
    if (seen && isAllComplete) setEggTriggered(false); // 已看过不再弹
  }, [isAllComplete]);

  const track = useCallback((event: ProgressEvent) => {
    setProgress(prev => {
      const current = prev[event] || 0;
      const target = TARGETS[event];
      if (current >= target) return prev; // 已达标，不重复计数
      const next = { ...prev, [event]: current + 1 };
      saveProgress(next);

      // 检查是否全部完成
      const newCompleted = Object.entries(TARGETS).filter(
        ([k, t]) => (next[k as ProgressEvent] || 0) >= t
      ).length;
      if (newCompleted >= TOTAL_CATEGORIES && !localStorage.getItem('wb_egg_seen')) {
        setTimeout(() => setEggTriggered(true), 500);
      }
      return next;
    });
  }, []);

  const dismissEgg = useCallback(() => {
    setEggTriggered(false);
    localStorage.setItem('wb_egg_seen', '1');
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({} as Record<ProgressEvent, number>);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('wb_egg_seen');
    setEggTriggered(false);
  }, []);

  return {
    progress,
    completedCategories,
    isAllComplete,
    eggTriggered,
    track,
    dismissEgg,
    resetProgress,
    targets: TARGETS,
  };
}

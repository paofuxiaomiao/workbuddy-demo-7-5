// WorkBuddy 自动化面板组件

import type { FeatureInfo } from '@/data/features';

interface AutomationPanelProps {
  onFeatureClick: (feature: FeatureInfo) => void;
}

const automationTemplates = [
  { name: '每日 AI 新闻推送', desc: '关注当天 AI 领域的重要动态，侧重 AI coding 与工具...' },
  { name: '每日 5 个英语单词', desc: '每天推荐 5 个高频实用英语单词，包含词义、音标...' },
  { name: '每日儿童睡前故事', desc: '生成 3-5 分钟可读的温和睡前故事，情节完整并附...' },
  { name: '每周工作周报', desc: '每周五汇总仓库 PR 与 Issue 进展，输出关键变更与...' },
  { name: '经典电影推荐', desc: '推荐一部高分经典电影，简要介绍剧情梗概、亮点...' },
  { name: '历史上的今天', desc: '从科技、电影、音乐等领域挑选一件"今天发生过"的...' },
  { name: '每日一个为什么', desc: '每天抛出一个有趣问题，先提问再解答，语气轻松...' },
  { name: '父母联系提醒', desc: '每周日 10:00 提醒你给家人打电话或发消息，简单...' },
  { name: '体检预约提醒', desc: '在 2026/04/08 07:00 提醒你确认体检时间、准备证...' },
  { name: '面试准备提醒', desc: '工作日每 2 小时提醒你复习大模型面试内容，并生...' },
  { name: '会议前准备', desc: '在会议开始前提醒你整理议题、目标、待确认问题...' },
  { name: '可爱萌宠手机壁纸', desc: '随机从 7 种不同风格中挑选一种，为你生成一张 9:1...' },
];

export default function AutomationPanel({ onFeatureClick }: AutomationPanelProps) {
  const handleClick = () => {
    import('@/data/features').then(m => onFeatureClick(m.features.automation));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">自动化</h2>
          <button
            onClick={handleClick}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-[#00C48C] hover:text-[#00C48C] transition-colors"
          >
            + 添加
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">管理自动化任务并查看近期运行记录。</p>

        <h3 className="text-sm font-semibold text-gray-700 mb-3">从模版入手</h3>
        <div className="grid grid-cols-3 gap-3">
          {automationTemplates.map(t => (
            <div
              key={t.name}
              onClick={handleClick}
              className="border border-gray-100 rounded-xl p-3 cursor-pointer hover:border-[#00C48C]/40 hover:bg-[#00C48C]/3 transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-xs mb-2">⏰</div>
              <p className="text-xs font-semibold text-gray-800 mb-1">{t.name}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


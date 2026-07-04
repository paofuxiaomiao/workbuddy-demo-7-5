// WorkBuddy 项目面板组件

import type { FeatureInfo } from '@/data/features';

interface ProjectPanelProps {
  onFeatureClick: (feature: FeatureInfo) => void;
}

const templates = [
  { name: '产品需求全流程', desc: '从需求规划、PRD 到研发测试验收' },
  { name: '市场调研与竞品分析', desc: '深度调研、竞品拆解、报告评审' },
  { name: '团队知识库', desc: '持续沉淀 SOP、经验和 FAQ' },
  { name: '项目交付', desc: '管理客户需求、计划、风险和周报' },
  { name: 'Bug 跟踪/测试验收', desc: '持续跟踪Bug，统一测试用例和验收结论' },
];

export default function ProjectPanel({ onFeatureClick }: ProjectPanelProps) {
  const handleClick = () => {
    import('@/data/features').then(m => onFeatureClick(m.features.project));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        {/* 标题区 */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">项目</h2>
            <p className="text-sm text-gray-500 mt-1">多人协同，打造超级团队</p>
          </div>
          <div className="w-40 h-24 opacity-60">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <circle cx="40" cy="60" r="20" fill="#E5E7EB" />
              <circle cx="80" cy="50" r="22" fill="#D1D5DB" />
              <circle cx="130" cy="55" r="20" fill="#E5E7EB" />
              <circle cx="170" cy="45" r="18" fill="#D1D5DB" />
              <rect x="30" y="30" width="30" height="20" rx="4" fill="#9CA3AF" opacity="0.5" />
              <rect x="120" y="25" width="30" height="20" rx="4" fill="#9CA3AF" opacity="0.5" />
            </svg>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#00C48C] hover:text-[#00C48C] transition-colors mb-6"
        >
          <span className="text-lg">+</span> 新建项目
        </button>

        {/* 我的项目 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">我的项目</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>🔍</span><span>搜索项目</span>
            </div>
          </div>
          <div
            onClick={handleClick}
            className="border border-gray-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#00C48C]/40 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00C48C]/15 flex items-center justify-center text-sm">🔄</div>
            <div>
              <p className="text-sm font-medium text-gray-800">项目新手指引</p>
              <p className="text-xs text-gray-400">添加于 20 天前</p>
            </div>
          </div>
        </div>

        {/* 从模版创建 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">从模版创建</h3>
          <div className="grid grid-cols-2 gap-3">
            {templates.map(t => (
              <div
                key={t.name}
                onClick={handleClick}
                className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-[#00C48C]/40 hover:bg-[#00C48C]/3 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#00C48C]/15 flex items-center justify-center text-sm mb-2">🔄</div>
                <p className="text-sm font-medium text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

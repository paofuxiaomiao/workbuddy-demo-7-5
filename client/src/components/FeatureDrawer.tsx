// WorkBuddy 功能介绍侧边抽屉
// 从右侧滑入，不遮挡主界面，用户可以一边看界面一边看介绍

import { useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import type { FeatureInfo } from '@/data/features';

interface FeatureDrawerProps {
  feature: FeatureInfo | null;
  onClose: () => void;
}

export default function FeatureDrawer({ feature, onClose }: FeatureDrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* 右侧抽屉 */}
      <div
        className="fixed top-0 right-0 h-full z-40 flex flex-col bg-white shadow-2xl border-l border-gray-100"
        style={{
          width: 340,
          transform: feature ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {feature && (
          <>
            {/* 顶部彩色装饰条 */}
            <div className="h-1 w-full flex-shrink-0" style={{ background: feature.color }} />

            {/* 标题栏 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: feature.color + '18' }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{feature.title}</h2>
                  {feature.subtitle && (
                    <p className="text-xs text-gray-400 mt-0.5">{feature.subtitle}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* 描述 */}
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>

              {/* 功能要点 */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">功能详情</p>
                {feature.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: feature.color + '20', color: feature.color }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>

              {/* 小贴士 */}
              {feature.tips && (
                <div
                  className="rounded-xl p-3.5 flex items-start gap-2.5"
                  style={{ background: feature.color + '10', border: `1px solid ${feature.color}25` }}
                >
                  <span className="text-base flex-shrink-0">💡</span>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: feature.color }}>新手小贴士</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{feature.tips}</p>
                  </div>
                </div>
              )}

              {/* 继续探索提示 */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span>继续点击界面其他区域探索更多功能</span>
                  <ChevronRight size={12} />
                </p>
              </div>
            </div>

            {/* 底部关闭 */}
            <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full py-2 rounded-lg text-sm font-medium text-white transition-all active:scale-[0.98]"
                style={{ background: feature.color }}
              >
                明白了，继续探索
              </button>
            </div>
          </>
        )}
      </div>

      {/* 半透明遮罩（仅在抽屉打开时，点击关闭） */}
      {feature && (
        <div
          className="fixed inset-0 z-30"
          style={{ background: 'rgba(0,0,0,0.08)' }}
          onClick={onClose}
        />
      )}
    </>
  );
}

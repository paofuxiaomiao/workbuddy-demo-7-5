// WorkBuddy 功能介绍弹窗组件
// 设计：白色卡片 + 绿色顶部装饰条，scale+opacity 动画进入

import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { FeatureInfo } from '@/data/features';

interface FeatureModalProps {
  feature: FeatureInfo | null;
  onClose: () => void;
}

export default function FeatureModal({ feature, onClose }: FeatureModalProps) {
  useEffect(() => {
    if (feature) {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [feature, onClose]);

  if (!feature) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        style={{
          animation: 'modalIn 0.2s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部彩色装饰条 */}
        <div
          className="h-1.5 w-full"
          style={{ background: feature.color }}
        />

        {/* 内容区 */}
        <div className="p-6">
          {/* 标题行 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: feature.color + '18' }}
              >
                {feature.icon}
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 leading-tight">
                  {feature.title}
                </h2>
                {feature.subtitle && (
                  <p className="text-xs text-gray-500 mt-0.5">{feature.subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
            >
              <X size={15} />
            </button>
          </div>

          {/* 描述 */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {feature.description}
          </p>

          {/* 功能要点 */}
          <div className="space-y-2 mb-4">
            {feature.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: feature.color }}
                />
                <span className="text-sm text-gray-700 leading-relaxed">{detail}</span>
              </div>
            ))}
          </div>

          {/* 小贴士 */}
          {feature.tips && (
            <div
              className="rounded-lg p-3 flex items-start gap-2"
              style={{ background: feature.color + '12' }}
            >
              <span className="text-sm flex-shrink-0">💡</span>
              <p className="text-xs leading-relaxed" style={{ color: feature.color }}>
                <span className="font-medium">小贴士：</span>{feature.tips}
              </p>
            </div>
          )}
        </div>

        {/* 底部关闭按钮 */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg text-sm font-medium text-white transition-all active:scale-[0.98]"
            style={{ background: feature.color }}
          >
            明白了
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

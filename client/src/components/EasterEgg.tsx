// WorkBuddy 彩蛋弹窗
// 当用户完成所有探索任务后触发，显示邀请码 fuya2066

import { useState, useEffect } from 'react';
import { X, Gift, Copy, Check, Sparkles } from 'lucide-react';

interface EasterEggProps {
  onClose: () => void;
}

export default function EasterEgg({ onClose }: EasterEggProps) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 延迟显示，让动画更自然
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText('fuya2066').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={handleClose}
    >
      <div
        className="relative bg-gray-950 rounded-3xl overflow-hidden max-w-sm w-full mx-4"
        style={{
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(30px)',
          transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          boxShadow: '0 0 60px rgba(0,196,140,0.3), 0 25px 50px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部光晕装饰 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00C48C, transparent)' }} />

        {/* 粒子装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-[#00C48C] opacity-60"
              style={{
                left: `${10 + (i * 7.5) % 80}%`,
                top: `${5 + (i * 11) % 60}%`,
                animation: `float ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }} />
          ))}
        </div>

        <div className="relative px-8 pt-10 pb-8 text-center">
          {/* 关闭按钮 */}
          <button onClick={handleClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-colors">
            <X size={14} />
          </button>

          {/* 礼物图标 */}
          <div className="relative inline-flex mb-5">
            <div className="w-20 h-20 rounded-2xl bg-[#00C48C]/20 border border-[#00C48C]/30 flex items-center justify-center"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}>
              <Gift size={36} className="text-[#00C48C]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#00C48C] rounded-full flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
          </div>

          {/* 标题 */}
          <h2 className="text-2xl font-black text-white mb-2">
            🎉 探索完成！
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            你已经解锁了 WorkBuddy 的所有核心功能！<br />
            作为奖励，这是你的专属邀请码：
          </p>

          {/* 邀请码 */}
          <div className="relative mb-6">
            <div className="bg-gray-900 border border-[#00C48C]/40 rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-xs text-gray-500 mb-1">专属邀请码</p>
                <p className="text-2xl font-black tracking-widest text-[#00C48C]">fuya2066</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: copied ? '#00C48C' : 'rgba(0,196,140,0.15)',
                  color: copied ? 'white' : '#00C48C',
                  border: '1px solid rgba(0,196,140,0.3)',
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? '已复制' : '复制'}
              </button>
            </div>
            {/* 发光边框动画 */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow: '0 0 20px rgba(0,196,140,0.2)',
                animation: 'glow 2s ease-in-out infinite',
              }} />
          </div>

          {/* 说明 */}
          <p className="text-xs text-gray-600 leading-relaxed mb-6">
            在 WorkBuddy 注册时输入此邀请码，<br />
            可获得额外积分奖励 🎁
          </p>

          {/* 按钮 */}
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #00C48C, #00A876)' }}
          >
            太棒了，去体验 WorkBuddy！
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,196,140,0.2); }
          50% { box-shadow: 0 0 30px rgba(0,196,140,0.4); }
        }
      `}</style>
    </div>
  );
}

// WorkBuddy 设置弹窗组件 - 还原真实设置界面
// 包含系统设置、记忆、个性化、安全中心等子页面

import { useState } from 'react';
import React from 'react';
import { X, User, Settings, Brain, Cpu, Sliders, Palette, Database, Shield, HelpCircle } from 'lucide-react';
import type { FeatureInfo } from '@/data/features';

// 悬浮提示组件 - 问号图标 + 悬停弹出卡片
function Tooltip({ text, tips }: { text: string; tips?: string[] }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const handleEnter = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.top + rect.height / 2, left: rect.right + 8 });
    }
    setShow(true);
  };

  return (
    <div className="inline-flex items-center ml-1.5">
      <button
        ref={btnRef}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setShow(false)}
        className="w-4 h-4 rounded-full flex items-center justify-center text-gray-300 hover:text-[#00C48C] hover:bg-[#00C48C]/10 transition-colors flex-shrink-0"
      >
        <HelpCircle size={13} />
      </button>
      {show && (
        <div
          className="fixed bg-gray-900 text-white rounded-xl shadow-2xl p-3 w-72 pointer-events-none"
          style={{
            top: pos.top,
            left: pos.left,
            transform: 'translateY(-50%)',
            animation: 'popIn 0.12s ease forwards',
            zIndex: 99999,
          }}
          onMouseLeave={() => setShow(false)}
        >
          <div className="w-2 h-2 bg-gray-900 rotate-45 absolute -left-1 top-1/2 -translate-y-1/2 pointer-events-none" />
          <p className="text-xs text-gray-200 leading-relaxed">{text}</p>
          {tips && tips.length > 0 && (
            <div className="mt-2 space-y-1 border-t border-gray-700 pt-2">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-[#00C48C] mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-gray-400 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface SettingsModalProps {
  onClose: () => void;
  onFeatureClick: (feature: FeatureInfo) => void;
}

const settingsNav = [
  { id: 'account', label: '账户管理', icon: User },
  { id: 'system', label: '系统设置', icon: Settings },
  { id: 'ai', label: '智能体设置', icon: Brain },
  { id: 'memory', label: '记忆', icon: Cpu },
  { id: 'model', label: '模型', icon: Sliders },
  { id: 'buddy', label: '小扶设置', icon: User },
  { id: 'personal', label: '个性化', icon: Palette },
  { id: 'data', label: '数据管理', icon: Database },
  { id: 'security', label: '安全中心', icon: Shield },
  { id: 'help', label: '帮助与反馈', icon: HelpCircle },
];

export default function SettingsModal({ onClose, onFeatureClick }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('system');
  const [tipVisible, setTipVisible] = useState(true);
  const [dismissedTabs, setDismissedTabs] = useState<Set<string>>(new Set());

  const TAB_TIPS: Record<string, { color: string; title: string; desc: string; tips: string[] }> = {
    account: {
      color: '#00C48C', title: '账户管理 — 积分与版本说明',
      desc: '积分是 WorkBuddy 的使用货币，不同模型消耗不同数量的积分。每天可以在「Buddy 加油站」领取免费积分。',
      tips: ['体验版：免费，有每日积分限额，适合入门体验', '个人专业版（约 58元/月）：积分更多，适合日常重度使用', '每天领取 100 通用积分，坚持打卡积分更多', '积分不够用时可在账户页面充值或升级版本'],
    },
    system: {
      color: '#6B7280', title: '系统设置 — 新手必改的 3 项',
      desc: '第一次打开 WorkBuddy，建议先完成这 3 项配置，否则后续使用可能遇到文件找不到、技能过期、任务中断等问题。',
      tips: ['「默认工作空间路径」改为 D:/WorkBuddy/，避免占用 C 盘', '「技能自动更新」建议开启，技能有新版本自动升级', '「锁屏远程」如需远程下任务或自动化，必须开启'],
    },
    ai: {
      color: '#6366F1', title: '智能体设置 — AI 行为方式配置',
      desc: '这里控制 AI 执行任务时的行为模式。新手保持默认即可，熟悉后再根据需要调整。',
      tips: ['「自动思考模式」开启后输出质量更高但速度稍慢，复杂任务推荐开启', '「流式输出」开启后 AI 回复逐字显示，像打字机一样', '「长上下文优化」建议开启，对话很长时 AI 不会忘记前面内容', '「最大执行步数」新手建议设 20-50 步，防止 AI 执行过多操作'],
    },
    memory: {
      color: '#8B5CF6', title: '记忆 — 让 AI 越用越懂你',
      desc: '记忆功能让 AI 从对话中提取并记住你的偏好和工作习惯。对话越多，AI 就越了解你，回答也越个性化。',
      tips: ['建议开启「生成对话记忆」，AI 自动提取你的工作背景', '新手可先写 5 条基础记忆：先列计划再执行、不编造数据、不覆盖原文件、总结先给结论、标清保存路径', '记忆不要超过 10 条，太多会让 AI 分散注意力', '之前用过 ChatGPT 等工具，可以点「导入」迁移记忆'],
    },
    model: {
      color: '#F59E0B', title: '模型 — 选择 AI 的大脑',
      desc: '模型是 WorkBuddy 背后的大脑，不同模型在写作、表格、代码等任务上表现不同，积分消耗也不同。',
      tips: ['新手无脑选 DeepSeek V4 Pro：综合能力强、积分消耗低', '长文档处理（超过 50 页）推荐 Kimi k2', '代码开发任务推荐 GLM Coding Plan', '有自己的 API Key 可点「添加模型」接入，仅支持 OpenAI 兼容协议'],
    },
    buddy: {
      color: '#14B8A6', title: '小扶设置 — 配置你的 AI 助理',
      desc: '小扶是 WorkBuddy 的内置助理角色，可以通过语音、主动建议等方式辅助你使用 WorkBuddy。',
      tips: ['「主动建议」建议开启，任务完成后 AI 主动提供下一步操作建议', '「语音回复」适合开车、做家务等不方便看屏幕的场景', '「唤醒词」设置后可直接说唤醒词开始语音对话，默认「小扶小扶」'],
    },
    personal: {
      color: '#EC4899', title: '个性化 — 定制你的专属 AI 助理',
      desc: '自定义指令是最高优先级的行为规则，AI 在所有对话中都会遵循。这是让 AI 真正「了解你」的关键设置。',
      tips: ['「自定义指令」把你的工作背景、偏好规则写在这里，AI 每次都会参考', '示例：「我是小学教师，处理文件时先列计划，不要编造数据，总结时先给结论」', '指令不要超过 500 字，只写最重要的规则', '「基本风格」：正式适合工作汇报，轻松适合日常对话'],
    },
    data: {
      color: '#6366F1', title: '数据管理 — 缓存清理与云端同步',
      desc: '如果 C 盘空间不足，可以在这里清理 AI 生成的中间文件缓存。建议开启云端同步，换电脑后可恢复设置。',
      tips: ['「任务文件」缓存可以安全清理，是 AI 生成的中间结果', '「对话记录」清除后历史对话无法恢复，谨慎操作', '「云端同步」建议开启，换电脑也能恢复历史对话和设置', '定期清理「技能缓存」可以解决部分技能运行异常问题'],
    },
    security: {
      color: '#EF4444', title: '安全中心 — 控制 AI 的操作边界',
      desc: '安全中心统一管理 AI 的操作权限范围。新手建议保持默认配置，等熟悉 WorkBuddy 后再根据需要调整。',
      tips: ['「沙箱安全」：AI 在隔离安全工作区内操作，出错不影响整台电脑', '「文件安全」：可设置哪些文件夹 AI 可以访问，保护重要文件', '「命令安全」：控制 AI 能执行哪些系统命令，新手保持默认', '「内置运行时」：开发类任务（Node.js/Python）需要开启'],
    },
    help: {
      color: '#00C48C', title: '帮助与反馈 — 遇到问题先看这里',
      desc: '90% 的新手问题都有现成答案。建议按顺序查找：新手指南 → 视频教程 → 用户社区 → 问题反馈。',
      tips: ['文件找不到：检查路径是否用了完整的绝对路径（如 D:/WorkBuddy/文件名）', '任务中断：检查「锁屏远程」是否开启', '技能运行异常：尝试清理技能缓存或重新安装技能', '积分不够：每天在「Buddy 加油站」领取免费积分'],
    },
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (!dismissedTabs.has(id)) setTipVisible(true);
  };

  const handleDismissTip = () => {
    setTipVisible(false);
    setDismissedTabs(prev => { const s = new Set(Array.from(prev)); s.add(activeTab); return s; });
  };

  const currentTip = TAB_TIPS[activeTab];
  const showTip = tipVisible && !!currentTip && !dismissedTabs.has(activeTab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex"
        style={{ width: 760, height: 560, animation: 'modalIn 0.2s cubic-bezier(0.23,1,0.32,1) forwards' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 左侧导航 */}
        <div className="w-44 bg-gray-50 border-r border-gray-100 flex flex-col py-4 flex-shrink-0">
          {settingsNav.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-700 font-medium border border-amber-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {settingsNav.find(n => n.id === activeTab)?.label ?? '设置'}
            </h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* 自动弹出教学卡片 */}
            {showTip && currentTip && (
              <div
                className="mb-4 rounded-xl overflow-hidden border"
                style={{ borderColor: currentTip.color + '30', animation: 'tipSlideIn 0.25s cubic-bezier(0.23,1,0.32,1) forwards' }}
              >
                <div className="flex items-start justify-between px-4 py-3" style={{ background: currentTip.color + '12' }}>
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: currentTip.color }}>
                      <span style={{ fontSize: 11, color: 'white', fontWeight: 'bold' }}>i</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-1" style={{ color: currentTip.color }}>{currentTip.title}</p>
                      <p className="text-xs text-gray-600 leading-relaxed mb-2">{currentTip.desc}</p>
                      <div className="space-y-1">
                        {currentTip.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: currentTip.color }} />
                            <span className="text-xs text-gray-500 leading-relaxed">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleDismissTip}
                    className="w-5 h-5 rounded flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-white/60 transition-colors flex-shrink-0 ml-2 mt-0.5">
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'system' && <SystemSettings onFeatureClick={onFeatureClick} />}
            {activeTab === 'memory' && <MemorySettings />}
            {activeTab === 'personal' && <PersonalSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'ai' && <AISettings />}
            {activeTab === 'model' && <ModelSettings />}
            {activeTab === 'buddy' && <BuddySettings />}
            {activeTab === 'data' && <DataSettings />}
            {activeTab === 'help' && <HelpSettings />}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes tipSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function SystemSettings({ onFeatureClick }: { onFeatureClick: (f: FeatureInfo) => void }) {
  const [simplMode, setSimplMode] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [lockScreen, setLockScreen] = useState(false);
  const [autoInstall, setAutoInstall] = useState(false);

  const handleSettingsInfo = () => {
    import('@/data/features').then(m => onFeatureClick(m.features.settings));
  };

  return (
    <div className="space-y-5">
      <SettingRowTip label="显示语言" desc="设置应用程序界面的显示语言。"
        tooltip="目前支持中文（简体）等多语言，选择后界面文字会切换到对应语言。">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option>中文(简体)</option>
          <option>English</option>
        </select>
      </SettingRowTip>

      <SettingRowTip label="字体大小" desc=""
        tooltip="调整界面文字大小，视力不好或屏幕较小时可以适当调大。">
        <div className="w-full">
          <input type="range" className="w-full accent-gray-800" min={0} max={100} defaultValue={30} />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>小</span><span>默认</span><span>大</span>
          </div>
        </div>
      </SettingRowTip>

      <SettingRowTip label="简洁模式" desc="开启后将简化对话界面显示，隐藏部分装饰性元素。"
        tooltip="开启后界面更简洁，去掉欢迎动画等装饰，适合追求效率的用户。">
        <WbToggle checked={simplMode} onChange={setSimplMode} />
      </SettingRowTip>

      <SettingRowTip label="发送消息" desc="设置聊天输入框中发送消息的快捷键。"
        tooltip="默认 Enter 直接发送。如果你习惯在输入框里换行，建议改为 Ctrl+Enter 发送，避免误触。">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option>Enter</option>
          <option>Ctrl+Enter</option>
        </select>
      </SettingRowTip>

      <SettingRowTip label="技能自动更新" desc="开启后将自动更新已安装的技能为最新版本，不会更新你在 WorkBuddy 中编辑过的技能"
        tooltip="强烈建议开启！技能更新后会修复 Bug 和增加新功能，不开启可能导致技能运行异常。"
        tips={['开启后已安装的技能有新版本时自动升级', '你自己编辑过的技能不会被自动覆盖', '可以在技能市场查看每个技能的更新记录']}>
        <WbToggle checked={autoUpdate} onChange={setAutoUpdate} />
      </SettingRowTip>

      <SettingRowTip label="非高风险技能自动安装" desc="上传技能后仍会显示安全检测过程：检测结果为非高风险时自动继续安装，高风险始终需要手动确认。"
        tooltip="安装技能时会先做安全检测。开启后，检测为安全的技能自动安装；高风险技能无论如何都需要你手动确认。">
        <WbToggle checked={autoInstall} onChange={setAutoInstall} />
      </SettingRowTip>

      <SettingRowTip label="锁屏远程" desc="开启后即使在锁屏状态下，电脑也不会进入休眠、屏幕也不会自动关闭，方便通过手机远程操控和保持自动化任务持续进行。"
        tooltip="如果你需要远程下任务或设置了自动化任务，必须开启！否则电脑休眠后任务会中断。"
        tips={['远程控制场景必须开启', '自动化定时任务必须开启', '不需要远程时可以关闭，节省电量']}>
        <WbToggle checked={lockScreen} onChange={setLockScreen} />
      </SettingRowTip>

      <SettingRowTip label="默认工作空间存储路径" desc="新建任务、工作空间时将自动存放在该路径下。修改后不影响已有数据。"
        tooltip="强烈建议修改为非系统盘路径，如 D:/WorkBuddy/。默认在 C 盘会导致系统盘越来越满。"
        tips={['建议设置为 D:/WorkBuddy/', '避免放在 C 盘（系统盘）', '修改后不影响已有任务文件']}>
        <button className="text-sm text-[#00C48C] hover:underline">选择路径</button>
      </SettingRowTip>
    </div>
  );
}

function MemorySettings() {
  const [memOn, setMemOn] = useState(true);
  return (
    <div className="space-y-5">

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">记忆</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          记忆让 WorkBuddy 记住你的偏好和习惯，对话越多，它就越懂你。记忆内容遵循{' '}
          <span className="text-[#00C48C] cursor-pointer">WorkBuddy 隐私政策</span>，仅本人可见。
        </p>
      </div>
      <SettingRowTip label="生成对话记忆" desc="允许 WorkBuddy 从对话中提取并记住相关上下文，以便在未来对话中提供更连贯、个性化的回应。"
        tooltip="建议开启。AI 会自动从对话中提取你的工作背景、偏好习惯等信息，以后回答时会自动参考。"
        tips={['开启后不需要每次都重新介绍自己', '记忆内容仅自己可见，不会泄露给他人', '可以随时在这里查看和删除记忆内容']}>
        <WbToggle checked={memOn} onChange={setMemOn} />
      </SettingRowTip>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex justify-between items-start">
          <p className="text-xs text-gray-700 leading-relaxed flex-1 pr-4">
            <strong>工作背景</strong> 用户 Jojo（昵称 jojo）是榴莲松队（黑客松团队）成员，负责维护采用 React + Vite + TypeScript + wouter 技术栈的 durian_hackathon_gallery 项目...
          </p>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400">来自对话的记忆</p>
            <p className="text-xs text-gray-400">23 天前从对话中更新</p>
          </div>
        </div>
      </div>
      <SettingRowTip label="从其他AI导入记忆" desc="一键同步你在其他AI上的使用习惯。"
        tooltip="如果你之前用过 ChatGPT、Claude 等 AI 工具，可以把那边的记忆导入过来，不用重新配置。">
        <button className="text-sm text-[#00C48C] hover:underline font-medium">导入</button>
      </SettingRowTip>
    </div>
  );
}

function PersonalSettings() {
  const [welcomeOn, setWelcomeOn] = useState(true);
  const [text, setText] = useState('');
  return (
    <div className="space-y-5">
      <h3 className="text-base font-semibold text-gray-900">个性化</h3>
      <SettingRowTip label="基本风格和语调" desc="设置 AI 助手回复你的风格和语调。这不会影响 AI 助手的功能。"
      tooltip="影响 AI 回复的措辞风格。正式适合工作汇报，轻松适合日常对话，默认适合大多数场景。">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option>默认</option>
          <option>正式</option>
          <option>轻松</option>
        </select>
      </SettingRowTip>
      <SettingRowTip label="加载过程欢迎语" desc="在 AI 生成等待过程中展示辅助提示。关闭后可在这里重新打开。"
        tooltip="开启后 AI 生成时会显示一些有趣的提示语，让等待过程不那么无聊。关闭后等待界面更简洁。">
        <WbToggle checked={welcomeOn} onChange={setWelcomeOn} />
      </SettingRowTip>
      <div>
        <p className="text-sm font-medium text-gray-800 mb-1">自定义指令</p>
        <p className="text-xs text-gray-500 mb-3">告诉 AI 助手你希望它始终遵循的规则和偏好，这会直接影响所有对话。</p>
        <textarea
          className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-[#00C48C]"
          rows={5}
          placeholder='例如："每次回答我之前都说 ok，再接后续内容"'
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">这些指令会应用于你的所有对话</p>
          <p className="text-xs text-gray-400">{text.length} / 1500</p>
        </div>
        <div className="flex justify-end mt-3">
          <button className="px-5 py-2 bg-[#00C48C]/80 text-white text-sm rounded-lg hover:bg-[#00C48C] transition-colors">确认</button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-semibold text-gray-900">安全中心</h3>
          <p className="text-xs text-gray-500 mt-0.5">统一管理工作空间内的进程安全、数据安全与系统授权</p>
        </div>
        <span className="text-xs text-gray-400">安全能力由本地运行时提供</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SecurityCard title="沙箱安全" desc="AI 运行于隔离沙箱，并配置文件、命令、网络访问策略" enabled>
          <div className="space-y-1 mt-2">
            <SecuritySubItem label="文件安全" desc="为沙箱拦截后的文件路径配置白名单和黑名单" />
            <SecuritySubItem label="命令安全" desc="为命令前缀配置访问和放行名单" />
            <SecuritySubItem label="网络安全" desc="控制 URL 访问与沙箱网络域名规则" />
          </div>
        </SecurityCard>
        <SecurityCard title="数据安全" desc="数据流转过程中的安全防护">
          <div className="space-y-1 mt-2">
            <SecuritySubItem label="安全网关" desc="工作空间出入流量统一经过安全网关安全处理" badge="已开启" />
            <SecuritySubItem label="传输加密" desc="本地与云端通信使用端到端加密通道" badge="已开启" />
          </div>
        </SecurityCard>
      </div>
      <div className="border border-gray-100 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-800">内置运行时</p>
            <p className="text-xs text-gray-500 mt-0.5">允许使用随包提供的 Node.js、Python 和 Git Bash 工具</p>
          </div>
          <div className="w-9 h-5 rounded-full bg-[#00C48C] relative flex-shrink-0">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">账户管理</h3>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="w-12 h-12 rounded-full bg-[#00C48C] flex items-center justify-center text-white font-bold text-lg">A</div>
        <div>
          <p className="font-medium text-gray-900">Avec moi</p>
          <p className="text-sm text-gray-500">体验版用户</p>
        </div>
        <button className="ml-auto px-4 py-1.5 text-sm border border-[#00C48C] text-[#00C48C] rounded-lg hover:bg-[#00C48C]/5 transition-colors">升级</button>
      </div>
      <div className="text-sm text-gray-500 text-center py-8">账户详细信息请在真实 WorkBuddy 客户端中查看</div>
    </div>
  );
}

function AISettings() {
  const [autoThink, setAutoThink] = useState(true);
  const [streamOutput, setStreamOutput] = useState(true);
  const [contextLen, setContextLen] = useState(true);
  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 leading-relaxed">配置 AI 智能体的行为方式，影响任务执行的效率与质量。</p>
      <SettingRowTip label="自动思考模式" desc="开启后 AI 在执行复杂任务前会先进行内部推理，提升输出质量。"
      tooltip="开启后 AI 会先思考再回答，输出质量更高但速度稍慢。复杂任务推荐开启，简单问答可以关闭加快速度。">
        <WbToggle checked={autoThink} onChange={setAutoThink} />
      </SettingRowTip>
      <SettingRowTip label="流式输出" desc="开启后 AI 回复内容逐字显示，关闭则等待完整回复后一次性展示。"
      tooltip="开启后 AI 回复逐字出现，像打字机一样，可以边看边思考。关闭后等所有内容生成完再一次性显示。">
        <WbToggle checked={streamOutput} onChange={setStreamOutput} />
      </SettingRowTip>
      <SettingRowTip label="长上下文优化" desc="任务对话过长时自动压缩历史上下文，保持 AI 理解准确性。"
      tooltip="对话很长时 AI 可能会忘记前面说的内容。开启后会自动压缩历史记录，让 AI 始终记住关键信息。建议开启。">
        <WbToggle checked={contextLen} onChange={setContextLen} />
      </SettingRowTip>
      <SettingRowTip label="最大执行步数" desc="单次任务 AI 最多可执行的操作步数，超出后会暂停并询问是否继续。"
      tooltip="防止 AI 执行过多步骤导致意外。新手建议设置 20-50 步，熟悉后可以调高或不限制。">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option>20 步</option>
          <option>50 步</option>
          <option>100 步</option>
          <option>不限制</option>
        </select>
      </SettingRowTip>
    </div>
  );
}

function ModelSettings() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('腾讯云 Token Plan / 通用 Token Plan（个人版）');
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [modelName, setModelName] = useState('Auto');
  const [isCustom, setIsCustom] = useState(false);
  const [toolCall, setToolCall] = useState(true);
  const [imgInput, setImgInput] = useState(false);
  const [thinkMode, setThinkMode] = useState(false);
  const [customProto, setCustomProto] = useState(false);
  const [inputTokens, setInputTokens] = useState('');
  const [outputTokens, setOutputTokens] = useState('');
  const [providerSearch, setProviderSearch] = useState('');

  const PROVIDERS = {
    'Token Plan': [
      '腾讯云 Token Plan / Token Plan 企业版专业...',
      '腾讯云 Token Plan / Token Plan 企业版轻享...',
      '腾讯云 Token Plan / 通用 Token Plan（个人版）',
      '腾讯云 Token Plan / Hy Token Plan（个人版）',
    ],
    'Coding Plan': [
      '腾讯云 Coding Plan / Tencent Cloud Coding...',
      '智谱 Coding Plan / GLM Coding Plan',
      'Kimi Coding Plan',
    ],
    '自定义 API': ['自定义 / Custom'],
  };

  const endpointMap: Record<string, string> = {
    '腾讯云 Token Plan / 通用 Token Plan（个人版）': 'https://api.lkeap.cloud.tencent.com/plan/v3/chat/completions',
    '腾讯云 Token Plan / Hy Token Plan（个人版）': 'https://api.lkeap.cloud.tencent.com/plan/v3/chat/completions',
    '腾讯云 Token Plan / Token Plan 企业版专业...': 'https://api.lkeap.cloud.tencent.com/v1/chat/completions',
    '腾讯云 Token Plan / Token Plan 企业版轻享...': 'https://api.lkeap.cloud.tencent.com/v1/chat/completions',
    '腾讯云 Coding Plan / Tencent Cloud Coding...': 'https://api.lkeap.cloud.tencent.com/v1/chat/completions',
    '智谱 Coding Plan / GLM Coding Plan': 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    'Kimi Coding Plan': 'https://api.moonshot.cn/v1/chat/completions',
    '自定义 / Custom': '',
  };

  const currentEndpoint = endpointMap[selectedProvider] || '';
  const filteredProviders = Object.entries(PROVIDERS).map(([group, items]) => ({
    group,
    items: items.filter(p => !providerSearch || p.toLowerCase().includes(providerSearch.toLowerCase())),
  })).filter(g => g.items.length > 0);

  return (
    <div className="space-y-4">
      <SettingRowTip label="模型" desc="选择 AI 对话使用的默认大模型。不同模型能力各有侧重，积分消耗也不同。"
        tooltip="模型是 WorkBuddy 背后的大脑。新手先用内置推荐模型跑通任务，再考虑自定义模型。"
        tips={['新手推荐：DeepSeek V4 Pro，综合能力强积分消耗低', '长文档处理推荐 Kimi k2', '代码任务推荐 GLM Coding Plan']}>
        <span className="text-xs text-gray-400">当前：DeepSeek V4 Pro</span>
      </SettingRowTip>

      {/* 自定义模型区域 */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-800">自定义模型</p>
            <p className="text-xs text-gray-500 mt-0.5">
              管理写入到 <span className="font-mono text-[#00C48C]">~/.workbuddy/models.json</span> 的本地自定义模型配置。
            </p>
          </div>
          <button
            onClick={() => { setShowAddModal(true); setIsCustom(false); setSelectedProvider('腾讯云 Token Plan / 通用 Token Plan（个人版）'); setApiKey(''); setModelName('Auto'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all active:scale-95"
            style={{ background: '#1a1a1a' }}
          >
            <span className="text-base leading-none">+</span> 添加模型
          </button>
        </div>
        <div className="px-4 py-8 text-center text-xs text-gray-400">
          暂无自定义模型，点击「添加模型」接入自己的 API Key
        </div>
      </div>

      {/* 添加模型弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {/* 弹窗标题 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-gray-900">添加模型</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">仅支持 OpenAI 兼容协议 API</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* 提供商 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">提供商</label>
                <div className="relative">
                  {/* 当前选择显示 */}
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
                    {!isCustom && <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={{ background: '#006EFF' }}>
                      <span style={{ fontSize: 9, color: 'white', fontWeight: 'bold' }}>云</span>
                    </div>}
                    <input
                      value={isCustom ? '' : currentEndpoint}
                      readOnly={!isCustom}
                      placeholder={isCustom ? 'https://api.example.com/v1/chat/completions' : ''}
                      className="flex-1 text-xs text-gray-600 outline-none bg-transparent font-mono"
                    />
                    <a href="#" className="text-xs text-[#00C48C] flex-shrink-0 hover:underline" onClick={e => e.preventDefault()}>查看文档</a>
                  </div>
                  {/* 提供商选择器 */}
                  <div className="mt-1.5 border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                      className="flex items-center justify-between w-full px-3 py-2.5 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {!isCustom && <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={{ background: '#006EFF' }}>
                          <span style={{ fontSize: 9, color: 'white', fontWeight: 'bold' }}>云</span>
                        </div>}
                        <span className="text-sm text-gray-700">{isCustom ? '自定义 / Custom' : selectedProvider}</span>
                      </div>
                      <span className="text-gray-400 text-xs">▼</span>
                    </button>
                    {showProviderDropdown && (
                      <div className="border-t border-gray-100 bg-white max-h-52 overflow-y-auto">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1.5">
                            <span className="text-gray-400 text-xs">🔍</span>
                            <input value={providerSearch} onChange={e => setProviderSearch(e.target.value)}
                              placeholder="提供商" className="flex-1 text-xs outline-none bg-transparent text-gray-700" />
                          </div>
                        </div>
                        {filteredProviders.map(({ group, items }) => (
                          <div key={group}>
                            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">{group}</div>
                            {items.map(p => (
                              <button key={p} onClick={() => { setSelectedProvider(p); setIsCustom(p.includes('Custom')); setShowProviderDropdown(false); }}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 transition-colors text-left">
                                {p.includes('Custom') ? (
                                  <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-gray-500 flex-shrink-0">+</span>
                                ) : p.includes('智谱') ? (
                                  <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center bg-purple-600"><span style={{ fontSize: 8, color: 'white', fontWeight: 'bold' }}>Z</span></div>
                                ) : p.includes('Kimi') ? (
                                  <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center bg-orange-500"><span style={{ fontSize: 8, color: 'white', fontWeight: 'bold' }}>K</span></div>
                                ) : (
                                  <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={{ background: '#006EFF' }}><span style={{ fontSize: 8, color: 'white', fontWeight: 'bold' }}>云</span></div>
                                )}
                                <span className="text-sm text-gray-700 flex-1">{p}</span>
                                {p === selectedProvider && <span className="text-[#00C48C] text-xs">✓</span>}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">API Key</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="输入你的 API Key"
                    className="flex-1 text-sm outline-none bg-transparent text-gray-700"
                  />
                  <button onClick={() => setShowApiKey(!showApiKey)} className="text-gray-400 hover:text-gray-600">
                    <span className="text-xs">{showApiKey ? '👁' : '👁‍🗨'}</span>
                  </button>
                </div>
              </div>

              {/* 模型名称 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">模型名称</label>
                {isCustom ? (
                  <input
                    value={modelName === 'Auto' ? '' : modelName}
                    onChange={e => setModelName(e.target.value)}
                    placeholder="输入模型参数值，例如 gpt-4o 或 openai/gpt-4o"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00C48C] text-gray-700"
                  />
                ) : (
                  <div className="border border-gray-200 rounded-xl px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                    <span className="text-sm text-gray-700">{modelName}</span>
                    <span className="text-gray-400 text-xs">▼</span>
                  </div>
                )}
              </div>

              {/* 高级配置（自定义时显示） */}
              {isCustom && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">高级配置</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: '工具调用', val: toolCall, set: setToolCall },
                      { label: '图片输入', val: imgInput, set: setImgInput },
                      { label: '思考模式', val: thinkMode, set: setThinkMode },
                    ].map(item => (
                      <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                        <div onClick={() => item.set(!item.val)}
                          className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all"
                          style={{ borderColor: item.val ? '#00C48C' : '#d1d5db', background: item.val ? '#00C48C' : 'white' }}>
                          {item.val && <span style={{ fontSize: 9, color: 'white' }}>✓</span>}
                        </div>
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <div onClick={() => setCustomProto(!customProto)}
                      className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ borderColor: customProto ? '#00C48C' : '#d1d5db', background: customProto ? '#00C48C' : 'white' }}>
                      {customProto && <span style={{ fontSize: 9, color: 'white' }}>✓</span>}
                    </div>
                    <span className="text-sm text-gray-700">自定义协议</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">输入</label>
                      <input value={inputTokens} onChange={e => setInputTokens(e.target.value)}
                        placeholder="使用提供商默认值"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00C48C]" />
                      <div className="flex gap-1 mt-1">
                        {['32K','64K','128K','256K'].map(t => (
                          <button key={t} onClick={() => setInputTokens(t)}
                            className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 hover:bg-gray-200">{t}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">输出</label>
                      <input value={outputTokens} onChange={e => setOutputTokens(e.target.value)}
                        placeholder="使用提供商默认值"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00C48C]" />
                      <div className="flex gap-1 mt-1">
                        {['8K','16K','32K','64K'].map(t => (
                          <button key={t} onClick={() => setOutputTokens(t)}
                            className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 hover:bg-gray-200">{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 底部按钮 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-200 transition-colors">取消</button>
              <button onClick={() => setShowAddModal(false)}
                className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all active:scale-95"
                style={{ background: '#1a1a1a' }}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BuddySettings() {
  const [voiceOn, setVoiceOn] = useState(false);
  const [proactiveOn, setProactiveOn] = useState(true);
  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 leading-relaxed">配置 WorkBuddy 小扶助理的行为与交互方式。</p>
      <SettingRowTip label="语音回复" desc="开启后 AI 回复内容将同时以语音播报，适合免手操作场景。"
      tooltip="开启后 AI 回复会同时朗读出来，适合开车、做家务等不方便看屏幕的场景。">
        <WbToggle checked={voiceOn} onChange={setVoiceOn} />
      </SettingRowTip>
      <SettingRowTip label="主动建议" desc="AI 在完成任务后会主动提供下一步操作建议，帮助你更高效地推进工作。"
      tooltip={'建议开启。任务完成后 AI 会主动说「你还可以做...」，帮助你发现下一步操作，特别适合新手。'}>
        <WbToggle checked={proactiveOn} onChange={setProactiveOn} />
      </SettingRowTip>
      <SettingRowTip label="小扶唤醒词" desc="设置语音唤醒词，说出唤醒词后可直接开始语音对话。"
      tooltip={'设置后可以直接说唤醒词开始语音对话，不用手动点击。默认唤醒词是「小扶小扶」。'}>
        <input className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-32 outline-none focus:border-[#00C48C]" defaultValue="小扶小扶" />
      </SettingRowTip>
    </div>
  );
}

function DataSettings() {
  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 leading-relaxed">管理本地数据、缓存和同步设置。</p>
      <div className="space-y-3">
        {[
          { label: '对话记录', size: '128 MB', desc: '所有历史对话的本地缓存' },
          { label: '任务文件', size: '2.3 GB', desc: 'AI 生成的文件和中间结果' },
          { label: '技能缓存', size: '45 MB', desc: '已安装技能的本地数据' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{item.size}</span>
              <button className="text-xs text-red-500 hover:underline">清除</button>
            </div>
          </div>
        ))}
      </div>
      <SettingRowTip label="云端同步" desc="将对话记录和设置同步到云端，换设备后可恢复。"
      tooltip="建议开启。开启后换电脑也能恢复历史对话和设置，不用重新配置。关闭则数据只存在本地。">
        <WbToggle checked={true} onChange={() => {}} />
      </SettingRowTip>
    </div>
  );
}

function HelpSettings() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 leading-relaxed">遇到问题？查看文档或联系我们。</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '📖', title: '新手入门指南', desc: '从安装到第一个任务的完整教程' },
          { icon: '🎥', title: '视频教程', desc: '手把手演示各项功能的使用方法' },
          { icon: '💬', title: '用户社区', desc: '与其他用户交流使用技巧和经验' },
          { icon: '🐛', title: '问题反馈', desc: '遇到 Bug 或功能建议，告诉我们' },
        ].map(item => (
          <div key={item.title} className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-[#00C48C]/40 transition-colors">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-sm font-medium text-gray-800">{item.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">当前版本：<strong>WorkBuddy v5.1.7</strong></p>
        <button className="mt-2 text-xs text-[#00C48C] hover:underline">检查更新</button>
      </div>
    </div>
  );
}

function SecurityCard({ title, desc, enabled, children }: { title: string; desc: string; enabled?: boolean; children?: React.ReactNode }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-[#00C48C]" />
            <p className="text-sm font-medium text-gray-800">{title}</p>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
        </div>
        {enabled !== undefined && (
          <div className={`w-9 h-5 rounded-full relative flex-shrink-0 ${enabled ? 'bg-[#00C48C]' : 'bg-gray-200'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`} />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function SecuritySubItem({ label, desc, badge }: { label: string; desc: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
      <div>
        <p className="text-xs font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      {badge ? (
        <span className="text-xs text-[#00C48C] bg-[#00C48C]/10 px-2 py-0.5 rounded-full flex-shrink-0">{badge}</span>
      ) : (
        <span className="text-gray-400 text-xs">›</span>
      )}
    </div>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <div className="flex-shrink-0 flex items-center">{children}</div>
    </div>
  );
}

// 带悬浮提示的设置行
function SettingRowTip({
  label, desc, tooltip, tips, children
}: {
  label: string; desc: string; tooltip: string; tips?: string[]; children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <Tooltip text={tooltip} tips={tips} />
        </div>
        {desc && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <div className="flex-shrink-0 flex items-center">{children}</div>
    </div>
  );
}

function WbToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-9 h-5 rounded-full relative transition-colors ${checked ? 'bg-[#00C48C]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  );
}

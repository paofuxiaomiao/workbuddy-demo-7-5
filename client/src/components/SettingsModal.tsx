// WorkBuddy 设置弹窗组件 - 还原真实设置界面
// 包含系统设置、记忆、个性化、安全中心等子页面

import { useState } from 'react';
import { X, User, Settings, Brain, Cpu, Sliders, Palette, Database, Shield, HelpCircle, Info, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { FeatureInfo } from '@/data/features';

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

  const handleNavClick = (id: string) => {
    setActiveTab(id);
  };

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
      <TeachingBanner
        icon={<Settings size={14} />}
        color="#6B7280"
        title="系统设置 — 新手必改的 3 项"
        desc="系统设置控制 WorkBuddy 的基础行为。新手建议第一次打开后立即完成以下配置，否则后续使用可能遇到文件找不到、技能过期、电脑休眠等问题。"
        tips={[
          '「默认工作空间路径」：强烈建议改为 D:/WorkBuddy/，避免文件散落在系统盘',
          '「技能自动更新」：建议开启，已安装的技能会自动升级到最新版本',
          '「锁屏远程」：如果你需要远程下任务或设置自动化，必须开启，否则电脑休眠后任务会中断',
          '「发送消息」快捷键：默认 Enter 直接发送，如果你习惯换行，可以改为 Ctrl+Enter',
        ]}
      />
      <SettingRow label="显示语言" desc="设置应用程序界面的显示语言。">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option>中文(简体)</option>
          <option>English</option>
        </select>
      </SettingRow>

      <SettingRow label="字体大小" desc="">
        <div className="w-full">
          <input type="range" className="w-full accent-gray-800" min={0} max={100} defaultValue={30} />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>小</span><span>默认</span><span>大</span>
          </div>
        </div>
      </SettingRow>

      <SettingRow label="简洁模式" desc="开启后将简化对话界面显示，隐藏部分装饰性元素。">
        <WbToggle checked={simplMode} onChange={setSimplMode} />
      </SettingRow>

      <SettingRow label="发送消息" desc="设置聊天输入框中发送消息的快捷键。">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option>Enter</option>
          <option>Ctrl+Enter</option>
        </select>
      </SettingRow>

      <div className="cursor-pointer" onClick={handleSettingsInfo}>
        <SettingRow label="技能自动更新" desc="开启后将自动更新已安装的技能为最新版本，不会更新你在 WorkBuddy 中编辑过的技能">
          <WbToggle checked={autoUpdate} onChange={setAutoUpdate} />
        </SettingRow>
      </div>

      <SettingRow label="非高风险技能自动安装" desc="上传技能后仍会显示安全检测过程：检测结果为非高风险时自动继续安装，高风险始终需要手动确认。">
        <WbToggle checked={autoInstall} onChange={setAutoInstall} />
      </SettingRow>

      <div className="cursor-pointer" onClick={handleSettingsInfo}>
        <SettingRow label="锁屏远程" desc="开启后即使在锁屏状态下，电脑也不会进入休眠、屏幕也不会自动关闭，方便通过手机远程操控和保持自动化任务持续进行。">
          <WbToggle checked={lockScreen} onChange={setLockScreen} />
        </SettingRow>
      </div>

      <SettingRow label="默认工作空间存储路径" desc="新建任务、工作空间时将自动存放在该路径下。修改后不影响已有数据。">
        <button className="text-sm text-[#00C48C] hover:underline">选择路径</button>
      </SettingRow>
    </div>
  );
}

function MemorySettings() {
  const [memOn, setMemOn] = useState(true);
  return (
    <div className="space-y-5">
      <TeachingBanner
        icon={<Brain size={14} />}
        color="#8B5CF6"
        title="记忆 — 让 AI 越用越懂你"
        desc="记忆功能让 WorkBuddy 从你们的对话中提取并记住你的偏好、工作背景和习惯规则。对话越多，AI 就越了解你，回答也越个性化。记忆内容仅本人可见。"
        tips={[
          '建议开启「生成对话记忆」，AI 会自动从对话中提取关键信息',
          '记忆不是越多越好——长期稳定的工作习惯放进记忆，短期任务要求直接写在当前任务里',
          '新手可以先写 5 条基础记忆：先列计划再执行、不编造数据、不覆盖原文件、总结先给结论、标清保存路径',
          '如果之前用过 ChatGPT 等工具，可以点「导入」把那边的记忆迁移过来',
        ]}
      />

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">记忆</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          记忆让 WorkBuddy 记住你的偏好和习惯，对话越多，它就越懂你。记忆内容遵循{' '}
          <span className="text-[#00C48C] cursor-pointer">WorkBuddy 隐私政策</span>，仅本人可见。
        </p>
      </div>
      <SettingRow label="生成对话记忆" desc="允许 WorkBuddy 从对话中提取并记住相关上下文，以便在未来对话中提供更连贯、个性化的回应。">
        <WbToggle checked={memOn} onChange={setMemOn} />
      </SettingRow>
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
      <SettingRow label="从其他AI导入记忆" desc="一键同步你在其他AI上的使用习惯。">
        <button className="text-sm text-[#00C48C] hover:underline font-medium">导入</button>
      </SettingRow>
    </div>
  );
}

function PersonalSettings() {
  const [welcomeOn, setWelcomeOn] = useState(true);
  const [text, setText] = useState('');
  return (
    <div className="space-y-5">
      <TeachingBanner
        icon={<Palette size={14} />}
        color="#EC4899"
        title="个性化 — 定制你的专属 AI 助理"
        desc="个性化设置让你可以设置 AI 的回复风格和自定义指令。自定义指令是最高优先级的行为规则，AI 在所有对话中都会遵循。"
        tips={[
          '「基本风格和语调」：选择正式/默认/轻松，影响 AI 的回复措辞风格',
          '「自定义指令」：这是最重要的设置！把你的工作背景、偏好规则写在这里，AI 每次都会参考',
          '自定义指令示例：「我是小学教师，处理文件时先列计划再执行，不要编造数据，总结时先给结论」',
          '指令不要超过 500 字，太长会让 AI 分散注意力，只写最重要的规则',
        ]}
      />
      <h3 className="text-base font-semibold text-gray-900">个性化</h3>
      <SettingRow label="基本风格和语调" desc="设置 AI 助手回复你的风格和语调。这不会影响 AI 助手的功能。">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option>默认</option>
          <option>正式</option>
          <option>轻松</option>
        </select>
      </SettingRow>
      <SettingRow label="加载过程欢迎语" desc="在 AI 生成等待过程中展示辅助提示。关闭后可在这里重新打开。">
        <WbToggle checked={welcomeOn} onChange={setWelcomeOn} />
      </SettingRow>
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
      <TeachingBanner
        icon={<Shield size={14} />}
        color="#EF4444"
        title="安全中心 — 控制 AI 的操作边界"
        desc="安全中心统一管理 AI 的操作权限范围。新手建议保持默认配置，等熟悉 WorkBuddy 后再根据需要调整。"
        tips={[
          '「沙箱安全」：AI 在隔离的安全工作区内操作，即使出错也不会影响整台电脑',
          '「文件安全」：可以设置哪些文件夹 AI 可以访问，哪些不能碰——保护重要文件的关键',
          '「命令安全」：控制 AI 能执行哪些系统命令，新手保持默认即可',
          '「数据安全」：本地与云端通信使用端到端加密，数据传输有安全保障',
          '「内置运行时」：允许使用 Node.js、Python 等工具，开发类任务需要开启',
        ]}
      />
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
      <TeachingBanner
        icon={<User size={14} />}
        color="#00C48C"
        title="账户管理 — 积分与版本说明"
        desc="账户管理页面显示你的账户信息、版本类型和积分余额。积分是 WorkBuddy 的使用货币，不同模型消耗不同数量的积分。"
        tips={[
          '体验版：免费使用，有每日积分限额，适合入门体验',
          '个人专业版（约 58元/月）：积分更多，适合日常重度使用',
          '每天在「Buddy 加油站」领取免费积分（100通用积分/天），坚持打卡积分更多',
          '积分不够用时，可以在账户页面充值或升级版本',
        ]}
      />
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
      <TeachingBanner
        icon={<Brain size={14} />}
        color="#6366F1"
        title="智能体设置 — AI 行为方式配置"
        desc="智能体设置控制 AI 在执行任务时的行为模式，影响输出质量和执行效率。新手保持默认即可，熟悉后可根据需要调整。"
        tips={[
          '「自动思考模式」：开启后 AI 在执行复杂任务前会先进行内部推理，输出质量更高，但速度稍慢',
          '「流式输出」：开启后 AI 回复逐字显示，关闭则等待完整回复后一次性展示',
          '「长上下文优化」：对话很长时自动压缩历史记录，保持 AI 理解准确性——建议开启',
          '「最大执行步数」：单次任务 AI 最多执行的操作步数，超出后会暂停询问是否继续',
        ]}
      />
      <p className="text-xs text-gray-500 leading-relaxed">配置 AI 智能体的行为方式，影响任务执行的效率与质量。</p>
      <SettingRow label="自动思考模式" desc="开启后 AI 在执行复杂任务前会先进行内部推理，提升输出质量。">
        <WbToggle checked={autoThink} onChange={setAutoThink} />
      </SettingRow>
      <SettingRow label="流式输出" desc="开启后 AI 回复内容逐字显示，关闭则等待完整回复后一次性展示。">
        <WbToggle checked={streamOutput} onChange={setStreamOutput} />
      </SettingRow>
      <SettingRow label="长上下文优化" desc="任务对话过长时自动压缩历史上下文，保持 AI 理解准确性。">
        <WbToggle checked={contextLen} onChange={setContextLen} />
      </SettingRow>
      <SettingRow label="最大执行步数" desc="单次任务 AI 最多可执行的操作步数，超出后会暂停并询问是否继续。">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option>20 步</option>
          <option>50 步</option>
          <option>100 步</option>
          <option>不限制</option>
        </select>
      </SettingRow>
    </div>
  );
}

function ModelSettings() {
  const models = [
    { name: 'DeepSeek V4 Pro', provider: 'DeepSeek', tag: '推荐', desc: '综合能力强，适合大多数场景', cost: '低' },
    { name: '腾讯混元 Turbo', provider: '腾讯', tag: '', desc: '腾讯自研，中文理解出色', cost: '低' },
    { name: 'Kimi k2', provider: 'Moonshot', tag: '', desc: '长文本处理能力强', cost: '中' },
    { name: 'GLM-4 Plus', provider: '智谱AI', tag: '', desc: '代码与推理能力均衡', cost: '中' },
    { name: 'MiniMax Text-01', provider: 'MiniMax', tag: '', desc: '多模态能力，支持图像理解', cost: '中' },
  ];
  return (
    <div className="space-y-4">
      <TeachingBanner
        icon={<Sliders size={14} />}
        color="#F59E0B"
        title="模型 — 选择 AI 的大脑"
        desc="模型是 WorkBuddy 背后的「大脑」，不同模型在写作、表格、代码等任务上表现不同，积分消耗也不同。新手不要纠结，先用推荐模型跑通任务再说。"
        tips={[
          '新手无脑选 DeepSeek V4 Pro：综合能力强、积分消耗低，适合绝大多数场景',
          '长文档处理（PDF/Word 超过 50 页）：推荐 Kimi k2，长文本理解更好',
          '代码开发任务：推荐 GLM-4 Plus 或 DeepSeek V4 Pro',
          '如果你有自己的 API Key，可以点「添加自定义模型」接入任何兼容 OpenAI 协议的模型',
          '不同模型积分消耗不同，任务复杂时选高能力模型，简单任务用低消耗模型节省积分',
        ]}
      />
      <p className="text-xs text-gray-500 leading-relaxed">选择 AI 对话使用的默认大模型。不同模型能力各有侧重，积分消耗也不同。</p>
      <div className="space-y-2">
        {models.map((m, i) => (
          <div key={m.name} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${i === 0 ? 'border-[#00C48C] bg-[#00C48C]/5' : 'border-gray-100 hover:border-gray-200'}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${i === 0 ? 'border-[#00C48C]' : 'border-gray-300'}`}>
              {i === 0 && <div className="w-2 h-2 rounded-full bg-[#00C48C]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{m.name}</span>
                {m.tag && <span className="text-xs bg-[#00C48C]/15 text-[#00C48C] px-1.5 rounded">{m.tag}</span>}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{m.provider} · {m.desc}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${m.cost === '低' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>积分消耗{m.cost}</span>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-gray-100">
        <button className="flex items-center gap-2 text-sm text-[#00C48C] hover:underline">
          <span>+</span> 添加自定义模型（接入自己的 API Key）
        </button>
      </div>
    </div>
  );
}

function BuddySettings() {
  const [voiceOn, setVoiceOn] = useState(false);
  const [proactiveOn, setProactiveOn] = useState(true);
  return (
    <div className="space-y-5">
      <TeachingBanner
        icon={<User size={14} />}
        color="#14B8A6"
        title="小扶设置 — 配置你的 AI 助理助手"
        desc="小扶是 WorkBuddy 的内置助理角色，可以通过语音、主动建议等方式辅助你使用 WorkBuddy。"
        tips={[
          '「主动建议」：建议开启，AI 完成任务后会主动提供下一步操作建议',
          '「语音回复」：适合免手操作场景，如开车时用语音控制 WorkBuddy',
          '「唤醒词」：设置后可以直接说出唤醒词开始语音对话，默认为"小扶小扶"',
        ]}
      />
      <p className="text-xs text-gray-500 leading-relaxed">配置 WorkBuddy 小扶助理的行为与交互方式。</p>
      <SettingRow label="语音回复" desc="开启后 AI 回复内容将同时以语音播报，适合免手操作场景。">
        <WbToggle checked={voiceOn} onChange={setVoiceOn} />
      </SettingRow>
      <SettingRow label="主动建议" desc="AI 在完成任务后会主动提供下一步操作建议，帮助你更高效地推进工作。">
        <WbToggle checked={proactiveOn} onChange={setProactiveOn} />
      </SettingRow>
      <SettingRow label="小扶唤醒词" desc="设置语音唤醒词，说出唤醒词后可直接开始语音对话。">
        <input className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-32 outline-none focus:border-[#00C48C]" defaultValue="小扶小扶" />
      </SettingRow>
    </div>
  );
}

function DataSettings() {
  return (
    <div className="space-y-5">
      <TeachingBanner
        icon={<Database size={14} />}
        color="#6366F1"
        title="数据管理 — 缓存清理与云端同步"
        desc="数据管理页面帮助你管理 WorkBuddy 占用的本地存储空间，以及配置云端同步功能。"
        tips={[
          '如果 C 盘空间不足，可以在这里清理「任务文件」缓存（AI 生成的中间文件）',
          '「对话记录」缓存清除后，历史对话内容将无法恢复，谨慎操作',
          '「云端同步」建议开启，换电脑后可以恢复对话记录和设置',
          '定期清理「技能缓存」可以解决部分技能运行异常的问题',
        ]}
      />
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
      <SettingRow label="云端同步" desc="将对话记录和设置同步到云端，换设备后可恢复。">
        <WbToggle checked={true} onChange={() => {}} />
      </SettingRow>
    </div>
  );
}

function HelpSettings() {
  return (
    <div className="space-y-4">
      <TeachingBanner
        icon={<HelpCircle size={14} />}
        color="#00C48C"
        title="帮助与反馈 — 遇到问题先看这里"
        desc="遇到问题不要慌，90% 的新手问题都有现成答案。建议按以下顺序查找解决方案。"
        tips={[
          '第一步：查看「新手入门指南」，大多数常见问题都有详细说明',
          '第二步：看「视频教程」，手把手演示比文字更直观',
          '第三步：去「用户社区」搜索，很可能已经有人遇到并解决了同样的问题',
          '常见问题：文件找不到（检查路径是否用绝对路径）、任务中断（检查锁屏远程是否开启）',
        ]}
      />
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
// 教学说明横幅组件
function TeachingBanner({
  icon, color, title, desc, tips
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  tips: string[];
}) {
  return (
    <div className="mb-5 rounded-xl overflow-hidden border" style={{ borderColor: color + '30' }}>
      {/* 顶部标题栏 */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: color + '12' }}>
        <span style={{ color }}>{icon}</span>
        <span className="text-sm font-semibold" style={{ color }}>{title}</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-white" style={{ background: color }}>新手必读</span>
      </div>
      {/* 描述 */}
      <div className="px-4 py-3 bg-white border-t" style={{ borderColor: color + '20' }}>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">{desc}</p>
        <div className="space-y-1.5">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color }} />
              <span className="text-xs text-gray-600 leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

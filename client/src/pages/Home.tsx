// WorkBuddy 功能演示主页面 v3
// 设计：高保真还原 WorkBuddy 桌面客户端界面
// 交互：
//   - 功能介绍改为右侧侧边抽屉（不遮挡主界面）
//   - 新增对话模拟、桌面整理模拟、工作空间选择模拟

import { useState, useRef, useEffect } from 'react';
import {
  Plus, Search, Filter, Bell, Settings, ChevronDown, ChevronRight,
  Mic, Send, Paperclip, Sparkles, Zap, Github, Shield, Folder,
  Users, Bot, Layers, MoreHorizontal, MessageSquare, MonitorPlay, BookOpen
} from 'lucide-react';
import GuidePage from '@/components/GuidePage';
import FeatureDrawer from '@/components/FeatureDrawer';
import SettingsModal from '@/components/SettingsModal';
import ExpertPanel from '@/components/ExpertPanel';
import ProjectPanel from '@/components/ProjectPanel';
import AutomationPanel from '@/components/AutomationPanel';
import ChatSimulator from '@/components/ChatSimulator';
import DesktopTaskSimulator from '@/components/DesktopTaskSimulator';
import WorkspaceModal from '@/components/WorkspaceModal';
import { features, type FeatureInfo } from '@/data/features';

type MainView = 'home' | 'expert' | 'project' | 'automation';

const taskList = [
  { name: '制作WorkBuddy产品介绍视频', time: '2天前' },
  { name: '继续之前的会话', time: '2天前' },
  { name: '帮我把github里的一个项目...', time: '23天前' },
  { name: '测试 Magazine Web PPT ...', time: '23天前' },
  { name: '根据补充资料生成腾讯云演...', time: '23天前' },
];

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<FeatureInfo | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showDesktopTask, setShowDesktopTask] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mainView, setMainView] = useState<MainView>('home');
  const [activeNav, setActiveNav] = useState('newTask');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showCraftMenu, setShowCraftMenu] = useState(false);
  const [taskExpanded, setTaskExpanded] = useState(true);
  const [spaceExpanded, setSpaceExpanded] = useState(true);
  const [inputText, setInputText] = useState('');
  const [activeScene, setActiveScene] = useState('daily');
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const craftMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const openFeature = (id: string) => {
    if (features[id]) setActiveFeature(features[id]);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (craftMenuRef.current && !craftMenuRef.current.contains(e.target as Node)) setShowCraftMenu(false);
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) setShowMoreMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'newTask') { setMainView('home'); }
    else if (nav === 'assistant') { setMainView('home'); openFeature('assistant'); }
    else if (nav === 'project') { setMainView('project'); }
    else if (nav === 'expert') { setMainView('expert'); }
    else if (nav === 'automation') { setMainView('automation'); }
    else if (nav === 'more') { setShowMoreMenu(!showMoreMenu); }
  };

  // 发送消息时打开对话模拟
  const handleSend = () => {
    if (inputText.trim()) {
      setShowChat(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white select-none">
      {/* ===== 左侧导航栏 ===== */}
      <div className="wb-sidebar flex-shrink-0 relative">
        {/* macOS 窗口控制 */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200/60">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <button className="hover:text-gray-600 p-1 rounded"><Layers size={13} /></button>
            <button className="hover:text-gray-600 p-1 rounded"><Search size={13} /></button>
            <button className="hover:text-gray-600 p-1 rounded"><Filter size={13} /></button>
          </div>
        </div>

        <div className="px-4 py-1.5">
          <span className="text-xs text-gray-400">WorkBuddy v5.1.7</span>
        </div>

        {/* 主导航 */}
        <nav className="px-2 space-y-0.5">
          <NavItem icon={<Plus size={14} />} label="新建任务" active={activeNav === 'newTask'}
            onClick={() => handleNavClick('newTask')} featureId="newTask" onFeatureClick={openFeature} />
          <NavItem icon={<Bot size={14} />} label="助理" active={activeNav === 'assistant'}
            onClick={() => handleNavClick('assistant')} featureId="assistant" onFeatureClick={openFeature} />
          <NavItem icon={<Folder size={14} />} label="项目" active={activeNav === 'project'}
            onClick={() => handleNavClick('project')} featureId="project" onFeatureClick={openFeature} />
          <NavItem icon={<Users size={14} />} label="专家" active={activeNav === 'expert'}
            onClick={() => handleNavClick('expert')} featureId="expert" onFeatureClick={openFeature}
            rightText="技能·连接器" />
          <NavItem icon={<Zap size={14} />} label="自动化" active={activeNav === 'automation'}
            onClick={() => handleNavClick('automation')} featureId="automation" onFeatureClick={openFeature} />
          <div className="relative" ref={moreMenuRef}>
            <NavItem icon={<MoreHorizontal size={14} />} label="更多" active={activeNav === 'more'}
              onClick={() => { setActiveNav('more'); setShowMoreMenu(!showMoreMenu); }}
              featureId="more" onFeatureClick={openFeature} rightText="资料库·灵感" />
            {showMoreMenu && (
              <div className="absolute left-full top-0 ml-1 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2 w-40"
                style={{ animation: 'popIn 0.15s ease forwards' }}>
                {[
                  { icon: '📁', label: '我的文件' },
                  { icon: '📄', label: '腾讯文档' },
                  { icon: '🐼', label: 'ima知识库' },
                  { icon: '🎯', label: '乐享知识库' },
                  { icon: '💡', label: '灵感' },
                ].map(item => (
                  <button key={item.label}
                    onClick={() => { setShowMoreMenu(false); openFeature('more'); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <span>{item.icon}</span>{item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* 任务列表 */}
        <div className="mt-3 px-2">
          <button className="wb-interactive flex items-center gap-1 px-2 py-1 w-full text-left"
            onClick={() => { setTaskExpanded(!taskExpanded); openFeature('taskList'); }}>
            <span className="text-xs font-medium text-gray-500">任务 (16)</span>
            {taskExpanded ? <ChevronDown size={11} className="text-gray-400" /> : <ChevronRight size={11} className="text-gray-400" />}
          </button>
          {taskExpanded && (
            <div className="mt-0.5 space-y-0.5">
              {taskList.map((task, i) => (
                <button key={i} onClick={() => { setShowChat(true); }}
                  className="wb-interactive flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-gray-200/60">
                  <span className="text-xs text-gray-700 truncate flex-1 text-left">{task.name}</span>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{task.time}</span>
                </button>
              ))}
              <button className="text-xs text-gray-400 px-2 py-1 hover:text-gray-600">查看更多 (11)</button>
            </div>
          )}
        </div>

        {/* 空间列表 */}
        <div className="mt-2 px-2">
          <button className="wb-interactive flex items-center gap-1 px-2 py-1 w-full text-left"
            onClick={() => { setSpaceExpanded(!spaceExpanded); openFeature('spaceList'); }}>
            <span className="text-xs font-medium text-gray-500">空间 (1)</span>
            {spaceExpanded ? <ChevronDown size={11} className="text-gray-400" /> : <ChevronRight size={11} className="text-gray-400" />}
          </button>
          {spaceExpanded && (
            <div className="mt-0.5 space-y-0.5">
              <div onClick={() => openFeature('spaceList')}
                className="wb-interactive flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-200/60">
                <div className="w-4 h-4 rounded-full bg-[#00C48C]/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#00C48C]" />
                </div>
                <span className="text-xs text-gray-700 flex-1">项目新手指引</span>
                <ChevronDown size={11} className="text-gray-400" />
              </div>
              <div onClick={() => openFeature('spaceList')}
                className="wb-interactive flex items-center justify-between px-6 py-1 cursor-pointer hover:bg-gray-200/60 rounded-lg">
                <span className="text-xs text-gray-600">生成项目功能介绍</span>
                <span className="text-xs text-gray-400">20天前</span>
              </div>
            </div>
          )}
        </div>

        {/* 底部用户区 */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200/60 bg-[#F5F5F5]">
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setShowUserMenu(!showUserMenu)}
              className="wb-interactive flex items-center gap-2 w-full px-3 py-3">
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-[#00C48C] flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="text-sm font-medium text-gray-700 flex-1 text-left">Avec moi</span>
              <Bell size={13} className="text-gray-400" />
              <Settings size={13} className="text-gray-400" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); setShowSettings(true); }} />
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-100 rounded-xl shadow-xl z-30 overflow-hidden"
                style={{ animation: 'popIn 0.15s ease forwards' }}>
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">Avec moi</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">体验版</span>
                </div>
                {/* Buddy 加油站 */}
                <div className="mx-3 my-2 rounded-xl bg-[#00C48C]/10 border border-[#00C48C]/20 p-3 cursor-pointer"
                  onClick={() => { setShowUserMenu(false); openFeature('growthPlan'); }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>🎁</span>
                    <span className="text-xs font-semibold text-gray-800">Buddy 加油站</span>
                    <span className="text-xs bg-[#00C48C] text-white px-1.5 rounded">3期</span>
                  </div>
                  <p className="text-xs text-gray-500">每日可领 <strong>100</strong> 通用积分 · 已领 1 天</p>
                  <button className="mt-2 w-full py-1.5 bg-gray-700 text-white text-xs rounded-lg">领取中...</button>
                </div>
                <div className="py-1">
                  {[
                    { icon: '💎', label: '积分余额', right: '3,529.95 ›', fn: () => openFeature('growthPlan') },
                    { icon: '📈', label: '成长计划', right: '领取Buddy赚积分 ›', fn: () => openFeature('growthPlan') },
                    { icon: '⚙️', label: '设置', right: '', fn: () => { setShowUserMenu(false); setShowSettings(true); } },
                    { icon: '🎨', label: '外观', right: '', fn: () => openFeature('settings') },
                    { icon: '❓', label: '帮助与反馈', right: '', fn: () => {} },
                  ].map(item => (
                    <button key={item.label} onClick={() => { setShowUserMenu(false); item.fn(); }}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <div className="flex items-center gap-2.5"><span>{item.icon}</span>{item.label}</div>
                      {item.right && <span className="text-xs text-gray-400">{item.right}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== 主内容区 ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-100 flex-shrink-0">
          <div />
          <button onClick={() => openFeature('growthPlan')}
            className="wb-interactive flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100">
            <div className="w-5 h-5 rounded-full bg-[#00C48C] flex items-center justify-center">
              <Sparkles size={10} className="text-white" />
            </div>
            <span className="text-sm text-gray-700">来成长计划赚积分</span>
            <ChevronRight size={13} className="text-gray-400" />
          </button>
        </div>

        {/* 视图切换 */}
        {mainView === 'expert' ? (
          <ExpertPanel onFeatureClick={setActiveFeature} />
        ) : mainView === 'project' ? (
          <ProjectPanel onFeatureClick={setActiveFeature} />
        ) : mainView === 'automation' ? (
          <AutomationPanel onFeatureClick={setActiveFeature} />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* 欢迎横幅 */}
            {showWelcome && (
              <div className="mx-6 mt-4 bg-gradient-to-r from-[#00C48C]/10 to-[#6366F1]/10 border border-[#00C48C]/20 rounded-xl px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">👋</span>
                  <p className="text-sm text-gray-700">
                    <strong>欢迎体验 WorkBuddy 演示！</strong> 悬停任意功能区域查看介绍，点击下方按钮体验真实交互模拟。
                  </p>
                </div>
                <button onClick={() => setShowWelcome(false)} className="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0 text-sm">✕</button>
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-4 overflow-y-auto">
              {/* 标题 */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">WorkBuddy</h1>
                <h2 className="text-3xl font-bold text-gray-900">你的职场超能力</h2>

                {/* 场景切换 */}
                <div className="wb-interactive flex items-center gap-1 mt-5 bg-gray-100 rounded-full p-1 inline-flex"
                  onClick={() => openFeature('sceneTabs')}>
                  {[
                    { id: 'daily', label: '日常办公', icon: '☕' },
                    { id: 'code', label: '代码开发', icon: '💻' },
                    { id: 'design', label: '设计创意', icon: '🎨' },
                  ].map(scene => (
                    <button key={scene.id}
                      onClick={(e) => { e.stopPropagation(); setActiveScene(scene.id); openFeature('sceneTabs'); }}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeScene === scene.id ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      <span>{scene.icon}</span>{scene.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 快捷模板 */}
              <div className="flex items-center gap-2 mb-4 flex-wrap justify-center">
                {[
                  { icon: '📄', label: '文档处理' },
                  { icon: '💰', label: '金融服务' },
                  { icon: '🎓', label: '高考我帮你' },
                  { icon: '···', label: '更多' },
                ].map(t => (
                  <button key={t.label}
                    onClick={() => openFeature('quickTemplates')}
                    className="wb-interactive flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-[#00C48C]/40 hover:bg-[#00C48C]/5 transition-all">
                    <span className="text-xs">{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>

              {/* 对话输入框 */}
              <div className="wb-interactive w-full max-w-2xl border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                onClick={() => openFeature('inputBox')}>
                <div className="px-4 pt-3 pb-2">
                  <textarea
                    className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent leading-relaxed"
                    placeholder="今天帮你做些什么？@ 引用对话文件，/ 调用技能与指令"
                    rows={3}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  />
                </div>

                {/* 工具栏 */}
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
                  <div className="flex items-center gap-0.5">
                    {/* Craft 模式 */}
                    <div className="relative" ref={craftMenuRef}>
                      <button onClick={(e) => { e.stopPropagation(); setShowCraftMenu(!showCraftMenu); }}
                        className="wb-interactive flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100">
                        <Sparkles size={11} className="text-[#00C48C]" />
                        <span>Craft</span>
                        <ChevronDown size={10} />
                      </button>
                      {showCraftMenu && (
                        <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-1.5 w-40"
                          style={{ animation: 'popIn 0.15s ease forwards' }}>
                          {[
                            { id: 'craftMode', label: 'Craft', icon: '⚙️', checked: true },
                            { id: 'askMode', label: 'Ask', icon: '💬', checked: false },
                            { id: 'planMode', label: 'Plan', icon: '📋', checked: false },
                            { id: 'expert', label: '召唤专家', icon: '👥', checked: false, arrow: true },
                          ].map(item => (
                            <button key={item.id}
                              onClick={(e) => { e.stopPropagation(); setShowCraftMenu(false); openFeature(item.id); }}
                              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <div className="flex items-center gap-2"><span className="text-xs">{item.icon}</span><span>{item.label}</span></div>
                              <div className="flex items-center gap-1">
                                {item.checked && <span className="text-[#00C48C] text-xs">✓</span>}
                                {item.arrow && <ChevronRight size={11} className="text-gray-400" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); openFeature('automation'); }}
                      className="wb-interactive flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100">
                      <Zap size={11} /><span>自动</span><ChevronDown size={10} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openFeature('skills'); }}
                      className="wb-interactive flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100">
                      <Layers size={11} /><span>技能</span><ChevronDown size={10} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openFeature('github'); }}
                      className="wb-interactive p-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
                      <Github size={13} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openFeature('permission'); }}
                      className="wb-interactive flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100">
                      <Shield size={11} /><span>默认权限</span><ChevronDown size={10} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button onClick={(e) => { e.stopPropagation(); openFeature('inputBox'); }}
                      className="wb-interactive p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Plus size={15} /></button>
                    <button onClick={(e) => { e.stopPropagation(); openFeature('inputBox'); }}
                      className="wb-interactive p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Sparkles size={15} /></button>
                    <button onClick={(e) => { e.stopPropagation(); openFeature('inputBox'); }}
                      className="wb-interactive p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Mic size={15} /></button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSend(); }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${inputText.trim() ? 'bg-[#00C48C]' : 'bg-gray-200'}`}>
                      <Send size={13} className={inputText.trim() ? 'text-white' : 'text-gray-400'} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 工作空间选择 */}
              <div className="w-full max-w-2xl mt-2">
                <button
                  onClick={() => setShowWorkspace(true)}
                  className="wb-interactive flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">
                  <Folder size={13} />
                  <span>{selectedWorkspace ? `工作空间：${selectedWorkspace}` : '选择工作空间'}</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* ===== 三个模拟体验入口 ===== */}
              <div className="w-full max-w-2xl mt-5 grid grid-cols-3 gap-3">
                {/* 功能指南入口 */}
                <div className="col-span-3 mb-1">
                  <button
                    onClick={() => setShowGuide(true)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-950 text-white rounded-xl hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className="text-[#00C48C]" />
                      <div className="text-left">
                        <p className="text-sm font-semibold">WorkBuddy 功能指南</p>
                        <p className="text-xs text-gray-400">8章节 · 20+名词解释 · 提示词模板 · 操作检查清单</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
                <button
                  onClick={() => setShowChat(true)}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-[#00C48C]/50 hover:bg-[#00C48C]/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00C48C]/10 flex items-center justify-center group-hover:bg-[#00C48C]/20 transition-colors">
                    <MessageSquare size={18} className="text-[#00C48C]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-800">体验对话</p>
                    <p className="text-xs text-gray-500 mt-0.5">模拟真实 AI 对话</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowDesktopTask(true)}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-[#6366F1]/50 hover:bg-[#6366F1]/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center group-hover:bg-[#6366F1]/20 transition-colors">
                    <MonitorPlay size={18} className="text-[#6366F1]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-800">任务执行</p>
                    <p className="text-xs text-gray-500 mt-0.5">桌面整理模拟</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowWorkspace(true)}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-[#F59E0B]/50 hover:bg-[#F59E0B]/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center group-hover:bg-[#F59E0B]/20 transition-colors">
                    <Folder size={18} className="text-[#F59E0B]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-800">工作空间</p>
                    <p className="text-xs text-gray-500 mt-0.5">选择文件目录</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== 侧边抽屉（功能介绍，不遮挡主界面）===== */}
      <FeatureDrawer feature={activeFeature} onClose={() => setActiveFeature(null)} />

      {/* ===== 全屏弹窗（设置、对话、任务、工作空间）===== */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onFeatureClick={(f) => { setShowSettings(false); setActiveFeature(f); }}
        />
      )}
      {showChat && <ChatSimulator onClose={() => setShowChat(false)} />}
      {showDesktopTask && <DesktopTaskSimulator onClose={() => setShowDesktopTask(false)} />}
      {showWorkspace && (
        <WorkspaceModal
          onClose={() => setShowWorkspace(false)}
          onSelect={(name) => setSelectedWorkspace(name)}
        />
      )}
      {showGuide && <GuidePage onClose={() => setShowGuide(false)} />}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function NavItem({
  icon, label, active, onClick, featureId, onFeatureClick, rightText
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  featureId: string;
  onFeatureClick: (id: string) => void;
  rightText?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`wb-interactive flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all ${
        active ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-200/60'
      }`}
    >
      <span className={active ? 'text-[#00C48C]' : 'text-gray-500'}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {rightText && <span className="text-xs text-gray-400">{rightText}</span>}
    </button>
  );
}

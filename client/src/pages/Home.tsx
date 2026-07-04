// WorkBuddy 功能演示主页面
// 设计：高保真还原 WorkBuddy 桌面客户端界面
// 交互：悬停显示绿色虚线边框 + 问号图标，点击弹出功能介绍弹窗

import { useState, useRef, useEffect } from 'react';
import {
  Plus, Search, Filter, Bell, Settings, ChevronDown, ChevronRight,
  Mic, Send, Paperclip, Sparkles, Zap, Github, Shield, Folder,
  Users, Bot, Layers, MoreHorizontal, Copy, LogOut, Sun, Moon,
  HelpCircle, RefreshCw
} from 'lucide-react';
import FeatureModal from '@/components/FeatureModal';
import SettingsModal from '@/components/SettingsModal';
import ExpertPanel from '@/components/ExpertPanel';
import ProjectPanel from '@/components/ProjectPanel';
import AutomationPanel from '@/components/AutomationPanel';
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mainView, setMainView] = useState<MainView>('home');
  const [activeNav, setActiveNav] = useState('newTask');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showCraftMenu, setShowCraftMenu] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [taskExpanded, setTaskExpanded] = useState(true);
  const [spaceExpanded, setSpaceExpanded] = useState(true);
  const [inputText, setInputText] = useState('');
  const [activeScene, setActiveScene] = useState('daily');
  const [showWelcome, setShowWelcome] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const craftMenuRef = useRef<HTMLDivElement>(null);
  const workspaceMenuRef = useRef<HTMLDivElement>(null);

  const openFeature = (id: string) => {
    if (features[id]) setActiveFeature(features[id]);
  };

  // 关闭下拉菜单
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (craftMenuRef.current && !craftMenuRef.current.contains(e.target as Node)) setShowCraftMenu(false);
      if (workspaceMenuRef.current && !workspaceMenuRef.current.contains(e.target as Node)) setShowWorkspaceMenu(false);
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

  return (
    <div className="flex h-screen overflow-hidden bg-white select-none">
      {/* ===== 左侧导航栏 ===== */}
      <div className="wb-sidebar flex-shrink-0 relative">
        {/* 顶部工具栏 */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200/60">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <button className="hover:text-gray-600 transition-colors p-1 rounded"><Layers size={14} /></button>
            <button className="hover:text-gray-600 transition-colors p-1 rounded"><Search size={14} /></button>
            <button className="hover:text-gray-600 transition-colors p-1 rounded"><Filter size={14} /></button>
          </div>
        </div>

        {/* 版本号 */}
        <div className="px-4 py-2">
          <span className="text-xs text-gray-400">WorkBuddy v5.1.7</span>
        </div>

        {/* 主导航 */}
        <nav className="px-2 space-y-0.5">
          <NavItem
            icon={<Plus size={15} />}
            label="新建任务"
            active={activeNav === 'newTask'}
            onClick={() => handleNavClick('newTask')}
            featureId="newTask"
            onFeatureClick={openFeature}
          />
          <NavItem
            icon={<Bot size={15} />}
            label="助理"
            active={activeNav === 'assistant'}
            onClick={() => handleNavClick('assistant')}
            featureId="assistant"
            onFeatureClick={openFeature}
          />
          <NavItem
            icon={<Folder size={15} />}
            label="项目"
            active={activeNav === 'project'}
            onClick={() => handleNavClick('project')}
            featureId="project"
            onFeatureClick={openFeature}
          />
          <div className="relative">
            <NavItem
              icon={<Users size={15} />}
              label="专家"
              active={activeNav === 'expert'}
              onClick={() => handleNavClick('expert')}
              featureId="expert"
              onFeatureClick={openFeature}
              rightText="技能·连接器"
            />
          </div>
          <NavItem
            icon={<Zap size={15} />}
            label="自动化"
            active={activeNav === 'automation'}
            onClick={() => handleNavClick('automation')}
            featureId="automation"
            onFeatureClick={openFeature}
          />
          <div className="relative" ref={workspaceMenuRef}>
            <NavItem
              icon={<MoreHorizontal size={15} />}
              label="更多"
              active={activeNav === 'more'}
              onClick={() => { setActiveNav('more'); setShowMoreMenu(!showMoreMenu); }}
              featureId="more"
              onFeatureClick={openFeature}
              rightText="资料库·灵感"
            />
            {showMoreMenu && (
              <div className="absolute left-full top-0 ml-1 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2 w-40"
                style={{ animation: 'modalIn 0.15s ease forwards' }}>
                {[
                  { icon: '📁', label: '我的文件' },
                  { icon: '📄', label: '腾讯文档' },
                  { icon: '🐼', label: 'ima知识库' },
                  { icon: '🎯', label: '乐享知识库' },
                  { icon: '💡', label: '灵感' },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => { setShowMoreMenu(false); openFeature('more'); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>{item.icon}</span>{item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* 任务列表 */}
        <div className="mt-4 px-2">
          <button
            className="wb-interactive flex items-center gap-1 px-2 py-1 w-full text-left"
            onClick={() => { setTaskExpanded(!taskExpanded); openFeature('taskList'); }}
          >
            <span className="text-xs font-medium text-gray-500">任务 (16)</span>
            {taskExpanded ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
          </button>
          {taskExpanded && (
            <div className="mt-1 space-y-0.5">
              {taskList.map((task, i) => (
                <button
                  key={i}
                  onClick={() => openFeature('taskList')}
                  className="wb-interactive flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-gray-200/60 transition-colors"
                >
                  <span className="text-xs text-gray-700 truncate flex-1 text-left">{task.name}</span>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{task.time}</span>
                </button>
              ))}
              <button className="text-xs text-gray-400 px-2 py-1 hover:text-gray-600">查看更多 (11)</button>
            </div>
          )}
        </div>

        {/* 空间列表 */}
        <div className="mt-3 px-2">
          <button
            className="wb-interactive flex items-center gap-1 px-2 py-1 w-full text-left"
            onClick={() => { setSpaceExpanded(!spaceExpanded); openFeature('spaceList'); }}
          >
            <span className="text-xs font-medium text-gray-500">空间 (1)</span>
            {spaceExpanded ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
          </button>
          {spaceExpanded && (
            <div className="mt-1 space-y-0.5">
              <div
                onClick={() => openFeature('spaceList')}
                className="wb-interactive flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-200/60"
              >
                <div className="w-4 h-4 rounded-full bg-[#00C48C]/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#00C48C]" />
                </div>
                <span className="text-xs text-gray-700">项目新手指引</span>
                <ChevronDown size={11} className="text-gray-400 ml-auto" />
              </div>
              <div
                onClick={() => openFeature('spaceList')}
                className="wb-interactive flex items-center justify-between px-6 py-1 cursor-pointer hover:bg-gray-200/60 rounded-lg"
              >
                <span className="text-xs text-gray-600">生成项目功能介绍</span>
                <span className="text-xs text-gray-400">20天前</span>
              </div>
            </div>
          )}
        </div>

        {/* 底部用户区 */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200/60 bg-[#F5F5F5]">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="wb-interactive flex items-center gap-2 w-full px-3 py-3"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src="/manus-storage/workbuddy-logo_9a1af63d.png" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium text-gray-700 flex-1 text-left">Avec moi</span>
              <Bell size={14} className="text-gray-400" />
              <Settings size={14} className="text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-100 rounded-xl shadow-xl z-30 overflow-hidden"
                style={{ animation: 'modalIn 0.15s ease forwards' }}>
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">Avec moi</span>
                    <Copy size={13} className="text-gray-400" />
                  </div>
                </div>
                <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-600">体验版</span>
                  <button className="px-3 py-1 bg-gray-800 text-white text-xs rounded-lg">升级</button>
                </div>
                {/* Buddy 加油站 */}
                <div
                  className="mx-3 my-2 rounded-xl bg-[#00C48C]/10 border border-[#00C48C]/20 p-3 cursor-pointer"
                  onClick={() => { setShowUserMenu(false); openFeature('growthPlan'); }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🎁</span>
                    <span className="text-xs font-semibold text-gray-800">Buddy 加油站</span>
                    <span className="text-xs bg-[#00C48C] text-white px-1.5 rounded">3期 7/15结束</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">本期：灵感</p>
                  <p className="text-xs text-gray-500">每日可领 <strong>100</strong> 通用积分</p>
                  <p className="text-xs text-gray-500">本期已领 1 天 · 累计 100 通用积分</p>
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 py-1.5 bg-gray-700 text-white text-xs rounded-lg">领取中...</button>
                    <button className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-lg">体验「灵感」</button>
                  </div>
                </div>
                <div className="py-1">
                  {[
                    { icon: '💎', label: '积分余额', right: '3,529.95 ›', onClick: () => openFeature('growthPlan') },
                    { icon: '📈', label: '成长计划', right: '领取Buddy赚积分 ›', onClick: () => openFeature('growthPlan') },
                    { icon: '⚙️', label: '设置', right: '', onClick: () => { setShowUserMenu(false); setShowSettings(true); } },
                    { icon: '🎨', label: '外观', right: '', onClick: () => openFeature('settings') },
                    { icon: '❓', label: '帮助与反馈', right: '', onClick: () => {} },
                    { icon: '🔄', label: '检查更新', right: '', onClick: () => {} },
                    { icon: '🚪', label: '退出登录', right: '', onClick: () => {} },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { setShowUserMenu(false); item.onClick(); }}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span>{item.icon}</span>{item.label}
                      </div>
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
          <button
            onClick={() => openFeature('growthPlan')}
            className="wb-interactive flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-[#00C48C] flex items-center justify-center">
              <Sparkles size={11} className="text-white" />
            </div>
            <span className="text-sm text-gray-700">来成长计划赚积分</span>
            <ChevronRight size={14} className="text-gray-400" />
          </button>
        </div>

        {/* 主视图切换 */}
        {mainView === 'expert' ? (
          <ExpertPanel onFeatureClick={setActiveFeature} />
        ) : mainView === 'project' ? (
          <ProjectPanel onFeatureClick={setActiveFeature} />
        ) : mainView === 'automation' ? (
          <AutomationPanel onFeatureClick={setActiveFeature} />
        ) : (
          /* ===== 主页（新建任务）===== */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 欢迎引导横幅 */}
            {showWelcome && (
              <div className="mx-6 mt-4 bg-gradient-to-r from-[#00C48C]/10 to-[#6366F1]/10 border border-[#00C48C]/20 rounded-xl px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👋</span>
                  <p className="text-sm text-gray-700">
                    <strong>欢迎体验 WorkBuddy 演示！</strong> 将鼠标悬停在任意功能区域，点击即可查看功能介绍。
                  </p>
                </div>
                <button onClick={() => setShowWelcome(false)} className="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0">✕</button>
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-4 overflow-y-auto">
              {/* 标题区 */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">WorkBuddy</h1>
                <h2 className="text-3xl font-bold text-gray-900">你的职场超能力</h2>

                {/* 场景切换 */}
                <div
                  className="wb-interactive flex items-center gap-1 mt-5 bg-gray-100 rounded-full p-1 inline-flex"
                  onClick={() => openFeature('sceneTabs')}
                >
                  {[
                    { id: 'daily', label: '日常办公', icon: '☕' },
                    { id: 'code', label: '代码开发', icon: '💻' },
                    { id: 'design', label: '设计创意', icon: '🎨' },
                  ].map(scene => (
                    <button
                      key={scene.id}
                      onClick={(e) => { e.stopPropagation(); setActiveScene(scene.id); openFeature('sceneTabs'); }}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        activeScene === scene.id
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span>{scene.icon}</span>{scene.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 快捷模板 */}
              <div
                className="flex items-center gap-2 mb-4 flex-wrap justify-center"
              >
                {[
                  { icon: '📄', label: '文档处理' },
                  { icon: '💰', label: '金融服务' },
                  { icon: '🎓', label: '高考我帮你' },
                  { icon: '···', label: '更多' },
                ].map(t => (
                  <button
                    key={t.label}
                    onClick={(e) => { e.stopPropagation(); openFeature('quickTemplates'); }}
                    className="wb-interactive flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-[#00C48C]/40 hover:bg-[#00C48C]/5 transition-all"
                  >
                    <span className="text-xs">{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>

              {/* 对话输入框 */}
              <div
                className="wb-interactive w-full max-w-2xl border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                onClick={() => openFeature('inputBox')}
              >
                {/* 输入区 */}
                <div className="px-4 pt-3 pb-2">
                  <textarea
                    className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent leading-relaxed"
                    placeholder="今天帮你做些什么？@ 引用对话文件，/ 调用技能与指令"
                    rows={3}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onClick={e => { e.stopPropagation(); openFeature('inputBox'); }}
                  />
                </div>

                {/* 工具栏 */}
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    {/* Craft 模式选择 */}
                    <div className="relative" ref={craftMenuRef}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowCraftMenu(!showCraftMenu); }}
                        className="wb-interactive flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Sparkles size={12} className="text-[#00C48C]" />
                        <span>Craft</span>
                        <ChevronDown size={11} />
                      </button>
                      {showCraftMenu && (
                        <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-1.5 w-40"
                          style={{ animation: 'modalIn 0.15s ease forwards' }}>
                          {[
                            { id: 'craftMode', label: 'Craft', icon: '⚙️', checked: true },
                            { id: 'askMode', label: 'Ask', icon: '💬', checked: false },
                            { id: 'planMode', label: 'Plan', icon: '📋', checked: false },
                            { id: 'expert', label: '召唤专家', icon: '👥', checked: false, arrow: true },
                          ].map(item => (
                            <button
                              key={item.id}
                              onClick={(e) => { e.stopPropagation(); setShowCraftMenu(false); openFeature(item.id); }}
                              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{item.icon}</span>
                                <span>{item.label}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {item.checked && <span className="text-[#00C48C] text-xs">✓</span>}
                                {item.arrow && <ChevronRight size={12} className="text-gray-400" />}
                                <HelpCircle size={11} className="text-gray-300" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); openFeature('automation'); }}
                      className="wb-interactive flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Zap size={12} />
                      <span>自动</span>
                      <ChevronDown size={11} />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); openFeature('skills'); }}
                      className="wb-interactive flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Layers size={12} />
                      <span>技能</span>
                      <ChevronDown size={11} />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); openFeature('github'); }}
                      className="wb-interactive p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      <Github size={14} />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); openFeature('permission'); }}
                      className="wb-interactive flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Shield size={12} />
                      <span>默认权限</span>
                      <ChevronDown size={11} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); openFeature('inputBox'); }}
                      className="wb-interactive p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openFeature('inputBox'); }}
                      className="wb-interactive p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      <Sparkles size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openFeature('inputBox'); }}
                      className="wb-interactive p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      <Mic size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openFeature('inputBox'); }}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Send size={14} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 工作空间选择 */}
              <div className="w-full max-w-2xl mt-2 relative" ref={workspaceMenuRef}>
                <button
                  onClick={() => { setShowWorkspaceMenu(!showWorkspaceMenu); openFeature('workspace'); }}
                  className="wb-interactive flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Folder size={13} />
                  <span>选择工作空间</span>
                  <ChevronRight size={13} />
                </button>
                {showWorkspaceMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2 w-72"
                    style={{ animation: 'modalIn 0.15s ease forwards' }}>
                    <div className="flex items-center gap-2 px-3 pb-2 border-b border-gray-100">
                      <Search size={13} className="text-gray-400" />
                      <input className="text-sm text-gray-600 outline-none flex-1" placeholder="搜索工作空间" />
                    </div>
                    <div className="py-1">
                      <button className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <span>从新工作空间开始</span>
                        <span className="text-[#00C48C] text-xs">✓</span>
                      </button>
                      <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Folder size={13} className="text-gray-400" />
                        <span>打开本地工作空间</span>
                      </button>
                      {['2026-07-03-01-39-42', '2026-07-03-00-09-51', '20260425132623', '2026-06-11-00-10-07'].map(ws => (
                        <button key={ws} className="flex flex-col w-full px-4 py-2 text-sm hover:bg-gray-50 text-left">
                          <span className="text-gray-700">{ws}</span>
                          <span className="text-xs text-gray-400">/Users/mojo/WorkBuddy/2026...</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 右下角机器猫吉祥物 */}
            <div className="absolute bottom-20 right-8 pointer-events-none">
              <div className="relative">
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#00C48C] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-lg border border-gray-200">
                  <img src="/manus-storage/workbuddy-logo_9a1af63d.png" alt="WorkBuddy" className="w-12 h-12 object-contain" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== 弹窗层 ===== */}
      <FeatureModal feature={activeFeature} onClose={() => setActiveFeature(null)} />
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onFeatureClick={(f) => { setShowSettings(false); setActiveFeature(f); }}
        />
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// 导航项组件
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
        active
          ? 'bg-white shadow-sm text-gray-900 font-medium'
          : 'text-gray-600 hover:bg-gray-200/60'
      }`}
    >
      <span className={active ? 'text-[#00C48C]' : 'text-gray-500'}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {rightText && <span className="text-xs text-gray-400">{rightText}</span>}
    </button>
  );
}

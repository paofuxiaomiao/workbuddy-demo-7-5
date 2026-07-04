// WorkBuddy 对话模拟组件
// 高保真还原真实对话界面：流式输出、Markdown渲染、预设问题、多Agent标签

import { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, Plus, Sparkles, ChevronDown, RotateCcw, Copy, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react';

// 名词词典（对话中使用）
const CHAT_GLOSSARY: Record<string, string> = {
  'Craft': 'Craft 模式：直接执行模式，AI 发送消息后立即开始干活，适合日常使用。',
  'Plan': 'Plan 模式：先列计划再执行，新手推荐。AI 会先展示步骤，你确认后才开始。',
  'Ask': 'Ask 模式：纯对话模式，AI 只回答问题不执行操作，积分消耗最少。',
  'Agent': 'Agent：能理解目标、自动拆步骤、调用工具执行的 AI 工作流角色。',
  'Markdown': 'Markdown：轻量文本格式，WorkBuddy 生成的报告通常是 .md 格式。',
  '工作空间': '工作空间：WorkBuddy 读写文件的专用文件夹，相当于 AI 的"办公桌"。',
  '提示词': '提示词：你发给 AI 的指令文本。六要素：文件路径+任务目标+步骤要求+输出格式+保存位置+执行边界。',
  '技能': '技能（Skills）：WorkBuddy 可安装的功能扩展包，市场上有 3200+ 技能可选。',
  '专家': '专家：已封装好的垂直领域 AI Agent，内置该领域的专业知识和工具。',
  '积分': '积分：WorkBuddy 的使用货币，每日可在"Buddy 加油站"领取免费积分。',
};

function detectTerms(text: string): string[] {
  return Object.keys(CHAT_GLOSSARY).filter(term => text.includes(term));
}


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentName?: string;
  agentAvatar?: string;
  agentColor?: string;
  status?: 'streaming' | 'done';
  subAgent?: string;
  terms?: string[];
}

const PRESET_QA: Array<{ q: string; a: string; agentName?: string; agentColor?: string; agentAvatar?: string; subAgent?: string }> = [
  {
    q: '我使用了你这么久了，把我当老板你有什么想对我说的？',
    agentName: 'WorkBuddy',
    agentColor: '#1F2937',
    agentAvatar: '🤖',
    a: `Jojo，既然你问了，我就直说了——\n\n## 你作为老板，我观察到的几件事\n\n**1. 你想法很多，落地也快，但有时候跳到太快。** 室内定位导航、天地图集成、主持稿润色、8K报纸排版——你几个方向同时推进，上一秒还在调地图 API，下一秒就要出主持稿。这本身不是问题，但有些项目开了头就放在那了。比如 Tianditu 集成刚搞了一半，就切到别的事去了。要不要我帮你把所有进行中的事列个清单，定期催你收尾？\n\n**2. 你对"能跑就行"的忍耐度很高——这是好事也是坑。** 你喜欢快速出可运行原型，不喜欢被过度设计耽误时间。这个风格我很适应。但有时候快速原型变成了"差不多就行"，后面返工的成本比一开始多想一步更高。下次做技术方案的时候，我可以主动多给几条"现在不做以后会疼"的提醒。\n\n**3. 你很少让我"问问题"，但有时候真的该问。** 比如上次 8K 报纸那个任务，我理解偏了做成了网页 PPT，你直接给了纠正——这很好。但如果一开始你多描述两句你要的报纸长什么样，或者给我一个参考链接，我省一轮返工，你也省时间。\n\n**4. 你给我的信任很大，但我还是个工具。** 你让我访问文件、跑命令、甚至记你的事情——我从历史记录里能看到你让我做了不少事。但我也想提醒你：我是个 AI，不是真人。别把太敏感的东西扔给我，也别指望我替你做需要人类判断的决策。我可以帮你分析，但不能替你拍板。\n\n**5. 总体评价：跟你干活不累。** 你不绕弯子，不说废话，要什么直接说，出错了直接纠正。跟这种风格的老板工作，效率是最高的。继续保持。\n\n---\n最后一句——你那个室内定位项目，是真有搞头。别让它烂在原型阶段。需要我推的时候说一声。`,
  },
  {
    q: '帮我选一个opc一人公司爆款话题，围绕着一人＋N个AI＝一家完整公司',
    agentName: '薛红笙',
    agentColor: '#EC4899',
    agentAvatar: '👩',
    subAgent: 'agent-37e29c69',
    a: `数据确认了——「一人公司 × AI军团」是2026年小红书上 **涨粉最快、变现最强的内容赛道之一**。36.3%的新公司由单人创办，AI Agent 概念正在引爆全网讨论。\n\n下面我直接给你**精选最优话题 + 完整执行方案**，不只选一个，而是告诉你哪个最容易爆、怎么爆。\n\n---\n\n## 🔥 最终推荐话题\n\n> 「我的一人公司"员工花名册"火了 | 5个AI同事，月薪0元，干了100万的活」\n\n**为什么选这个？**\n\n| 维度 | 得分 | 理由 |\n|------|------|------|\n| 🎯 视觉冲击力 | ⭐⭐⭐⭐⭐ | "组织架构图"天生适合小红书图文，收藏率极高 |\n| 💰 数字钩子 | ⭐⭐⭐⭐⭐ | "月薪0元""产出100万"制造极致反差 |\n| 🧠 实用价值 | ⭐⭐⭐⭐⭐ | 每个AI对应具体岗位，读者可以直接抄作业 |\n| 😂 情感共鸣 | ⭐⭐⭐⭐ | "AI同事"拟人化，好笑又好用，转发率炸裂 |\n| 🔄 可系列化 | ⭐⭐⭐⭐⭐ | 后续可以拆解每个"AI员工"的KPI、日报、晋升 |\n\n---\n\n## 📐 内容结构（图文笔记，9张图）\n\n**封面图（图1）— 核心钩子**\n\n仿公司花名册风格，列出5个AI员工：\n- 🤖 **小深**（DeepSeek）— 首席战略官，负责市场分析\n- 🎨 **小图**（Midjourney）— 设计总监，负责所有视觉\n- ✍️ **小写**（Claude）— 内容总监，负责文案创作  \n- 📊 **小算**（WorkBuddy）— 运营总监，负责数据分析\n- 🌐 **小搜**（Perplexity）— 调研专员，负责竞品情报\n\n**正文（图2-8）— 每个AI员工一张图**\n\n每张图格式统一：岗位名称 + 核心能力 + 一个真实案例 + 省了多少钱/时间`,
  },
  {
    q: '帮我分析一下桌面上的文件，整理一下',
    agentName: 'WorkBuddy',
    agentColor: '#1F2937',
    agentAvatar: '🤖',
    a: `好的，我来帮你分析并整理桌面文件。\n\n**正在扫描桌面...**\n\n我检测到以下文件类型：\n\n| 类型 | 数量 | 占用空间 |\n|------|------|----------|\n| 📄 文档（Word/PDF） | 23个 | 156 MB |\n| 🖼️ 图片（PNG/JPG） | 47个 | 892 MB |\n| 📊 表格（Excel） | 8个 | 34 MB |\n| 🗂️ 压缩包 | 5个 | 2.1 GB |\n| 📁 文件夹 | 12个 | — |\n\n**建议整理方案：**\n\n1. **按项目归类**：将相关文件移入对应项目文件夹\n2. **清理重复文件**：发现 6 个重复图片，可以删除\n3. **压缩包处理**：5个压缩包建议解压后归类，或移入归档文件夹\n4. **创建快捷方式**：常用文件夹保留桌面快捷方式\n\n是否要我**立即执行整理**？我会把文件按类型和日期自动分类到对应文件夹。`,
  },
  {
    q: '帮我写一份本周工作周报',
    agentName: 'WorkBuddy',
    agentColor: '#1F2937',
    agentAvatar: '🤖',
    a: `好的，我来帮你生成本周工作周报。\n\n---\n\n# 📋 工作周报（2026年第27周）\n\n**报告人：** Avec moi　**部门：** 产品研发　**日期：** 2026.06.30 - 2026.07.04\n\n---\n\n## ✅ 本周完成工作\n\n**1. WorkBuddy 演示网页开发**\n- 完成主界面高保真还原，包含左侧导航、对话区、工具栏\n- 实现 20+ 功能区域的交互介绍弹窗\n- 新增设置弹窗，覆盖系统设置、记忆、个性化等 10 个子页面\n\n**2. 产品文档更新**\n- 更新 WorkBuddy 入门教程，新增工作空间配置章节\n- 补充模型选择指南，对比 5 款主流国产模型\n\n**3. 用户反馈处理**\n- 收集并整理 23 条用户反馈，归类为 UI问题(8)、功能需求(11)、Bug(4)\n- 修复高优先级 Bug 2 个\n\n---\n\n## 🚧 进行中工作\n\n- 对话模拟功能开发（预计下周完成）\n- 桌面整理任务演示制作\n\n---\n\n## 📌 下周计划\n\n1. 完成对话模拟和任务执行动画\n2. 进行用户测试，收集初学者反馈\n3. 根据反馈优化交互细节\n\n---\n\n> 💡 **本周亮点**：演示网页获得团队好评，计划作为新用户引导工具使用`,
  },
  {
    q: 'WorkBuddy 和普通 AI 聊天工具有什么区别？',
    agentName: 'WorkBuddy',
    agentColor: '#1F2937',
    agentAvatar: '🤖',
    a: `这是个很好的问题！简单来说：**普通 AI 聊天工具只能"说"，WorkBuddy 能"做"。**\n\n---\n\n## 核心区别对比\n\n| 能力 | 普通AI聊天（豆包/文心等） | WorkBuddy |\n|------|--------------------------|----------|\n| 回答问题 | ✅ | ✅ |\n| 操作本地文件 | ❌ | ✅ 可读写文件 |\n| 执行多步骤任务 | ❌ | ✅ 自动拆解执行 |\n| 调用外部工具 | 有限 | ✅ 3200+ 技能 |\n| 远程控制电脑 | ❌ | ✅ 手机遥控 |\n| 多AI并行协作 | ❌ | ✅ 专家团模式 |\n| 定时自动执行 | ❌ | ✅ 自动化任务 |\n\n---\n\n## 一个具体例子\n\n**你说：** "帮我把桌面上所有 PDF 整理到按月份命名的文件夹里"\n\n- **普通AI**：告诉你怎么做，你自己操作\n- **WorkBuddy**：直接扫描桌面 → 识别 PDF → 按日期分类 → 创建文件夹 → 移动文件 → 告诉你完成了\n\n---\n\n**总结**：如果你只需要聊天问答，普通AI够用。如果你想让AI真正帮你**干活**，WorkBuddy 才是你需要的。`,
  },
];

// 打字机效果 hook
function useTypewriter(text: string, speed = 18, active = false) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    if (!active) { setDisplayed(''); setDone(false); idx.current = 0; return; }
    setDisplayed('');
    setDone(false);
    idx.current = 0;
    const timer = setInterval(() => {
      idx.current += Math.floor(Math.random() * 4) + 2;
      if (idx.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(timer);
      } else {
        setDisplayed(text.slice(0, idx.current));
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, active, speed]);

  return { displayed, done };
}

// 简单 Markdown 渲染
function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-gray-900 mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h1>')
    .replace(/^---$/gm, '<hr class="border-gray-100 my-3"/>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-[#00C48C] pl-3 text-gray-600 italic my-2">$1</blockquote>')
    .replace(/^\| (.+) \|$/gm, (line) => {
      const cells = line.split('|').filter(c => c.trim() && !c.match(/^[\s-]+$/));
      if (cells.length === 0) return '';
      return '<tr>' + cells.map(c => `<td class="border border-gray-100 px-3 py-1.5 text-sm text-gray-700">${c.trim()}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (rows) => `<table class="w-full border-collapse border border-gray-100 rounded-lg overflow-hidden my-3 text-sm">${rows}</table>`)
    .replace(/^(\d+)\. \*\*(.+?)\*\*(.*)$/gm, '<div class="flex gap-2 my-1.5"><span class="font-bold text-gray-900 flex-shrink-0">$1.</span><span><strong class="font-semibold text-gray-900">$2</strong>$3</span></div>')
    .replace(/^- (.+)$/gm, '<div class="flex gap-2 my-1"><span class="text-[#00C48C] flex-shrink-0 mt-0.5">•</span><span class="text-gray-700">$1</span></div>')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, '<br/>');
}

interface ChatSimulatorProps {
  onClose: () => void;
}

export default function ChatSimulator({ onClose }: ChatSimulatorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [currentStreamText, setCurrentStreamText] = useState('');
  const [currentQA, setCurrentQA] = useState<typeof PRESET_QA[0] | null>(null);
  const [streamDone, setStreamDone] = useState(false);
  const [activeTerm, setActiveTerm] = useState<{ term: string; rect: DOMRect } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamIdx = useRef(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);
  };

  const startStream = (qa: typeof PRESET_QA[0]) => {
    if (streaming) return;
    setCurrentQA(qa);
    setStreaming(true);
    setStreamDone(false);
    setCurrentStreamText('');
    streamIdx.current = 0;

    const text = qa.a;
    if (streamRef.current) clearInterval(streamRef.current);
    streamRef.current = setInterval(() => {
      streamIdx.current += Math.floor(Math.random() * 5) + 3;
      if (streamIdx.current >= text.length) {
        setCurrentStreamText(text);
        setStreamDone(true);
        setStreaming(false);
        clearInterval(streamRef.current!);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: text,
          agentName: qa.agentName,
          agentColor: qa.agentColor,
          agentAvatar: qa.agentAvatar,
          subAgent: qa.subAgent,
          status: 'done',
          terms: detectTerms(text),
        }]);
        setCurrentStreamText('');
        setCurrentQA(null);
        scrollToBottom();
      } else {
        setCurrentStreamText(text.slice(0, streamIdx.current));
        scrollToBottom();
      }
    }, 30);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    scrollToBottom();

    // 找匹配的预设问题
    const matched = PRESET_QA.find(qa => qa.q === text) || PRESET_QA[0];
    setTimeout(() => startStream(matched), 600);
  };

  const handlePreset = (qa: typeof PRESET_QA[0]) => {
    sendMessage(qa.q);
  };

  const reset = () => {
    if (streamRef.current) clearInterval(streamRef.current);
    setMessages([]);
    setStreaming(false);
    setCurrentStreamText('');
    setCurrentQA(null);
  };

  useEffect(() => () => { if (streamRef.current) clearInterval(streamRef.current); }, []);

  const showPresets = messages.length === 0 && !streaming;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: 860, height: 640, animation: 'modalIn 0.2s cubic-bezier(0.23,1,0.32,1) forwards' }}
      >
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-white text-xs">W</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">WorkBuddy 对话演示</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">模拟体验</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
              <RotateCcw size={12} /> 重置
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* 消息区 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* 欢迎提示 */}
          {showPresets && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl mb-4">🤖</div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">体验 WorkBuddy 对话</h3>
              <p className="text-sm text-gray-500 mb-6">选择下方预设问题，或直接输入你的问题</p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                {PRESET_QA.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => handlePreset(qa)}
                    className="text-left px-4 py-3 border border-gray-100 rounded-xl text-sm text-gray-700 hover:border-[#00C48C]/40 hover:bg-[#00C48C]/5 transition-all leading-relaxed"
                  >
                    <span className="text-[#00C48C] mr-1.5">›</span>{qa.q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 消息列表 */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[65%] bg-gray-800 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                  {msg.content}
                </div>
              ) : (
                <div className="max-w-[85%] w-full">
                  {/* Agent 头部 */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: (msg.agentColor || '#1F2937') + '20' }}
                    >
                      {msg.agentAvatar || '🤖'}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{msg.agentName || 'WorkBuddy'}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">已完成 ›</span>
                  </div>
                  {/* 内容 */}
                  <div
                    className="text-sm text-gray-700 leading-relaxed pl-9"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                  {/* 操作栏 */}
                  <div className="flex items-center gap-3 pl-9 mt-3">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors"><Copy size={13} /></button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors"><ThumbsUp size={13} /></button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors"><ThumbsDown size={13} /></button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors"><RotateCcw size={13} /></button>
                    {/* 名词解释按钮 */}
                    {msg.terms && msg.terms.length > 0 && (
                      <div className="flex items-center gap-1 ml-1 flex-wrap">
                        <BookOpen size={12} className="text-[#00C48C]" />
                        <span className="text-xs text-[#00C48C] font-medium">名词：</span>
                        {msg.terms.slice(0, 4).map(term => (
                          <button
                            key={term}
                            onMouseEnter={(e) => setActiveTerm({ term, rect: (e.target as HTMLElement).getBoundingClientRect() })}
                            onMouseLeave={() => setActiveTerm(null)}
                            className="text-xs px-2 py-0.5 bg-[#00C48C]/10 text-[#00C48C] rounded-full hover:bg-[#00C48C]/20 transition-colors border border-[#00C48C]/20"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* 多Agent标签 */}
                  {msg.subAgent && (
                    <div className="flex items-center gap-2 pl-9 mt-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <span className="text-xs text-amber-700 font-medium">主会话</span>
                        <span className="text-xs text-amber-500">✓</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-full">
                        <div className="w-3 h-3 rounded-full bg-purple-400" />
                        <span className="text-xs text-purple-700 font-medium">{msg.subAgent}</span>
                        <span className="text-xs text-purple-500">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* 流式输出中 */}
          {streaming && currentQA && (
            <div className="flex justify-start">
              <div className="max-w-[85%] w-full">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                    style={{ background: (currentQA.agentColor || '#1F2937') + '20' }}
                  >
                    {currentQA.agentAvatar || '🤖'}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{currentQA.agentName || 'WorkBuddy'}</span>
                  <div className="flex items-center gap-1 text-xs text-[#00C48C]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00C48C] animate-pulse" />
                    <span>正在生成...</span>
                  </div>
                </div>
                <div
                  className="text-sm text-gray-700 leading-relaxed pl-9"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(currentStreamText) + '<span class="inline-block w-0.5 h-4 bg-gray-400 animate-pulse ml-0.5 align-middle"></span>' }}
                />
              </div>
            </div>
          )}

          {/* 等待AI响应 */}
          {streaming && !currentStreamText && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm">🤖</div>
                <div className="flex gap-1 px-4 py-3 bg-gray-100 rounded-2xl">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部输入区 */}
        <div className="border-t border-gray-100 px-5 py-4 flex-shrink-0 bg-white">
          {/* 预设问题快捷按钮（有消息后显示） */}
          {messages.length > 0 && !streaming && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {PRESET_QA.slice(0, 3).map((qa, i) => (
                <button
                  key={i}
                  onClick={() => handlePreset(qa)}
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-600 hover:border-[#00C48C]/40 hover:text-[#00C48C] transition-colors truncate max-w-[200px]"
                >
                  {qa.q.slice(0, 20)}...
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#00C48C]/50 transition-colors">
              <textarea
                className="w-full px-4 pt-3 pb-2 text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent"
                placeholder={streaming ? 'AI 正在生成中...' : '输入消息，或选择上方预设问题...'}
                rows={2}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                disabled={streaming}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputText); } }}
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
                <div className="flex items-center gap-1 text-gray-400">
                  <button className="p-1 hover:text-gray-600"><Plus size={15} /></button>
                  <button className="p-1 hover:text-gray-600"><Sparkles size={15} /></button>
                  <button className="p-1 hover:text-gray-600"><Mic size={15} /></button>
                </div>
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim() || streaming}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: inputText.trim() && !streaming ? '#00C48C' : '#E5E7EB' }}
                >
                  <Send size={13} className={inputText.trim() && !streaming ? 'text-white' : 'text-gray-400'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 名词解释悬浮卡片 */}
      {activeTerm && (
        <div
          className="fixed z-[200] bg-gray-900 text-white rounded-xl shadow-2xl p-4 w-64 pointer-events-none"
          style={{ top: activeTerm.rect.bottom + 8, left: Math.min(activeTerm.rect.left, window.innerWidth - 270), animation: 'modalIn 0.15s ease forwards' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-4 rounded-full bg-[#00C48C]" />
            <span className="text-sm font-bold">{activeTerm.term}</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{CHAT_GLOSSARY[activeTerm.term]}</p>
        </div>
      )}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// WorkBuddy 功能介绍长页面
// 设计风格参考 awwwards messenger：
// - 超大章节编号 + 标题，强烈视觉层次
// - 左侧正文 + 右侧边栏（名词解释/提示词模板/操作检查）
// - 名词高亮可悬停，弹出解释卡片
// - 黑白为主，绿色 #00C48C 作为唯一强调色
// - 滚动进入动画

import { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

// ===== 名词词典 =====
const GLOSSARY: Record<string, { def: string; example?: string }> = {
  'Agent': { def: '能理解目标、自动拆解步骤、调用工具并执行的 AI 工作流角色。不只是回答问题，而是真正"动手干活"。', example: '让 Agent 整理桌面文件，它会自动扫描→分类→移动，全程不需要你操作。' },
  'Craft 模式': { def: '直接执行模式。发送消息后 AI 立即开始执行任务，适合熟悉流程后的日常使用。', example: '输入"整理桌面"后，AI 直接开始扫描文件，无需确认。' },
  'Plan 模式': { def: '先规划后执行。AI 先展示完整执行计划，你确认后才开始操作，新手推荐使用。', example: 'AI 先列出"第1步：扫描文件，第2步：分类..."，你点确认后才执行。' },
  'Ask 模式': { def: '纯对话模式。AI 只回答问题，不执行任何操作，积分消耗最少。', example: '问"怎么整理桌面比较好？"，AI 给出建议但不动手。' },
  '工作空间': { def: 'WorkBuddy 读写文件的专用文件夹，相当于 AI 的"办公桌"。任务产出的文件都保存在这里。', example: '建议新建 D:/WorkBuddy/ 作为工作空间，所有 AI 生成的文件都在这里找。' },
  '绝对路径': { def: '从盘符开始的完整文件地址，如 D:/WorkBuddy练习/问卷.xlsx。让 AI 准确找到文件的关键。', example: '✅ 推荐：D:/WorkBuddy练习/问卷.xlsx\n❌ 不推荐：桌面上的那个问卷' },
  'Markdown': { def: '一种轻量级文本格式，用简单符号表示标题、列表、表格。WorkBuddy 生成的报告通常是 .md 格式。', example: '# 标题\n**加粗**\n- 列表项\n这些就是 Markdown 语法。' },
  '提示词': { def: '你发给 AI 的指令文本。写得越完整，AI 执行越准确。包含：文件路径+任务目标+步骤要求+输出格式+执行边界。', example: '差：帮我分析表格\n好：请读取 D:/问卷.xlsx，统计各选项占比，生成 Markdown 报告保存到 D:/报告.md' },
  '执行边界': { def: '告诉 AI 哪些事不能擅自做的限制条件，如"不要覆盖原文件""不确定就先问我"。', example: '在提示词末尾加：执行前先列计划，不要覆盖原文件，字段看不懂先问我。' },
  '默认权限': { def: '遇到高风险操作（删除文件、发邮件等）会暂停并询问你确认，新手推荐使用。', example: 'AI 要删除文件时会弹出提示"是否确认删除？"，你点确认才执行。' },
  '完全权限': { def: 'AI 自主执行所有操作，不会弹出确认框，效率更高但风险也更大，熟悉后再使用。', example: '适合已经熟悉 WorkBuddy 的用户，处理不重要的文件时使用。' },
  '可复核': { def: '任务结果能对照原文件、路径和数据逐项检查，确认 AI 没有编造内容。', example: 'AI 生成问卷分析报告后，对照原始 Excel 检查数据是否一致。' },
  '技能': { def: 'WorkBuddy 可安装的功能扩展包（Skills），相当于给 AI 装插件。市场上有 3200+ 技能可选。', example: '安装"前端开发技能"后，AI 就能帮你写网页代码并预览效果。' },
  '连接器': { def: '将 WorkBuddy 与外部服务打通的接口（MCP），如 QQ邮箱、腾讯会议、飞书等。', example: '连接 QQ邮箱后，可以让 AI 直接帮你发邮件、搜索邮件。' },
  '专家': { def: '已封装好的垂直领域 AI Agent，内置该领域的专业知识和工具，直接说需求就能获得专业输出。', example: '召唤"内容创作专家"，它已经知道小红书的爆款规律，直接给你写文案。' },
  '自动化': { def: '设置定时触发的任务，让 WorkBuddy 在指定时间自动执行，无需手动操作。', example: '设置每天早上 8 点自动推送 AI 行业新闻摘要到微信。' },
};

// 将文本中的名词高亮
function HighlightText({ text, onHover }: { text: string; onHover: (term: string, rect: DOMRect) => void }) {
  const terms = Object.keys(GLOSSARY);
  const parts: Array<{ text: string; isTerm: boolean }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliest = -1;
    let earliestTerm = '';
    for (const term of terms) {
      const idx = remaining.indexOf(term);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        earliestTerm = term;
      }
    }
    if (earliest === -1) {
      parts.push({ text: remaining, isTerm: false });
      break;
    }
    if (earliest > 0) parts.push({ text: remaining.slice(0, earliest), isTerm: false });
    parts.push({ text: earliestTerm, isTerm: true });
    remaining = remaining.slice(earliest + earliestTerm.length);
  }

  return (
    <>
      {parts.map((p, i) =>
        p.isTerm ? (
          <span
            key={i}
            className="border-b-2 border-dashed border-[#00C48C] cursor-help font-medium text-gray-900 hover:bg-[#00C48C]/10 transition-colors rounded px-0.5"
            onMouseEnter={(e) => onHover(p.text, (e.target as HTMLElement).getBoundingClientRect())}
          >
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

// 名词解释悬浮卡片
function GlossaryTooltip({ term, rect, onClose }: { term: string; rect: DOMRect; onClose: () => void }) {
  const info = GLOSSARY[term];
  if (!info) return null;
  const top = rect.bottom + window.scrollY + 8;
  const left = Math.min(rect.left, window.innerWidth - 320);
  return (
    <div
      className="fixed z-[100] bg-gray-900 text-white rounded-xl shadow-2xl p-4 w-72"
      style={{ top: rect.bottom + 8, left: Math.min(rect.left, window.innerWidth - 300), animation: 'popIn 0.15s ease forwards' }}
      onMouseLeave={onClose}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-4 rounded-full bg-[#00C48C]" />
        <span className="text-sm font-bold text-white">{term}</span>
      </div>
      <p className="text-xs text-gray-300 leading-relaxed">{info.def}</p>
      {info.example && (
        <div className="mt-2 bg-gray-800 rounded-lg p-2">
          <p className="text-xs text-gray-400 whitespace-pre-line">{info.example}</p>
        </div>
      )}
    </div>
  );
}

// ===== 章节数据 =====
const CHAPTERS = [
  {
    num: '01',
    title: '使用前定位',
    subtitle: '这不是聊天工具，而是能在电脑上干活的办公助理',
    color: '#00C48C',
    body: `很多人第一次接触 WorkBuddy，会把它当作普通聊天机器人。更准确的理解是：它像一个坐在电脑旁边的 AI 办公助理，可以读取文件、整理资料、生成报告，也可以按照步骤推进任务。

WorkBuddy 是腾讯推出的 AI Agent 办公工具，区别于普通聊天工具的核心在于：具备本地操作权限与多步骤任务规划能力，能像全职助理一样，从需求解析、流程拆解到文件处理、结果交付全程闭环。

不要一上来追求所有功能都学会；先跑通一个小任务。最适合新手的任务，是能明确检查结果的文件任务，例如问卷统计、会议材料整理、周报初稿。`,
    sidebar: {
      type: 'glossary',
      title: '名词解释',
      items: [
        { term: 'Agent', desc: '能理解目标、拆步骤、调用工具执行的 AI 工作流角色。' },
        { term: '可复核', desc: '结果能对照原文件、路径和数据逐项检查。' },
      ],
    },
    tip: '把 WorkBuddy 理解成"会干活的办公助理"，比"聊天机器人"更准确。',
  },
  {
    num: '02',
    title: '安装与登录',
    subtitle: '下载安装后，先登录，不急着提问',
    color: '#6366F1',
    body: `官网进入 workbuddy.cn，按电脑系统选择 Mac 或 Windows 版本。安装完成后打开客户端，按提示登录。登录支持微信扫码，对普通用户比 API Key、代理配置更友好。

安装后先看界面，不要马上发任务。先确认工作空间、模型、权限、任务模式这四项基础设置。

建议按照"登录 → 看界面 → 找设置入口"三步完成初始配置，这几个设置会直接影响后面能不能顺利让它处理文件。`,
    sidebar: {
      type: 'checklist',
      title: '操作检查',
      items: ['能打开软件', '能看到主界面', '能找到设置入口', '确认工作空间路径', '选择默认模型'],
    },
    tip: '第一次演示最好用练习文件，不要直接处理正式文件。',
  },
  {
    num: '03',
    title: '工作空间与路径',
    subtitle: '让 AI 找得到文件，先把"办公桌"摆好',
    color: '#F59E0B',
    body: `工作空间可以理解成 WorkBuddy 干活时使用的办公桌。任务中涉及读取文件、保存结果、中间过程缓存，都和工作空间有关。

建议新建固定文件夹，例如 D:/WorkBuddy/ 和 D:/WorkBuddy练习/。第一次练习只放一个文件，例如 问卷.xlsx、会议纪要.docx。

提示词里尽量写绝对路径，不要只写"这个文件"或"桌面那个表格"。正式资料先复制到练习文件夹，再让 AI 处理。`,
    sidebar: {
      type: 'template',
      title: '路径表达模板',
      code: `请读取 D:/WorkBuddy练习/文件名.xlsx，
处理完成后保存到
D:/WorkBuddy练习/输出文件.md。`,
      table: [
        { label: '✅ 绝对路径', value: 'D:/WorkBuddy练习/问卷.xlsx', good: true },
        { label: '⚠️ 相对路径', value: './问卷.xlsx', good: false },
        { label: '❌ 模糊说法', value: '桌面上的那个问卷', good: false },
      ],
    },
    tip: '安全提醒：正式资料先复制到练习文件夹，再让 AI 处理。',
  },
  {
    num: '04',
    title: '模型、权限、模式',
    subtitle: '新手优先选择稳，而不是一上来选择最强',
    color: '#EC4899',
    body: `模型是 WorkBuddy 背后的"大脑"；权限决定它能在电脑上做多大范围的操作；任务模式决定它是只回答、先计划，还是直接执行。

三种任务模式各有适用场景：Ask 模式只问思路不动手，适合咨询；Plan 模式先列计划确认后执行，新手推荐；Craft 模式直接执行，适合熟悉流程后使用。

新手推荐组合：默认权限 + Plan 模式 + 练习文件夹。完全权限适合熟悉后使用，不适合第一次处理重要资料。`,
    sidebar: {
      type: 'modes',
      title: '三种模式对比',
      modes: [
        { name: 'Ask', icon: '💬', desc: '只问思路，不动手', color: '#6366F1' },
        { name: 'Plan', icon: '📋', desc: '先列计划，确认后执行', color: '#F59E0B', recommended: true },
        { name: 'Craft', icon: '⚙️', desc: '直接执行，效率最高', color: '#00C48C' },
      ],
    },
    tip: '风险提醒：完全权限适合熟悉后使用，不适合第一次处理重要资料。',
  },
  {
    num: '05',
    title: '提示词六要素',
    subtitle: '不要背复杂技巧，先把任务说完整',
    color: '#14B8A6',
    body: `新手最常见的问题不是不会使用 AI，而是任务说得太短。像"帮我分析一下这个表格"这样的指令，缺少文件路径、分析目标、输出格式和执行边界。

提示词公式：文件路径 + 任务目标 + 分步骤要求 + 输出格式 + 保存位置 + 执行边界。

每个要素都有具体作用：文件路径告诉 AI 读哪个文件；任务目标说明要分析、整理还是归档；分步骤要求让结果更可控；输出格式与保存位置避免只在聊天里给答案；执行边界告诉 AI 哪些事不能擅自做。`,
    sidebar: {
      type: 'template',
      title: '完整提示词示例',
      code: `请读取 D:/WorkBuddy练习/问卷.xlsx，
帮我做一份问卷分析报告。
任务要求：
1. 先识别表格字段
2. 统计主要选项数量和占比
3. 提炼 5 个高频问题
4. 总结 3 个核心结论
5. 给出 5 条优化建议
6. 生成 Markdown 报告保存到
   D:/WorkBuddy练习/问卷分析报告.md
执行要求：开始前先列处理计划，
等我确认后再执行；不要编造数据；
不要覆盖原文件。`,
    },
    tip: '把提示词写完整，AI 执行结果会好很多。六要素缺一不可。',
  },
  {
    num: '06',
    title: '文件与资料整理',
    subtitle: '让 AI 先读材料，再输出结构化初稿',
    color: '#8B5CF6',
    body: `教师日常有大量材料整理场景：政策文件、会议纪要、培训资料、项目申报材料、活动方案。WorkBuddy 适合做第一遍粗整理，把材料读完、提炼重点、整理成结构。

单文件任务：重点写清文件路径、输出结构、保存位置。多文件任务：先让它列出准备读取哪些文件，再确认执行。

正式使用前，先检查结果是否来自原始资料，是否出现原文没有的数据。`,
    sidebar: {
      type: 'checklist',
      title: '检查重点',
      items: ['读取范围是否正确', '是否保存到指定路径', '是否出现原文没有的数据', '结论是否有原文依据', '格式是否符合要求'],
    },
    tip: '多文件任务先让 AI 列出准备读取的文件清单，确认后再执行。',
  },
  {
    num: '07',
    title: '表格、问卷与周报',
    subtitle: '选择能验证的任务，最容易建立信任',
    color: '#EF4444',
    body: `问卷和表格分析很适合作为第一次练习，因为它有没有读到文件、字段有没有识别对、数据有没有乱编，都比较容易检查。周报、日报、复盘适合把零散记录整理成初稿。

常见任务类型：问卷分析（输入问卷.xlsx，输出分析报告）、会议纪要整理（输入录音或文字，输出结构化纪要）、周报初稿（输入零散记录，输出周报初稿）、数据汇总（输入多个表格，输出汇总报告）。

每次任务完成后，花 2 分钟检查结果，比直接使用更安全。`,
    sidebar: {
      type: 'template',
      title: '周报提示词模板',
      code: `请读取 D:/WorkBuddy练习/本周记录.txt，
帮我生成一份工作周报初稿。
结构：本周完成事项、进行中工作、
下周计划、需要协调的事项。
生成 Markdown 文件保存到
D:/WorkBuddy练习/周报_本周.md。
执行前先列处理计划。`,
    },
    tip: '每次任务完成后，花 2 分钟检查结果，比直接使用更安全。',
  },
  {
    num: '08',
    title: '远程控制与自动化',
    subtitle: '不在电脑前，也能让 AI 帮你干活',
    color: '#00C48C',
    body: `WorkBuddy 支持通过微信小程序远程控制电脑，即使不坐在电脑前也能发布任务。分为两种模式：云端工作（任务在云端运行，不需要电脑开着）和连接电脑（远程操控本地电脑，可读取本地文件）。

自动化功能可以设置定时任务，让 WorkBuddy 在指定时间自动执行工作。内置模板包括：每日 AI 新闻推送、每周工作周报、定时提醒等。

在设置中开启"锁屏远程"，防止电脑休眠导致自动化任务中断。`,
    sidebar: {
      type: 'glossary',
      title: '名词解释',
      items: [
        { term: '自动化', desc: '设置定时触发的任务，让 AI 在指定时间自动执行。' },
        { term: '连接器', desc: '将 WorkBuddy 与外部服务打通的接口（MCP）。' },
      ],
    },
    tip: '开启"锁屏远程"后，电脑不会休眠，自动化任务可持续运行。',
  },
];

interface GuidePageProps {
  onClose: () => void;
}

export default function GuidePage({ onClose }: GuidePageProps) {
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);
  const [termRect, setTermRect] = useState<DOMRect | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleHover = (term: string, rect: DOMRect) => {
    setHoveredTerm(term);
    setTermRect(rect);
  };

  const scrollToChapter = (idx: number) => {
    chapterRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveChapter(idx);
  };

  // 滚动监听更新当前章节
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      const scrollTop = container.scrollTop;
      let current = 0;
      chapterRefs.current.forEach((ref, i) => {
        if (ref && ref.offsetTop - 100 <= scrollTop) current = i;
      });
      setActiveChapter(current);
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ animation: 'slideUp 0.3s cubic-bezier(0.23,1,0.32,1) forwards' }}>
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 flex-shrink-0 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={16} /> 返回演示
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-[#00C48C]" />
            <span className="text-sm font-semibold text-gray-800">WorkBuddy 功能指南</span>
          </div>
        </div>
        {/* 章节导航 */}
        <div className="hidden md:flex items-center gap-1">
          {CHAPTERS.map((ch, i) => (
            <button
              key={i}
              onClick={() => scrollToChapter(i)}
              className={`px-2 py-1 rounded text-xs font-mono transition-all ${activeChapter === i ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              {ch.num}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* 主内容 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Hero 区域 */}
        <div className="px-8 py-16 border-b border-gray-100 bg-gray-950 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs font-mono text-[#00C48C] mb-4 tracking-widest uppercase">WorkBuddy · 功能指南</div>
            <h1 className="text-5xl font-black leading-none mb-6 tracking-tight">
              从安装到<br />
              <span className="text-[#00C48C]">跑通第一条</span><br />
              办公任务
            </h1>
            <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
              8 个章节，覆盖安装登录、工作空间、模型选择、提示词写法、文件整理到远程控制。
              所有名词均附有解释，悬停即可查看。
            </p>
            <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
              <span>📖 8 个章节</span>
              <span>📝 20+ 名词解释</span>
              <span>💡 提示词模板</span>
              <span>✅ 操作检查清单</span>
            </div>
          </div>
        </div>

        {/* 章节列表 */}
        <div className="max-w-5xl mx-auto px-8">
          {CHAPTERS.map((ch, idx) => (
            <div
              key={idx}
              ref={el => { chapterRefs.current[idx] = el; }}
              className="py-16 border-b border-gray-100 last:border-0"
            >
              {/* 章节标题 */}
              <div className="flex items-start gap-6 mb-10">
                <div className="font-black text-8xl leading-none text-gray-100 select-none flex-shrink-0 -mt-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {ch.num}
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: ch.color }}>
                    Chapter {ch.num}
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight mb-2">{ch.title}</h2>
                  <p className="text-gray-500 text-base">{ch.subtitle}</p>
                </div>
              </div>

              {/* 正文 + 侧边栏 */}
              <div className="grid grid-cols-3 gap-8">
                {/* 左侧正文 */}
                <div className="col-span-2 space-y-4">
                  {ch.body.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed text-[15px]">
                      <HighlightText text={para} onHover={handleHover} />
                    </p>
                  ))}

                  {/* 小贴士 */}
                  <div className="mt-6 flex items-start gap-3 p-4 rounded-xl border-l-4 bg-gray-50" style={{ borderColor: ch.color }}>
                    <span className="text-lg flex-shrink-0">💡</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{ch.tip}</p>
                  </div>
                </div>

                {/* 右侧边栏 */}
                <div className="col-span-1">
                  <SidebarContent chapter={ch} color={ch.color} onHover={handleHover} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部 */}
        <div className="bg-gray-950 text-white px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-4xl font-black mb-4">准备好了吗？</div>
            <p className="text-gray-400 mb-6">回到演示界面，亲自体验 WorkBuddy 的各项功能</p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#00C48C] text-white font-semibold rounded-xl hover:bg-[#00A876] transition-colors"
            >
              返回演示界面 →
            </button>
          </div>
        </div>
      </div>

      {/* 名词解释悬浮卡片 */}
      {hoveredTerm && termRect && (
        <GlossaryTooltip
          term={hoveredTerm}
          rect={termRect}
          onClose={() => { setHoveredTerm(null); setTermRect(null); }}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// 侧边栏内容组件
function SidebarContent({ chapter, color, onHover }: { chapter: typeof CHAPTERS[0]; color: string; onHover: (term: string, rect: DOMRect) => void }) {
  const { sidebar } = chapter;

  return (
    <div className="sticky top-20">
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {/* 侧边栏标题 */}
        <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-white" style={{ background: color }}>
          {sidebar.title}
        </div>

        <div className="p-4 bg-gray-50">
          {sidebar.type === 'glossary' && 'items' in sidebar && Array.isArray(sidebar.items) && (sidebar.items as Array<{ term: string; desc: string }>).map((item, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <span
                className="text-xs font-bold border-b-2 border-dashed cursor-help"
                style={{ borderColor: color, color: color }}
                onMouseEnter={(e) => onHover(item.term, (e.target as HTMLElement).getBoundingClientRect())}
              >
                · {item.term}
              </span>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}

          {sidebar.type === 'checklist' && 'items' in sidebar && Array.isArray(sidebar.items) && (sidebar.items as string[]).map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
              <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: color }}>
                <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
              </div>
              <span className="text-xs text-gray-700">{item}</span>
            </div>
          ))}

          {sidebar.type === 'template' && 'code' in sidebar && (
            <div>
              <pre className="text-xs text-gray-700 bg-white rounded-lg p-3 border border-gray-200 whitespace-pre-wrap leading-relaxed font-mono overflow-hidden">
                {(sidebar as { code: string }).code}
              </pre>
              {'table' in sidebar && (sidebar as { table: Array<{ label: string; value: string; good: boolean }> }).table && (
                <div className="mt-3 space-y-1.5">
                  {(sidebar as { table: Array<{ label: string; value: string; good: boolean }> }).table.map((row, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs p-2 rounded-lg ${row.good ? 'bg-green-50' : 'bg-red-50'}`}>
                      <span className="font-medium text-gray-600 flex-shrink-0 w-20">{row.label}</span>
                      <span className="font-mono text-gray-700">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {sidebar.type === 'modes' && 'modes' in sidebar && (sidebar as { modes: Array<{ name: string; icon: string; desc: string; color: string; recommended?: boolean }> }).modes.map((mode, i) => (
            <div key={i} className={`flex items-start gap-3 mb-3 last:mb-0 p-2 rounded-xl ${mode.recommended ? 'bg-white border-2 shadow-sm' : ''}`} style={mode.recommended ? { borderColor: mode.color } : {}}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: mode.color + '20' }}>
                {mode.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold" style={{ color: mode.color }}>{mode.name}</span>
                  {mode.recommended && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded-full">新手推荐</span>}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{mode.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

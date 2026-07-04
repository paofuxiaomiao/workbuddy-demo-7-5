// WorkBuddy 功能指南完整页面
// 内容来源：飞书文档（13章）+ 教师入门手册PDF（15章+附录）
// 设计风格：awwwards messenger 风格 - 大字标题、黑底Hero、左正文+右边栏
// 名词高亮：所有专业术语有绿色虚线下划线，悬停弹出解释卡片

import { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';

// ===== 名词词典 =====
const GLOSSARY: Record<string, { def: string; example?: string }> = {
  'Agent': { def: '能理解目标、拆解步骤并调用工具执行的 AI 工作流角色。不只是回答问题，而是真正"动手干活"。', example: '让 Agent 整理桌面文件，它会自动扫描→分类→移动，全程不需要你操作。' },
  'Craft': { def: 'Craft 模式：直接执行模式。发送消息后 AI 立即开始执行任务，适合熟悉流程后的日常使用。', example: '输入"整理桌面"后，AI 直接开始扫描文件，无需确认。' },
  'Plan': { def: 'Plan 模式：先规划后执行。AI 先展示完整执行计划，你确认后才开始操作，新手推荐。', example: 'AI 先列出"第1步：扫描文件，第2步：分类..."，你点确认后才执行。' },
  'Ask': { def: 'Ask 模式：纯对话模式。AI 只回答问题，不执行任何操作，积分消耗最少。', example: '问"怎么整理桌面比较好？"，AI 给出建议但不动手。' },
  '工作空间': { def: 'WorkBuddy 读写文件的专用文件夹，相当于 AI 的"办公桌"。任务产出的文件都保存在这里。', example: '建议新建 D:/WorkBuddy/ 作为工作空间，所有 AI 生成的文件都在这里找。' },
  '绝对路径': { def: '从盘符开始的完整文件地址，如 D:/WorkBuddy练习/问卷.xlsx。让 AI 准确找到文件的关键。', example: '✅ 推荐：D:/WorkBuddy练习/问卷.xlsx\n❌ 不推荐：桌面上的那个问卷' },
  '相对路径': { def: '不从盘符开始的文件地址，如 ./问卷.xlsx。AI 容易找错文件，新手暂时不要用。', example: '❌ 不推荐：./问卷.xlsx 或 ../资料/问卷.xlsx\n✅ 推荐：D:/WorkBuddy练习/问卷.xlsx' },
  'Markdown': { def: '一种轻量级文本格式，用简单符号表示标题、列表、表格。WorkBuddy 生成的报告通常是 .md 格式。', example: '# 标题\n**加粗**\n- 列表项\n这些就是 Markdown 语法。' },
  '提示词': { def: '你发给 AI 的指令文本。写得越完整，AI 执行越准确。六要素：文件路径+任务目标+步骤要求+输出格式+保存位置+执行边界。', example: '差：帮我分析表格\n好：请读取 D:/问卷.xlsx，统计各选项占比，生成 Markdown 报告保存到 D:/报告.md' },
  '执行边界': { def: '告诉 AI 哪些事不能擅自做的限制条件，如"不要覆盖原文件""不确定就先问我"。', example: '在提示词末尾加：执行前先列计划，不要覆盖原文件，字段看不懂先问我。' },
  '默认权限': { def: '在沙箱里操作，遇到高风险动作会暂停并询问你确认，新手推荐使用。', example: 'AI 要删除文件时会弹出提示"是否确认删除？"，你点确认才执行。' },
  '完全权限': { def: 'AI 自主执行所有操作，不会弹出确认框，效率更高但风险也更大，熟悉后再使用。', example: '适合已经熟悉 WorkBuddy 的用户，处理不重要的文件时使用。' },
  '沙箱': { def: '受限制的安全工作区，用来降低 AI 误操作影响范围。AI 在沙箱里操作，即使出错也不会影响整台电脑。', example: '默认权限下，AI 在沙箱里工作，就算理解错任务，风险也会小很多。' },
  '可复核': { def: '任务结果能对照原文件、路径和数据逐项检查，确认 AI 没有编造内容。', example: 'AI 生成问卷分析报告后，对照原始 Excel 检查数据是否一致。' },
  '技能': { def: 'WorkBuddy 可安装的功能扩展包（Skills），相当于给 AI 装插件。市场上有 3200+ 技能可选。', example: '安装"前端开发技能"后，AI 就能帮你写网页代码并预览效果。' },
  '连接器': { def: '将 WorkBuddy 与外部服务打通的接口（MCP），如 QQ邮箱、腾讯会议、飞书等。', example: '连接 QQ邮箱后，可以让 AI 直接帮你发邮件、搜索邮件。' },
  '专家': { def: '已封装好的垂直领域 AI Agent，内置该领域的专业知识和工具，直接说需求就能获得专业输出。', example: '召唤"内容创作专家"，它已经知道小红书的爆款规律，直接给你写文案。' },
  '专家团': { def: '多个 AI 专家并行协作，像一支真实团队。你把任务丢给专家团，团长自动帮你拆任务分给不同专家。', example: '软件开发专家团：产品经理定需求、架构师设计、工程师实现、QA验证，一条龙。' },
  '自动化': { def: '设置定时触发的任务，让 WorkBuddy 在指定时间自动执行，无需手动操作。', example: '设置每天早上 8 点自动推送 AI 行业新闻摘要到微信。' },
  '记忆': { def: '长期希望 AI 遵守的规则，会从对话中提取并记住你的偏好和习惯，对话越多 AI 越懂你。', example: '在记忆中写"总结时先给结论再列依据"，AI 每次回答都会遵循这个习惯。' },
  'API Key': { def: '调用外部模型或服务时使用的密钥，不能随意公开。相当于你的账号密码。', example: '去 DeepSeek 开放平台申请 API Key，填入 WorkBuddy 就能使用 DeepSeek 模型。' },
  '字段': { def: '表格里的列名，例如年级、学科、满意度、反馈内容。', example: '问卷表格的字段可能有：姓名、年级、满意度（1-5分）、建议。' },
};

// 高亮文本中的名词
function HL({ text, onHover }: { text: string; onHover: (term: string, rect: DOMRect) => void }) {
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const parts: Array<{ text: string; isTerm: boolean }> = [];
  let remaining = text;
  while (remaining.length > 0) {
    let earliest = -1, earliestTerm = '';
    for (const term of terms) {
      const idx = remaining.indexOf(term);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) { earliest = idx; earliestTerm = term; }
    }
    if (earliest === -1) { parts.push({ text: remaining, isTerm: false }); break; }
    if (earliest > 0) parts.push({ text: remaining.slice(0, earliest), isTerm: false });
    parts.push({ text: earliestTerm, isTerm: true });
    remaining = remaining.slice(earliest + earliestTerm.length);
  }
  return (
    <>{parts.map((p, i) => p.isTerm ? (
      <span key={i} className="border-b-2 border-dashed border-[#00C48C] cursor-help font-medium text-gray-900 hover:bg-[#00C48C]/10 transition-colors rounded px-0.5"
        onMouseEnter={(e) => onHover(p.text, (e.target as HTMLElement).getBoundingClientRect())}>
        {p.text}
      </span>
    ) : <span key={i}>{p.text}</span>)}</>
  );
}

// 名词解释悬浮卡片
function GlossaryTooltip({ term, rect, onClose }: { term: string; rect: DOMRect; onClose: () => void }) {
  const info = GLOSSARY[term];
  if (!info) return null;
  return (
    <div className="fixed z-[100] bg-gray-900 text-white rounded-xl shadow-2xl p-4 w-72 pointer-events-none"
      style={{ top: rect.bottom + 8, left: Math.min(rect.left, window.innerWidth - 300), animation: 'popIn 0.15s ease forwards' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-4 rounded-full bg-[#00C48C]" />
        <span className="text-sm font-bold">{term}</span>
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

// 代码块组件
function CodeBlock({ children }: { children: string }) {
  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 border-b border-gray-200">
        <span className="text-xs text-gray-500 font-mono">代码块</span>
        <button className="text-xs text-gray-400 hover:text-gray-600" onClick={() => navigator.clipboard?.writeText(children)}>复制</button>
      </div>
      <pre className="px-4 py-3 bg-gray-50 text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">{children}</pre>
    </div>
  );
}

// 表格组件
function InfoTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((h, i) => <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              {row.map((cell, j) => <td key={j} className="px-4 py-2.5 text-gray-700 border-t border-gray-100">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 提示框组件
function Tip({ color, label, children }: { color: string; label: string; children: React.ReactNode }) {
  return (
    <div className="my-3 flex items-start gap-3 p-4 rounded-xl border-l-4" style={{ borderColor: color, background: color + '10' }}>
      <span className="text-base flex-shrink-0">💡</span>
      <div>
        <p className="text-xs font-semibold mb-1" style={{ color }}>{label}</p>
        <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// 清单组件
function Checklist({ items, color }: { items: string[]; color: string }) {
  return (
    <div className="space-y-2 my-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: color }}>
            <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
          </div>
          <span className="text-sm text-gray-700">{item}</span>
        </div>
      ))}
    </div>
  );
}

// ===== 章节数据（飞书文档 13章 + PDF手册 15章）=====
const FEISHU_CHAPTERS = [
  {
    num: '一', title: '先下载安装 WorkBuddy', color: '#00C48C',
    content: [
      { type: 'p', text: '第一步很简单，先去 WorkBuddy 官网（workbuddy.cn）下载客户端。根据你的电脑系统选择 Windows 或 Mac 版本，下载之后正常安装，打开软件，然后按提示登录账号。' },
      { type: 'p', text: '这一步不难，真正容易踩坑的是安装之后的设置。因为 WorkBuddy 后面会读写本地文件，所以你第一次打开之后，不要急着开始提问，先把工作空间路径、模型、权限这几个基础项看明白。' },
      { type: 'p', text: '这几个设置，会直接影响你后面能不能顺利让它处理文件。' },
    ],
    sidebar: { type: 'note', title: '新手提醒', items: ['登录支持微信扫码，不需要 API Key', '安装后先看界面，不要马上发任务', '先确认工作空间、模型、权限、任务模式这四项'] },
  },
  {
    num: '二', title: '先改工作空间路径', color: '#6366F1',
    content: [
      { type: 'p', text: 'WorkBuddy 不是普通网页聊天工具。它在执行任务时，可能会生成文件、保存结果、缓存内容，也可能留下中间过程文件。所以你可以把工作空间理解成 WorkBuddy 干活时用的"办公桌"。' },
      { type: 'p', text: '这个位置最好一开始就设置清楚。如果默认路径在系统盘，长期使用后可能会占用 C 盘空间。尤其是你经常让它处理 PDF、表格、图片、PPT、批量文件，生成的中间结果和缓存会越来越多。' },
      { type: 'p', text: '所以我建议新手一开始就新建一个固定文件夹：' },
      { type: 'code', text: 'D:/WorkBuddy/' },
      { type: 'p', text: '这里顺手讲一下绝对路径。绝对路径就是从盘符开始写完整地址。比如：' },
      { type: 'code', text: 'D:/WorkBuddy/\nD:/WorkBuddy练习/问卷.xlsx\nD:/工作周报/日报.md' },
      { type: 'p', text: '这些都是绝对路径。不要只写：' },
      { type: 'code', text: 'WorkBuddy/\n问卷.xlsx\n./问卷.xlsx\n../资料/问卷.xlsx' },
      { type: 'p', text: '这些是相对路径。你可以不懂技术，但一定要记住一句话：你要让 AI 找文件，就尽量把完整地址告诉它。' },
      { type: 'p', text: '新手可以直接建两个文件夹：一个放 WorkBuddy 工作空间，一个放练习文件。这样后面学习时不容易乱。' },
      { type: 'code', text: 'D:/WorkBuddy/\nD:/WorkBuddy练习/' },
    ],
    sidebar: {
      type: 'table', title: '路径写法对比',
      headers: ['写法', '示例', '建议'],
      rows: [
        ['绝对路径', 'D:/WorkBuddy练习/问卷.xlsx', '✅ 推荐'],
        ['相对路径', './问卷.xlsx', '⚠️ 新手不要用'],
        ['模糊说法', '桌面上的那个问卷', '❌ 容易找错'],
      ],
    },
  },
  {
    num: '三', title: '模型怎么选', color: '#F59E0B',
    content: [
      { type: 'p', text: '很多新手一看到模型就开始纠结：哪个模型最好？哪个模型最聪明？哪个模型最便宜？我要不要自己配置 API？' },
      { type: 'p', text: '先别急。你可以把模型理解成 WorkBuddy 背后的"大脑"。' },
      { type: 'p', text: 'WorkBuddy 已经支持大部分主流国产模型，比如混元、DeepSeek、Kimi、GLM、MiniMax 等，新手不用一上来就自己申请 API，先用默认模型跑通任务就行。' },
      { type: 'p', text: '另外，WorkBuddy 也支持自定义模型，但目前只支持 OpenAI 兼容协议 API。也就是说，你需要准备支持该协议的 API Key 和模型名称，再添加进去。' },
      { type: 'tip', color: '#F59E0B', label: '新手建议', text: '先用内置模型跑通第一个任务，再考虑自定义模型。' },
    ],
    sidebar: {
      type: 'models', title: '内置模型推荐',
      models: [
        { name: 'DeepSeek V4 Pro', tag: '新手推荐', desc: '综合能力强，适合大多数场景，积分消耗合理' },
        { name: '腾讯混元 Turbo', tag: '', desc: '腾讯自研，中文理解出色' },
        { name: 'Kimi k2', tag: '', desc: '长文本处理能力强' },
        { name: 'GLM-4 Plus', tag: '', desc: '代码与推理能力均衡' },
        { name: 'MiniMax Text-01', tag: '', desc: '多模态能力，支持图像理解' },
      ],
    },
  },
  {
    num: '四', title: '权限怎么理解', color: '#EC4899',
    content: [
      { type: 'p', text: 'WorkBuddy 里的权限，新手可以先理解成两种：默认权限和完全权限。' },
      { type: 'p', text: '默认权限是在沙箱里操作。沙箱可以理解成 AI 的"安全工作区"。也就是说，AI 不是在你整台电脑里随便读写文件，而是在一个相对受限制的范围里执行任务。这样即使它理解错了任务，风险也会小很多。所以新手第一次用 WorkBuddy，建议先用默认权限。' },
      { type: 'p', text: '完全权限就是给 AI 更大的操作范围。它能做更多事情，执行效率也可能更高，比如更自由地读取、修改、移动文件，或者完成更复杂的任务。但风险也更高：它可能读错文件、改错内容，甚至影响你没准备处理的资料。' },
      { type: 'p', text: '所以完全权限更适合你已经熟悉 WorkBuddy，并且任务路径、输出格式、操作目标都非常明确的时候再用。' },
      { type: 'code', text: '第一次使用：默认权限\n练习任务：放在 D:/WorkBuddy练习/\n重要文件：先复制副本\n复杂任务：先让 AI 列计划\n熟悉之后：再考虑完全权限' },
      { type: 'p', text: '一句话：默认权限适合新手，因为它在沙箱里更安全；完全权限适合熟手，因为它能力更大，但风险也更高。' },
    ],
    sidebar: {
      type: 'compare', title: '权限对比',
      items: [
        { label: '默认权限', desc: '沙箱内操作，高风险动作会停下确认', tag: '新手推荐', color: '#00C48C' },
        { label: '完全权限', desc: '更大操作范围，效率高但风险也高', tag: '熟手使用', color: '#EF4444' },
      ],
    },
  },
  {
    num: '五', title: '任务模式怎么选：Ask、Plan、Craft、召唤专家', color: '#14B8A6',
    content: [
      { type: 'p', text: 'WorkBuddy 在输入任务前，可以选择不同的任务模式。新手不要一上来就随便选，先看任务类型。' },
      { type: 'table', headers: ['模式', '可以怎么理解', '适合做什么', '新手怎么用'],
        rows: [
          ['Ask', '只问思路，不让 AI 动手', '问概念、问方法、拆解任务、写提示词', '第一次不确定怎么做时，先用 Ask'],
          ['Plan', '先列计划，再执行', '处理文件、分析表格、整理文档、生成报告', '新手最推荐，先看计划，确认后再让它执行'],
          ['Craft', '直接动手执行', '批量处理、代码任务、固定流程任务', '熟悉之后再用，重要文件不要一上来用 Craft'],
          ['召唤专家', '找一个专业角色来帮你', '内容创作、法律、数据分析、开发、行业研究', '不知道怎么做专业任务时，可以先召唤对应专家'],
        ],
      },
      { type: 'code', text: '不知道怎么做：选 Ask\n第一次处理文件：选 Plan\n任务已经很熟：再用 Craft\n专业问题：召唤专家' },
      { type: 'p', text: '一句话：Ask 是问，Plan 是先商量再干，Craft 是直接干，召唤专家是找更专业的人来干。' },
      { type: 'p', text: '对新手来说，最稳的选择是：' },
      { type: 'code', text: '默认权限 + Plan 模式 + 测试文件夹' },
      { type: 'p', text: '这样既能让 WorkBuddy 真正执行任务，又不会一上来把风险放得太大。' },
    ],
    sidebar: { type: 'note', title: '模式选择口诀', items: ['不确定 → Ask', '第一次处理文件 → Plan', '任务已熟 → Craft', '专业问题 → 召唤专家', '新手最稳：默认权限 + Plan + 练习文件夹'] },
  },
  {
    num: '六', title: 'WorkBuddy 主要能做什么', color: '#8B5CF6',
    content: [
      { type: 'p', text: 'WorkBuddy 更像一个国产桌面 AI 办公助理。它最适合的不是闲聊，而是那些需要先看资料、再提炼、再输出成文档、表格或报告的任务。' },
      { type: 'h3', text: '1. 本地文件处理' },
      { type: 'p', text: '这是 WorkBuddy 和普通聊天 AI 最大的区别之一。普通聊天工具通常需要你复制粘贴内容。WorkBuddy 更适合直接围绕本地文件工作。比如读取桌面上的 Excel，总结一个 PDF，整理一个 Word 文档，根据一堆素材生成报告，把文件夹里的资料归类，或者生成新的结果文件。' },
      { type: 'code', text: '请读取 D:/WorkBuddy练习/项目资料.pdf，\n帮我提炼这份资料的核心内容，\n输出一份包含背景、重点、风险、建议的 Markdown 总结，\n保存到 D:/WorkBuddy练习/项目资料总结.md。\n执行前先列处理计划。' },
      { type: 'h3', text: '2. Excel 和问卷分析' },
      { type: 'p', text: '它不是简单总结几句话，而是能读取表格、理解问卷数据，再给出分析结论。这个场景非常适合新手，因为表格分析能直接验证它有没有真的读到文件。适合处理：问卷统计、用户反馈分析、销售数据汇总、课程报名表整理、收支表初步分析、客户名单清洗、表格转报告。' },
      { type: 'code', text: '请读取 D:/WorkBuddy练习/问卷.xlsx，\n先识别表格字段，\n再统计每个选项的数量和占比，\n最后提炼 5 个用户反馈中最明显的问题，\n生成一份问卷分析报告。\n不要编造表格里没有的数据。' },
      { type: 'tip', color: '#8B5CF6', label: '重要提示', text: '表格类任务一定要让它先说明字段，再开始分析。这样你能判断它有没有读错表。' },
      { type: 'h3', text: '3. Word、PDF、多资料整理' },
      { type: 'p', text: 'WorkBuddy 适合先帮你做第一遍粗整理：把材料读完，提炼重点，整理成结构，再由你判断哪些能用。适合：总结 PDF、提炼 Word 文档、把多份资料合并成一份概要、从资料里抽取关键观点、把长文档变成汇报提纲、把会议材料整理成复盘。' },
      { type: 'h3', text: '4. 周报、日报、复盘初稿' },
      { type: 'p', text: 'WorkBuddy 适合把你的零散记录整理成结构化初稿。它适合帮你做第一版，最后润色和判断还是你来。' },
      { type: 'code', text: '请读取 D:/工作周报/本周记录.md，\n整理成一份周报初稿。\n结构：本周完成、关键进展、遇到的问题、下周计划、需要协同的事项。\n语气正式但不要太空，保存到 D:/工作周报/本周周报.md。' },
      { type: 'h3', text: '5. PPT 框架生成' },
      { type: 'p', text: '做课件或汇报时，不建议一上来要求 AI 直接生成完整 PPT。更稳的方式是先让它输出结构：几页、每页标题、核心观点、建议图表、还缺哪些资料。' },
      { type: 'code', text: '请根据 D:/WorkBuddy练习/项目资料.md，\n帮我生成一份 10 页汇报 PPT 大纲。\n每页包括：页标题、核心观点、页面内容要点、建议图表形式。\n先不要制作 PPT 文件，只输出大纲让我确认。' },
      { type: 'h3', text: '6. 批量文件处理' },
      { type: 'p', text: '批量文件处理很有价值，但也是新手最容易出错的地方。因为一旦任务说不清楚，它会稳定地执行错很多次。' },
      { type: 'code', text: '请读取 D:/WorkBuddy练习/待整理文件/，\n先列出文件清单，\n然后根据文件名和内容判断适合分成哪些类别。\n先不要移动文件，只输出分类方案。\n等我确认后，再把文件复制到对应分类文件夹。' },
      { type: 'tip', color: '#EF4444', label: '批量任务原则', text: '先复制，不要直接移动；先分类方案，不要直接执行。' },
      { type: 'h3', text: '7. 远程下任务' },
      { type: 'p', text: 'WorkBuddy 还可以接入微信、企微、飞书、钉钉等工具远程下任务。这部分的价值，不是让 AI 变得更聪明，而是让你不坐在电脑前，也能让电脑开始干活。比如路上想到一个任务，让电脑先整理资料；开会结束后，让它根据记录生成复盘；晚上让它先生成第二天要看的简报。你的电脑要开着，WorkBuddy 要保持运行，文件路径也要提前规划好。' },
      { type: 'code', text: '请读取 D:/工作周报/今日记录.md，\n整理成今日复盘，保存到 D:/工作周报/日报/。\n如果找不到文件，先回复我，不要生成空文档。' },
    ],
    sidebar: { type: 'note', title: 'WorkBuddy 适合的任务', items: ['本地文件处理（PDF/Word/Excel）', '问卷分析与数据统计', '多资料整理与摘要', '周报日报复盘初稿', 'PPT 大纲生成', '批量文件分类归档', '远程触发任务'] },
  },
  {
    num: '七', title: '准备一个练习文件夹', color: '#F59E0B',
    content: [
      { type: 'p', text: '前面讲了这么多，真正上手时不要一开始就处理重要资料。先建一个练习文件夹：' },
      { type: 'code', text: 'D:/WorkBuddy练习/' },
      { type: 'p', text: '里面先放一个文件，比如：会议纪要.docx。第一次不要放太多文件。' },
      { type: 'p', text: '因为第一轮不是追求复杂，而是确认 4 件事：WorkBuddy 能不能找到文件，模型能不能理解内容，权限流程你能不能看懂，输出结果能不能用。' },
    ],
    sidebar: { type: 'note', title: '推荐文件夹结构', items: ['D:/WorkBuddy/ — 工作空间', 'D:/WorkBuddy练习/ — 练习文件', '练习文件夹里先放：问卷.xlsx 或 会议纪要.docx', '正式资料先复制副本再处理'] },
  },
  {
    num: '八', title: '第一条任务怎么写', color: '#00C48C',
    content: [
      { type: 'p', text: '新手最容易犯的错，是只说一句：帮我分析一下这个表格。它不知道文件在哪里，不知道你要分析什么，也不知道最后要输出什么。' },
      { type: 'p', text: '完整的第一条任务示例：' },
      { type: 'code', text: '请读取 D:/WorkBuddy练习/问卷.xlsx，帮我做一份问卷分析报告。\n1. 先识别这份表格包含哪些字段；\n2. 统计主要选项的数量和占比；\n3. 从用户反馈中提炼 5 个高频问题；\n4. 总结 3 个核心结论；\n5. 给出 5 条后续优化建议；\n6. 最后生成一份 Markdown 报告，保存到 D:/WorkBuddy练习/问卷分析报告.md。\n开始前先列处理计划，等我确认后再执行。\n不要编造表格里没有的数据。\n如果有字段看不懂，先问我，不要自己猜。' },
      { type: 'p', text: '这条指令里面有 6 个关键要素：文件在哪里，要处理什么，要输出什么，输出保存在哪里，执行前要先计划，不确定时要问，不要猜。' },
      { type: 'p', text: '你可以直接记这个公式：' },
      { type: 'code', text: '文件路径 + 任务目标 + 分步骤要求 + 输出格式 + 保存位置 + 执行边界' },
      { type: 'p', text: '这个比背一堆复杂提示词有用。' },
    ],
    sidebar: { type: 'note', title: '提示词六要素', items: ['① 文件路径：告诉它读哪个文件', '② 任务目标：分析/整理/生成/归档', '③ 分步骤要求：让结果更可控', '④ 输出格式：Markdown/Word/Excel', '⑤ 保存位置：指定完整路径', '⑥ 执行边界：先列计划，不确定就问'] },
  },
  {
    num: '九', title: '结果出来后怎么检查', color: '#EF4444',
    content: [
      { type: 'p', text: '结果出来之后，不要看到它写得完整就直接相信。你至少检查 5 件事：' },
      { type: 'checklist', items: ['字段有没有识别错', '结论是不是来自原始资料', '输出文件有没有保存到指定路径', '数据有没有乱编', '文件有没有被覆盖'] },
      { type: 'p', text: 'WorkBuddy 适合帮你做第一版，但不适合替你承担最终责任。尤其是数据、客户、财务、合同、正式汇报相关内容，一定要自己复核。' },
      { type: 'tip', color: '#EF4444', label: '重要原则', text: 'AI 最适合替你完成脏活累活的第一遍，最后判断还是你来做。' },
    ],
    sidebar: { type: 'note', title: '高风险场景需人工复核', items: ['数据统计与财务报表', '客户信息与合同内容', '正式汇报与对外材料', '涉及决策的分析结论'] },
  },
  {
    num: '十', title: '记忆怎么用', color: '#8B5CF6',
    content: [
      { type: 'p', text: '记忆就是你长期希望 AI 记住的规则。示例：' },
      { type: 'code', text: '回答要简洁，先列计划再执行，不确定就问，文件输出要标清保存路径，不要编造数据，总结时先给结论，再给证据。' },
      { type: 'p', text: '新手可以先写这 5 条：' },
      { type: 'code', text: '处理复杂任务前，先列计划，等我确认后再执行。\n所有生成文件都要说明保存路径。\n不要编造数据，不确定就直接说明。\n总结资料时，先给结论，再列依据。\n涉及原始文件时，不要覆盖，优先生成新文件。' },
      { type: 'p', text: '但记忆不是越多越好。记忆太多会让 AI 分散注意力。长期稳定的工作习惯，可以放进记忆。短期任务要求，直接写在当前任务里就行。' },
    ],
    sidebar: { type: 'note', title: '记忆使用原则', items: ['长期工作习惯 → 放进记忆', '短期任务要求 → 写在当前任务里', '记忆不要超过 10 条', '可以从其他 AI 工具导入记忆'] },
  },
  {
    num: '十一', title: '专家、专家团、技能和连接器怎么理解', color: '#EC4899',
    content: [
      { type: 'p', text: 'WorkBuddy 里除了普通任务，还有一个很重要的入口：专家、技能、连接器。这部分新手一开始不用全部研究透，但要先知道它们分别是干什么的。' },
      { type: 'table', headers: ['名称', '可以怎么理解', '适合做什么', '新手怎么用'],
        rows: [
          ['专家', '给 AI 换一个专业角色', '内容创作、法律咨询、开发、行业研究、数据分析', '先去专家市场找现成专家，不用一开始自己创建'],
          ['技能', '某类任务的操作说明书', '处理 Excel、生成 PPT、整理 PDF、设计网页、文件归档', '先用现成技能跑几次，看输出是否稳定'],
          ['专家团', '多个专家协作完成复杂任务', '选题、写作、审核、研究、分析这类多步骤任务', '适合稍复杂任务，新手先从现成专家团开始'],
          ['连接器', 'WorkBuddy 和外部工具之间的接口', '连接飞书、会议、文档、日程等办公工具', '等基础任务跑通后，再接入常用办公工具'],
        ],
      },
      { type: 'tip', color: '#EC4899', label: '使用顺序', text: '普通任务跑通 → 熟悉提示词 → 再研究技能、专家和连接器。不要一开始就全部研究透。' },
    ],
    sidebar: { type: 'note', title: '名词解释', items: ['专家：预设专业角色，内置知识和工具', '技能：固定流程能力，相当于插件', '专家团：多 Agent 并行协作', '连接器：接入邮箱、会议、文档等外部工具'] },
  },
  {
    num: '十二', title: '自动化什么时候用', color: '#14B8A6',
    content: [
      { type: 'p', text: '自动化就是把一个固定任务按时间或条件反复执行。比如每天晚上生成日报，每周日整理周报，每天早上生成行业资讯摘要，每周汇总一个文件夹里的资料。' },
      { type: 'p', text: '但新手不要一上来就自动化。因为自动化最怕任务没说清楚。如果你的指令本身就含糊，自动化只会稳定地产出一堆你不想要的结果。' },
      { type: 'p', text: '正确顺序应该是：' },
      { type: 'code', text: '手动跑通一次 -> 调整指令 -> 再跑一次 -> 结果稳定 -> 再做自动化' },
      { type: 'p', text: '自动化指令示例：' },
      { type: 'code', text: '每天晚上 18:00，读取 D:/工作周报/今日记录.md，\n整理成一份日报，包含今日完成、遇到问题、明日计划三部分，\n保存到 D:/工作周报/日报/，文件名使用当天日期。\n执行前如果找不到文件，不要新建空报告，先提醒我。' },
      { type: 'p', text: '自动化要注意：路径必须写完整，电脑要保持运行，WorkBuddy 客户端要保持运行，第一次自动化前先手动试跑，重要文件先备份，输出到新文件，不要覆盖原文件。' },
    ],
    sidebar: { type: 'note', title: '自动化注意事项', items: ['先手动跑通再自动化', '路径必须写完整', '电脑和 WorkBuddy 要保持运行', '写清楚找不到文件时怎么处理', '重要文件先备份'] },
  },
  {
    num: '十三', title: '新手第一天完整路线', color: '#00C48C',
    content: [
      { type: 'p', text: '如果你是第一次用 WorkBuddy，可以照这个顺序来：' },
      { type: 'code', text: '1. 下载并安装 WorkBuddy；\n2. 登录账号；\n3. 修改工作空间路径到 D:/WorkBuddy/；\n4. 新建练习文件夹 D:/WorkBuddy练习/；\n5. 放入一份问卷.xlsx；\n6. 先用默认模型；\n7. 权限选择先计划后执行（Plan 模式）；\n8. 先了解 WorkBuddy 适合处理表格、文档、报告、PPT、批量文件这些办公任务；\n9. 输入第一条任务指令；\n10. 看它列出的计划；\n11. 确认后执行；\n12. 打开生成的报告；\n13. 检查文件、数据、结论、保存路径；\n14. 跑通后再研究记忆、技能、自动化。' },
      { type: 'p', text: 'WorkBuddy 的入门，不是把所有功能都学一遍。真正的入门，是你能从安装开始，搞懂模型和权限，然后跑通一个完整的小任务。' },
      { type: 'p', text: '你要知道文件放在哪里，知道用哪个模型，知道该给 AI 多大权限，也知道任务应该怎么说。' },
      { type: 'p', text: '当你完成这条线：' },
      { type: 'code', text: '安装 -> 路径 -> 模型 -> 权限 -> 文件 -> 指令 -> 计划 -> 执行 -> 检查' },
      { type: 'p', text: '你就已经掌握 WorkBuddy 最核心的用法了。先别追求复杂。先让它帮你处理一份文件，生成一份结果。跑通第一次之后，你自然就知道第二次该怎么用了。' },
    ],
    sidebar: { type: 'note', title: '完成标准', items: ['能找到输出文件', '能说明 AI 读了哪个原文件', '能指出至少 2 项需要人工复核的内容', '跑通后再研究高级功能'] },
  },
];

// PDF 手册附录章节
const PDF_CHAPTERS = [
  {
    num: '01', title: '使用前定位 — 这不是聊天工具，而是能在电脑上干活的办公助理', color: '#00C48C',
    content: [
      { type: 'p', text: '本页目标：先建立正确预期：WorkBuddy 适合处理文件、表格、资料整理和可复核的办公任务。' },
      { type: 'p', text: '很多教师第一次接触 WorkBuddy，会把它当作普通聊天机器人。更准确的理解是：它像一个坐在电脑旁边的 AI 办公助理，可以读取文件、整理资料、生成报告，也可以按照步骤推进任务。' },
      { type: 'p', text: '· 不要一上来追求所有功能都学会；先跑通一个小任务。' },
      { type: 'p', text: '· 最适合新手的任务，是能明确检查结果的文件任务，例如问卷统计、会议材料整理、周报初稿。' },
      { type: 'p', text: '· 教师培训时建议把目标说清楚：本课不是讲 AI 概念，而是学会让 AI 完成一件具体办公事。' },
      { type: 'tip', color: '#6B7280', label: '课堂提醒', text: '第一次演示最好用练习文件，不要直接处理正式文件。让学员看见完整流程，比展示高级功能更重要。' },
    ],
    sidebar: { type: 'note', title: '名词解释', items: ['Agent：能理解目标、拆步骤、调用工具执行的 AI 工作流角色。', '可复核：结果能对照原文件、路径和数据逐项检查。', '教师口径：把 WorkBuddy 讲成"会干活的办公助理"，比讲成"聊天机器人"更准确。'] },
  },
  {
    num: '02', title: '安装与登录 — 下载安装后，先登录，不急着提问', color: '#6366F1',
    content: [
      { type: 'p', text: '本页目标：能完成客户端安装，并知道第一步先熟悉界面和基础设置。' },
      { type: 'p', text: '官网进入 workbuddy.cn，按电脑系统选择 Mac 或 Windows 版本。安装完成后打开客户端，按提示登录。截图中登录环节支持微信扫码，对普通教师比 API Key、代理配置更友好。' },
      { type: 'p', text: '· 安装后先看界面，不要马上发任务。' },
      { type: 'p', text: '· 先确认工作空间、模型、权限、任务模式这四项。' },
      { type: 'p', text: '· 课堂上可以让学员跟着完成"登录 → 看界面 → 找设置入口"三步。' },
    ],
    sidebar: { type: 'checklist', title: '操作检查', items: ['能打开软件', '能看到主界面', '能找到设置入口', '确认工作空间路径', '选择默认模型'] },
  },
  {
    num: '03', title: '工作空间与路径 — 让 AI 找得到文件，先把"办公桌"摆好', color: '#F59E0B',
    content: [
      { type: 'p', text: '本页目标：能建立固定工作空间，并用完整路径说明文件位置。' },
      { type: 'p', text: '工作空间可以理解成 WorkBuddy 干活时使用的办公桌。任务中涉及读取文件、保存结果、中间过程缓存，都和工作空间有关。' },
      { type: 'p', text: '· 建议新建固定文件夹，例如 D:/WorkBuddy/ 和 D:/WorkBuddy练习/。' },
      { type: 'p', text: '· 第一次练习只放一个文件，例如 问卷.xlsx、会议纪要.docx、项目资料.pdf。' },
      { type: 'p', text: '· 提示词里尽量写完整路径，不要只写"这个文件"或"桌面那个表格"。' },
      { type: 'code', text: '路径表达模板：\n请读取 D:/WorkBuddy练习/文件名.xlsx，处理完成后\n保存到 D:/WorkBuddy练习/输出文件.md。' },
      { type: 'table', headers: ['写法', '示例', '建议'],
        rows: [
          ['绝对路径', 'D:/WorkBuddy练习/问卷.xlsx', '推荐，AI 更容易定位'],
          ['相对路径', './问卷.xlsx 或 ../资料/问卷.xlsx', '新手暂时不要用'],
          ['模糊说法', '桌面上的那个问卷', '容易找错文件'],
        ],
      },
      { type: 'tip', color: '#EF4444', label: '安全提醒', text: '正式资料先复制到练习文件夹，再让 AI 处理。' },
    ],
    sidebar: { type: 'note', title: '名词解释', items: ['工作空间：WorkBuddy 读写文件的项目文件夹。', '绝对路径：从盘符开始的完整地址。'] },
  },
  {
    num: '04', title: '模型、权限、模式 — 新手优先选择稳，而不是一上来选择最强', color: '#EC4899',
    content: [
      { type: 'p', text: '本页目标：能区分模型、权限和任务模式，并知道何时保守。' },
      { type: 'p', text: '模型是 WorkBuddy 背后的"大脑"；权限决定它能在电脑上做多大范围的操作；任务模式决定它是只回答、先计划，还是直接执行。' },
      { type: 'table', headers: ['项目', '新手建议', '原因'],
        rows: [
          ['模型', '先用内置默认或推荐模型', '先跑通任务，再比较模型差异'],
          ['权限', '默认权限', '风险动作会停下确认，更适合练习'],
          ['模式', 'Plan 模式', '先看计划，确认后再执行'],
          ['重要文件', '使用副本', '避免误改原文件'],
        ],
      },
      { type: 'tip', color: '#EF4444', label: '风险提醒', text: '完全权限适合熟悉后使用，不适合第一次处理重要资料。' },
    ],
    sidebar: { type: 'note', title: '名词解释 + 推荐组合', items: ['Ask：只问思路，不动手。', 'Plan：先列计划，确认后执行。', 'Craft：直接执行。', '推荐组合：默认权限 + Plan 模式 + 练习文件夹。'] },
  },
  {
    num: '05', title: '提示词六要素 — 不要背复杂技巧，先把任务说完整', color: '#14B8A6',
    content: [
      { type: 'p', text: '本页目标：能用六要素写出第一条可执行、可检查的指令。' },
      { type: 'p', text: '新手最常见的问题不是不会使用 AI，而是任务说得太短。像"帮我分析一下这个表格"这样的指令，缺少文件路径、分析目标、输出格式和执行边界。' },
      { type: 'p', text: '提示词公式：文件路径 + 任务目标 + 分步骤要求 + 输出格式 + 保存位置 + 执行边界' },
      { type: 'p', text: '· 文件路径：告诉它读哪个文件或文件夹。' },
      { type: 'p', text: '· 任务目标：说明要分析、整理、生成还是归档。' },
      { type: 'p', text: '· 分步骤要求：让结果更可控。' },
      { type: 'p', text: '· 输出格式与保存位置：避免只在聊天里给答案。' },
      { type: 'p', text: '· 执行边界：先列计划，不确定就问，不要覆盖原文件。' },
      { type: 'code', text: '第一条任务：问卷分析报告\n请读取 D:/WorkBuddy练习/问卷.xlsx，帮我做一份问卷分析报告。\n任务要求：1. 先识别表格字段；2. 统计主要选项数量和占比；3. 从反馈中提炼 5 个高频问题；4. 总结 3 个核心结论；5. 给出 5 条优化建议；6. 生成 Markdown 报告，保存到 D:/WorkBuddy练习/问卷分析报告.md。\n执行要求：开始前先列处理计划，等我确认后再执行；不要编造表格里没有的数据；字段看不懂先问我；不要覆盖原文件。' },
    ],
    sidebar: { type: 'note', title: '名词解释', items: ['Markdown：适合保存报告和清单的轻量文本格式。', '执行边界：告诉 AI 哪些事不能擅自做。'] },
  },
  {
    num: '06', title: '文件与资料整理 — 让 AI 先读材料，再输出结构化初稿', color: '#8B5CF6',
    content: [
      { type: 'p', text: '本页目标：能让 WorkBuddy 总结 PDF、Word 或多份资料，并先确认读取范围。' },
      { type: 'p', text: '教师日常有大量材料整理场景：政策文件、会议纪要、培训资料、项目申报材料、活动方案。WorkBuddy 适合做第一遍粗整理，把材料读完、提炼重点、整理成结构。' },
      { type: 'p', text: '· 单文件任务：重点写清文件路径、输出结构、保存位置。' },
      { type: 'p', text: '· 多文件任务：先让它列出准备读取哪些文件，再确认执行。' },
      { type: 'p', text: '· 正式使用前，先检查结果是否来自原始资料。' },
      { type: 'code', text: '本地 PDF/Word 总结\n请读取 D:/WorkBuddy练习/项目资料.pdf，帮我提炼核心内容，输出一份包含背景、重点、风险、建议的 Markdown 总结，保存到 D:/WorkBuddy练习/项目资料总结.md。执行前先列处理计划。' },
      { type: 'code', text: '多资料会议准备\n请读取 D:/WorkBuddy练习/会议资料/ 文件夹里的 Word 和 PDF，先列出准备读取的文件，再帮我整理一份会议准备材料。结构包括：会议背景、核心议题、已有资料重点、需要追问的问题、下一步建议。生成 Markdown 文件保存到 D:/WorkBuddy练习/会议准备.md。' },
    ],
    sidebar: { type: 'checklist', title: '检查重点', items: ['读取范围是否正确', '是否保存到指定路径', '是否出现原文没有的数据'] },
  },
  {
    num: '07', title: '表格、问卷与周报 — 选择能验证的任务，最容易建立信任', color: '#EF4444',
    content: [
      { type: 'p', text: '本页目标：能让 WorkBuddy 先识别字段，再做统计、结论和报告。' },
      { type: 'p', text: '问卷和表格分析很适合作为第一次练习，因为它有没有读到文件、字段有没有识别对、数据有没有乱编，都比较容易检查。周报、日报、复盘适合把零散记录整理成初稿。' },
      { type: 'table', headers: ['任务', '适合输入', '输出'],
        rows: [
          ['问卷分析', '问卷.xlsx、报名表、反馈表', '数量、占比、问题、建议'],
          ['周报日报', '本周记录.md、会议记录', '正式但不空的初稿'],
          ['复盘总结', '活动记录、项目资料', '进展、问题、下一步'],
        ],
      },
      { type: 'code', text: '周报初稿\n请读取 D:/工作周报/本周记录.md，整理成一份周报初稿。结构包括：本周完成、关键进展、遇到的问题、下周计划、需要协同的事项。语气正式但不要太空，保存到 D:/工作周报/本周周报.md。' },
    ],
    sidebar: { type: 'note', title: '名词解释', items: ['字段：表格里的列名，例如年级、学科、满意度、反馈内容。'] },
  },
  {
    num: '08', title: 'PPT 与课程材料 — 先要大纲，再做页面，返工会少很多', color: '#F59E0B',
    content: [
      { type: 'p', text: '本页目标：能让 WorkBuddy 生成 PPT 框架，而不是直接追求最终成品。' },
      { type: 'p', text: '做课件或汇报时，不建议一上来要求 AI 直接生成完整 PPT。更稳的方式是先让它输出结构：几页、每页标题、核心观点、建议图表、还缺哪些资料。' },
      { type: 'p', text: '· 先确认内容结构，再进入页面制作。' },
      { type: 'p', text: '· 每页都要有明确目的：讲清概念、展示数据、引导操作或完成练习。' },
      { type: 'p', text: '· 教师课件尤其要保留复核环节，避免漂亮但不准确。' },
      { type: 'code', text: 'PPT 大纲\n请根据 D:/WorkBuddy练习/项目资料.md，帮我生成一份 10 页汇报 PPT 大纲。每页包括：页标题、核心观点、页面内容要点、建议图表形式。先不要制作 PPT 文件，只输出大纲让我确认。' },
      { type: 'tip', color: '#F59E0B', label: '课堂提醒', text: 'PPT 第一版是草稿，不是成品；教师要负责最终判断。' },
    ],
    sidebar: { type: 'note', title: '名词解释', items: ['大纲：先确定每页讲什么。', '图表形式：柱状图、流程图、对比表、时间线等。'] },
  },
  {
    num: '09', title: '专家、技能、连接器 — 先知道入口分别解决什么问题', color: '#EC4899',
    content: [
      { type: 'p', text: '本页目标：能理解专家、技能、专家团和连接器的区别。' },
      { type: 'p', text: 'WorkBuddy 里除了普通对话，还有专家、技能、连接器等入口。新手不必全部研究透，但要知道它们分别解决什么问题。' },
      { type: 'table', headers: ['名称', '可以怎么理解', '新手怎么用'],
        rows: [
          ['专家', '给 AI 换一个专业角色', '先找现成专家，不急着创建'],
          ['技能', '某类任务的操作流程', '先用现成技能跑几次'],
          ['专家团', '多个专家协作', '复杂任务再用'],
          ['连接器', '接入外部工具', '基础任务跑通后再配置'],
        ],
      },
      { type: 'tip', color: '#EC4899', label: '使用顺序', text: '普通任务跑通 → 熟悉提示词 → 再研究技能、专家和连接器。' },
    ],
    sidebar: { type: 'note', title: '名词解释', items: ['专家：预设专业角色。', '技能：固定流程能力。', '连接器：连接邮箱、会议、文档等外部工具。'] },
  },
  {
    num: '10', title: '批量处理与自动化 — 越能批量执行，越要先做样本验证', color: '#14B8A6',
    content: [
      { type: 'p', text: '本页目标：能先做分类方案和样本验证，再批量处理或自动化。' },
      { type: 'p', text: '批量文件处理和自动化很有价值，但也是新手最容易出错的地方。因为一旦任务说不清楚，它会稳定地执行错很多次。' },
      { type: 'p', text: '· 批量整理：先列文件清单和分类方案，不要直接移动原文件。' },
      { type: 'p', text: '· 自动化：先手动跑通两次，结果稳定后再设置定时任务。' },
      { type: 'p', text: '· 所有自动化都要写清异常处理：找不到文件时先提醒，不要生成空报告。' },
      { type: 'code', text: '批量文件整理\n请读取 D:/WorkBuddy练习/待整理文件/，先列出文件清单，然后根据文件名和内容判断适合分成哪些类别。先不要移动文件，只输出分类方案。等我确认后，再把文件复制到对应分类文件夹。不要删除原文件。' },
      { type: 'code', text: '自动化日报\n每天晚上 18:00，读取 D:/工作周报/今日记录.md，整理成一份日报，包含今日完成、遇到问题、明日计划三部分，保存到 D:/工作周报/日报/，文件名使用当天日期。执行前如果找不到文件，不要新建空报告，先提醒我。' },
      { type: 'tip', color: '#EF4444', label: '风险提醒', text: '批量任务：先复制，不直接移动；先方案，不直接执行。' },
    ],
    sidebar: { type: 'note', title: '操作原则', items: ['批量任务先列方案，确认后再执行', '自动化先手动跑通两次', '写清找不到文件时的处理方式', '先复制不直接移动原文件'] },
  },
  {
    num: '11', title: '远程控制 — 不在电脑前，也要写清路径与异常处理', color: '#6366F1',
    content: [
      { type: 'p', text: '本页目标：能写清远程任务的路径、输出位置和找不到文件时的处理方式。' },
      { type: 'p', text: 'WorkBuddy 支持通过手机或办公工具远程下任务。它的价值不是让 AI 更聪明，而是让电脑在你不坐在旁边时，也能开始整理资料、生成日报或处理文件。' },
      { type: 'p', text: '· 前提：电脑开着，WorkBuddy 保持运行。' },
      { type: 'p', text: '· 远程任务更要写完整路径，因为你不一定能马上检查。' },
      { type: 'p', text: '· 涉及本地文件时，优先使用练习文件夹或固定工作目录。' },
      { type: 'code', text: '远程日报任务\n请读取 D:/工作周报/今日记录.md，整理成今日复盘，保存到 D:/工作周报/日报/。如果找不到文件，先回复我，不要生成空文档。' },
      { type: 'tip', color: '#EF4444', label: '安全提醒', text: '远程任务要写"找不到文件先问我"，避免生成空文档。' },
    ],
    sidebar: { type: 'note', title: '名词解释', items: ['云端工作：任务在云端环境运行。', '连接电脑：远程操控本地电脑处理文件。', '前提：电脑开着，WorkBuddy 保持运行，路径提前规划好。'] },
  },
  {
    num: '12', title: '第一日路线 — 跑通一次，比看完所有功能更重要', color: '#00C48C',
    content: [
      { type: 'p', text: '本页目标：能按第一天路线完成一次完整闭环。' },
      { type: 'p', text: '真正的入门不是把所有菜单都背下来，而是能从安装开始，跑通一次可检查的小任务。建议教师培训按下面路线实操。' },
      { type: 'table', headers: ['步骤', '动作', '检查点'],
        rows: [
          ['1', '安装并登录 WorkBuddy', '能进入主界面'],
          ['2', '建立 D:/WorkBuddy练习/', '文件夹位置固定'],
          ['3', '放入一份问卷.xlsx', '只用练习文件'],
          ['4', '默认权限 + Plan 模式', '先列计划再执行'],
          ['5', '输入第一条任务指令', '包含路径、目标、保存位置'],
          ['6', '检查输出报告', '文件、字段、数据、路径都正确'],
        ],
      },
      { type: 'p', text: '完成标准：' },
      { type: 'checklist', items: ['能找到输出文件', '能说明 AI 读了哪个原文件', '能指出至少 2 项需要人工复核的内容'] },
      { type: 'tip', color: '#00C48C', label: '教师提醒', text: 'WorkBuddy 适合做第一版，最终判断仍然由教师负责。' },
    ],
    sidebar: { type: 'checklist', title: '复核清单', items: ['文件有没有读对', '字段有没有识别错', '数据有没有乱编', '结论是否来自原始资料', '文件是否保存到指定路径'] },
  },
  {
    num: 'A①', title: '提示词清单：办公任务可直接改写', color: '#6366F1',
    content: [
      { type: 'p', text: '本页目标：把常用提示词单独集中，方便教师复制、改路径、替换文件名。' },
      { type: 'p', text: '改写方法：先改路径 → 再改任务目标 → 最后改输出结构和保存位置。不要省略：执行前先列计划、不确定先问我、不要覆盖原文件。' },
      { type: 'h3', text: '第一条任务：问卷分析报告' },
      { type: 'code', text: '请读取 D:/WorkBuddy练习/问卷.xlsx，帮我做一份问卷分析报告。\n任务要求：1. 先识别表格字段；2. 统计主要选项数量和占比；3. 从反馈中提炼 5 个高频问题；4. 总结 3 个核心结论；5. 给出 5 条优化建议；6. 生成 Markdown 报告，保存到 D:/WorkBuddy练习/问卷分析报告.md。\n执行要求：开始前先列处理计划，等我确认后再执行；不要编造表格里没有的数据；字段看不懂先问我；不要覆盖原文件。' },
      { type: 'h3', text: '本地 PDF/Word 总结' },
      { type: 'code', text: '请读取 D:/WorkBuddy练习/项目资料.pdf，帮我提炼核心内容，输出一份包含背景、重点、风险、建议的 Markdown 总结，保存到 D:/WorkBuddy练习/项目资料总结.md。执行前先列处理计划。' },
      { type: 'h3', text: '多资料会议准备' },
      { type: 'code', text: '请读取 D:/WorkBuddy练习/会议资料/ 文件夹里的 Word 和 PDF，先列出准备读取的文件，再帮我整理一份会议准备材料。结构包括：会议背景、核心议题、已有资料重点、需要追问的问题、下一步建议。生成 Markdown 文件保存到 D:/WorkBuddy练习/会议准备.md。' },
      { type: 'h3', text: '周报初稿' },
      { type: 'code', text: '请读取 D:/工作周报/本周记录.md，整理成一份周报初稿。结构包括：本周完成、关键进展、遇到的问题、下周计划、需要协同的事项。语气正式但不要太空，保存到 D:/工作周报/本周周报.md。' },
    ],
    sidebar: { type: 'note', title: '改写方法', items: ['先改路径', '再改任务目标', '最后改输出结构和保存位置', '不要省略：执行前先列计划', '不要省略：不确定先问我', '不要省略：不要覆盖原文件'] },
  },
  {
    num: 'A②', title: '提示词清单：PPT、批量、远程与自动化', color: '#8B5CF6',
    content: [
      { type: 'p', text: '本页目标：这些提示词风险更高，必须保留边界语句。' },
      { type: 'h3', text: 'PPT 大纲' },
      { type: 'code', text: '请根据 D:/WorkBuddy练习/项目资料.md，帮我生成一份 10 页汇报 PPT 大纲。每页包括：页标题、核心观点、页面内容要点、建议图表形式。先不要制作 PPT 文件，只输出大纲让我确认。' },
      { type: 'h3', text: '批量文件整理' },
      { type: 'code', text: '请读取 D:/WorkBuddy练习/待整理文件/，先列出文件清单，然后根据文件名和内容判断适合分成哪些类别。先不要移动文件，只输出分类方案。等我确认后，再把文件复制到对应分类文件夹。不要删除原文件。' },
      { type: 'h3', text: '远程日报任务' },
      { type: 'code', text: '请读取 D:/工作周报/今日记录.md，整理成今日复盘，保存到 D:/工作周报/日报/。如果找不到文件，先回复我，不要生成空文档。' },
      { type: 'h3', text: '自动化日报' },
      { type: 'code', text: '每天晚上 18:00，读取 D:/工作周报/今日记录.md，整理成一份日报，包含今日完成、遇到问题、明日计划三部分，保存到 D:/工作周报/日报/，文件名使用当天日期。执行前如果找不到文件，不要新建空报告，先提醒我。' },
    ],
    sidebar: { type: 'note', title: '高风险任务', items: ['批量移动文件', '自动化定时执行', '远程处理本地文件', '建议顺序：手动跑通 → 调整指令 → 再跑一次 → 结果稳定 → 再自动化'] },
  },
  {
    num: 'B', title: '名词解释：教师版简明表', color: '#F59E0B',
    content: [
      { type: 'p', text: '本页目标：用课堂语言解释常见术语，避免把入门课讲成技术课。' },
      { type: 'table', headers: ['术语', '简明解释'],
        rows: [
          ['WorkBuddy', '面向办公与开发任务的桌面 AI 助理，可以围绕本地文件和工具执行任务。'],
          ['Agent', '能理解目标、拆解步骤并调用工具执行的 AI 工作流角色。'],
          ['模型', 'WorkBuddy 背后的大脑，不同模型在写作、表格、代码等任务上表现不同。'],
          ['工作空间', 'WorkBuddy 读写文件、保存产物和中间过程的项目文件夹。'],
          ['绝对路径', '从盘符或根目录开始的完整文件地址，例如 D:/WorkBuddy练习/问卷.xlsx。'],
          ['默认权限', '较保守的执行范围，遇到风险动作会要求确认，适合新手。'],
          ['完全权限', '更大的读写和执行范围，效率高但风险也高，适合熟悉后使用。'],
          ['沙箱', '受限制的安全工作区，用来降低 AI 误操作影响范围。'],
          ['Ask', '只问答、不动手，适合问概念、想方案、改提示词。'],
          ['Plan', '先列计划，确认后再执行，新手处理文件时最推荐。'],
          ['Craft', '直接执行任务，适合流程明确、风险可控的任务。'],
          ['专家', '预设好角色、能力和知识的垂直 Agent。'],
          ['技能', '针对某类固定任务的操作流程或工具能力。'],
          ['连接器', '把 WorkBuddy 接入邮箱、会议、文档、日程等外部工具的接口。'],
          ['自动化', '把稳定任务按时间或条件反复执行。'],
          ['记忆', '长期希望 AI 遵守的规则，不适合塞太多临时要求。'],
          ['Markdown', '轻量文本格式，适合保存报告、周报、清单和会议材料。'],
          ['API Key', '调用外部模型或服务时使用的密钥，不能随意公开。'],
        ],
      },
      { type: 'tip', color: '#F59E0B', label: '收束句', text: '能跑通一条任务、能检查结果，就已经入门。' },
    ],
    sidebar: { type: 'note', title: '讲解原则', items: ['先用办公比喻解释', '只讲和当前任务相关的词', '不要一次塞太多英文术语', '能跑通一条任务就算入门'] },
  },
];

interface GuidePageProps { onClose: () => void; }

export default function GuidePage({ onClose }: GuidePageProps) {
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);
  const [termRect, setTermRect] = useState<DOMRect | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeTab, setActiveTab] = useState<'feishu' | 'pdf'>('feishu');
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleHover = (term: string, rect: DOMRect) => { setHoveredTerm(term); setTermRect(rect); };

  const scrollToChapter = (idx: number) => {
    chapterRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveChapter(idx);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      const scrollTop = container.scrollTop;
      let current = 0;
      chapterRefs.current.forEach((ref, i) => { if (ref && ref.offsetTop - 120 <= scrollTop) current = i; });
      setActiveChapter(current);
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [activeTab]);

  const chapters = activeTab === 'feishu' ? FEISHU_CHAPTERS : PDF_CHAPTERS;

  const renderContent = (item: Record<string, unknown>) => {
    const onH = handleHover;
    if (item.type === 'p') return <p className="text-[15px] text-gray-700 leading-relaxed mb-3"><HL text={item.text as string} onHover={onH} /></p>;
    if (item.type === 'h3') return <h3 className="text-base font-bold text-gray-900 mt-5 mb-2">{item.text as string}</h3>;
    if (item.type === 'code') return <CodeBlock>{item.text as string}</CodeBlock>;
    if (item.type === 'tip') return <Tip color={item.color as string} label={item.label as string}><HL text={item.text as string} onHover={onH} /></Tip>;
    if (item.type === 'checklist') return <Checklist items={item.items as string[]} color="#00C48C" />;
    if (item.type === 'table') return <InfoTable headers={item.headers as string[]} rows={item.rows as string[][]} />;
    return null;
  };

  const renderSidebar = (sidebar: Record<string, unknown>, color: string) => {
    return (
      <div className="sticky top-20">
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-white" style={{ background: color }}>
            {sidebar.title as string}
          </div>
          <div className="p-4 bg-gray-50 space-y-2">
            {sidebar.type === 'note' && (sidebar.items as string[]).map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
            {sidebar.type === 'table' && (
              <div className="space-y-2">
                {(sidebar.headers as string[]).map((h, i) => (
                  <div key={i} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</div>
                ))}
                {(sidebar.rows as string[][]).map((row, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${row[2]?.includes('✅') ? 'bg-green-50' : row[2]?.includes('❌') ? 'bg-red-50' : 'bg-yellow-50'}`}>
                    <span className="text-xs font-medium text-gray-600 w-16 flex-shrink-0">{row[0]}</span>
                    <span className="text-xs font-mono text-gray-700 flex-1">{row[1]}</span>
                    <span className="text-xs flex-shrink-0">{row[2]}</span>
                  </div>
                ))}
              </div>
            )}
            {sidebar.type === 'models' && (sidebar.models as Array<{ name: string; tag: string; desc: string }>).map((m, i) => (
              <div key={i} className={`p-2 rounded-lg border ${i === 0 ? 'border-[#00C48C] bg-[#00C48C]/5' : 'border-gray-100 bg-white'}`}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-800">{m.name}</span>
                  {m.tag && <span className="text-xs bg-[#00C48C]/15 text-[#00C48C] px-1.5 rounded">{m.tag}</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
              </div>
            ))}
            {sidebar.type === 'compare' && (sidebar.items as Array<{ label: string; desc: string; tag: string; color: string }>).map((item, i) => (
              <div key={i} className="p-3 rounded-xl border" style={{ borderColor: item.color + '40', background: item.color + '08' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full text-white" style={{ background: item.color }}>{item.tag}</span>
                </div>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ animation: 'slideUp 0.3s cubic-bezier(0.23,1,0.32,1) forwards' }}>
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 flex-shrink-0 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={15} /> 返回演示
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-[#00C48C]" />
            <span className="text-sm font-semibold text-gray-800">WorkBuddy 功能指南</span>
          </div>
          {/* Tab 切换 */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => { setActiveTab('feishu'); setActiveChapter(0); chapterRefs.current = []; }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'feishu' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              飞书文档（13章）
            </button>
            <button onClick={() => { setActiveTab('pdf'); setActiveChapter(0); chapterRefs.current = []; }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'pdf' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              教师手册（附录）
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* 章节快速导航 */}
          <div className="hidden lg:flex items-center gap-1">
            {chapters.map((ch, i) => (
              <button key={i} onClick={() => scrollToChapter(i)}
                className={`px-2 py-1 rounded text-xs font-mono transition-all ${activeChapter === i ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}>
                {ch.num}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* 主内容 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="px-8 py-14 bg-gray-950 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs font-mono text-[#00C48C] mb-3 tracking-widest uppercase">
              {activeTab === 'feishu' ? 'WorkBuddy · 保姆级入门指南' : 'WorkBuddy · 教师入门手册'}
            </div>
            <h1 className="text-5xl font-black leading-none mb-5 tracking-tight">
              {activeTab === 'feishu' ? <>从安装到<br /><span className="text-[#00C48C]">跑通第一个</span><br />办公任务</> : <>从安装到<br /><span className="text-[#00C48C]">可靠完成</span><br />文件任务</>}
            </h1>
            <p className="text-gray-400 text-base max-w-xl leading-relaxed">
              {activeTab === 'feishu'
                ? '共 13 章，覆盖安装登录、工作空间、模型选择、权限设置、任务模式、六大能力、提示词写法到自动化。所有专业名词均有解释，悬停即可查看。'
                : '教师版手册附录，包含完整提示词清单和名词解释对照表，可直接复制改写使用。'}
            </p>
            <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
              <span>📖 {chapters.length} 个章节</span>
              <span>📝 {Object.keys(GLOSSARY).length}+ 名词解释</span>
              <span>💡 提示词模板</span>
              <span>✅ 操作清单</span>
            </div>
          </div>
        </div>

        {/* 章节内容 */}
        <div className="max-w-5xl mx-auto px-8">
          {chapters.map((ch, idx) => (
            <div key={idx} ref={el => { chapterRefs.current[idx] = el; }} className="py-14 border-b border-gray-100 last:border-0">
              {/* 章节标题 */}
              <div className="flex items-start gap-5 mb-8">
                <div className="font-black text-7xl leading-none text-gray-100 select-none flex-shrink-0 -mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {ch.num}
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: ch.color }}>Chapter {ch.num}</div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">{ch.title}</h2>
                </div>
              </div>

              {/* 正文 + 侧边栏 */}
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">
                  {ch.content.map((item, i) => (
                    <div key={i}>{renderContent(item as Record<string, unknown>)}</div>
                  ))}
                </div>
                <div className="col-span-1">
                  {ch.sidebar && renderSidebar(ch.sidebar as Record<string, unknown>, ch.color)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部 */}
        <div className="bg-gray-950 text-white px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-3xl font-black mb-3">准备好了吗？</div>
            <p className="text-gray-400 mb-5 text-sm">回到演示界面，亲自体验 WorkBuddy 的各项功能</p>
            <button onClick={onClose}
              className="px-8 py-3 bg-[#00C48C] text-white font-semibold rounded-xl hover:bg-[#00A876] transition-colors text-sm">
              返回演示界面 →
            </button>
          </div>
        </div>
      </div>

      {/* 名词解释悬浮卡片 */}
      {hoveredTerm && termRect && (
        <GlossaryTooltip term={hoveredTerm} rect={termRect} onClose={() => { setHoveredTerm(null); setTermRect(null); }} />
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}

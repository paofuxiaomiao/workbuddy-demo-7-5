# WorkBuddy 功能演示网页 - 设计方案

## 三种设计方向

### 方案 A: 原生复刻 (Probability: 0.08)
完全像素级还原 WorkBuddy 桌面客户端界面，灰白色调，macOS 风格窗口，让用户产生"真实使用"的沉浸感。

### 方案 B: 教学导览式 (Probability: 0.05)
在原界面基础上叠加明亮的高亮引导层，像产品 Tour 一样逐步引导，适合完全不了解产品的新手。

### 方案 C: 轻量仿真 + 弹窗介绍 (Probability: 0.07)
高度还原 WorkBuddy 界面外观，但每个可点击区域有微妙的悬停提示，点击后弹出精致的功能介绍卡片，兼顾真实感与教学目的。

---

## 选定方案：方案 C — 轻量仿真 + 弹窗介绍

### Design Movement
macOS 原生应用风格 (Human Interface Guidelines) + 现代 SaaS 产品演示页风格

### Core Principles
1. **高保真还原**：界面布局、颜色、字体尽量贴近真实 WorkBuddy 截图
2. **交互直觉**：所有可点击元素有 hover 状态，点击后弹出功能介绍，不破坏界面结构
3. **教学优先**：弹窗内容简洁清晰，配合图标和分点说明，适合零基础用户
4. **轻量动效**：弹窗出现/消失有流畅动画，不过度炫技

### Color Philosophy
- 主色：WorkBuddy 品牌绿 `#00C48C` (teal-green)
- 背景：纯白 `#FFFFFF` + 浅灰侧边栏 `#F5F5F5`
- 文字：深灰 `#1A1A1A` 主文字，中灰 `#6B7280` 次要文字
- 强调：绿色高亮用于选中状态和 CTA 按钮
- 弹窗：白色卡片 + 轻微阴影，顶部绿色装饰条

### Layout Paradigm
三栏布局：左侧导航栏(260px) + 中央主内容区 + 右侧（可选）
完全模拟桌面应用布局，非传统网页居中布局

### Signature Elements
1. 左侧导航栏带有任务列表和空间列表，可点击展开
2. 中央对话区域带有 Craft/Ask/Plan 模式切换
3. 底部工具栏带有技能、自动化等快捷入口

### Interaction Philosophy
- 鼠标悬停在可交互区域时，出现绿色虚线边框 + 小问号图标提示
- 点击后弹出功能介绍 Modal，包含功能名称、描述、使用场景
- 弹窗右上角有关闭按钮，点击背景也可关闭
- 首次进入时有一个简短的欢迎引导提示

### Animation
- 弹窗：`scale(0.95) opacity(0)` → `scale(1) opacity(1)`，200ms ease-out
- 悬停边框：100ms transition
- 侧边栏展开/收起：150ms ease-out

### Typography System
- 标题：`PingFang SC` / `Microsoft YaHei` / `system-ui`，字重 600
- 正文：系统默认中文字体，字重 400，行高 1.6
- 代码/标签：等宽字体

### Brand Essence
WorkBuddy 演示站 — 为初学者而生的交互式产品导览，让每一次点击都是一次发现。
个性形容词：亲切、清晰、专业

### Brand Voice
- 标题示例："点击任意功能，立即了解它能为你做什么"
- 引导示例："试试点击左侧的「专家」，看看 100+ 行业专家如何为你服务"

## Style Decisions
- 严格遵循 WorkBuddy 截图中的颜色和布局，不做过度创意发挥
- 弹窗使用绿色顶部装饰条 + 白色卡片，与品牌色保持一致
- 可点击区域使用 `cursor-pointer` + 绿色虚线 hover 效果

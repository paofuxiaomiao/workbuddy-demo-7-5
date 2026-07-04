// WorkBuddy 专家面板组件 - 还原专家/技能/连接器界面

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { FeatureInfo } from '@/data/features';

interface ExpertPanelProps {
  onFeatureClick: (feature: FeatureInfo) => void;
}

// 进度追踪回调（从外部传入）
interface ExpertPanelPropsExt extends ExpertPanelProps {
  onExpertClick?: () => void;
}

const expertCategories = [
  { name: '内容创作', experts: ['内容创作专家团', '内容创作专家', '小红书运营专家'], img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=120&fit=crop' },
  { name: '投资分析', experts: ['交易分析团队', '股票研究专家', '腾讯自选股票投研专家团'], img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=120&fit=crop' },
  { name: '法律咨询', experts: ['法律检索专家', '资深合同法务专家', '财税合规专家团'], img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=120&fit=crop' },
  { name: '小微企业', experts: ['销售教练', '微信公众号运营专家', '创业伙伴'], img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=120&fit=crop' },
];

const expertList = [
  { name: '美团生活助手', author: '领券下单找我', tags: ['美团优惠', '团购下单', '生活服务'], desc: '帮您一键领取美团优惠券，搜索附近团购并下单，探索今日活动，覆盖餐饮饮品等生活服务，省钱省心。' },
  { name: '高考我帮你', author: '专业高考顾问', tags: ['高考真题', '一分一段', '志愿填报'], desc: '考前刷真题作文，考后一分一段换算，报志愿查院校专业，一站式搞定高考全周期', badge: 'Beta' },
  { name: '高级开发工程师', author: '吴八哥', tags: ['高级开发', '架构设计', '代码质量'], desc: '10年以上全栈经验，精通多种语言和框架，是团队的技术中坚' },
  { name: '内容创作专家', author: '文博凯', tags: ['内容策略', '多平台创作', '品牌叙事'], desc: '擅长创作引人入胜的多平台内容，让品牌故事触达目标受众' },
  { name: '行业场景研究员', author: '福帮手', tags: ['行业调研', '流程补位', '行动包'], desc: '围绕一个行业场景定位关键工作流缺口，并交付补位卡、3天行动计划、项目动作执行包和下一步建议。' },
  { name: '资讯速递专家', author: '数字生命卡兹克', tags: ['AI 资讯', '每日简报', 'AI 行业动态'], desc: '一句话查到每天精选的 AI 模型/产品/行业/论文动态，自动整理成中文简报，免配置免登录。', badge: '特邀专家' },
];

export default function ExpertPanel({ onFeatureClick }: ExpertPanelProps) {
  const [tab, setTab] = useState<'expert' | 'skill' | 'connector'>('expert');
  const [listTab, setListTab] = useState<'expert' | 'team'>('expert');

  const handleExpertClick = () => {
    import('@/data/features').then(m => onFeatureClick(m.features.expert));
  };

  const handleSkillClick = () => {
    import('@/data/features').then(m => onFeatureClick(m.features.skills));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 顶部 Tab */}
      <div className="flex items-center gap-1 px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex gap-1 flex-1">
          {(['expert', 'skill', 'connector'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t === 'skill') handleSkillClick(); if (t === 'connector') import('@/data/features').then(m => onFeatureClick(m.features.skills)); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-[#00C48C]/10 text-[#00C48C]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              {t === 'expert' ? '专家' : t === 'skill' ? '技能' : '连接器'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Search size={14} />
          <span>搜索专家职称或描述</span>
        </div>
        <button onClick={handleExpertClick} className="text-sm text-[#00C48C] hover:underline ml-2">我的专家</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'expert' && (
          <div className="p-4 space-y-6">
            {/* 精选场景 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">精选场景</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {expertCategories.map(cat => (
                  <div
                    key={cat.name}
                    onClick={handleExpertClick}
                    className="flex-shrink-0 w-48 rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-20 overflow-hidden">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <p className="absolute bottom-2 left-3 text-white text-sm font-medium">{cat.name}</p>
                    </div>
                    <div className="p-2 bg-white">
                      {cat.experts.map(e => (
                        <div key={e} className="flex items-center gap-1.5 py-0.5">
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />
                          <span className="text-xs text-gray-600 truncate">{e}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 专家列表 */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => setListTab('expert')} className={`text-sm font-medium ${listTab === 'expert' ? 'text-gray-900' : 'text-gray-400'}`}>专家</button>
                <button onClick={() => { setListTab('team'); handleExpertClick(); }} className={`text-sm font-medium ${listTab === 'team' ? 'text-gray-900' : 'text-gray-400'}`}>专家团</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {expertList.map(expert => (
                  <div
                    key={expert.name}
                    onClick={handleExpertClick}
                    className="border border-gray-100 rounded-xl p-3 cursor-pointer hover:border-[#00C48C]/40 hover:bg-[#00C48C]/3 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C48C] to-[#6366F1] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-semibold text-gray-900 truncate">{expert.name}</p>
                          {expert.badge && <span className="text-xs bg-gray-100 text-gray-500 px-1 rounded flex-shrink-0">{expert.badge}</span>}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{expert.author}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{expert.desc}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {expert.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 'skill' && (
          <div className="p-4 flex flex-col items-center justify-center h-48 text-gray-400 cursor-pointer" onClick={handleSkillClick}>
            <div className="text-4xl mb-3">🔧</div>
            <p className="text-sm font-medium text-gray-600">技能市场</p>
            <p className="text-xs mt-1">3200+ 技能，点击了解更多</p>
          </div>
        )}
        {tab === 'connector' && (
          <div className="p-4 flex flex-col items-center justify-center h-48 text-gray-400 cursor-pointer" onClick={handleSkillClick}>
            <div className="text-4xl mb-3">🔗</div>
            <p className="text-sm font-medium text-gray-600">连接器（MCP）</p>
            <p className="text-xs mt-1">打通腾讯生态及第三方服务，点击了解更多</p>
          </div>
        )}
      </div>
    </div>
  );
}

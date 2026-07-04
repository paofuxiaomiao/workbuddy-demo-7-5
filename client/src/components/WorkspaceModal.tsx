// WorkBuddy 工作空间选择弹窗
// 还原真实的工作空间选择界面

import { useState } from 'react';
import { X, Folder, FolderOpen, Search, Plus, Clock, Star } from 'lucide-react';

const RECENT_WORKSPACES = [
  { name: '2026-07-03-01-39-42', path: '/Users/mojo/WorkBuddy/2026-07-03-01-39-42', time: '2小时前', size: '23 MB' },
  { name: '2026-07-03-00-09-51', path: '/Users/mojo/WorkBuddy/2026-07-03-00-09-51', time: '4小时前', size: '8 MB' },
  { name: 'WorkBuddy演示项目', path: '/Users/mojo/Projects/WorkBuddy演示项目', time: '昨天', size: '156 MB', starred: true },
  { name: '20260425132623', path: '/Users/mojo/WorkBuddy/20260425132623', time: '2个月前', size: '45 MB' },
  { name: '2026-06-11-00-10-07', path: '/Users/mojo/WorkBuddy/2026-06-11-00-10-07', time: '3周前', size: '12 MB' },
  { name: 'D:/WorkBuddy/', path: 'D:/WorkBuddy/', time: '1周前', size: '234 MB', starred: true },
  { name: 'D:/WorkBuddy练习/', path: 'D:/WorkBuddy练习/', time: '5天前', size: '67 MB' },
];

interface WorkspaceModalProps {
  onClose: () => void;
  onSelect: (name: string) => void;
}

export default function WorkspaceModal({ onClose, onSelect }: WorkspaceModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<'recent' | 'starred'>('recent');

  const filtered = RECENT_WORKSPACES.filter(ws =>
    ws.name.toLowerCase().includes(search.toLowerCase()) ||
    ws.path.toLowerCase().includes(search.toLowerCase())
  ).filter(ws => tab === 'starred' ? ws.starred : true);

  const handleSelect = (name: string) => {
    setSelected(name);
    setTimeout(() => {
      onSelect(name);
      onClose();
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: 520, maxHeight: 560, animation: 'modalIn 0.2s cubic-bezier(0.23,1,0.32,1) forwards' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} className="text-[#00C48C]" />
            <span className="text-sm font-semibold text-gray-800">选择工作空间</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* 搜索栏 */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#00C48C]/50 transition-colors">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent"
              placeholder="搜索工作空间名称或路径..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex items-center gap-1 px-5 pb-3">
          <button
            onClick={() => setTab('recent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'recent' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Clock size={12} /> 最近使用
          </button>
          <button
            onClick={() => setTab('starred')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'starred' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Star size={12} /> 已收藏
          </button>
        </div>

        {/* 快捷选项 */}
        <div className="px-5 pb-3 flex gap-2">
          <button
            onClick={() => handleSelect('新工作空间')}
            className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-[#00C48C]/40 rounded-xl text-xs text-[#00C48C] hover:bg-[#00C48C]/5 transition-colors"
          >
            <Plus size={12} /> 从新工作空间开始
          </button>
          <button
            onClick={() => handleSelect('本地文件夹')}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Folder size={12} /> 打开本地文件夹
          </button>
        </div>

        {/* 工作空间列表 */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Folder size={24} className="mb-2 opacity-40" />
              <p className="text-sm">没有找到匹配的工作空间</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map(ws => (
                <button
                  key={ws.name}
                  onClick={() => handleSelect(ws.name)}
                  className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left transition-all ${
                    selected === ws.name
                      ? 'bg-[#00C48C]/10 border border-[#00C48C]/30'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ws.starred ? 'bg-amber-50' : 'bg-gray-100'}`}>
                    <Folder size={16} className={ws.starred ? 'text-amber-500' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-800 truncate">{ws.name}</span>
                      {ws.starred && <Star size={11} className="text-amber-400 flex-shrink-0" fill="currentColor" />}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{ws.path}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-gray-400">{ws.time}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{ws.size}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 底部说明 */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400 leading-relaxed">
            💡 工作空间是 AI 执行任务时的"办公桌"，生成的文件都会保存在这里。建议为不同项目使用不同的工作空间。
          </p>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}


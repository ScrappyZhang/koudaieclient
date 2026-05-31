import React, { useState } from 'react';
import { ChevronLeft, Search, Plus, Calendar, Mic, Image, MapPin, PlayCircle, Sparkles, Pencil, Trash2, MoreHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerNotesPageProps {
  onBack: () => void;
  onAddNote?: () => void;
  onCustomerClick?: (customerName: string) => void;
}

interface Note {
  id: number;
  customerName: string;
  customerAvatar: string;
  avatarColor: string;
  type: '面访笔记' | '电话沟通' | '常规记录';
  fullContent: string;
  time: string;
  date: string;
  aiInsights?: string[]; // AI录入时生成，旧笔记可能没有
  location?: string;
  hasAudio?: boolean;
  audioDuration?: string;
  hasImages?: boolean;
  imageCount?: number;
  isExpanded?: boolean;
}

const CustomerNotesPage: React.FC<CustomerNotesPageProps> = ({ onBack, onAddNote, onCustomerClick }) => {
  const [activeTab, setActiveTab] = useState('全部');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); // 当前打开的菜单
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      customerName: '邱泽欣',
      customerAvatar: '邱',
      avatarColor: 'from-blue-400 to-purple-400',
      type: '电话沟通',
      fullContent: '客户名下平安家庭保 A 款 (2025 版) 将于 2026 年 4 月 26 日到期，暂未续保。主要原因是客户未接听电话，需要进一步跟进确认续保意向。客户表示最近比较忙，会在下周给回复。',
      time: '今天 18:10',
      date: '4 月 25 日',
      aiInsights: ['续保意向待确认', '价格敏感度中等', '建议 3 天内二次跟进'],
      hasAudio: true,
      audioDuration: '1 分 33 秒',
      isExpanded: false,
    },
    {
      id: 2,
      customerName: '陈伟',
      customerAvatar: '陈',
      avatarColor: 'from-pink-400 to-rose-400',
      type: '面访笔记',
      fullContent: '今天下午 3 点在客户公司见面，主要讨论家庭保单续保事宜。客户表示已经购买了某互联网保险公司的产品，年缴保费比我们低约 30%。但客户也承认我们的服务更到位，理赔响应更快。客户有两个孩子，对家庭保障需求强烈。',
      time: '今天 16:30',
      date: '4 月 25 日',
      location: '深圳市福田区',
      aiInsights: ['客户已对比竞品，价格敏感度高', '对家庭保障需求强烈，有 2 个孩子', '建议下周跟进财富传承方案'],
      hasAudio: true,
      audioDuration: '3 分 15 秒',
      isExpanded: true,
    },
    {
      id: 3,
      customerName: '林美玲',
      customerAvatar: '林',
      avatarColor: 'from-emerald-400 to-teal-400',
      type: '面访笔记',
      fullContent: '客户对教育金方案表现出浓厚兴趣。孩子目前 5 岁，计划 18 岁出国留学，预计需要 200 万预算。客户年收入约 80 万，家庭负担较轻，可以考虑分期缴纳的教育金保险。',
      time: '昨天 14:20',
      date: '4 月 24 日',
      location: '深圳市南山区',
      aiInsights: ['教育金需求明确', '预算 200 万，缴费能力强', '建议准备 3 套方案对比'],
      hasImages: true,
      imageCount: 2,
      isExpanded: false,
    },
    {
      id: 4,
      customerName: '张志强',
      customerAvatar: '张',
      avatarColor: 'from-amber-400 to-orange-400',
      type: '常规记录',
      fullContent: '客户生日是 5 月 10 日，需要提前准备生日祝福和礼品。根据之前的沟通，客户偏好茶叶类礼品，不喜甜食。可以顺便跟进之前提到的年金险方案。',
      time: '昨天 10:15',
      date: '4 月 24 日',
      // 无AI洞察 - AI录入功能上线前的旧笔记
      isExpanded: false,
    },
    {
      id: 5,
      customerName: '王大明',
      customerAvatar: '王',
      avatarColor: 'from-indigo-400 to-violet-400',
      type: '电话沟通',
      fullContent: '客户确认续保意向，同意下周来公司办理续保手续。需要准备续保方案对比表。',
      time: '4 月 22 日',
      date: '4 月 22 日',
      // 无AI洞察 - AI录入功能上线前的旧笔记
      hasAudio: true,
      audioDuration: '45 秒',
      isExpanded: false,
    },
  ]);

  const toggleNote = (id: number) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, isExpanded: !note.isExpanded } : note
    ));
  };

  const getTypeTagStyle = (type: string) => {
    switch (type) {
      case '面访笔记': return 'bg-amber-50 text-amber-600';
      case '电话沟通': return 'bg-emerald-50 text-emerald-600';
      case '常规记录': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const filteredNotes = notes.filter(note => {
    // 类型筛选
    if (activeTab === '全部') return true;
    if (activeTab === '面访笔记') return note.type === '面访笔记';
    if (activeTab === '电话沟通') return note.type === '电话沟通';
    if (activeTab === '常规记录') return note.type === '常规记录';
    return true;
  }).filter(note => {
    // 搜索筛选：笔记内容、客户姓名、拜访地址
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchContent = note.fullContent.toLowerCase().includes(query);
    const matchCustomer = note.customerName.toLowerCase().includes(query);
    const matchLocation = note.location?.toLowerCase().includes(query) || false;
    return matchContent || matchCustomer || matchLocation;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10">
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索笔记内容、客户姓名、拜访地址"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="header"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">客户笔记管理</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={onAddNote}
                  className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 笔记类型 Tabs */}
      {!showSearch && (
        <div className="bg-white px-4 py-3 border-b border-gray-50">
          <div className="flex gap-4 overflow-x-auto pb-1">
            {['全部', '面访笔记', '电话沟通', '常规记录'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[15px] font-medium whitespace-nowrap pb-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab} ({tab === '全部' ? '105' : tab === '面访笔记' ? '80' : tab === '电话沟通' ? '6' : '19'})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 搜索结果提示 */}
      {showSearch && searchQuery.trim() && (
        <div className="bg-white px-4 py-2 border-b border-gray-50">
          <p className="text-sm text-gray-500">
            找到 <span className="font-medium text-blue-600">{filteredNotes.length}</span> 条相关笔记
          </p>
        </div>
      )}

      {/* 时间范围筛选 */}
      {!showSearch && (
        <div className="bg-white px-4 py-2 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">4 月 25 日</span>
            <button
              onClick={() => alert('选择时间范围')}
              className="flex items-center gap-1.5 text-sm text-gray-600 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>筛选时间</span>
            </button>
          </div>
        </div>
      )}

      {/* 笔记列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {filteredNotes.map((note) => (
          <div key={note.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* 卡片头部 */}
            <div
              onClick={() => { toggleNote(note.id); setOpenMenuId(null); }}
              className="p-4 cursor-pointer"
            >
              {/* 第一行：客户头像+姓名、类型标签、时间、菜单 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* 客户头像+姓名，点击跳转客户详情 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomerClick?.(note.customerName);
                    }}
                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${note.avatarColor}`}>
                      <span className="text-white font-bold text-xs">{note.customerAvatar}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{note.customerName}</h3>
                  </button>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeTagStyle(note.type)}`}>
                    {note.type}
                  </span>
                  <span className="text-xs text-gray-400">{note.time}</span>
                </div>
                {/* 右上角菜单按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === note.id ? null : note.id);
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              {/* 只在折叠时显示预览 */}
              {!note.isExpanded && (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mt-2">
                  {note.fullContent}
                </p>
              )}
            </div>

            {/* 下拉菜单 */}
            <AnimatePresence>
              {openMenuId === note.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-4 top-12 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[100px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); alert('编辑笔记'); }}
                    className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="text-sm">编辑</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); alert('删除笔记'); }}
                    className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-red-50 transition-colors text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">删除</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 展开内容 - 点击这里不会折叠 */}
            <AnimatePresence>
              {note.isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-4 pb-4 pt-4 border-t border-gray-100"
                    onClick={(e) => e.stopPropagation()} // 防止点击内容区域时折叠
                  >
                    <div className="space-y-3">
                      {/* 时间和地点 */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{note.time}</span>
                        {note.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{note.location}</span>
                          </div>
                        )}
                        {note.hasAudio && (
                          <div className="flex items-center gap-1">
                            <Mic className="w-3 h-3" />
                            <span>语音录入</span>
                          </div>
                        )}
                        {note.hasImages && (
                          <div className="flex items-center gap-1">
                            <Image className="w-3 h-3" />
                            <span>{note.imageCount}张图片</span>
                          </div>
                        )}
                      </div>

                      {/* 完整笔记内容 */}
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed">{note.fullContent}</p>
                      </div>

                      {/* AI 核心洞察 - 只有AI录入的笔记才有 */}
                      {note.aiInsights && note.aiInsights.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-800">AI 核心洞察</span>
                            <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">录入时生成</span>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-1.5">
                            {note.aiInsights.map((insight, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${idx === note.aiInsights!.length - 1 ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 原始记录文件 */}
                      {(note.hasAudio || note.hasImages) && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-2">原始记录文件</h4>
                          <div className="flex flex-wrap gap-2">
                            {note.hasAudio && (
                              <button
                                onClick={(e) => { e.stopPropagation(); alert('播放录音'); }}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Mic className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">录音 {note.audioDuration}</span>
                                <PlayCircle className="w-4 h-4 text-blue-500" />
                              </button>
                            )}
                            {note.hasImages && (
                              <button
                                onClick={(e) => { e.stopPropagation(); alert('查看图片'); }}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Image className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{note.imageCount} 张图片</span>
                                <ChevronLeft className="w-4 h-4 text-blue-500 rotate-180" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerNotesPage;

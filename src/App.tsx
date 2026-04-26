import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, UserPlus, NotebookPen, Tags, Activity, ChevronRight, BarChart3, Phone, Users, Calendar, FileText, ShieldCheck, Shield, ChevronLeft, ChevronDown, Home, Briefcase, User, Package, Settings, MapPin, Locate, Navigation, Clock, LayoutGrid, ListChecks, ArchiveRestore, UserSearch, Send, Bot, Menu, Search, Plus, Mic, Mail, Monitor, Share2, Globe, History, LogOut, Bell, Star, BookOpen, MessageCircle, Wallet, GraduationCap, ClipboardList, LifeBuoy, PlayCircle, Fingerprint, QrCode, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CustomerListPage from './CustomerListPage';
import CustomerSearchPage from './CustomerSearchPage';
import UnifiedSearchPage from './UnifiedSearchPage';
import AgentProfilePage from './AgentProfilePage';
import SchedulePage from './SchedulePage';
import AIChatPage from './AIChatPage';
import CustomerDetailPage from './CustomerDetailPage';
import ScheduleCalendarPage from './ScheduleCalendarPage';
import { customers } from './data';

const tools = [
  { icon: UserPlus, label: '新建客户', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Tags, label: '标签管理', color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: NotebookPen, label: '客户笔记', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: MapPin, label: '客户地图', color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const moreTools = [
  { icon: ListChecks, label: '批量管理', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: ArchiveRestore, label: '找回已删', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: UserSearch, label: '查询身故', color: 'text-slate-600', bg: 'bg-slate-50' },
];

const filters = ['全部', '寿险客户', '准客户', '用户'];

const customerValues = ['全部价值', 'A1', 'A2', 'A3', 'A4', 'B', 'C', 'D', 'E', 'F'];
const customerTypes = ['全部类型', '寿险客户', '准客', '用户'];
const customerTemps = ['全部温度', '冷却', '低温', '中温', '高温'];

const baseGridData: Record<string, { total: number, data: number[][] }> = {
  '寿险客户': { 
    total: 105, 
    data: [
      [1, 4, 8],
      [3, 15, 23],
      [12, 34, 5]
    ] 
  },
  '准客户': { 
    total: 57, 
    data: [
      [0, 1, 3],
      [2, 8, 11],
      [8, 20, 4]
    ] 
  },
  '用户': { 
    total: 33, 
    data: [
      [0, 1, 1],
      [1, 4, 6],
      [5, 12, 3]
    ] 
  }
};

const allData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];
let allTotal = 0;
Object.values(baseGridData).forEach(cat => {
  allTotal += cat.total;
  cat.data.forEach((row, r) => {
    row.forEach((val, c) => {
      allData[r][c] += val;
    });
  });
});

const gridData: Record<string, { total: number, data: number[][] }> = {
  '全部': { total: allTotal, data: allData },
  ...baseGridData
};

function DimensionCard({ title, tabs, data }: { title: string, tabs: string[], data: {label: string, value: number}[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const maxVal = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-baseline">
          <h2 className="text-[17px] font-bold text-gray-900">{title}</h2>
          <span className="text-[11px] text-gray-400 ml-2">单位:人</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
              activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="relative h-48 mt-6">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          <div className="w-full border-t border-dashed border-gray-100"></div>
          <div className="w-full border-t border-dashed border-gray-100"></div>
          <div className="w-full border-t border-dashed border-gray-100"></div>
          <div className="w-full border-t border-dashed border-gray-100"></div>
          <div className="w-full border-t border-dashed border-gray-100"></div>
        </div>
        <div className="absolute inset-0 flex items-end justify-around px-1 pb-6">
          {data.map((item, idx) => {
            const heightPercent = (item.value / maxVal) * 100;
            const finalHeight = item.value === 0 ? 0 : Math.max(heightPercent, 2);
            return (
              <div key={idx} className="flex flex-col items-center group w-full h-full justify-end relative">
                <div className="relative w-full flex justify-center h-full items-end">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${finalHeight}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="w-3 sm:w-5 bg-blue-500 rounded-t-[2px] relative"
                  >
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-gray-800">
                      {item.value}
                    </span>
                  </motion.div>
                </div>
                <div className="absolute -bottom-6 w-full text-center">
                  <span className="text-[10px] text-gray-500 whitespace-nowrap scale-90 inline-block origin-top">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MoreDimensionsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl overflow-x-hidden flex flex-col relative pb-10">
        <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-50 shadow-sm">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 ml-2">更多维度分布图</h1>
        </div>
        <div className="p-3 space-y-3">
          <DimensionCard 
            title="会员等级"
            tabs={['VIP级别', '居家达标客户等级', '康养达标客户等级']}
            data={[
              { label: '黄金', value: 12 },
              { label: '铂金', value: 3 },
              { label: '钻石', value: 1 },
              { label: '金钻', value: 2 },
              { label: '黑钻', value: 0 },
            ]}
          />
          <DimensionCard 
            title="财富分群"
            tabs={['客户价值', '可投资资产']}
            data={[
              { label: 'A1类', value: 2 },
              { label: 'A2类', value: 1 },
              { label: 'A3类', value: 4 },
              { label: 'A4类', value: 2 },
              { label: 'B类', value: 15 },
              { label: 'C类', value: 52 },
              { label: 'D类', value: 26 },
              { label: 'E类', value: 15 },
              { label: 'F类', value: 660 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

const aiScenarios = [
  { botMood: 'smile', text: '10点约了邓逵，Bob为您准备了访前锦囊', cta: '去查看', taskId: 'task-1', type: 'strategy', customer: '邓逵' },
  { botMood: 'sparkle', text: '5月盘客开始啦，BOB为您优选了7位符合"感恩回馈"权益的高潜老客户', cta: '去查看', taskId: 'review-task', type: 'review_list' },
  { botMood: 'cheer', text: '月末冲刺！这5位"高意向"客户需要最后一次促成访视', cta: '去复盘', taskId: 'task-2', type: 'review' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'more-dimensions' | 'customer-list' | 'customer-search' | 'unified-search' | 'agent-profile' | 'schedule' | 'chat' | 'ai-chat' | 'customer-detail' | 'schedule-calendar'>('home');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('全部');
  const [activeTab, setActiveTab] = useState('做经营');
  const [activeBottomNav, setActiveBottomNav] = useState('首页');
  const [metricTimeType, setMetricTimeType] = useState<'month' | 'year'>('month');
  const [metricDate, setMetricDate] = useState(new Date(2026, 2));
  const [metricFilterValue, setMetricFilterValue] = useState('全部价值');
  const [metricFilterType, setMetricFilterType] = useState('全部类型');
  const [metricFilterTemp, setMetricFilterTemp] = useState('全部温度');
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [aiScenarioIndex, setAiScenarioIndex] = useState(0);
  const [showStrategySheet, setShowStrategySheet] = useState(false);
  const [showReviewSheet, setShowReviewSheet] = useState(false);
  const [taskStatus, setTaskStatus] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, time: string}[]>([
    { role: 'assistant', content: '嘿！我是 AskBob，您的智能保险助手。有什么我可以帮您的吗？', time: '04-20 13:37' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchPlaceholders = [
    "搜索：高净值客户",
    "搜索：近期过生日的客户",
    "搜索：即将满期的保单客户",
    "搜索：有理赔记录的客户",
    "搜索：138****1234"
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    const now = new Date();
    const timeStr = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const userMessage = { role: "user", content: inputValue, time: timeStr };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const responses = [
        "好的，我来帮您分析一下。根据您的描述，我建议可以先从客户的需求出发。",
        "这是一个很好的问题！在保险销售中，建立信任是第一步。",
        "明白了。针对这类客户，建议采用需求分析与方案匹配的方式。",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: "assistant", content: randomResponse, time: timeStr }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentData = gridData[activeFilter];
  const handlePrevMonth = () => setMetricDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  const handleNextMonth = () => setMetricDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  const handlePrevYear = () => setMetricDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth()));
  const handleNextYear = () => setMetricDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth()));

  const getMetrics = () => {
    const isYear = metricTimeType === 'year';
    const seed = isYear ? metricDate.getFullYear() : metricDate.getMonth() + 1;
    let filterModifier = 1;
    if (metricFilterValue !== '全部价值') filterModifier *= 0.7;
    if (metricFilterType !== '全部类型') filterModifier *= 0.8;
    if (metricFilterTemp !== '全部温度') filterModifier *= 0.6;
    return [
      { label: '客户人均保费', value: Math.floor((15000 + (seed % 500)) * filterModifier) },
      { label: '件均保费', value: Math.floor((8000 + (seed % 400)) * filterModifier) },
      { label: '客户加保率', value: `${Math.floor((25 + (seed % 10)) * filterModifier)}%` },
      { label: '人均件数', value: (1.5 + (seed % 5) / 10).toFixed(1) },
      { label: '高保费客户占比', value: `${Math.floor((12 + (seed % 5)) * filterModifier)}%` },
      { label: '老客户贡献占比', value: `${Math.floor((45 + (seed % 15)) * filterModifier)}%` },
    ];
  };
  const metrics = getMetrics();

  if (currentPage === 'more-dimensions') return <MoreDimensionsPage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'customer-list') return <CustomerListPage onBack={() => setCurrentPage('home')} onSearch={() => setCurrentPage('customer-search')} />;
  if (currentPage === 'customer-search') return <CustomerSearchPage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'unified-search') return <UnifiedSearchPage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'agent-profile') return <AgentProfilePage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'schedule') return <SchedulePage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'ai-chat') return <AIChatPage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'customer-detail') return <CustomerDetailPage customer={selectedCustomer} onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'schedule-calendar') return <ScheduleCalendarPage onBack={() => setCurrentPage('home')} />;

  const handleAiAction = (scenario: any) => {
    if (scenario.type === 'strategy') setShowStrategySheet(true);
    else if (scenario.type === 'review_list') setShowReviewSheet(true);
    setTaskStatus(prev => ({ ...prev, [scenario.taskId]: '进行中' }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans overflow-hidden">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl flex flex-col relative">
        <AnimatePresence>
          {showStrategySheet && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStrategySheet(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-center">
                <div className="w-full max-w-md h-full relative" />
              </motion.div>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-100 rounded-t-[32px] z-[70] flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-4 flex flex-col items-center">
                  <div className="w-10 h-1 bg-gray-300 rounded-full mb-4" />
                  <div className="w-full flex justify-between items-center px-2">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
                      访前锦囊
                    </h2>
                    <button onClick={() => setShowStrategySheet(false)} className="bg-gray-200 p-1.5 rounded-full">
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-12">
                  {/* 客户卡片 */}
                  <div
                    onClick={() => {
                      setShowStrategySheet(false);
                      setSelectedCustomer({
                        id: 100,
                        name: '邓逵',
                        avatar: '邓',
                        phone: '139****5678',
                        gender: 'M',
                        age: 36,
                        maritalStatus: '已婚',
                        birthday: '1990-03-01',
                        customerType: '寿险客户',
                        temperature: '高温',
                        value: 'A4',
                        vipLevel: '铂金',
                        serviceLevel: '康养会员',
                        remark: '近期浏览了养老社区专题页，对高端养老资源感兴趣。',
                        familyMembers: [
                          { relationship: '配偶', name: '邓太太', age: 34, phone: '138****8888' },
                          { relationship: '女儿', name: '小邓', age: 6, phone: '-' }
                        ]
                      });
                      setCurrentPage('customer-detail');
                    }}
                    className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        邓
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg">邓逵</h3>
                          <span className="text-xs text-gray-400">男</span>
                          <span className="text-xs text-gray-400">36岁</span>
                          <span className="text-xs text-gray-400">已婚</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">高温</span>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">A4</span>
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">铂金</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <span className="text-[10px]">查看详情</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI 访前切入点 */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 mb-5 border border-blue-100/60">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-gray-900 text-sm">AI 访前切入点</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-blue-200/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-blue-700">1</span>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-blue-700">客户洞察：</span>
                          <span className="text-xs text-gray-700">近期浏览了养老社区专题页 3 次，对高端养老资源表现出明显兴趣，建议主动介绍康养会员权益。</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-blue-200/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-blue-700">2</span>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-blue-700">家庭缺口：</span>
                          <span className="text-xs text-gray-700">家庭仅本人有一份重疾险，配偶与子女保障空白，可切入家庭保单规划。</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-blue-200/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-blue-700">3</span>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-blue-700">上次要点：</span>
                          <span className="text-xs text-gray-700">上次面谈讨论了教育金方案，客户表示需与配偶商量，本次可跟进决定。</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 访前数字化装备 */}
                  <div className="mb-5">
                    <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      访前数字化装备
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { title: '养老险计划书', type: 'PDF', icon: '📄', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
                        { title: '同业产品对比要点', type: 'XLS', icon: '📊', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        { title: '家医权益攻略 VLOG', type: 'MP4', icon: '🎬', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100' },
                        { title: '理赔极速达案例', type: 'IMG', icon: '🖼️', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                      ].map((item, idx) => (
                        <div key={idx} className={`rounded-2xl p-3.5 ${item.bg} border ${item.border} cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transition-transform`}>
                          <div className="flex items-start gap-2.5">
                            <div className={`w-9 h-9 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-lg">{item.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-gray-800 leading-tight">{item.title}</p>
                              <div className="flex items-center gap-1 mt-1.5">
                                <span className={`text-[9px] font-bold ${item.color} bg-white px-1.5 py-0.5 rounded-md`}>{item.type}</span>
                                <span className="text-[9px] text-gray-400 ml-auto flex items-center">
                                  直达
                                  <ChevronRight className="w-2.5 h-2.5 ml-0.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 个人形象与天气建议 */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      个人形象与天气建议
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl px-4 py-3 border border-blue-100/40">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">☀️</span>
                          <div>
                            <p className="text-sm font-bold text-gray-900">26°C 晴</p>
                            <p className="text-[10px] text-gray-500">上海市 · 空气质量优</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="text-[9px] bg-white text-gray-600 px-2 py-0.5 rounded-full font-medium">宜出行</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-base">👔</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">商务休闲建议</p>
                          <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">今日气温适宜，建议穿着浅色衬衫搭配休闲西裤，可搭配薄外套应对空调环境。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showReviewSheet && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewSheet(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-[32px] z-[70] shadow-2xl overflow-hidden flex flex-col max-w-md mx-auto">
                <div className="flex flex-col items-center pt-3 pb-2 border-b border-gray-100">
                  <div className="w-10 h-1 bg-gray-300 rounded-full mb-4" />
                  <h2 className="text-xl font-bold text-gray-900">5月盘客名单</h2>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 bg-gray-50/50">
                  <p className="text-sm text-gray-500 mb-4">基于数据大脑分析，为您筛选出7位高价值客户。</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className={`flex-1 flex flex-col min-h-0 ${activeBottomNav === '首页' ? 'overflow-hidden' : 'overflow-y-auto pb-6'}`}>
          {activeBottomNav === '首页' && (
            <div className="flex flex-col h-full bg-[#f8f8f8] overflow-y-auto pb-24 scrollbar-hide">
              {/* 顶部搜索 */}
              <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-md px-4 py-3 pb-2 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div onClick={() => setCurrentPage('unified-search')} className="flex-1 bg-gray-100/50 rounded-full h-10 flex items-center px-4 space-x-2 cursor-pointer">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400 truncate">搜索客户、产品、或咨询 Bob...</span>
                </div>
                <button className="relative p-2 hover:bg-gray-100 rounded-full">
                  <MessageCircle className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* AI 大脑区 */}
              <div className="px-4 mt-2">
                <motion.div layout initial={false} className="relative overflow-hidden rounded-3xl shadow-lg shadow-blue-500/10 h-28" style={{ background: 'linear-gradient(135deg, #0076F5 0%, #00F2FE 100%)' }}>
                  <motion.div animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 bg-white/30 pointer-events-none" />
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex-1 flex items-center px-4 py-2">
                      <div onClick={(e) => { e.stopPropagation(); setCurrentPage('ai-chat'); }} className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/30 relative cursor-pointer hover:bg-white/30 transition-colors active:scale-95 z-20">
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-2xl bg-white/20" />
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative shadow-lg overflow-hidden border border-white/40 z-10">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-900 rounded-md flex items-center justify-center space-x-1.5 px-1">
                            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.2] }} className="w-1.5 h-1.5 bg-cyan-400 rounded-sm" />
                            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.2] }} className="w-1.5 h-1.5 bg-cyan-400 rounded-sm" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 ml-3 min-w-0 pr-2">
                        <AnimatePresence mode="wait">
                          <motion.div key={aiScenarioIndex} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-white select-none">
                            <p className="text-[14px] font-medium leading-relaxed drop-shadow-sm">{aiScenarios[aiScenarioIndex].text}</p>
                            <button onClick={(e) => { e.stopPropagation(); handleAiAction(aiScenarios[aiScenarioIndex]); }} className="relative z-30 mt-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/30 active:scale-95 transition-transform flex items-center">
                              {aiScenarios[aiScenarioIndex].cta}
                              <ChevronRight className="w-3 h-3 ml-0.5" />
                            </button>
                          </motion.div>
                        </AnimatePresence>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 z-40">
                          {aiScenarios.map((_, idx) => (
                            <button key={idx} onClick={(e) => { e.stopPropagation(); setAiScenarioIndex(idx); }} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === aiScenarioIndex ? 'bg-white w-4' : 'bg-white/40'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 z-0 bg-transparent flex pointer-events-none" />
                  </div>
                </motion.div>
              </div>

              {/* 功能金刚区 */}
              <div className="px-4 mt-4">
                <div className="bg-white rounded-3xl p-2.5 shadow-sm border border-gray-100">
                  <div className="grid grid-cols-4 gap-y-3 gap-x-2">
                    {[
                      { icon: Shield, name: '掌上保', color: 'text-blue-500' },
                      { icon: Headphones, name: 'E服务', color: 'text-emerald-500' },
                      { icon: UserPlus, name: 'E增员', color: 'text-purple-500' },
                      { icon: GraduationCap, name: '学习', color: 'text-orange-500' },
                      { icon: QrCode, name: '面访扫码', color: 'text-indigo-500' },
                      { icon: FileText, name: '保单检视', color: 'text-red-500' },
                      { icon: Sparkles, name: '场景活动', color: 'text-amber-500' },
                      { icon: LayoutGrid, name: '更多', color: 'text-gray-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center space-y-1 cursor-pointer active:scale-95 transition-transform">
                        <div className="p-2 rounded-2xl">
                          <item.icon className={`w-5.5 h-5.5 ${item.color}`} />
                        </div>
                        <span className="text-[10px] text-gray-700 font-medium">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 今日日程 */}
              <div className="px-4 mt-6">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-[17px] font-bold text-gray-900">今日日程</h3>
                  <button onClick={() => setCurrentPage('schedule-calendar')} className="text-xs text-blue-600 font-medium">查看全部日程</button>
                </div>
                <div className="space-y-3">
                  {[
                    { id: 'task-1', time: '10:00', title: '邓逵 - 面访介绍康养会员权益', type: '面访', highlight: true },
                    { id: 'task-6', time: '14:30', title: '刘敏 - 保单递送', type: '服务' },
                    { id: 'task-7', time: '16:00', title: '陈静 - 入盟促成', type: '增员' },
                  ].map((task, idx) => (
                    <div key={idx} className={`bg-white p-4 rounded-2xl flex items-center shadow-sm border transition-all ${task.highlight ? 'border-blue-100 ring-4 ring-blue-500/5' : 'border-transparent'}`}>
                      <div className="flex flex-col items-center justify-center mr-4 pr-4 border-r border-gray-100 min-w-[50px]">
                        <span className="text-sm font-bold text-gray-900">{task.time}</span>
                        <span className="text-[10px] text-gray-400">{task.type}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800">{task.title}</h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeBottomNav === '客户' && (
            <>
              {/* Tab Switcher */}
              <div className="flex space-x-6 items-center px-4 py-3 bg-white sticky top-0 z-30">
                <button onClick={() => setActiveTab('做经营')} className={`text-lg pb-1 relative transition-colors ${activeTab === '做经营' ? 'font-bold text-gray-900 border-b-2 border-indigo-600' : 'font-medium text-gray-400'}`}>
                  做经营
                </button>
                <button onClick={() => setActiveTab('客户库')} className={`text-lg pb-1 relative transition-colors ${activeTab === '客户库' ? 'font-bold text-gray-900 border-b-2 border-indigo-600' : 'font-medium text-gray-400'}`}>
                  客户库
                </button>
                {activeTab === '做经营' && (
                  <button onClick={() => setCurrentPage('customer-search')} className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>

              {activeTab === '做经营' ? (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
                  {/* 客经工作台 */}
                  <div className="bg-white rounded-3xl shadow-sm mx-3 mt-3 overflow-hidden">
                    {/* 头部 */}
                    <div className="px-4 py-2 border-b border-gray-50">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">客经工作台</h2>
                        <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500">
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium text-gray-700 mx-1">2026 年 4 月</span>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 重点事项 */}
                      <div className="bg-orange-50 rounded-xl px-3 py-2 flex items-center justify-between mt-2 border border-orange-100/50">
                        <div className="flex items-center">
                          <span className="text-orange-600 font-bold text-xs bg-orange-100 px-2 py-0.5 rounded mr-2">重点事项</span>
                          <p className="text-gray-700 text-sm">
                            <span className="text-orange-600 font-bold">5 月经营</span>即将开始，请于<span className="text-orange-600 font-medium">4 月 30 日 (含)</span>完成 5 月客户盘点！
                          </p>
                        </div>
                        <button className="px-3 py-1 border border-orange-400 text-orange-500 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                          去盘客
                        </button>
                      </div>

                      {/* 重点经营客户 */}
                      <div className="mt-2 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100/50">
                        <p className="text-gray-600 text-sm">
                          本月您有 <span className="text-blue-600 font-bold text-lg">84</span> 个重点经营客户，当前阶段不可调整
                        </p>
                      </div>

                      {/* 四项指标 */}
                      <div className="grid grid-cols-4 gap-2 mt-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100/50">
                        <div className="text-center">
                          <p className="text-gray-500 text-xs mb-1">触客</p>
                          <p className="text-gray-900 text-lg font-bold">
                            <span className="text-blue-600">0</span><span className="text-xs text-gray-400">/34</span>
                          </p>
                          <p className="text-gray-400 text-[10px] mt-0.5">已完成/总数</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 text-xs mb-1">面访</p>
                          <p className="text-gray-900 text-lg font-bold">
                            <span className="text-blue-600">0</span><span className="text-xs text-gray-400">/39</span>
                          </p>
                          <p className="text-gray-400 text-[10px] mt-0.5">已完成/总数</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 text-xs mb-1">邀约</p>
                          <p className="text-gray-900 text-lg font-bold">
                            <span className="text-blue-600">1</span><span className="text-xs text-gray-400">/11</span>
                          </p>
                          <p className="text-gray-400 text-[10px] mt-0.5">已完成/总数</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 text-xs mb-1">当月升温</p>
                          <p className="text-gray-900 text-lg font-bold">1</p>
                          <p className="text-gray-400 text-[10px] mt-0.5">总数</p>
                        </div>
                      </div>
                    </div>

                    {/* 本月经营分布 */}
                    <div className="px-4 py-2 bg-gray-50/50">
                      <div className="flex justify-center items-center mb-2">
                        <div className="w-8 h-px bg-gray-200"></div>
                        <span className="mx-2 text-gray-700 font-bold text-sm">本月经营分布</span>
                        <div className="w-8 h-px bg-gray-200"></div>
                      </div>
                      <div className="space-y-2">
                        {/* A 行 */}
                        <div className="flex items-center">
                          <span className="text-xs text-gray-400 font-semibold w-6 text-right pr-1">A</span>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <div className="bg-blue-50 rounded-xl p-2 text-center">
                              <p className="text-gray-900 text-lg font-bold">8<span className="text-xs text-gray-500">人</span></p>
                              <p className="text-blue-600 text-xs mt-0.5">待触客 8 人</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-2 text-center">
                              <p className="text-gray-900 text-lg font-bold">15<span className="text-xs text-gray-500">人</span></p>
                              <p className="text-orange-600 text-xs mt-0.5">待面访 15 人</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-2 text-center">
                              <p className="text-gray-900 text-lg font-bold">3<span className="text-xs text-gray-500">人</span></p>
                              <p className="text-red-600 text-xs mt-0.5">待邀约 3 人</p>
                            </div>
                          </div>
                        </div>
                        {/* BC 行 */}
                        <div className="flex items-center">
                          <span className="text-xs text-gray-400 font-semibold w-6 text-right pr-1">BC</span>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <div className="bg-blue-50 rounded-xl p-2 text-center">
                              <p className="text-gray-900 text-lg font-bold">25<span className="text-xs text-gray-500">人</span></p>
                              <p className="text-blue-600 text-xs mt-0.5">待触客 25 人</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-2 text-center">
                              <p className="text-gray-900 text-lg font-bold">23<span className="text-xs text-gray-500">人</span></p>
                              <p className="text-orange-600 text-xs mt-0.5">待面访 23 人</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-2 text-center">
                              <p className="text-gray-900 text-lg font-bold">7<span className="text-xs text-gray-500">人</span></p>
                              <p className="text-red-600 text-xs mt-0.5">待邀约 6 人</p>
                            </div>
                          </div>
                        </div>
                        {/* DEF 行 */}
                        <div className="flex items-center">
                          <span className="text-xs text-gray-400 font-semibold w-6 text-right pr-1">DEF</span>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <div className="bg-blue-50 rounded-xl p-2 text-center">
                              <p className="text-gray-900 text-lg font-bold">1<span className="text-xs text-gray-500">人</span></p>
                              <p className="text-blue-600 text-xs mt-0.5">待触客 1 人</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-2 text-center">
                              <p className="text-gray-900 text-lg font-bold">1<span className="text-xs text-gray-500">人</span></p>
                              <p className="text-orange-600 text-xs mt-0.5">待面访 1 人</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-2 text-center">
                              <p className="text-gray-900 text-lg font-bold">1<span className="text-xs text-gray-500">人</span></p>
                              <p className="text-red-600 text-xs mt-0.5">待邀约 1 人</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex ml-7 mt-2 text-[10px] text-gray-400 font-medium">
                        <div className="flex-1 text-center">冷却</div>
                        <div className="flex-1 text-center">低温</div>
                        <div className="flex-1 text-center">中高温</div>
                      </div>
                    </div>
                  </div>

                  {/* 精选名单 */}
                  <div className="bg-white rounded-3xl shadow-sm mx-3 mt-4 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <h2 className="text-lg font-bold text-gray-900">精选名单</h2>
                          <div className="ml-2 w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-400 text-[10px]">i</span>
                          </div>
                        </div>
                        <div className="flex bg-gray-100 rounded-lg p-0.5">
                          <button className="px-2 py-1 text-[10px] text-gray-500 rounded-md">卡片视图</button>
                          <button className="px-2 py-1 text-[10px] text-gray-900 bg-white rounded-md shadow-sm font-medium">列表视图</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm">共计</span>
                          <span className="text-blue-600 font-bold text-xl ml-1">215</span>
                          <span className="text-gray-500 text-sm ml-1">人</span>
                        </div>
                        <button className="text-gray-500 text-sm flex items-center">
                          展开分布 <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                      {/* 视角切换 */}
                      <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-3">
                        <button className="py-2 text-sm font-medium text-gray-900 bg-white rounded-lg shadow-sm">温度视角</button>
                        <button className="py-2 text-sm font-medium text-gray-400">价值视角</button>
                      </div>
                      {/* 筛选器 */}
                      <div className="grid grid-cols-3 gap-2">
                        <button className="flex items-center justify-center text-xs text-gray-500 bg-gray-50 rounded-lg py-2">
                          客户价值 <ChevronDown className="w-3 h-3 ml-0.5" />
                        </button>
                        <button className="flex items-center justify-center text-xs text-gray-500 bg-gray-50 rounded-lg py-2">
                          客户类型 <ChevronDown className="w-3 h-3 ml-0.5" />
                        </button>
                        <button className="flex items-center justify-center text-xs text-gray-500 bg-gray-50 rounded-lg py-2">
                          客群标签 <ChevronDown className="w-3 h-3 ml-0.5" />
                        </button>
                      </div>
                    </div>

                    {/* 节点契机名单表格 */}
                    <div className="px-5 py-4">
                      <div className="flex items-center mb-3">
                        <div className="w-1 h-4 bg-blue-600 rounded-full mr-2"></div>
                        <h3 className="font-bold text-gray-900">节点契机名单</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-500 text-xs border-b border-gray-100">
                              <th className="text-left py-2 font-medium">名单名称</th>
                              <th className="text-center py-2 font-medium">客户数</th>
                              <th className="text-center py-2 font-medium">冷却</th>
                              <th className="text-center py-2 font-medium">低温</th>
                              <th className="text-center py-2 font-medium">中温</th>
                              <th className="text-center py-2 font-medium">高温</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { name: '25 年税优...', count: 12, cold: 3, low: 7, mid: 2, high: 0 },
                              { name: '5W 以上旺 C', count: 3, cold: 0, low: 3, mid: 0, high: 0 },
                              { name: '重客临取客户', count: 8, cold: 4, low: 1, mid: 2, high: 1 },
                              { name: '分红老客', count: 3, cold: 0, low: 2, mid: 0, high: 1 },
                              { name: '25 年 9 到 1...', count: 1, cold: 0, low: 1, mid: 0, high: 0 },
                              { name: '大量积分未...', count: 81, cold: 35, low: 36, mid: 7, high: 3 },
                              { name: '近期用过积分', count: 6, cold: 2, low: 2, mid: 2, high: 0 },
                              { name: '参加居家场...', count: 1, cold: 0, low: 0, mid: 1, high: 0 },
                            ].map((row, idx) => (
                              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                                <td className="py-3 text-blue-600 font-medium">{row.name}</td>
                                <td className="py-3 text-center font-bold text-gray-900">{row.count}</td>
                                <td className="py-3 text-center font-medium text-gray-900">{row.cold}</td>
                                <td className="py-3 text-center font-medium text-gray-900">{row.low}</td>
                                <td className="py-3 text-center font-medium text-gray-900">{row.mid}</td>
                                <td className="py-3 text-center font-medium text-gray-900">{row.high}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
                  {/* 客户 AI 搜索 */}
                  <div className="p-4 bg-white sticky top-[60px] z-30 border-b border-gray-50">
                    <div onClick={() => setCurrentPage('customer-search')} className="relative flex items-center w-full h-12 rounded-2xl bg-gray-50 border border-gray-100 px-4 overflow-hidden group cursor-pointer">
                      <Sparkles className="w-5 h-5 text-indigo-500 mr-2 relative z-10" />
                      <div className="flex-1 relative h-full flex items-center overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.div key={placeholderIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex items-center pointer-events-none">
                            <span className="text-sm text-gray-400 truncate">{searchPlaceholders[placeholderIndex]}</span>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-medium relative z-10 shadow-md hover:bg-indigo-700 transition-colors ml-2">
                        搜索
                      </button>
                    </div>
                  </div>

                  {/* 我的客户 */}
                  <div className="p-5 bg-white mt-3 rounded-3xl shadow-sm mx-3">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">我的客户</h2>
                        <button onClick={() => setCurrentPage('customer-list')} className="flex items-center text-xs text-gray-500 mt-1.5 hover:text-indigo-600 transition-colors group cursor-pointer">
                          总计 <span className="text-indigo-600 font-bold text-lg mx-1 group-hover:scale-110 transition-transform">{currentData.total}</span> 人
                          <ChevronRight className="w-3 h-3 ml-0.5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </button>
                      </div>
                      <div className="flex space-x-1.5 bg-gray-100 p-1 rounded-xl">
                        {filters.map(f => (
                          <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${activeFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 relative bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex">
                        <div className="flex flex-col justify-around pr-3 text-[10px] text-gray-400 font-semibold h-56">
                          <span>A</span>
                          <span>BC</span>
                          <span>DEF</span>
                        </div>
                        <div className="flex-1 grid grid-rows-3 gap-1.5 h-56 relative">
                          <AnimatePresence mode="wait">
                            <motion.div key={activeFilter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute inset-0 grid grid-rows-3 gap-1.5">
                              {currentData.data.map((row, rowIndex) => (
                                <div key={rowIndex} className="grid grid-cols-3 gap-1.5">
                                  {row.map((cell, colIndex) => {
                                    const rowWeight = (2 - rowIndex);
                                    const bgOpacity = 0.15 + (rowWeight * 0.25);
                                    let baseColor = '99, 102, 241';
                                    let textColor = 'text-indigo-900';
                                    if (colIndex === 0) { baseColor = '56, 189, 248'; textColor = 'text-sky-900'; }
                                    else if (colIndex === 1) { baseColor = '251, 191, 36'; textColor = 'text-amber-900'; }
                                    else if (colIndex === 2) { baseColor = '248, 113, 113'; textColor = 'text-red-900'; }
                                    const isDark = bgOpacity > 0.5;
                                    const finalTextColor = isDark ? 'text-white' : textColor;
                                    return (
                                      <motion.div key={`${rowIndex}-${colIndex}`} onClick={() => setCurrentPage('customer-list')} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: (rowIndex * 3 + colIndex) * 0.03 }} className="rounded-xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all" style={{ backgroundColor: `rgba(${baseColor}, ${bgOpacity})` }}>
                                        <span className={`text-lg font-bold z-10 ${finalTextColor}`}>{cell}</span>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="flex ml-7 mt-3 text-[10px] text-gray-400 font-semibold">
                        <div className="flex-1 text-center">冷却</div>
                        <div className="flex-1 text-center">低温</div>
                        <div className="flex-1 text-center">中高温</div>
                      </div>
                    </div>
                    <button onClick={() => setCurrentPage('more-dimensions')} className="w-full mt-3 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[13px] text-indigo-600 font-medium flex items-center justify-center hover:bg-indigo-50 transition-colors group">
                      <BarChart3 className="w-4 h-4 mr-2 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                      查看更多维度分布图
                      <ChevronRight className="w-4 h-4 ml-1 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* 客户动态 */}
                  <div className="p-5 bg-white mt-3 rounded-3xl shadow-sm mx-3">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold text-gray-900">客户动态</h2>
                      <button className="flex items-center bg-indigo-50/80 hover:bg-indigo-100 px-2.5 py-1 rounded-xl border border-indigo-100/50 transition-colors cursor-pointer group shadow-sm">
                        <span className="text-[11px] font-bold text-indigo-600 mr-1.5">未读动态</span>
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">3</span>
                      </button>
                    </div>
                    <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-[7px] before:w-[2px] before:bg-gray-50">
                      {[
                        { name: '张伟', time: '10分钟前', action: '阅读了资讯《添平安25年服务年报》' },
                        { name: '王静', time: '1小时前', action: '浏览了产品e生保惠享' },
                        { name: '刘洋', time: '4小时前', action: '使用了保单还款服务' },
                      ].map((activity, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center z-10">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          </div>
                          <div className="flex justify-between items-baseline mb-1.5">
                            <span className="text-[15px] font-bold text-gray-900">{activity.name}</span>
                            <span className="text-[11px] text-gray-400 font-medium">{activity.time}</span>
                          </div>
                          <p className="text-[13px] text-gray-500 leading-relaxed">{activity.action}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 text-center">
                      <button className="text-[13px] font-bold text-gray-400 hover:text-indigo-600 transition-colors">查看更多动态</button>
                    </div>
                  </div>

                  {/* 客户质量 */}
                  <div className="p-5 bg-white mt-4 rounded-3xl shadow-sm mx-3">
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">客户质量</h2>
                        <div className="flex items-center mt-1 text-[11px] text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                          数据更新于 00:12
                        </div>
                      </div>
                      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                        <button onClick={() => setMetricTimeType('month')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${metricTimeType === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>月</button>
                        <button onClick={() => setMetricTimeType('year')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${metricTimeType === 'year' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>年</button>
                      </div>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
                      <div className="relative shrink-0">
                        <select value={metricFilterValue} onChange={(e) => setMetricFilterValue(e.target.value)} className="appearance-none bg-gray-50 border border-gray-100 text-gray-600 font-medium text-xs rounded-lg pl-3 pr-7 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 hover:bg-gray-100 transition-colors">
                          {customerValues.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    {metricTimeType === 'month' && (
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2 mb-4 border border-gray-100">
                        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"><ChevronLeft className="w-4 h-4" /></button>
                        <span className="text-sm font-medium text-gray-700">{metricDate.getFullYear()}年{metricDate.getMonth() + 1}月</span>
                        <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                      {metrics.map((m, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100/50 hover:shadow-md transition-shadow cursor-pointer">
                          <span className="text-2xl font-bold text-gray-900 mb-1">{m.value}</span>
                          <span className="text-[11px] text-gray-500 font-medium">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 经营工具 */}
                  <div className="p-5 bg-white mt-4 rounded-3xl shadow-sm mx-3 mb-8">
                    <div className="flex justify-between items-center mb-5">
                      <h2 className="text-lg font-bold text-gray-900">经营工具</h2>
                      <button className="text-xs text-indigo-600 font-bold">管理工具</button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {tools.map((tool, idx) => (
                        <div key={idx} className="flex flex-col items-center cursor-pointer group">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-105 ${tool.bg}`}>
                            <tool.icon className={`w-5 h-5 ${tool.color}`} />
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium">{tool.label}</span>
                        </div>
                      ))}
                      <div onClick={() => setShowMoreTools(!showMoreTools)} className="flex flex-col items-center cursor-pointer group">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-105 ${showMoreTools ? 'bg-indigo-100' : 'bg-gray-50 hover:bg-gray-100'}`}>
                          <LayoutGrid className={`w-5 h-5 transition-colors ${showMoreTools ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        </div>
                        <span className={`text-[10px] font-medium transition-colors ${showMoreTools ? 'text-indigo-600' : 'text-gray-500'}`}>更多</span>
                      </div>
                    </div>
                    <AnimatePresence>
                      {showMoreTools && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-gray-50/50">
                            {moreTools.map((tool, idx) => (
                              <div key={idx} className="flex flex-col items-center cursor-pointer group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-105 ${tool.bg}`}>
                                  <tool.icon className={`w-5 h-5 ${tool.color}`} />
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{tool.label}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {(activeBottomNav !== '首页' && activeBottomNav !== '客户') && (
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
              <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <LayoutGrid className="w-20 h-20 text-gray-200" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{activeBottomNav}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">功能正在开发中，敬请期待</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        {currentPage !== 'chat' && currentPage !== 'ai-chat' && (
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 pb-safe z-40">
            <div className="flex justify-around items-center h-16">
              {[
                { icon: Home, label: '首页' },
                { icon: Briefcase, label: '展业' },
                { icon: Users, label: '客户' },
                { icon: Package, label: '产品' },
                { icon: Settings, label: '管理' },
              ].map((item, idx) => {
                const isActive = (item.label === '首页' && activeBottomNav === '首页') || (item.label === '客户' && activeBottomNav === '客户');
                const isUnderDevelopment = item.label === '展业' || item.label === '产品' || item.label === '管理';
                return (
                  <button key={idx} onClick={() => {
                    if (isUnderDevelopment) { setActiveBottomNav(item.label); setCurrentPage('home'); }
                    else if (item.label === '客户') { setActiveBottomNav('客户'); setCurrentPage('home'); }
                    else { setActiveBottomNav('首页'); setCurrentPage('home'); }
                  }} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isUnderDevelopment ? 'text-gray-400' : (isActive ? 'text-blue-600' : 'text-gray-400')}`}>
                    <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

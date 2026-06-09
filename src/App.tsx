import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, UserPlus, NotebookPen, Tags, Activity, ChevronRight, BarChart3, Phone, Users, Calendar, FileText, ShieldCheck, Shield, ChevronLeft, ChevronDown, Home, Briefcase, User, Package, Settings, MapPin, Locate, Navigation, Clock, LayoutGrid, ListChecks, ArchiveRestore, UserSearch, Send, Bot, Menu, Search, Plus, Mic, Mail, Monitor, Share2, Globe, History, LogOut, Bell, Star, BookOpen, MessageCircle, Wallet, GraduationCap, ClipboardList, LifeBuoy, PlayCircle, Fingerprint, QrCode, Headphones, TrendingUp, Filter, X, CheckCircle2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CustomerListPage from './CustomerListPage';
import CustomerSearchPage from './CustomerSearchPage';
import UnifiedSearchPage from './UnifiedSearchPage';
import AgentProfilePage from './AgentProfilePage';
import SchedulePage from './SchedulePage';
import AIChatPage from './AIChatPage';
import CustomerDetailPage from './CustomerDetailPage';
import CustomerDetailPageNew from './CustomerDetailPageNew';
import ScheduleCalendarPage from './ScheduleCalendarPage';
import ScheduleEditPage from './ScheduleEditPage';
import SharedCustomerListPage from './SharedCustomerListPage';
import CustomerNotesPage from './CustomerNotesPage';
import AddCustomerNotePage from './AddCustomerNotePage';
import { customers } from './data';

const tools = [
  { icon: UserPlus, label: '新建客户' },
  { icon: NotebookPen, label: '客户笔记' },
  { icon: MapPin, label: '客户地图' },
];

const moreTools = [
  { icon: Tags, label: '标签管理' },
  { icon: ClipboardList, label: '导入通讯录' },
  { icon: UserSearch, label: '查询身故客户' },
  { icon: Share2, label: '共享客户清单' },
  { icon: Users, label: '传承客户' },
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
  { botMood: 'sparkle', text: '客户邓逵后天要过生日了，我帮你准备好了藏头诗祝福贺卡，一起来完善下？', cta: '去查看', taskId: 'birthday-1', type: 'birthday', customer: '邓逵' },
  { botMood: 'sparkle', text: '5月盘客开始啦，BOB为您优选了7位符合"感恩回馈"权益的高潜老客户', cta: '去查看', taskId: 'review-task', type: 'review_list' },
  { botMood: 'cheer', text: '月末冲刺！这5位"高意向"客户需要最后一次促成访视', cta: '去复盘', taskId: 'task-2', type: 'review' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'more-dimensions' | 'customer-list' | 'customer-search' | 'unified-search' | 'agent-profile' | 'schedule' | 'chat' | 'ai-chat' | 'customer-detail' | 'schedule-calendar' | 'schedule-edit' | 'shared-customer-list' | 'inheritance-customer' | 'new-inheritance-agreement' | 'heir-sign-agreement'>('home');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [editingSchedule, setEditingSchedule] = useState<{ id: string; title: string; time: string; type: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState('全部');
  const [activeTab, setActiveTab] = useState('做经营');
  const [activeBottomNav, setActiveBottomNav] = useState('首页');
  const [metricTimeType, setMetricTimeType] = useState<'month' | 'year'>('month');
  const [metricDate, setMetricDate] = useState(new Date(2026, 2));
  const [metricFilterValue, setMetricFilterValue] = useState('全部价值');
  const [metricFilterType, setMetricFilterType] = useState('全部类型');
  const [metricFilterTemp, setMetricFilterTemp] = useState('全部温度');
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [dynamicFilter, setDynamicFilter] = useState('未读动态');
  const [devTab, setDevTab] = useState('个人发展');
  const [productTab, setProductTab] = useState('寿险');
  const [serviceTab, setServiceTab] = useState('服务');
  const [equityTab, setEquityTab] = useState('添平安');
  const [inheritanceTab, setInheritanceTab] = useState('传承客户清单');
  const [inheritanceAgreementFilter, setInheritanceAgreementFilter] = useState('');
  const [inheritanceHeirFilter, setInheritanceHeirFilter] = useState('');
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [showHeirSheet, setShowHeirSheet] = useState(false);
  const [heirSearchQuery, setHeirSearchQuery] = useState('');
  // 新签传承协议相关状态
  const [newAgreementStep, setNewAgreementStep] = useState<'select-heir' | 'view-agreement' | 'sign' | 'complete'>('select-heir');
  const [newHeirId, setNewHeirId] = useState('');
  const [newHeirName, setNewHeirName] = useState('');
  const [isSearchingNewHeir, setIsSearchingNewHeir] = useState(false);
  const [agreementReadTime, setAgreementReadTime] = useState(5);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [canSignAgreement, setCanSignAgreement] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  // 继承人签署协议相关状态
  const [heirSignStep, setHeirSignStep] = useState<'view' | 'sign' | 'complete'>('view');
  const [heirSignReadTime, setHeirSignReadTime] = useState(5);
  const [heirCanSign, setHeirCanSign] = useState(false);
  const [heirSignatureText, setHeirSignatureText] = useState('');
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [aiScenarioIndex, setAiScenarioIndex] = useState(0);
  const [showStrategySheet, setShowStrategySheet] = useState(false);
  const [showReviewSheet, setShowReviewSheet] = useState(false);
  const [taskStatus, setTaskStatus] = useState<Record<string, string>>({});
  const [aiInitialMessage, setAiInitialMessage] = useState<string | undefined>(undefined);
  const [sharedCustomerDefaultTab, setSharedCustomerDefaultTab] = useState<'incoming' | 'outgoing'>('outgoing');
  const [customerDetailInitialTab, setCustomerDetailInitialTab] = useState<string | undefined>(undefined);
  const [useNewCustomerDetail, setUseNewCustomerDetail] = useState(false);
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

  // 继承人签署页面倒计时
  useEffect(() => {
    if (currentPage === 'heir-sign-agreement' && heirSignStep === 'view' && !heirCanSign && heirSignReadTime > 0) {
      const timer = setInterval(() => {
        setHeirSignReadTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setHeirCanSign(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPage, heirSignStep, heirCanSign, heirSignReadTime]);

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
  if (currentPage === 'customer-list') return <CustomerListPage onBack={() => setCurrentPage('home')} onSearch={() => setCurrentPage('customer-search')} onSharedCustomerList={() => { setSharedCustomerDefaultTab('outgoing'); setCurrentPage('shared-customer-list'); }} onInheritanceCustomer={() => setCurrentPage('inheritance-customer')} />;
  if (currentPage === 'customer-search') return <CustomerSearchPage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'unified-search') return <UnifiedSearchPage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'agent-profile') return <AgentProfilePage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'schedule') return <SchedulePage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'ai-chat') return <AIChatPage
    onBack={() => { setCurrentPage('home'); setAiInitialMessage(undefined); }}
    initialMessage={aiInitialMessage}
    onCustomerClick={(customerName) => {
      const customer = customers.find(c => c.name === customerName);
      if (customer) {
        setSelectedCustomer(customer);
      } else {
        // 如果找不到客户（如邓逵），创建一个默认客户对象
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
      }
      setCurrentPage('customer-detail');
    }}
  />;
if (currentPage === 'customer-detail') {
    if (useNewCustomerDetail) {
      return (
          <CustomerDetailPageNew
            customer={selectedCustomer}
            onBack={() => { setCurrentPage('home'); setCustomerDetailInitialTab(undefined); }}
            onSharedCustomerList={() => { setSharedCustomerDefaultTab('outgoing'); setCurrentPage('shared-customer-list'); }}
            initialTab={customerDetailInitialTab}
            onToggleVersion={() => { setUseNewCustomerDetail(false); }}
          />
      );
    }
    return (
        <CustomerDetailPage
          customer={selectedCustomer}
          onBack={() => { setCurrentPage('home'); setCustomerDetailInitialTab(undefined); }}
          onSharedCustomerList={() => { setSharedCustomerDefaultTab('outgoing'); setCurrentPage('shared-customer-list'); }}
          initialTab={customerDetailInitialTab}
          onToggleVersion={() => { setUseNewCustomerDetail(true); }}
        />
    );
  }
  if (currentPage === 'schedule-calendar') return <ScheduleCalendarPage
    onBack={() => setCurrentPage('home')}
    onCustomerDetail={() => {
      setCurrentPage('customer-detail');
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
    }}
    onStrategySheet={() => setShowStrategySheet(true)}
  />;
  if (currentPage === 'schedule-edit') return <ScheduleEditPage
    onBack={() => { setCurrentPage('home'); setEditingSchedule(null); }}
    onSave={(data) => { console.log('保存日程', data); setCurrentPage('home'); setEditingSchedule(null); }}
    onDelete={() => { console.log('删除日程', editingSchedule?.id); setCurrentPage('home'); setEditingSchedule(null); }}
    schedule={editingSchedule}
    showAskBob={editingSchedule?.id === 'task-1'}
    onCustomerDetail={() => {
      setCurrentPage('customer-detail');
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
    }}
    onStrategySheet={() => {
      setCurrentPage('home');
      setEditingSchedule(null);
      setShowStrategySheet(true);
    }}
  />;
  if (currentPage === 'shared-customer-list') return <SharedCustomerListPage onBack={() => setCurrentPage('customer-list')} defaultTab={sharedCustomerDefaultTab} />;
  if (currentPage === 'customer-notes') return <CustomerNotesPage
    onBack={() => setCurrentPage('home')}
    onAddNote={() => setCurrentPage('add-customer-note')}
    onCustomerClick={(customerName) => {
      const customer = customers.find(c => c.name === customerName);
      if (customer) {
        setSelectedCustomer(customer);
      } else {
        // 如果找不到客户，创建一个默认客户对象
        setSelectedCustomer({
          id: 100,
          name: customerName,
          avatar: customerName.charAt(0),
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
          remark: '',
          familyMembers: []
        });
      }
      setCustomerDetailInitialTab('时光轴');
      setCurrentPage('customer-detail');
    }}
  />;
  if (currentPage === 'add-customer-note') return <AddCustomerNotePage onBack={() => setCurrentPage('customer-notes')} onSave={() => { setCurrentPage('customer-notes'); }} />;

  // 新签传承协议页面
  if (currentPage === 'new-inheritance-agreement') {
    // 步骤1：选择继承代理人
    if (newAgreementStep === 'select-heir') {
      return (
        <div className="flex flex-col h-full bg-gray-50">
          <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center border-b border-gray-100">
            <button onClick={() => setCurrentPage('inheritance-customer')} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 ml-2">新签传承协议</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* 进度指示 */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-sm text-blue-600 font-medium">选择继承人</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200" />
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs font-bold">2</div>
                <span className="text-sm text-gray-400">签署协议</span>
              </div>
            </div>

            {/* 选择继承代理人卡片 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <label className="text-[14px] font-medium text-gray-700 mb-3 block">
                继承代理人工号
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newHeirId}
                  onChange={(e) => setNewHeirId(e.target.value)}
                  placeholder="请填写继承代理人工号"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
                {isSearchingNewHeir && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {/* 校验按钮 */}
              <button
                onClick={() => {
                  if (newHeirId) {
                    setIsSearchingNewHeir(true);
                    setTimeout(() => {
                      // 模拟校验成功
                      setNewHeirName('李小华');
                      setIsSearchingNewHeir(false);
                    }, 500);
                  }
                }}
                disabled={!newHeirId || isSearchingNewHeir}
                className={`w-full mt-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${newHeirId && !isSearchingNewHeir ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                校验代理人
              </button>
              {/* 校验结果 */}
              {newHeirName && (
                <div className="mt-3 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-[13px] text-green-700 font-medium">姓名：<span className="font-bold">{newHeirName}</span></span>
                </div>
              )}
            </div>

            {/* 传承协议说明 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-[14px] font-bold text-gray-800 mb-3">传承协议说明</h3>
              <div className="space-y-2 text-[13px] text-gray-600">
                <p>传承代理人和继承代理人双方签署协议后，协议生效。</p>
                <p>协议生效后，传承人可将客户传承给继承人经营。</p>
                <p>继承人独立出单后，传承人可获得传承奖励。</p>
              </div>
            </div>

            {/* 下一步按钮 */}
            <button
              onClick={() => {
                if (newHeirName) {
                  setNewAgreementStep('view-agreement');
                  // 启动倒计时
                  const timer = setInterval(() => {
                    setAgreementReadTime(prev => {
                      if (prev <= 1) {
                        clearInterval(timer);
                        setCanSignAgreement(true);
                        return 0;
                      }
                      return prev - 1;
                    });
                  }, 1000);
                }
              }}
              disabled={!newHeirName}
              className={`w-full mt-4 py-3.5 rounded-2xl font-bold text-[15px] shadow-lg transition-all ${newHeirName ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              下一步：浏览协议
            </button>
          </div>
        </div>
      );
    }

    // 步骤2：浏览协议
    if (newAgreementStep === 'view-agreement') {
      return (
        <div className="flex flex-col h-full bg-gray-50">
          <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center border-b border-gray-100">
            <button onClick={() => setNewAgreementStep('select-heir')} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 ml-2">传承协议</h1>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* 进度指示 */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs font-bold">1</div>
                  <span className="text-sm text-gray-400">选择继承人</span>
                </div>
                <div className="w-8 h-0.5 bg-blue-500" />
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <span className="text-sm text-blue-600 font-medium">签署协议</span>
                </div>
              </div>
            </div>

            {/* 协议内容 */}
            <div
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mx-4 mb-4 max-h-[400px] overflow-y-auto"
              onScroll={(e) => {
                const element = e.target as HTMLDivElement;
                if (element.scrollHeight - element.scrollTop <= element.clientHeight + 10) {
                  setHasScrolledToBottom(true);
                  setCanSignAgreement(true);
                }
              }}
            >
              <h2 className="text-[16px] font-bold text-gray-900 mb-4 text-center">代理人间客户传承协议</h2>

              <div className="text-[13px] text-gray-700 leading-relaxed space-y-3">
                <p><strong>甲方（传承代理人）：</strong>张朝扬（工号 1050134060）</p>
                <p><strong>乙方（继承代理人）：</strong>{newHeirName}（工号 {newHeirId})</p>
                <p><strong>丙方：</strong>平安人寿有限责任公司</p>

                <p className="mt-4">鉴于甲方自愿将其经营的客户资源传承给乙方，甲乙丙三方经协商一致，达成如下协议：</p>

                <p><strong>第一条 传承范围</strong></p>
                <p>甲方同意将其名下的客户资源（以下简称"传承客户")传承给乙方进行后续经营和服务。</p>

                <p><strong>第二条 传承条件</strong></p>
                <p>1. 传承客户给继承人时，需由客户授权同意；</p>
                <p>2. 传承后，继承人可独立经营该客户，传承人可获得一定比例的传承奖励；</p>
                <p>3. 继承人独立出单后，传承奖励将按照规则发放给传承人。</p>

                <p><strong>第三条 三方权利与义务</strong></p>
                <p>1. 甲方有权获得传承奖励，乙方有义务配合甲方完成传承流程；</p>
                <p>2. 乙方有权独立经营传承客户，但应妥善维护客户关系；</p>
                <p>3. 丙方负责监督协议执行，并按规则发放传承奖励；</p>
                <p>4. 客户可随时撤回传承授权，三方应尊重客户意愿。</p>

                <p><strong>第四条 协议生效</strong></p>
                <p>本协议自三方签署之日起生效，三方应严格遵守协议约定。</p>

                <p className="mt-6"><strong>甲方签字：</strong>____________________</p>
                <p className="mt-2"><strong>乙方签字：</strong>____________________</p>
                <p className="mt-2"><strong>丙方盖章：</strong>____________________</p>
                <p className="mt-2"><strong>签署日期：</strong>{new Date().toISOString().split('T')[0]}</p>
              </div>
            </div>

            {/* 提示 */}
            <div className="px-4 mb-4">
              {!canSignAgreement ? (
                <div className="bg-orange-50 rounded-xl p-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-[13px] text-orange-600">
                    请先阅读传承协议（{agreementReadTime > 0 ? `${agreementReadTime}秒后可签署` : '请滑动到底部'}）
                  </span>
                </div>
              ) : (
                <div className="bg-green-50 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-[13px] text-green-600">已阅读完毕，可以签署</span>
                </div>
              )}
            </div>

            {/* 签署按钮 */}
            <div className="px-4 pb-4">
              <button
                onClick={() => {
                  if (canSignAgreement) {
                    setNewAgreementStep('sign');
                  }
                }}
                disabled={!canSignAgreement}
                className={`w-full py-3.5 rounded-2xl font-bold text-[15px] shadow-lg transition-all ${canSignAgreement ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {canSignAgreement ? '同意传承协议并点击签署' : '请先阅读传承协议'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 步骤3：签名
    if (newAgreementStep === 'sign') {
      return (
        <div className="flex flex-col h-full bg-gray-50">
          <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center border-b border-gray-100">
            <button onClick={() => setNewAgreementStep('view-agreement')} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 ml-2">签署协议</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* 进度指示 */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs font-bold">1</div>
                <span className="text-sm text-gray-400">选择继承人</span>
              </div>
              <div className="w-8 h-0.5 bg-blue-500" />
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span className="text-sm text-blue-600 font-medium">签署协议</span>
              </div>
            </div>

            {/* 签名区域 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <label className="text-[14px] font-medium text-gray-700 mb-3 block">
                请在下方签署您的姓名
              </label>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 min-h-[150px] relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm" style={{ opacity: signatureText ? 0 : 0.5 }}>
                  点击此处开始签名
                </div>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder="张朝扬"
                  className="w-full text-center text-[24px] font-medium text-gray-800 bg-transparent border-none outline-none"
                  style={{ fontFamily: 'cursive' }}
                />
              </div>
            </div>

            {/* 签名提示 */}
            <div className="bg-blue-50 rounded-xl p-3 mb-4">
              <p className="text-[13px] text-blue-600">
                请使用您的真实姓名进行签名，签名后将无法修改
              </p>
            </div>

            {/* 确认签署按钮 - 不限制，可直接点击 */}
            <button
              onClick={() => {
                setNewAgreementStep('complete');
              }}
              className="w-full py-3.5 rounded-2xl font-bold text-[15px] shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              确认签署
            </button>
          </div>
        </div>
      );
    }

    // 步骤4：完成 - 查看签署协议详情页面
    if (newAgreementStep === 'complete') {
      return (
        <div className="flex flex-col h-full bg-gray-50">
          <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center border-b border-gray-100">
            <button onClick={() => { setCurrentPage('inheritance-customer'); setInheritanceTab('传承协议签署'); }} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 ml-2">传承协议详情</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* 协议签署状态 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <h3 className="text-[14px] font-bold text-gray-800 mb-3">协议签署状态</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-gray-800">传承人已签署</p>
                    <p className="text-[12px] text-gray-500">张朝扬 | 2026-03-15 14:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-[12px] text-gray-500 font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] text-gray-400">待继承人签署</p>
                    <p className="text-[12px] text-gray-400">{newHeirName} | 待签署</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-[12px] text-gray-500 font-bold">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] text-gray-400">待公司用印</p>
                    <p className="text-[12px] text-gray-400">平安人寿有限责任公司</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 协议基本信息 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <h3 className="text-[14px] font-bold text-gray-800 mb-3">协议信息</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[13px] text-gray-500">协议编号</span>
                  <span className="text-[13px] font-medium text-gray-800">INH-20260315001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-gray-500">传承代理人</span>
                  <span className="text-[13px] font-medium text-gray-800">张朝扬（工号 1050134060）</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-gray-500">继承代理人</span>
                  <span className="text-[13px] font-medium text-gray-800">{newHeirName}（工号 {newHeirId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-gray-500">签署时间</span>
                  <span className="text-[13px] font-medium text-gray-800">2026-03-15 14:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-gray-500">当前状态</span>
                  <span className="text-[12px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">待继承人签署</span>
                </div>
              </div>
            </div>

            {/* 协议文件浏览 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <h3 className="text-[14px] font-bold text-gray-800 mb-3">协议文件</h3>
              <div className="bg-gray-50 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                <div className="text-[13px] text-gray-700 leading-relaxed space-y-3">
                  <p className="text-center font-bold">代理人间客户传承协议</p>
                  <p><strong>甲方（传承代理人）：</strong>张朝扬（工号 1050134060）</p>
                  <p><strong>乙方（继承代理人）：</strong>{newHeirName}（工号 {newHeirId})</p>
                  <p><strong>丙方：</strong>平安人寿有限责任公司</p>
                  <p className="mt-3">鉴于甲方自愿将其经营的客户资源传承给乙方，甲乙丙三方经协商一致，达成如下协议：</p>
                  <p><strong>第一条 传承范围</strong></p>
                  <p>甲方同意将其名下的客户资源传承给乙方进行后续经营和服务。</p>
                  <p><strong>第二条 传承条件</strong></p>
                  <p>1. 传承客户给继承人时，需由客户授权同意；</p>
                  <p>2. 传承后，继承人可独立经营该客户，传承人可获得传承奖励；</p>
                  <p>3. 继承人独立出单后，传承奖励将按照规则发放。</p>
                  <p><strong>第三条 三方权利与义务</strong></p>
                  <p>1. 甲方有权获得传承奖励；</p>
                  <p>2. 乙方有权独立经营传承客户；</p>
                  <p>3. 丙方负责监督协议执行并发放奖励。</p>
                  <p><strong>第四条 协议生效</strong></p>
                  <p>本协议自三方签署之日起生效。</p>
                  <p className="mt-4"><strong>甲方签字：</strong>张朝扬</p>
                  <p><strong>乙方签字：</strong>（待签署）</p>
                  <p><strong>丙方盖章：</strong>（待用印）</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (currentPage === 'heir-sign-agreement' && selectedAgreement) {
    if (heirSignStep === 'view') {
      return (
        <div className="flex flex-col h-full bg-gray-50">
          <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center border-b border-gray-100">
            <button onClick={() => setCurrentPage('inheritance-customer')} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 ml-2">传承协议签署</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* 签署进度 */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">签署进度</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">传承人已签署</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">2</span>
                  </div>
                  <span className="text-xs text-orange-600 font-medium">待继承人签署</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">3</span>
                  </div>
                  <span className="text-xs text-gray-500">待公司用印</span>
                </div>
              </div>
            </div>

            {/* 协议信息 */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">协议信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">传承人</span>
                  <span className="text-gray-800">{selectedAgreement.inheritor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">继承人</span>
                  <span className="text-gray-800">{selectedAgreement.heir}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">传承代理人</span>
                  <span className="text-gray-800">张朝扬</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">继承代理人（乙方）</span>
                  <span className="text-gray-800">{selectedAgreement.heir}（工号：{selectedAgreement.heirId}）</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">签署时间</span>
                  <span className="text-gray-800">{selectedAgreement.time}</span>
                </div>
              </div>
            </div>

            {/* 协议文件浏览 */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">协议文件浏览</h3>
              <div
                className="border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto text-sm text-gray-600 leading-relaxed"
                onScroll={(e) => {
                  const target = e.target as HTMLDivElement;
                  const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
                  if (isAtBottom && heirSignReadTime > 0) {
                    setHeirCanSign(true);
                    setHeirSignReadTime(0);
                  }
                }}
              >
                <p className="text-center font-bold mb-4">代理人间客户传承协议</p>
                <p className="mb-2">甲方（传承代理人）：张朝扬</p>
                <p className="mb-2">乙方（继承代理人）：{selectedAgreement.heir}（工号：{selectedAgreement.heirId}）</p>
                <p className="mb-2">丙方：平安人寿有限责任公司</p>
                <p className="mb-4">鉴于甲方拟将其名下客户资源传承给乙方，经三方友好协商，达成如下协议：</p>
                <p className="mb-2"><strong>第一条 传承客户范围</strong></p>
                <p className="mb-2">甲方同意将其名下的客户资源传承给乙方，具体客户名单见附件。</p>
                <p className="mb-4">传承客户包括但不限于：客户姓名、联系方式、保单信息等。</p>
                <p className="mb-2"><strong>第二条 传承条件</strong></p>
                <p className="mb-2">1. 客户资源传承应获得客户本人书面同意；</p>
                <p className="mb-2">2. 乙方应具备相应的从业资质和能力；</p>
                <p className="mb-4">3. 传承过程应符合公司相关规定及监管要求。</p>
                <p className="mb-2"><strong>第三条 权利义务</strong></p>
                <p className="mb-2">1. 甲方应如实向乙方介绍客户情况；</p>
                <p className="mb-2">2. 乙方应妥善保管客户信息，保护客户隐私；</p>
                <p className="mb-4">3. 丙方负责监督传承过程，确保合规性。</p>
                <p className="mb-2"><strong>第四条 协议生效</strong></p>
                <p className="mb-4">本协议自三方签署之日起生效。</p>
                <p className="mt-4"><strong>甲方签字：</strong>张朝扬（已签署）</p>
                <p><strong>乙方签字：</strong>（待签署）</p>
                <p><strong>丙方盖章：</strong>（待用印）</p>
              </div>
              {heirSignReadTime > 0 && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span>请阅读协议内容（{heirSignReadTime}秒）或滚动到底部</span>
                </div>
              )}
              {heirCanSign && (
                <div className="mt-3 text-center text-sm text-green-600">
                  已阅读完毕，可以开始签署
                </div>
              )}
            </div>

            {/* 同意签署按钮 */}
            <button
              onClick={() => {
                if (heirCanSign) {
                  setHeirSignStep('sign');
                }
              }}
              disabled={!heirCanSign}
              className={`w-full py-3 rounded-xl font-medium ${
                heirCanSign
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {heirCanSign ? '同意并开始签署' : `等待阅读完成（${heirSignReadTime}秒）`}
            </button>
          </div>
        </div>
      );
    }

    if (heirSignStep === 'sign') {
      return (
        <div className="flex flex-col h-full bg-gray-50">
          <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center border-b border-gray-100">
            <button onClick={() => setHeirSignStep('view')} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 ml-2">签署协议</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <p className="text-sm text-gray-600 mb-4">
                请确认以下信息无误后，点击确认签署完成：
              </p>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">传承人</span>
                  <span className="text-gray-800">{selectedAgreement.inheritor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">继承人</span>
                  <span className="text-gray-800">{selectedAgreement.heir}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">继承代理人（乙方）</span>
                  <span className="text-gray-800">{selectedAgreement.heir}</span>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-lg p-6 mb-4">
                <p className="text-center text-gray-400 text-sm">签署区域</p>
                <p className="text-center text-gray-800 font-medium mt-2">乙方：{selectedAgreement.heir}</p>
                <p className="text-center text-xs text-gray-500 mt-1">已模拟签署完成</p>
              </div>
            </div>

            <button
              onClick={() => setHeirSignStep('complete')}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium"
            >
              确认签署完成
            </button>
          </div>
        </div>
      );
    }

    if (heirSignStep === 'complete') {
      return (
        <div className="flex flex-col h-full bg-gray-50">
          <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center border-b border-gray-100">
            <button onClick={() => setCurrentPage('inheritance-customer')} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 ml-2">签署完成</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">签署成功</h2>
              <p className="text-sm text-gray-500">协议已成功签署，等待公司用印</p>
            </div>

            {/* 签署进度 */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">签署进度</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">传承人已签署</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">继承人已签署</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">3</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">待公司用印</span>
                </div>
              </div>
            </div>

            {/* 协议信息 */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">协议信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">传承人</span>
                  <span className="text-gray-800">{selectedAgreement.inheritor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">继承人</span>
                  <span className="text-gray-800">{selectedAgreement.heir}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">签署状态</span>
                  <span className="text-blue-600 font-medium">待公司用印</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('inheritance-customer')}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium"
            >
              返回传承协议列表
            </button>
          </div>
        </div>
      );
    }
  }

  if (currentPage === 'inheritance-customer') return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center border-b border-gray-100">
        <button onClick={() => setCurrentPage('home')} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 ml-2">传承客户</h1>
      </div>

      {/* Tab切换 */}
      <div className="bg-white px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setInheritanceTab('传承客户清单')}
            className={`text-[15px] mr-6 pb-2 relative ${inheritanceTab === '传承客户清单' ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}
          >
            传承客户清单
            {inheritanceTab === '传承客户清单' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>}
          </button>
          <button
            onClick={() => setInheritanceTab('传承协议签署')}
            className={`text-[15px] pb-2 relative ${inheritanceTab === '传承协议签署' ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}
          >
            传承协议签署
            {inheritanceTab === '传承协议签署' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>}
          </button>
        </div>
      </div>

      {/* 传承协议签署内容 */}
      {inheritanceTab === '传承协议签署' && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* 筛选区域 */}
          <div className="flex items-center gap-3 mb-4">
            {/* 签署状态筛选 */}
            <button
              onClick={() => setShowStatusSheet(true)}
              className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-600 min-w-[100px]"
            >
              <span>{inheritanceAgreementFilter || '签署状态'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* 继承代理人筛选 */}
            <button
              onClick={() => setShowHeirSheet(true)}
              className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-600 min-w-[100px]"
            >
              <span>{inheritanceHeirFilter || '继承代理人'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* 新签传承协议链接 */}
            <button
              onClick={() => {
                setCurrentPage('new-inheritance-agreement');
                setNewAgreementStep('select-heir');
                setNewHeirId('');
                setNewHeirName('');
                setAgreementReadTime(5);
                setHasScrolledToBottom(false);
                setCanSignAgreement(false);
                setSignatureText('');
              }}
              className="flex items-center gap-1 text-blue-500 text-sm font-medium ml-auto"
            >
              <Plus className="w-4 h-4" />
              新签传承协议
            </button>
          </div>

          {/* 协议列表 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {[
                { id: 1, inheritor: '张小明', heir: '李小华', heirId: '100123', time: '2026-03-15', status: '待继承人签署' },
                { id: 2, inheritor: '王大明', heir: '陈小芳', heirId: '100456', time: '2026-03-10', status: '待继承人签署' },
                { id: 3, inheritor: '刘强', heir: '赵美玲', heirId: '100789', time: '2026-02-28', status: '待公司用印' },
                { id: 4, inheritor: '周伟', heir: '孙丽', heirId: '101012', time: '2026-02-20', status: '待公司用印' },
                { id: 5, inheritor: '李明', heir: '张芳', heirId: '101345', time: '2025-12-08', status: '签署完成' },
                { id: 6, inheritor: '赵刚', heir: '王红', heirId: '101678', time: '2025-11-15', status: '签署完成' },
              ]
                .filter(a => (inheritanceAgreementFilter === '' || a.status === inheritanceAgreementFilter) && (inheritanceHeirFilter === '' || a.heir === inheritanceHeirFilter))
                .map((agreement) => (
                <div
                  key={agreement.id}
                  onClick={() => {
                    // 如果是待继承人签署状态，跳转到继承人签署页面
                    if (agreement.status === '待继承人签署') {
                      setSelectedAgreement(agreement);
                      setCurrentPage('heir-sign-agreement');
                      setHeirSignStep('view');
                      setHeirSignReadTime(5);
                      setHeirCanSign(false);
                      setHeirSignatureText('');
                    }
                  }}
                  className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-medium text-gray-800">传承人：{agreement.inheritor}</span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className="text-sm font-medium text-gray-800">继承人：{agreement.heir}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">签署时间：{agreement.time}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        agreement.status === '待继承人签署' ? 'bg-orange-50 text-orange-600' :
                        agreement.status === '待公司用印' ? 'bg-blue-50 text-blue-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {agreement.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 传承客户清单内容 */}
      {inheritanceTab === '传承客户清单' && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* 我发起传承的客户 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-sm font-medium text-gray-700">我发起传承的客户</h3>
              </div>
              <span className="text-xs text-gray-400">共 4 人</span>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { id: 1, name: '张小明', phone: '138****1234', transferTime: '2026-03-15', status: '待客户确认', heirName: '李小华', heirId: '100123' },
                { id: 2, name: '王大明', phone: '139****5678', transferTime: '2026-02-20', status: '客户已同意', heirName: '陈小芳', heirId: '100456' },
                { id: 3, name: '刘强', phone: '137****9012', transferTime: '2025-12-08', status: '客户已拒绝', heirName: '赵美玲', heirId: '100789' },
                { id: 4, name: '周伟', phone: '135****6789', transferTime: '2025-10-15', status: '您已撤销', heirName: '孙丽', heirId: '101012' },
              ].map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer({
                      id: customer.id,
                      name: customer.name,
                      phone: customer.phone,
                      avatar: '',
                      source: '传承客户',
                      tags: [],
                      temperature: '中温',
                      value: 'B',
                      notes: '',
                      lastContact: customer.transferTime,
                      polices: [],
                      activities: [],
                      schedules: [],
                      familyMembers: []
                    });
                    setCurrentPage('customer-detail');
                  }}
                  className="px-4 py-3.5 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.phone}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      customer.status === '待客户确认' ? 'bg-orange-50 text-orange-600' :
                      customer.status === '客户已同意' ? 'bg-green-50 text-green-600' :
                      customer.status === '客户已拒绝' ? 'bg-red-50 text-red-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500">
                    {customer.transferTime} 传承给 {customer.heirName}（工号 {customer.heirId}）
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 我接收继承的客户 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="text-sm font-medium text-gray-700">我接收继承的客户</h3>
              </div>
              <span className="text-xs text-gray-400">共 2 人</span>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { id: 5, name: '陈小芳', phone: '136****3456', inheritTime: '2026-01-10', status: '客户已同意', fromName: '王大明', fromId: '100456' },
                { id: 6, name: '赵美玲', phone: '135****7890', inheritTime: '2025-11-05', status: '客户已同意', fromName: '刘强', fromId: '100789' },
              ].map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer({
                      id: customer.id,
                      name: customer.name,
                      phone: customer.phone,
                      avatar: '',
                      source: '传承客户',
                      tags: [],
                      temperature: '中温',
                      value: 'B',
                      notes: '',
                      lastContact: customer.inheritTime,
                      polices: [],
                      activities: [],
                      schedules: [],
                      familyMembers: []
                    });
                    setCurrentPage('customer-detail');
                  }}
                  className="px-4 py-3.5 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.phone}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-600">
                      {customer.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500">
                    {customer.inheritTime} 从 {customer.fromName}（工号 {customer.fromId}）处继承
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 签署状态筛选Sheet */}
      <AnimatePresence>
        {showStatusSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusSheet(false)}
              className="fixed inset-0 bg-black/40 z-[80]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 w-full max-w-md bg-white rounded-t-[24px] z-[90] overflow-hidden"
            >
              {/* Drag indicator */}
              <div className="relative h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />

              <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[16px] font-bold text-gray-900">签署状态</h3>
                  <button onClick={() => setShowStatusSheet(false)} className="p-1.5 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 选项列表 */}
                <div className="space-y-2">
                  {['全部', '待继承人签署', '待公司用印', '签署完成'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setInheritanceAgreementFilter(status === '全部' ? '' : status);
                        setShowStatusSheet(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-left text-[14px] transition-colors ${inheritanceAgreementFilter === (status === '全部' ? '' : status) ? 'bg-blue-50 text-blue-600 font-medium' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {status}
                      {inheritanceAgreementFilter === (status === '全部' ? '' : status) && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 inline-block ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 继承代理人筛选Sheet */}
      <AnimatePresence>
        {showHeirSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowHeirSheet(false); setHeirSearchQuery(''); }}
              className="fixed inset-0 bg-black/40 z-[80]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 w-full max-w-md bg-white rounded-t-[24px] z-[90] overflow-hidden"
            >
              {/* Drag indicator */}
              <div className="relative h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />

              <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[16px] font-bold text-gray-900">继承代理人</h3>
                  <button onClick={() => { setShowHeirSheet(false); setHeirSearchQuery(''); }} className="p-1.5 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 搜索框 */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索代理人姓名"
                    value={heirSearchQuery}
                    onChange={(e) => setHeirSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-[14px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* 代理人列表 */}
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {/* 全部选项 */}
                  <button
                    onClick={() => {
                      setInheritanceHeirFilter('');
                      setShowHeirSheet(false);
                      setHeirSearchQuery('');
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-left transition-colors ${inheritanceHeirFilter === '' ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <span className={`text-[14px] ${inheritanceHeirFilter === '' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>全部</span>
                  </button>

                  {/* 代理人列表 */}
                  {[
                    { name: '李小华', id: '100123' },
                    { name: '陈小芳', id: '100456' },
                    { name: '赵美玲', id: '100789' },
                    { name: '孙丽', id: '101012' },
                    { name: '张芳', id: '101345' },
                    { name: '王红', id: '101678' },
                  ]
                    .filter(heir => heir.name.toLowerCase().includes(heirSearchQuery.toLowerCase()))
                    .map((heir) => (
                    <button
                      key={heir.id}
                      onClick={() => {
                        setInheritanceHeirFilter(heir.name);
                        setShowHeirSheet(false);
                        setHeirSearchQuery('');
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-left transition-colors ${inheritanceHeirFilter === heir.name ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <span className={`text-[14px] ${inheritanceHeirFilter === heir.name ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>{heir.name}</span>
                      <span className={`text-[12px] ml-2 ${inheritanceHeirFilter === heir.name ? 'text-blue-500' : 'text-gray-500'}`}>工号 {heir.id}</span>
                      {inheritanceHeirFilter === heir.name && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 inline-block ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  const handleAiAction = (scenario: any) => {
    if (scenario.type === 'strategy') {
      // 跳转到AI聊天页面，自动发送访前锦囊请求
      setAiInitialMessage(`帮我整理下面访前的信息与资料，我要去面访${scenario.customer}`);
      setCurrentPage('ai-chat');
    }
    else if (scenario.type === 'birthday') {
      // 跳转到AI聊天页面，自动发送生日贺卡请求
      setAiInitialMessage(`客户${scenario.customer}后天要过生日，做个藏头诗祝福贺卡`);
      setCurrentPage('ai-chat');
    }
    else if (scenario.type === 'review_list') {
      // 跳转到AI聊天页面，自动发送消息获取客户列表
      setAiInitialMessage(scenario.text);
      setCurrentPage('ai-chat');
    }
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
        <AnimatePresence>
          {showProfileSheet && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfileSheet(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
              <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed left-0 top-0 bottom-0 bg-white z-[70] shadow-2xl overflow-y-auto max-w-md mx-auto w-full">
                {/* 头部信息 */}
                <div className="bg-gradient-to-b from-blue-50 to-white px-5 pt-12 pb-6">
                  {/* 返回按钮 */}
                  <button onClick={() => setShowProfileSheet(false)} className="absolute top-3 left-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-[80]">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">张朝扬</h2>
                      <p className="text-sm text-gray-500 mt-0.5">组经理 | 工号 1050134060</p>
                      <p className="text-xs text-gray-400 mt-1">中国平安人寿保险股份有限公司深圳分公司</p>
                    </div>
                  </div>
                </div>

                {/* 功能列表 */}
                <div className="px-4 py-3 space-y-3">
                  {/* 第一组 */}
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">我的名片</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">E 积分</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">0</span>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">保险小店</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">我的收藏</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* 活动 */}
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-[15px] text-gray-700">活动</span>
                      </div>
                      <button className="flex items-center text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer">
                        <span className="text-[13px] font-medium">全部活动</span>
                        <ChevronRight className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-4 relative overflow-hidden">
                        <div className="relative z-10">
                          <h3 className="text-lg font-bold text-orange-600">精彩活动 敬请期待</h3>
                          <p className="text-xs text-orange-400 mt-1">参加活动 享好礼</p>
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-24 h-24">
                          <div className="w-16 h-16 bg-orange-200/50 rounded-full absolute top-0 right-0"></div>
                          <div className="w-10 h-10 bg-yellow-300/50 rounded-full absolute bottom-2 right-4 rotate-12"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 第二组 */}
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">意见反馈</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">使用帮助</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">投诉</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">一键报警</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* 第三组 - 其他工具 */}
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">其他工具</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">登录设备管理</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">密码管理</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* 第四组 - 系统信息 */}
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">关于口袋E</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">V2.0.1</span>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.43-.743 2.74.743 2 2.073a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.743 1.43-.743 2.74-2.073 2a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.43.743-2.74-.743-2-2.073a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.743-1.43.743-2.74 2.073-2a1.724 1.724 0 002.572-1.065z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">设置</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* 第五组 - 政策与协议 */}
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">政策与协议</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">个人信息收集清单</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 000-2.684m0 2.684a6 6 0 001.108-1.108l2.256-2.256a3 3 0 00-4.264-4.264l-2.256 2.256a6 6 0 00-1.108 1.108m4.364 4.364a6 6 0 001.108-1.108l2.256-2.256a3 3 0 00-4.264 0m4.364 4.364a3 3 0 00-4.264 0m4.364-4.364a3 3 0 00-4.264 0" /></svg>
                          </div>
                          <span className="text-[15px] text-gray-700">第三方共享个人信息清单</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>
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
                <div onClick={() => setShowProfileSheet(true)} className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 cursor-pointer">
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
                    { id: 'task-6', time: '14:30', title: '刘敏 - 生日祝福提醒', type: '服务' },
                    { id: 'task-7', time: '16:00', title: '陈静 - 生日祝福提醒（农历）', type: '服务' },
                  ].map((task, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setEditingSchedule(task);
                        setCurrentPage('schedule-edit');
                      }}
                      className={`bg-white p-4 rounded-2xl flex items-center shadow-sm border transition-all cursor-pointer active:scale-[0.98] ${task.highlight ? 'border-blue-100 ring-4 ring-blue-500/5' : 'border-transparent'}`}
                    >
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
                <button onClick={() => setActiveTab('活动量')} className={`text-lg pb-1 relative transition-colors ${activeTab === '活动量' ? 'font-bold text-gray-900 border-b-2 border-indigo-600' : 'font-medium text-gray-400'}`}>
                  活动量
                </button>
                {activeTab === '做经营' && (
                  <button onClick={() => setCurrentPage('customer-search')} className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>

              {activeTab === '做经营' && (
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
              )}
              {activeTab === '客户库' && (
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
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-gray-900">我的客户</h2>
                      <button onClick={() => setCurrentPage('customer-list')} className="flex items-center text-xs text-gray-500 hover:text-indigo-600 transition-colors group cursor-pointer">
                        总计 <span className="text-indigo-600 font-bold text-lg mx-1 group-hover:scale-110 transition-transform">{currentData.total}</span> 人
                        <ChevronRight className="w-3 h-3 ml-0.5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      </button>
                    </div>
                    {/* Tab 与九宫格连为一体 */}
                    <div className="bg-gray-50/30 rounded-2xl shadow-sm overflow-hidden">
                      <div className="flex bg-gray-100/80">
                        {filters.map(f => (
                          <button key={f} onClick={() => setActiveFilter(f)} className={`flex-1 py-2.5 text-xs font-medium transition-all duration-200 relative ${activeFilter === f ? 'bg-gray-50/30 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                            {f}
                            {activeFilter === f && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-50/30"></div>}
                          </button>
                        ))}
                      </div>
                      <div className="p-4 bg-gray-50/30">
                        <div className="flex justify-center">
                          <div className="flex flex-col justify-around pr-1.5 text-[10px] text-gray-400 font-semibold h-[160px]">
                            <span>A</span>
                            <span>BC</span>
                            <span>DEF</span>
                          </div>
                          <div className="h-[160px]">
                            <AnimatePresence mode="wait">
                              <motion.div key={activeFilter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex flex-col gap-1">
                                {currentData.data.map((row, rowIndex) => (
                                  <div key={rowIndex} className="flex gap-1 h-[52px]">
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
                                        <motion.div key={`${rowIndex}-${colIndex}`} onClick={() => setCurrentPage('customer-list')} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: (rowIndex * 3 + colIndex) * 0.03 }} className="w-[100px] h-[52px] rounded-lg flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all" style={{ backgroundColor: `rgba(${baseColor}, ${bgOpacity})` }}>
                                          <span className={`text-base font-bold z-10 ${finalTextColor}`}>{cell}</span>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                        <div className="flex justify-center mt-2">
                          <div className="flex gap-[97px] text-[10px] text-gray-400 font-semibold">
                            <span>冷却</span>
                            <span>低温</span>
                            <span>中高温</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 权益客户 */}
                    <div className="bg-gray-50/30 rounded-xl p-3 mt-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-1 h-4 bg-blue-600 rounded-sm mr-2"></div>
                          <span className="text-[13px] font-bold text-gray-800">权益客户</span>
                        </div>
                        <div className="flex bg-gray-100 rounded-lg p-0.5">
                          {['添平安', '家办', '会员'].map(tab => (
                            <button
                              key={tab}
                              onClick={() => setEquityTab(tab)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                                equityTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>
                      {equityTab === '添平安' && (
                        <div className="flex justify-around mt-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">12</p>
                            <p className="text-[10px] text-gray-500 mt-1">权益潜客</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">8</p>
                            <p className="text-[10px] text-gray-500 mt-1">意向客户</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">5</p>
                            <p className="text-[10px] text-gray-500 mt-1">达标客户</p>
                          </div>
                        </div>
                      )}
                      {equityTab === '家办' && (
                        <div className="flex justify-around mt-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">6</p>
                            <p className="text-[10px] text-gray-500 mt-1">权益潜客</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">3</p>
                            <p className="text-[10px] text-gray-500 mt-1">意向客户</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">2</p>
                            <p className="text-[10px] text-gray-500 mt-1">达标客户</p>
                          </div>
                        </div>
                      )}
                      {equityTab === '会员' && (
                        <div className="flex justify-around mt-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">25</p>
                            <p className="text-[10px] text-gray-500 mt-1">权益潜客</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">18</p>
                            <p className="text-[10px] text-gray-500 mt-1">意向客户</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">10</p>
                            <p className="text-[10px] text-gray-500 mt-1">达标客户</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <button onClick={() => setCurrentPage('more-dimensions')} className="w-full mt-3 py-3 bg-gray-50/30 rounded-xl text-[13px] text-gray-600 font-medium flex items-center justify-center hover:bg-gray-50/50 transition-colors group">
                      <BarChart3 className="w-4 h-4 mr-2 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                      查看更多维度分布图
                      <ChevronRight className="w-4 h-4 ml-1 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* 经营工具 */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-around gap-2">
                        {tools.map((tool, idx) => (
                          <div key={idx} onClick={() => {
                            if (tool.label === '客户笔记') {
                              setCurrentPage('customer-notes');
                            }
                          }} className="flex items-center cursor-pointer group hover:text-blue-600 transition-colors whitespace-nowrap">
                            <tool.icon className="w-4 h-4 text-gray-800 mr-1.5" />
                            <span className="text-[12px] text-gray-600 font-medium">{tool.label}</span>
                          </div>
                        ))}
                        <div onClick={() => setShowMoreTools(!showMoreTools)} className="flex items-center cursor-pointer group hover:text-blue-600 transition-colors whitespace-nowrap">
                          <ChevronDown className={`w-4 h-4 text-gray-800 mr-1.5 transition-transform ${showMoreTools ? 'rotate-180' : ''}`} />
                          <span className="text-[12px] font-medium text-gray-500">更多</span>
                        </div>
                      </div>
                      <AnimatePresence>
                        {showMoreTools && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="flex flex-wrap items-center justify-around gap-x-2 gap-y-3 mt-3 pt-3 border-t border-gray-50/50">
                              {moreTools.map((tool, idx) => (
                              <div key={idx} onClick={() => {
                                if (tool.label === '传承客户') {
                                  setCurrentPage('inheritance-customer');
                                }
                              }} className="flex items-center cursor-pointer group hover:text-blue-600 transition-colors whitespace-nowrap">
                                <tool.icon className="w-4 h-4 text-gray-800 mr-1.5" />
                                <span className="text-[12px] text-gray-600 font-medium">{tool.label}</span>
                              </div>
                            ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* 客户动态 */}
                  <div className="p-5 bg-white mt-3 rounded-3xl shadow-sm mx-3">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-gray-900">客户动态</h2>
                      <button className="flex items-center text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer group">
                        <span className="text-[11px] font-medium">全部动态</span>
                        <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    {/* 快捷筛选项 */}
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-1 px-1">
                      {['未读动态', '服务使用', '客户拜访', '日程互动', '产品购买'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setDynamicFilter(filter)}
                          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                            dynamicFilter === filter ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                          }`}
                        >
                          {filter}
                          {filter === '未读动态' && <span className="ml-1 bg-rose-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">3</span>}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-[7px] before:w-[2px] before:bg-gray-50">
                      {[
                        { name: '张伟', time: '10分钟前', category: '资讯阅读', action: '阅读了资讯《添平安25年服务年报》', hasDetail: true },
                        { name: '王静', time: '1小时前', category: '产品浏览', action: '浏览了产品e生保惠享', hasDetail: true },
                        { name: '刘洋', time: '4小时前', category: '服务使用', action: '完成睡眠状况综合评测', hasDetail: true },
                      ].map((activity, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center z-10">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-[15px] font-bold text-gray-900">{activity.name}</span>
                              <span className="text-[11px] text-gray-400 font-medium ml-2">{activity.time}</span>
                            </div>
                            {activity.hasDetail && (
                              <ChevronRight className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-[11px] font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded mr-2">{activity.category}</span>
                            <p className="text-[13px] text-gray-500 leading-relaxed">{activity.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-3 border-t border-gray-50 text-center">
                      <button className="text-[13px] font-bold text-gray-400 hover:text-indigo-600 transition-colors">查看更多动态</button>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === '活动量' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
                  <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                    <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <Activity className="w-20 h-20 text-gray-200" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">活动量</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">正在建设</p>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* 发展板块 */}
          {activeBottomNav === '发展' && (
            <>
              {/* Tab Switcher */}
              <div className="flex space-x-6 items-center px-4 py-3 bg-white sticky top-0 z-30">
                <button onClick={() => setDevTab('个人发展')} className={`text-lg pb-1 relative transition-colors ${devTab === '个人发展' ? 'font-bold text-gray-900 border-b-2 border-indigo-600' : 'font-medium text-gray-400'}`}>
                  个人发展
                </button>
                <button onClick={() => setDevTab('团队发展')} className={`text-lg pb-1 relative transition-colors ${devTab === '团队发展' ? 'font-bold text-gray-900 border-b-2 border-indigo-600' : 'font-medium text-gray-400'}`}>
                  团队发展
                </button>
              </div>

              {/* Placeholder Content */}
              <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-20 h-20 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{devTab}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">功能正在开发中，敬请期待</p>
              </div>
            </>
          )}

          {/* 产品板块 */}
          {activeBottomNav === '产品' && (
            <>
              {/* Tab Switcher */}
              <div className="flex space-x-6 items-center px-4 py-3 bg-white sticky top-0 z-30">
                <button onClick={() => setProductTab('寿险')} className={`text-lg pb-1 relative transition-colors ${productTab === '寿险' ? 'font-bold text-gray-900 border-b-2 border-indigo-600' : 'font-medium text-gray-400'}`}>
                  寿险
                </button>
                <button onClick={() => setProductTab('综拓')} className={`text-lg pb-1 relative transition-colors ${productTab === '综拓' ? 'font-bold text-gray-900 border-b-2 border-indigo-600' : 'font-medium text-gray-400'}`}>
                  综拓
                </button>
              </div>

              {/* Placeholder Content */}
              <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-20 h-20 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{productTab}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">功能正在开发中，敬请期待</p>
              </div>
            </>
          )}

          {/* 服务板块 */}
          {activeBottomNav === '服务' && (
            <>
              {/* Tab Switcher */}
              <div className="flex space-x-6 items-center px-4 py-3 bg-white sticky top-0 z-30">
                <button onClick={() => setServiceTab('服务')} className={`text-lg pb-1 relative transition-colors ${serviceTab === '服务' ? 'font-bold text-gray-900 border-b-2 border-indigo-600' : 'font-medium text-gray-400'}`}>
                  服务
                </button>
              </div>

              {/* Placeholder Content */}
              <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Headphones className="w-20 h-20 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{serviceTab}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">功能正在开发中，敬请期待</p>
              </div>
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        {currentPage !== 'chat' && currentPage !== 'ai-chat' && (
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 pb-safe z-40">
            <div className="flex justify-around items-center h-16">
              {[
                { icon: Home, label: '首页' },
                { icon: Users, label: '客户' },
                { icon: Package, label: '产品' },
                { icon: Headphones, label: '服务' },
                { icon: TrendingUp, label: '发展' },
              ].map((item, idx) => {
                const isActive = (item.label === '首页' && activeBottomNav === '首页') || (item.label === '客户' && activeBottomNav === '客户');
                const isUnderDevelopment = item.label === '产品' || item.label === '服务' || item.label === '发展';
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

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, MoreHorizontal, Copy, Eye, EyeOff, Edit3, Plus, MapPin, Info, CheckCircle2, Shield, Calendar, Heart, Activity, FileText, Briefcase, Users, MessageSquare, ChevronDown, ChevronRight, Menu, X, Phone, Cake, UserPlus, ShieldCheck, Clock, Send, ExternalLink, Search, Sparkles, Plane, Share2, RotateCcw, TrendingUp, MessageCircle, Target, Award, BarChart3, Brain, Zap, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomerDetailPageNew({ customer, onBack, onSharedCustomerList, initialTab, onToggleVersion }: { customer: any, onBack: () => void, onSharedCustomerList?: () => void, initialTab?: string, onToggleVersion?: () => void }) {
  const [activeTab, setActiveTab] = useState(initialTab || '客户信息');
  const [showSensitive, setShowSensitive] = useState(false);
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [showMoreBasicInfo, setShowMoreBasicInfo] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [infoSheetTab, setInfoSheetTab] = useState('基本信息');
  const [temperature, setTemperature] = useState(customer?.temperature || '低温');
  const [showTempModal, setShowTempModal] = useState(false);
  const [tags, setTags] = useState<string[]>(customer?.tags || ['社会中坚', '健康']);
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showBirthdayCard, setShowBirthdayCard] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const [collapsedThemes, setCollapsedThemes] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState('全部');
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [selectedSource, setSelectedSource] = useState('全部');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('本人');
  const [selectedPolicyCategory, setSelectedPolicyCategory] = useState('全部');
  const [showInvalidPolicies, setShowInvalidPolicies] = useState(false);
  const [selectedTimelineType, setSelectedTimelineType] = useState('全部');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showTransferSheet, setShowTransferSheet] = useState(false);
  const [transferAgentId, setTransferAgentId] = useState('');
  const [transferAgentName, setTransferAgentName] = useState('');
  const [showTransferAgentDropdown, setShowTransferAgentDropdown] = useState(false);
  const [transferStatus, setTransferStatus] = useState<'idle' | 'sent' | 'pending'>('idle');
  const [showWechatPrompt, setShowWechatPrompt] = useState(false);
  const hasSignedInheritanceAgreement = customer?.name === '曹嘉玲' || customer?.name === '邓逵' || customer?.name === '张小明';
  const transferAgents = hasSignedInheritanceAgreement ? [
    { id: '100123', name: '李小华' },
    { id: '100456', name: '陈小芳' },
    { id: '100789', name: '赵美玲' },
  ] : [];
  const [shareAgentId, setShareAgentId] = useState('');
  const [foundAgentName, setFoundAgentName] = useState('');
  const [foundAgentTenure, setFoundAgentTenure] = useState<number | null>(null);
  const [isSearchingAgent, setIsSearchingAgent] = useState(false);
  const [showInheritanceChoice, setShowInheritanceChoice] = useState(false);
  const [shareType, setShareType] = useState<'share' | 'inherit' | null>(null);
  const [showSignAgreement, setShowSignAgreement] = useState(false);
  const [showSignatureScreen, setShowSignatureScreen] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [showAgreementView, setShowAgreementView] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const isSigningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const latestHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSignatureScreen) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    const container = canvas.parentElement;
    if (!container) return;
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isSigningRef.current) return;
      e.preventDefault();
      const pos = getPos(e);
      const context = canvas.getContext('2d');
      if (!context) return;
      context.strokeStyle = '#1a1a1a';
      context.lineWidth = 3;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineTo(pos.x, pos.y);
      context.stroke();
    };
    const startDraw = (e: MouseEvent | TouchEvent) => {
      isSigningRef.current = true;
      const pos = getPos(e);
      const context = canvas.getContext('2d');
      if (context) {
        context.beginPath();
        context.moveTo(pos.x, pos.y);
      }
    };
    const stopDraw = () => { isSigningRef.current = false; };
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    return () => {
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDraw);
      canvas.removeEventListener('mouseleave', stopDraw);
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDraw);
      canvas.removeEventListener('touchstart', startDraw);
    };
  }, [showSignatureScreen]);

  useEffect(() => {
    if (showSignatureScreen) {
      const canvas = signatureCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.getBoundingClientRect().width;
      canvas.height = container.getBoundingClientRect().height;
    }
  }, [showSignatureScreen]);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const familyMembers = [
    { id: '本人', name: '曹嘉玲', relation: '本人', gender: '女', age: 38, isCustomer: true, occupation: '企业高管', health: '良好', policyCount: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CJL&gender=female' },
    { id: '配偶', name: '周龙', relation: '配偶', gender: '男', age: 40, isCustomer: true, occupation: '私企老板', health: '一般', policyCount: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhouLong&gender=male' },
    { id: '儿子', name: '周小龙', relation: '儿子', gender: '男', age: 10, isCustomer: false, occupation: '学生', health: '优秀', policyCount: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Son&gender=male' },
    { id: '母亲', name: '周艳均', relation: '母亲', gender: '女', age: 60, isCustomer: true, occupation: '退休', health: '良好', policyCount: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mother&gender=female' },
  ];

  const policyCategories = ['全部', '寿险', '养老险', '健康险', '有理赔记录'];

  const policies = useMemo(() => [
    { id: 1, name: '平安六福', type: '健康险', member: '本人', status: '保障中', premium: '12,000', periodicPremium: '12,000', coverage: '500,000', policyNo: 'PA66882233', policyholder: '曹嘉玲', insured: '曹嘉玲', startDate: '2020-01-01', endDate: '终身', period: '终身', hasProposal: true, isValid: true, hasClaim: false },
    { id: 2, name: '终身寿险', type: '寿险', member: '本人', status: '保障中', premium: '25,000', periodicPremium: '25,000', coverage: '1,000,000', policyNo: 'PA99001122', policyholder: '曹嘉玲', insured: '曹嘉玲', startDate: '2018-05-20', endDate: '终身', period: '终身', hasProposal: false, isValid: true, hasClaim: true },
    { id: 3, name: '少儿平安福', type: '健康险', member: '儿子', status: '保障中', premium: '8,000', periodicPremium: '8,000', coverage: '300,000', policyNo: 'PA55443322', policyholder: '曹嘉玲', insured: '周小龙', startDate: '2022-03-15', endDate: '终身', period: '终身', hasProposal: true, isValid: true, hasClaim: true },
    { id: 4, name: '乐享养老', type: '养老险', member: '配偶', status: '保障中', premium: '15,000', periodicPremium: '15,000', coverage: '200,000', policyNo: 'PA11223344', policyholder: '曹嘉玲', insured: '周龙', startDate: '2021-11-11', endDate: '2050-11-11', period: '至60岁', hasProposal: false, isValid: true, hasClaim: false },
    { id: 5, name: '百万医疗', type: '健康险', member: '本人', status: '已到期', premium: '1,200', periodicPremium: '1,200', coverage: '2,000,000', policyNo: 'PA77889900', policyholder: '曹嘉玲', insured: '曹嘉玲', startDate: '2021-06-01', endDate: '2022-05-31', period: '1年', hasProposal: false, isValid: false, hasClaim: false },
    { id: 6, name: '年金险', type: '养老险', member: '母亲', status: '保障中', premium: '6,000', periodicPremium: '6,000', coverage: '100,000', policyNo: 'PA33445566', policyholder: '曹嘉玲', insured: '周艳均', startDate: '2019-09-01', endDate: '终身', period: '终身', hasProposal: true, isValid: true, hasClaim: false },
  ], []);

  const filteredPolicies = policies.filter(policy => {
    if (selectedPolicyCategory === '全部') return true;
    if (selectedPolicyCategory === '有理赔记录') return policy.hasClaim;
    return policy.type === selectedPolicyCategory;
  }).filter(policy => {
    if (!showInvalidPolicies) return policy.isValid;
    return true;
  });

  const materials = [
    { id: 1, title: '客户沟通话术', category: '话术', icon: MessageSquare, color: 'bg-blue-500', script: '王总您好，最近看到您关注养老社区的信息，我们正好有一个养老社区的体验活动，您看这周末有时间来参加吗？' },
    { id: 2, title: '养老金方案对比', category: '方案', icon: FileText, color: 'bg-emerald-500' },
    { id: 3, title: '高端医疗介绍', category: '资料', icon: Shield, color: 'bg-purple-500' },
  ];

  // 经营素材相关数据
  const stages = ['全部', '触客', '面访', '邀约'];
  const recommendationSources = ['全部', '生日', '精选名单-有钱妈妈', '权益到期', '客户需求'];

  const suggestions = useMemo(() => [
    {
      id: 1,
      type: '长图文',
      title: '当孩子教育遇上父母养老，高知父母如何两头承压？',
      content: '当孩子教育遇上父母养老，高知父母面临着巨大的经济和心理压力。如何通过合理的资产配置，实现家庭责任平衡。',
      thumbnail: 'https://picsum.photos/seed/edu/200/200',
      reason: '基于客户需求，推荐向客户转发',
      source: '客户需求',
      stage: '触客',
      materialType: '文章',
      actions: [{ label: '查看素材', primary: false }, { label: '互动指导', primary: true }],
      priority: 10,
      sourceDate: '2026-03-15',
    },
    {
      id: 2,
      type: '视频',
      title: '三分钟带你读懂：养老金账户的秘密',
      content: '个人养老金制度正式落地，究竟该不该开户？一文看懂核心利益点。',
      thumbnail: 'https://picsum.photos/seed/video/200/200',
      reason: '客户在有钱妈妈精选名单中',
      source: '精选名单-有钱妈妈',
      stage: '面访',
      materialType: '视频',
      actions: [{ label: '播放视频', primary: true }, { label: '互动指导', primary: false }],
      priority: 8,
      sourceDate: '2026-03-10',
    },
    {
      id: 3,
      type: '权益',
      title: '高端体检服务：尊享健康管理',
      content: '为您和您的家人提供全方位的健康体检与深度筛查，呵护全家健康。',
      thumbnail: 'https://picsum.photos/seed/health/200/200',
      reason: '客户权益即将到期',
      source: '权益到期',
      stage: '邀约',
      materialType: '权益',
      actions: [{ label: '邀约客户', primary: true }, { label: '互动指导', primary: false }],
      priority: 15,
      sourceDate: '2026-03-17',
    },
    {
      id: 4,
      type: '生日',
      title: '生日专属祝福：定制化贺卡',
      content: '在客户生日之际，送上一份最真挚的祝福，拉近彼此距离。',
      thumbnail: 'https://picsum.photos/seed/birthday/200/200',
      reason: '生日',
      source: '生日',
      stage: '触客',
      materialType: '生日',
      actions: [{ label: '发送贺卡', primary: true }],
      priority: 20,
      sourceDate: '2026-03-18',
    },
  ], []);

  const filteredSuggestions = useMemo(() => {
    const stagePriorityMap: Record<string, string[]> = {
      '低温': ['触客', '面访', '邀约'],
      '中温': ['面访', '邀约', '触客'],
      '高温': ['邀约', '面访', '触客']
    };
    const currentStagePriority = stagePriorityMap[temperature] || ['触客', '面访', '邀约'];
    return suggestions
      .filter(s => {
        const stageMatch = selectedStage === '全部' || s.stage === selectedStage;
        const sourceMatch = selectedSource === '全部' || s.source === selectedSource;
        const searchMatch = !searchQuery ||
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase());
        return stageMatch && sourceMatch && searchMatch;
      })
      .sort((a, b) => {
        const aStageIdx = currentStagePriority.indexOf(a.stage);
        const bStageIdx = currentStagePriority.indexOf(b.stage);
        if (aStageIdx !== bStageIdx) return aStageIdx - bStageIdx;
        return b.priority - a.priority;
      });
  }, [selectedStage, selectedSource, searchQuery, suggestions, temperature]);

  // 客户权益数据
  const benefits = [
    {
      id: 1,
      title: '高端体检服务',
      description: '包含全套深度体检项目，覆盖心脑血管、肿瘤筛查等。',
      status: '可使用',
      count: '1次/年',
      remaining: '1次',
      expiryDate: '2026-12-31',
      icon: <Activity className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50',
      tag: '健康管理'
    },
    {
      id: 2,
      title: '机场贵宾厅服务',
      description: '全球指定机场贵宾厅无限次使用，尊享舒适候机体验。',
      status: '可使用',
      count: '4次/年',
      remaining: '2次',
      expiryDate: '2026-12-31',
      icon: <Plane className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-50',
      tag: '尊享出行'
    },
    {
      id: 3,
      title: '专家门诊预约',
      description: '全国三甲医院专家号源优先预约，全程导诊服务。',
      status: '可使用',
      count: '3次/年',
      remaining: '3次',
      expiryDate: '2026-12-31',
      icon: <UserPlus className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-50',
      tag: '医疗绿色通道'
    },
    {
      id: 4,
      title: '高端养老社区参观',
      description: '预约参观平安臻颐年养老社区，体验高品质养老生活。',
      status: '可使用',
      count: '1次',
      remaining: '1次',
      expiryDate: '长期有效',
      icon: <Briefcase className="w-5 h-5 text-orange-500" />,
      bg: 'bg-orange-50',
      tag: '养老规划'
    },
    {
      id: 5,
      title: '法律咨询服务',
      description: '资深律师提供家庭财富传承、婚姻家庭等法律咨询。',
      status: '已到期',
      count: '2次/年',
      remaining: '0次',
      expiryDate: '2025-12-31',
      icon: <Shield className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-50',
      tag: '财富保全'
    }
  ];

  // 时光轴数据
  const timelineData = useMemo(() => [
    { date: '2023-08-15', title: '客户动态', subType: '日常互动', content: '通过线上获客渠道添加客户，来源：朋友圈分享', type: 'history', icon: UserPlus },
    { date: '2023-09-10', title: '客户拜访', subType: '首次面谈', content: '在南山区咖啡厅进行首次面谈，客户对养老金表现出浓厚兴趣', type: 'history', icon: MessageSquare },
    { date: '2023-10-01', title: '客户动态', subType: '保单变动', content: '客户投保《平安六福》重疾险，保单号：PA66882233，首期保费已到账', type: 'history', icon: ShieldCheck, policyNo: 'PA66882233' },
    { date: '2024-02-14', title: '客户笔记', subType: '生活琐事', content: '客户提到近期计划全家去日本旅游，建议回国后跟进旅游险或意外险', type: 'history', icon: Heart },
    { date: '2024-03-18', title: '客户动态', subType: '日常互动', content: '微信咨询：最近平安有什么新的养老产品吗？', type: 'history', icon: MessageSquare },
    { date: '2024-03-18', title: '客户动态', subType: '浏览素材', content: '浏览文章《2024养老金新规解读》，停留时长：45秒', type: 'history', icon: FileText, themeId: 'article_123' },
    { date: '2024-03-18', title: '客户动态', subType: '浏览素材', content: '浏览文章《2024养老金新规解读》，停留时长：120秒', type: 'history', icon: FileText, themeId: 'article_123' },
    { date: '2024-03-18', title: '客户动态', subType: '浏览素材', content: '浏览文章《2024养老金新规解读》，停留时长：15秒', type: 'history', icon: FileText, themeId: 'article_123' },
    { date: '2024-03-18', title: '客户笔记', subType: '需求分析', content: '客户对个人养老金账户的抵税功能非常关注，年收入约50万', type: 'history', icon: Edit3 },
    { date: '2024-03-18', title: '客户拜访', subType: '方案讲解', content: '面谈讲解养老金方案，客户表示需要回家和配偶商量', type: 'history', icon: Users },
    { date: '2025-12-01', title: '周年提醒', subType: '保单周年', content: '《平安六福》投保满两年，建议进行保单检视', type: 'touchpoint', icon: ShieldCheck },
    { date: '2025-12-20', title: '客户动态', subType: '浏览素材', content: '客户阅读了《家庭资产配置建议书》，重点关注了医疗保障章节', type: 'history', icon: FileText },
    { date: '2026-04-15', title: '保单续保', subType: '续保提醒', content: '《平安六福》保单即将到期，需提醒客户续保', type: 'touchpoint', icon: Activity, policyNo: 'PA66882233' },
    { date: '2026-07-14', title: '生日提醒', subType: '生日祝福', content: '客户40岁生日，建议提前准备生日礼品或祝福', type: 'touchpoint', icon: Cake },
    { date: '2026-10-17', title: '证件到期', subType: '证件更新', content: '客户身份证即将到期，需提醒及时更新证件信息', type: 'touchpoint', icon: FileText },
  ], []);

  const timelineTypes = ['全部', '客户动态', '客户笔记', '客户拜访', '提醒事项'];

  const filteredTimelineData = useMemo(() => {
    return timelineData.filter(item => {
      const typeMatch = selectedTimelineType === '全部' ||
                        item.title === selectedTimelineType ||
                        (selectedTimelineType === '提醒事项' && item.type === 'touchpoint');
      const dateMatch = (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate);
      return typeMatch && dateMatch;
    });
  }, [timelineData, selectedTimelineType, startDate, endDate]);

  const currentMonthStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const groupedTimeline = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredTimelineData.forEach(item => {
      const month = item.date.substring(0, 7);
      if (!groups[month]) groups[month] = [];
      groups[month].push(item);
    });
    const processedGroups: Record<string, any[]> = {};
    Object.entries(groups).forEach(([month, items]) => {
      const groupedItems: any[] = [];
      let currentGroup: any[] = [];
      items.forEach((item, idx) => {
        if (item.themeId) {
          if (currentGroup.length > 0 && currentGroup[0].themeId === item.themeId) {
            currentGroup.push(item);
          } else {
            if (currentGroup.length > 0) groupedItems.push({ type: 'themeGroup', items: currentGroup });
            currentGroup = [item];
          }
        } else {
          if (currentGroup.length > 0) {
            groupedItems.push({ type: 'themeGroup', items: currentGroup });
            currentGroup = [];
          }
          groupedItems.push(item);
        }
        if (idx === items.length - 1 && currentGroup.length > 0) {
          groupedItems.push({ type: 'themeGroup', items: currentGroup });
        }
      });
      processedGroups[month] = groupedItems;
    });
    return Object.entries(processedGroups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTimelineData]);

  const toggleTheme = (themeId: string) => {
    setCollapsedThemes(prev =>
      prev.includes(themeId) ? prev.filter(t => t !== themeId) : [...prev, themeId]
    );
  };

  const toggleMonth = (month: string) => {
    setExpandedMonths(prev =>
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  };

  const latestHistoryIndex = useMemo(() => {
    let lastIdx = -1;
    timelineData.forEach((item, idx) => {
      if (item.type === 'history') lastIdx = idx;
    });
    return lastIdx;
  }, [timelineData]);

  const invalidPolicies = useMemo(() => {
    return policies.filter(p => !p.isValid);
  }, [policies]);

  const policyStages = ['全部', '保障型', '储蓄型', '养老型'];
  const policySources = ['全部', '新单', '续保', '加保'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === '时光轴' && latestHistoryRef.current) {
      setTimeout(() => {
        latestHistoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
      if (activeTabElement) {
        const container = tabsRef.current;
        const scrollLeft = activeTabElement.offsetLeft - (container.offsetWidth / 2) + (activeTabElement.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  // 新的tabs，不包含客户画像
  const tabs = ['客户信息', '已购保单', '时光轴', '经营素材', '客户权益'];

  const InfoRow = ({ label, value, maskedValue, onCopy, hasMap }: { label: string, value: React.ReactNode, maskedValue?: string, onCopy?: string, hasMap?: boolean }) => (
    <div className="flex items-start py-1.5">
      <span className="w-20 text-[14px] text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 flex items-start justify-between">
        <div className="text-[15px] text-gray-900 leading-snug pr-2 break-all">
          {maskedValue ? (showSensitive ? value : maskedValue) : value}
        </div>
        {(onCopy || hasMap) && (
          <div className="flex items-center shrink-0 mt-0.5 space-x-4">
            {onCopy && (
              <button onClick={() => copyToClipboard(onCopy)} className="text-blue-500 hover:text-blue-600">
                <Copy className="w-4 h-4" />
              </button>
            )}
            {hasMap && (
              <button className="text-blue-500 hover:text-blue-600">
                <MapPin className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 客户洞察数据
  const customerInsights = {
    basicInfoTags: ['企业中坚', '年入50-100万', '已婚有子', '高净值', '理性决策'],
    familyTags: ['三代同堂'],
    riskLevel: '中低风险',
    growthPotential: '高潜力',
    contactFrequency: '近30天接触4次',
    nextAction: '建议安排养老社区参观',
  };

  return (
    <div className="min-h-screen bg-red-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl flex flex-col relative pb-20">

        {/* Header & Profile Summary */}
        <div className="bg-white pt-12 pb-4 px-4 relative border-b border-gray-100">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <button onClick={onBack} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">V2</span>
              <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMenu(false)}
                  className="fixed inset-0 bg-black/20 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 right-4 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="py-1">
                    <button
                      onClick={() => { setShowMenu(false); setShowShareSheet(true); }}
                      className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">共享客户</span>
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); setShowTransferSheet(true); }}
                      className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <Users className="w-4 h-4 text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">传承客户</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => { setShowMenu(false); onToggleVersion?.(); }}
                      className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <Layers className="w-4 h-4 text-blue-500 mr-3" />
                      <span className="text-sm text-blue-600 font-medium">切换到旧版</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="mt-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                {/* Avatar */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-medium shadow-sm ${customer?.color || 'bg-blue-500'}`}>
                    {customer?.isImage ? (
                      <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      customer?.avatar || '客'
                    )}
                  </div>
                  {customer?.isVip && (
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-300 to-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                      VIP
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="ml-3 flex flex-col justify-center">
                  <div className="flex items-center flex-wrap mb-1.5 gap-y-1">
                    <span className="text-[18px] font-bold text-gray-900">{customer?.name || '未知客户'}</span>
                    <div className={`ml-2 px-1.5 py-0.5 rounded text-[11px] flex items-center font-medium ${customer?.gender === 'M' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>
                      {customer?.gender === 'M' ? '♂' : '♀'} {customer?.age || '--'}岁
                    </div>
                    {customer?.daysToBirthday !== undefined && customer.daysToBirthday <= 7 && (
                      <div className="ml-2 flex items-center text-[11px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 font-medium">
                        <Cake className="w-3 h-3 mr-1" />
                        {customer.daysToBirthday === 0 ? '今天生日' : `${customer.daysToBirthday}天后生日`}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                    {tags.map((tag: string, i: number) => (
                      <span key={i} className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[11px] rounded border border-gray-100">{tag}</span>
                    ))}
                    <button
                      onClick={() => setShowTagModal(true)}
                      className="px-1.5 py-0.5 bg-blue-50 text-blue-500 text-[11px] rounded border border-blue-100 flex items-center hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-3 h-3 mr-0.5" />
                      添加
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remarks Bar */}
          <div className="mt-3 flex items-center bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-100/50">
            <span className="text-[12px] text-gray-400 shrink-0 mr-2">备注:</span>
            <div className="flex-1 text-[13px] text-gray-600 truncate">
              {customer?.remark || '客户偏好高端医疗险，对养老社区有一定兴趣。近期可跟进重疾险加保方案。'}
            </div>
            <button className="text-blue-500 ml-2">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stats Bar - 移除了客户类型，改为4列 */}
          <div className="mt-4 grid grid-cols-4 gap-1 bg-gray-50 rounded-xl p-3">
            <div
              className="flex flex-col items-center justify-center border-l border-gray-200/60 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors py-1"
              onClick={() => setShowTempModal(true)}
            >
              <div className="flex items-center text-[11px] text-gray-400 mb-1">
                客户温度 <Edit3 className="w-3 h-3 ml-1" />
              </div>
              <span className="text-[13px] font-medium text-blue-600">{temperature}</span>
            </div>
            <div className="flex flex-col items-center justify-center border-l border-gray-200/60">
              <span className="text-[11px] text-gray-400 mb-1">客户价值</span>
              <span className="text-[13px] font-medium text-blue-600">{customer?.value || 'C'}</span>
            </div>
            <div className="flex flex-col items-center justify-center border-l border-gray-200/60">
              <span className="text-[11px] text-gray-400 mb-1">有效保单</span>
              <span className="text-[13px] font-medium text-emerald-600">3</span>
            </div>
            <div className="flex flex-col items-center justify-center border-l border-gray-200/60">
              <span className="text-[11px] text-gray-400 mb-1">会员等级</span>
              <span className="text-[13px] font-medium text-amber-600">{customer?.vipLevel || '平安VIP'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
          <div className="flex items-center relative">
            <div
              ref={tabsRef}
              className="flex-1 flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pl-2 pr-10"
            >
              {tabs.map(tab => (
                <button
                  key={tab}
                  data-tab={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-4 py-3 text-[15px] relative whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-white via-white to-transparent pl-4 pr-2">
              <button
                onClick={() => setShowAllTabs(!showAllTabs)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 bg-white rounded-full shadow-sm border border-gray-100"
              >
                {showAllTabs ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showAllTabs && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-b border-gray-100 z-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-bold text-gray-900">全部分类</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setShowAllTabs(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-[13px] text-center transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100'
                        : 'bg-gray-50 text-gray-600 font-medium border border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* 客户信息 - 新的客户信息Tab */}
          {activeTab === '客户信息' && (
            <div className="space-y-3">
              {/* 客户洞察模块 - 新增 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-blue-500" />
                  <h2 className="text-[15px] font-bold text-gray-900">客户洞察</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[11px] text-gray-500">风险等级</span>
                    </div>
                    <span className="text-[13px] font-semibold text-gray-800">{customerInsights.riskLevel}</span>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] text-gray-500">增长潜力</span>
                    </div>
                    <span className="text-[13px] font-semibold text-gray-800">{customerInsights.growthPotential}</span>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-[11px] text-gray-500">接触频率</span>
                    </div>
                    <span className="text-[13px] font-semibold text-gray-800">{customerInsights.contactFrequency}</span>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[11px] text-gray-500">下一步行动</span>
                    </div>
                    <span className="text-[13px] font-semibold text-gray-800">{customerInsights.nextAction}</span>
                  </div>
                </div>
              </div>

              {/* 基础信息 + 职业资产 合并卡片 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[15px] font-bold text-gray-900">基础信息</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowSensitive(!showSensitive)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[12px] font-medium hover:bg-gray-200 transition-colors">
                      编辑
                    </button>
                  </div>
                </div>

                {/* 标签 */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {customerInsights.basicInfoTags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[12px]">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <InfoRow label="保单手机" value="13812345691" maskedValue="1********91" onCopy="13812345691" />
                  <InfoRow label="其他手机" value="13998765432" maskedValue="1********32" onCopy="13998765432" />
                  <div className="flex items-start py-1.5">
                    <span className="w-20 text-[14px] text-gray-500 shrink-0">证件号码</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <span className="text-[15px] text-gray-900 font-medium break-all pr-2">
                          {showSensitive ? '420123198707140024' : '420***********0024'}
                        </span>
                        <button onClick={() => copyToClipboard('420123198707140024')} className="text-blue-500 hover:text-blue-600 shrink-0 mt-0.5">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[13px] text-gray-500 mt-1">证件类型：身份证</div>
                      <div className="text-[13px] text-gray-500 mt-0.5">有效期：2025/10/17 - 2045/10/17</div>
                    </div>
                  </div>
                  <InfoRow label="联系地址" value="广东省深圳市南山区高新南九道太平洋保险大厦" maskedValue="广东省深圳市******************" hasMap />

                  {/* 查看全部字段按钮 */}
                  <button
                    onClick={() => { setShowMoreBasicInfo(!showMoreBasicInfo); setShowInfoSheet(true); }}
                    className="w-full py-2 flex items-center justify-center text-blue-500 text-[13px] font-medium hover:text-blue-600 transition-colors"
                  >
                    查看全部字段
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* 详情浮窗 - 基本信息 + 职业资产 */}
              <AnimatePresence>
                {showInfoSheet && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => { setShowInfoSheet(false); setShowMoreBasicInfo(false); }}
                      className="fixed inset-0 bg-black/40 z-[100]"
                    />
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-50 rounded-t-[24px] z-[110] overflow-hidden"
                    >
                      {/* Header */}
                      <div className="bg-white px-4 pt-3 pb-2 border-b border-gray-100">
                        {/* Drag indicator */}
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-[17px] font-bold text-gray-900">客户详情</h2>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowSensitive(!showSensitive)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-medium">
                              编辑
                            </button>
                            <button
                              onClick={() => { setShowInfoSheet(false); setShowMoreBasicInfo(false); }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        {/* Tabs */}
                        <div className="flex gap-2">
                          {['基本信息', '职业资产'].map(tab => (
                            <button
                              key={tab}
                              onClick={() => setInfoSheetTab(tab)}
                              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                                infoSheetTab === tab
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="bg-gray-50 max-h-[70vh] overflow-y-auto p-4">
                        {/* 基本信息 Tab */}
                        {infoSheetTab === '基本信息' && (
                          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1">
                            <InfoRow label="姓名" value={customer?.name || "曹嘉玲"} />
                            <InfoRow label="年龄" value={`${customer?.age || 38}岁`} />
                            <InfoRow label="出生日期" value="1987年07月14日(六月十九)" />
                            <InfoRow label="微信昵称" value="嘉玲" />
                            <InfoRow label="保单手机" value="13812345691" maskedValue="1********91" onCopy="13812345691" />
                            <InfoRow label="其他手机" value="13998765432" maskedValue="1********32" onCopy="13998765432" />

                            <div className="flex items-start py-1.5">
                              <span className="w-20 text-[14px] text-gray-500 shrink-0">证件号码</span>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <span className="text-[15px] text-gray-900 font-medium break-all pr-2">
                                    {showSensitive ? '420123198707140024' : '420***********0024'}
                                  </span>
                                  <button onClick={() => copyToClipboard('420123198707140024')} className="text-blue-500 hover:text-blue-600 shrink-0 mt-0.5">
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="text-[13px] text-gray-500 mt-1">证件类型：身份证</div>
                                <div className="text-[13px] text-gray-500 mt-0.5">有效期：2025/10/17 - 2045/10/17</div>
                              </div>
                            </div>

                            <InfoRow label="电子邮箱" value="cjl@example.com" />
                            <InfoRow label="国籍" value="中国" />
                            <InfoRow label="户籍" value="广东省深圳市" />
                            <InfoRow label="学历" value="本科" />
                            <InfoRow label="婚姻状况" value="已婚" />
                            <InfoRow label="联系地址" value="广东省深圳市南山区高新南九道太平洋保险大厦" maskedValue="广东省深圳市******************" hasMap />
                            <InfoRow label="家庭地址" value="广东省深圳市福田区香蜜湖街道某某小区" maskedValue="广东省深圳市******************" hasMap />
                            <InfoRow label="身高" value="165cm" />
                            <InfoRow label="体重" value="55kg" />
                            <InfoRow label="客户号" value="CUS202308150001" onCopy="CUS202308150001" />
                            <InfoRow label="客户来源" value="线上获客" />
                            <InfoRow label="客户添加日" value="2023-08-15" />
                          </div>
                        )}

                        {/* 职业资产 Tab */}
                        {infoSheetTab === '职业资产' && (
                          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1">
                            <InfoRow label="职业" value="企业高管" />
                            <InfoRow label="在职年数" value="5年" />
                            <InfoRow label="工作单位" value="深圳市某科技有限公司" />
                            <InfoRow label="工作电话" value="0755-88888888" maskedValue="0755-********" onCopy="0755-88888888" />
                            <InfoRow label="在职部门" value="市场部" />
                            <InfoRow label="公司岗位" value="市场总监" />
                            <InfoRow label="单位地址" value="广东省深圳市南山区科技园某栋" maskedValue="广东省深圳市南山区**********" hasMap />
                            <InfoRow label="年收入" value="50-100万" />
                            <InfoRow label="家庭收入" value="100-200万" />
                            <InfoRow label="情况" value="良好" />
                            <InfoRow label="资产规模" value="500-1000万" />
                            <InfoRow label="车辆信息" value="宝马 5系 (粤B·12345)" maskedValue="宝马 5系 (粤B·*****)" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* 家庭成员 - 新增标签 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <h2 className="text-[15px] font-bold text-gray-900">家庭成员</h2>
                    <Info className="w-4 h-4 text-gray-400 ml-1.5" />
                  </div>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[13px] font-medium hover:bg-gray-200 transition-colors">
                    编辑
                  </button>
                </div>

                {/* 家庭成员相关标签 - 新增 */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {customerInsights.familyTags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[12px]">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  {familyMembers.filter(m => m.id !== '本人').map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 bg-white rounded-2xl p-3 border border-gray-100 transition-all hover:shadow-sm"
                    >
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full p-0.5 border-2 border-gray-200">
                          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        </div>
                        {member.isCustomer && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white">
                            <ShieldCheck className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {member.isCustomer ? (
                          <button
                            onClick={() => {}}
                            className="text-[15px] font-bold text-blue-600 hover:underline text-left block truncate"
                          >
                            {member.name}
                          </button>
                        ) : (
                          <span className="text-[15px] font-bold text-gray-900 block truncate">{member.name}</span>
                        )}
                        <div className="text-[12px] text-gray-500 mt-0.5">
                          {member.relation} | {member.age}岁
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="flex items-center space-x-3 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl p-3 hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-500 shadow-sm shrink-0">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[13px] font-medium text-gray-500 group-hover:text-blue-600">添加成员</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 已购保单 - 完整复制旧版 */}
          {activeTab === '已购保单' && (
            <div className="space-y-3 pb-20">
              {/* Protection Insight Section */}
              <div className="mx-1 bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50/50 rounded-bl-full -mr-2 -mt-2"></div>
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[14px] font-bold text-gray-800">保障解读</span>
                  </div>
                  <button className="text-[11px] font-bold text-emerald-600 flex items-center">
                    查看详情 <ChevronRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
                <p className="text-[12px] text-gray-600 leading-relaxed relative z-10">
                  家庭整体保障覆盖率为<span className="text-emerald-600 font-bold mx-0.5">85%</span>，建议重点关注<span className="text-emerald-600 font-bold mx-0.5">配偶</span>的重疾保障缺口，目前缺口约20万。
                </p>
              </div>

              {/* Family Member Filter */}
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-50">
                <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-0.5">
                  {familyMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedFamilyMember(member.id)}
                      className="flex flex-col items-center shrink-0 space-y-1 transition-all active:scale-95"
                    >
                      <div className={`w-10 h-10 rounded-full p-0.5 border-2 transition-all ${
                        selectedFamilyMember === member.id ? 'border-blue-500 scale-105' : 'border-transparent'
                      }`}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-bold ${selectedFamilyMember === member.id ? 'text-blue-600' : 'text-gray-400'}`}>
                          {member.relation}
                        </span>
                        <span className={`text-[9px] ${selectedFamilyMember === member.id ? 'text-blue-500' : 'text-gray-400'}`}>
                          {member.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                  {policyCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedPolicyCategory(cat)}
                      className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap border ${
                        selectedPolicyCategory === cat
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'bg-white border-gray-100 text-gray-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Policy List */}
              <div className="space-y-2 px-1">
                {filteredPolicies.map(policy => (
                  <div key={policy.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-blue-600 font-bold text-[10px] px-1.5 py-0.5 bg-blue-50 rounded shrink-0">{policy.type}</span>
                        <h3 className="text-[14px] font-bold text-gray-900 truncate">{policy.name}</h3>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                        policy.isValid ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {policy.isValid ? '缴费有效' : policy.status}
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-gray-50">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">投保人</span>
                            <span className="text-gray-700 font-medium">{policy.policyholder}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">被保人</span>
                            <span className="text-gray-700 font-medium">{policy.insured}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-[10px] text-gray-300">
                          <span>{policy.policyNo}</span>
                          <button onClick={() => copyToClipboard(policy.policyNo)} className="ml-1 hover:text-blue-500 transition-colors">
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">保障期间</span>
                          <span className="text-gray-700 font-medium">{policy.startDate} - {policy.endDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-[11px]">
                          <span className="text-gray-400 mr-2">期缴保费</span>
                          <span className="text-[14px] font-bold text-blue-600">¥{policy.periodicPremium}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {policy.hasProposal && (
                            <button className="px-2 py-1 text-blue-600 text-[11px] font-bold">建议书</button>
                          )}
                          <button className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-bold flex items-center shadow-sm">
                            详情 <ChevronRight className="w-3 h-3 ml-0.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPolicies.length === 0 && (
                  <div className="py-20 text-center text-gray-400">
                    该成员暂无此类已购保单
                  </div>
                )}

                {/* Invalid Policies Section */}
                {invalidPolicies.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowInvalidPolicies(!showInvalidPolicies)}
                      className="w-full flex items-center justify-between py-2 px-4 bg-gray-100/50 rounded-xl text-[12px] text-gray-500 font-medium"
                    >
                      <span>无效保单 ({invalidPolicies.length})</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showInvalidPolicies ? 'rotate-180' : ''}`} />
                    </button>

                    {showInvalidPolicies && (
                      <div className="space-y-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {invalidPolicies.map(policy => (
                          <div key={policy.id} className="bg-white/60 rounded-xl p-3 shadow-sm border border-gray-100 opacity-75">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2 min-w-0">
                                <span className="text-gray-500 font-bold text-[10px] px-1.5 py-0.5 bg-gray-100 rounded shrink-0">{policy.type}</span>
                                <h3 className="text-[14px] font-bold text-gray-700 truncate">{policy.name}</h3>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold shrink-0">
                                {policy.status}
                              </span>
                            </div>
                            <div className="space-y-1.5 pt-2 border-t border-gray-50">
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <span className="text-gray-400 mr-2">投保人</span>
                                    <span className="text-gray-700 font-medium">{policy.policyholder}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-400 mr-2">被保人</span>
                                    <span className="text-gray-700 font-medium">{policy.insured}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-[11px]">
                                  <span className="text-gray-400 mr-2">期缴保费</span>
                                  <span className="text-[14px] font-bold text-gray-500">¥{policy.periodicPremium}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 时光轴 - 完整复制旧版 */}
          {activeTab === '时光轴' && (
            <div className="space-y-4 pb-10" ref={scrollRef}>
              {/* Timeline Filters */}
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    <span className="text-[15px] font-bold text-gray-900">经营时光轴</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="flex items-center text-[11px] text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div> 历史
                    </span>
                    <span className="flex items-center text-[11px] text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-orange-400 mr-1"></div> 触点
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={`flex items-center space-x-1 px-2 py-1.5 rounded-xl border transition-all text-[11px] font-bold ${
                        startDate || endDate
                          ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                          : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="max-w-[80px] truncate">
                        {startDate || endDate
                          ? `${startDate.substring(5).replace('-', '/') || '...'}~${endDate.substring(5).replace('-', '/') || '...'}`
                          : '时间区间'}
                      </span>
                      {(startDate || endDate) && (
                        <div
                          onClick={(e) => { e.stopPropagation(); setStartDate(''); setEndDate(''); }}
                          className="ml-0.5 p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>

                    {showDatePicker && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col space-y-2 w-40 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="space-y-1">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-1">开始</div>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-1">结束</div>
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                            />
                          </div>
                          <button
                            onClick={() => setShowDatePicker(false)}
                            className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-colors"
                          >
                            确定
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="h-6 w-px bg-gray-200 shrink-0 mx-1" />
                  <div className="flex space-x-1 shrink-0">
                    {timelineTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedTimelineType(type)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all border ${
                          selectedTimelineType === type
                            ? 'bg-blue-50 border-blue-200 text-blue-600 font-bold'
                            : 'bg-white border-gray-100 text-gray-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="space-y-8">
                  {groupedTimeline.map(([month, items], groupIdx) => {
                    const touchpoints = items.filter(i => i.type === 'touchpoint');
                    const isFutureMonth = month >= currentMonthStr;
                    const hasTouchpoints = touchpoints.length > 0;
                    const isExpanded = expandedMonths.includes(month);
                    const touchpointsVisible = isFutureMonth || isExpanded;

                    if (items.length === 0) return null;

                    return (
                      <div key={month} className="relative">
                        {/* Month Header */}
                        <div className="flex items-center mb-4 sticky top-0 bg-white z-20 py-1">
                          <div className="bg-gray-100 px-3 py-1 rounded-full text-[12px] font-bold text-gray-600 flex items-center">
                            {month.replace('-', '年')}月
                            {hasTouchpoints && (
                              <button
                                onClick={() => toggleMonth(month)}
                                className={`ml-2 px-1.5 py-0.5 rounded-md transition-colors flex items-center ${
                                  isExpanded ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-400 border border-gray-200'
                                }`}
                              >
                                {isFutureMonth ? `共有 ${touchpoints.length} 个触点` : '查看本月触点'}
                                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                          <div className="flex-1 h-[1px] bg-gray-100 ml-3"></div>
                        </div>

                        {/* Items in Month */}
                        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                          {items.map((entry, idx) => {
                            if (entry.type !== 'themeGroup' && entry.type !== 'touchpoint') {
                              const item = entry;
                              const globalIdx = timelineData.indexOf(item);
                              const isLatestHistory = globalIdx === latestHistoryIndex;

                              return (
                                <div
                                  key={`hist-${idx}`}
                                  className="relative cursor-pointer group"
                                  ref={isLatestHistory ? latestHistoryRef : null}
                                >
                                  <div className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 bg-blue-500" />
                                  <div className="flex flex-col">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-[12px] font-bold text-gray-400 font-mono">{item.date}</span>
                                        {item.subType && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded font-bold">{item.subType}</span>}
                                      </div>
                                    </div>
                                    <div className={`p-3 rounded-xl border transition-all active:scale-[0.98] ${
                                      isLatestHistory ? 'ring-2 ring-blue-100 border-blue-200 bg-blue-50/30' : 'bg-gray-50/30 border-gray-100/50 hover:bg-gray-50'
                                    }`}>
                                      <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-2">
                                          <item.icon className="w-4 h-4 text-blue-500 shrink-0" />
                                          <h3 className="text-[14px] font-bold text-gray-800">{item.title}</h3>
                                        </div>
                                        <span className="text-[11px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">查看详情</span>
                                      </div>
                                      <p className="text-[13px] text-gray-600 leading-relaxed mt-1">{item.content}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (entry.type === 'themeGroup') {
                              const group = entry;
                              const firstItem = group.items[0];
                              const themeId = firstItem.themeId;
                              const isCollapsed = !collapsedThemes.includes(themeId);

                              return (
                                <div key={`group-${idx}`} className="relative">
                                  <div className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 bg-blue-500" />
                                  <div className="flex flex-col">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-[12px] font-bold text-gray-400 font-mono">{firstItem.date}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded font-bold">连读动态</span>
                                      </div>
                                    </div>
                                    <div className="bg-gray-50/50 rounded-xl border border-gray-100/50 overflow-hidden">
                                      <button
                                        onClick={() => toggleTheme(themeId)}
                                        className="w-full p-3 flex items-center justify-between hover:bg-gray-100/50 transition-colors"
                                      >
                                        <div className="text-left flex items-start space-x-2">
                                          <firstItem.icon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                          <div>
                                            <h3 className="text-[14px] font-bold text-gray-800">{firstItem.title}</h3>
                                            <p className="text-[12px] text-gray-500 mt-0.5">
                                              连续产生 {group.items.length} 条相关动态
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center text-blue-500">
                                          <span className="text-[11px] font-bold mr-1">{isCollapsed ? '展开' : '收起'}</span>
                                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
                                        </div>
                                      </button>
                                      {!isCollapsed && (
                                        <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-2 animate-in slide-in-from-top-2 duration-200">
                                          {group.items.map((item: any, subIdx: number) => (
                                            <div key={subIdx} className="bg-white p-2 rounded-lg border border-gray-50 shadow-sm">
                                              <p className="text-[12px] text-gray-600 leading-relaxed">{item.content}</p>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (entry.type === 'touchpoint' && touchpointsVisible) {
                              const item = entry;
                              return (
                                <div key={`tp-${idx}`} className="relative animate-in slide-in-from-top-2 duration-200">
                                  <div className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 bg-orange-500" />
                                  <div className="flex flex-col">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-[12px] font-bold text-orange-400 font-mono">{item.date}</span>
                                        {item.subType && <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-500 rounded font-bold">{item.subType}</span>}
                                      </div>
                                    </div>
                                    <div className="p-3 rounded-xl border bg-orange-50/30 border-orange-100/50">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <item.icon className="w-4 h-4 text-orange-500 shrink-0" />
                                        <h3 className="text-[14px] font-bold text-gray-800">{item.title}</h3>
                                      </div>
                                      <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{item.content}</p>
                                      <div className="flex flex-wrap gap-2 pt-2 border-t border-orange-100/30">
                                        {item.title === '生日提醒' && (
                                          <button
                                            onClick={() => setShowBirthdayCard(true)}
                                            className="flex items-center px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[11px] font-medium"
                                          >
                                            <Send className="w-3 h-3 mr-1" /> 发送贺卡
                                          </button>
                                        )}
                                        {item.policyNo && (
                                          <button className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[11px] font-medium">
                                            <ExternalLink className="w-3 h-3 mr-1" /> 查看保单
                                          </button>
                                        )}
                                        <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[11px] font-medium">
                                          忽略
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return null;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 经营素材 - 完整复制旧版 */}
          {activeTab === '经营素材' && (
            <div className="space-y-3 pb-20">
              {/* Business Insight Section */}
              <div className="mx-1 bg-white rounded-2xl p-4 border border-blue-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-full -mr-2 -mt-2"></div>
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="text-[14px] font-bold text-gray-800">经营解读</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[11px] font-bold relative z-10 ${
                    temperature === '低温' ? 'bg-blue-50 text-blue-600' :
                    temperature === '中温' ? 'bg-orange-50 text-orange-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    当前状态: {temperature}
                  </div>
                </div>
                <p className="text-[12px] text-gray-600 leading-relaxed relative z-10">
                  基于客户<span className="text-blue-600 font-bold mx-0.5">{temperature}</span>状态，系统已为您优先匹配<span className="text-blue-600 font-bold mx-0.5">{temperature === '低温' ? '触客' : temperature === '中温' ? '面访' : '邀约'}</span>类素材，建议结合近期触点进行互动。
                </p>
              </div>

              {/* Filters */}
              <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setShowStageDropdown(!showStageDropdown)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all text-[12px] font-bold ${
                        selectedStage !== '全部'
                          ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                          : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span>{selectedStage === '全部' ? '经营阶段' : selectedStage}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showStageDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showStageDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowStageDropdown(false)} />
                        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-32 animate-in fade-in slide-in-from-top-1 duration-200">
                          {stages.map(stage => (
                            <button
                              key={stage}
                              onClick={() => {
                                setSelectedStage(stage);
                                setShowStageDropdown(false);
                              }}
                              className={`w-full px-4 py-2 text-left text-[13px] transition-colors flex items-center justify-between ${
                                selectedStage === stage
                                  ? 'bg-blue-50 text-blue-600 font-bold'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <span>{stage}</span>
                              {selectedStage === stage && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="h-6 w-px bg-gray-200 shrink-0 mx-1" />

                  <div className="relative shrink-0">
                    <button
                      onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all text-[12px] font-bold ${
                        selectedSource !== '全部'
                          ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                          : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="max-w-[100px] truncate">
                        {selectedSource === '全部' ? '推荐来源' : selectedSource}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSourceDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showSourceDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowSourceDropdown(false)} />
                        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-48 animate-in fade-in slide-in-from-top-1 duration-200">
                          {recommendationSources.map(source => (
                            <button
                              key={source}
                              onClick={() => {
                                setSelectedSource(source);
                                setShowSourceDropdown(false);
                              }}
                              className={`w-full px-4 py-2 text-left text-[13px] transition-colors flex items-center justify-between ${
                                selectedSource === source
                                  ? 'bg-blue-50 text-blue-600 font-bold'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <span>{source}</span>
                              {selectedSource === source && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Search */}
              <div className="mx-1 mb-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="告诉系统您想要的素材场景..."
                    className="block w-full pl-10 pr-20 py-2.5 bg-white border border-gray-200 rounded-2xl text-[13px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 space-x-1">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (searchQuery.trim()) {
                          setIsSearching(true);
                          setTimeout(() => setIsSearching(false), 1500);
                        }
                      }}
                      className="p-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {isSearching && (
                  <div className="mt-2 flex items-center justify-center space-x-2 py-2 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full delay-150"></div>
                    <span className="text-[11px] text-blue-600 font-medium ml-1">AI 正在为您匹配最合适的素材...</span>
                  </div>
                )}
              </div>

              {/* Suggestion List */}
              <div className="space-y-3 px-1">
                {filteredSuggestions.map(suggestion => (
                  <div key={suggestion.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50/50 hover:border-blue-100 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600 font-bold text-[13px] px-2 py-0.5 bg-blue-50 rounded-md">{suggestion.type}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                          suggestion.stage === '触客' ? 'bg-orange-50 text-orange-600' :
                          suggestion.stage === '面访' ? 'bg-green-50 text-green-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          {suggestion.stage}
                        </span>
                        <span className="text-[12px] text-gray-400">{suggestion.reason}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3 h-3 text-gray-300" />
                        <span className="text-[11px] text-gray-400">{suggestion.sourceDate.split('-').slice(1).join('/')}</span>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-[16px] font-bold text-gray-900 leading-snug">
                          {suggestion.title}
                        </h3>
                        <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">
                          {suggestion.content}
                        </p>
                      </div>
                      {suggestion.thumbnail && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-50">
                          <img
                            src={suggestion.thumbnail}
                            alt={suggestion.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      {suggestion.actions.map((action: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (action.label === '互动指导' || action.label === '转发' || action.label === '发送贺卡' || action.label === '立即报名' || action.label === '邀约客户') {
                              setSelectedMaterial(suggestion);
                              setShowMaterialModal(true);
                            }
                          }}
                          className={`px-5 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                            action.primary
                              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredSuggestions.length === 0 && (
                  <div className="py-20 text-center text-gray-400">
                    暂无符合条件的建议素材
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 客户权益 - 完整复制旧版 */}
          {activeTab === '客户权益' && (
            <div className="space-y-4 pb-20">
              {/* Summary Card */}
              <div className="mx-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[18px] font-bold mb-1">尊享权益概览</h3>
                    <p className="text-blue-100 text-[12px]">当前等级：铂金会员</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold">
                    权益分：2,850
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-[20px] font-bold">5</div>
                    <div className="text-blue-100 text-[10px]">总权益</div>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <div className="text-[20px] font-bold">4</div>
                    <div className="text-blue-100 text-[10px]">可使用</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[20px] font-bold">1</div>
                    <div className="text-blue-100 text-[10px]">即将到期</div>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-3 px-1">
                {benefits.map(benefit => (
                  <div key={benefit.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 hover:border-blue-100 transition-all group">
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-xl ${benefit.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        {benefit.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-[15px] font-bold text-gray-900 truncate">{benefit.title}</h4>
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">{benefit.tag}</span>
                          </div>
                          <span className={`text-[11px] font-bold ${
                            benefit.status === '可使用' ? 'text-emerald-600' : 'text-gray-400'
                          }`}>
                            {benefit.status}
                          </span>
                        </div>
                        <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                          {benefit.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400">剩余次数</span>
                              <span className="text-[13px] font-bold text-gray-700">{benefit.remaining} / {benefit.count}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400">到期时间</span>
                              <span className="text-[13px] font-bold text-gray-700">{benefit.expiryDate}</span>
                            </div>
                          </div>
                          <button className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                            benefit.status === '可使用'
                              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}>
                            {benefit.status === '可使用' ? '立即使用' : '已失效'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Tip */}
              <div className="py-6 text-center">
                <p className="text-[11px] text-gray-400">更多权益正在陆续开放中，敬请期待</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
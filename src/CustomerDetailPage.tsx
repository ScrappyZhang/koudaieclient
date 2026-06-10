import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, MoreHorizontal, Copy, Eye, EyeOff, Edit3, Plus, MapPin, Info, CheckCircle2, Shield, Calendar, Heart, Activity, FileText, Briefcase, Users, MessageSquare, ChevronDown, ChevronRight, Menu, X, Phone, Cake, UserPlus, ShieldCheck, Clock, Send, ExternalLink, Search, Sparkles, Plane, Share2, RotateCcw, TrendingUp, MessageCircle, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomerDetailPage({ customer, onBack, onSharedCustomerList, initialTab, onToggleVersion }: { customer: any, onBack: () => void, onSharedCustomerList?: () => void, initialTab?: string, onToggleVersion?: () => void }) {
  const [activeTab, setActiveTab] = useState(initialTab || '客户画像');
  const [showSensitive, setShowSensitive] = useState(false);
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [temperature, setTemperature] = useState(customer?.temperature || '低温');
  const [showTempModal, setShowTempModal] = useState(false);
  const [tags, setTags] = useState<string[]>(customer?.tags || ['社会中坚', '健康']);
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showBirthdayCard, setShowBirthdayCard] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState('全部');
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [selectedSource, setSelectedSource] = useState('全部');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('本人');
  const [selectedPolicyCategory, setSelectedPolicyCategory] = useState('全部');
  const [showInvalidPolicies, setShowInvalidPolicies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showTransferSheet, setShowTransferSheet] = useState(false);
  const [transferAgentId, setTransferAgentId] = useState('');
  const [transferAgentName, setTransferAgentName] = useState('');
  const [showTransferAgentDropdown, setShowTransferAgentDropdown] = useState(false);
  const [transferStatus, setTransferStatus] = useState<'idle' | 'sent' | 'pending'>('idle'); // 传承状态
  const [showWechatPrompt, setShowWechatPrompt] = useState(false); // 微信提示弹窗
  // 已签署传承协议的代理人列表（根据客户判断是否有）
  // 曹嘉玲等客户有签署传承协议的代理人，常弘等客户没有
  const hasSignedInheritanceAgreement = customer?.name === '曹嘉玲' || customer?.name === '邓逵' || customer?.name === '张小明';
  const transferAgents = hasSignedInheritanceAgreement ? [
    { id: '100123', name: '李小华' },
    { id: '100456', name: '陈小芳' },
    { id: '100789', name: '赵美玲' },
  ] : [];
  const [shareAgentId, setShareAgentId] = useState('');
  const [foundAgentName, setFoundAgentName] = useState('');
  const [foundAgentTenure, setFoundAgentTenure] = useState<number | null>(null); // 接收代理人司龄（月）
  const [isSearchingAgent, setIsSearchingAgent] = useState(false);
  const [showInheritanceChoice, setShowInheritanceChoice] = useState(false);
  const [shareType, setShareType] = useState<'share' | 'inherit' | null>(null);
  const [showSignAgreement, setShowSignAgreement] = useState(false);
  const [showSignatureScreen, setShowSignatureScreen] = useState(false);
  const [hasSigned, setHasSigned] = useState(false); // 传承人是否已签署协议
  const [showAgreementView, setShowAgreementView] = useState(false); // 查看已签署的协议
  const scrollRef = useRef<HTMLDivElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const isSigningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const latestHistoryRef = useRef<HTMLDivElement>(null);

  // 签字画布初始化与事件监听
  useEffect(() => {
    if (!showSignatureScreen) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    // 清空画布
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

    const container = canvas.parentElement;
    if (!container) return;

    // 设置画布尺寸匹配容器
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();

    // 获取画笔位置（支持触摸和鼠标）
    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    // 绘制线条
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
      context.beginPath();
      context.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      context.lineTo(pos.x, pos.y);
      context.stroke();
      lastPosRef.current = pos;
    };

    const startDraw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isSigningRef.current = true;
      const pos = getPos(e);
      lastPosRef.current = pos;
    };

    const stopDraw = () => {
      isSigningRef.current = false;
    };

    // 鼠标事件
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    // 触摸事件
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);
    canvas.addEventListener('touchcancel', stopDraw);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDraw);
      canvas.removeEventListener('mouseleave', stopDraw);
      canvas.removeEventListener('touchstart', startDraw);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDraw);
      canvas.removeEventListener('touchcancel', stopDraw);
      window.removeEventListener('resize', resizeCanvas);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSignatureScreen]);
  const tabsRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, we'd show a toast here
  };

  const stages = ['全部', '触客', '面访', '邀约'];
  const recommendationSources = ['全部', '生日', '精选名单-有钱妈妈', '权益到期', '客户需求'];

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

  const familyMembers = [
    { id: '本人', name: '曹嘉玲', relation: '本人', gender: '女', age: 38, isCustomer: true, occupation: '企业高管', health: '良好', policyCount: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CJL&gender=female' },
    { id: '配偶', name: '周龙', relation: '配偶', gender: '男', age: 40, isCustomer: true, occupation: '私企老板', health: '一般', policyCount: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhouLong&gender=male' },
    { id: '儿子', name: '周小龙', relation: '儿子', gender: '男', age: 10, isCustomer: false, occupation: '学生', health: '优秀', policyCount: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Son&gender=male' },
    { id: '母亲', name: '周艳均', relation: '母亲', gender: '女', age: 60, isCustomer: true, occupation: '退休', health: '良好', policyCount: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mother&gender=female' },
  ];

  const policyCategories = ['全部', '寿险', '养老险', '健康险', '有理赔记录'];

  const policies = useMemo(() => [
    { 
      id: 1, 
      name: '平安六福', 
      type: '健康险', 
      member: '本人', 
      status: '保障中', 
      premium: '12,000', 
      periodicPremium: '12,000',
      coverage: '500,000', 
      policyNo: 'PA66882233',
      policyholder: '曹嘉玲',
      insured: '曹嘉玲',
      startDate: '2020-01-01',
      endDate: '终身',
      period: '终身',
      hasProposal: true,
      isValid: true,
      hasClaim: false
    },
    { 
      id: 2, 
      name: '终身寿险', 
      type: '寿险', 
      member: '本人', 
      status: '保障中', 
      premium: '25,000', 
      periodicPremium: '25,000',
      coverage: '1,000,000', 
      policyNo: 'PA99001122',
      policyholder: '曹嘉玲',
      insured: '曹嘉玲',
      startDate: '2018-05-20',
      endDate: '终身',
      period: '终身',
      hasProposal: false,
      isValid: true,
      hasClaim: true
    },
    { 
      id: 3, 
      name: '少儿平安福', 
      type: '健康险', 
      member: '儿子', 
      status: '保障中', 
      premium: '8,000', 
      periodicPremium: '8,000',
      coverage: '300,000', 
      policyNo: 'PA55443322',
      policyholder: '曹嘉玲',
      insured: '周小龙',
      startDate: '2022-03-15',
      endDate: '终身',
      period: '终身',
      hasProposal: true,
      isValid: true,
      hasClaim: true
    },
    { 
      id: 4, 
      name: '乐享养老', 
      type: '养老险', 
      member: '配偶', 
      status: '保障中', 
      premium: '15,000', 
      periodicPremium: '15,000',
      coverage: '200,000', 
      policyNo: 'PA11223344',
      policyholder: '曹嘉玲',
      insured: '周龙',
      startDate: '2021-11-11',
      endDate: '2041-11-11',
      period: '20年',
      hasProposal: false,
      isValid: true,
      hasClaim: false
    },
    { 
      id: 5, 
      name: '康寿宝', 
      type: '健康险', 
      member: '母亲', 
      status: '保障中', 
      premium: '5,000', 
      periodicPremium: '5,000',
      coverage: '100,000', 
      policyNo: 'PA77889900',
      policyholder: '曹嘉玲',
      insured: '周艳均',
      startDate: '2019-08-01',
      endDate: '2029-08-01',
      period: '10年',
      hasProposal: false,
      isValid: true,
      hasClaim: false
    },
    { 
      id: 6, 
      name: '意外险A', 
      type: '健康险', 
      member: '本人', 
      status: '到期终止', 
      premium: '500', 
      periodicPremium: '500',
      coverage: '100,000', 
      policyNo: 'PA00112233',
      policyholder: '曹嘉玲',
      insured: '曹嘉玲',
      startDate: '2023-01-01',
      endDate: '2024-01-01',
      period: '1年',
      hasProposal: false,
      isValid: false,
      hasClaim: false
    },
    { 
      id: 7, 
      name: '分红险B', 
      type: '寿险', 
      member: '本人', 
      status: '缴清', 
      premium: '50,000', 
      periodicPremium: '50,000/次',
      coverage: '200,000', 
      policyNo: 'PA44556677',
      policyholder: '曹嘉玲',
      insured: '曹嘉玲',
      period: '终身',
      hasProposal: false,
      isValid: false,
      hasClaim: false
    }
  ], []);

  const filteredPolicies = useMemo(() => {
    return policies.filter(p => {
      if (!p.isValid) return false;
      const memberMatch = selectedFamilyMember === '全部' || p.member === selectedFamilyMember;
      
      let categoryMatch = false;
      if (selectedPolicyCategory === '全部') {
        categoryMatch = true;
      } else if (selectedPolicyCategory === '有理赔记录') {
        categoryMatch = !!p.hasClaim;
      } else {
        categoryMatch = p.type === selectedPolicyCategory;
      }
      
      return memberMatch && categoryMatch;
    });
  }, [policies, selectedFamilyMember, selectedPolicyCategory]);

  const invalidPolicies = useMemo(() => {
    return policies.filter(p => {
      if (p.isValid) return false;
      const memberMatch = selectedFamilyMember === '全部' || p.member === selectedFamilyMember;
      
      let categoryMatch = false;
      if (selectedPolicyCategory === '全部') {
        categoryMatch = true;
      } else if (selectedPolicyCategory === '有理赔记录') {
        categoryMatch = !!p.hasClaim;
      } else {
        categoryMatch = p.type === selectedPolicyCategory;
      }
      
      return memberMatch && categoryMatch;
    });
  }, [policies, selectedFamilyMember, selectedPolicyCategory]);

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
      script: '嘉玲姐，最近看到一篇关于“夹心层”家庭资产配置的文章，写得特别透彻。想到您之前提过对孩子教育和父母养老的规划，觉得这篇对您可能有启发，发给您参考一下。',
      tips: [
        '建议在下午 2-4 点发送，此时客户可能在休息或处理非紧急事务',
        '发送后 1 小时若无回复，可追问一句：“您觉得文章里提到的那个‘教育金+增额寿’组合怎么样？”',
        '如果客户回复感兴趣，可顺势邀约线下沟通详细方案'
      ]
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
      script: '嘉玲姐，最近个人养老金的话题挺火的，我找了个 3 分钟的短视频，把大家最关心的几个点都讲清楚了。您有空可以看看，咱们下次见面可以交流下您的看法。',
      tips: [
        '视频适合作为面谈前的预热素材',
        '可以重点强调“抵税”这个利益点，吸引高收入客户关注',
        '询问客户是否已经开通了个人养老金账户，作为切入点'
      ]
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
      script: '嘉玲姐，我看您账户里的高端体检权益还有一个月就到期了。这项服务包含了几项深度的筛查，非常难得。我想着帮您预约下周的时间，您看周二还是周三方便？',
      tips: [
        '以“权益提醒”为由，客户接受度最高',
        '强调“深度筛查”的价值，体现公司对高端客户的关怀',
        '如果客户没时间，可以建议帮其家人预约，体现服务的灵活性'
      ]
    },
    {
      id: 5,
      type: '活动',
      title: '有钱妈妈俱乐部：线下茶话会',
      content: '与志同道合的妈妈们一起探讨育儿经与财富增值之道。',
      thumbnail: 'https://picsum.photos/seed/tea/200/200',
      reason: '客户在有钱妈妈精选名单中',
      source: '精选名单-有钱妈妈',
      stage: '邀约',
      materialType: '活动',
      actions: [{ label: '立即报名', primary: true }, { label: '互动指导', primary: false }],
      priority: 5,
      sourceDate: '2026-03-01',
      script: '嘉玲姐，下周六我们“有钱妈妈俱乐部”有个线下茶话会，请到了资深的教育专家来分享。我知道您一直很注重孩子的教育，这次机会挺难得的，我特意给您留了个名额，您要不要一起来坐坐？',
      tips: [
        '强调“名额有限”和“专家分享”，增加活动的吸引力',
        '可以提到其他她认识的客户也会参加，利用社交属性',
        '活动后及时跟进感受，为后续转化做铺垫'
      ]
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
      actions: [{ label: '互动指导', primary: true }],
      priority: 20,
      sourceDate: '2026-03-18',
      script: '嘉玲姐，祝您生日快乐！愿您在新的一岁里，眼里有光，心中有爱，平安喜乐，万事顺意。这是为您定制的电子贺卡，希望您喜欢。',
      tips: [
        '生日当天早上 9 点前发送，第一波送达祝福',
        '除了电子贺卡，可以顺便提一下准备了一份小礼品，过两天给您送过去',
        '不要在生日当天推销产品，纯粹表达祝福即可'
      ]
    }
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
          s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.reason.toLowerCase().includes(searchQuery.toLowerCase());
        return stageMatch && sourceMatch && searchMatch;
      })
      .sort((a, b) => {
        // 1. Sort by stage priority based on temperature
        const aStageIdx = currentStagePriority.indexOf(a.stage);
        const bStageIdx = currentStagePriority.indexOf(b.stage);
        if (aStageIdx !== bStageIdx) return aStageIdx - bStageIdx;

        // 2. Sort by source date (proximity to touchpoints)
        const dateA = new Date(a.sourceDate).getTime();
        const dateB = new Date(b.sourceDate).getTime();
        if (dateA !== dateB) return dateB - dateA;

        // 3. Sort by internal priority
        return b.priority - a.priority;
      });
  }, [selectedStage, selectedSource, searchQuery, suggestions, temperature]);

  const [selectedTimelineType, setSelectedTimelineType] = useState('全部');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const timelineData = useMemo(() => [
    { date: '2023-08-15', title: '客户动态', subType: '日常互动', content: '通过线上获客渠道添加客户，来源：朋友圈分享', type: 'history', icon: UserPlus },
    { date: '2023-09-10', title: '客户拜访', subType: '首次面谈', content: '在南山区咖啡厅进行首次面谈，客户对养老金表现出浓厚兴趣', type: 'history', icon: MessageSquare },
    { date: '2023-10-01', title: '客户动态', subType: '保单变动', content: '客户投保《平安六福》重疾险，保单号：PA66882233，首期保费已到账', type: 'history', icon: ShieldCheck, policyNo: 'PA66882233' },
    { date: '2024-02-14', title: '客户笔记', subType: '生活琐事', content: '客户提到近期计划全家去日本旅游，建议回国后跟进旅游险或意外险', type: 'history', icon: Heart },
    
    // Dense data for 2024-03-18
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

  const [collapsedThemes, setCollapsedThemes] = useState<string[]>([]);

  const groupedTimeline = useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    // First, group by month
    filteredTimelineData.forEach(item => {
      const month = item.date.substring(0, 7);
      if (!groups[month]) groups[month] = [];
      groups[month].push(item);
    });

    // Then, within each month, group consecutive items with the same themeId
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

  // Find the index of the latest history item
  const latestHistoryIndex = useMemo(() => {
    let lastIdx = -1;
    timelineData.forEach((item, idx) => {
      if (item.type === 'history') lastIdx = idx;
    });
    return lastIdx;
  }, [timelineData]);

  useEffect(() => {
    if (activeTab === '时光轴' && latestHistoryRef.current) {
      setTimeout(() => {
        latestHistoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    
    // Auto-scroll active tab to center
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
      if (activeTabElement) {
        const container = tabsRef.current;
        const scrollLeft = activeTabElement.offsetLeft - (container.offsetWidth / 2) + (activeTabElement.offsetWidth / 2);
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab]);

  const tabs = ['客户画像', '客户信息', '已购保单', '时光轴', '经营素材', '客户权益'];

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

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl flex flex-col relative pb-20">
        
        {/* Header & Profile Summary */}
        <div className="bg-white pt-12 pb-4 px-4 relative border-b border-gray-100">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <button onClick={onBack} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Dropdown */}
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
                      onClick={() => {
                        setShowMenu(false);
                        setShowShareSheet(true);
                      }}
                      className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">共享客户</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowTransferSheet(true);
                      }}
                      className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <Users className="w-4 h-4 text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">传承客户</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onToggleVersion?.();
                      }}
                      className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <Layers className="w-4 h-4 text-blue-500 mr-3" />
                      <span className="text-sm text-blue-600 font-medium">切换到新版</span>
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
                    
                    {/* Gender & Age */}
                    <div className={`ml-2 px-1.5 py-0.5 rounded text-[11px] flex items-center font-medium ${customer?.gender === 'M' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>
                      {customer?.gender === 'M' ? '♂' : '♀'} {customer?.age || '--'}岁
                    </div>

                    {/* Birthday Badge */}
                    {customer?.daysToBirthday !== undefined && customer.daysToBirthday <= 7 && (
                      <div className="ml-2 flex items-center text-[11px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 font-medium">
                        <Cake className="w-3 h-3 mr-1" />
                        {customer.daysToBirthday === 0 ? '今天生日' : `${customer.daysToBirthday}天后生日`}
                      </div>
                    )}

                    {customer?.badge && (
                      <span className="ml-2 px-1.5 py-0.5 border border-gray-300 text-gray-500 text-[11px] rounded-sm">
                        {customer.badge}
                      </span>
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

            {/* Remarks Bar - Moved here */}
            <div className="mt-3 flex items-center bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-100/50">
              <span className="text-[12px] text-gray-400 shrink-0 mr-2">备注:</span>
              <div className="flex-1 text-[13px] text-gray-600 truncate">
                {customer?.remark || '客户偏好高端医疗险，对养老社区有一定兴趣。近期可跟进重疾险加保方案。'}
              </div>
              <button className="text-blue-500 ml-2">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-1 bg-gray-50 rounded-xl p-3">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[11px] text-gray-400 mb-1">客户类型</span>
                <span className="text-[13px] font-medium text-gray-700">{customer?.customerType || '寿险客户'}</span>
              </div>
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
            
            {/* Hamburger Menu Button */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-white via-white to-transparent pl-4 pr-2">
              <button 
                onClick={() => setShowAllTabs(!showAllTabs)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 bg-white rounded-full shadow-sm border border-gray-100"
              >
                {showAllTabs ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded Tabs Dropdown */}
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
          {activeTab === '客户画像' && (
            <div className="space-y-4 pb-20">
              {/* 1. AI客户画像摘要 */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-[14px] font-bold text-gray-800">AI 客户画像摘要</span>
                  </div>
                  <span className="text-[11px] text-gray-400">更新于 2026-03-18</span>
                </div>
                <p className="text-[13px] leading-relaxed text-gray-600">
                  曹女士是一位<span className="text-gray-800 font-semibold">高净值、高知型</span>的社会中坚力量。家庭保障覆盖率约85%，近期对<span className="text-blue-600 font-medium">高端医疗与养老社区</span>表现出显著兴趣。当前<span className="text-blue-600 font-medium">高温邀约阶段</span>，是高价值且有明确加保潜力的核心客户。
                </p>
              </div>

              {/* 2. 基础特征 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3">
                  <h2 className="text-[15px] font-bold text-gray-800 mb-3">基础特征</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[13px] font-medium">38岁</span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[13px] font-medium">女</span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[13px] font-medium">社会中坚</span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[13px] font-medium">已婚</span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[13px] font-medium">有房有车</span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[13px] font-medium">企业高管</span>
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[13px] font-bold">近期成交概率70%</span>
                  </div>
                </div>
              </div>

              {/* 3. 保障现状 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-[15px] font-bold text-gray-800">保障现状</h2>
                  <button onClick={() => setActiveTab('已购保单')} className="text-[11px] text-blue-600 flex items-center">
                    详情 <ChevronRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>

                {/* 3.1 购买保单情况 */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-[13px] font-semibold text-gray-700 mb-2">购买保单情况</h3>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div>
                      <div className="text-[13px] font-semibold text-gray-800">持有保单</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">长险3件 + 短险2件 + 综金1件</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[16px] font-bold text-gray-800">6件</div>
                      <div className="text-[11px] text-gray-400">年缴8.5万</div>
                    </div>
                  </div>
                </div>

                {/* 3.2 服务权益使用情况 */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-[13px] font-semibold text-gray-700 mb-2">服务权益使用</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-[11px] text-gray-400">已使用</div>
                      <div className="text-[14px] font-bold text-gray-800 mt-0.5">3项</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-[11px] text-gray-400">待使用</div>
                      <div className="text-[14px] font-bold text-gray-600 mt-0.5">2项</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-[11px] text-gray-400">未激活</div>
                      <div className="text-[14px] font-bold text-gray-400 mt-0.5">1项</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[11px]">✓ 高端体检已用</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[11px]">✓ 健康咨询已用</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[11px]">○ 康养权益待用</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-lg text-[11px]">— 养老预约未激活</span>
                  </div>
                </div>

                {/* 3.3 保障缺口分析 */}
                <div className="px-4 py-3">
                  <h3 className="text-[13px] font-semibold text-gray-700 mb-2">保障缺口分析</h3>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[12px] text-gray-600">家庭保障覆盖率</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[18px] font-bold text-gray-800">85%</span>
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-medium">中等缺口</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-600">重疾保障</span>
                        <div className="flex items-center gap-1">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[90%] h-full bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-blue-600 font-medium">充足</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-600">意外保障</span>
                        <div className="flex items-center gap-1">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[80%] h-full bg-blue-400 rounded-full"></div>
                          </div>
                          <span className="text-blue-500 font-medium">良好</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-600">高端医疗</span>
                        <div className="flex items-center gap-1">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[20%] h-full bg-amber-500 rounded-full"></div>
                          </div>
                          <span className="text-amber-600 font-medium">缺失</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-600">养老规划</span>
                        <div className="flex items-center gap-1">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[40%] h-full bg-amber-400 rounded-full"></div>
                          </div>
                          <span className="text-amber-500 font-medium">不足</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 经营策略 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-[15px] font-bold text-gray-800">经营策略</h2>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-medium">AI生成</span>
                </div>

                {/* 4.1 当季经营建议 */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-[13px] font-semibold text-gray-700 mb-2">当季经营建议</h3>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-[12px] font-medium text-gray-800 mb-1">二季度重点：养老社区专题</div>
                    <div className="text-[11px] text-gray-500 leading-relaxed">客户近期多次浏览养老资讯，建议安排养老社区参观活动，结合高端医疗保障方案进行综合推荐。</div>
                  </div>
                </div>

                {/* 4.2 购买意愿预测 */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-[13px] font-semibold text-gray-700 mb-2">购买意愿预测</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[11px] text-gray-400 mb-1">高端医疗</div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i <= 4 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                          ))}
                        </div>
                        <span className="text-[12px] font-medium text-gray-800">意愿强</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[11px] text-gray-400 mb-1">养老规划</div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i <= 4 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                          ))}
                        </div>
                        <span className="text-[12px] font-medium text-gray-800">意愿强</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[11px] text-gray-400 mb-1">年金加保</div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i <= 3 ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                          ))}
                        </div>
                        <span className="text-[12px] font-medium text-gray-600">意愿中</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[11px] text-gray-400 mb-1">教育金</div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i <= 2 ? 'bg-gray-400' : 'bg-gray-200'}`}></div>
                          ))}
                        </div>
                        <span className="text-[12px] font-medium text-gray-500">意愿低</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4.3 下一步经营建议 */}
                <div className="px-4 py-3">
                  <h3 className="text-[13px] font-semibold text-gray-700 mb-2">下一步经营建议</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white">1</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[12px] font-medium text-gray-800">预约养老社区参观</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">建议本周联系，安排下周参观行程</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                      <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white">2</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[12px] font-medium text-gray-800">发送高端医疗方案</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">结合参观行程，提供对比方案</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                      <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white">3</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[12px] font-medium text-gray-800">激活康养权益使用</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">引导体验服务，增强黏性</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === '客户信息' && (
            <div className="flex flex-col h-full">
              {/* Basic Info */}
              <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">基础信息</h2>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => setShowSensitive(!showSensitive)} className="text-gray-400 hover:text-gray-600">
                      {showSensitive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[13px] font-medium hover:bg-gray-200 transition-colors">
                      编辑
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
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
              </div>

              {/* Occupation & Assets */}
              <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">职业资产</h2>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[13px] font-medium hover:bg-gray-200 transition-colors">
                    编辑
                  </button>
                </div>

                <div className="space-y-1">
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
              </div>

              {/* Family Members */}
              <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <h2 className="text-lg font-bold text-gray-900">家庭成员</h2>
                    <Info className="w-4 h-4 text-gray-400 ml-1.5" />
                  </div>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[13px] font-medium hover:bg-gray-200 transition-colors">
                    编辑
                  </button>
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
                            onClick={() => {
                              console.log(`Navigate to customer: ${member.name}`);
                            }}
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
                  
                  {/* Add Member Card */}
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
                            // Handle single items
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
                                  {/* Dot */}
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

                            // Handle Theme Groups
                            if (entry.type === 'themeGroup') {
                              const group = entry;
                              const firstItem = group.items[0];
                              const themeId = firstItem.themeId;
                              const isCollapsed = !collapsedThemes.includes(themeId);
                              
                              return (
                                <div key={`group-${idx}`} className="relative">
                                  {/* Dot */}
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

                            // Handle Touchpoints
                            if (entry.type === 'touchpoint' && touchpointsVisible) {
                              const item = entry;
                              return (
                                <div key={`tp-${idx}`} className="relative animate-in slide-in-from-top-2 duration-200">
                                  {/* Dot */}
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
                                      
                                      {/* Actions for Touchpoints */}
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

              {/* Ultra-Compact Category Filter */}
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
                    {/* Header: Type, Name, Status */}
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

                    {/* Info Section: Compact Row Layout */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-50">
                      {/* Row 1: Policyholder & Insured */}
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

                      {/* Row 2: Protection Period */}
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">保障期间</span>
                          <span className="text-gray-700 font-medium">{policy.startDate} - {policy.endDate}</span>
                        </div>
                      </div>

                      {/* Row 3: Periodic Premium & Actions */}
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
                            {/* Header: Type, Name, Status */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2 min-w-0">
                                <span className="text-gray-500 font-bold text-[10px] px-1.5 py-0.5 bg-gray-100 rounded shrink-0">{policy.type}</span>
                                <h3 className="text-[14px] font-bold text-gray-700 truncate">{policy.name}</h3>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold shrink-0">
                                {policy.status}
                              </span>
                            </div>

                            {/* Info Section: Compact Row Layout */}
                            <div className="space-y-1.5 pt-2 border-t border-gray-50">
                              {/* Row 1: Policyholder & Insured */}
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

                              {/* Row 2: Protection Period */}
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center">
                                  <span className="text-gray-400 mr-2">保障期间</span>
                                  <span className="text-gray-700 font-medium">{policy.startDate} - {policy.endDate}</span>
                                </div>
                              </div>

                              {/* Row 3: Periodic Premium */}
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

              {/* Ultra-Compact Filters */}
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

              {/* AI Search / Scenario Match */}
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

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 p-3 pb-safe z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6 px-4">
              <button className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition-colors">
                <Edit3 className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">添加笔记</span>
              </button>
              <button className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition-colors">
                <Calendar className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">添加拜访</span>
              </button>
            </div>
            <button className="flex-1 ml-6 bg-blue-600 text-white rounded-full py-3 font-bold text-[15px] shadow-md hover:bg-blue-700 transition-colors active:scale-[0.98]">
              联系TA
            </button>
          </div>
        </div>

        {/* Temperature Modal */}
        {showTempModal && (
          <>
            <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowTempModal(false)} />
            <div className="fixed bottom-0 w-full max-w-md bg-white rounded-t-2xl z-50 pb-safe animate-in slide-in-from-bottom-full duration-200">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">调整客户温度</h3>
                <button onClick={() => setShowTempModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {['冷却', '低温', '中温', '高温'].map((temp) => (
                  <button
                    key={temp}
                    onClick={() => {
                      setTemperature(temp);
                      setShowTempModal(false);
                    }}
                    className={`py-3 rounded-xl text-[15px] font-medium transition-colors ${
                      temperature === temp
                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                        : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {temp}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tag Modal */}
        {showTagModal && (
          <>
            <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowTagModal(false)} />
            <div className="fixed bottom-0 w-full max-w-md bg-white rounded-t-2xl z-50 pb-safe animate-in slide-in-from-bottom-full duration-200">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">编辑客户标签</h3>
                <button onClick={() => setShowTagModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, i) => (
                    <div key={i} className="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                      <span>{tag}</span>
                      <button 
                        onClick={() => setTags(tags.filter((_, index) => index !== i))}
                        className="ml-1.5 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="输入新标签"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTag.trim()) {
                        if (!tags.includes(newTag.trim())) {
                          setTags([...tags, newTag.trim()]);
                        }
                        setNewTag('');
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (newTag.trim() && !tags.includes(newTag.trim())) {
                        setTags([...tags, newTag.trim()]);
                        setNewTag('');
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700"
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Material Guidance Modal */}
        {showMaterialModal && selectedMaterial && (
          <>
            <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={() => setShowMaterialModal(false)} />
            <div className="fixed bottom-0 w-full max-w-md bg-gray-50 rounded-t-[32px] z-[70] pb-safe animate-in slide-in-from-bottom-full duration-300 overflow-hidden">
              <div className="relative h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />
              
              <div className="p-6 pt-2 max-h-[85vh] overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[20px] font-bold text-gray-900 leading-tight mb-1">互动指导</h3>
                    <p className="text-[13px] text-gray-500">为您准备的专业沟通策略</p>
                  </div>
                  <button onClick={() => setShowMaterialModal(false)} className="p-2 bg-white rounded-full shadow-sm text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Material Preview Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img src={selectedMaterial.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 font-bold rounded uppercase">{selectedMaterial.type}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 font-bold rounded uppercase">{selectedMaterial.materialType}</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-gray-900 line-clamp-1">{selectedMaterial.title}</h4>
                      <p className="text-[12px] text-gray-500 line-clamp-1 mt-0.5">{selectedMaterial.content}</p>
                    </div>
                  </div>
                </div>

                {/* Script Section */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <h4 className="text-[16px] font-bold text-gray-900">推荐话术</h4>
                  </div>
                  <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 relative group">
                    <p className="text-[14px] text-gray-800 leading-relaxed italic">
                      “{selectedMaterial.script}”
                    </p>
                    <button 
                      onClick={() => copyToClipboard(selectedMaterial.script)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <div className="mt-3 flex justify-end">
                      <span className="text-[10px] text-blue-400 font-medium">点击右上角可快速复制</span>
                    </div>
                  </div>
                </div>

                {/* Tips Section */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-[16px] font-bold text-gray-900">互动建议</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedMaterial.tips.map((tip: string, i: number) => (
                      <div key={i} className="flex items-start space-x-3 bg-white p-3 rounded-xl border border-gray-100">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-emerald-600">{i + 1}</span>
                        </div>
                        <p className="text-[13px] text-gray-600 leading-snug">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 py-3.5 rounded-2xl font-bold text-gray-700 active:scale-[0.98] transition-transform">
                    <ExternalLink className="w-4 h-4" />
                    <span>预览素材</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-blue-600 py-3.5 rounded-2xl font-bold text-white shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform">
                    <Send className="w-4 h-4" />
                    <span>立即转发</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Share Customer Sheet */}
        <AnimatePresence>
          {showShareSheet && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setShowShareSheet(false); setShareAgentId(''); setFoundAgentName(''); setFoundAgentTenure(null); setShowInheritanceChoice(false); setShareType(null); setHasSigned(false); }}
                className="fixed inset-0 bg-black/40 z-[80]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 w-full max-w-md bg-gray-50 rounded-t-[24px] z-[90] pb-safe overflow-hidden"
              >
                {/* Drag indicator */}
                <div className="relative h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />

                <div className="p-6 pt-1 max-h-[85vh] overflow-y-auto no-scrollbar">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-[18px] font-bold text-gray-900">共享客户</h3>
                    <button onClick={() => { setShowShareSheet(false); setShareAgentId(''); setFoundAgentName(''); setFoundAgentTenure(null); setShowInheritanceChoice(false); setShareType(null); setHasSigned(false); }} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Customer Info Card */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {customer?.avatar || customer?.name?.[0] || '客'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-gray-900">{customer?.name || '未知客户'}</span>
                          <span className="text-[12px] text-gray-400">{customer?.gender === 'M' ? '男' : customer?.gender === 'F' ? '女' : ''} | {customer?.age || '-'}岁</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {customer?.tags && customer.tags.slice(0, 2).map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] rounded-full border border-blue-100">{tag}</span>
                          ))}
                          {customer?.tags && customer.tags.length > 2 && (
                            <span className="text-[11px] text-gray-400">+{customer.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Info Form */}
                  <div className="mb-5">
                    <h4 className="text-[15px] font-bold text-gray-900 mb-4">
                      {hasSigned && shareType === 'inherit' ? '继承代理人信息' : '接收共享的代理人信息'}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center text-[14px] font-medium text-gray-700 mb-2">
                          <span className="text-red-500 mr-1">*</span> 工号
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shareAgentId}
                            onChange={(e) => {
                              const value = e.target.value;
                              setShareAgentId(value);
                              setFoundAgentName('');
                              setFoundAgentTenure(null);
                              setShowInheritanceChoice(false);
                              setShareType(null);
                              // Simulate agent lookup when input has 6+ characters
                              if (value.length >= 6) {
                                setIsSearchingAgent(true);
                                setTimeout(() => {
                                  // Mock agent data with tenure (months)
                                  const agents: Record<string, { name: string; tenure: number }> = {
                                    '1190154669': { name: '李黎红', tenure: 8 }, // 8个月司龄（新人）
                                    '1200345678': { name: '王明华', tenure: 36 }, // 3年司龄
                                    '1300456789': { name: '张晓燕', tenure: 6 }, // 6个月司龄（新人）
                                    '1400567890': { name: '陈建国', tenure: 24 }, // 2年司龄
                                  };
                                  const found = agents[value];
                                  if (found) {
                                    setFoundAgentName(found.name);
                                    setFoundAgentTenure(found.tenure);

                                    // Check inheritance conditions
                                    // Mock current agent: age 58, tenure 72 months (6 years)
                                    const currentAgentAge = 58;
                                    const currentAgentTenure = 72;
                                    const customerValue = customer?.value || 'D'; // A1, A2, A3, A4, B, C, D, E, F

                                    // D类及以上: A1, A2, A3, A4, B, C, D
                                    const highValueCustomers = ['A1', 'A2', 'A3', 'A4', 'B', 'C', 'D'];
                                    const isHighValue = highValueCustomers.includes(customerValue);

                                    // 传承条件：当前代理人年龄>=55，司龄>=5年，接收代理人司龄<=1年，客户D类及以上
                                    if (currentAgentAge >= 55 && currentAgentTenure >= 60 && found.tenure <= 12 && isHighValue) {
                                      // 先收起键盘，再弹出传承确认弹窗
                                      if (document.activeElement instanceof HTMLElement) {
                                        document.activeElement.blur();
                                      }
                                      setTimeout(() => {
                                        setShowInheritanceChoice(true);
                                      }, 100);
                                    }
                                  }
                                  setIsSearchingAgent(false);
                                }, 500);
                              }
                            }}
                            disabled={hasSigned && shareType === 'inherit'}
                            placeholder="请填写工号"
                            className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] transition-all pr-10 ${hasSigned && shareType === 'inherit' ? 'opacity-60 cursor-not-allowed' : 'outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'}`}
                          />
                          {isSearchingAgent && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        {/* Found Agent Name Display */}
                        {foundAgentName && (
                          <div className="mt-2 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-[13px] text-green-700 font-medium">姓名：<span className="font-bold">{foundAgentName}</span></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rules Section - changes based on share type */}
                  {shareType === 'inherit' ? (
                    // Inheritance rules
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                      <p className="text-[13px] text-gray-700 leading-relaxed mb-3">
                        您可以将客户传承给相同二级机构的指定代理人，传承后可获得传承奖励。
                      </p>
                      <div className="space-y-2.5">
                        {[
                          '传承客户给继承人时，需由客户授权同意；',
                          '传承后，继承人可独立经营该客户，传承人可获得一定比例的传承奖励；',
                          '继承人独立出单后，传承奖励将按照规则发放给传承人；',
                          '传承后，客户可随时撤回授权；但继承人可通过自行手动创建此客户，后续继续进行经营、服务；',
                        ].map((rule, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-[12px] font-bold text-gray-400 mt-0.5 shrink-0">{i + 1}.</span>
                            <p className="text-[12px] text-gray-500 leading-relaxed">{rule}</p>
                          </div>
                        ))}
                        {/* Rule 5 with clickable link */}
                        <div className="flex items-start gap-2">
                          <span className="text-[12px] font-bold text-gray-400 mt-0.5 shrink-0">5.</span>
                          <p className="text-[12px] text-gray-500 leading-relaxed">
                            选择传承后，您可以
                            <button
                              onClick={() => {
                                setShowShareSheet(false);
                                setShareAgentId('');
                                setFoundAgentName('');
                                setFoundAgentTenure(null);
                                setShowInheritanceChoice(false);
                                setShareType(null);
                                onSharedCustomerList?.();
                              }}
                              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-1"
                            >
                              点击此处
                            </button>
                            查看传承客户详情。
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Share rules (default)
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                      <p className="text-[13px] text-gray-700 leading-relaxed mb-3">
                        您可以将客户共享给相同二级机构的指定代理人，共同经营。
                      </p>
                      <div className="space-y-2.5">
                        {[
                          '共享客户给另一位代理人时，需由客户授权同意；',
                          '客户授权同意后，接收代理人可查看该客户个人信息以及在您名下的寿险保单；',
                          '您与接收代理人共同为客户服务出单后，你们均可查看此客户保单；',
                          '分享客户后，您仅可撤销客户未确认授权的分享，客户可以随时撤回授权；但接收代理人可通过自行手动创建此客户，后续继续进行经营、服务；',
                        ].map((rule, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-[12px] font-bold text-gray-400 mt-0.5 shrink-0">{i + 1}.</span>
                            <p className="text-[12px] text-gray-500 leading-relaxed">{rule}</p>
                          </div>
                        ))}
                        {/* Rule 5 with clickable link */}
                        <div className="flex items-start gap-2">
                          <span className="text-[12px] font-bold text-gray-400 mt-0.5 shrink-0">5.</span>
                          <p className="text-[12px] text-gray-500 leading-relaxed">
                            选择共享后，您可以
                            <button
                              onClick={() => {
                                setShowShareSheet(false);
                                setShareAgentId('');
                                setFoundAgentName('');
                                setFoundAgentTenure(null);
                                setShowInheritanceChoice(false);
                                setShareType(null);
                                onSharedCustomerList?.();
                              }}
                              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-1"
                            >
                              点击此处
                            </button>
                            查看分享客户详情。
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confirm Button or Post-Signature Status */}
                  {hasSigned && shareType === 'inherit' ? (
                    <div className="space-y-4">
                      {/* 协议签署状态 */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-bold text-gray-900">传承协议签署状态</p>
                            <p className="text-[12px] text-gray-500 mt-0.5">等待继承代理人签署后，自动邀请客户确认</p>
                          </div>
                        </div>
                        {/* 签署进度 */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-[13px] text-gray-700">传承代理人（您）已签署</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] text-gray-500">2</span>
                            </div>
                            <span className="text-[13px] text-gray-400">待继承代理人签署协议</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] text-gray-500">3</span>
                            </div>
                            <span className="text-[13px] text-gray-400">待客户确认</span>
                          </div>
                        </div>
                      </div>
                      {/* 查看协议按钮 */}
                      <button
                        onClick={() => setShowAgreementView(true)}
                        className="w-full py-3.5 rounded-2xl bg-white border-2 border-amber-500 text-amber-600 font-bold text-[15px] hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <FileText className="w-5 h-5" />
                        查看已签署的传承协议
                      </button>
                    </div>
                  ) : (
                    <button className={`w-full ${shareType === 'inherit' ? 'bg-amber-600 shadow-amber-600/20 hover:bg-amber-700' : 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-700'} text-white py-3.5 rounded-2xl font-bold text-[15px] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2`}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.699 12.103c-.347 0-.714-.031-1.084-.108-.023-.005-.047-.008-.069-.012l-1.564.632c-.017.007-.024.009-.04.013-.023.007-.038.012-.059.017-.031.008-.063.015-.095.019a3.197 3.197 0 0 1-1.337-.11c-.362-.101-.682-.28-.94-.518-.258-.239-.45-.547-.552-.909-.102-.362-.102-.764 0-1.126.101-.362.294-.67.552-.909.258-.238.578-.417.94-.518.362-.101.744-.112 1.113-.112.167 0 .334.014.5.033.023.003.045.008.067.012l1.564-.632a2.588 2.588 0 0 1 1.084-.108c.362 0 .724.031 1.086.108.023.005.047.008.069.012l1.564-.632c.017-.007.024-.009.04-.013.023-.007.038-.012.059-.017.031-.008.063-.015.095-.019a3.197 3.197 0 0 1 1.337.11c.362.101.682.28.94.518.258.239.45.547.552.909.102.362.102.764 0 1.126-.101.362-.294.67-.552.909-.258.238-.578.417-.94.518-.362.101-.744.112-1.113.112-.167 0-.334-.014-.5-.033-.023-.003-.045-.008-.067-.012l-1.564.632a2.588 2.588 0 0 1-1.084.108ZM8.699 12.103c-.347 0-.714-.031-1.084-.108" />
                        <path d="M12.75 2C6.875 2 2 6.875 2 12.75c0 2.075.55 4.025 1.513 5.7L2 22l4.45-1.425c1.625.937 3.525 1.425 5.5 1.425h.05C18.625 22 23.5 17.125 23.5 11.25S18.625 2 12.75 2Zm0 18.5c-1.85 0-3.625-.45-5.175-1.262l-.375-.212-3.1.988.988-3.1-.225-.387C2.825 15.325 2.25 13.575 2.25 11.75 2.25 7.007 6.257 3.25 12.75 3.25S23.25 7.007 23.25 11.75 19.243 21.5 12.75 21.5Z" />
                      </svg>
                      {shareType === 'inherit' ? '邀请客户确认传承' : '邀请客户确认共享'}
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 传承客户弹窗 */}
        <AnimatePresence>
          {showTransferSheet && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setShowTransferSheet(false); setTransferAgentId(''); setTransferAgentName(''); setTransferStatus('idle'); }}
                className="fixed inset-0 bg-black/40 z-[80]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 w-full max-w-md bg-gray-50 rounded-t-[24px] z-[90] pb-safe overflow-hidden"
              >
                {/* Drag indicator */}
                <div className="relative h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />

                <div className="p-6 pt-1 max-h-[85vh] overflow-y-auto no-scrollbar">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-[18px] font-bold text-gray-900">传承客户</h3>
                    <button onClick={() => { setShowTransferSheet(false); setTransferAgentId(''); setTransferAgentName(''); setTransferStatus('idle'); }} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Customer Info Card */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium shadow-sm ${customer?.color || 'bg-blue-500'}`}>
                        {customer?.isImage ? (
                          <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                        ) : (
                          customer?.avatar || customer?.name?.charAt(0) || '客'
                        )}
                      </div>
                      <div>
                        <p className="text-[16px] font-bold text-gray-900">{customer?.name || '未知客户'}</p>
                        <p className="text-[13px] text-gray-500">{customer?.phone || ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* 有签署传承协议的代理人 - 显示完整传承流程 */}
                  {hasSignedInheritanceAgreement ? (
                    <>
                      {/* Agent Selection */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
                        <label className="text-[14px] font-medium text-gray-700 mb-3 block">
                          选择传承接收代理人
                        </label>

                        {/* 已签署传承协议的代理人下拉 */}
                        <div className="relative">
                          <button
                            onClick={() => setShowTransferAgentDropdown(!showTransferAgentDropdown)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-left flex items-center justify-between"
                          >
                            <span className={transferAgentId ? 'text-gray-800' : 'text-gray-400'}>
                              {transferAgentId ? (
                                <>
                                  <span className="font-medium">{transferAgentName}</span>
                                  <span className="text-gray-500 ml-2">工号 {transferAgentId}</span>
                                </>
                              ) : '请选择已签署传承协议的代理人'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTransferAgentDropdown ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {showTransferAgentDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
                              >
                                <div className="divide-y divide-gray-50">
                                  {transferAgents.map((agent) => (
                                    <button
                                      key={agent.id}
                                      onClick={() => {
                                        setTransferAgentId(agent.id);
                                        setTransferAgentName(agent.name);
                                        setShowTransferAgentDropdown(false);
                                      }}
                                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${transferAgentId === agent.id ? 'bg-blue-50' : ''}`}
                                    >
                                      <span className={`text-[14px] font-medium ${transferAgentId === agent.id ? 'text-blue-600' : 'text-gray-800'}`}>{agent.name}</span>
                                      <span className={`text-[12px] ml-2 ${transferAgentId === agent.id ? 'text-blue-500' : 'text-gray-500'}`}>工号 {agent.id}</span>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Rules Section */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                        <p className="text-[13px] text-gray-700 leading-relaxed mb-3">
                          传承客户给已签署传承协议的代理人，传承后可获得传承奖励。
                        </p>
                        <div className="space-y-2.5">
                          {[
                            '传承客户给继承人时，需由客户授权同意；',
                            '传承后，继承人可独立经营该客户，传承人可获得一定比例的传承奖励；',
                            '继承人独立出单后，传承奖励将按照规则发放给传承人；',
                            '传承后，客户可随时撤回授权；但继承人可通过自行手动创建此客户，后续继续进行经营、服务；',
                          ].map((rule, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-[12px] font-bold text-gray-400 mt-0.5 shrink-0">{i + 1}.</span>
                              <p className="text-[12px] text-gray-500 leading-relaxed">{rule}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Submit Button - 根据状态显示不同内容 */}
                      {transferStatus === 'idle' ? (
                        <button
                          disabled={!transferAgentId}
                          onClick={() => {
                            if (transferAgentId) {
                              setShowWechatPrompt(true);
                            }
                          }}
                          className={`w-full py-3.5 rounded-2xl font-bold text-[15px] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${transferAgentId ? 'bg-amber-600 shadow-amber-600/20 hover:bg-amber-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                          <Users className="w-5 h-5" />
                          邀请客户确认
                        </button>
                      ) : (
                        <div className="space-y-3">
                          {/* 待客户同意状态 */}
                          <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                                <Clock className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-[14px] font-medium text-orange-700">待客户同意</span>
                            </div>
                            <button
                              onClick={() => {
                                setTransferStatus('idle');
                                setTransferAgentId('');
                                setTransferAgentName('');
                              }}
                              className="text-[13px] text-gray-500 hover:text-gray-700 font-medium"
                            >
                              撤销传承
                            </button>
                          </div>
                          <div className="bg-white rounded-xl p-3 text-center">
                            <p className="text-[12px] text-gray-500">
                              已向客户发送传承请求，等待客户确认同意
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* 没有签署传承协议 - 显示提示弹窗 */
                    <>
                      {/* 提示卡片 */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-orange-400" />
                          </div>
                          <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                            如要传承客户，应当先签署代理人间客户传承协议
                          </p>
                          <button
                            onClick={() => {
                              setShowTransferSheet(false);
                              // 跳转到新签代理人间客户传承协议页面
                            }}
                            className="text-[14px] text-blue-600 font-medium hover:text-blue-700 underline underline-offset-2"
                          >
                            点击此处签署代理人间客户传承协议
                          </button>
                        </div>
                      </div>

                      {/* Rules Section */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-[13px] text-gray-700 leading-relaxed mb-3">
                          传承客户说明：
                        </p>
                        <div className="space-y-2.5">
                          {[
                            '传承代理人和继承代理人双方需先签署传承协议；',
                            '传承客户给继承人时，需由客户授权同意；',
                            '传承后，继承人可独立经营该客户，传承人可获得一定比例的传承奖励；',
                          ].map((rule, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-[12px] font-bold text-gray-400 mt-0.5 shrink-0">{i + 1}.</span>
                              <p className="text-[12px] text-gray-500 leading-relaxed">{rule}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 微信提示弹窗 */}
        <AnimatePresence>
          {showWechatPrompt && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowWechatPrompt(false)}
                className="fixed inset-0 bg-black/40 z-[100]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 w-full max-w-md bg-white rounded-t-[24px] z-[110] overflow-hidden"
              >
                {/* Drag indicator */}
                <div className="relative h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />

                <div className="p-6 pt-1">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-[18px] font-bold text-gray-900">发送传承请求</h3>
                    <button onClick={() => setShowWechatPrompt(false)} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 内容 */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-[14px] text-gray-700 leading-relaxed mb-2">
                      正在唤起微信...
                    </p>
                    <p className="text-[13px] text-gray-500">
                      向客户 <span className="font-medium text-gray-700">{customer?.name}</span> 发送传承服务升级消息
                    </p>
                  </div>

                  {/* 接收代理人信息 */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-gray-500">传承接收代理人</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-medium text-gray-800">{transferAgentName}</span>
                        <span className="text-[12px] text-gray-500">工号 {transferAgentId}</span>
                      </div>
                    </div>
                  </div>

                  {/* 确认按钮 */}
                  <button
                    onClick={() => {
                      setShowWechatPrompt(false);
                      setTransferStatus('sent');
                    }}
                    className="w-full py-3.5 rounded-2xl bg-green-500 text-white font-bold text-[15px] shadow-lg shadow-green-500/20 hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    确认发送
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Inheritance Confirmation Modal */}
        <AnimatePresence>
          {showInheritanceChoice && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setShowInheritanceChoice(false); setShareType('share'); }}
                className="fixed inset-0 bg-black/50 z-[100]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[110] bg-white rounded-t-3xl shadow-2xl"
              >
                {/* Drag indicator */}
                <div className="relative h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3" />
                {/* Header */}
                <div className="px-6 pt-4 pb-2">
                  <h3 className="text-[18px] font-bold text-gray-900">传承提示</h3>
                </div>
                {/* Content */}
                <div className="px-6 py-4">
                  <p className="text-[14px] text-gray-700 leading-relaxed mb-3">
                    传承D类及以上客户，接收代理人（继承人）独立出单后，传承人可获得一定比例传承奖励。
                  </p>
                  <p className="text-[13px] text-gray-500 mb-3">
                    是否要进行传承操作？
                  </p>
                  <p className="text-[13px] text-gray-500 mb-5">
                    需要传承代理人和继承代理人双方签署协议，之后会自动邀请客户确认。
                  </p>
                  {/* Buttons */}
                  <div className="flex gap-3 pb-6">
                    <button
                      onClick={() => { setShowInheritanceChoice(false); setShareType('share'); }}
                      className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors"
                    >
                      否，共享客户
                    </button>
                    <button
                      onClick={() => {
                        setShowInheritanceChoice(false);
                        setShowSignAgreement(true);
                      }}
                      className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-bold text-[14px] hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20"
                    >
                      是，传承客户
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 签署协议弹窗 */}
        <AnimatePresence>
          {showSignAgreement && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSignAgreement(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[110] bg-white rounded-t-3xl shadow-2xl"
              >
                {/* Drag indicator */}
                <div className="relative h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3" />
                {/* Header */}
                <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                  <h3 className="text-[18px] font-bold text-gray-900">签署传承协议</h3>
                  <button onClick={() => setShowSignAgreement(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Content */}
                <div className="px-6 py-4">
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      作为传承代理人，您需要先签署传承协议。签署后，系统将自动邀请继承代理人签署，双方签署完成后将自动邀请客户确认。
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 mb-4">
                    <h4 className="text-[14px] font-bold text-gray-900 mb-3">传承协议条款</h4>
                    <div className="space-y-2 text-[13px] text-gray-600">
                      <p>1. 传承客户给继承人时，需由客户授权同意；</p>
                      <p>2. 传承后，继承人可独立经营该客户，传承人可获得一定比例的传承奖励；</p>
                      <p>3. 继承人独立出单后，传承奖励将按照规则发放给传承人；</p>
                      <p>4. 传承后，客户可随时撤回授权；</p>
                      <p>5. 本协议需传承代理人和继承代理人双方签署后生效。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 mb-5">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 mt-0.5" />
                    <p className="text-[13px] text-gray-600">
                      我已阅读并同意以上传承协议条款
                    </p>
                  </div>
                  {/* Buttons */}
                  <div className="flex gap-3 pb-6">
                    <button
                      onClick={() => setShowSignAgreement(false)}
                      className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        setShowSignAgreement(false);
                        setShowSignatureScreen(true);
                      }}
                      className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-bold text-[14px] hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20"
                    >
                      确认签署
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 横屏签字界面 */}
        <AnimatePresence>
          {showSignatureScreen && (
            <>
              {/* 半透明遮罩 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-[200]"
              />
              {/* 签字全屏界面 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[201] bg-white flex flex-col"
              >
                {/* 顶部标题栏 */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                  <button
                    onClick={() => setShowSignatureScreen(false)}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-[14px]">返回</span>
                  </button>
                  <h3 className="text-[16px] font-bold text-gray-900">签署传承协议</h3>
                  <button
                    onClick={() => {
                      // 清空画布
                      const canvas = signatureCanvasRef.current;
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                      }
                    }}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-[14px]">重写</span>
                  </button>
                </div>

                {/* 签字提示 */}
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                  <p className="text-[13px] text-amber-800 text-center">请在下方空白区域签上您的名字</p>
                </div>

                {/* 签字画布区域 - 占据大部分屏幕 */}
                <div className="flex-1 relative bg-white">
                  <canvas
                    ref={signatureCanvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ cursor: 'crosshair', touchAction: 'none' }}
                  />
                </div>

                {/* 底部按钮 */}
                <div className="px-4 py-4 bg-white border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSignatureScreen(false)}
                      className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        setHasSigned(true);
                        setShareType('inherit');
                        setShowSignatureScreen(false);
                        setShowShareSheet(true);
                      }}
                      className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-bold text-[14px] hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20"
                    >
                      完成签署
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 查看已签署协议弹窗 */}
        <AnimatePresence>
          {showAgreementView && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAgreementView(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[130] bg-white rounded-t-3xl shadow-2xl"
              >
                {/* Drag indicator */}
                <div className="relative h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3" />
                {/* Header */}
                <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                  <h3 className="text-[18px] font-bold text-gray-900">传承协议</h3>
                  <button onClick={() => setShowAgreementView(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Content */}
                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      作为传承代理人，您已签署传承协议。签署后，系统将自动邀请继承代理人签署，双方签署完成后将自动邀请客户确认。
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 mb-4">
                    <h4 className="text-[14px] font-bold text-gray-900 mb-3">传承协议条款</h4>
                    <div className="space-y-2 text-[13px] text-gray-600">
                      <p>1. 传承客户给继承人时，需由客户授权同意；</p>
                      <p>2. 传承后，继承人可独立经营该客户，传承人可获得一定比例的传承奖励；</p>
                      <p>3. 继承人独立出单后，传承奖励将按照规则发放给传承人；</p>
                      <p>4. 传承后，客户可随时撤回授权；</p>
                      <p>5. 本协议需传承代理人和继承代理人双方签署后生效。</p>
                    </div>
                  </div>
                  {/* 签署状态 */}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <h4 className="text-[14px] font-bold text-amber-800 mb-3">签署状态</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[13px] text-gray-700">传承代理人（您）已签署</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] text-gray-500">2</span>
                        </div>
                        <span className="text-[13px] text-gray-400">待继承代理人签署协议</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] text-gray-500">3</span>
                        </div>
                        <span className="text-[13px] text-gray-400">待客户确认</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bottom button */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setShowAgreementView(false)}
                    className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Birthday Card Modal */}
        {showBirthdayCard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBirthdayCard(false)} />
            <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-500 flex flex-col items-center justify-center text-white p-6 text-center">
                <Cake className="w-12 h-12 mb-3 animate-bounce" />
                <h2 className="text-2xl font-bold mb-1">生日快乐</h2>
                <p className="text-white/80 text-sm">祝 {customer?.name || '曹嘉玲'} 岁岁平安，万事如意</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[14px] text-gray-600 leading-relaxed italic">
                      "岁月如歌，愿您的生活充满阳光与欢笑。在这个特别的日子里，送上我最真诚的祝福。"
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[13px] text-gray-400">
                    <span>发送人：您的专属顾问</span>
                    <span>2026-07-14</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBirthdayCard(false)}
                  className="w-full mt-6 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                >
                  立即发送贺卡
                </button>
              </div>
              <button 
                onClick={() => setShowBirthdayCard(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

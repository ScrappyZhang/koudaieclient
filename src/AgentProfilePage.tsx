import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Users, 
  TrendingUp, 
  PieChart, 
  Target, 
  Award, 
  Zap, 
  History, 
  UserCircle,
  BarChart3,
  Activity,
  MapPin,
  ShieldCheck,
  Star,
  ArrowUpRight,
  Filter,
  MoreHorizontal,
  Edit3,
  Menu,
  X,
  Info,
  Wallet,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const tabs = [
  { id: 'basic', label: '基本信息', icon: UserCircle },
  { id: 'career', label: '发展历程', icon: History },
  { id: 'customers', label: '客户资源', icon: Users },
  { id: 'habits', label: '行为习惯', icon: Activity },
  { id: 'performance', label: '业绩产能', icon: TrendingUp },
  { id: 'skills', label: '擅长技能', icon: Zap },
  { id: 'honors', label: '荣誉奖惩', icon: Award },
  { id: 'team', label: '团队发展', icon: Target },
];

function CustomerResourcesTab() {
  const [activeCategory, setActiveCategory] = useState('客户总数');

  const categories = [
    { id: '客户总数', label: '客户总数', count: 1248 },
    { id: '寿险客户数', label: '寿险客户数', count: 452 },
    { id: '准客数', label: '准客数', count: 328 },
    { id: '用户数', label: '用户数', count: 468 },
    { id: '当月新增客户数', label: '当月新增客户数', count: 56 },
  ];

  const distributionData: Record<string, number[][]> = {
    '客户总数': [
      [12, 45, 88],
      [34, 156, 230],
      [120, 340, 223]
    ],
    '寿险客户数': [
      [8, 25, 42],
      [15, 86, 112],
      [45, 102, 17],
    ],
    '准客数': [
      [2, 12, 28],
      [10, 45, 76],
      [52, 98, 5],
    ],
    '用户数': [
      [2, 8, 18],
      [9, 25, 42],
      [23, 140, 201],
    ],
    '当月新增客户数': [
      [0, 2, 5],
      [1, 12, 18],
      [5, 10, 3],
    ]
  };

  const segmentsData: Record<string, {
    segments: { label: string; count: number; color: string }[];
    age: { label: string; count: number; color: string }[];
    occupation: { label: string; count: number; color: string }[];
  }> = {
    '客户总数': {
      segments: [
        { label: '奋斗青年', count: 156, color: 'bg-blue-400' },
        { label: '都市白领', count: 230, color: 'bg-indigo-400' },
        { label: '新晋父母', count: 188, color: 'bg-rose-400' },
        { label: '社会中坚', count: 312, color: 'bg-amber-400' },
        { label: '临退天命', count: 98, color: 'bg-emerald-400' },
        { label: '慈爱祖辈', count: 145, color: 'bg-teal-400' },
        { label: '创业新贵', count: 42, color: 'bg-purple-400' },
        { label: '创富一代', count: 28, color: 'bg-orange-400' },
        { label: '荣耀高堂', count: 15, color: 'bg-red-400' },
        { label: '承富二代', count: 12, color: 'bg-pink-400' },
        { label: '已退小康', count: 18, color: 'bg-cyan-400' },
        { label: '其他', count: 4, color: 'bg-gray-400' },
      ],
      age: [
        { label: '25岁以下', count: 45, color: 'bg-blue-400' },
        { label: '26-35岁', count: 280, color: 'bg-indigo-400' },
        { label: '36-45岁', count: 412, color: 'bg-rose-400' },
        { label: '46-55岁', count: 215, color: 'bg-amber-400' },
        { label: '55岁以上', count: 128, color: 'bg-emerald-400' },
      ],
      occupation: [
        { label: '企业职员', count: 350, color: 'bg-blue-400' },
        { label: '公务员/教师', count: 180, color: 'bg-indigo-400' },
        { label: '私营业主', count: 120, color: 'bg-rose-400' },
        { label: '自由职业', count: 95, color: 'bg-amber-400' },
        { label: '其他', count: 55, color: 'bg-gray-400' },
      ]
    },
    '寿险客户数': {
      segments: [
        { label: '奋斗青年', count: 45, color: 'bg-blue-400' },
        { label: '都市白领', count: 82, color: 'bg-indigo-400' },
        { label: '新晋父母', count: 65, color: 'bg-rose-400' },
        { label: '社会中坚', count: 120, color: 'bg-amber-400' },
        { label: '临退天命', count: 34, color: 'bg-emerald-400' },
        { label: '慈爱祖辈', count: 56, color: 'bg-teal-400' },
        { label: '创业新贵', count: 12, color: 'bg-purple-400' },
        { label: '创富一代', count: 8, color: 'bg-orange-400' },
        { label: '荣耀高堂', count: 5, color: 'bg-red-400' },
        { label: '承富二代', count: 4, color: 'bg-pink-400' },
        { label: '已退小康', count: 15, color: 'bg-cyan-400' },
        { label: '其他', count: 6, color: 'bg-gray-400' },
      ],
      age: [
        { label: '25岁以下', count: 12, color: 'bg-blue-400' },
        { label: '26-35岁', count: 85, color: 'bg-indigo-400' },
        { label: '36-45岁', count: 156, color: 'bg-rose-400' },
        { label: '46-55岁', count: 98, color: 'bg-amber-400' },
        { label: '55岁以上', count: 42, color: 'bg-emerald-400' },
      ],
      occupation: [
        { label: '企业职员', count: 145, color: 'bg-blue-400' },
        { label: '公务员/教师', count: 88, color: 'bg-indigo-400' },
        { label: '私营业主', count: 62, color: 'bg-rose-400' },
        { label: '自由职业', count: 45, color: 'bg-amber-400' },
        { label: '其他', count: 22, color: 'bg-gray-400' },
      ]
    },
    '准客数': {
      segments: [
        { label: '奋斗青年', count: 65, color: 'bg-blue-400' },
        { label: '都市白领', count: 45, color: 'bg-indigo-400' },
        { label: '新晋父母', count: 32, color: 'bg-rose-400' },
        { label: '社会中坚', count: 88, color: 'bg-amber-400' },
        { label: '临退天命', count: 21, color: 'bg-emerald-400' },
        { label: '慈爱祖辈', count: 34, color: 'bg-teal-400' },
        { label: '创业新贵', count: 15, color: 'bg-purple-400' },
        { label: '创富一代', count: 10, color: 'bg-orange-400' },
        { label: '荣耀高堂', count: 4, color: 'bg-red-400' },
        { label: '承富二代', count: 3, color: 'bg-pink-400' },
        { label: '已退小康', count: 8, color: 'bg-cyan-400' },
        { label: '其他', count: 3, color: 'bg-gray-400' },
      ],
      age: [
        { label: '25岁以下', count: 56, color: 'bg-blue-400' },
        { label: '26-35岁', count: 120, color: 'bg-indigo-400' },
        { label: '36-45岁', count: 85, color: 'bg-rose-400' },
        { label: '46-55岁', count: 42, color: 'bg-amber-400' },
        { label: '55岁以上', count: 15, color: 'bg-emerald-400' },
      ],
      occupation: [
        { label: '企业职员', count: 110, color: 'bg-blue-400' },
        { label: '公务员/教师', count: 45, color: 'bg-indigo-400' },
        { label: '私营业主', count: 32, color: 'bg-rose-400' },
        { label: '自由职业', count: 68, color: 'bg-amber-400' },
        { label: '其他', count: 25, color: 'bg-gray-400' },
      ]
    },
    '用户数': {
      segments: [
        { label: '奋斗青年', count: 88, color: 'bg-blue-400' },
        { label: '都市白领', count: 102, color: 'bg-indigo-400' },
        { label: '新晋父母', count: 76, color: 'bg-rose-400' },
        { label: '社会中坚', count: 145, color: 'bg-amber-400' },
        { label: '临退天命', count: 12, color: 'bg-emerald-400' },
        { label: '慈爱祖辈', count: 23, color: 'bg-teal-400' },
        { label: '创业新贵', count: 8, color: 'bg-purple-400' },
        { label: '创富一代', count: 5, color: 'bg-orange-400' },
        { label: '荣耀高堂', count: 2, color: 'bg-red-400' },
        { label: '承富二代', count: 1, color: 'bg-pink-400' },
        { label: '已退小康', count: 4, color: 'bg-cyan-400' },
        { label: '其他', count: 2, color: 'bg-gray-400' },
      ],
      age: [
        { label: '25岁以下', count: 120, color: 'bg-blue-400' },
        { label: '26-35岁', count: 180, color: 'bg-indigo-400' },
        { label: '36-45岁', count: 95, color: 'bg-rose-400' },
        { label: '46-55岁', count: 32, color: 'bg-amber-400' },
        { label: '55岁以上', count: 12, color: 'bg-emerald-400' },
      ],
      occupation: [
        { label: '企业职员', count: 150, color: 'bg-blue-400' },
        { label: '公务员/教师', count: 65, color: 'bg-indigo-400' },
        { label: '私营业主', count: 22, color: 'bg-rose-400' },
        { label: '自由职业', count: 120, color: 'bg-amber-400' },
        { label: '其他', count: 85, color: 'bg-gray-400' },
      ]
    },
    '当月新增客户数': {
      segments: [
        { label: '奋斗青年', count: 12, color: 'bg-blue-400' },
        { label: '都市白领', count: 15, color: 'bg-indigo-400' },
        { label: '新晋父母', count: 10, color: 'bg-rose-400' },
        { label: '社会中坚', count: 14, color: 'bg-amber-400' },
        { label: '临退天命', count: 2, color: 'bg-emerald-400' },
        { label: '慈爱祖辈', count: 1, color: 'bg-teal-400' },
        { label: '创业新贵', count: 1, color: 'bg-purple-400' },
        { label: '创富一代', count: 0, color: 'bg-orange-400' },
        { label: '荣耀高堂', count: 0, color: 'bg-red-400' },
        { label: '承富二代', count: 0, color: 'bg-pink-400' },
        { label: '已退小康', count: 1, color: 'bg-cyan-400' },
        { label: '其他', count: 0, color: 'bg-gray-400' },
      ],
      age: [
        { label: '25岁以下', count: 8, color: 'bg-blue-400' },
        { label: '26-35岁', count: 22, color: 'bg-indigo-400' },
        { label: '36-45岁', count: 15, color: 'bg-rose-400' },
        { label: '46-55岁', count: 5, color: 'bg-amber-400' },
        { label: '55岁以上', count: 2, color: 'bg-emerald-400' },
      ],
      occupation: [
        { label: '企业职员', count: 25, color: 'bg-blue-400' },
        { label: '公务员/教师', count: 12, color: 'bg-indigo-400' },
        { label: '私营业主', count: 5, color: 'bg-rose-400' },
        { label: '自由职业', count: 8, color: 'bg-amber-400' },
        { label: '其他', count: 2, color: 'bg-gray-400' },
      ]
    }
  };

  const productDistributionData: Record<string, {
    liability: { label: string; percentage: number; color: string }[];
    design: { label: string; percentage: number; color: string }[];
  }> = {
    '客户总数': {
      liability: [
        { label: '寿险', percentage: 20, color: 'bg-indigo-500' },
        { label: '重疾', percentage: 35, color: 'bg-rose-500' },
        { label: '意外', percentage: 15, color: 'bg-amber-500' },
        { label: '医疗', percentage: 10, color: 'bg-blue-500' },
        { label: '财富', percentage: 12, color: 'bg-emerald-500' },
        { label: '养老', percentage: 8, color: 'bg-orange-500' },
      ],
      design: [
        { label: '分红', percentage: 30, color: 'bg-purple-500' },
        { label: '投连', percentage: 10, color: 'bg-cyan-500' },
        { label: '万能', percentage: 25, color: 'bg-teal-500' },
        { label: '普通', percentage: 25, color: 'bg-gray-500' },
        { label: '其他', percentage: 10, color: 'bg-slate-400' },
      ]
    },
    '寿险客户数': {
      liability: [
        { label: '寿险', percentage: 100, color: 'bg-indigo-500' },
        { label: '重疾', percentage: 0, color: 'bg-rose-500' },
        { label: '意外', percentage: 0, color: 'bg-amber-500' },
        { label: '医疗', percentage: 0, color: 'bg-blue-500' },
        { label: '财富', percentage: 0, color: 'bg-emerald-500' },
        { label: '养老', percentage: 0, color: 'bg-orange-500' },
      ],
      design: [
        { label: '分红', percentage: 45, color: 'bg-purple-500' },
        { label: '投连', percentage: 5, color: 'bg-cyan-500' },
        { label: '万能', percentage: 15, color: 'bg-teal-500' },
        { label: '普通', percentage: 35, color: 'bg-gray-500' },
        { label: '其他', percentage: 0, color: 'bg-slate-400' },
      ]
    },
    '准客数': {
      liability: [
        { label: '寿险', percentage: 15, color: 'bg-indigo-500' },
        { label: '重疾', percentage: 45, color: 'bg-rose-500' },
        { label: '意外', percentage: 10, color: 'bg-amber-500' },
        { label: '医疗', percentage: 20, color: 'bg-blue-500' },
        { label: '财富', percentage: 5, color: 'bg-emerald-500' },
        { label: '养老', percentage: 5, color: 'bg-orange-500' },
      ],
      design: [
        { label: '分红', percentage: 10, color: 'bg-purple-500' },
        { label: '投连', percentage: 0, color: 'bg-cyan-500' },
        { label: '万能', percentage: 5, color: 'bg-teal-500' },
        { label: '普通', percentage: 80, color: 'bg-gray-500' },
        { label: '其他', percentage: 5, color: 'bg-slate-400' },
      ]
    },
    '用户数': {
      liability: [
        { label: '寿险', percentage: 5, color: 'bg-indigo-500' },
        { label: '重疾', percentage: 10, color: 'bg-rose-500' },
        { label: '意外', percentage: 35, color: 'bg-amber-500' },
        { label: '医疗', percentage: 45, color: 'bg-blue-500' },
        { label: '财富', percentage: 2, color: 'bg-emerald-500' },
        { label: '养老', percentage: 3, color: 'bg-orange-500' },
      ],
      design: [
        { label: '分红', percentage: 5, color: 'bg-purple-500' },
        { label: '投连', percentage: 2, color: 'bg-cyan-500' },
        { label: '万能', percentage: 8, color: 'bg-teal-500' },
        { label: '普通', percentage: 75, color: 'bg-gray-500' },
        { label: '其他', percentage: 10, color: 'bg-slate-400' },
      ]
    },
    '当月新增客户数': {
      liability: [
        { label: '寿险', percentage: 25, color: 'bg-indigo-500' },
        { label: '重疾', percentage: 40, color: 'bg-rose-500' },
        { label: '意外', percentage: 10, color: 'bg-amber-500' },
        { label: '医疗', percentage: 15, color: 'bg-blue-500' },
        { label: '财富', percentage: 5, color: 'bg-emerald-500' },
        { label: '养老', percentage: 5, color: 'bg-orange-500' },
      ],
      design: [
        { label: '分红', percentage: 20, color: 'bg-purple-500' },
        { label: '投连', percentage: 0, color: 'bg-cyan-500' },
        { label: '万能', percentage: 30, color: 'bg-teal-500' },
        { label: '普通', percentage: 45, color: 'bg-gray-500' },
        { label: '其他', percentage: 5, color: 'bg-slate-400' },
      ]
    }
  };

  const customerQualityData: Record<string, { label: string; value: string; subText: string; color: string; icon: any }[]> = {
    '客户总数': [
      { label: '客户人均保费', value: '1.2万', subText: '客户平均保费贡献', color: 'text-indigo-600', icon: Wallet },
      { label: '件均保费', value: '0.8万', subText: '保单平均价值', color: 'text-blue-600', icon: Zap },
      { label: '客户加保率', value: '28.5%', subText: '存量客户二次开发比例', color: 'text-emerald-600', icon: ArrowUpRight },
      { label: '人均件数', value: '1.5件', subText: '客户粘性指标', color: 'text-amber-600', icon: Layers },
      { label: '高保费客户占比', value: '12.4%', subText: '保费>5万客户比例', color: 'text-purple-600', icon: Star },
      { label: '老客户贡献占比', value: '45.2%', subText: '业绩稳定性指标', color: 'text-cyan-600', icon: Users },
    ],
    '寿险客户数': [
      { label: '客户人均保费', value: '2.5万', subText: '高净值属性明显', color: 'text-indigo-600', icon: Wallet },
      { label: '件均保费', value: '1.8万', subText: '寿险件均较高', color: 'text-blue-600', icon: Zap },
      { label: '客户加保率', value: '35.2%', subText: '二次开发能力强', color: 'text-emerald-600', icon: ArrowUpRight },
      { label: '人均件数', value: '2.1件', subText: '深度经营指标', color: 'text-amber-600', icon: Layers },
      { label: '高保费客户占比', value: '22.8%', subText: '保费>10万客户比例', color: 'text-purple-600', icon: Star },
      { label: '老客户贡献占比', value: '58.5%', subText: '存量价值核心', color: 'text-cyan-600', icon: Users },
    ],
    '准客数': [
      { label: '预估人均保费', value: '0.8万', subText: '基础保障为主', color: 'text-indigo-600', icon: Wallet },
      { label: '预计件均', value: '0.6万', subText: '初期投保意向', color: 'text-blue-600', icon: Zap },
      { label: '预计转化率', value: '15.8%', subText: '近期跟进活跃', color: 'text-emerald-600', icon: ArrowUpRight },
      { label: '预估件数', value: '1.2件', subText: '初步配置计划', color: 'text-amber-600', icon: Layers },
      { label: '高意向占比', value: '18.5%', subText: '高保费潜力准客', color: 'text-purple-600', icon: Star },
      { label: '转介绍占比', value: '32.4%', subText: '资源来源质量', color: 'text-cyan-600', icon: Users },
    ],
    '用户数': [
      { label: '用户人均价值', value: '0.2万', subText: '线上用户贡献', color: 'text-indigo-600', icon: Wallet },
      { label: '件均价值', value: '0.1万', subText: '碎片化产品为主', color: 'text-blue-600', icon: Zap },
      { label: '转化加保率', value: '5.2%', subText: '线上转化潜力', color: 'text-emerald-600', icon: ArrowUpRight },
      { label: '人均持有', value: '1.1件', subText: '用户粘性较低', color: 'text-amber-600', icon: Layers },
      { label: '活跃用户占比', value: '25.6%', subText: '月度互动用户', color: 'text-purple-600', icon: Star },
      { label: '新用户占比', value: '42.8%', subText: '流量增长指标', color: 'text-cyan-600', icon: Users },
    ],
    '当月新增客户数': [
      { label: '新客件均保费', value: '1.5万', subText: '新客质量优异', color: 'text-indigo-600', icon: Wallet },
      { label: '首月件均', value: '1.2万', subText: '首单成交质量', color: 'text-blue-600', icon: Zap },
      { label: '首月加保率', value: '12.5%', subText: '组合销售能力', color: 'text-emerald-600', icon: ArrowUpRight },
      { label: '首月人均件数', value: '1.3件', subText: '初步配置深度', color: 'text-amber-600', icon: Layers },
      { label: '高保费新客比', value: '15.2%', subText: '优质新资源占比', color: 'text-purple-600', icon: Star },
      { label: '转介绍来源比', value: '65.4%', subText: '资源获取品质', color: 'text-cyan-600', icon: Users },
    ]
  };

  const [productView, setProductView] = useState<'liability' | 'design'>('liability');
  const [segmentsView, setSegmentsView] = useState<'segments' | 'age' | 'occupation'>('segments');

  const currentGrid = distributionData[activeCategory];
  const currentSegmentsData = segmentsData[activeCategory][segmentsView];
  const currentProductData = productDistributionData[activeCategory][productView];
  const currentQuality = customerQualityData[activeCategory];
  const maxSegmentCount = Math.max(...currentSegmentsData.map(s => s.count), 1);
  const maxProductPercentage = Math.max(...currentProductData.map(p => p.percentage), 1);

  // Dynamic coaching tip based on grid data
  const getCoachingTip = () => {
    const aLevelCold = currentGrid[0][0];
    const aLevelHot = currentGrid[0][2];
    const defLevelHot = currentGrid[2][2];

    if (aLevelCold > 10) {
      return {
        title: "A类客户激活建议",
        content: `该代理人有 ${aLevelCold} 位A类客户处于“冷却”状态。建议主管督促其进行一次深度面访，以资产配置或法商税务为切入点重新建立联系。`,
        icon: <Star className="w-4 h-4 text-amber-500" />
      };
    }
    if (aLevelHot > 50) {
      return {
        title: "大单转化机会",
        content: `当前有 ${aLevelHot} 位A类客户处于“中高温”状态。这是极佳的转化窗口，建议协助代理人进行大单陪访，冲刺高标业绩。`,
        icon: <TrendingUp className="w-4 h-4 text-emerald-500" />
      };
    }
    return {
      title: "客群经营建议",
      content: `代理人目前客群结构稳健。建议关注“DEF”层级的 ${defLevelHot} 位活跃客户，通过线上沙龙或小额赠险活动，挖掘其向“BC”层级转化的潜力。`,
      icon: <Info className="w-4 h-4 text-blue-500" />
    };
  };

  const tip = getCoachingTip();

  return (
    <div className="space-y-4 pb-10">
      {/* 客户资源总览统计 (Compact Horizontal Scroll) */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1 -mx-4 px-4 scrollbar-hide">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex flex-col items-start p-3.5 rounded-2xl border transition-all min-w-[110px] relative overflow-hidden ${
              activeCategory === cat.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-white border-gray-100 text-gray-900 hover:border-indigo-200'
            }`}
          >
            <span className={`text-[10px] mb-1 font-medium transition-colors ${activeCategory === cat.id ? 'text-indigo-100' : 'text-gray-500'}`}>
              {cat.label}
            </span>
            <span className="text-lg font-bold leading-none">
              {cat.count.toLocaleString()}
            </span>
            {activeCategory === cat.id && (
              <div className="absolute top-1.5 right-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* 1. 客户资源全景卡片 (Strategic View) - Moved to Top */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">客户全景</h2>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100">
                {activeCategory}
              </span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" />
              点击上方指标可切换统计维度
            </div>
          </div>
        </div>

        {/* 九宫格分布矩阵 */}
        <div className="relative bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <div className="flex">
            {/* Y-axis (Value - Improved Labels) */}
            <div className="flex flex-col justify-around pr-3 text-[10px] text-gray-400 font-semibold h-56 text-right w-10">
              <span>A</span>
              <span>BC</span>
              <span>DEF</span>
            </div>
            
            {/* Grid */}
            <div className="flex-1 grid grid-rows-3 gap-1.5 h-56 relative">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeCategory}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 grid grid-rows-3 gap-1.5"
                >
                  {currentGrid.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-3 gap-1.5">
                      {row.map((cell, colIndex) => {
                        const rowWeight = (2 - rowIndex); 
                        const bgOpacity = 0.15 + (rowWeight * 0.25);
                        
                        let baseColor = '99, 102, 241'; 
                        let textColor = 'text-indigo-900';
                        
                        if (colIndex === 0) {
                          baseColor = '56, 189, 248'; // 冷却
                          textColor = 'text-sky-900';
                        } else if (colIndex === 1) {
                          baseColor = '251, 191, 36'; // 低温
                          textColor = 'text-amber-900';
                        } else if (colIndex === 2) {
                          baseColor = '248, 113, 113'; // 中高温
                          textColor = 'text-red-900';
                        }

                        const isDark = bgOpacity > 0.5;
                        const finalTextColor = isDark ? 'text-white' : textColor;
                        
                        return (
                          <div 
                            key={`${rowIndex}-${colIndex}`}
                            className="rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
                            style={{ backgroundColor: `rgba(${baseColor}, ${bgOpacity})` }}
                          >
                            <span className={`text-lg font-bold z-10 ${finalTextColor}`}>
                              {cell}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* X-axis (Temperature) */}
          <div className="flex ml-10 mt-3 text-[10px] text-gray-400 font-semibold">
            <div className="flex-1 text-center">冷却</div>
            <div className="flex-1 text-center">低温</div>
            <div className="flex-1 text-center">中高温</div>
          </div>
        </div>

        {/* Manager Coaching Tip (Actionable Insight) */}
        <motion.div 
          key={`${activeCategory}-tip`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex gap-3"
        >
          <div className="mt-0.5 shrink-0">
            {tip.icon}
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-indigo-900 mb-1">{tip.title}</h4>
            <p className="text-[11px] text-indigo-700/80 leading-relaxed">
              {tip.content}
            </p>
          </div>
        </motion.div>
      </div>

      {/* 2. 客户质量卡片 (Customer Quality) */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">客户质量</h2>
            <div className="text-[10px] text-gray-400 mt-1">多维度评估客户资源价值与经营贡献</div>
          </div>
          <Award className="w-5 h-5 text-gray-300" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="col-span-2 grid grid-cols-2 gap-3"
            >
              {currentQuality.map((item, idx) => (
                <div key={idx} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span className="text-[12px] text-gray-500 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex items-center">
                    <div className={`w-1 h-1 rounded-full mr-1.5 ${item.color.replace('text-', 'bg-')}`} />
                    {item.subText}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. 客群分布卡片 (Demographic Detail) */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">客群分布</h2>
            <div className="text-[10px] text-gray-400 mt-1">基于 {activeCategory} 的多维度画像</div>
          </div>
          <Users className="w-5 h-5 text-gray-300" />
        </div>

        {/* View Switcher for Segments */}
        <div className="flex p-1 bg-gray-50 rounded-xl mb-6">
          <button 
            onClick={() => setSegmentsView('segments')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${segmentsView === 'segments' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
          >
            客户分群
          </button>
          <button 
            onClick={() => setSegmentsView('age')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${segmentsView === 'age' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
          >
            年龄分布
          </button>
          <button 
            onClick={() => setSegmentsView('occupation')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${segmentsView === 'occupation' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
          >
            职业分布
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${activeCategory}-${segmentsView}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-4"
            >
              {currentSegmentsData.map((seg, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[12px] text-gray-600 font-medium">{seg.label}</span>
                    <span className="text-[12px] text-gray-900 font-bold">{seg.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(seg.count / maxSegmentCount) * 100}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.02 }}
                      className={`${seg.color} h-full rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. 客户产品覆盖度卡片 (Product Coverage) */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">客户产品覆盖度</h2>
            <div className="text-[10px] text-gray-400 mt-1">分析各类保障在客户群中的渗透率与覆盖深度</div>
          </div>
          <PieChart className="w-5 h-5 text-gray-300" />
        </div>

        {/* View Switcher */}
        <div className="flex p-1 bg-gray-50 rounded-xl mb-6">
          <button 
            onClick={() => setProductView('liability')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${productView === 'liability' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
          >
            责任类型分布
          </button>
          <button 
            onClick={() => setProductView('design')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${productView === 'design' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
          >
            设计类型分布
          </button>
        </div>

        <div className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${activeCategory}-${productView}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Vertical Bar Chart Visualization - Fixed Visibility */}
              <div className="h-44 flex items-end justify-between gap-2 px-1 pt-6 border-b border-gray-50 pb-2">
                {currentProductData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Percentage Label */}
                    <motion.span 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[9px] font-bold text-gray-900 mb-1.5"
                    >
                      {item.percentage}%
                    </motion.span>
                    
                    {/* Bar Container to ensure height is relative to chart area */}
                    <div className="w-full flex-1 flex flex-col justify-end px-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.percentage / (maxProductPercentage || 1)) * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                        className={`${item.color} w-full rounded-t-md relative min-h-[2px] shadow-sm`}
                      >
                        {/* Hover Highlight */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-md" />
                      </motion.div>
                    </div>
                    
                    {/* Category Label */}
                    <span className="text-[10px] text-gray-500 mt-2 text-center whitespace-nowrap overflow-hidden w-full px-0.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Manager's Insight for Product Distribution */}
              <div className="mt-4 pt-2 flex items-start gap-2">
                <Target className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
                <p className="text-[10.5px] text-gray-500 leading-relaxed">
                  <span className="font-bold text-gray-700">主管洞察：</span>
                  {productView === 'liability' ? (
                    <>该代理人的客户在<span className="text-indigo-600 font-bold">{currentProductData[1]?.label || '重疾'}</span>领域覆盖较广，但在<span className="text-amber-600 font-bold">养老/财富</span>类产品的配置上仍有较大提升空间。</>
                  ) : (
                    <>客户持有产品以<span className="text-indigo-600 font-bold">{currentProductData.reduce((prev, current) => (prev.percentage > current.percentage) ? prev : current).label}</span>设计为主，建议结合当前市场环境，引导客户关注多元化产品形态。</>
                  )}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Activity className="w-8 h-8 opacity-20" />
      </div>
      <p className="text-sm font-medium">{title} 内容规划中...</p>
    </div>
  );
}

export default function AgentProfilePage({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('customers');
  const [showAllTabs, setShowAllTabs] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl flex flex-col relative pb-20">
        
        {/* Header & Profile Summary */}
        <div className="bg-white pt-12 pb-4 px-4 relative border-b border-gray-100">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <button onClick={onBack} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                {/* Avatar */}
                <div className="relative">
                  <img 
                    src="https://picsum.photos/seed/agent/200/200" 
                    alt="Agent" 
                    className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-lg shadow-sm border border-white">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>
                
                {/* Info */}
                <div className="ml-3 flex flex-col justify-center">
                  <div className="flex items-center flex-wrap mb-1.5 gap-y-1">
                    <span className="text-[18px] font-bold text-gray-900">张明远</span>
                    <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded">五星导师</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                    <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[11px] rounded border border-gray-100">入司8年</span>
                    <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[11px] rounded border border-gray-100">上海分公司</span>
                    <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[11px] rounded border border-gray-100">陆家嘴营业部</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks Bar */}
            <div className="mt-3 flex items-center bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-100/50">
              <span className="text-[12px] text-gray-400 shrink-0 mr-2">座右铭:</span>
              <div className="flex-1 text-[13px] text-gray-600 truncate">
                专业创造价值，服务连接未来。深耕寿险领域8年，专注于高净值家庭财富传承。
              </div>
              <button className="text-blue-500 ml-2">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="mt-4 grid grid-cols-4 gap-1 bg-gray-50 rounded-xl p-3">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[11px] text-gray-400 mb-1">综合评分</span>
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                  <span className="text-[13px] font-bold text-gray-700">4.9</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-gray-200/60">
                <span className="text-[11px] text-gray-400 mb-1">客户总数</span>
                <span className="text-[13px] font-bold text-indigo-600">1.2k</span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-gray-200/60">
                <span className="text-[11px] text-gray-400 mb-1">年度产能</span>
                <span className="text-[13px] font-bold text-emerald-600">MDRT</span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-gray-200/60">
                <span className="text-[11px] text-gray-400 mb-1">团队规模</span>
                <span className="text-[13px] font-bold text-amber-600">25人</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
          <div className="flex items-center relative">
            <div className="flex-1 flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pl-2 pr-10">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-3 text-[15px] relative whitespace-nowrap transition-colors ${
                    activeTab === tab.id ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
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
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowAllTabs(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-[13px] text-center transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100' 
                        : 'bg-gray-50 text-gray-600 font-medium border border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'customers' ? (
                <CustomerResourcesTab />
              ) : (
                <PlaceholderTab title={tabs.find(t => t.id === activeTab)?.label || ''} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

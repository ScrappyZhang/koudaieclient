import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Briefcase, Star } from 'lucide-react';

// 筛选数据类型
export interface FilterState {
  // 排序条件
  sortType?: string;
  // 客户分类
  customerValue?: string;
  customerCategory?: string;
  customerSegment?: string;
  vipLevel?: string;
  businessStage?: string;
  // 权益分类
  anYouYi?: string;
  anYouHu?: string;
  zhenXiangJiaYi?: string;
  pingAnJuJia?: string;
  yuXiangGuoYi?: string;
  siDongBaoJianYi?: string;
  gaoDuanKangYang?: string;
  // 客户信息
  gender?: string;
  birthdayRange?: string;
  birthdayStart?: string;
  birthdayEnd?: string;
  ageRange?: [number, number];
  maritalStatus?: string;
  education?: string;
  // 持有产品
  lifeInsuranceProduct?: string;
  productType?: string;
  productCategory?: string;
  propertyInsurance?: string;
  // 长险保单事件
  annualPremiumRange?: string;
  totalInsuredRange?: string;
  recentInsureTime?: string;
  // 短险保单事件
  prospectSource?: string;
  ztProductCategory?: string;
  vehiclePriceRange?: string;
}

// 筛选面板左侧菜单
const filterCategories = [
  '排序条件',
  '客户分类',
  '权益分类',
  '客户信息',
  '持有产品',
  '长险保单事件',
  '短险保单事件',
];

// 排序条件选项
const sortOptions = [
  ['按生日降序', '按生日升序'],
  ['按年龄降序', '按年龄升序'],
];

// 客户分类选项
const customerCategoryOptions = {
  '客户价值': ['A1类客户', 'A2类客户', 'A3类客户', 'A4类客户', 'B类客户', 'C类客户', 'D类客户', 'E类客户', 'F类客户'],
  '客户温度': ['高温', '中温', '低温', '冷却'],
  '客户分群': ['奋斗青年', '都市白领', '新晋父母', '社会中坚', '邻退天命', '慈爱祖辈', '创业新贵', '创富一代', '荣耀高堂', '承富二代', '已退小康'],
  '平安 VIP': ['平安 VIP 客户', '非平安 VIP 客户'],
  '寿险投被保人': ['仅投保人', '仅被保人', '投/被保人'],
  '存量客户类型': ['在职有效客户', '纯存续单客户'],
  '保单托管': ['已托管客户', '未托管客户'],
  '经营阶段': ['忠诚客户', '客户', '准客户', '用户'],
};

// 权益分类选项
const equityOptions = {
  '寿险 VIP': ['全部会员', '白银 1', '白银 2', '白银 3', '原黄金 VIP', '原铂金 VIP', '黄金 V1', '黄金 V2', '黄金 V3', '铂金 V1', '铂金 V2', '钻石 VIP', '金钻 VIP', '黑钻 VIP', '普客'],
  '安有医': ['易核版', '惠享版', '悦享版', '尊享版', '颐享版'],
  '安有护': ['安有护（国内版）', '安有护（国际版）'],
  '臻享家医': ['V1', 'V2', 'V3'],
  '平安居家': ['V1', 'V1优享', 'V2', 'V2优享'],
  '御享国医': ['御享国医'],
  '私董保健医': ['京华版', '繁华版'],
  '高端康养': ['逸享会员', '逸享plus会员', '颐享家会员', '臻享V1会员', '臻享V2会员'],
};

// 客户信息选项
const customerInfoOptions = {
  '性别': ['男', '女', '性别未知'],
  '客户生日': ['一周内生日', '一月内生日'],
  '年龄': 'slider',
  '婚姻状况': ['未婚', '已婚', '离婚', '丧偶', '未知'],
  '学历': ['大学专科', '大学本科', '硕士研究生', '博士研究生', '博士后', '中专', '高中', '小学以下'],
};

// 持有产品选项
const productOptions = {
  '寿险产品': ['金越司庆版', '盛世优享传统', '盛世优享', '御享分行25'],
  '持有产品类型': ['普通型', '分红型', '投资连结型', '万能型'],
  '持有产品类别': ['意外伤害保险', '医疗保险', '定期寿险', '两全保险', '年金保险', '终身寿险', '疾病保险', '护理保险'],
  '产险产品': ['车险', '非车险'],
};

// 长险保单事件选项
const longTermEventOptions = {
  '年缴保费': ['0-1000', '1000-5000', '5000-10000', '10000-50000', '50000以上'],
  '产品总保额': ['0-10万', '10万-50万', '50万-100万', '100万-500万', '500万以上'],
  '最近承保时间': ['一周内', '一月内', '三月内', '半年内', '一年内'],
};

// 短险保单事件选项
const shortTermEventOptions = {
  '准客来源': ['线上获客', '线下获客', '转介绍', '自主获客', '综拓获客', '团体获客'],
  '持有综拓产品类别': ['车险', '财产险', '责任险', '信用险', '保证险', '其他'],
  '车辆购置价': ['0-10万', '10万-30万', '30万-50万', '50万-100万', '100万以上'],
};

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

export default function FilterSheet({ visible, onClose, filters, onApply }: FilterSheetProps) {
  const [activeFilterCategory, setActiveFilterCategory] = useState('排序条件');
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const genderSectionRef = useRef<HTMLDivElement | null>(null);

  // 打开时同步筛选状态
  React.useEffect(() => {
    if (visible) {
      setTempFilters(filters);
      setActiveFilterCategory('排序条件');
    }
  }, [visible, filters]);

  // 滚动到指定分类
  const scrollToCategory = (category: string) => {
    setActiveFilterCategory(category);
    if (!contentScrollRef.current) return;
    const container = contentScrollRef.current;

    // 客户信息定位到性别字段
    if (category === '客户信息' && genderSectionRef.current) {
      const genderTop = genderSectionRef.current.offsetTop - container.offsetTop;
      container.scrollTo({
        top: genderTop - 8,
        behavior: 'smooth',
      });
      return;
    }

    const section = sectionRefs.current[category];
    if (section) {
      const sectionTop = section.offsetTop - container.offsetTop;
      container.scrollTo({
        top: sectionTop - 8,
        behavior: 'smooth',
      });
    }
  };

  // 监听滚动更新活跃分类
  const handleContentScroll = () => {
    if (!contentScrollRef.current) return;
    const container = contentScrollRef.current;
    const scrollTop = container.scrollTop;

    for (const category of filterCategories) {
      const section = sectionRefs.current[category];
      if (section) {
        const sectionTop = section.offsetTop - container.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollTop >= sectionTop - 20 && scrollTop < sectionBottom - 20) {
          setActiveFilterCategory(category);
          break;
        }
      }
    }
  };

  // 重置筛选
  const handleResetFilter = () => {
    setTempFilters({});
  };

  // 应用筛选
  const handleApplyFilter = () => {
    onApply(tempFilters);
    onClose();
  };

  // 获取已选筛选条件数量
  const getSelectedCount = () => {
    let count = 0;
    if (tempFilters.sortType) count++;
    if (tempFilters.customerCategory) count++;
    if (tempFilters.gender) count++;
    if (tempFilters.customerSegment) count++;
    if (tempFilters.vipLevel) count++;
    if (tempFilters.businessStage) count++;
    if (tempFilters.maritalStatus) count++;
    if (tempFilters.birthdayRange) count++;
    if (tempFilters.customerValue) count++;
    if (tempFilters.anYouYi) count++;
    if (tempFilters.anYouHu) count++;
    if (tempFilters.zhenXiangJiaYi) count++;
    if (tempFilters.pingAnJuJia) count++;
    if (tempFilters.yuXiangGuoYi) count++;
    if (tempFilters.siDongBaoJianYi) count++;
    if (tempFilters.gaoDuanKangYang) count++;
    return count;
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[80]"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl z-[90] overflow-hidden flex flex-col"
            style={{ height: '85vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-[18px] font-bold text-gray-900">全部筛选</h2>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Menu */}
              <div className="w-28 bg-gray-50 border-r border-gray-100 overflow-y-auto">
                {filterCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    className={`w-full px-4 py-3.5 text-[14px] font-medium text-left transition-colors ${
                      activeFilterCategory === category
                        ? 'bg-white text-gray-900 font-bold border-r-2 border-blue-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Right Content */}
              <div
                ref={contentScrollRef}
                onScroll={handleContentScroll}
                className="flex-1 overflow-y-auto px-4 py-4"
              >
                {/* 排序条件 */}
                <div ref={el => sectionRefs.current['排序条件'] = el}>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4">排序条件</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {sortOptions.flat().map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, sortType: tempFilters.sortType === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.sortType === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 客户分类 */}
                <div ref={el => sectionRefs.current['客户分类'] = el} className="mt-6">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4">客户价值</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {customerCategoryOptions['客户价值'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, customerValue: tempFilters.customerValue === option ? undefined : option })}
                        className={`py-3 px-3 rounded-xl text-[13px] font-medium transition-all ${
                          tempFilters.customerValue === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">客户温度</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerCategoryOptions['客户温度'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, customerCategory: tempFilters.customerCategory === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.customerCategory === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">客户分群</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerCategoryOptions['客户分群'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, customerSegment: tempFilters.customerSegment === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.customerSegment === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">经营阶段</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerCategoryOptions['经营阶段'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, businessStage: tempFilters.businessStage === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.businessStage === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">平安 VIP</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerCategoryOptions['平安 VIP'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters })}
                        className="py-3 px-4 rounded-xl text-[14px] font-medium bg-gray-50 text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">寿险投被保人</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerCategoryOptions['寿险投被保人'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters })}
                        className="py-3 px-4 rounded-xl text-[14px] font-medium bg-gray-50 text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">存量客户类型</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerCategoryOptions['存量客户类型'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters })}
                        className="py-3 px-4 rounded-xl text-[14px] font-medium bg-gray-50 text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">保单托管</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerCategoryOptions['保单托管'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters })}
                        className="py-3 px-4 rounded-xl text-[14px] font-medium bg-gray-50 text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 权益分类 */}
                <div ref={el => sectionRefs.current['权益分类'] = el} className="mt-6">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4">寿险 VIP</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {equityOptions['寿险 VIP'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, vipLevel: tempFilters.vipLevel === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.vipLevel === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">安有医</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {equityOptions['安有医'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, anYouYi: tempFilters.anYouYi === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.anYouYi === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">安有护</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {equityOptions['安有护'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, anYouHu: tempFilters.anYouHu === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.anYouHu === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">臻享家医</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {equityOptions['臻享家医'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, zhenXiangJiaYi: tempFilters.zhenXiangJiaYi === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.zhenXiangJiaYi === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">平安居家</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {equityOptions['平安居家'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, pingAnJuJia: tempFilters.pingAnJuJia === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.pingAnJuJia === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">御享国医</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {equityOptions['御享国医'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, yuXiangGuoYi: tempFilters.yuXiangGuoYi === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.yuXiangGuoYi === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">私董保健医</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {equityOptions['私董保健医'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, siDongBaoJianYi: tempFilters.siDongBaoJianYi === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.siDongBaoJianYi === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">高端康养</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {equityOptions['高端康养'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, gaoDuanKangYang: tempFilters.gaoDuanKangYang === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[13px] font-medium transition-all ${
                          tempFilters.gaoDuanKangYang === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 客户信息 */}
                <div ref={el => sectionRefs.current['客户信息'] = el} className="mt-6">
                  <div ref={genderSectionRef}>
                    <h3 className="text-[15px] font-bold text-gray-900 mb-4">性别</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {customerInfoOptions['性别'].map(option => (
                        <button
                          key={option}
                          onClick={() => setTempFilters({ ...tempFilters, gender: tempFilters.gender === option ? undefined : option })}
                          className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                            tempFilters.gender === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">客户生日</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerInfoOptions['客户生日'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, birthdayRange: tempFilters.birthdayRange === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.birthdayRange === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="text-[13px] text-gray-500 mb-2">自定义月日范围</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="起始月日"
                        className="flex-1 py-2 px-3 rounded-lg border border-gray-200 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500"
                        value={tempFilters.birthdayStart || ''}
                        onChange={(e) => setTempFilters({ ...tempFilters, birthdayStart: e.target.value })}
                      />
                      <span className="text-gray-400 text-sm">至</span>
                      <input
                        type="text"
                        placeholder="截止月日"
                        className="flex-1 py-2 px-3 rounded-lg border border-gray-200 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500"
                        value={tempFilters.birthdayEnd || ''}
                        onChange={(e) => setTempFilters({ ...tempFilters, birthdayEnd: e.target.value })}
                      />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">年龄</h3>
                  <div className="px-2">
                    <div className="flex items-center justify-between text-[12px] text-gray-500 mb-2">
                      <span>0</span>
                      <span>100</span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full">
                      <div className="w-1/3 h-full bg-blue-600 rounded-full relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">婚姻状况</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerInfoOptions['婚姻状况'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, maritalStatus: tempFilters.maritalStatus === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.maritalStatus === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">学历</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {customerInfoOptions['学历'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, education: tempFilters.education === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.education === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 持有产品 */}
                <div ref={el => sectionRefs.current['持有产品'] = el} className="mt-6">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4">寿险产品</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {productOptions['寿险产品'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, lifeInsuranceProduct: tempFilters.lifeInsuranceProduct === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.lifeInsuranceProduct === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">持有产品类型</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {productOptions['持有产品类型'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, productType: tempFilters.productType === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.productType === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">持有产品类别</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {productOptions['持有产品类别'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, productCategory: tempFilters.productCategory === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.productCategory === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">产险产品</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {productOptions['产险产品'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, propertyInsurance: tempFilters.propertyInsurance === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.propertyInsurance === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 长险保单事件 */}
                <div ref={el => sectionRefs.current['长险保单事件'] = el} className="mt-6">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4">年缴保费</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {longTermEventOptions['年缴保费'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, annualPremiumRange: tempFilters.annualPremiumRange === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.annualPremiumRange === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">产品总保额</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {longTermEventOptions['产品总保额'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, totalInsuredRange: tempFilters.totalInsuredRange === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.totalInsuredRange === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">最近承保时间</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {longTermEventOptions['最近承保时间'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters })}
                        className="py-3 px-4 rounded-xl text-[14px] font-medium bg-gray-50 text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 短险保单事件 */}
                <div ref={el => sectionRefs.current['短险保单事件'] = el} className="mt-6">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4">准客来源</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {shortTermEventOptions['准客来源'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters })}
                        className="py-3 px-4 rounded-xl text-[14px] font-medium bg-gray-50 text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">持有综拓产品类别</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {shortTermEventOptions['持有综拓产品类别'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters })}
                        className="py-3 px-4 rounded-xl text-[14px] font-medium bg-gray-50 text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-4 mt-6">车辆购置价</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {shortTermEventOptions['车辆购置价'].map(option => (
                      <button
                        key={option}
                        onClick={() => setTempFilters({ ...tempFilters, vehiclePriceRange: tempFilters.vehiclePriceRange === option ? undefined : option })}
                        className={`py-3 px-4 rounded-xl text-[14px] font-medium transition-all ${
                          tempFilters.vehiclePriceRange === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 px-4 py-4 border-t border-gray-100 pb-safe">
              <button
                onClick={handleResetFilter}
                className="flex-1 py-3 rounded-full border border-gray-300 text-gray-700 font-bold text-[15px] hover:bg-gray-50 transition-colors"
              >
                重置
              </button>
              <button
                onClick={handleApplyFilter}
                className="flex-1 py-3 rounded-full bg-blue-600 text-white font-bold text-[15px] hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                确定
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// 导出筛选选项用于外部显示计数等
export { filterCategories, sortOptions, customerCategoryOptions, equityOptions, customerInfoOptions, productOptions, longTermEventOptions, shortTermEventOptions };
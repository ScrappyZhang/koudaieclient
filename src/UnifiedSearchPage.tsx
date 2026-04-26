import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Search, Trash2, Mic, Camera, FileText, Sparkles, Users, Package, LayoutGrid, BookOpen, Bot, ChevronRight, Phone, Clock, TrendingUp, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { customers } from './data';
import CustomerDetailPage from './CustomerDetailPage';
import AIChatPage from './AIChatPage';

type SearchCategory = '全部' | '客户' | '产品' | '功能' | '资讯';
type SearchState = 'initial' | 'typing' | 'results';

const mockProducts = [
  { id: 1, name: 'e生保·惠享版', category: '医疗险', price: '¥299/年', tags: ['热销', '高性价比'], desc: '最高400万医疗保障，住院医疗全覆盖' },
  { id: 2, name: '平安福·2024版', category: '重疾险', price: '¥5000/年', tags: ['旗舰产品'], desc: '120种重疾+60种轻疾，终身保障' },
  { id: 3, name: '百万医疗险', category: '医疗险', price: '¥168/年', tags: ['爆款'], desc: '百万医疗保障，看病不愁钱' },
  { id: 4, name: '少儿平安福', category: '重疾险', price: '¥3000/年', tags: ['少儿专属'], desc: '专为0-17岁儿童设计，守护孩子成长' },
  { id: 5, name: '养老社区计划', category: '养老险', price: '¥800/月', tags: ['养老规划'], desc: '享高品质养老社区入住权益' },
];

const mockFunctions = [
  { id: 1, name: '掌上保', category: '业务办理', desc: '在线投保、保单查询' },
  { id: 2, name: 'E服务', category: '客户服务', desc: '在线理赔、保单变更' },
  { id: 3, name: '面访扫码', category: '客户管理', desc: '面访签到、访后记录' },
  { id: 4, name: '客户AI搜索', category: '智能工具', desc: '一句话找到目标客户' },
  { id: 5, name: '新建客户', category: '客户管理', desc: '添加新客户资料' },
  { id: 6, name: '保单检视', category: '业务工具', desc: '保单缺口分析' },
  { id: 7, name: '场景活动', category: '经营工具', desc: '活动报名、邀约管理' },
];

const mockArticles = [
  { id: 1, title: '2025年保险行业趋势解读', category: '行业动态', time: '2025-01-15', views: 1256 },
  { id: 2, title: '如何为客户制定养老规划', category: '销售技巧', time: '2025-01-12', views: 892 },
  { id: 3, title: '重疾险理赔案例分析', category: '理赔知识', time: '2025-01-10', views: 756 },
  { id: 4, title: '代理人高效面访技巧', category: '销售技巧', time: '2025-01-08', views: 543 },
];

export default function UnifiedSearchPage({ onBack, onAskBob }: { onBack: () => void; onAskBob?: () => void }) {
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('全部');
  const [searchValue, setSearchValue] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('initial');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [deepSearch, setDeepSearch] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['曹嘉玲', '王建国', '医疗险', '保单', '养老规划', '面访']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchValue.length > 0) {
      setSearchState('typing');
    } else {
      setSearchState('initial');
    }
  }, [searchValue]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (query?: string) => {
    const finalQuery = query || searchValue;
    if (!finalQuery.trim()) return;

    // Add to history
    setRecentSearches(prev => [finalQuery, ...prev.filter(s => s !== finalQuery)].slice(0, 10));

    setSearchState('results');
  };

  const handleQuickSearch = (query: string) => {
    setSearchValue(query);
    handleSearch(query);
  };

  const clearHistory = () => {
    setRecentSearches([]);
  };

  // Filter results based on search value and category
  const getFilteredResults = () => {
    const q = searchValue.toLowerCase();

    const customerResults = customers.filter(c =>
      c.name.includes(q) || (c.phone && c.phone.includes(q)) || (c.customerType && c.customerType.toLowerCase().includes(q))
    );

    const productResults = mockProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.desc.includes(q)
    );

    const functionResults = mockFunctions.filter(f =>
      f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.desc.includes(q)
    );

    const articleResults = mockArticles.filter(a =>
      a.title.includes(q) || a.category.includes(q)
    );

    return { customerResults, productResults, functionResults, articleResults };
  };

  if (showAIChat) {
    return <AIChatPage onBack={() => setShowAIChat(false)} />;
  }

  if (selectedCustomerId !== null) {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    return <CustomerDetailPage customer={selectedCustomer} onBack={() => setSelectedCustomerId(null)} />;
  }

  const { customerResults, productResults, functionResults, articleResults } = getFilteredResults();

  // Count results by category
  const counts = {
    '全部': customerResults.length + productResults.length + functionResults.length + articleResults.length,
    '客户': customerResults.length,
    '产品': productResults.length,
    '功能': functionResults.length,
    '资讯': articleResults.length,
  };

  return (
    <div className="min-h-screen bg-white flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-x-hidden">

        {/* Header - Search Input in same row with back button */}
        <div className="sticky top-0 z-50 bg-white px-4 py-3">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-600">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2 ml-2">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜客户、资讯、产品、系统功能..."
                className="flex-1 bg-transparent outline-none text-[15px] text-gray-800 placeholder:text-gray-400"
              />
              {searchValue && (
                <button onClick={() => setSearchValue('')} className="p-1">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Action icons below search box - aligned with input */}
          <div className="flex items-center justify-between py-2 ml-10 border-b border-gray-100">
            <div className="flex items-center">
              {/* 深度思考 */}
              <button
                onClick={() => setDeepSearch(!deepSearch)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors text-[12px] ${
                  deepSearch
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border ${deepSearch ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                  {deepSearch && <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5" />}
                </div>
                <span>深度思考</span>
              </button>
              <div className="w-px h-4 bg-gray-200 mx-2"></div>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                <Camera className="w-4.5 h-4.5" />
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                <FileText className="w-4.5 h-4.5" />
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                <Mic className="w-4.5 h-4.5" />
              </button>
            </div>
            <button
              onClick={() => setShowAIChat(true)}
              className="flex items-center px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg border border-indigo-100"
            >
              <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center mr-1">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <span className="text-[12px] text-indigo-600 font-medium">问Bob</span>
              <ExternalLink className="w-3 h-3 ml-0.5 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {searchState === 'initial' && (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 py-4 space-y-5"
              >
                {/* 最近在搜 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span className="text-[14px] font-bold">最近在搜</span>
                    </div>
                    {recentSearches.length > 0 && (
                      <button onClick={clearHistory} className="text-gray-400 text-[12px]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {recentSearches.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleQuickSearch(tag)}
                          className="px-4 py-2 bg-gray-50 text-gray-600 text-[13px] rounded-full hover:bg-gray-100 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-gray-400">暂无搜索记录</p>
                  )}
                </div>

                {/* 搜索发现 */}
                <div>
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-4 h-4 mr-1.5 text-orange-500" />
                    <span className="text-[14px] font-bold text-gray-700">搜索发现</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: '本月生日的客户', hot: true },
                      { label: '高温待触客户', hot: true },
                      { label: '医疗险产品', hot: false },
                      { label: '保单检视工具', hot: false },
                      { label: '养老规划资讯', hot: false },
                      { label: '理赔案例', hot: false },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickSearch(item.label)}
                        className="flex items-center px-3 py-2.5 bg-gray-50 rounded-xl text-[13px] text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {item.hot && <span className="text-orange-500 font-bold mr-1 text-[10px]">热</span>}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {(searchState === 'typing' || searchState === 'results') && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pb-20"
              >
                {/* Category Filter Tabs */}
                <div className="flex px-4 py-2 border-b border-gray-100 sticky top-0 bg-white z-10">
                  {(Object.keys(counts) as SearchCategory[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-1 py-2 text-[13px] font-medium text-center transition-colors ${
                        activeCategory === cat
                          ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {cat}
                      <span className={`ml-1 text-[11px] ${activeCategory === cat ? 'text-blue-500' : 'text-gray-400'}`}>
                        ({counts[cat]})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Results */}
                <div className="px-4 py-3 space-y-3">
                  {/* Customer Results */}
                  {(activeCategory === '全部' || activeCategory === '客户') && customerResults.length > 0 && (
                    <div className="space-y-3">
                      {activeCategory === '全部' && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[12px] text-gray-400 font-medium">客户</span>
                          <button onClick={() => setActiveCategory('客户')} className="text-[12px] text-blue-500">
                            更多 <ChevronRight className="w-3 h-3 inline" />
                          </button>
                        </div>
                      )}
                      {customerResults.slice(0, activeCategory === '全部' ? 3 : customerResults.length).map(customer => (
                        <div
                          key={customer.id}
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-200 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex">
                              {/* Avatar */}
                              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-blue-500 text-white flex items-center justify-center text-base font-medium mr-3 mt-0.5">
                                {customer.isImage ? (
                                  <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  customer.avatar
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex flex-col justify-center">
                                <div className="flex items-center flex-wrap mb-1.5 gap-y-1">
                                  <span className="text-[16px] font-bold text-gray-900">{customer.name}</span>
                                  {/* Gender & Age */}
                                  <div className={`ml-2 px-1.5 py-0.5 rounded text-[10px] flex items-center font-medium ${customer.gender === 'M' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>
                                    {customer.gender === 'M' ? '♂' : '♀'} {customer.age}岁
                                  </div>
                                  {/* Marital Status */}
                                  {customer.maritalStatus && (
                                    <div className="ml-1.5 px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 text-[10px] font-medium">
                                      {customer.maritalStatus}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center flex-wrap mt-1.5 text-[11px] text-gray-500">
                                  {[customer.customerType, customer.temperature, customer.value, customer.vipLevel, customer.serviceLevel]
                                    .filter(Boolean)
                                    .map((tag, index, array) => (
                                      <div key={index} className="flex items-center">
                                        <span>{tag}</span>
                                        {index < array.length - 1 && <span className="mx-1.5 text-gray-300">|</span>}
                                      </div>
                                    ))}
                                </div>

                                {/* Remark */}
                                {customer.remark && (
                                  <div className="mt-2 pt-2 border-t border-gray-50">
                                    <p className="text-[13px] text-gray-500 line-clamp-2">
                                      <span className="text-gray-400 mr-1">备注:</span>
                                      {customer.remark}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Contact Button */}
                            <button className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-100 transition-colors text-[12px] font-medium">
                              <Phone className="w-3.5 h-3.5 mr-1" />
                              联系TA
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Product Results */}
                  {(activeCategory === '全部' || activeCategory === '产品') && productResults.length > 0 && (
                    <div className="space-y-2">
                      {activeCategory === '全部' && (
                        <div className="flex items-center justify-between mb-2 pt-2">
                          <span className="text-[12px] text-gray-400 font-medium">产品</span>
                          <button onClick={() => setActiveCategory('产品')} className="text-[12px] text-blue-500">
                            更多 <ChevronRight className="w-3 h-3 inline" />
                          </button>
                        </div>
                      )}
                      {productResults.slice(0, activeCategory === '全部' ? 2 : productResults.length).map(product => (
                        <div
                          key={product.id}
                          className="bg-gray-50 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[15px] font-bold text-gray-900">{product.name}</span>
                              <span className="ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] rounded-full">{product.category}</span>
                            </div>
                            <span className="text-[13px] font-bold text-emerald-600">{product.price}</span>
                          </div>
                          <p className="text-[12px] text-gray-500 mt-1">{product.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Function Results */}
                  {(activeCategory === '全部' || activeCategory === '功能') && functionResults.length > 0 && (
                    <div className="space-y-2">
                      {activeCategory === '全部' && (
                        <div className="flex items-center justify-between mb-2 pt-2">
                          <span className="text-[12px] text-gray-400 font-medium">功能</span>
                          <button onClick={() => setActiveCategory('功能')} className="text-[12px] text-blue-500">
                            更多 <ChevronRight className="w-3 h-3 inline" />
                          </button>
                        </div>
                      )}
                      {functionResults.slice(0, activeCategory === '全部' ? 2 : functionResults.length).map(func => (
                        <div
                          key={func.id}
                          className="bg-gray-50 p-3 rounded-xl flex items-center cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mr-3">
                            <LayoutGrid className="w-5 h-5 text-purple-500" />
                          </div>
                          <div className="flex-1">
                            <span className="text-[15px] font-bold text-gray-900">{func.name}</span>
                            <p className="text-[12px] text-gray-500 mt-0.5">{func.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Article Results */}
                  {(activeCategory === '全部' || activeCategory === '资讯') && articleResults.length > 0 && (
                    <div className="space-y-2">
                      {activeCategory === '全部' && (
                        <div className="flex items-center justify-between mb-2 pt-2">
                          <span className="text-[12px] text-gray-400 font-medium">资讯</span>
                          <button onClick={() => setActiveCategory('资讯')} className="text-[12px] text-blue-500">
                            更多 <ChevronRight className="w-3 h-3 inline" />
                          </button>
                        </div>
                      )}
                      {articleResults.slice(0, activeCategory === '全部' ? 2 : articleResults.length).map(article => (
                        <div
                          key={article.id}
                          className="bg-gray-50 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-[14px] font-bold text-gray-900">{article.title}</span>
                          <div className="flex items-center mt-2 text-[11px] text-gray-400">
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-500 rounded-full mr-2">{article.category}</span>
                            <span>{article.time}</span>
                            <span className="ml-2">{article.views}阅读</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {counts[activeCategory] === 0 && (
                    <div className="py-12 text-center text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-[14px]">未找到相关结果</p>
                      <p className="text-[12px] mt-2">换个关键词试试</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
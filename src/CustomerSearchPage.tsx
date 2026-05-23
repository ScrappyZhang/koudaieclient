import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Trash2, Mic, Sparkles, ChevronDown, ChevronUp, Phone, Edit3, Plus, Cake, MessageSquare, MoreHorizontal, CheckCircle2, Info, X, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { customers } from './data';
import CustomerDetailPage from './CustomerDetailPage';
import FilterSheet, { FilterState } from './FilterSheet';

type SearchState = 'initial' | 'typing' | 'understanding' | 'results' | 'unrecognized';

export default function CustomerSearchPage({ onBack }: { onBack: () => void }) {
  const [searchValue, setSearchValue] = useState('');
  const [isAISearch, setIsAISearch] = useState(true);
  const [searchState, setSearchState] = useState<SearchState>('initial');
  const [showAIReasoning, setShowAIReasoning] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('请说话...');
  const [feedbackState, setFeedbackState] = useState<'none' | 'accurate' | 'inaccurate' | 'submitted'>('none');
  const [customFeedback, setCustomFeedback] = useState('');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [individualFeedback, setIndividualFeedback] = useState<Record<number, boolean>>({});
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [showAITip, setShowAITip] = useState(() => {
    // 首次进入时显示提示，用户关闭后不再显示
    const hasSeenTip = localStorage.getItem('customer_search_ai_tip_seen');
    return !hasSeenTip;
  });

  // 关闭提示并记住
  const closeAITip = () => {
    setShowAITip(false);
    localStorage.setItem('customer_search_ai_tip_seen', 'true');
  };

  // Helper to highlight matching text
  const highlightText = (text: string | number | undefined, query: string) => {
    if (!text || !query) return <span>{text}</span>;
    const str = String(text);
    
    // Build a list of specific data keywords to look for in the query
    const dataKeywords = ['寿险客户', '准客', '用户', '已婚', '未婚', '高温', '中温', '低温', '冷却', '铂金', '黄金', '白银', '黑钻'];
    
    const activeKeywords: string[] = [];

    // 1. Check for specific data keywords in the query
    dataKeywords.forEach(k => {
      if (query.includes(k)) activeKeywords.push(k);
    });

    // 2. Extract month numbers if "X月" is in the query
    const monthMatch = query.match(/(\d+)月/);
    if (monthMatch) {
      const monthNum = monthMatch[1];
      const paddedMonth = monthNum.padStart(2, '0');
      // Only add to active keywords if they exist in the current string to avoid over-highlighting
      // Actually, we add them to the regex list
      activeKeywords.push(paddedMonth);
      if (monthNum !== paddedMonth) activeKeywords.push(monthNum);
    }

    // 3. Extract age numbers if "X岁" is in the query
    const ageMatch = query.match(/(\d+)岁/);
    if (ageMatch) {
      activeKeywords.push(ageMatch[1]);
    }

    // 4. Handle specific names or other query terms
    // If the query contains words that are not data keywords, try to find them in the text
    const queryWords = query.split(/[\s，。、叫的]+/).filter(w => w.length >= 2);
    queryWords.forEach(word => {
      if (!dataKeywords.includes(word) && !activeKeywords.includes(word)) {
        activeKeywords.push(word);
      }
    });
    
    // 5. Fallback: if no keywords matched yet, use the whole query if it's not too long
    if (activeKeywords.length === 0 && query.length >= 2 && query.length <= 10) {
      activeKeywords.push(query);
    }
    
    // Escape keywords for regex and filter out empty/duplicates
    const uniqueKeywords = Array.from(new Set(activeKeywords))
      .filter(k => k.length > 0)
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      
    if (uniqueKeywords.length === 0) return <span>{text}</span>;

    // Match any of the active keywords
    // Use word boundaries or specific logic if needed, but for Chinese/mixed text, simple regex is usually okay
    const regex = new RegExp(`(${uniqueKeywords.join('|')})`, 'gi');
    const parts = str.split(regex);
    
    return (
      <span>
        {parts.map((part, i) => 
          uniqueKeywords.some(k => new RegExp(`^${k}$`, 'i').test(part))
            ? <span key={i} className="bg-blue-100 text-blue-700 rounded-sm px-0.5 font-bold">{part}</span> 
            : part
        )}
      </span>
    );
  };

  // Helper to get AI matched dynamic fields
  const getMatchedDynamicFields = (customer: any, query: string) => {
    const matches: { label: string; value: any; key: string }[] = [];
    const q = query.toLowerCase();

    // Check remark
    if (customer.remark && (customer.remark.toLowerCase().includes(q) || q.includes('重疾') || q.includes('养老'))) {
      matches.push({ label: '备注匹配', value: customer.remark, key: 'remark' });
    }

    // Check birthday intent
    if (q.includes('生日') || q.includes('月')) {
      if (customer.birthday) {
        matches.push({ label: '生日匹配', value: customer.birthday, key: 'birthday' });
      }
    }

    // Check age intent (e.g., "45岁以上")
    if (q.includes('岁') || q.includes('以上') || q.includes('以下')) {
      const ageMatch = q.match(/(\d+)/);
      if (ageMatch) {
        const targetAge = parseInt(ageMatch[1]);
        if (q.includes('以上') && customer.age >= targetAge) {
          matches.push({ label: '年龄匹配', value: `符合 ${targetAge}岁以上 条件`, key: 'age_match' });
        } else if (q.includes('以下') && customer.age <= targetAge) {
          matches.push({ label: '年龄匹配', value: `符合 ${targetAge}岁以下 条件`, key: 'age_match' });
        }
      }
    }

    // Check badge
    if (customer.badge && (customer.badge.toLowerCase().includes(q) || q.includes('14岁'))) {
      matches.push({ label: '特征匹配', value: customer.badge, key: 'badge' });
    }

    // Check family members
    if (customer.familyMembers) {
      customer.familyMembers.forEach((member: any, index: number) => {
        if (q.includes(member.name.toLowerCase()) || q.includes(member.relationship.toLowerCase())) {
          matches.push({ 
            label: '家庭成员匹配', 
            value: `${member.relationship}：${member.name} (${member.age}岁) ${member.phone}`, 
            key: `family_${index}` 
          });
        }
      });
    }

    return matches;
  };

  const aiRecentSearches = [
    '配偶叫曹雪芹的客户', '2月生日的寿险客户', '张三丰', '焦虑中年',
    '万能险客户', '30至35岁的A1客户', 'B类以上 40岁以上', '王建国'
  ];

  const simpleRecentSearches = [
    '王建国', '13812345678', '882024040101', '张三', '15911012345'
  ];

  const recentSearches = isAISearch ? aiRecentSearches : simpleRecentSearches;

  const popularSearches = [
    '未来一个月生日的客户', 'ABC类中高温客户', '万能险客户'
  ];

  const suggestions = [
    '下月过生日的客户',
    '下月过生日的A类客户',
    '下月身份证过期的客户'
  ];

  useEffect(() => {
    if (searchValue.length > 0 && searchState === 'initial' && isAISearch) {
      setSearchState('typing');
    } else if (searchValue.length === 0) {
      setSearchState('initial');
    }
  }, [searchValue, isAISearch]);

  // Auto-trigger search when AI toggle is switched in results or unrecognized state
  useEffect(() => {
    if (searchValue && (searchState === 'results' || searchState === 'unrecognized' || searchState === 'understanding')) {
      handleSearch();
    }
  }, [isAISearch]);

  const handleSearch = (query?: string) => {
    const finalQuery = query || searchValue;
    if (!finalQuery) return;
    
    if (isAISearch) {
      setSearchState('understanding');
    }
    
    // Simulate search process
    setTimeout(() => {
      const q = finalQuery.toLowerCase();
      let results = [...customers];

      if (isAISearch) {
        // AI Search: Intent + Keywords
        const hasMonth = q.match(/(\d+)月/);
        const hasCustomerType = q.includes('寿险客户') || q.includes('准客');
        const hasAgeFilter = q.includes('岁') && (q.includes('以上') || q.includes('以下'));
        
        const familyKeywords = ['配偶', '妻子', '丈夫', '儿子', '女儿', '孩子', '曹雪芹', '王芳'];
        const foundFamilyKeywords = familyKeywords.filter(k => q.includes(k));
        const hasFamilyFilter = foundFamilyKeywords.length > 0;

        // Unrecognized scenario
        if (q.includes('哈哈') || q.includes('!!!') || (q.length < 2 && !q.match(/[0-9]/))) {
          setSearchState('unrecognized');
          return;
        }

        // Apply filters only if they are clearly intended
        if (hasMonth) {
          const monthNum = hasMonth[1].padStart(2, '0');
          results = results.filter(c => c.birthday && c.birthday.split('-')[1] === monthNum);
        }

        if (q.includes('寿险客户')) {
          results = results.filter(c => c.customerType === '寿险客户');
        } else if (q.includes('准客')) {
          results = results.filter(c => c.customerType === '准客');
        }

        if (hasAgeFilter) {
          const ageMatch = q.match(/(\d+)/);
          if (ageMatch) {
            const targetAge = parseInt(ageMatch[1]);
            if (q.includes('以上')) {
              results = results.filter(c => c.age >= targetAge);
            } else if (q.includes('以下')) {
              results = results.filter(c => c.age <= targetAge);
            }
          }
        }

        if (hasFamilyFilter) {
          // In AI mode, if family keyword found, find both direct name matches AND family relationship matches
          results = results.filter(c => 
            c.name.includes(q) || 
            (c.remark && c.remark.includes(q)) ||
            (c.familyMembers && c.familyMembers.some((m: any) => 
              foundFamilyKeywords.some(k => m.name.includes(k) || m.relationship.includes(k))
            ))
          );
        } else if (q.length > 0 && !hasMonth && !hasCustomerType && !hasAgeFilter) {
          // General keyword search
          results = results.filter(c => 
            c.name.includes(q) || 
            (c.remark && c.remark.includes(q)) ||
            (c.phone && c.phone.includes(q)) ||
            (c.policyNumber && c.policyNumber.includes(q))
          );
        }

        if (results.length === 0) {
          setSearchState('unrecognized');
          return;
        }
      } else {
        // Non-AI Search: Simple keyword matching only
        if (q.length > 0) {
          results = results.filter(c => 
            c.name.includes(q) || 
            (c.remark && c.remark.includes(q)) ||
            (c.phone && c.phone.includes(q)) ||
            (c.policyNumber && c.policyNumber.includes(q))
          );
        }
      }

      setFilteredCustomers(results);
      setSearchState('results');
    }, isAISearch ? 1500 : 300);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    handleSearch(suggestion);
  };

  const startRecording = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsRecording(true);
    setRecordingText('正在听...');
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    // Simulate voice to text
    const simulatedText = '下月过生日的A类客户';
    setSearchValue(simulatedText);
    handleSearch(simulatedText);
  };

  if (selectedCustomerId !== null) {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    return <CustomerDetailPage customer={selectedCustomer} onBack={() => setSelectedCustomerId(null)} />;
  }

  return (
    <div className="min-h-screen bg-white flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-x-hidden">
        
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-50 bg-white">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-800">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-[17px] font-bold text-gray-900 ml-1">客户搜索</h1>
          </div>
        </div>

        {/* Search Box */}
        <div className="px-4 pt-2 pb-4">
          <div className="relative border-2 border-blue-500 rounded-xl p-2.5 bg-white shadow-[0_4px_12px_rgba(59,130,246,0.1)] transition-all">
            <textarea
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={isAISearch ? "一句话描述你要找的客户，姓名/手机/保单号" : "仅支持搜索姓名/手机号/保单号/客户号"}
              className="w-full h-10 resize-none outline-none text-[15px] text-gray-800 placeholder-gray-300 leading-tight"
            />
            <div className="flex justify-between items-center mt-1">
              {/* AI Toggle */}
              <motion.div
                onClick={() => {
                  setIsAISearch(!isAISearch);
                  if (showAITip) closeAITip();
                }}
                animate={showAITip ? {
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0)',
                    '0 0 0 8px rgba(59, 130, 246, 0.3)',
                    '0 0 0 0 rgba(59, 130, 246, 0)'
                  ]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center space-x-2 cursor-pointer group rounded-lg px-1 py-1 -mx-1"
              >
                <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${isAISearch ? 'bg-blue-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-200 ${isAISearch ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className={`text-[12px] font-bold transition-colors ${isAISearch ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                  AI 搜索
                </span>
                {isAISearch && <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />}
              </motion.div>

              <button
                onClick={() => handleSearch()}
                className="bg-blue-600 text-white px-6 py-1.5 rounded-lg text-[14px] font-medium shadow-md active:scale-95 transition-transform"
              >
                搜索
              </button>
            </div>
          </div>

          {/* AI 搜索提示气泡 */}
          <AnimatePresence>
            {showAITip && searchState === 'initial' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="relative mt-1 flex justify-start"
              >
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl px-3 py-2 text-white shadow-lg inline-flex relative"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                    <p className="text-[13px] text-white/90">
                      点击此处可<span className="font-bold text-white">开启或关闭AI搜索</span>
                    </p>
                    <button
                      onClick={closeAITip}
                      className="text-white/70 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* 气泡尖角指向 AI 开关 */}
                  <motion.div
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-1.5 left-8"
                  >
                    <div className="w-2.5 h-2.5 bg-blue-500 rotate-45 transform origin-center"></div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {searchState === 'initial' && (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 space-y-6"
              >
                {/* Recent Searches */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[14px] font-bold text-gray-400">最近在搜</h2>
                    <button className="text-gray-300 hover:text-gray-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(tag => (
                      <button 
                        key={tag}
                        onClick={() => handleSuggestionClick(tag)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 text-[13px] rounded-full hover:bg-gray-100 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Searches */}
                {isAISearch && (
                  <div>
                    <h2 className="text-[14px] font-bold text-gray-400 mb-3">大家在搜</h2>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map(tag => (
                        <button 
                          key={tag}
                          onClick={() => handleSuggestionClick(tag)}
                          className="px-4 py-2 bg-gray-50 text-gray-600 text-[13px] rounded-full hover:bg-gray-100 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Button */}
                {isAISearch && (
                  <div className="flex justify-center pt-8">
                    <button 
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onMouseLeave={stopRecording}
                      onTouchStart={startRecording}
                      onTouchEnd={stopRecording}
                      className={`flex items-center space-x-2 px-8 py-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-50 transition-all duration-200 select-none ${
                        isRecording ? 'bg-blue-500 text-white scale-110 shadow-blue-200' : 'bg-white text-gray-800 active:scale-95'
                      }`}
                    >
                      <Mic className={`w-6 h-6 ${isRecording ? 'text-white' : 'text-blue-500'}`} />
                      <span className="text-[16px] font-bold">按住语音输入</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {searchState === 'typing' && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full text-left py-4 border-b border-gray-50 flex items-center group"
                  >
                    <span className="text-blue-500 mr-1">{searchValue}</span>
                    <span className="text-gray-700">{s.replace(searchValue, '')}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {searchState === 'understanding' && (
              <motion.div
                key="understanding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4"
              >
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-blue-600 font-bold text-[14px]">
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      正在理解用户搜索意图
                    </div>
                    <ChevronUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[13px] text-gray-500">我理解你的意图是：</p>
                    {searchValue.includes('2月') && <p className="text-[14px] text-gray-700 font-medium">· 2026年2月生日的客户</p>}
                    {searchValue.includes('寿险客户') && <p className="text-[14px] text-gray-700 font-medium">· 并且客户类型为寿险客户</p>}
                    {searchValue.includes('45岁以上') && <p className="text-[14px] text-gray-700 font-medium">· 并且年龄在45岁以上</p>}
                    {searchValue.includes('配偶') && <p className="text-[14px] text-gray-700 font-medium">· 并且配偶信息匹配</p>}
                    {searchValue.includes('曹雪芹') && <p className="text-[14px] text-gray-700 font-medium">· 并且家庭成员姓名包含“曹雪芹”</p>}
                    {(!searchValue.includes('2月') && !searchValue.includes('寿险客户') && !searchValue.includes('45岁以上') && !searchValue.includes('配偶') && !searchValue.includes('曹雪芹')) && (
                      <div className="flex flex-col space-y-1">
                        <p className="text-[14px] text-gray-700 font-medium italic">· 识别中，意图暂不明确...</p>
                        <p className="text-[12px] text-blue-400">将尝试进行全文关键词检索: "{searchValue}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {searchState === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full"
              >
                {/* AI Completion Header */}
                {isAISearch && (
                  <div className="px-4 mb-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-50">
                      <div className="flex items-center text-blue-600 font-bold text-[14px]">
                        <Sparkles className="w-4 h-4 mr-2" />
                        搜索已完成
                      </div>
                      <button 
                        onClick={() => setSearchState('understanding')}
                        className="text-blue-500"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-col mt-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-[13px]">共找到 <span className="text-blue-600 font-bold">{filteredCustomers.length}</span> 个客户</span>
                        
                        <div className="flex items-center space-x-3">
                          {(feedbackState === 'none' || feedbackState === 'inaccurate') && (
                            <>
                              <span className="text-[12px] text-gray-400">结果准确吗？</span>
                              <div className="flex items-center bg-gray-50 rounded-lg p-0.5">
                                <button 
                                  onClick={() => setFeedbackState('submitted')}
                                  className="px-3 py-1 text-[11px] text-gray-600 hover:text-blue-600 hover:bg-white rounded-md transition-all font-medium"
                                >
                                  准
                                </button>
                                <div className="w-[1px] h-3 bg-gray-200 mx-0.5"></div>
                                <button 
                                  onClick={() => setFeedbackState('inaccurate')}
                                  className={`px-3 py-1 text-[11px] transition-all font-medium rounded-md ${
                                    feedbackState === 'inaccurate' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-600 hover:text-rose-600 hover:bg-white'
                                  }`}
                                >
                                  不准
                                </button>
                              </div>
                            </>
                          )}
                          
                          {feedbackState === 'submitted' && (
                            <span className="text-[12px] text-emerald-500 font-medium flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 感谢反馈
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Normal Result Info */}
                {!isAISearch && (
                  <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50 mb-4">
                     <span className="text-gray-500 text-[13px]">共找到 <span className="text-blue-600 font-bold">{filteredCustomers.length}</span> 个客户</span>
                  </div>
                )}

                {/* Filters */}
                {isAISearch && (
                  <div className="px-4 flex space-x-2 mb-4">
                    {['客户价值', '客户温度'].map(f => (
                      <button key={f} className="flex items-center px-3 py-1.5 bg-gray-50 rounded-lg text-[12px] text-gray-600 font-medium">
                        {f} <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
                      </button>
                    ))}
                    <button
                      onClick={() => setShowFilterSheet(true)}
                      className="flex items-center px-3 py-1.5 bg-gray-50 rounded-lg text-[12px] text-gray-600 font-medium relative"
                    >
                      更多筛选 <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
                      {Object.values(filters).some(v => v) && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] rounded-full flex items-center justify-center">
                          {Object.values(filters).filter(v => v).length}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* Results List */}
                <div className="px-4 space-y-3 pb-20">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="relative group overflow-hidden rounded-xl">
                      {/* Action behind the card */}
                      <div className="absolute inset-0 bg-rose-500 flex justify-end items-center px-6">
                        <div className="flex flex-col items-center text-white">
                          <AlertCircle className="w-5 h-5 mb-1" />
                          <span className="text-[11px] font-bold">不准确</span>
                        </div>
                      </div>

                      <motion.div 
                        drag="x"
                        dragConstraints={{ left: -80, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -40) {
                            // Trigger individual feedback
                            setIndividualFeedback(prev => ({ ...prev, [customer.id]: true }));
                            // Optional: show a small toast or just mark it
                          }
                        }}
                        className="relative bg-white p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-blue-200 transition-colors z-10"
                        onClick={() => {
                          // Only navigate if not dragging
                          setSelectedCustomerId(customer.id);
                        }}
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
                                <span className="text-[16px] font-bold text-gray-900">
                                  {highlightText(customer.name, searchValue)}
                                </span>
                                
                                {/* Gender & Age */}
                                <div className={`ml-2 px-1.5 py-0.5 rounded text-[10px] flex items-center font-medium ${customer.gender === 'M' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>
                                  {customer.gender === 'M' ? '♂' : '♀'} {highlightText(customer.age, searchValue)}岁
                                </div>

                                {/* Marital Status */}
                                {customer.maritalStatus && (
                                  <div className="ml-1.5 px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 text-[10px] font-medium">
                                    {highlightText(customer.maritalStatus, searchValue)}
                                  </div>
                                )}

                                {individualFeedback[customer.id] && (
                                  <span className="ml-2 text-[10px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded flex items-center">
                                    <AlertCircle className="w-2.5 h-2.5 mr-0.5" /> 已反馈不准
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center flex-wrap mt-1.5 text-[11px] text-gray-500">
                                {[customer.customerType, customer.temperature, customer.value, customer.vipLevel, customer.serviceLevel]
                                  .filter(Boolean)
                                  .map((tag, index, array) => (
                                    <div key={index} className="flex items-center">
                                      <span>{highlightText(tag, searchValue)}</span>
                                      {index < array.length - 1 && <span className="mx-1.5 text-gray-300">|</span>}
                                    </div>
                                  ))}
                              </div>

                              {/* AI Matched Dynamic Fields */}
                              {isAISearch && getMatchedDynamicFields(customer, searchValue).length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
                                  {getMatchedDynamicFields(customer, searchValue).map((match) => (
                                    <div key={match.key} className="flex items-start">
                                      <div className="flex-shrink-0 bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold mr-2 mt-0.5">
                                        {match.label}
                                      </div>
                                      <div className="text-[12px] text-gray-600 leading-relaxed">
                                        {highlightText(match.value, searchValue)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Contact Button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Contact logic
                            }}
                            className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-100 transition-colors text-[12px] font-medium"
                          >
                            <Phone className="w-3.5 h-3.5 mr-1" />
                            联系TA
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {searchState === 'unrecognized' && (
              <motion.div
                key="unrecognized"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-6 py-12 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-[17px] font-bold text-gray-900 mb-2">抱歉，我未能完全理解您的意图</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed mb-8 max-w-[260px]">
                  您可以尝试更换关键词，或者使用以下推荐的搜索方式：
                </p>
                
                <div className="w-full space-y-3">
                  {[
                    '搜索姓名：例如“王建国”',
                    '搜索手机号：例如“138”',
                    '按月份搜生日：例如“2月生日”',
                    '复合搜索：例如“30岁以上A类客户”'
                  ].map((tip, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        const val = tip.split('：')[1] || tip;
                        setSearchValue(val.replace(/[“”]/g, ''));
                        handleSearch(val.replace(/[“”]/g, ''));
                      }}
                      className="w-full p-4 bg-gray-50 rounded-2xl text-[14px] text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center justify-between group"
                    >
                      <span>{tip}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setSearchState('initial')}
                  className="mt-10 text-blue-600 font-bold text-[14px] hover:underline"
                >
                  返回重新开始
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Recording Overlay */}
        <AnimatePresence>
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <div className="bg-white rounded-3xl p-8 flex flex-col items-center space-y-6 shadow-2xl">
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-blue-500 rounded-full"
                  />
                  <div className="relative bg-blue-500 p-6 rounded-full">
                    <Mic className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 mb-2">{recordingText}</p>
                  <p className="text-sm text-gray-400">松开 结束输入</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Bottom Sheet for Inaccurate Feedback */}
        <AnimatePresence>
          {feedbackState === 'inaccurate' && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setFeedbackState('none');
                  setCustomFeedback('');
                }}
                className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-[4px]"
              />
              
              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="absolute bottom-0 left-0 right-0 z-[120] bg-white rounded-t-[24px] pb-10 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] flex flex-col"
              >
                {/* Handle */}
                <div className="flex justify-center py-3">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>
                
                <div className="px-6 pt-2">
                  <div className="mb-6">
                    <h3 className="text-[20px] font-bold text-gray-900">反馈搜索问题</h3>
                    <p className="text-[14px] text-gray-400 mt-1">请告诉我们哪里不准确，帮助我们改进</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => setSelectedReason(selectedReason === '意图准但结果不准' ? null : '意图准但结果不准')}
                      className={`py-4 rounded-2xl text-[14px] font-bold transition-all border active:scale-[0.98] ${
                        selectedReason === '意图准但结果不准' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      意图准但结果不准
                    </button>
                    
                    <button 
                      onClick={() => setSelectedReason(selectedReason === '意图不准' ? null : '意图不准')}
                      className={`py-4 rounded-2xl text-[14px] font-bold transition-all border active:scale-[0.98] ${
                        selectedReason === '意图不准' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      意图不准
                    </button>
                  </div>

                  {/* Custom Input */}
                  <div className="mb-8">
                    <div className="flex items-center mb-3 px-1">
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-[14px] font-bold text-gray-600">详细描述 (可选)</span>
                    </div>
                    <textarea 
                      value={customFeedback}
                      onChange={(e) => setCustomFeedback(e.target.value)}
                      placeholder="例如：我想找的是XX，但结果出来了YY..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none h-28 placeholder:text-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => {
                        setFeedbackState('none');
                        setCustomFeedback('');
                        setSelectedReason(null);
                      }}
                      className="flex-1 py-4 bg-gray-50 rounded-2xl text-[16px] font-bold text-gray-400 hover:text-gray-600 transition-colors active:scale-[0.98]"
                    >
                      取消
                    </button>
                    <button 
                      disabled={!selectedReason && !customFeedback.trim()}
                      onClick={() => {
                        setFeedbackState('submitted');
                        setCustomFeedback('');
                        setSelectedReason(null);
                      }}
                      className={`flex-[2] py-4 rounded-2xl text-[16px] font-bold transition-all active:scale-[0.98] ${
                        selectedReason || customFeedback.trim()
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      确定
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Filter Sheet */}
        <FilterSheet
          visible={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          filters={filters}
          onApply={(newFilters) => setFilters(newFilters)}
        />
      </div>
    </div>
  );
}

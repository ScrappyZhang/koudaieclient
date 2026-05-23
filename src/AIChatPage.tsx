import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Plus,
  History,
  MoreVertical,
  Send,
  Bot,
  Trash2,
  Settings,
  Copy,
  Mic,
  Camera,
  Sparkles,
  Image,
  FileText,
  Calendar,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Star,
} from 'lucide-react';

// 客户卡片数据类型
interface CustomerCard {
  name: string;
  gender: string;
  age: number;
  married: boolean;
  tags: string[];
  reason: string;
}

// 精选客户列表
const selectedCustomers: CustomerCard[] = [
  { name: '邓逵', gender: '男', age: 36, married: true, tags: ['铂金', 'A4', '高温'], reason: '保单即将到期，续保意向高' },
  { name: '刘敏', gender: '女', age: 42, married: true, tags: ['黄金', 'A4'], reason: '符合感恩回馈权益，有加保空间' },
  { name: '陈静', gender: '女', age: 28, married: false, tags: ['白银', 'A4'], reason: '近期有购买意愿，关注养老产品' },
  { name: '王强', gender: '男', age: 45, married: true, tags: ['铂金', 'A4'], reason: '保单多年未理赔，适合增员' },
  { name: '李华', gender: '女', age: 33, married: true, tags: ['黄金', 'A4'], reason: '家庭结构变化，保障缺口大' },
  { name: '张伟', gender: '男', age: 50, married: true, tags: ['铂金', 'A4'], reason: '子女即将成年，有教育金需求' },
  { name: '赵丽', gender: '女', age: 38, married: true, tags: ['白银', 'A4'], reason: '近期有购买健康险意向' },
];

// 消息类型
type MessageType = 'text' | 'customer-list';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  type?: MessageType;
  customers?: CustomerCard[];
  showStrategy?: boolean;
  customerName?: string;
}

// 模拟 AI 响应
const generateAIResponse = (userMessage: string): { content: string; type: MessageType; customers?: CustomerCard[]; showStrategy?: boolean; customerName?: string } => {
  // 检测是否是访前锦囊请求
  if (userMessage.includes('访前') || userMessage.includes('面访') || userMessage.includes('整理')) {
    // 提取客户名称
    const customerMatch = userMessage.match(/面访(.+)$/);
    const customerName = customerMatch ? customerMatch[1].trim() : '';
    return {
      content: '已准备好访前锦囊，请查看',
      type: 'text',
      showStrategy: true,
      customerName,
    };
  }

  // 检测是否是盘客相关请求
  if (userMessage.includes('盘客') || userMessage.includes('感恩回馈') || userMessage.includes('优选')) {
    return {
      content: '为您精选了7位符合"感恩回馈"权益的高潜老客户，建议本月优先跟进：',
      type: 'customer-list',
      customers: selectedCustomers,
    };
  }

  const responses = [
    { content: "好的，我来帮您分析一下。根据您的描述，我建议可以先从客户的需求出发，了解他们的保障缺口，然后再针对性地推荐产品。", type: 'text' as MessageType },
    { content: "这是一个很好的问题！在保险销售中，建立信任是第一步。您可以先分享一些成功案例或理赔故事，让客户感受到保险的实际价值。", type: 'text' as MessageType },
    { content: "明白了。针对这类客户，建议采用需求分析与方案匹配的方式，先了解他们的家庭结构、财务状况和风险偏好，再推荐合适的产品组合。", type: 'text' as MessageType },
    { content: "收到！我会帮您整理相关资料。您提到的客户档案已经更新，可以随时查看客户的保单详情和家庭成员信息。", type: 'text' as MessageType },
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export default function AIChatPage({ onBack, initialMessage, onCustomerClick, onShowStrategy }: { onBack: () => void; initialMessage?: string; onCustomerClick?: (customerName: string) => void; onShowStrategy?: () => void }) {
  // State
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: '新对话',
      messages: [],
      createdAt: '今天'
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showMenuPanel, setShowMenuPanel] = useState(false);
  const [showStrategySheet, setShowStrategySheet] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);

  // 获取当前对话
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // 自动发送初始消息
  useEffect(() => {
    if (initialMessage && !sendingRef.current && messages.length === 0) {
      sendingRef.current = true;
      sendMessageWithContent(initialMessage);
    }
  }, [initialMessage, messages.length]);

  // 发送指定内容的消息
  const sendMessageWithContent = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const messageId = Date.now().toString();

    // 添加用户消息
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content: content,
      time: timeStr
    };

    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: [...c.messages, userMessage] }
        : c
    ));
    setIsTyping(true);

    // 模拟 AI 响应
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const response = generateAIResponse(content);
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      time: timeStr,
      type: response.type,
      customers: response.customers,
      showStrategy: response.showStrategy,
      customerName: response.customerName,
    };

    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: [...c.messages, aiResponse], title: c.messages.length === 0 ? content.slice(0, 20) : c.title }
        : c
    ));
    setIsTyping(false);
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const messageId = Date.now().toString();

    // 添加用户消息
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content: inputValue,
      time: timeStr
    };

    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: [...c.messages, userMessage] }
        : c
    ));
    setInputValue('');
    setIsTyping(true);

    // 模拟 AI 响应
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const response = generateAIResponse(inputValue);
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      time: timeStr,
      type: response.type,
      customers: response.customers,
      showStrategy: response.showStrategy,
      customerName: response.customerName,
    };

    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: [...c.messages, aiResponse], title: c.messages.length === 1 ? inputValue.slice(0, 20) : c.title }
        : c
    ));
    setIsTyping(false);

    // 如果需要显示访前锦囊，调用回调
    if (response.showStrategy && onShowStrategy) {
      setTimeout(() => onShowStrategy(), 500);
    }
  };

  // 新建对话
  const handleNewConversation = () => {
    const newId = Date.now().toString();

    const newConversation: Conversation = {
      id: newId,
      title: '新对话',
      messages: [],
      createdAt: '今天'
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    setShowHistoryPanel(false);
  };

  // 删除对话
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (id === activeConversationId) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        handleNewConversation();
      }
    }
  };

  // 判断是否为新对话（空消息时显示欢迎界面）
  const isNewConversation = messages.length === 0;

  // 建议对话话题
  const suggestedTopics = [
    '5月盘客开始啦，BOB为你优选了7位符合"感恩回馈"权益的高潜老客户',
    '客户觉得保费太贵怎么办？',
    '帮我整理下周三客户的经营计划',
  ];

  // 功能按钮
  const quickActions = [
    { icon: Sparkles, label: '访前锦囊' },
    { icon: FileText, label: '访后总结' },
    { icon: Calendar, label: '今日日程' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative">

        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left - Back */}
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="text-sm font-medium ml-1">返回</span>
            </button>

            {/* Center - Title */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900 ml-2">AskBob</span>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNewConversation}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="新建对话"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => {
                  setShowHistoryPanel(!showHistoryPanel);
                  setShowMenuPanel(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="历史对话"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => {
                  setShowMenuPanel(!showMenuPanel);
                  setShowHistoryPanel(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="菜单"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistoryPanel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 right-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-50">
                <h3 className="text-sm font-bold text-gray-900">历史对话</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setShowHistoryPanel(false);
                    }}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                      conv.id === activeConversationId ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{conv.title}</p>
                      <p className="text-xs text-gray-400">{conv.createdAt}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Panel */}
        <AnimatePresence>
          {showMenuPanel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 right-4 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="py-1">
                <button className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-700">设置</span>
                </button>
                <button className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors">
                  <Copy className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-700">导出对话</span>
                </button>
                <button
                  onClick={() => {
                    handleDeleteConversation(activeConversationId);
                    setShowMenuPanel(false);
                  }}
                  className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500 mr-3" />
                  <span className="text-sm text-red-500">清空当前对话</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-gray-50"
        >
          {isNewConversation ? (
            /* 新对话 - 千问风格欢迎界面 */
            <div className="flex flex-col items-center px-5 pt-8 pb-6">
              {/* 头像 + 标题 + 副标题 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mb-8"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                  <Bot className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">我是 AskBob</h2>
                <p className="text-sm text-gray-400 text-center leading-relaxed">
                  为你的保险销售答疑、办事、拓客，随时找我聊聊
                </p>
              </motion.div>

              {/* 建议对话气泡 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="w-full space-y-3"
              >
                {suggestedTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(topic)}
                    className="w-full text-left px-4 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-[15px] text-gray-700 leading-relaxed hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </motion.div>
            </div>
          ) : (
            /* 正常聊天消息 */
            <div className="px-4 py-6 space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Time - 在上方，和头像平齐 */}
                  <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user'
                        ? 'bg-indigo-600'
                        : 'bg-gradient-to-br from-indigo-500 to-cyan-400'
                    }`}>
                      {msg.role === 'user'
                        ? <span className="text-xs font-bold text-white">我</span>
                        : <Bot className="w-5 h-5 text-white" />
                      }
                    </div>
                    <span className="text-xs text-gray-400">
                      {msg.time}
                    </span>
                  </div>

                  {/* Message Bubble - 宽度100% */}
                  <div className={`px-4 py-3 rounded-2xl w-full ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                  }`}>
                    {/* 如果是访前锦囊消息，显示特殊格式 */}
                    {msg.showStrategy ? (
                      <p className="text-[15px] leading-relaxed">
                        已准备好访前锦囊，
                        <button
                          onClick={() => setShowStrategySheet(true)}
                          className="text-blue-600 font-medium hover:underline cursor-pointer"
                        >
                          请查看
                        </button>
                      </p>
                    ) : (
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}

                    {/* 客户卡片列表 */}
                    {msg.type === 'customer-list' && msg.customers && (
                      <div className="mt-3 space-y-2">
                        {msg.customers.map((customer, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              {/* 头像 */}
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-sm font-bold text-indigo-600">{customer.name[0]}</span>
                              </div>
                              {/* 信息 */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900">{customer.name}</span>
                                  <span className="text-xs text-gray-400">{customer.gender} · {customer.age}岁</span>
                                  {customer.married && <span className="text-xs text-gray-400">已婚</span>}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  {customer.tags.map((tag, tagIdx) => (
                                    <span key={tagIdx} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 hidden">{customer.reason}</span>
                              <ChevronRight className="w-4 h-4 text-gray-300" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="px-4 py-3 bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-gray-50 px-4 pb-5 pt-3">
          {/* 功能按钮 - 横向滚动 */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
            <button className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm flex-shrink-0 hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <div className="w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </button>
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => setInputValue(action.label)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm flex-shrink-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <action.icon className="w-5 h-5 text-gray-700" />
                <span className="text-sm text-gray-700 font-medium">{action.label}</span>
              </button>
            ))}
          </div>

          {/* 输入框 */}
          <div className="flex items-center gap-3 bg-white rounded-[20px] px-4 py-3 shadow-sm border border-gray-100">
            <button className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24">
                  <rect x="5" y="10" width="2" height="4" rx="0.5" fill="currentColor" />
                  <rect x="9" y="7" width="2" height="10" rx="0.5" fill="currentColor" />
                  <rect x="13" y="7" width="2" height="10" rx="0.5" fill="currentColor" />
                  <rect x="17" y="10" width="2" height="4" rx="0.5" fill="currentColor" />
                </svg>
              </div>
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="发消息或按住说话..."
              className="flex-1 text-[15px] focus:outline-none placeholder:text-gray-300"
            />
            <button className="flex-shrink-0 p-1">
              <Camera className="w-6 h-6 text-gray-700" />
            </button>
            <button className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <Plus className="w-5 h-5 text-gray-900" />
              </div>
            </button>
          </div>

          {/* 底部提示 */}
          <p className="text-center text-xs text-gray-300 mt-2.5">内容由 AI 生成</p>
        </div>

        {/* Click outside to close panels */}
        {(showHistoryPanel || showMenuPanel) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowHistoryPanel(false);
              setShowMenuPanel(false);
            }}
          />
        )}

        {/* 访前锦囊 Sheet */}
        <AnimatePresence>
          {showStrategySheet && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowStrategySheet(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-100 rounded-t-[32px] z-[70] flex flex-col max-h-[90vh] overflow-hidden"
              >
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
                      if (onCustomerClick) onCustomerClick('邓逵');
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
      </div>
    </div>
  );
}
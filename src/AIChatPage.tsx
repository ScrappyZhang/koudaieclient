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
} from 'lucide-react';

// 模拟 AI 响应
const generateAIResponse = (userMessage: string): string => {
  const responses = [
    "好的，我来帮您分析一下。根据您的描述，我建议可以先从客户的需求出发，了解他们的保障缺口，然后再针对性地推荐产品。",
    "这是一个很好的问题！在保险销售中，建立信任是第一步。您可以先分享一些成功案例或理赔故事，让客户感受到保险的实际价值。",
    "明白了。针对这类客户，建议采用需求分析与方案匹配的方式，先了解他们的家庭结构、财务状况和风险偏好，再推荐合适的产品组合。",
    "收到！我会帮您整理相关资料。您提到的客户档案已经更新，可以随时查看客户的保单详情和家庭成员信息。",
    "这是个好机会！根据数据显示，这类客户对养老社区产品关注度较高，建议您可以准备一些相关的案例和权益介绍资料。",
    "根据该客户的保单记录，我发现他的重疾险保额还有30万的缺口，建议在下次面谈时重点沟通这个话题。",
    "本周有3位客户的生日即将到来，我已经为您准备好了生日祝福话术，可以直接发送。",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export default function AIChatPage({ onBack }: { onBack: () => void }) {
  // State
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: '新对话',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: '你好，我是 AskBob，你的销售助手，说说你今天想干嘛？\n\n• 有个客户想搞定？\n\n• 某个产品讲不明白？\n\n• 还是想聊聊这个月的经营计划？\n\n我在这儿等你开口。',
          time: '10:00'
        }
      ],
      createdAt: '今天'
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showMenuPanel, setShowMenuPanel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 获取当前对话
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateAIResponse(inputValue),
      time: timeStr
    };

    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: [...c.messages, aiResponse], title: c.messages.length === 1 ? inputValue.slice(0, 20) : c.title }
        : c
    ));
    setIsTyping(false);
  };

  // 新建对话
  const handleNewConversation = () => {
    const newId = Date.now().toString();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newConversation: Conversation = {
      id: newId,
      title: '新对话',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: '你好，我是 AskBob，你的销售助手，说说你今天想干嘛？\n\n• 有个客户想搞定？\n\n• 某个产品讲不明白？\n\n• 还是想聊聊这个月的经营计划？\n\n我在这儿等你开口。',
          time: timeStr
        }
      ],
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
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gray-50"
        >
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
                <span className={`text-xs ${msg.role === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                  {msg.time}
                </span>
              </div>

              {/* Message Bubble - 宽度100% */}
              <div className={`px-4 py-3 rounded-2xl w-full ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
              }`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
          {/* Quick Actions - 快捷话题 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              '月末盘客',
              '访前锦囊',
              '访后总结',
              '产品知识陪练',
            ].map((topic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(topic);
                }}
                className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors flex-shrink-0 border border-indigo-100"
              >
                <span className="text-indigo-600">{topic}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Mic className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex-1 relative">
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
                placeholder="输入消息..."
                className="w-full px-4 py-2.5 bg-gray-100 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400 transition-all"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`p-2.5 rounded-xl transition-all ${
                inputValue.trim() && !isTyping
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-200'
              }`}
            >
              <Send className={`w-5 h-5 ${inputValue.trim() && !isTyping ? 'text-white' : 'text-gray-400'}`} />
            </button>
          </div>
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
      </div>
    </div>
  );
}
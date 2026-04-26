import React, { useState } from 'react';
import { ChevronLeft, Plus, Calendar as CalendarIcon, ClipboardList, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchedulePageProps {
  onBack: () => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'management'>('calendar');
  const [selectedDate, setSelectedDate] = useState(20); // Default to 20th based on screenshot

  const days = [
    { day: '周日', date: 19, status: 'inactive' },
    { day: '周一', date: 20, status: 'active' }, // April 20 is Mon as per prompt logic
    { day: '周二', date: 21, status: 'inactive' },
    { day: '周三', date: 22, status: 'inactive' },
    { day: '周四', date: 23, status: 'inactive' },
    { day: '周五', date: 24, status: 'inactive' },
    { day: '周六', date: 25, status: 'inactive' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-[#f8f8f8] min-h-screen shadow-2xl overflow-x-hidden flex flex-col relative text-[#1a1a1a]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold">日程</span>
          <button className="p-1">
            <Plus className="w-6 h-6 border-2 border-gray-900 rounded-full p-0.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-8">
          {/* Tabs */}
          <div className="flex p-1 bg-[#f1f1eb] mx-4 mt-4 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-all ${
                activeTab === 'calendar' ? 'bg-white shadow-sm font-bold' : 'text-gray-500'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm">日历</span>
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-all ${
                activeTab === 'management' ? 'bg-white shadow-sm font-bold' : 'text-gray-500'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span className="text-sm">日程管理</span>
            </button>
          </div>

          {/* Date Picker Section */}
          <div className="mt-4 px-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">2026 年 4 月</h2>
                <button className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <p className="text-xs text-gray-400 mb-4">可选日期，查看对应日程。</p>

              <div className="flex justify-between">
                {days.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className="flex flex-col items-center space-y-2 group"
                  >
                    <span className={`text-[10px] ${selectedDate === d.date ? 'text-gray-900 font-bold' : 'text-gray-300'}`}>
                      {d.day}
                    </span>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                      selectedDate === d.date ? 'bg-gray-100 font-bold border border-gray-200' : 'text-gray-300'
                    }`}>
                      {d.date}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <div className="w-12 h-12 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-bold mb-2">4月{selectedDate}日暂无事项</h3>
              <p className="text-sm text-gray-400 max-w-[240px] leading-relaxed">
                AskBob会根据对话信息在稍后为你自动规划
              </p>
              
              <button className="mt-10 flex items-center space-x-2 bg-black text-white px-8 py-3 rounded-2xl shadow-xl active:scale-95 transition-transform">
                <Plus className="w-4 h-4 border border-white rounded-full p-0.5" />
                <span className="font-bold text-sm">创建日程</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;

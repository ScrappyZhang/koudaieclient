import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Plus, Menu, ArrowUpDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

// 生成日历数据
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDay = firstDay.getDay(); // 0 = 周日
  const daysInMonth = lastDay.getDate();

  const days: { day: number; isCurrentMonth: boolean; isToday?: boolean; isHoliday?: boolean; holidayName?: string }[] = [];

  // 上个月的日期
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
  }

  // 当前月的日期
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: today.getFullYear() === year && today.getMonth() + 1 === month && i === today.getDate(),
    });
  }

  // 下个月的日期（补齐 42 天）
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  // 标记节假日（2026 年劳动节）
  if (month === 5) {
    days.forEach(d => {
      if (d.day >= 1 && d.day <= 5) {
        d.isHoliday = true;
        if (d.day === 1) d.holidayName = '劳动节';
      }
    });
  }
  if (month === 4 && days.some(d => d.day === 29)) {
    // 清明节 4 月 5 日
    const day29Index = days.findIndex(d => d.day === 5 && !d.isCurrentMonth);
    if (day29Index >= 0) {
      days[day29Index].isHoliday = true;
      days[day29Index].holidayName = '清明节';
    }
  }

  return days;
}

export default function ScheduleCalendarPage({ onBack }: { onBack: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3)); // 2026 年 4 月
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const calendarDays = getCalendarDays(year, month);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2));
  const handleNextMonth = () => setCurrentDate(new Date(year, month));

  const holidays: Record<string, string> = {
    '4-5': '清明节',
    '5-1': '劳动节',
  };

  return (
    <div className="min-h-screen bg-white flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-x-hidden flex flex-col relative pb-10">
        {/* 顶部导航栏 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} className="p-1 text-gray-400 hover:text-gray-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold text-gray-900">{year}.{String(month).padStart(2, '0')}</span>
            <button onClick={handleNextMonth} className="p-1 text-gray-400 hover:text-gray-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>

        {/* 日历区域 */}
        <div className="bg-white px-4 py-3">
          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, idx) => (
              <div key={idx} className={`text-center text-xs font-medium ${idx === 0 || idx === 6 ? 'text-orange-500' : 'text-gray-400'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* 日历网格 */}
          <AnimatePresence>
            {isCalendarExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((item, idx) => {
                    const dateKey = `${month}-${item.day}`;
                    const holiday = holidays[dateKey];
                    const isWeekend = idx % 7 === 0 || idx % 7 === 6;

                    return (
                      <div
                        key={idx}
                        className={`relative aspect-square flex flex-col items-center justify-center rounded-full ${
                          item.isToday
                            ? 'bg-orange-500 text-white font-bold'
                            : item.isCurrentMonth
                            ? item.isHoliday || isWeekend
                              ? 'text-orange-500'
                              : 'text-gray-900'
                            : 'text-gray-300'
                        } ${!item.isToday && item.isCurrentMonth ? 'hover:bg-gray-50' : ''} cursor-pointer transition-colors`}
                      >
                        <span className={`text-sm ${item.isToday ? 'text-base' : ''}`}>{item.day}</span>
                        {holiday && (
                          <span className={`text-[8px] mt-0.5 ${item.isToday ? 'text-orange-100' : 'text-orange-500'}`}>
                            {holiday}
                          </span>
                        )}
                        {item.isToday && (
                          <span className="text-[8px] opacity-80">初十</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 展开/收起按钮 */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isCalendarExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 空状态区域 */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-10">
          {/* 插图 */}
          <div className="w-40 h-40 mb-6 relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* 文件夹 */}
              <path
                d="M40 60 L90 60 L100 50 L160 50 L160 150 L40 150 Z"
                fill="#F3F4F6"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <path
                d="M40 70 L160 70 L160 150 L40 150 Z"
                fill="#FFFFFF"
              />
              {/* 文件 */}
              <rect x="60" y="80" width="60" height="50" rx="4" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />
              <line x1="70" y1="95" x2="110" y2="95" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
              <line x1="70" y1="105" x2="100" y2="105" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
              <line x1="70" y1="115" x2="105" y2="115" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
              {/* 动态线条 */}
              <motion.path
                d="M170 60 Q180 50 175 40"
                stroke="#F3F4F6"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                animate={{ opacity: [0.3, 1, 0.3], pathLength: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.path
                d="M165 55 Q175 45 170 35"
                stroke="#F3F4F6"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                animate={{ opacity: [0.3, 1, 0.3], pathLength: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </svg>
          </div>

          <h2 className="text-xl font-medium text-gray-900 mb-2">今天没有任务哟</h2>
          <p className="text-sm text-gray-400">点击"+"创建任务</p>
        </div>

        {/* 右下角浮动按钮 */}
        <button className="fixed bottom-20 right-8 w-14 h-14 bg-orange-500 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all z-40">
          <Plus className="w-7 h-7 text-white" />
        </button>
      </div>
    </div>
  );
}

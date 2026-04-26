import React, { useState } from 'react';
import { ChevronLeft, MoreHorizontal, Briefcase, Bell, Repeat, Clock, List, Image as ImageIcon, MessageCircle, Plus, Calendar } from 'lucide-react';

export default function ScheduleEditPage({ onBack, onSave }: { onBack: () => void, onSave?: (data: any) => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('工作');
  const [priority, setPriority] = useState('IV');
  const [bgColor, setBgColor] = useState('blue');
  const [startDate, setStartDate] = useState('04-26');
  const [startTime, setStartTime] = useState('15:30');
  const [endDate, setEndDate] = useState('04-26');
  const [endTime, setEndTime] = useState('22:00');
  const [reminder, setReminder] = useState('提前 1 小时');
  const [repeat, setRepeat] = useState('无');
  const [autoExtend, setAutoExtend] = useState(false);
  const [notes, setNotes] = useState('');

  const categories = ['工作', '生活', '家庭', '健康', '学习'];
  const priorities = ['I', 'II', 'III', 'IV'];
  const bgColors = ['blue', 'green', 'orange', 'purple', 'red'];

  const isToday = startDate === '04-26';

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl overflow-x-hidden flex flex-col relative">
        {/* 顶部导航栏 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">新建日程</h1>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* 标题和标签区域 */}
          <div className="bg-white mt-3 mx-3 p-4 rounded-2xl">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="邓逵 - 面访介绍康养会员权益"
              className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 outline-none"
            />
            <div className="flex gap-2 mt-3">
              {/* 分类 */}
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">{category}</span>
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
              </div>
              {/* 优先级 */}
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">{priority}</span>
                <span className="text-sm text-gray-700">优先级</span>
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
              </div>
              {/* 背景色 */}
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                <span className={`w-4 h-4 rounded-full bg-${bgColor}-400`} />
                <span className="text-sm text-gray-700">背景色</span>
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* 时间设置 */}
          <div className="bg-white mt-3 mx-3 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              {/* 开始时间 */}
              <div className="flex items-center gap-3 flex-1">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-orange-500 font-bold text-sm">
                    {startDate}{isToday && ',今天'}
                  </div>
                  <div className="text-gray-400 text-sm">{startTime}</div>
                </div>
              </div>
              {/* 分隔箭头 */}
              <ChevronRightIcon className="w-4 h-4 text-gray-300" />
              {/* 结束时间 */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="text-right">
                  <div className="text-orange-500 font-bold text-sm">
                    {endDate}{isToday && ',今天'}
                  </div>
                  <div className="text-gray-400 text-sm">{endTime}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 提醒、重复、顺延 */}
          <div className="bg-white mt-3 mx-3 rounded-2xl overflow-hidden">
            {/* 提醒 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">提醒</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-sm">{reminder}</span>
                <ChevronRightIcon className="w-4 h-4" />
              </div>
            </div>
            {/* 重复 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <Repeat className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">重复</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-sm">{repeat}</span>
                <ChevronRightIcon className="w-4 h-4" />
              </div>
            </div>
            {/* 顺延 */}
            <div className="flex items-center justify-between p-4 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-gray-700 block">顺延</span>
                  <span className="text-gray-400 text-xs">日程延期后，将会自动顺延一天</span>
                </div>
              </div>
              <button
                onClick={() => setAutoExtend(!autoExtend)}
                className={`w-12 h-6 rounded-full transition-colors ${autoExtend ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${autoExtend ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* 子任务 */}
          <div className="bg-white mt-3 mx-3 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <List className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">子任务</span>
            </div>
            <button className="flex items-center gap-2 text-gray-400 text-sm">
              <Plus className="w-4 h-4" />
              添加子任务
            </button>
          </div>

          {/* 图片 */}
          <div className="bg-white mt-3 mx-3 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">图片</span>
            </div>
            <button className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 备注 */}
          <div className="bg-white mt-3 mx-3 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">输入备注</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="添加备注内容..."
              className="w-full text-sm text-gray-700 placeholder-gray-300 outline-none resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* 底部保存按钮 */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-gray-50 to-transparent">
          <button
            onClick={() => {
              onSave?.({ title, category, priority, bgColor, startDate, startTime, endDate, endTime, reminder, repeat, autoExtend, notes });
            }}
            className="w-full bg-orange-500 text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

// 辅助图标组件
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

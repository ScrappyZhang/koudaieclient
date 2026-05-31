import React, { useState, useEffect } from 'react';
import { ChevronLeft, Mic, Image as ImageIcon, Sparkles, Calendar, Users, CheckCircle, FileText, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';

interface AddCustomerNotePageProps {
  onBack: () => void;
  onSave: () => void;
}

const AddCustomerNotePage: React.FC<AddCustomerNotePageProps> = ({ onBack, onSave }) => {
  const [inputMode, setInputMode] = useState<'ai' | 'manual'>('ai');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasParsed, setHasParsed] = useState(false);
  const [showActionCard, setShowActionCard] = useState(false);
  const [syncToCalendar, setSyncToCalendar] = useState(true);
  const [recognizedCustomer, setRecognizedCustomer] = useState<{name: string, avatar: string} | null>(null);
  const [recognizedTime, setRecognizedTime] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<{name: string, avatar: string} | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('今天');
  const [manualContent, setManualContent] = useState<string>('');
  const [noteType, setNoteType] = useState<string>('面访笔记');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => {
        setHasParsed(true);
        setShowActionCard(true);
        setRecognizedCustomer(null);
        setRecognizedTime('今天 18:10');
      }, 500);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      setHasParsed(false);
      setRecognizedCustomer(null);
      setRecognizedTime(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50/50 to-white">
      {/* 顶部导航 */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 ml-2">添加笔记</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Tab 切换 */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-4">
          <button
            onClick={() => setInputMode('ai')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
              inputMode === 'ai' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${inputMode === 'ai' ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className={inputMode === 'ai' ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium' : ''}>AI 智能录入</span>
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
              inputMode === 'manual' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Edit3 className={`w-4 h-4 ${inputMode === 'manual' ? 'text-gray-700' : 'text-gray-400'}`} />
            <span className={inputMode === 'manual' ? 'font-medium text-gray-700' : ''}>手动录入</span>
          </button>
        </div>

        {/* AI 智能录入模式 */}
        {inputMode === 'ai' && !hasParsed && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-5 mb-4">
            {!isRecording && (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    上传图片、截图或语音录入<br />AI 将自动识别并整理笔记内容
                  </p>
                </div>
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => setIsRecording(true)}
                    className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-all"
                  >
                    <Mic className="w-6 h-6 text-white" />
                    <span className="text-xs text-white/80 mt-1">语音</span>
                  </button>
                  <button
                    onClick={() => alert('上传图片')}
                    className="w-16 h-16 bg-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center hover:bg-gray-200 transition-all"
                  >
                    <ImageIcon className="w-6 h-6 text-gray-600" />
                    <span className="text-xs text-gray-500 mt-1">图片</span>
                  </button>
                  <button
                    onClick={() => alert('上传文件')}
                    className="w-16 h-16 bg-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center hover:bg-gray-200 transition-all"
                  >
                    <FileText className="w-6 h-6 text-gray-600" />
                    <span className="text-xs text-gray-500 mt-1">文件</span>
                  </button>
                </div>
              </>
            )}

            {isRecording && (
              <>
                <div className="flex justify-center items-center mb-4">
                  <button
                    onClick={toggleRecording}
                    className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-xl flex items-center justify-center scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-30 animate-pulse"></div>
                    <Mic className="w-8 h-8 text-white relative z-10" />
                  </button>
                </div>
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-blue-600 mb-2">{formatTime(recordingTime)}</p>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-blue-600 to-purple-600 rounded-full animate-bounce"
                        style={{
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '0.5s'
                        }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">点击结束录音</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* AI 解析结果 */}
        {inputMode === 'ai' && hasParsed && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">AI 识别结果</span>
                <span className="text-xs text-gray-400 ml-auto">如有误可点击修改</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">识别客户</span>
                  <button onClick={() => alert('选择客户')} className="flex items-center gap-2">
                    {recognizedCustomer ? (
                      <>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{recognizedCustomer.avatar}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{recognizedCustomer.name}</span>
                        <ChevronLeft className="w-4 h-4 text-gray-300 rotate-180" />
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm text-blue-600 font-medium">选择客户</span>
                        <ChevronLeft className="w-4 h-4 text-blue-400 rotate-180" />
                      </>
                    )}
                  </button>
                </div>
                <div className="h-px bg-gray-100"></div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">交流时间</span>
                  <button onClick={() => alert('选择时间')} className="flex items-center gap-2">
                    {recognizedTime ? (
                      <>
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-800">{recognizedTime}</span>
                        <ChevronLeft className="w-4 h-4 text-gray-300 rotate-180" />
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-blue-600 font-medium">选择时间</span>
                        <ChevronLeft className="w-4 h-4 text-blue-400 rotate-180" />
                      </>
                    )}
                  </button>
                </div>
                <div className="h-px bg-gray-100"></div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">笔记类型</span>
                  <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-sm font-medium">电话沟通</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-medium text-gray-700">AI 整理内容</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  客户名下平安家庭保 A 款 (2025 版) 将于 2026 年 4 月 26 日到期，暂未续保。主要原因是客户未接听电话，需要进一步跟进确认续保意向。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-800">AI 核心洞察</h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">录入时生成</span>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  <span>续保意向待确认，需主动跟进</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                  <span>价格敏感度中等，可尝试续保优惠</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></span>
                  <span>建议 3 天内二次电话跟进</span>
                </li>
              </ul>
            </div>

            {showActionCard && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-4 mb-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-gray-800">AI 识别到后续待办</h4>
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">NEW</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">下周三（6 月 3 日）14:00 电话回访</p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={syncToCalendar}
                        onChange={(e) => setSyncToCalendar(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-xs text-gray-600">同步至系统日历</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* 手动录入模式 */}
        {inputMode === 'manual' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">选择客户</span>
                <button onClick={() => alert('选择客户')} className="flex items-center gap-2">
                  {selectedCustomer ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{selectedCustomer.avatar}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{selectedCustomer.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-sm text-blue-600 font-medium">选择客户</span>
                    </>
                  )}
                  <ChevronLeft className="w-4 h-4 text-gray-300 rotate-180" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">交流时间</span>
                  <button onClick={() => alert('选择时间')} className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-800">{selectedTime}</span>
                    <ChevronLeft className="w-4 h-4 text-gray-300 rotate-180" />
                  </button>
                </div>
                <div className="h-px bg-gray-100"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">笔记类型</span>
                  <div className="flex gap-2">
                    {['面访笔记', '电话沟通', '常规记录'].map(type => (
                      <button
                        key={type}
                        onClick={() => setNoteType(type)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          noteType === type
                            ? type === '面访笔记' ? 'bg-amber-50 text-amber-600' :
                              type === '电话沟通' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-blue-50 text-blue-600'
                            : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">笔记内容</h3>
              <textarea
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                placeholder="请输入笔记内容..."
                className="w-full h-24 p-3 bg-gray-50 rounded-xl text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => alert('上传图片')} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                  </button>
                  <button onClick={() => alert('上传文件')} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <FileText className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">{manualContent.length}/800</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部保存按钮 */}
      <div className="bg-white px-4 py-3 border-t border-gray-100">
        <button
          onClick={onSave}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>保存笔记</span>
        </button>
      </div>
    </div>
  );
};

export default AddCustomerNotePage;
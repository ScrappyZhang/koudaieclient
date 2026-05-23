import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface SharedCustomer {
  id: string;
  name: string;
  status: 'agreed' | 'timeout' | 'pending';
  shareDate: string;
  shareTime: string;
  targetName: string;
  targetPhone: string;
  isOutgoing: boolean;
  type: 'share' | 'inherit'; // 共享 or 传承
}

const outgoingCustomers: SharedCustomer[] = [
  {
    id: '1',
    name: '岑孝星',
    status: 'agreed',
    shareDate: '2025-11-28',
    shareTime: '10:03',
    targetName: '李黎红',
    targetPhone: '1190154669',
    isOutgoing: true,
    type: 'inherit',
  },
  {
    id: '2',
    name: '窦嘉',
    status: 'timeout',
    shareDate: '2025-10-16',
    shareTime: '15:35',
    targetName: '李黎红',
    targetPhone: '1190154669',
    isOutgoing: true,
    type: 'share',
  },
  {
    id: '3',
    name: '张晓燕',
    status: 'pending',
    shareDate: '2025-12-01',
    shareTime: '09:30',
    targetName: '王明华',
    targetPhone: '1200345678',
    isOutgoing: true,
    type: 'inherit',
  },
  {
    id: '4',
    name: '陈建国',
    status: 'agreed',
    shareDate: '2025-09-15',
    shareTime: '14:20',
    targetName: '张晓燕',
    targetPhone: '1300456789',
    isOutgoing: true,
    type: 'share',
  },
];

const incomingCustomers: SharedCustomer[] = [
  {
    id: '5',
    name: '安剑',
    status: 'agreed',
    shareDate: '2025-08-04',
    shareTime: '14:08',
    targetName: '李黎红',
    targetPhone: '1190154669',
    isOutgoing: false,
    type: 'share',
  },
  {
    id: '6',
    name: '刘敏',
    status: 'agreed',
    shareDate: '2025-07-20',
    shareTime: '11:45',
    targetName: '王明华',
    targetPhone: '1200345678',
    isOutgoing: false,
    type: 'inherit',
  },
];

export default function SharedCustomerListPage({ onBack, defaultTab = 'outgoing' }: { onBack: () => void; defaultTab?: 'incoming' | 'outgoing' }) {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>(defaultTab);
  const [filterType, setFilterType] = useState<'all' | 'share' | 'inherit'>('all');

  const allCustomers = activeTab === 'outgoing' ? outgoingCustomers : incomingCustomers;

  // 按时间倒序排序
  const sortedCustomers = [...allCustomers].sort((a, b) => {
    const dateA = `${a.shareDate} ${a.shareTime}`;
    const dateB = `${b.shareDate} ${b.shareTime}`;
    return dateB.localeCompare(dateA);
  });

  const customers = filterType === 'all'
    ? sortedCustomers
    : sortedCustomers.filter(c => c.type === filterType);

  const inheritCount = allCustomers.filter(c => c.type === 'inherit').length;
  const shareCount = allCustomers.filter(c => c.type === 'share').length;

  const getStatusText = (status: SharedCustomer['status']) => {
    switch (status) {
      case 'agreed':
        return '客户已同意';
      case 'timeout':
        return '超时自动拒绝';
      case 'pending':
        return '待确认';
      default:
        return '';
    }
  };

  const getStatusColor = (status: SharedCustomer['status']) => {
    switch (status) {
      case 'agreed':
        return 'text-emerald-600';
      case 'timeout':
        return 'text-gray-400';
      case 'pending':
        return 'text-orange-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl flex flex-col relative">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-center sticky top-0 z-50 bg-white border-b border-gray-100">
          <button onClick={onBack} className="absolute left-4 p-2 -ml-2 text-gray-800">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[17px] font-bold text-gray-900">共享客户清单</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border-b border-gray-100">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 py-4 text-[15px] font-medium relative ${
              activeTab === 'incoming' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            收到的共享客户
            {activeTab === 'incoming' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex-1 py-4 text-[15px] font-medium relative ${
              activeTab === 'outgoing' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            发出的共享客户
            {activeTab === 'outgoing' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            全部 ({allCustomers.length})
          </button>
          <button
            onClick={() => setFilterType('inherit')}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all ${
              filterType === 'inherit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            传承 ({inheritCount})
          </button>
          <button
            onClick={() => setFilterType('share')}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all ${
              filterType === 'share'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            共享 ({shareCount})
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-400 text-sm">暂无数据</p>
            </div>
          ) : (
            <div className="space-y-3">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  {/* Header: Avatar + Name + Type Tag + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-base">{customer.name[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold text-gray-900">{customer.name}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
                          {customer.type === 'inherit' ? '传承' : '共享'}
                        </span>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(customer.status)}`}>
                      {getStatusText(customer.status)}
                    </span>
                  </div>

                  {/* Share Info */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
                    <p className="text-sm text-gray-500">
                      {customer.shareDate} {customer.shareTime}{' '}
                      {customer.isOutgoing ? (
                        <>
                          {customer.type === 'inherit' ? '传承至' : '共享至'}
                          {customer.targetName}({customer.targetPhone})
                        </>
                      ) : (
                        <>
                          {customer.targetName}({customer.targetPhone})
                          {customer.type === 'inherit' ? '传承给你' : '共享给你'}
                        </>
                      )}
                    </p>
                  </div>

                  {/* View Details Button */}
                  <div className="flex justify-end">
                    <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors">
                      查看详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

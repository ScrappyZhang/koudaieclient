import React, { useState } from 'react';
import { ChevronLeft, Search, MoreHorizontal, Filter, ChevronDown, Phone, Edit3, Plus, Cake } from 'lucide-react';
import CustomerDetailPage from './CustomerDetailPage';
import { customers } from './data';

export default function CustomerListPage({ onBack, onSearch }: { onBack: () => void; onSearch?: () => void }) {
  const [activeTab, setActiveTab] = useState('客户列表');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({
    '客户类型': '客户类型',
    '客户温度': '客户温度',
    '客户价值': '客户价值',
    '客群标签': '客群标签'
  });

  const filterOptions = {
    '客户类型': ['不限', '寿险客户', '准客户', '用户'],
    '客户温度': ['不限', '冷却', '低温', '中温', '高温'],
    '客户价值': ['不限', 'A1', 'A2', 'A3', 'A4', 'B', 'C', 'D', 'E', 'F'],
    '客群标签': ['不限', '高净值', '活跃']
  };

  if (selectedCustomerId !== null) {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    return <CustomerDetailPage customer={selectedCustomer} onBack={() => setSelectedCustomerId(null)} />;
  }

  return (
    <div className="min-h-screen bg-white flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative">
        
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-50 bg-white">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-800">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-[17px] font-bold text-gray-900 ml-1">全部客户</h1>
          </div>
          <div className="flex items-center space-x-3 text-gray-800">
            <button onClick={onSearch}><Search className="w-5 h-5" /></button>
            <button><MoreHorizontal className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex px-4 pt-2 pb-1 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('客户列表')}
            className={`text-[17px] mr-6 pb-2 relative ${activeTab === '客户列表' ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}
          >
            客户列表
            {activeTab === '客户列表' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('家庭关系列表')}
            className={`text-[17px] pb-2 relative flex items-center ${activeTab === '家庭关系列表' ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}
          >
            家庭关系列表
            {activeTab === '家庭关系列表' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>}
          </button>
        </div>

        {/* Filters Dropdown Bar */}
        <div className="relative z-40">
          <div className="flex px-4 py-3 justify-between items-center border-b border-gray-50 bg-white relative z-20">
            {Object.keys(filterOptions).map(key => (
              <button 
                key={key}
                onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
                className={`flex items-center text-[13px] ${openDropdown === key || (filters[key] !== key && filters[key] !== '不限') ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
              >
                {filters[key] === '不限' ? key : filters[key]}
                <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform ${openDropdown === key ? 'rotate-180' : ''}`} />
              </button>
            ))}
            <div className="w-px h-3.5 bg-gray-200 mx-1"></div>
            <button className="flex items-center text-[13px] text-gray-700 font-medium">
              筛选 <Filter className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Dropdown Overlay */}
          {openDropdown && (
            <>
              <div className="absolute top-full left-0 right-0 h-[1000px] bg-black/20 z-10" onClick={() => setOpenDropdown(null)} />
              <div className="absolute top-full left-0 right-0 bg-white z-20 shadow-lg max-h-64 overflow-y-auto">
                {filterOptions[openDropdown as keyof typeof filterOptions].map(option => (
                  <div
                    key={option}
                    className={`px-6 py-3 text-[14px] border-b border-gray-50 ${filters[openDropdown] === option || (filters[openDropdown] === openDropdown && option === '不限') ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                    onClick={() => {
                      setFilters({ ...filters, [openDropdown]: option === '不限' ? openDropdown : option });
                      setOpenDropdown(null);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center px-4 py-3 overflow-x-auto scrollbar-hide space-x-2">
          {['综拓准客', '在职有效', '仅投保人', '寿险VIP'].map(filter => (
            <button key={filter} className="whitespace-nowrap px-3 py-1.5 bg-gray-50 text-gray-600 text-[12px] rounded-full">
              {filter}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto relative bg-gray-50">
          <div className="px-4 py-2 flex items-center justify-between text-[12px] text-gray-500">
            <span>共找到 <span className="text-blue-600 font-medium">{customers.length}</span> 位客户</span>
          </div>
          <div className="px-4 pb-3">
            {customers.map((customer) => (
              <div 
                key={customer.id} 
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 cursor-pointer hover:border-blue-200 transition-colors"
                onClick={() => setSelectedCustomerId(customer.id)}
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

                        {/* Birthday Badge */}
                        {customer.daysToBirthday !== undefined && customer.daysToBirthday <= 7 && (
                          <div className="ml-2 flex items-center text-[10px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 font-medium">
                            <Cake className="w-3 h-3 mr-1" />
                            {customer.daysToBirthday === 0 ? '今天生日' : `${customer.daysToBirthday}天后生日`}
                          </div>
                        )}

                        {customer.badge && (
                          <span className="ml-2 px-1.5 py-0.5 border border-gray-300 text-gray-500 text-[10px] rounded-sm">
                            {customer.badge}
                          </span>
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
                    </div>
                  </div>
                  
                  {/* Contact Button */}
                  <button className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-100 transition-colors text-[12px] font-medium">
                    <Phone className="w-3.5 h-3.5 mr-1" />
                    联系TA
                  </button>
                </div>

                {/* Remark Section */}
                <div className="mt-3 pt-3 border-t border-gray-50">
                  {customer.remark ? (
                    <div className="flex items-start justify-between group cursor-pointer">
                      <div className="text-[13px] text-gray-500 line-clamp-2 pr-4">
                        <span className="text-gray-400 mr-1">备注:</span>
                        {customer.remark}
                      </div>
                      <Edit3 className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 mt-0.5" />
                    </div>
                  ) : (
                    <button className="text-[13px] text-gray-400 hover:text-blue-600 flex items-center transition-colors">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      添加备注信息
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

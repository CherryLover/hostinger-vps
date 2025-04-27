import React, { useState, useEffect } from 'react';
import { ServerInfo, MetricsData, MetricType, TimeRange } from '../types';
import MetricCard from './MetricCard';
import MetricChart from './MetricChart';
import TimeRangeSelector from './TimeRangeSelector';
import ServerInfoPanel from './ServerInfoPanel';
import { defaultServerInfo, defaultMetricsData, fetchServerInfo, fetchMetricsData } from '../data/mockData';

const Dashboard: React.FC = () => {
  const [serverInfo, setServerInfo] = useState<ServerInfo>(defaultServerInfo);
  const [metricsData, setMetricsData] = useState<MetricsData>(defaultMetricsData);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('cpu_usage');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showingMockData, setShowingMockData] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  
  const metricTypes: MetricType[] = [
    'cpu_usage',
    'ram_usage',
    'disk_space',
    'outgoing_traffic',
    'incoming_traffic',
    'uptime',
  ];
  
  const serverInfoForMetrics = {
    cpu_usage: { total: serverInfo.cpus },
    ram_usage: { total: serverInfo.memory },
    disk_space: { total: serverInfo.disk },
  };
  
  // 初始化加载数据
  useEffect(() => {
    loadData();
  }, []);
  
  // 当时间范围变化时重新加载数据
  useEffect(() => {
    if (initialized) {
      loadData();
    }
  }, [timeRange]);
  
  // 定期刷新数据
  useEffect(() => {
    if (!initialized) return;
    
    const interval = setInterval(handleRefresh, 60000); // 每分钟刷新一次
    return () => clearInterval(interval);
  }, [initialized, timeRange]);
  
  // 验证指标数据是否有效
  const validateMetricsData = (data: MetricsData | undefined): boolean => {
    if (!data) return false;
    
    // 检查所有必要的指标类型是否存在
    return metricTypes.every(type => {
      return (
        data[type] && 
        data[type].usage && 
        typeof data[type].usage === 'object' && 
        Object.keys(data[type].usage).length > 0
      );
    });
  };
  
  // 从API加载数据
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    // 根据当前选择的时间范围计算日期参数
    const now = new Date();
    const dateTo = now.toISOString();
    let dateFrom: string;
    
    switch (timeRange) {
      case '1h':
        dateFrom = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString();
        break;
      case '6h':
        dateFrom = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
        break;
      case '24h':
        dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case '7d':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '30d':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      default:
        dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
    
    try {
      // 先获取服务器信息
      let serverInfoData;
      try {
        serverInfoData = await fetchServerInfo();
        setServerInfo(serverInfoData);
        console.log('成功获取服务器信息数据:', serverInfoData);
      } catch (err) {
        console.error('获取服务器信息失败:', err);
        setShowingMockData(true);
        // 使用默认数据并继续
      }

      // 然后获取指标数据，传入服务器信息以避免重复调用fetchServerInfo
      try {
        const metricsInfoData = await fetchMetricsData(dateFrom, dateTo, serverInfoData);
        console.log('获取到指标数据:', metricsInfoData);
        
        // 验证数据格式是否正确
        if (validateMetricsData(metricsInfoData)) {
          setMetricsData(metricsInfoData);
          setShowingMockData(false);
        } else {
          console.error('API返回的指标数据格式不正确，使用默认数据');
          setMetricsData(defaultMetricsData);
          setShowingMockData(true);
        }
      } catch (err) {
        console.error('获取指标数据失败:', err);
        setShowingMockData(true);
        // 使用默认指标数据
      }
      
      // 标记为已初始化
      setInitialized(true);
    } catch (error) {
      console.error('加载数据时发生错误:', error);
      setError('加载数据失败，请检查网络连接或API配置');
      setShowingMockData(true);
      setInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = () => {
    if (isLoading) return; // 如果正在加载，则不重复刷新
    console.log('正在从API刷新数据...');
    loadData(); // 这样就会使用当前选择的timeRange
  };
  
  // 确保使用安全的指标数据
  const safeMetricsData = React.useMemo(() => {
    // 首先验证当前数据是否有效
    if (validateMetricsData(metricsData)) {
      return metricsData;
    }
    // 否则返回默认数据
    return defaultMetricsData;
  }, [metricsData]);
  
  // 渲染加载状态
  if (isLoading && !initialized) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-medium text-gray-700">正在加载服务器数据...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">服务器状态</h1>
        <button 
          onClick={handleRefresh} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              刷新中...
            </>
          ) : (
            <>刷新数据</>
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <p className="text-sm">正在使用默认数据显示</p>
        </div>
      )}
      
      {showingMockData && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>无法从API获取最新数据，正在显示模拟数据</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column - Server Info */}
        <div className="lg:col-span-1">
          <ServerInfoPanel serverInfo={serverInfo} />
        </div>
        
        {/* Right column - Metrics */}
        <div className="lg:col-span-3 space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricTypes.map((metricType) => (
              <MetricCard
                key={metricType}
                metricType={metricType}
                metricsData={safeMetricsData}
                serverInfo={serverInfoForMetrics[metricType as keyof typeof serverInfoForMetrics]}
                onClick={() => setSelectedMetric(metricType)}
                isActive={selectedMetric === metricType}
              />
            ))}
          </div>
          
          {/* Chart section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
              <h2 className="text-lg font-semibold">{selectedMetric.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())} Chart</h2>
              <TimeRangeSelector selectedRange={timeRange} onChange={setTimeRange} />
            </div>
            
            <div className="h-[350px] w-full">
              <MetricChart
                metricType={selectedMetric}
                metricsData={safeMetricsData}
                timeRange={timeRange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { ServerInfo, MetricsData } from '../types';
import { API_CONFIG } from '../config';

const headers = {
  'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
};

export async function getServerInfo(): Promise<ServerInfo> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/virtual-machines`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API 响应数据:', data); // 调试用
    
    // API直接返回服务器数组，不是嵌套在data字段中
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('API返回的数据格式不正确或没有服务器数据');
    }
    
    // 返回第一个服务器信息
    return data[0];
  } catch (error) {
    console.error('Failed to fetch server info:', error);
    throw error;
  }
}

export async function getMetricsData(
  serverId: number, 
  dateFrom?: string, 
  dateTo?: string
): Promise<MetricsData> {
  // 如果没有提供时间参数，默认使用过去两天
  const now = new Date();
  const defaultDateTo = now.toISOString();
  const defaultDateFrom = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
  
  // 使用提供的时间范围或默认值
  const effectiveDateTo = dateTo || defaultDateTo;
  const effectiveDateFrom = dateFrom || defaultDateFrom;
  
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/virtual-machines/${serverId}/metrics?date_from=${encodeURIComponent(effectiveDateFrom)}&date_to=${encodeURIComponent(effectiveDateTo)}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('指标数据响应:', data); // 调试用
    
    // 检查数据结构，API直接返回指标数据对象
    if (!data || typeof data !== 'object') {
      throw new Error('API返回的指标数据格式不正确');
    }
    
    // 指标数据已经是正确格式，直接返回
    return data;
  } catch (error) {
    console.error('Failed to fetch metrics data:', error);
    throw error;
  }
} 
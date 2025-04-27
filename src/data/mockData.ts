import { ServerInfo, MetricsData } from '../types';
import { getServerInfo, getMetricsData } from '../api/hostingerApi';

// 默认值，作为回退方案，当API调用失败时使用
export const defaultServerInfo: ServerInfo = {
  "id": 660762,
  "firewall_group_id": null,
  "subscription_id": "169xVoUVxjhRpTOw",
  "plan": "KVM 2",
  "hostname": "srv660762.hstgr.cloud",
  "state": "running",
  "actions_lock": "unlocked",
  "cpus": 2,
  "memory": 8192,
  "disk": 102400,
  "bandwidth": 8192000,
  "ns1": "217.21.79.10",
  "ns2": "8.8.4.4",
  "ipv4": [
    {
      "id": 56876,
      "address": "82.180.162.81",
      "ptr": "srv660762.hstgr.cloud"
    }
  ],
  "ipv6": [
    {
      "id": 709191,
      "address": "2a02:4780:10:2e94::1",
      "ptr": "srv660762.hstgr.cloud"
    }
  ],
  "template": {
    "id": 1077,
    "name": "Ubuntu 24.04 LTS",
    "description": "Ubuntu is a computer operating system based on the Debian Linux distribution and distributed as free and open source software, using its own desktop environment. Ubuntu is designed primarily for use on personal computers, although a server edition also exists.",
    "documentation": null
  },
  "created_at": "2024-12-04T05:24:41Z"
};

export const defaultMetricsData: MetricsData = {
  "cpu_usage": {
    "unit": "%",
    "usage": {
      "1744933526": 100,
      "1744913708": 100,
      "1744854317": 70.44,
      "1745019919": 4.85,
      "1744964108": 83.1
    }
  },
  "ram_usage": {
    "unit": "bytes",
    "usage": {
      "1744933526": 6167052288,
      "1744913708": 6196678656,
      "1744854317": 5845606400,
      "1745019919": 3097477120,
      "1744964108": 3153772544
    }
  },
  "disk_space": {
    "unit": "bytes",
    "usage": {
      "1744933526": 39049068544,
      "1744913708": 39005417472,
      "1744854317": 36945338368,
      "1745019919": 38182723584,
      "1744964108": 37182390272
    }
  },
  "outgoing_traffic": {
    "unit": "bytes",
    "usage": {
      "1744933526": 766800,
      "1744913708": 3900600,
      "1744854317": 412828200,
      "1745019919": 84819600,
      "1744964108": 32329800
    }
  },
  "incoming_traffic": {
    "unit": "bytes",
    "usage": {
      "1744933526": 5626800,
      "1744913708": 5981400,
      "1744854317": 52291800,
      "1745019919": 6654600,
      "1744964108": 665298000
    }
  },
  "uptime": {
    "unit": "milliseconds",
    "usage": {
      "1744933526": 4406824,
      "1744913708": 4387023,
      "1744854317": 4327624,
      "1745019919": 62562,
      "1744964108": 6762
    }
  }
};

// 异步获取服务器信息
export async function fetchServerInfo(): Promise<ServerInfo> {
  try {
    return await getServerInfo();
  } catch (error) {
    console.error('Error fetching server info, using default data:', error);
    return defaultServerInfo;
  }
}

// 异步获取指标数据
export async function fetchMetricsData(
  dateFrom?: string, 
  dateTo?: string, 
  serverInfo?: ServerInfo
): Promise<MetricsData> {
  try {
    // 如果没有提供serverInfo，则获取服务器信息
    const serverInfoData = serverInfo || await fetchServerInfo();
    return await getMetricsData(serverInfoData.id, dateFrom, dateTo);
  } catch (error) {
    console.error('Error fetching metrics data, using default data:', error);
    return defaultMetricsData;
  }
}

// 保留这个函数用于测试或开发环境
export const generateExpandedMockData = (): MetricsData => {
  const now = Date.now();
  const expanded: MetricsData = {
    cpu_usage: { unit: '%', usage: {} },
    ram_usage: { unit: 'bytes', usage: {} },
    disk_space: { unit: 'bytes', usage: {} },
    outgoing_traffic: { unit: 'bytes', usage: {} },
    incoming_traffic: { unit: 'bytes', usage: {} },
    uptime: { unit: 'milliseconds', usage: {} },
  };
  
  // Generate 24 hours of data points at 15-minute intervals
  for (let i = 0; i < 96; i++) {
    const timestamp = Math.floor((now - (i * 15 * 60 * 1000)) / 1000).toString();
    
    // CPU usage fluctuates between 5% and 95%
    expanded.cpu_usage.usage[timestamp] = 5 + Math.random() * 90;
    
    // RAM usage between 2GB and 7GB (in bytes)
    expanded.ram_usage.usage[timestamp] = 2 * 1024 * 1024 * 1024 + Math.random() * 5 * 1024 * 1024 * 1024;
    
    // Disk space around 36-40GB (in bytes)
    expanded.disk_space.usage[timestamp] = 36 * 1024 * 1024 * 1024 + Math.random() * 4 * 1024 * 1024 * 1024;
    
    // Network traffic (in bytes)
    expanded.outgoing_traffic.usage[timestamp] = Math.random() * 500 * 1024 * 1024;
    expanded.incoming_traffic.usage[timestamp] = Math.random() * 700 * 1024 * 1024;
    
    // Uptime increases (in milliseconds)
    expanded.uptime.usage[timestamp] = i * 15 * 60 * 1000;
  }
  
  return expanded;
};

export const expandedMetricsData = generateExpandedMockData();
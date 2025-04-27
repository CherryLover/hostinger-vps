import React from 'react';
import { ServerInfo } from '../types';
import { formatBytes } from '../utils/formatters';
import StatusIndicator from './StatusIndicator';
import { ServerIcon, Clock, Cpu, MemoryStick, HardDrive, Activity, Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ServerInfoPanelProps {
  serverInfo: ServerInfo;
}

const ServerInfoPanel: React.FC<ServerInfoPanelProps> = ({ serverInfo }) => {
  const { showToast } = useToast();
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // 转换状态类型
  const getStatusType = (state: string): 'running' | 'stopped' | 'error' | 'warning' => {
    switch(state.toLowerCase()) {
      case 'active':
      case 'running':
        return 'running';
      case 'stopped':
      case 'inactive':
        return 'stopped';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'stopped';
    }
  };
  
  // 复制IP地址到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // 显示成功通知
        showToast('IP地址已复制到剪贴板', 'success');
      })
      .catch(err => {
        console.error('复制失败: ', err);
        showToast('复制失败，请重试', 'error');
      });
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center">
          <div className="p-2.5 bg-primary-100 rounded-md mr-3">
            <ServerIcon size={20} className="text-primary-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">{serverInfo.hostname}</h2>
            <p className="text-sm text-neutral-500">{serverInfo.plan}</p>
          </div>
        </div>
        <StatusIndicator status={getStatusType(serverInfo.state)} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center">
          <Cpu size={18} className="text-neutral-500 mr-2" />
          <div>
            <p className="text-sm text-neutral-500">CPU</p>
            <p className="font-medium">{serverInfo.cpus} Cores</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <MemoryStick size={18} className="text-neutral-500 mr-2" />
          <div>
            <p className="text-sm text-neutral-500">Memory</p>
            <p className="font-medium">{formatBytes(serverInfo.memory * 1024 * 1024, 0)}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <HardDrive size={18} className="text-neutral-500 mr-2" />
          <div>
            <p className="text-sm text-neutral-500">Disk</p>
            <p className="font-medium">{formatBytes(serverInfo.disk * 1024 * 1024, 0)}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Activity size={18} className="text-neutral-500 mr-2" />
          <div>
            <p className="text-sm text-neutral-500">Bandwidth</p>
            <p className="font-medium">{formatBytes(serverInfo.bandwidth * 1024, 0)}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-neutral-200 pt-4">
        <h3 className="font-medium mb-2">Network</h3>
        
        <div className="space-y-3">
          {serverInfo.ipv4.map((ip) => (
            <div key={ip.id} className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">IPv4</p>
              </div>
              <div className="flex items-center bg-neutral-100 rounded overflow-hidden">
                <p className="text-sm font-mono px-2 py-1 w-full overflow-hidden text-ellipsis" title={ip.address}>
                  {ip.address}
                </p>
                <button 
                  onClick={() => copyToClipboard(ip.address)} 
                  className="p-1.5 hover:bg-neutral-200 transition-colors"
                  title="复制IP地址"
                >
                  <Copy size={14} className="text-neutral-500" />
                </button>
              </div>
            </div>
          ))}
          
          {serverInfo.ipv6.map((ip) => (
            <div key={ip.id} className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">IPv6</p>
              </div>
              <div className="flex items-center bg-neutral-100 rounded overflow-hidden">
                <p className="text-sm font-mono px-2 py-1 w-full overflow-hidden text-ellipsis" title={ip.address}>
                  {ip.address}
                </p>
                <button 
                  onClick={() => copyToClipboard(ip.address)} 
                  className="p-1.5 hover:bg-neutral-200 transition-colors"
                  title="复制IP地址"
                >
                  <Copy size={14} className="text-neutral-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-neutral-200 pt-4 mt-4">
        <div className="flex items-center mb-2">
          <Clock size={16} className="text-neutral-400 mr-1.5" />
          <h3 className="font-medium">System</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-neutral-500">OS</p>
            <p className="text-sm font-medium">{serverInfo.template.name}</p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-sm text-neutral-500">Created</p>
            <p className="text-sm font-medium">{formatDate(serverInfo.created_at)}</p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-sm text-neutral-500">ID</p>
            <p className="text-sm font-mono">{serverInfo.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerInfoPanel;
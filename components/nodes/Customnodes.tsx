'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  User, 
  Database, 
  Cloud, 
  MessageCircle, 
  Search, 
  MapPin,
  Globe,
  Bot,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CustomNodeData {
  label: string;
  type: 'userInteraction' | 'process' | 'database' | 'api' | 'decision';
  description?: string;
  icon?: string;
}

const icons = {
  user: User,
  database: Database,
  cloud: Cloud,
  message: MessageCircle,
  search: Search,
  location: MapPin,
  globe: Globe,
  bot: Bot,
  file: FileText,
  settings: Settings,
  check: CheckCircle,
  alert: AlertCircle,
};

export default function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const typeStyles = {
    userInteraction: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      border: '2px solid #1d4ed8',
      color: '#ffffff',
    },
    process: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      border: '2px solid #047857',
      color: '#ffffff',
    },
    database: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      border: '2px solid #6d28d9',
      color: '#ffffff',
    },
    api: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      border: '2px solid #b45309',
      color: '#ffffff',
    },
    decision: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      border: '2px solid #b91c1c',
      color: '#ffffff',
    },
  };

  const IconComponent = data.icon ? icons[data.icon as keyof typeof icons] : Settings;
  const style = typeStyles[data.type];

  return (
    <div
      className={`px-6 py-4 shadow-2xl rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
        selected ? 'ring-4 ring-white/30 scale-105' : ''
      }`}
      style={{
        ...style,
        minWidth: '200px',
        maxWidth: '280px',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-300 border-2 border-white"
      />
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <IconComponent size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm leading-tight mb-1">{data.label}</h3>
          {data.description && (
            <p className="text-xs opacity-90 leading-relaxed">{data.description}</p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-300 border-2 border-white"
      />
    </div>
  );
}
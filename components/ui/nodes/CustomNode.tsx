"use client"

import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { 
  User, 
  Settings, 
  MapPin, 
  Database, 
  Bot, 
  Search, 
  Check,
  Building2
} from 'lucide-react'

const iconMap = {
  user: User,
  settings: Settings,
  location: MapPin,
  database: Database,
  bot: Bot,
  search: Search,
  check: Check,
  building: Building2,
}

const typeColors = {
  userInteraction: {
    bg: 'bg-blue-500',
    border: 'border-blue-400',
    text: 'text-blue-900'
  },
  process: {
    bg: 'bg-green-500',
    border: 'border-green-400',
    text: 'text-green-900'
  },
  database: {
    bg: 'bg-purple-500',
    border: 'border-purple-400',
    text: 'text-purple-900'
  },
  api: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-400',
    text: 'text-yellow-900'
  },
  decision: {
    bg: 'bg-red-500',
    border: 'border-red-400',
    text: 'text-red-900'
  }
}

interface CustomNodeData {
  label: string
  type: keyof typeof typeColors
  description: string
  icon: keyof typeof iconMap
}

interface CustomNodeProps {
  data: CustomNodeData
  isConnectable: boolean
}

export default function CustomNode({ data, isConnectable }: CustomNodeProps) {
  const IconComponent = iconMap[data.icon] || Settings
  const colors = typeColors[data.type] || typeColors.process

  return (
    <div className={`
      relative px-4 py-3 shadow-lg rounded-lg border-2 
      bg-white ${colors.border}
      min-w-[180px] max-w-[220px]
      hover:shadow-xl transition-all duration-300
    `}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
      
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          ${colors.bg}
        `}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        
        <div>
          <h3 className="font-bold text-sm text-gray-900 leading-tight">
            {data.label}
          </h3>
          <p className="text-xs text-gray-600 mt-1 leading-tight">
            {data.description}
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  )
}

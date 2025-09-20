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
  Building2,
  Globe,
  FileText,
  Cloud,
  MessageCircle
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
  globe: Globe,
  file: FileText,
  cloud: Cloud,
  message: MessageCircle,
}

const typeColors = {
  userInteraction: {
    bg: 'bg-primary',
    border: 'border-primary/50',
    text: 'text-foreground',
    iconBg: 'bg-primary',
    iconText: 'text-primary-foreground'
  },
  process: {
    bg: 'bg-accent',
    border: 'border-accent/50', 
    text: 'text-foreground',
    iconBg: 'bg-accent',
    iconText: 'text-accent-foreground'
  },
  database: {
    bg: 'bg-primary',
    border: 'border-primary/50',
    text: 'text-foreground',
    iconBg: 'bg-primary',
    iconText: 'text-primary-foreground'
  },
  api: {
    bg: 'bg-secondary',
    border: 'border-border',
    text: 'text-foreground',
    iconBg: 'bg-muted',
    iconText: 'text-muted-foreground'
  },
  decision: {
    bg: 'bg-destructive',
    border: 'border-destructive/50',
    text: 'text-foreground',
    iconBg: 'bg-destructive',
    iconText: 'text-destructive-foreground'
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
      relative px-4 py-3 shadow-lg rounded-xl border-2 
      bg-card/80 backdrop-blur-sm ${colors.border}
      min-w-[180px] max-w-[220px]
      hover:shadow-xl hover:scale-105 transition-all duration-300
      hover:bg-card/90 group
    `}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-muted-foreground !border-2 !border-background shadow-sm"
      />
      
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${colors.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300
        `}>
          <IconComponent className={`w-6 h-6 ${colors.iconText}`} />
        </div>
        
        <div>
          <h3 className="font-bold text-sm text-foreground leading-tight mb-1">
            {data.label}
          </h3>
          <p className="text-xs text-muted-foreground leading-tight">
            {data.description}
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-muted-foreground !border-2 !border-background shadow-sm"
      />
    </div>
  )
}

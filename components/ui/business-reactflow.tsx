"use client"

import React, { useCallback } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  NodeTypes,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import CustomNode from './nodes/CustomNode'
import { Users } from 'lucide-react'

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

const businessNodes = [
  // User Registration Flow
  {
    id: '1',
    type: 'custom',
    position: { x: 150, y: 50 },
    data: {
      label: 'User Access',
      type: 'userInteraction',
      description: 'Business owner visits Thikana platform',
      icon: 'user'
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 150, y: 180 },
    data: {
      label: 'Business Registration',
      type: 'process',
      description: 'Collect business info, category, contact details',
      icon: 'settings'
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 150, y: 310 },
    data: {
      label: 'Location Capture',
      type: 'process',
      description: 'GPS coordinates, address verification',
      icon: 'location'
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 150, y: 440 },
    data: {
      label: 'Business Database',
      type: 'database',
      description: 'Store business profiles with location data',
      icon: 'database'
    },
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 450, y: 440 },
    data: {
      label: 'Profile Vectorization',
      type: 'process',
      description: 'Generate embeddings for business profiles',
      icon: 'bot'
    },
  },
  {
    id: '6',
    type: 'custom',
    position: { x: 750, y: 440 },
    data: {
      label: 'Vector Database',
      type: 'database',
      description: 'Store business profile embeddings',
      icon: 'database'
    },
  },

  // Business Discovery Flow
  {
    id: '7',
    type: 'custom',
    position: { x: 150, y: 600 },
    data: {
      label: 'Location Search',
      type: 'userInteraction',
      description: 'User searches for businesses by location',
      icon: 'location'
    },
  },
  {
    id: '8',
    type: 'custom',
    position: { x: 450, y: 600 },
    data: {
      label: 'Geospatial Query',
      type: 'process',
      description: 'Process location-based search parameters',
      icon: 'search'
    },
  },
  {
    id: '9',
    type: 'custom',
    position: { x: 750, y: 600 },
    data: {
      label: 'Business Filtering',
      type: 'process',
      description: 'Filter by category, distance, ratings',
      icon: 'settings'
    },
  },
  {
    id: '10',
    type: 'custom',
    position: { x: 450, y: 730 },
    data: {
      label: 'Results Display',
      type: 'userInteraction',
      description: 'Show filtered business results to user',
      icon: 'check'
    },
  },
]

const businessEdges = [
  // Registration Flow
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 3 },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: '#3b82f6',
      width: 20,
      height: 20
    },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 3 },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: '#10b981',
      width: 20,
      height: 20
    },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 3 },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: '#10b981',
      width: 20,
      height: 20
    },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 3 },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: '#8b5cf6',
      width: 20,
      height: 20
    },
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 3 },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: '#10b981',
      width: 20,
      height: 20
    },
  },

  // Discovery Flow
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 3 },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: '#3b82f6',
      width: 20,
      height: 20
    },
  },
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 3 },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: '#10b981',
      width: 20,
      height: 20
    },
  },
  {
    id: 'e9-10',
    source: '9',
    target: '10',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 3 },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: '#10b981',
      width: 20,
      height: 20
    },
  },

  // Connection from database to discovery
  {
    id: 'e4-8',
    source: '4',
    target: '8',
    type: 'smoothstep',
    style: { 
      stroke: '#8b5cf6', 
      strokeWidth: 2, 
      strokeDasharray: '5,5' 
    },
    markerEnd: { 
      type: MarkerType.ArrowClosed, 
      color: '#8b5cf6',
      width: 16,
      height: 16
    },
    label: 'Business Data Access',
    labelStyle: {
      fill: '#8b5cf6',
      fontWeight: 'bold',
      fontSize: '11px',
    },
    labelBgStyle: {
      fill: 'white',
      fillOpacity: 0.9,
    },
  },
]

export function BusinessReactFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(businessNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(businessEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const minimapStyle = {
    height: 120,
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6 border border-accent/20 shadow-lg">
          <Users className="w-5 h-5 mr-3" />
          Business Registration & Discovery
        </div>
        <h3 className="text-4xl font-bold text-foreground mb-6">
          Complete Business Workflow
        </h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          From business registration to customer discovery - see the complete journey
        </p>
      </div>
      
      <div className="h-[600px] w-full border-2 border-border rounded-2xl overflow-hidden bg-white shadow-2xl">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          attributionPosition="bottom-left"
          className="bg-gray-50"
        >
          <Controls 
            className="bg-white border-gray-300 shadow-lg"
          />
          <MiniMap 
            style={minimapStyle}
            className="bg-white border border-gray-300 rounded-lg shadow-lg"
            maskColor="rgba(0, 0, 0, 0.1)"
            nodeColor={(node) => {
              const colors = {
                userInteraction: '#3b82f6',
                process: '#10b981',
                database: '#8b5cf6',
                api: '#f59e0b',
                decision: '#ef4444'
              }
              return colors[node.data?.type as keyof typeof colors] || '#6b7280'
            }}
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#d1d5db"
            className="bg-gray-50"
          />
        </ReactFlow>
      </div>
    </div>
  )
}

'use client';

import React, { useCallback } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from './nodes/CustomNode';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

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
];

const businessEdges = [
    // Registration Flow
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 3 }, // Indigo
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
    },
    {
        id: 'e2-3',
        source: '2',
        target: '3',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 3 }, // Violet
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
    },
    {
        id: 'e3-4',
        source: '3',
        target: '4',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 3 }, // Violet
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
    },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 3 }, // Indigo
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
    },
    {
        id: 'e5-6',
        source: '5',
        target: '6',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 3 }, // Violet
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
    },

    // Discovery Flow
    {
        id: 'e7-8',
        source: '7',
        target: '8',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 3 }, // Indigo
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
    },
    {
        id: 'e8-9',
        source: '8',
        target: '9',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 3 }, // Violet
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
    },
    {
        id: 'e9-10',
        source: '9',
        target: '10',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 3 }, // Violet
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
    },

    // Connection from database to discovery
    {
        id: 'e4-8',
        source: '4',
        target: '8',
        type: 'smoothstep',
        style: { stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '8,5' }, // Indigo dashed
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
        label: 'Business Data Access',
        labelStyle: { fill: '#0f172a', fontWeight: 600 },
        labelBgStyle: { fill: '#f1f5f9', fillOpacity: 0.8 },
    },
];

export default function BusinessFlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(businessNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(businessEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: any[]) => addEdge(params, eds)),
    [setEdges]
  );

  const minimapStyle = {
    height: 120,
    backgroundColor: 'hsl(var(--card))',
    border: '2px solid hsl(var(--border))',
    borderRadius: '12px',
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-background/50 rounded-xl"
        style={{ width: '100%', height: '100%' }}
      >
        <Controls 
          className="!bg-slate-800 !border-slate-700 rounded-lg shadow-lg"
          style={{
            background: 'rgb(30 41 59)',
            border: '1px solid rgb(51 65 85)',
            backdropFilter: 'blur(8px)',
          }}
        />
        <MiniMap 
          style={minimapStyle}
          className="!border-slate-700 shadow-lg"
          maskColor="rgba(0, 0, 0, 0.6)"
          nodeColor={(node: any) => {
            const colors = {
              userInteraction: '#8b5cf6',
              process: '#6366f1', 
              database: '#8b5cf6',
              api: '#6b7280',
              decision: '#ef4444'
            };
            return colors[node.data?.type as keyof typeof colors] || '#6b7280';
          }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#e2e8f0"
          className="bg-slate-50"
        />
      </ReactFlow>
    </div>
  );
}
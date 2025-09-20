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

const scrapingRagNodes = [
  // Web Scraping Pipeline
  {
    id: '1',
    type: 'custom',
    position: { x: 150, y: 50 },
    data: {
      label: 'Web Scraping Trigger',
      type: 'api',
      description: 'Scheduled/real-time article extraction',
      icon: 'globe'
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 150, y: 180 },
    data: {
      label: 'Content Extraction',
      type: 'process',
      description: 'Extract articles, news, local content',
      icon: 'file'
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 150, y: 310 },
    data: {
      label: 'Cloud Storage',
      type: 'api',
      description: 'Store scraped content in cloud',
      icon: 'cloud'
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 450, y: 310 },
    data: {
      label: 'Content Vectorization',
      type: 'process',
      description: 'Generate embeddings for scraped content',
      icon: 'bot'
    },
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 750, y: 310 },
    data: {
      label: 'Content Vector DB',
      type: 'database',
      description: 'Store content embeddings for RAG',
      icon: 'database'
    },
  },

  // RAG Chat System
  {
    id: '6',
    type: 'custom',
    position: { x: 150, y: 480 },
    data: {
      label: 'User Query',
      type: 'userInteraction',
      description: 'User asks question about local business',
      icon: 'message'
    },
  },
  {
    id: '7',
    type: 'custom',
    position: { x: 450, y: 480 },
    data: {
      label: 'Query Processing',
      type: 'process',
      description: 'Analyze query, extract intent and location',
      icon: 'search'
    },
  },
  {
    id: '8',
    type: 'custom',
    position: { x: 750, y: 480 },
    data: {
      label: 'Vector Search',
      type: 'process',
      description: 'Search content and business vectors',
      icon: 'search'
    },
  },
  {
    id: '9',
    type: 'custom',
    position: { x: 450, y: 610 },
    data: {
      label: 'Context Retrieval',
      type: 'process',
      description: 'Retrieve relevant content and businesses',
      icon: 'file'
    },
  },
  {
    id: '10',
    type: 'custom',
    position: { x: 150, y: 610 },
    data: {
      label: 'AI Response Generation',
      type: 'api',
      description: 'Generate response using RAG context',
      icon: 'bot'
    },
  },
  {
    id: '11',
    type: 'custom',
    position: { x: 150, y: 740 },
    data: {
      label: 'Response Delivery',
      type: 'userInteraction',
      description: 'Deliver personalized response to user',
      icon: 'check'
    },
  },

  // External Business Vector DB (referenced)
  {
    id: '12',
    type: 'custom',
    position: { x: 750, y: 610 },
    data: {
      label: 'Business Vector DB',
      type: 'database',
      description: 'Business profile embeddings (from Diagram 1)',
      icon: 'database'
    },
  },
];

const scrapingRagEdges = [
  // Web Scraping Pipeline
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#f59e0b' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--accent))' },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
  },

  // RAG Chat System
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--accent))' },
  },
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--accent))' },
  },
  {
    id: 'e9-10',
    source: '9',
    target: '10',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--accent))' },
  },
  {
    id: 'e10-11',
    source: '10',
    target: '11',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
  },

  // Cross-connections for RAG system
  {
    id: 'e5-8',
    source: '5',
    target: '8',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '8,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
    label: 'Content Vector Search',
    labelStyle: { fill: 'hsl(var(--foreground))', fontWeight: 600 },
    labelBgStyle: { fill: 'hsl(var(--background))', fillOpacity: 0.8 },
  },
  {
    id: 'e12-8',
    source: '12',
    target: '8',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '8,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
    label: 'Business Vector Search',
    labelStyle: { fill: 'hsl(var(--foreground))', fontWeight: 600 },
    labelBgStyle: { fill: 'hsl(var(--background))', fillOpacity: 0.8 },
  },
];

export default function ScrapingRagDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(scrapingRagNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(scrapingRagEdges);

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
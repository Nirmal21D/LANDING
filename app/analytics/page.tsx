"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Phone,
  ArrowLeft,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Search,
  Target,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [refreshing, setRefreshing] = useState(false)

  const overviewMetrics = [
    {
      title: "Total Views",
      value: "12,847",
      change: "+15.3%",
      changeType: "increase",
      icon: Eye,
      color: "text-blue-600",
      period: "vs last 30 days"
    },
    {
      title: "Profile Clicks",
      value: "3,426",
      change: "+8.7%",
      changeType: "increase",
      icon: MousePointer,
      color: "text-green-600",
      period: "vs last 30 days"
    },
    {
      title: "Direction Requests",
      value: "1,892",
      change: "+12.4%",
      changeType: "increase",
      icon: MapPin,
      color: "text-purple-600",
      period: "vs last 30 days"
    },
    {
      title: "Phone Calls",
      value: "567",
      change: "-3.2%",
      changeType: "decrease",
      icon: Phone,
      color: "text-orange-600",
      period: "vs last 30 days"
    }
  ]

  const viewsData = {
    daily: [45, 52, 48, 67, 73, 81, 79, 92, 88, 95, 102, 87, 94, 89, 96, 103, 108, 114, 121, 118, 125, 132, 129, 136, 142, 138, 145, 151, 148, 155],
    weekly: [420, 485, 502, 478, 523, 567, 589, 612, 634, 658, 672, 695, 701],
    monthly: [1847, 2103, 2245, 2387, 2456, 2689, 2834, 2987, 3142, 3298, 3456, 3623]
  }

  const deviceBreakdown = [
    { device: "Mobile", percentage: 68, count: 8736, color: "bg-blue-500" },
    { device: "Desktop", percentage: 24, count: 3083, color: "bg-green-500" },
    { device: "Tablet", percentage: 8, count: 1028, color: "bg-purple-500" }
  ]

  const searchTerms = [
    { term: "coffee near me", views: 2847, clicks: 456, ctr: "16.0%", trend: "+23%" },
    { term: "starbucks manhattan", views: 1923, clicks: 387, ctr: "20.1%", trend: "+18%" },
    { term: "best coffee shop", views: 1456, clicks: 234, ctr: "16.1%", trend: "+31%" },
    { term: "coffee delivery", views: 987, clicks: 145, ctr: "14.7%", trend: "+12%" },
    { term: "late night coffee", views: 756, clicks: 98, ctr: "13.0%", trend: "+8%" },
    { term: "starbucks hours", views: 634, clicks: 89, ctr: "14.0%", trend: "+5%" }
  ]

  const hourlyActivity = [
    { hour: "00", views: 12 }, { hour: "01", views: 8 }, { hour: "02", views: 5 },
    { hour: "03", views: 3 }, { hour: "04", views: 4 }, { hour: "05", views: 8 },
    { hour: "06", views: 28 }, { hour: "07", views: 65 }, { hour: "08", views: 98 },
    { hour: "09", views: 87 }, { hour: "10", views: 76 }, { hour: "11", views: 89 },
    { hour: "12", views: 134 }, { hour: "13", views: 156 }, { hour: "14", views: 142 },
    { hour: "15", views: 128 }, { hour: "16", views: 115 }, { hour: "17", views: 134 },
    { hour: "18", views: 167 }, { hour: "19", views: 189 }, { hour: "20", views: 145 },
    { hour: "21", views: 98 }, { hour: "22", views: 67 }, { hour: "23", views: 34 }
  ]

  const topPerformingContent = [
    { type: "Photo", title: "Store Front View", views: 3456, engagement: "23.4%", likes: 234 },
    { type: "Video", title: "Coffee Making Process", views: 2987, engagement: "18.7%", likes: 189 },
    { type: "Photo", title: "Interior Seating Area", views: 2456, engagement: "16.2%", likes: 156 },
    { type: "Photo", title: "Menu Board", views: 1987, engagement: "14.8%", likes: 123 },
    { type: "Post", title: "New Seasonal Menu", views: 1654, engagement: "19.3%", likes: 167 }
  ]

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  const maxViews = Math.max(...viewsData.daily)
  const maxHourlyViews = Math.max(...hourlyActivity.map(h => h.views))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="w-full flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/business-dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Analytics Overview</h1>
                <p className="text-sm text-muted-foreground">Detailed performance insights</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <AnimatedThemeToggler />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="space-y-8">

          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {overviewMetrics.map((metric, index) => (
              <Card key={index} className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      metric.color === 'text-blue-600' ? 'bg-blue-50 dark:bg-blue-950/20' :
                      metric.color === 'text-green-600' ? 'bg-green-50 dark:bg-green-950/20' :
                      metric.color === 'text-purple-600' ? 'bg-purple-50 dark:bg-purple-950/20' :
                      'bg-orange-50 dark:bg-orange-950/20'
                    }`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {metric.changeType === 'increase' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.period}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Views Over Time */}
            <div className="xl:col-span-2">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-primary" />
                    Views Over Time
                  </CardTitle>
                  <CardDescription>
                    Daily views trend for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full" />
                          <span className="text-sm font-medium">Profile Views</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">155</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-1 bg-muted/10 rounded-lg p-4">
                      {viewsData.daily.slice(-14).map((views, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="relative w-full bg-muted/30 rounded-sm overflow-hidden" style={{ height: '200px' }}>
                            <div 
                              className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-primary/70 rounded-sm transition-all duration-500 hover:from-primary/80 hover:to-primary/50"
                              style={{ height: `${(views / maxViews) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">{views}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Breakdown */}
            <div className="xl:col-span-1">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    Device Usage
                  </CardTitle>
                  <CardDescription>
                    How customers view your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deviceBreakdown.map((device, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {device.device === 'Mobile' && <Smartphone className="w-4 h-4 text-blue-600" />}
                          {device.device === 'Desktop' && <Monitor className="w-4 h-4 text-green-600" />}
                          {device.device === 'Tablet' && <Tablet className="w-4 h-4 text-purple-600" />}
                          <span className="text-sm font-medium">{device.device}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{device.percentage}%</p>
                          <p className="text-xs text-muted-foreground">{device.count.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${device.color} transition-all duration-500`}
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search Performance & Hourly Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Search Terms Performance */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Search Terms Performance
                </CardTitle>
                <CardDescription>
                  Top search queries driving traffic to your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchTerms.map((term, index) => (
                    <div key={index} className="p-4 bg-muted/10 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">"{term.term}"</h4>
                        <Badge variant="secondary" className="text-green-600 bg-green-50 dark:bg-green-950/20">
                          {term.trend}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Views</p>
                          <p className="font-semibold">{term.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Clicks</p>
                          <p className="font-semibold">{term.clicks}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CTR</p>
                          <p className="font-semibold text-primary">{term.ctr}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hourly Activity */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Hourly Activity Pattern
                </CardTitle>
                <CardDescription>
                  When customers are most active
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-1 h-32">
                    {hourlyActivity.map((hour, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div className="relative w-full bg-muted/30 rounded-sm overflow-hidden flex-1">
                          <div 
                            className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-primary/70 rounded-sm transition-all duration-300"
                            style={{ height: `${(hour.views / maxHourlyViews) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">{hour.hour}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Peak time: 7-8 PM</span>
                    <span className="font-semibold">189 views/hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Content */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Top Performing Content
              </CardTitle>
              <CardDescription>
                Your most engaging posts and media
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{content.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {content.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{content.views.toLocaleString()} views</span>
                          <span>{content.engagement} engagement</span>
                          <span>{content.likes} likes</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 bg-muted/30 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${parseFloat(content.engagement)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
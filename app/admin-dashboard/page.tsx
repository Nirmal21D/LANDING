"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Users, Building2, Search, TrendingUp, MapPin, Filter, Download, Settings, LogOut,
  MoreVertical, Eye, Edit, Trash2, Shield, BarChart3, Calendar, Clock,
  CheckCircle2, XCircle, AlertCircle, Activity, Globe, Zap, PieChart, TrendingDown,
  UserCheck, Bell, Star, MessageSquare, RefreshCw, Plus, ChevronDown, FileText,
  FileCheck, Database, DollarSign, Navigation, MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBusinesses, setSelectedBusinesses] = useState<number[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [currentView, setCurrentView] = useState('grid')
  const [refreshing, setRefreshing] = useState(false)

  // Enhanced statistics with trend indicators
  const enhancedStats = [
    {
      title: "Total Businesses",
      value: "1,234",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up" as const,
      change: "+12%",
      changeValue: "+134",
      description: "Active registered businesses"
    },
    {
      title: "Active Users",
      value: "8,456",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up" as const,
      change: "+8%",
      changeValue: "+612",
      description: "Monthly active business owners"
    },
    {
      title: "Revenue",
      value: "$45,678",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "up" as const,
      change: "+23%",
      changeValue: "+$8,542",
      description: "Total platform revenue"
    },
    {
      title: "Pending Reviews",
      value: "23",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "down" as const,
      change: "-15%",
      changeValue: "-4",
      description: "Awaiting admin approval"
    }
  ]

  // Sample business data with comprehensive information
  const businesses = [
    {
      id: 1,
      name: "Starbucks Coffee",
      category: "Food & Beverage",
      owner: "John Smith",
      location: "New York, NY",
      status: "approved",
      rating: 4.8,
      revenue: "25,000",
      subscriptionPlan: "Premium",
      joinDate: "2024-01-15",
      searchRanking: 1,
      tags: ["coffee", "cafe", "breakfast", "wifi"],
      reviews: 342
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      category: "Technology",
      owner: "Sarah Johnson",
      location: "San Francisco, CA",
      status: "pending",
      rating: 4.2,
      revenue: "45,000",
      subscriptionPlan: "Enterprise",
      joinDate: "2024-02-01",
      searchRanking: 5,
      tags: ["tech", "software", "consulting", "IT"],
      reviews: 128
    },
    {
      id: 3,
      name: "Green Garden Restaurant",
      category: "Food & Beverage",
      owner: "Mike Wilson",
      location: "Los Angeles, CA",
      status: "approved",
      rating: 4.6,
      revenue: "32,000",
      subscriptionPlan: "Standard",
      joinDate: "2024-01-20",
      searchRanking: 3,
      tags: ["restaurant", "organic", "healthy", "vegan"],
      reviews: 256
    },
    {
      id: 4,
      name: "Auto Repair Shop",
      category: "Automotive",
      owner: "David Brown",
      location: "Chicago, IL",
      status: "rejected",
      rating: 3.9,
      revenue: "18,000",
      subscriptionPlan: "Basic",
      joinDate: "2024-02-10",
      searchRanking: 12,
      tags: ["auto", "repair", "maintenance", "cars"],
      reviews: 89
    },
    {
      id: 5,
      name: "Fashion Boutique",
      category: "Retail",
      owner: "Emma Davis",
      location: "Miami, FL",
      status: "approved",
      rating: 4.4,
      revenue: "28,000",
      subscriptionPlan: "Standard",
      joinDate: "2024-01-25",
      searchRanking: 7,
      tags: ["fashion", "clothing", "boutique", "style"],
      reviews: 194
    }
  ]

  // Helper functions
  const handleSelectBusiness = (businessId: number) => {
    setSelectedBusinesses(prev => 
      prev.includes(businessId) 
        ? prev.filter(id => id !== businessId)
        : [...prev, businessId]
    )
  }

  const handleSelectAll = () => {
    const filtered = getFilteredBusinesses()
    setSelectedBusinesses(
      selectedBusinesses.length === filtered.length 
        ? [] 
        : filtered.map(b => b.id)
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for businesses:`, selectedBusinesses)
    setSelectedBusinesses([])
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  const getFilteredBusinesses = () => {
    return businesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = filterStatus === 'all' || business.status === filterStatus
      const matchesCategory = filterCategory === 'all' || business.category === filterCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        )
    }
  }

  const getSubscriptionBadge = (plan: string) => {
    const configs = {
      "Basic": { color: "bg-gray-100 text-gray-800", icon: "●" },
      "Standard": { color: "bg-blue-100 text-blue-800", icon: "●●" },
      "Premium": { color: "bg-purple-100 text-purple-800", icon: "●●●" },
      "Enterprise": { color: "bg-orange-100 text-orange-800", icon: "●●●●" }
    }
    const config = configs[plan as keyof typeof configs] || configs.Basic
    
    return (
      <Badge className={`${config.color} text-xs`}>
        {config.icon} {plan}
      </Badge>
    )
  }

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">
          {rating}
        </span>
      </div>
    )
  }

  const filteredBusinesses = getFilteredBusinesses()

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Business Management & Analytics Portal</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <AnimatedThemeToggler />
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-full">
        {/* Dashboard Actions Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-muted-foreground">Monitor and manage your business platform with advanced insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Business
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {enhancedStats.map((stat, index) => (
            <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-200 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      ({stat.changeValue})
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Primary Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Quick Actions Panel */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Most frequently used administrative functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Plus className="w-5 h-5" />
                    Add Business
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FileCheck className="w-5 h-5" />
                    Approve Pending
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="w-5 h-5" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Send Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Management */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Business Applications</CardTitle>
                    <CardDescription>
                      Latest business registrations and status updates
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search businesses, owners, or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Business List */}
                  <div className="space-y-4">
                    {filteredBusinesses.slice(0, 5).map((business) => (
                      <div key={business.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/30">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{business.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Category: {business.category}</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {business.location}
                              </span>
                              <span>Owner: {business.owner}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {getRatingStars(business.rating)}
                              <span className="text-xs text-muted-foreground">
                                ${business.revenue} revenue
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(business.status)}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Admin Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Quick Admin Actions</CardTitle>
                <CardDescription>
                  Administrative shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Users className="w-4 h-4" />
                  Manage Users
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Settings className="w-4 h-4" />
                  System Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest system activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Business Approved</p>
                      <p className="text-muted-foreground">Starbucks Coffee was approved</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-100 rounded-full">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">New Registration</p>
                      <p className="text-muted-foreground">Tech Solutions Inc registered</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-yellow-100 rounded-full">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Pending Review</p>
                      <p className="text-muted-foreground">Auto Repair Shop needs review</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Star, 
  MessageSquare, 
  ArrowLeft,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Reply,
  Send,
  Filter,
  Search,
  Download,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Heart,
  Share2,
  MoreHorizontal,
  Edit3,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const reviewStats = {
    averageRating: 4.6,
    totalReviews: 847,
    distribution: [
      { stars: 5, count: 523, percentage: 62 },
      { stars: 4, count: 186, percentage: 22 },
      { stars: 3, count: 85, percentage: 10 },
      { stars: 2, count: 34, percentage: 4 },
      { stars: 1, count: 19, percentage: 2 }
    ],
    recentTrend: "+12.3%",
    responseRate: "95%",
    averageResponseTime: "2.4 hours"
  }

  const reviews = [
    {
      id: 1,
      customerName: "Sarah Johnson",
      customerAvatar: "/placeholder-user.jpg",
      rating: 5,
      date: "2024-09-20",
      timeAgo: "5 days ago",
      verified: true,
      review: "Absolutely love this Starbucks location! The staff is incredibly friendly and always gets my order right. The atmosphere is perfect for working or catching up with friends. The Wi-Fi is fast and reliable. My go-to spot for morning coffee before work!",
      helpful: 12,
      businessReply: {
        date: "2024-09-21",
        text: "Thank you so much Sarah! We're thrilled to hear you enjoy our location. Our team works hard to create a welcoming environment for all our customers. We appreciate your loyalty!"
      },
      tags: ["service", "atmosphere", "wifi"],
      status: "responded"
    },
    {
      id: 2,
      customerName: "Mike Chen",
      customerAvatar: "/placeholder-user.jpg",
      rating: 4,
      date: "2024-09-18",
      timeAgo: "1 week ago",
      verified: true,
      review: "Great coffee and decent service. The baristas are skilled and the drinks are consistently good. Only complaint is that it can get quite crowded during peak hours, making it hard to find seating. Overall, a solid choice for quality coffee.",
      helpful: 8,
      businessReply: null,
      tags: ["coffee quality", "crowded", "service"],
      status: "pending"
    },
    {
      id: 3,
      customerName: "Jennifer Williams",
      customerAvatar: "/placeholder-user.jpg",
      rating: 5,
      date: "2024-09-15",
      timeAgo: "10 days ago",
      verified: false,
      review: "Best customer service I've experienced at any Starbucks! Emma, the manager, went above and beyond to help me with a complicated order for my office meeting. The team was efficient and friendly. Will definitely be back!",
      helpful: 15,
      businessReply: {
        date: "2024-09-15",
        text: "Jennifer, thank you for the wonderful feedback! Emma and our entire team strive to provide exceptional service. We're so happy we could make your office meeting a success!"
      },
      tags: ["customer service", "staff", "catering"],
      status: "responded"
    },
    {
      id: 4,
      customerName: "David Rodriguez",
      customerAvatar: "/placeholder-user.jpg",
      rating: 2,
      date: "2024-09-12",
      timeAgo: "2 weeks ago",
      verified: true,
      review: "Disappointed with my recent visit. Waited 15 minutes for a simple latte, and when I finally got it, the milk was burnt and the coffee was lukewarm. The staff seemed overwhelmed and disorganized. Expected better from this location.",
      helpful: 6,
      businessReply: null,
      tags: ["wait time", "drink quality", "staff issues"],
      status: "urgent"
    },
    {
      id: 5,
      customerName: "Lisa Thompson",
      customerAvatar: "/placeholder-user.jpg",
      rating: 5,
      date: "2024-09-10",
      timeAgo: "2 weeks ago",
      verified: true,
      review: "Clean, comfortable, and consistently excellent! I'm here almost daily for my morning routine. The seasonal drinks are always perfectly crafted, and the pastries are fresh. Love the cozy seating areas and the background music selection.",
      helpful: 9,
      businessReply: {
        date: "2024-09-11",
        text: "Lisa, we're so grateful for your daily visits and loyalty! It's customers like you who make our work meaningful. Thank you for being part of our coffee community!"
      },
      tags: ["cleanliness", "seasonal drinks", "atmosphere"],
      status: "responded"
    },
    {
      id: 6,
      customerName: "Robert Kim",
      customerAvatar: "/placeholder-user.jpg",
      rating: 3,
      date: "2024-09-08",
      timeAgo: "2 weeks ago",
      verified: true,
      review: "Average experience. Coffee was okay, nothing special. The location is convenient and parking is easy. Staff was polite but seemed rushed. Prices are what you'd expect from Starbucks. Might try other local coffee shops next time.",
      helpful: 4,
      businessReply: null,
      tags: ["average", "parking", "pricing"],
      status: "pending"
    }
  ]

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "5" && review.rating === 5) ||
                         (selectedFilter === "4" && review.rating === 4) ||
                         (selectedFilter === "3" && review.rating === 3) ||
                         (selectedFilter === "2" && review.rating === 2) ||
                         (selectedFilter === "1" && review.rating === 1) ||
                         (selectedFilter === "responded" && review.businessReply) ||
                         (selectedFilter === "pending" && !review.businessReply) ||
                         (selectedFilter === "urgent" && review.rating <= 2)
    
    const matchesSearch = searchQuery === "" || 
                         review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const handleReply = (reviewId: number) => {
    setReplyingTo(reviewId)
    setReplyText("")
  }

  const submitReply = () => {
    // Handle reply submission here
    console.log(`Replying to review ${replyingTo}: ${replyText}`)
    setReplyingTo(null)
    setReplyText("")
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const getStatusBadge = (status: string, rating: number) => {
    switch (status) {
      case 'responded':
        return <Badge variant="default" className="bg-green-100 text-green-800">Responded</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'urgent':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Urgent</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

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
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Customer Reviews</h1>
                <p className="text-sm text-muted-foreground">Manage and respond to feedback</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
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

          {/* Review Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{reviewStats.recentTrend}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-3xl font-bold">{reviewStats.averageRating}</p>
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(reviewStats.averageRating))}
                    <span className="text-sm text-muted-foreground">({reviewStats.totalReviews} reviews)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-3xl font-bold">{reviewStats.totalReviews}</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                  <p className="text-3xl font-bold">{reviewStats.responseRate}</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-3xl font-bold">{reviewStats.averageResponseTime}</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Rating Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of customer ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewStats.distribution.map((dist, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-16">
                      <span className="text-sm font-medium">{dist.stars}</span>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-20 text-right">
                      <span className="text-sm font-medium">{dist.count}</span>
                      <span className="text-sm text-muted-foreground">({dist.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    Filter Reviews
                  </CardTitle>
                  <CardDescription>
                    Filter and search through customer feedback
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                >
                  All Reviews
                </Button>
                <Button
                  variant={selectedFilter === "5" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("5")}
                  className="gap-1"
                >
                  <Star className="w-3 h-3" />
                  5 Stars
                </Button>
                <Button
                  variant={selectedFilter === "4" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("4")}
                  className="gap-1"
                >
                  <Star className="w-3 h-3" />
                  4 Stars
                </Button>
                <Button
                  variant={selectedFilter === "3" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("3")}
                  className="gap-1"
                >
                  <Star className="w-3 h-3" />
                  3 Stars
                </Button>
                <Button
                  variant={selectedFilter === "2" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("2")}
                  className="gap-1"
                >
                  <Star className="w-3 h-3" />
                  2 Stars
                </Button>
                <Button
                  variant={selectedFilter === "1" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("1")}
                  className="gap-1"
                >
                  <Star className="w-3 h-3" />
                  1 Star
                </Button>
                <div className="h-4 w-px bg-border mx-2" />
                <Button
                  variant={selectedFilter === "responded" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("responded")}
                  className="gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Responded
                </Button>
                <Button
                  variant={selectedFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("pending")}
                  className="gap-1"
                >
                  <Clock className="w-3 h-3" />
                  Pending
                </Button>
                <Button
                  variant={selectedFilter === "urgent" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("urgent")}
                  className="gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  Urgent
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{review.customerName}</h4>
                            {review.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                Verified
                              </Badge>
                            )}
                            {getStatusBadge(review.status, review.rating)}
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{review.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Review Content */}
                    <div className="pl-16">
                      <p className="text-sm leading-relaxed mb-3">{review.review}</p>
                      
                      {/* Review Tags */}
                      <div className="flex items-center gap-2 mb-3">
                        {review.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Review Actions */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Flag className="w-4 h-4" />
                          <span>Report</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>

                    {/* Business Reply */}
                    {review.businessReply && (
                      <div className="pl-16 pt-4 border-t border-border/30">
                        <div className="bg-muted/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1 bg-primary/10 rounded">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-semibold text-sm">Business Owner</span>
                            <span className="text-xs text-muted-foreground">
                              • {new Date(review.businessReply.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{review.businessReply.text}</p>
                        </div>
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === review.id && (
                      <div className="pl-16 pt-4 border-t border-border/30">
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Write your response..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <div className="flex items-center gap-2">
                            <Button size="sm" onClick={submitReply} className="gap-2">
                              <Send className="w-4 h-4" />
                              Send Reply
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reply Button */}
                    {!review.businessReply && replyingTo !== review.id && (
                      <div className="pl-16 pt-3 border-t border-border/30">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleReply(review.id)}
                        >
                          <Reply className="w-4 h-4" />
                          Reply to Review
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show message if no reviews match filter */}
          {filteredReviews.length === 0 && (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query to see more reviews.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
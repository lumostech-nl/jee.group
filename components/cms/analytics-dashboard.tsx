'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Eye,
  Calendar,
  Award,
  Target
} from 'lucide-react'

interface AnalyticsData {
  period: string
  metric: string
  analytics: {
    posts?: {
      total: number
      published: number
      drafts: number
      thisPeriod: number
      trend: number
    }
    views?: {
      total: number
      thisPeriod: number
      topPosts: Array<{
        id: string
        title: string
        slug: string
        views: number
        publishedAt: string
      }>
      trend: number
    }
    engagement?: {
      topCategories: Array<{
        id: string
        name: string
        slug: string
        postCount: number
      }>
      topTags: Array<{
        id: string
        name: string
        slug: string
        postCount: number
      }>
      topAuthors: Array<{
        id: string
        name: string
        email: string
        postCount: number
        totalViews: number
      }>
    }
    timeSeries?: {
      posts: Array<{
        date: string
        posts: number
        views: number
      }>
    }
  }
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')
  const [metric, setMetric] = useState('overview')

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?period=${period}&metric=${metric}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [period, metric])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" style={{ width: '60%' }} />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse" style={{ width: '40%' }} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    )
  }

  const { analytics } = data

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="posts">Posts</SelectItem>
            <SelectItem value="views">Views</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analytics.posts && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.posts.total}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.posts.published} published • {analytics.posts.drafts} drafts
              </p>
              <div className="flex items-center mt-1">
                {analytics.posts.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${analytics.posts.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analytics.posts.trend)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {analytics.views && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.views.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.views.thisPeriod.toLocaleString()} this period
              </p>
              <div className="flex items-center mt-1">
                {analytics.views.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${analytics.views.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(analytics.views.trend)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Views per Post</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.posts && analytics.views
                ? Math.round(analytics.views.total / analytics.posts.published || 0)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Engagement rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Authors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.engagement?.topAuthors.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Contributing writers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {analytics.posts && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Post Status Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of post statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Published</span>
                      <Badge variant="default">
                        {analytics.posts.published}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Drafts</span>
                      <Badge variant="secondary">
                        {analytics.posts.drafts}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Period</span>
                      <Badge variant="outline">
                        +{analytics.posts.thisPeriod}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Posts created in the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics.posts.thisPeriod}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    New posts created
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="views" className="space-y-4">
          {analytics.views && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Posts</CardTitle>
                  <CardDescription>
                    Most viewed posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.views.topPosts.slice(0, 5).map((post, index) => (
                      <div key={post.id} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">
                            {post.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {post.views.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Views Summary</CardTitle>
                  <CardDescription>
                    Total and period views
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">All Time</p>
                      <p className="text-2xl font-bold">
                        {analytics.views.total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">This Period</p>
                      <p className="text-2xl font-bold">
                        {analytics.views.thisPeriod.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>
                  Most popular categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.engagement?.topCategories.slice(0, 5).map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="outline">
                        {category.postCount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Tags</CardTitle>
                <CardDescription>
                  Most used tags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.engagement?.topTags.slice(0, 5).map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between">
                      <span className="text-sm">{tag.name}</span>
                      <Badge variant="outline">
                        {tag.postCount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Authors</CardTitle>
                <CardDescription>
                  Most active contributors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.engagement?.topAuthors.slice(0, 5).map((author) => (
                    <div key={author.id} className="flex items-center justify-between">
                      <span className="text-sm">{author.name}</span>
                      <Badge variant="outline">
                        {author.postCount} posts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

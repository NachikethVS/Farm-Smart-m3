"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, ThumbsUp, Share, Plus, Search, TrendingUp, Award, Calendar, MapPin } from "lucide-react"

const posts = [
  {
    id: 1,
    author: {
      name: "Rajesh Kumar",
      avatar: "/placeholder.svg?height=40&width=40&text=RK",
      location: "Punjab, India",
      expertise: "Wheat Farming",
      reputation: 4.8,
    },
    content:
      "Just harvested my wheat crop and got 45 quintals per acre! The key was using the right fertilizer combination and proper irrigation timing. Happy to share my experience with fellow farmers.",
    image: "/placeholder.svg?height=300&width=400&text=Wheat+Harvest",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    shares: 3,
    tags: ["wheat", "harvest", "fertilizer"],
  },
  {
    id: 2,
    author: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40&text=PS",
      location: "Maharashtra, India",
      expertise: "Organic Farming",
      reputation: 4.6,
    },
    content:
      "Has anyone tried neem oil for controlling aphids on tomatoes? I'm looking for organic alternatives to chemical pesticides. Would love to hear your experiences!",
    timestamp: "4 hours ago",
    likes: 18,
    comments: 12,
    shares: 2,
    tags: ["organic", "tomatoes", "pest-control"],
  },
  {
    id: 3,
    author: {
      name: "Suresh Patel",
      avatar: "/placeholder.svg?height=40&width=40&text=SP",
      location: "Gujarat, India",
      expertise: "Cotton Farming",
      reputation: 4.9,
    },
    content:
      "Weather forecast shows heavy rains next week. Should I delay my cotton sowing or proceed as planned? The soil moisture is already good from last week's showers.",
    timestamp: "6 hours ago",
    likes: 15,
    comments: 9,
    shares: 1,
    tags: ["cotton", "weather", "sowing"],
  },
]

const trendingTopics = [
  { topic: "Monsoon Preparation", posts: 156 },
  { topic: "Organic Fertilizers", posts: 89 },
  { topic: "Crop Insurance", posts: 67 },
  { topic: "Drip Irrigation", posts: 45 },
  { topic: "Pest Management", posts: 78 },
]

const experts = [
  {
    name: "Dr. Amit Singh",
    expertise: "Soil Science",
    followers: 2340,
    avatar: "/placeholder.svg?height=50&width=50&text=AS",
  },
  {
    name: "Kavita Reddy",
    expertise: "Organic Farming",
    followers: 1890,
    avatar: "/placeholder.svg?height=50&width=50&text=KR",
  },
  {
    name: "Ravi Gupta",
    expertise: "Crop Protection",
    followers: 1567,
    avatar: "/placeholder.svg?height=50&width=50&text=RG",
  },
]

export default function Community() {
  const [newPost, setNewPost] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Community 👥</h1>
            <p className="text-muted-foreground">Connect, share knowledge, and learn from fellow farmers</p>
          </div>
          <Button onClick={() => setShowNewPost(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search discussions, topics, or farmers..." className="pl-10" />
                </div>
              </CardContent>
            </Card>

            {/* New Post Form */}
            {showNewPost && (
              <Card>
                <CardHeader>
                  <CardTitle>Share with the Community</CardTitle>
                  <CardDescription>Ask questions, share experiences, or start a discussion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind? Share your farming experience, ask for advice, or start a discussion..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Add Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        Add Tags
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setShowNewPost(false)}>
                        Cancel
                      </Button>
                      <Button>Post</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {post.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{post.author.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          <Award className="mr-1 h-3 w-3" />
                          {post.author.reputation}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{post.author.expertise}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {post.author.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {post.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{post.content}</p>

                  {post.image && (
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post content"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Share className="mr-1 h-4 w-4" />
                        {post.shares}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">#{topic.topic}</span>
                      <Badge variant="secondary" className="text-xs">
                        {topic.posts} posts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Experts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="mr-2 h-5 w-5" />
                  Featured Experts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experts.map((expert, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {expert.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{expert.name}</h4>
                        <p className="text-xs text-muted-foreground">{expert.expertise}</p>
                        <p className="text-xs text-muted-foreground">{expert.followers} followers</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="mr-2 h-5 w-5" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Members</span>
                    <span className="font-semibold">12,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Posts Today</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Questions Answered</span>
                    <span className="font-semibold">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expert Responses</span>
                    <span className="font-semibold">45</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

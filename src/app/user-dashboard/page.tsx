/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { BarChart3, Users, ShoppingCart, Wallet, Clock, Award, Plane, ArrowUp, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DashboardShell } from "./_components/dashboard-shell"
import { DashboardHeader } from "./_components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - would come from API in real implementation
const dashboardData = {
  purchaseCount: 12,
  totalIncome: 45600,
  teamCount: 28,
  referralIncome: 12500,
  salary: 25000,
  promotionalIncome: 8100,
  reward: 5000,
  tour: "Goa Retreat - June 2025",
  activeTeam: 22,
  powerTeam: 28,
  daysRemaining: 23,
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good day")
  const [userData, setUserData] = useState({
    title: "Mr.",
    firstName: "Mehul",
    surname: "Singh",
  })

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // In a real app, we would fetch user data here
    // fetchUserData().then(data => setUserData(data))
  }, [])

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        {/* Top Section with User Welcome and Trial Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-amber-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-orange-800">
              {greeting}, {userData.title} {userData.firstName} {userData.surname}
            </h1>
            <p className="text-orange-600 mt-1">Welcome to your dashboard. Here&#39;s an overview of your account.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Card className="bg-amber-50 border-amber-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-amber-800">Free Trial</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-lg font-bold text-amber-800">{dashboardData.daysRemaining} days remaining</span>
                  </div>
                  <Progress value={(dashboardData.daysRemaining / 30) * 100} className="h-2 mt-2 bg-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Button className="bg-orange-600 hover:bg-orange-700 shadow-md transition-all">Subscribe Now</Button>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm hover:shadow transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-orange-800">Total Income</CardTitle>
                <div className="p-2 bg-white rounded-full">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">₹{dashboardData.totalIncome.toLocaleString()}</div>
              <div className="flex items-center mt-1 text-sm text-orange-700">
                <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                <span>₹8,500 from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm hover:shadow transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-amber-800">Team Growth</CardTitle>
                <div className="p-2 bg-white rounded-full">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{dashboardData.teamCount} Members</div>
              <div className="flex items-center mt-1 text-sm text-amber-700">
                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                <span>4 new members this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-yellow-800">Active Team</CardTitle>
                <div className="p-2 bg-white rounded-full">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">{dashboardData.activeTeam} / {dashboardData.powerTeam}</div>
              <div className="flex items-center mt-1 text-sm text-yellow-700">
                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                <span>3 active members this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="earnings" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-orange-50 text-orange-800">
            <TabsTrigger value="earnings" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Earnings</TabsTrigger>
            <TabsTrigger value="incentives" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Incentives</TabsTrigger>
          </TabsList>
          
          <TabsContent value="earnings" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Purchase Count</CardTitle>
                    <CardDescription>Total purchases made</CardDescription>
                  </div>
                  <div className="rounded-full p-2 bg-orange-100">
                    <ShoppingCart className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.purchaseCount}</div>
                  <p className="text-xs text-emerald-600 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Referral Income</CardTitle>
                    <CardDescription>From your network</CardDescription>
                  </div>
                  <div className="rounded-full p-2 bg-orange-100">
                    <Wallet className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{dashboardData.referralIncome.toLocaleString()}</div>
                  <p className="text-xs text-emerald-600 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +₹2,300 from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Salary</CardTitle>
                    <CardDescription>Base compensation</CardDescription>
                  </div>
                  <div className="rounded-full p-2 bg-orange-100">
                    <Wallet className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{dashboardData.salary.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Same as last month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Promotional Income</CardTitle>
                    <CardDescription>From special campaigns</CardDescription>
                  </div>
                  <div className="rounded-full p-2 bg-orange-100">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{dashboardData.promotionalIncome.toLocaleString()}</div>
                  <p className="text-xs text-emerald-600 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +₹1,200 from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="incentives" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Performance Reward</CardTitle>
                    <CardDescription>Achievement bonus</CardDescription>
                  </div>
                  <div className="rounded-full p-2 bg-orange-100">
                    <Award className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{dashboardData.reward.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">For exceeding targets</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Team Retreat</CardTitle>
                    <CardDescription>Upcoming incentive tour</CardDescription>
                  </div>
                  <div className="rounded-full p-2 bg-orange-100">
                    <Plane className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.tour}</div>
                  <p className="text-xs text-muted-foreground">Qualifications end May 15, 2025</p>
                  <div className="mt-3">
                    <Progress value={68} className="h-2" />
                    <p className="text-xs text-right mt-1">68% qualification achieved</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Users, ShoppingCart, Wallet, Clock, Award, Plane, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data - would come from API in real implementation
// Remove this mock data
// const dashboardData = {
//   purchaseCount: 12,
//   totalIncome: 45600,
//   mainTeam: 12,
//   activeTeam: 22,
//   totalTeam: 28,
//   referralIncome: 12500,
//   salary: 25000,
//   promotionalIncome: 8100,
//   reward: 5000,
//   tour: "Goa Retreat - June 2025",
//   daysRemaining: 23,
// };

export default function DashboardPage() {
  const router = useRouter()
  const [greeting, setGreeting] = useState("Good day")
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
    role?: string
  } | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(5)

  // Add these state variables after the existing useState declarations
  const [dashboardData, setDashboardData] = useState({
    purchaseCount: 0,
    totalIncome: 0,
    mainTeam: 0,
    activeTeam: 0,
    totalTeam: 0,
    referralIncome: 0,
    salary: 25000,
    promotionalIncome: 8100,
    reward: 5000,
    tour: "Goa Retreat - June 2025",
    daysRemaining: 23,
  })
  const [referralDataLoading, setReferralDataLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/profile")
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error)
        }

        setUser(data)

        // If the API returns a role, set it
        if (data.role) {
          setUserRole(data.role)
          localStorage.setItem("userRole", data.role)
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    // Get role from localStorage if not yet set
    if (!userRole) {
      const role = localStorage.getItem("userRole")
      if (role) {
        setUserRole(role)
      }
    }

    // Check if we need to redirect based on role
    if (userRole && userRole !== "user" && !redirecting) {
      setRedirecting(true)
    }
  }, [userRole, redirecting])

  // Handle countdown and redirection
  useEffect(() => {
    if (redirecting && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (redirecting && redirectCountdown === 0) {
      router.push("/seller-dashboard")
    }
  }, [redirecting, redirectCountdown, router])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  // Add this function after the existing useEffect hooks
  useEffect(() => {
    async function fetchReferralData() {
      try {
        const res = await fetch("/api/referals")
        if (!res.ok) {
          throw new Error("Failed to fetch referral data")
        }
        const data = await res.json()

        // Update dashboard data with referral information
        setDashboardData({
          ...dashboardData,
          totalIncome: data.totalEarnings, // Set total income to referral total earnings
          totalTeam: data.totalReferrals, // Set total team to total referrals
          activeTeam: data.activeReferrals, // Set active team to active referrals
          referralIncome: data.totalEarnings, // Keep referral income same as total income
          promotionalIncome: data.promotionalRanking?.monthlyBonus || 0, // Set promotional income to monthly bonus
          salary: 2500000 + (data.promotionalRanking?.monthlyBonus || 0), // Add monthly bonus to base salary
          purchaseCount: calculateTotalPurchases(data), // Calculate total purchases from referral network
          mainTeam: data.referralsByDegree && data.referralsByDegree["1"] ? data.referralsByDegree["1"].length : 0, // Direct referrals
        })
      } catch (err) {
        console.error("Error fetching referral data:", err)
      } finally {
        setReferralDataLoading(false)
      }
    }

    // Helper function to calculate total purchases from referral data
    function calculateTotalPurchases(data: { referralsByDegree: { [s: string]: unknown } | ArrayLike<unknown> }) {
      let totalPurchases = 0

      // If we have referralsByDegree data, calculate purchases
      if (data.referralsByDegree) {
        // Loop through all degrees
        Object.values(data.referralsByDegree).forEach((referrals) => {
          // Count active referrals as they have purchased at least one product
          ;(referrals as { status: string }[]).forEach((referral) => {
            if (referral.status === "active") {
              totalPurchases++
            }
          })
        })
      }

      return totalPurchases
    }

    // Only fetch referral data if user is loaded and not redirecting
    if (user && !redirecting) {
      fetchReferralData()
    }
  }, [user, redirecting])

  // Show redirection message if needed
  if (redirecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTitle className="text-xl font-bold text-amber-800">Redirecting to Seller Dashboard</AlertTitle>
            <AlertDescription className="mt-4">
              <p className="text-amber-700 mb-4">
                Your account has a <span className="font-bold">{userRole}</span> role, which requires a different
                dashboard. You will be redirected in {redirectCountdown} seconds.
              </p>
              <div className="flex items-center gap-3">
                <Progress value={(redirectCountdown / 5) * 100} className="h-2 bg-amber-200" />
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => router.push("/seller-dashboard")}>
                  Go Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Modify the existing loading check to include referralDataLoading
  if (loading || referralDataLoading) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>
  }

  // Show error state
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Section with User Welcome and Trial Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-amber-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-orange-800">
            {greeting}, {user ? user.name : "Guest"}
          </h1>

          <p className="text-orange-600 mt-1">Welcome to your dashboard. Here&#39;s an overview of your account.</p>
        </div>

         <div className="flex flex-col sm:flex-row items-start gap-4 max-w-md">
      <Card className="w-full bg-amber-50 border-amber-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-amber-800 mb-1">Free Trial</div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-lg font-bold text-amber-800">{dashboardData.daysRemaining} days remaining</span>
            </div>
            <Progress value={(dashboardData.daysRemaining / 30) * 100} className="h-2 bg-amber-200" />
          </div>
        </CardContent>
      </Card>
      
      <Button className="w-full sm:w-auto px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center">
        <span>Subscribe Now</span>
        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </Button>
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
            <div className="text-3xl font-bold text-orange-900">
              ₹{(dashboardData.totalIncome / 100).toLocaleString()}
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
            <div className="text-3xl font-bold text-amber-900">{dashboardData.totalTeam} Members</div>
            <div className="flex items-center mt-1 text-sm text-amber-700">
              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
              <span>4 new members this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-yellow-800">Team Breakdown</CardTitle>
              <div className="p-2 bg-white rounded-full">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs font-medium text-yellow-700">Main</div>
                <div className="text-xl font-bold text-yellow-900">{dashboardData.mainTeam}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-yellow-700">Active</div>
                <div className="text-xl font-bold text-yellow-900">{dashboardData.activeTeam}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-yellow-700">Total</div>
                <div className="text-xl font-bold text-yellow-900">{dashboardData.totalTeam}</div>
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-yellow-700">
              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
              <span>3 active members this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="earnings" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 bg-orange-50 text-orange-800">
          <TabsTrigger value="earnings" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            Earnings
          </TabsTrigger>
          <TabsTrigger value="incentives" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            Incentives
          </TabsTrigger>
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
                <div className="text-2xl font-bold">₹{(dashboardData.referralIncome / 100).toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">Salary</CardTitle>
                  <CardDescription>Base + Promotional Bonus</CardDescription>
                </div>
                <div className="rounded-full p-2 bg-orange-100">
                  <Wallet className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(dashboardData.salary / 100).toLocaleString()}</div>
                <p className="text-xs text-green-600">Includes promotional bonus</p>
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
                <div className="text-2xl font-bold">₹{(dashboardData.promotionalIncome / 100).toLocaleString()}</div>
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
                <div className="text-2xl font-bold">₹{(dashboardData.reward / 100).toLocaleString()}</div>
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
  )
}


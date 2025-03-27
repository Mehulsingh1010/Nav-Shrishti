"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ReferralData {
  referralCode: string
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  referrals: {
    id: number
    name: string
    date: string
    status: string
    earnings: number
  }[]
}

export default function ReferralsPage() {
  const { toast } = useToast()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch referral data
    const fetchReferralData = async () => {
      try {
        const response = await fetch("/api/referals")
        if (!response.ok) {
          throw new Error("Failed to fetch referral data")
        }
        const data = await response.json()
        setReferralData(data)
      } catch (error) {
        console.error("Error fetching referral data:", error)
        toast({
          title: "Error",
          description: "Failed to load referral data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReferralData()
  }, [toast])

  const copyReferralLink = () => {
    const referralLink = typeof window !== "undefined" ? `${window.location.origin}/auth/register?ref=${referralData?.referralCode}` : ""
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
  }

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}/auth/register?ref=${referralData?.referralCode}`
    if (navigator.share) {
      navigator.share({
        title: "Join वैदिक भारत",
        text: "Join वैदिक भारत using my referral link!",
        url: referralLink,
      })
    } else {
      copyReferralLink()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center animate-spin-slow justify-center min-h-screen bg-orange-50 relative">
        <svg viewBox="0 0 200 200" className="absolute w-48 h-48 ">
          <path
            id="circlePath"
            fill="transparent"
            d="M 100, 100 m -90, 0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
          />
          <text fill="#b45309" fontSize="14" fontWeight="bold">
            <textPath xlinkHref="#circlePath" startOffset="50%">
              ॐ नमः शिवाय • हरे कृष्ण हरे राम • श्री राम जय राम जय जय राम • ॐ गं गणपतये नमः • ॐ ह्रीं क्लीं महालक्ष्म्यै नमः •
            </textPath>
          </text>
        </svg>
      </div>
    )
  }

  if (!referralData) {
    return null
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">Referral Program</h1>
          <p className="text-muted-foreground">Invite friends and earn rewards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-800">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-700 mr-3" />
              <span className="text-3xl font-bold">{referralData.totalReferrals}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-800">Active Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-700 mr-3" />
              <span className="text-3xl font-bold">{referralData.activeReferrals}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-800">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-3xl font-bold">₹{(referralData.totalEarnings / 100).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>Share this link with friends to earn rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  value={typeof window !== "undefined" ? `${window.location.origin}/auth/register?ref=${referralData.referralCode}` : ""}
                  readOnly
                  className="bg-orange-50"
                />
              </div>
                <Button
                onClick={() => {
                  copyReferralLink()
                  const button = document.getElementById("copy-button")
                  if (button) {
                  button.textContent = "Copied!"
                  setTimeout(() => {
                    button.textContent = "Copy Link"
                  }, 1000)
                  }
                }}
                id="copy-button"
                className="bg-orange-700 hover:bg-orange-800"
                >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
                </Button>
              <Button onClick={shareReferralLink} variant="outline" className="border-orange-700 text-orange-700">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Your referral code: <span className="font-semibold">{referralData.referralCode}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>Track your referrals and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">All Referrals</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ReferralTable referrals={referralData.referrals} />
              </TabsContent>
              <TabsContent value="active">
                <ReferralTable referrals={referralData.referrals.filter((r) => r.status === "active")} />
              </TabsContent>
              <TabsContent value="inactive">
                <ReferralTable referrals={referralData.referrals.filter((r) => r.status === "inactive")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Learn about our referral program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-700">1</span>
                </div>
                <h3 className="font-semibold mb-2">Share Your Link</h3>
                <p className="text-sm text-muted-foreground">Share your unique referral link with friends and family</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-700">2</span>
                </div>
                <h3 className="font-semibold mb-2">They Register</h3>
                <p className="text-sm text-muted-foreground">
                  When they register using your link, they become your referral
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-700">3</span>
                </div>
                <h3 className="font-semibold mb-2">Earn Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Earn ₹500 for each successful referral who completes registration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ReferralTable({ referrals }: { referrals: ReferralData["referrals"] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No referrals found
              </TableCell>
            </TableRow>
          ) : (
            referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell className="font-medium">{referral.name}</TableCell>
                <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      referral.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {referral.status === "active" ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">₹{(referral.earnings / 100).toFixed(2)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

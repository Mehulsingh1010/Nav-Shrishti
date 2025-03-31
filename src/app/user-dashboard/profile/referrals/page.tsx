/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2, Users, ChevronDown, ChevronUp, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PromotionalRankings from "@/components/promotional-rankings"

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
    degree: number
  }[]
  referralsByDegree: Record<
    number,
    {
      id: number
      name: string
      date: string
      status: string
      earnings: number
      referenceId: string
    }[]
  >
  earningsSummary: {
    degree: number
    earnings: number
    percentage: number
  }[]
  promotionalRanking?: {
    currentRank: number
    totalNetworkSales: number
    monthlyBonus: number
    nextRankThreshold: number | null
    remainingAmount: number
    progressPercentage: number
  }
}

export default function ReferralsPage() {
  const { toast } = useToast()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedDegrees, setExpandedDegrees] = useState<Record<number, boolean>>({ 1: true })
  const [activeTab, setActiveTab] = useState("overview")

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
    const referralLink =
      typeof window !== "undefined" ? `${window.location.origin}/auth/register?ref=${referralData?.referralCode}` : ""
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

  const toggleDegreeExpansion = (degree: number) => {
    setExpandedDegrees((prev) => ({
      ...prev,
      [degree]: !prev[degree],
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center animate-spin-slow justify-center min-h-screen bg-orange-50 relative">
        <svg viewBox="0 0 200 200" className="absolute w-48 h-48 ">
          <path id="circlePath" fill="transparent" d="M 100, 100 m -90, 0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
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

  // Format currency values in Indian format (with lakhs and crores)
  const formatIndianCurrency = (amount: number) => {
    // Convert paise to rupees
    const amountInRupees = amount / 100

    // Format in Indian number system (with commas)
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })

    return formatter.format(amountInRupees)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">Referral Program</h1>
          <p className="text-muted-foreground">Invite friends and earn rewards</p>
        </div>
        {referralData.promotionalRanking && (
          <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
            <Award className="h-5 w-5 text-orange-700" />
            <span className="font-medium text-orange-800">Level {referralData.promotionalRanking.currentRank}</span>
            {referralData.promotionalRanking.monthlyBonus > 0 && (
              <span className="text-green-700 font-medium">
                +{formatIndianCurrency(referralData.promotionalRanking.monthlyBonus*100)}
              </span>
            )}
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="promotional-rankings">Promotional Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
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
                  <span className="text-3xl font-bold">{formatIndianCurrency(referralData.totalEarnings)}</span>
                  {referralData.promotionalRanking && referralData.promotionalRanking.monthlyBonus > 0 && (
                    <span className="ml-2 text-green-700 font-medium">
                      +{formatIndianCurrency(referralData.promotionalRanking.monthlyBonus * 100)}
                    </span>
                  )}
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
                      value={
                        typeof window !== "undefined"
                          ? `${window.location.origin}/auth/register?ref=${referralData.referralCode}`
                          : ""
                      }
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
                <CardTitle>Earnings by Level</CardTitle>
                <CardDescription>Your commission earnings from each referral level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>Commission Rate</TableHead>
                        <TableHead className="text-right">Earnings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referralData.earningsSummary && referralData.earningsSummary.length > 0 ? (
                        referralData.earningsSummary.map((level) => (
                          <TableRow key={level.degree}>
                            <TableCell>
                              {level.degree === 1
                                ? "1st Degree (Direct)"
                                : level.degree === 2
                                  ? "2nd Degree"
                                  : level.degree === 3
                                    ? "3rd Degree"
                                    : `${level.degree}th Degree`}
                            </TableCell>
                            <TableCell>{level.percentage}%</TableCell>
                            <TableCell className="text-right">{formatIndianCurrency(level.earnings)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                            No earnings yet
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow className="bg-orange-50">
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-bold">
                          {formatIndianCurrency(referralData.totalEarnings)}
                          {referralData.promotionalRanking && referralData.promotionalRanking.monthlyBonus > 0 && (
                            <span className="ml-2 text-green-700">
                              +{formatIndianCurrency(referralData.promotionalRanking.monthlyBonus*100)}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Referral Team</CardTitle>
                <CardDescription>View your complete referral network</CardDescription>
              </CardHeader>
              <CardContent>
                {referralData.referralsByDegree && Object.keys(referralData.referralsByDegree).length > 0 ? (
                  Object.entries(referralData.referralsByDegree)
                    .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
                    .map(([degree, referrals]) => (
                      <Collapsible key={degree} open={expandedDegrees[Number.parseInt(degree)]} className="mb-4">
                        <div className="flex items-center justify-between bg-orange-50 p-3 rounded-t-md">
                          <div className="flex items-center gap-2">
                            <CollapsibleTrigger
                              onClick={() => toggleDegreeExpansion(Number.parseInt(degree))}
                              className="flex items-center"
                            >
                              {expandedDegrees[Number.parseInt(degree)] ? (
                                <ChevronUp className="h-5 w-5 text-orange-700" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-orange-700" />
                              )}
                            </CollapsibleTrigger>
                            <h3 className="font-semibold text-orange-800">
                              {degree === "1"
                                ? "1st Degree (Direct Referrals)"
                                : degree === "2"
                                  ? "2nd Degree Referrals"
                                  : degree === "3"
                                    ? "3rd Degree Referrals"
                                    : `${degree}th Degree Referrals`}
                            </h3>
                          </div>
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                            {referrals.length} {referrals.length === 1 ? "member" : "members"}
                          </Badge>
                        </div>

                        <CollapsibleContent>
                          <div className="rounded-b-md border border-t-0">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Date Joined</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Earnings Generated</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {referrals.map((referral) => (
                                  <TableRow key={referral.id}>
                                    <TableCell className="font-medium">{referral.name}</TableCell>
                                    <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          referral.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {referral.status === "active" ? "Active" : "Inactive"}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {formatIndianCurrency(referral.earnings)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    You don't have any referrals yet. Share your referral link to start building your team!
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Learn about our multi-level referral program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold mb-2 text-orange-800">Commission Structure</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-200">7%</Badge>
                        <span>1st Degree (Direct Referrals)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-200">5%</Badge>
                        <span>2nd Degree Referrals</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-200">3%</Badge>
                        <span>3rd Degree Referrals</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-200">1%</Badge>
                        <span>4th Degree and Beyond</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold mb-2 text-orange-800">How You Earn</h3>
                    <p className="text-sm mb-2">
                      You earn commission whenever someone in your referral network makes a purchase. The commission is
                      calculated based on the purchase amount and your relationship to the buyer:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• When your direct referral makes a purchase, you earn 7%</li>
                      <li>• When your referral's referral makes a purchase, you earn 5%</li>
                      <li>• When your referral's referral's referral makes a purchase, you earn 3%</li>
                      <li>• For deeper levels, you earn 1% commission</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="promotional-rankings" className="mt-6">
          <PromotionalRankings />
        </TabsContent>
      </Tabs>
    </div>
  )
}


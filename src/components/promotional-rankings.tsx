/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PromotionalRankingData {
  currentRank: number
  totalNetworkSales: number
  monthlyBonus: number
  nextRankThreshold: number | null
  remainingAmount: number
  progressPercentage: number
  allRanks: {
    level: number
    name: string
    threshold: number
    monthlyBonus: number
  }[]
}

export default function PromotionalRankings() {
  const { toast } = useToast()
  const [rankingData, setRankingData] = useState<PromotionalRankingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch promotional ranking data
    const fetchRankingData = async () => {
      try {
        const response = await fetch("/api/referals/promotional-rankings")
        if (!response.ok) {
          throw new Error("Failed to fetch promotional ranking data")
        }
        const data = await response.json()
        setRankingData(data)
      } catch (error) {
        console.error("Error fetching promotional ranking data:", error)
        toast({
          title: "Error",
          description: "Failed to load promotional ranking data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRankingData()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin-slow w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full"></div>
      </div>
    )
  }

  if (!rankingData) {
    return null
  }

  // Format currency in Indian format (with lakhs and crores)
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

  // Format in lakhs for display
  const formatInLakhs = (amount: number) => {
    // Convert paise to rupees
    const amountInRupees = amount / 100

    // Convert to lakhs
    const amountInLakhs = amountInRupees / 1000

    return `₹${amountInLakhs.toFixed(2)} ${amountInLakhs === 1 ? "Lakh" : "Lakhs"}`
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Promotional Rank</CardTitle>
              <CardDescription>Current level and progress</CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Award className="h-5 w-5 text-orange-700" />
              <span className="font-bold text-orange-800">Level {rankingData.currentRank}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-orange-800">
                    {rankingData.currentRank < 5 ? "Progress to Next Level" : "Maximum Level Achieved"}
                  </span>
                  <span className="text-sm font-medium text-orange-800">
                    {rankingData.progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={rankingData.progressPercentage} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Network Sales</span>
                  <span className="font-medium">{formatIndianCurrency(rankingData.totalNetworkSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Bonus</span>
                  <span className="font-medium text-green-600">{formatInLakhs(rankingData.monthlyBonus)}</span>
                </div>
                {rankingData.nextRankThreshold && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining to Next Level</span>
                    <span className="font-medium">{formatInLakhs(rankingData.remainingAmount)}</span>
                  </div>
                )}
              </div>
            </div>


            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3 text-orange-800">Bonus Added to Base Salary</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Base Salary</p>
                  <p className="font-medium">₹25,000</p>
                </div>
                <div className="text-2xl">+</div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Bonus</p>
                  <p className="font-medium text-green-600">
                    {rankingData.monthlyBonus === 0 ? "₹0" : formatInLakhs(rankingData.monthlyBonus)}
                  </p>
                </div>
                <div className="text-2xl">=</div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold text-orange-800">₹{25000 + rankingData.monthlyBonus}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Bonus increases with your promotional rank</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promotional Ranking System</CardTitle>
          <CardDescription>Achieve higher ranks to earn more bonuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {rankingData.allRanks.map((rank) => (
              <Card
                key={rank.level}
                className={`overflow-hidden ${rankingData.currentRank === rank.level ? "border-orange-500 ring-2 ring-orange-200" : ""}`}
              >
                <div
                  className={`h-2 ${
                    rank.level === 1
                      ? "bg-zinc-400"
                      : rank.level === 2
                        ? "bg-gray-300"
                        : rank.level === 3
                          ? "bg-yellow-400"
                          : rank.level === 4
                            ? "bg-blue-400"
                            : "bg-orange-500"
                  }`}
                ></div>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      className={`${
                        rank.level === 1
                          ? "bg-zinc-100 text-zinc-800"
                          : rank.level === 2
                            ? "bg-gray-100 text-gray-800"
                            : rank.level === 3
                              ? "bg-yellow-100 text-yellow-800"
                              : rank.level === 4
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      Level {rank.level}
                    </Badge>
                    {rankingData.currentRank === rank.level && (
                      <Badge className="bg-green-100 text-green-800">Current</Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{rank.name}</h3>
                  <div className="space-y-2 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Threshold</p>
                      <p className="font-medium">{rank.threshold === 0 ? "₹0" : formatInLakhs(rank.threshold)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Bonus</p>
                      <p className="font-medium text-green-600">
                        {rank.monthlyBonus === 0 ? "₹0" : formatInLakhs(rank.monthlyBonus)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-orange-800">How to Increase Your Rank</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-orange-200 text-orange-800 w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Grow Your Network</p>
                  <p className="text-muted-foreground">Invite more people to join using your referral link</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-orange-200 text-orange-800 w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Encourage Purchases</p>
                  <p className="text-muted-foreground">Help your network members make purchases on the platform</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-orange-200 text-orange-800 w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Expand Your Reach</p>
                  <p className="text-muted-foreground">Build a deeper network with multiple levels of referrals</p>
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


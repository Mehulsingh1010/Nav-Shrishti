/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, TrendingUp, Award, ChevronRight, Star, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Rank {
  level: number
  name: string
  threshold: number
  monthlyBonus: number
}

interface RankingData {
  currentRank: number
  totalNetworkSales: number
  monthlyBonus: number
  nextRankThreshold: number | null
  remainingAmount: number
  progressPercentage: number
  allRanks: Rank[]
}

export default function PromotionalRankings() {
  const { toast } = useToast()
  const [rankingData, setRankingData] = useState<RankingData | null>(null)
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (!rankingData) {
    return null
  }

  // Format currency values
  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100).toLocaleString("en-IN")}`
  }

  // Get rank icon based on level
  const getRankIcon = (level: number) => {
    switch (level) {
      case 1:
        return <Trophy className="h-6 w-6 text-zinc-500" />
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />
      case 3:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 4:
        return <Trophy className="h-6 w-6 text-blue-500" />
      case 5:
        return <Trophy className="h-6 w-6 text-purple-500" />
      default:
        return <Trophy className="h-6 w-6 text-orange-500" />
    }
  }

  // Get rank color based on level
  const getRankColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-zinc-100 text-zinc-800"
      case 2:
        return "bg-gray-200 text-gray-800"
      case 3:
        return "bg-yellow-100 text-yellow-800"
      case 4:
        return "bg-blue-100 text-blue-800"
      case 5:
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-orange-100 text-orange-800"
    }
  }

  
  // Get progress bar color based on level
  const getProgressColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-zinc-500"
      case 2:
        return "bg-gray-400"
      case 3:
        return "bg-yellow-500"
      case 4:
        return "bg-blue-500"
      case 5:
        return "bg-purple-500"
      default:
        return "bg-orange-500"
    }
  }

  const currentRankDetails = rankingData.allRanks.find((r) => r.level === rankingData.currentRank)
  const nextRankDetails = rankingData.allRanks.find((r) => r.level === rankingData.currentRank + 1)

  return (
    <div className="space-y-6">
      {/* Current Rank Card */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className={cn("p-6", getRankColor(rankingData.currentRank))}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Current Rank</h3>
              <p className="text-sm opacity-80">Your promotional status</p>
            </div>
            <div className="flex items-center gap-2">
              {getRankIcon(rankingData.currentRank)}
              <span className="text-3xl font-bold">Level {rankingData.currentRank}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span>Total Network Sales</span>
              <span className="font-medium">{formatCurrency(rankingData.totalNetworkSales)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Monthly Bonus</span>
              <span className="font-medium">
                {rankingData.monthlyBonus > 0
                  ? `+${formatCurrency(rankingData.monthlyBonus)}`
                  : formatCurrency(rankingData.monthlyBonus)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Next Rank Progress */}
      {nextRankDetails && (
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Progress to Next Level
            </CardTitle>
            <CardDescription>You're on your way to Level {rankingData.currentRank + 1}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getRankIcon(rankingData.currentRank)}
                  <span>Level {rankingData.currentRank}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  {getRankIcon(rankingData.currentRank + 1)}
                  <span>Level {rankingData.currentRank + 1}</span>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-200">
                      {Math.round(rankingData.progressPercentage)}% Complete
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-orange-600">
                      {formatCurrency(rankingData.totalNetworkSales)} / {formatCurrency(nextRankDetails.threshold)}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-200">
                  <div
                    style={{ width: `${rankingData.progressPercentage}%` }}
                    className={cn(
                      "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500",
                      getProgressColor(rankingData.currentRank + 1),
                    )}
                  ></div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-md border border-orange-100">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      You need <span className="font-semibold">{formatCurrency(rankingData.remainingAmount)}</span> more
                      in network sales to reach Level {rankingData.currentRank + 1} and earn a monthly bonus of{" "}
                      <span className="font-semibold text-green-600">
                        +{formatCurrency(nextRankDetails.monthlyBonus)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone markers */}
            <div className="relative mt-8 mb-4 pt-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded"></div>

              {rankingData.allRanks.map((rank, index) => (
                <div
                  key={rank.level}
                  className="absolute top-0 transform -translate-y-1/2"
                  style={{
                    left: `${(rank.threshold / rankingData.allRanks[rankingData.allRanks.length - 1].threshold) * 100}%`,
                    display: index === 0 ? "none" : "block", // Hide the first milestone (Level 1) as it's at 0%
                  }}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full border-2 border-white",
                      rankingData.totalNetworkSales >= rank.threshold ? getProgressColor(rank.level) : "bg-gray-300",
                    )}
                  ></div>
                  <div className="absolute -left-4 mt-2 text-xs font-medium">L{rank.level}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking Levels Table */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-600" />
            Promotional Rankings
          </CardTitle>
          <CardDescription>Earn monthly bonuses as your network grows</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Rank Level</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Required Network Sales</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Monthly Bonus</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.allRanks.map((rank) => (
                  <tr
                    key={rank.level}
                    className={cn("border-t", rankingData.currentRank === rank.level ? getRankColor(rank.level) : "")}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {rankingData.currentRank === rank.level && (
                          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                        )}
                        <div className="flex items-center gap-2">
                          {getRankIcon(rank.level)}
                          <span className="font-medium">Level {rank.level}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(rank.threshold)}</td>
                    <td className="px-4 py-3 text-sm">
                      {rank.monthlyBonus > 0 ? (
                        <span className="text-green-600 font-medium">+{formatCurrency(rank.monthlyBonus)}</span>
                      ) : (
                        formatCurrency(rank.monthlyBonus)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-800">How Promotional Rankings Work</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span>Everyone starts at Level 1 by default</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span>
                When your network generates ₹10,00,000 in sales, you'll be promoted to Level 2 and receive a monthly
                bonus of <strong className="text-green-600">+₹50,000</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span>
                When your network generates ₹50,00,000 in sales, you'll be promoted to Level 3 and receive a monthly
                bonus of <strong className="text-green-600">+₹2,50,000</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span>
                When your network generates ₹1,00,00,000 in sales, you'll be promoted to Level 4 and receive a monthly
                bonus of <strong className="text-green-600">+₹5,00,000</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-sm font-bold">
                5
              </div>
              <span>
                When your network generates ₹2,00,00,000 in sales, you'll be promoted to Level 5 and receive a monthly
                bonus of <strong className="text-green-600">+₹10,00,000</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-sm font-bold">
                <Star className="h-3 w-3" />
              </div>
              <span>Monthly bonuses are paid automatically at the beginning of each month</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}


/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface TeamMember {
  id: number
  name: string
  date: string
  status: string
  earnings: number
  referenceId: string
  degree: number
}

interface ReferralData {
  referralsByDegree: Record<number, TeamMember[]>
}

export default function TeamPage() {
  const { toast } = useToast()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Fetch referral data
    const fetchReferralData = async () => {
      try {
        const response = await fetch("/api/referrals")
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

  // Flatten all team members for the "All" tab
  const allTeamMembers: TeamMember[] = []
  if (referralData.referralsByDegree) {
    Object.entries(referralData.referralsByDegree).forEach(([degree, members]) => {
      members.forEach((member) => {
        allTeamMembers.push({
          ...member,
          degree: Number.parseInt(degree),
        })
      })
    })
  }

  // Get total count by degree
  const getDegreeCount = (degree: number) => {
    return referralData.referralsByDegree && referralData.referralsByDegree[degree]
      ? referralData.referralsByDegree[degree].length
      : 0
  }

  const renderDegreeLabel = (degree: number) => {
    if (degree === 1) return "1st Degree"
    if (degree === 2) return "2nd Degree"
    if (degree === 3) return "3rd Degree"
    return `${degree}th Degree`
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">Your Referral Team</h1>
          <p className="text-muted-foreground">View and manage your complete referral network</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>All members in your referral network</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="all">
                All
                <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800">
                  {allTeamMembers.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="1">
                1st Degree
                <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800">
                  {getDegreeCount(1)}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="2">
                2nd Degree
                <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800">
                  {getDegreeCount(2)}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="3">
                3rd Degree
                <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800">
                  {getDegreeCount(3)}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="4">
                4th+ Degree
                <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800">
                  {Object.keys(referralData.referralsByDegree || {})
                    .filter((d) => Number.parseInt(d) >= 4)
                    .reduce((sum, d) => sum + referralData.referralsByDegree[Number.parseInt(d)].length, 0)}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TeamMembersList members={allTeamMembers} showDegree={true} />
            </TabsContent>

            {[1, 2, 3].map((degree) => (
              <TabsContent key={degree} value={degree.toString()}>
                <TeamMembersList
                  members={
                    referralData.referralsByDegree && referralData.referralsByDegree[degree]
                      ? referralData.referralsByDegree[degree].map((m) => ({ ...m, degree }))
                      : []
                  }
                  showDegree={false}
                />
              </TabsContent>
            ))}

            <TabsContent value="4">
              <TeamMembersList
                members={Object.keys(referralData.referralsByDegree || {})
                  .filter((d) => Number.parseInt(d) >= 4)
                  .flatMap((d) =>
                    referralData.referralsByDegree[Number.parseInt(d)].map((m) => ({
                      ...m,
                      degree: Number.parseInt(d),
                    })),
                  )}
                showDegree={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Understanding Your Team Structure</CardTitle>
            <CardDescription>How the multi-level referral system works</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-orange-800">Referral Degrees Explained</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-200 mt-0.5">1st Degree</Badge>
                    <div>
                      <p className="font-medium">Direct Referrals (7% Commission)</p>
                      <p className="text-muted-foreground">People who joined using your referral link directly</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-200 mt-0.5">2nd Degree</Badge>
                    <div>
                      <p className="font-medium">Your Referrals' Referrals (5% Commission)</p>
                      <p className="text-muted-foreground">People who joined using your direct referrals' links</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-200 mt-0.5">3rd Degree</Badge>
                    <div>
                      <p className="font-medium">Your Network's Extended Reach (3% Commission)</p>
                      <p className="text-muted-foreground">People who are three levels deep in your network</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-200 mt-0.5">4th+ Degree</Badge>
                    <div>
                      <p className="font-medium">Deep Network Connections (1% Commission)</p>
                      <p className="text-muted-foreground">People who are four or more levels deep in your network</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-orange-800">Growing Your Team</h3>
                <p className="text-sm mb-3">
                  The more people in your network, the more earning potential you have. Here are some tips:
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Share your referral link on social media and with friends</li>
                  <li>Encourage your direct referrals to also refer others</li>
                  <li>The deeper your network grows, the more commission streams you'll have</li>
                  <li>Focus on quality referrals who will be active on the platform</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TeamMembersList({ members, showDegree }: { members: TeamMember[]; showDegree: boolean }) {
  if (members.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No team members found at this level</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <Card key={`${member.id}-${member.degree}`} className="overflow-hidden">
          <div className="bg-orange-100 h-2"></div>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground">Joined {new Date(member.date).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col items-end">
                {showDegree && (
                  <Badge variant="outline" className="mb-2 bg-orange-50">
                    {renderDegreeLabel(member.degree)}
                  </Badge>
                )}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {member.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Earnings Generated</span>
                <span className="font-medium">₹{(member.earnings / 100).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function renderDegreeLabel(degree: number) {
  if (degree === 1) return "1st Degree"
  if (degree === 2) return "2nd Degree"
  if (degree === 3) return "3rd Degree"
  return `${degree}th Degree`
}


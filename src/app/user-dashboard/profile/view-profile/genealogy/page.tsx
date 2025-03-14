import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Users, UserPlus, Award, Calendar } from 'lucide-react'

export default function GenealogyPage() {
  // Sample data for demonstration
  const referrals = [
    { id: "NS10045", name: "Amit Kumar", mobile: "9876543210", email: "amit@example.com", joinDate: "10 Jan 2024", rank: "Silver", activeTeam: 8, totalTeam: 12 },
    { id: "NS10046", name: "Priya Sharma", mobile: "9876543211", email: "priya@example.com", joinDate: "15 Jan 2024", rank: "Bronze", activeTeam: 3, totalTeam: 5 },
    { id: "NS10047", name: "Rahul Verma", mobile: "9876543212", email: "rahul@example.com", joinDate: "20 Jan 2024", rank: "Bronze", activeTeam: 2, totalTeam: 4 },
    { id: "NS10048", name: "Neha Patel", mobile: "9876543213", email: "neha@example.com", joinDate: "25 Jan 2024", rank: "Bronze", activeTeam: 0, totalTeam: 2 },
    { id: "NS10049", name: "Vikram Singh", mobile: "9876543214", email: "vikram@example.com", joinDate: "01 Feb 2024", rank: "New", activeTeam: 0, totalTeam: 0 },
    { id: "NS10050", name: "Anjali Gupta", mobile: "9876543215", email: "anjali@example.com", joinDate: "05 Feb 2024", rank: "New", activeTeam: 0, totalTeam: 0 },
    { id: "NS10051", name: "Rajesh Khanna", mobile: "9876543216", email: "rajesh@example.com", joinDate: "10 Feb 2024", rank: "New", activeTeam: 0, totalTeam: 0 },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">My Network</h1>
          <p className="text-muted-foreground">View your referrals and team structure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Team</CardTitle>
            <CardDescription>All members in your network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#F05A28] mr-4" />
              <div className="text-3xl font-bold">28</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Members</CardTitle>
            <CardDescription>Currently active in your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-green-600 mr-4" />
              <div className="text-3xl font-bold">22</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Your Rank</CardTitle>
            <CardDescription>Current achievement level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-8 w-8 text-amber-500 mr-4" />
              <div className="text-3xl font-bold">Gold</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>My Referrals</CardTitle>
              <CardDescription>People you have directly referred to the platform</CardDescription>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search referrals..."
                  className="pl-8"
                />
              </div>
              <Button className="bg-[#F05A28] hover:bg-[#D04A18]">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Members</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Active Team</TableHead>
                      <TableHead>Total Team</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">{referral.id}</TableCell>
                        <TableCell>{referral.name}</TableCell>
                        <TableCell>{referral.mobile}</TableCell>
                        <TableCell>{referral.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {referral.joinDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            referral.rank === "Gold" ? "bg-amber-500" :
                            referral.rank === "Silver" ? "bg-slate-400" :
                            referral.rank === "Bronze" ? "bg-amber-700" :
                            "bg-slate-200 text-slate-700"
                          }>
                            {referral.rank}
                          </Badge>
                        </TableCell>
                        <TableCell>{referral.activeTeam}</TableCell>
                        <TableCell>{referral.totalTeam}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Active Team</TableHead>
                      <TableHead>Total Team</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.filter(r => r.activeTeam > 0).map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">{referral.id}</TableCell>
                        <TableCell>{referral.name}</TableCell>
                        <TableCell>{referral.mobile}</TableCell>
                        <TableCell>{referral.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {referral.joinDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            referral.rank === "Gold" ? "bg-amber-500" :
                            referral.rank === "Silver" ? "bg-slate-400" :
                            referral.rank === "Bronze" ? "bg-amber-700" :
                            "bg-slate-200 text-slate-700"
                          }>
                            {referral.rank}
                          </Badge>
                        </TableCell>
                        <TableCell>{referral.activeTeam}</TableCell>
                        <TableCell>{referral.totalTeam}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Active Team</TableHead>
                      <TableHead>Total Team</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.filter(r => r.activeTeam === 0).map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">{referral.id}</TableCell>
                        <TableCell>{referral.name}</TableCell>
                        <TableCell>{referral.mobile}</TableCell>
                        <TableCell>{referral.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {referral.joinDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            referral.rank === "Gold" ? "bg-amber-500" :
                            referral.rank === "Silver" ? "bg-slate-400" :
                            referral.rank === "Bronze" ? "bg-amber-700" :
                            "bg-slate-200 text-slate-700"
                          }>
                            {referral.rank}
                          </Badge>
                        </TableCell>
                        <TableCell>{referral.activeTeam}</TableCell>
                        <TableCell>{referral.totalTeam}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">Showing {referrals.length} referrals</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
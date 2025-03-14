/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardShell } from "../../_components/dashboard-shell";

export default function ProfilePage() {
  return (
    <DashboardShell>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#8B4513]">User Profile</h1>
            <p className="text-muted-foreground">
              View and manage your profile information
            </p>
          </div>
          <Button className="bg-[#F05A28] hover:bg-[#D04A18]">
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src="/placeholder.svg?height=128&width=128"
                    alt="Profile"
                  />
                  <AvatarFallback className="text-4xl">MS</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">Mehul Singh</CardTitle>
              <CardDescription>Member since March 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-medium">NS12345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sponsor ID</span>
                  <span className="font-medium">NS10023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sponsor Name</span>
                  <span className="font-medium">Rajesh Kumar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Registration Date
                  </span>
                  <span className="font-medium">15 Mar 2024</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Genealogy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Manage your personal information and documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="nominee">Nominee</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Mehul" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Singh" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" defaultValue="1990-05-15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <Input id="fatherName" defaultValue="Suresh Singh" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input id="mobile" defaultValue="+91 9876543210" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="singh@gmail.com"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address1">Address Line 1</Label>
                      <Input id="address1" defaultValue="123 Main Street" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input id="address2" defaultValue="Apartment 4B" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input id="landmark" defaultValue="Near City Park" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="Mumbai" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" defaultValue="Maharashtra" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input id="pincode" defaultValue="400001" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="account" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input id="bankName" defaultValue="State Bank of India" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        defaultValue="1234567890123456"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input id="ifscCode" defaultValue="SBIN0001234" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Input id="accountType" defaultValue="Savings" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branchName">Branch Name</Label>
                      <Input id="branchName" defaultValue="Andheri East" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input id="panNumber" defaultValue="ABCDE1234F" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="nominee" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomineeName">Nominee Name</Label>
                      <Input id="nomineeName" defaultValue="Priya Singh" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomineeRelation">Relation</Label>
                      <Input id="nomineeRelation" defaultValue="Spouse" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomineeDob">Date of Birth</Label>
                      <Input
                        id="nomineeDob"
                        type="date"
                        defaultValue="1992-08-20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomineeMobile">Mobile Number</Label>
                      <Input id="nomineeMobile" defaultValue="+91 9876543211" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nomineeAddress">Address</Label>
                      <Input
                        id="nomineeAddress"
                        defaultValue="123 Main Street, Apartment 4B, Mumbai"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Profile Photo</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <Avatar className="h-24 w-24">
                            <AvatarImage
                              src="/placeholder.svg?height=96&width=96"
                              alt="Profile"
                            />
                            <AvatarFallback>MS</AvatarFallback>
                          </Avatar>
                        </div>
                        <Button variant="outline" size="sm">
                          Upload Photo
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Aadhaar Card (Front)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt="Aadhaar Front"
                          className="mx-auto mb-2 rounded"
                        />
                        <Button variant="outline" size="sm">
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Aadhaar Card (Back)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt="Aadhaar Back"
                          className="mx-auto mb-2 rounded"
                        />
                        <Button variant="outline" size="sm">
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>PAN Card</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt="PAN Card"
                          className="mx-auto mb-2 rounded"
                        />
                        <Button variant="outline" size="sm">
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Bank Passbook</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt="Bank Passbook"
                          className="mx-auto mb-2 rounded"
                        />
                        <Button variant="outline" size="sm">
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Cancelled Cheque</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt="Cancelled Cheque"
                          className="mx-auto mb-2 rounded"
                        />
                        <Button variant="outline" size="sm">
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

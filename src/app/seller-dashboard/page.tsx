/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import {
  BarChart3,
  Plus,
  ShoppingCart,
  Wallet,
  ArrowUp,
  TrendingUp,
  Search,
  Download,
  Edit,
  Trash2,
  Image,
  Upload,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { SellerDashboardShell } from "./_components/seller-dashboard-shell"
import { toast } from "../../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePathname, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the product type
type Product = {
  id: number;
  productId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  availableUnits: number;
  status: "available" | "sold_out";
  photoUrl: string | null;
  photoFile?: File | null;
};

// Define sales data type
type SalesData = {
  daily: number;
  weekly: number;
  monthly: number;
  availableBalance: number;
  totalIncome: number;
  productsSold: number;
  newOrders: number;
  pendingOrders: number;
};

export default function SellerDashboardPage() {
  const [greeting, setGreeting] = useState("Good day");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }
        useEffect(() => {
          async function fetchUser() {
            try {
              const res = await fetch("/api/auth/profile");
              const data = await res.json();

              if (!res.ok) {
                throw new Error(data.error);
              }

              if (data.role) {
                setUserRole(data.role);
                localStorage.setItem("userRole", data.role);
              }
            } catch (err) {
              if (err instanceof Error) setError(err.message);
            } finally {
              setIsLoading(false);
            }
          }

          fetchUser();
        }, []);

        useEffect(() => {
          // Get role from localStorage if not yet set
          if (!userRole) {
            const role = localStorage.getItem("userRole");
            if (role) {
              setUserRole(role);
            }
          }

          // Restrict access if user is not a seller and is on /seller-dashboard or its subpaths
          if (
            userRole &&
            userRole !== "seller" &&
            pathname.startsWith("/seller-dashboard") &&
            !redirecting
          ) {
            setRedirecting(true);
          }
        }, [userRole, redirecting, pathname]);

        useEffect(() => {
          if (redirecting && redirectCountdown > 0) {
            const timer = setTimeout(() => {
              setRedirectCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
          } else if (redirecting && redirectCountdown === 0) {
            router.push("/user-dashboard");
          }
        }, [redirecting, redirectCountdown, router]);
        setUser(data);

        // If the API returns a role, set it
        if (data.role) {
          setUserRole(data.role);
          localStorage.setItem("userRole", data.role);
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    // Get role from localStorage if not yet set
    if (!userRole) {
      const role = localStorage.getItem("userRole");
      if (role) {
        setUserRole(role);
      }
    }

    // Check if we need to redirect based on role
    if (userRole && userRole !== "seller" && !redirecting) {
      setRedirecting(true);
    }
  }, [userRole, redirecting]);

  // Handle countdown and redirection
  useEffect(() => {
    if (redirecting && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (redirecting && redirectCountdown === 0) {
      router.push("/user-dashboard");
    }
  }, [redirecting, redirectCountdown, router]);

  // Modal states
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Form states
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "file">(
    "url"
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);  
  const formRef = useRef<HTMLFormElement>(null);

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock sales data - would come from API in real implementation
  const [salesData, setSalesData] = useState<SalesData>({
    daily: 12500,
    weekly: 78500,
    monthly: 345000,
    availableBalance: 278000,
    totalIncome: 1245000,
    productsSold: 87,
    newOrders: 12,
    pendingOrders: 5,
  });

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setUser(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      }
    }

    fetchUser();
  }, []);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Fetch products
  useEffect(() => {
    refreshProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.productId
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  // Reset form when opening/closing
  useEffect(() => {
    if (productFormOpen) {
      // Set initial values when opening form
      if (selectedProduct) {
        setImagePreview(selectedProduct.photoUrl);
        setImageUploadMethod(selectedProduct.photoUrl ? "url" : "file");
      } else {
        setImagePreview(null);
        setImageUploadMethod("url");
      }
    }
  }, [productFormOpen, selectedProduct]);

  // Handle add product button click
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormMode("add");
    setProductFormOpen(true);
  };

  // Handle edit product button click
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormMode("edit");
    setProductFormOpen(true);
  };

  // Handle delete product button click
  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  // Format price from paise to rupees
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("en-IN");
  };

  // Handle product form submission
  const handleProductFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsFormSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // If using URL method and no file is selected, ensure the photoUrl is included
      if (imageUploadMethod === "url") {
        formData.delete("photoFile");
      } else {
        // If using file method and no file is selected, remove the photoUrl
        formData.delete("photoUrl");
      }

      const endpoint =
        formMode === "add"
          ? "/api/products"
          : `/api/products/${selectedProduct?.productId}`;

      const method = formMode === "add" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error ||
            `Failed to ${formMode === "add" ? "create" : "update"} product`
        );
      }

      toast({
        title: "Success",
        description: `Product ${
          formMode === "add" ? "created" : "updated"
        } successfully`,
      });

      setProductFormOpen(false);
      refreshProducts();
    } catch (error) {
      console.error(
        `Error ${formMode === "add" ? "creating" : "updating"} product:`,
        error
      );
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Failed to ${formMode === "add" ? "create" : "update"} product`,
        variant: "destructive",
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle image upload method change
  const handleImageUploadMethodChange = (value: string) => {
    setImageUploadMethod(value as "url" | "file");
    setImagePreview(selectedProduct?.photoUrl || null);
  };

  // Handle delete product
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `/api/products/${selectedProduct.productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      setDeleteDialogOpen(false);
      refreshProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (redirecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTitle className="text-xl font-bold text-amber-800">
              Redirecting to User Dashboard
            </AlertTitle>
            <AlertDescription className="mt-4">
              <p className="text-amber-700 mb-4">
                Your account has a <span className="font-bold">{userRole}</span>{" "}
                role, which requires a different dashboard. You will be
                redirected in {redirectCountdown} seconds.
              </p>
              <div className="flex items-center gap-3">
                <Progress
                  value={(redirectCountdown / 5) * 100}
                  className="h-2 bg-amber-200"
                />
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => router.push("/user-dashboard")}
                >
                  Go Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading dashboard...
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-6">
        {/* Top Section with User Welcome */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-amber-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-orange-800">
              {greeting}, {user?.name || "Guest"}
            </h1>
            <p className="text-orange-600 mt-1">
              Welcome to your seller dashboard. Manage your products and track
              your sales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="bg-orange-600 hover:bg-orange-700 shadow-md transition-all"
              onClick={handleAddProduct}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm hover:shadow transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-orange-800">
                  Available Balance
                </CardTitle>
                <div className="p-2 bg-white rounded-full">
                  <Wallet className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">
                ₹{salesData.availableBalance.toLocaleString()}
              </div>
              <div className="flex items-center mt-1 text-sm text-orange-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs border-orange-200 text-orange-700 hover:bg-orange-100"
                >
                  Withdraw Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm hover:shadow transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-amber-800">
                  Total Income
                </CardTitle>
                <div className="p-2 bg-white rounded-full">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">
                ₹{salesData.totalIncome.toLocaleString()}
              </div>
              <div className="flex items-center mt-1 text-sm text-amber-700">
                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                <span>₹45,000 from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-yellow-800">
                  Orders Overview
                </CardTitle>
                <div className="p-2 bg-white rounded-full">
                  <ShoppingCart className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-xs font-medium text-yellow-700">New</div>
                  <div className="text-xl font-bold text-yellow-900">
                    {salesData.newOrders}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-yellow-700">
                    Pending
                  </div>
                  <div className="text-xl font-bold text-yellow-900">
                    {salesData.pendingOrders}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-yellow-700">
                    Products Sold
                  </div>
                  <div className="text-xl font-bold text-yellow-900">
                    {salesData.productsSold}
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-3 text-sm text-yellow-700">
                <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                <span>15% increase in sales this week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Your Products</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={handleAddProduct}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead className="text-right">
                      Available Units
                    </TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        {searchTerm
                          ? "No products match your search"
                          : "No products found. Add your first product!"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.productId}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200"
                          >
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{formatPrice(product.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              product.availableUnits < 50
                                ? "text-red-600 font-medium"
                                : ""
                            }
                          >
                            {product.availableUnits}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              product.status === "available"
                                ? "default"
                                : "destructive"
                            }
                            className={
                              product.status === "available"
                                ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                            }
                          >
                            {product.status === "available"
                              ? "Available"
                              : "Sold Out"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-orange-200 text-orange-700 hover:bg-orange-100"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-red-200 text-red-700 hover:bg-red-100"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Sales Reports */}
        <Tabs defaultValue="daily" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <CardTitle>Sales Reports</CardTitle>
            <div className="flex items-center gap-3">
              <TabsList className="bg-orange-50 text-orange-800">
                <TabsTrigger
                  value="daily"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Daily
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <TabsContent value="daily" className="mt-0">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-orange-900">
                    ₹{salesData.daily.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Today's Sales
                  </div>
                  <div className="mt-4">
                    <Progress value={65} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: ₹20,000</span>
                      <span>65% Achieved</span>
                    </div>
                  </div>
                  <div className="mt-6 h-[200px] bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                    Daily sales chart will appear here
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="weekly" className="mt-0">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-orange-900">
                    ₹{salesData.weekly.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    This Week's Sales
                  </div>
                  <div className="mt-4">
                    <Progress value={78} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: ₹100,000</span>
                      <span>78% Achieved</span>
                    </div>
                  </div>
                  <div className="mt-6 h-[200px] bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                    Weekly sales chart will appear here
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="monthly" className="mt-0">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-orange-900">
                    ₹{salesData.monthly.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    This Month's Sales
                  </div>
                  <div className="mt-4">
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Target: ₹400,000</span>
                      <span>85% Achieved</span>
                    </div>
                  </div>
                  <div className="mt-6 h-[200px] bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                    Monthly sales chart will appear here
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      {/* Product Form Modal - Integrated directly into this file */}
      <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === "add" ? "Add New Product" : "Edit Product"}
            </DialogTitle>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleProductFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedProduct?.name || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedProduct?.description || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  name="category"
                  defaultValue={selectedProduct?.category || "Agriculture"}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Pesticides">Pesticides</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Seeds">Seeds</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={
                    selectedProduct?.price
                      ? (selectedProduct.price / 100).toFixed(2)
                      : ""
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="availableUnits" className="text-right">
                  Available Units
                </Label>
                <Input
                  id="availableUnits"
                  name="availableUnits"
                  type="number"
                  min="0"
                  defaultValue={selectedProduct?.availableUnits || "0"}
                  className="col-span-3"
                  required
                />
              </div>

              {/* Image Upload Section with Tabs */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Product Image</Label>
                <div className="col-span-3">
                  <Tabs
                    value={imageUploadMethod}
                    className="w-full"
                    onValueChange={handleImageUploadMethodChange}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="url"
                        className="flex items-center gap-1"
                      >
                        <Image className="h-4 w-4" />
                        Image URL
                      </TabsTrigger>
                      <TabsTrigger
                        value="file"
                        className="flex items-center gap-1"
                      >
                        <Upload className="h-4 w-4" />
                        Upload File
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="url" className="mt-2">
                      <Input
                        id="photoUrl"
                        name="photoUrl"
                        placeholder="https://example.com/image.jpg"
                        defaultValue={selectedProduct?.photoUrl || ""}
                        onChange={(e) => setImagePreview(e.target.value)}
                      />
                    </TabsContent>

                    <TabsContent value="file" className="mt-2">
                      <Input
                        id="photoFile"
                        name="photoFile"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </TabsContent>
                  </Tabs>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4 border rounded-md p-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        Image Preview:
                      </p>
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        className="max-h-[200px] object-contain mx-auto rounded-md"
                        onError={() => setImagePreview(null)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isFormSubmitting}>
                {isFormSubmitting
                  ? "Saving..."
                  : formMode === "add"
                  ? "Add Product"
                  : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product "{selectedProduct?.name}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

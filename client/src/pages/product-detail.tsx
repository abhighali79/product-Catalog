import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in the ${product.name} priced at ₹${product.price}. Can you provide more details?`;
    const phoneNumber = "917411180528";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const statusColors: Record<string, string> = {
    in_stock: "bg-green-100 text-green-800",
    low_stock: "bg-yellow-100 text-yellow-800",
    out_of_stock: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    in_stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={product.images[selectedImageIndex] || "/api/placeholder/400/400"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={statusColors[product.status]}>
                  {statusLabels[product.status]}
                </Badge>
                {product.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {product.category}
              </p>
            </div>

            <div className="text-4xl font-bold text-blue-600">
              ₹{parseFloat(product.price).toLocaleString('en-IN')}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <div className="prose prose-sm max-w-none">
                {product.description.split('\n').map((line, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact via WhatsApp
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => window.open("tel:+917411180528", "_self")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call +91 7411180528
              </Button>
            </div>

            {/* Store Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Sai Infotech</h3>
                    <p className="text-sm text-gray-600">
                      Computer & Electronics Service Center
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Visit our store for hands-on experience
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
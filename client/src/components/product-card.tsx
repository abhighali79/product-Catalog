import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Eye } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleWhatsAppContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi! I'm interested in the ${product.name} priced at ₹${product.price}. Can you provide more details?`;
    const phoneNumber = "917411180528";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-green-100 text-green-800 text-xs">In Stock</Badge>;
      case "low_stock":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Low Stock</Badge>;
      case "out_of_stock":
        return <Badge className="bg-red-100 text-red-800 text-xs">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Unknown</Badge>;
    }
  };

  const primaryImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : "/api/placeholder/300/300";

  return (
    <Link href={`/product/${product.id}`} className="block">
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge(product.status)}
          </div>
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">
              Featured
            </Badge>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <CardContent className="p-3 flex-1 flex flex-col">
          <h4 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h4>
          <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed flex-1">
            {product.description}
          </p>
          <div className="text-lg font-bold text-blue-600 mb-3">
            ₹{parseFloat(product.price).toLocaleString('en-IN')}
          </div>
          <Button
            onClick={handleWhatsAppContact}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-2"
            size="sm"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            WhatsApp
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

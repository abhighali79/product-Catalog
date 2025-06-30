import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, loginSchema } from "@shared/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || "demo",
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET || "demo",
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Create default admin user if it doesn't exist
  app.post("/api/auth/setup", async (req, res) => {
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin user already exists" });
      }

      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = await storage.createUser({
        username: "admin",
        password: hashedPassword,
      });

      res.json({ message: "Admin user created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  // Public product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { search, category } = req.query;
      const products = await storage.getAllProducts(
        search as string,
        category as string
      );
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Admin-only routes
  app.get("/api/admin/stats", authenticateToken, async (req, res) => {
    try {
      const stats = await storage.getProductStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/products", authenticateToken, async (req, res) => {
    try {
      console.log("Product creation request:", req.body);
      const productData = insertProductSchema.parse(req.body);
      console.log("Parsed product data:", productData);
      const product = await storage.createProduct(productData);
      console.log("Created product:", product);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Product creation error:", error);
      res.status(400).json({ message: "Invalid product data", error: error?.message || "Unknown error" });
    }
  });

  app.put("/api/admin/products/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete("/api/admin/products/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Image upload route
  app.post("/api/upload", authenticateToken, upload.array('images', 10), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadPromises = (req.files as Express.Multer.File[]).map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "sai-infotech-products",
              transformation: [
                { width: 800, height: 600, crop: "limit" },
                { quality: "auto:good" }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result?.secure_url);
            }
          ).end(file.buffer);
        });
      });

      const imageUrls = await Promise.all(uploadPromises);
      res.json({ imageUrls });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload images" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

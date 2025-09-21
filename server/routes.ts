import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, rememberMe } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      await storage.updateUserLastLogin(user.id);

      const expiresIn = rememberMe ? 7 * 24 * 3600 : 3600; // 7 days or 1 hour
      const token = `mock-jwt-${user.id}-${Date.now()}`;

      res.json({
        token,
        role: user.role,
        expiresIn,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/refresh", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Mock token validation - in real app would verify JWT
    const token = authHeader.substring(7);
    const userId = token.split("-")[2];
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const newToken = `mock-jwt-${user.id}-${Date.now()}`;
    res.json({
      token: newToken,
      expiresIn: 3600
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7);
    const userId = token.split("-")[2];
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  });

  // Dashboard routes
  app.get("/api/dashboard/summary", async (req, res) => {
    const datasets = await storage.getDatasets();
    const analyses = await storage.getAnalyses();
    
    res.json({
      datasets: datasets.length,
      sensors: 1294,
      ednaSamples: 8573,
      aiAnalyses: analyses.length,
      recentUploads: datasets.slice(-5).map(d => ({
        id: d.id,
        name: d.name,
        type: d.type,
        location: d.location,
        date: d.createdAt,
        status: d.status
      }))
    });
  });

  // Dataset routes
  app.get("/api/datasets", async (req, res) => {
    const datasets = await storage.getDatasets();
    res.json(datasets);
  });

  app.get("/api/datasets/:id", async (req, res) => {
    const dataset = await storage.getDataset(req.params.id);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }
    res.json(dataset);
  });

  app.post("/api/upload", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const userId = token.split("-")[2];

    try {
      const { name, type, location, size, metadata } = req.body;
      const dataset = await storage.createDataset({
        name,
        type,
        location,
        size: size || "0 MB",
        status: "pending",
        metadata
      }, userId);

      // Simulate processing
      setTimeout(async () => {
        await storage.updateDatasetStatus(dataset.id, "processed");
      }, 5000);

      res.json({ 
        message: "Upload successful", 
        dataset: {
          id: dataset.id,
          name: dataset.name,
          status: dataset.status
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Upload failed" });
    }
  });

  // AI Tools routes
  app.post("/api/ai/species-predict", async (req, res) => {
    // Mock species prediction
    setTimeout(() => {
      res.json({
        prediction: {
          species: "Sebastes mystinus", 
          commonName: "Blue Rockfish",
          confidence: 0.94,
          alternates: [
            { species: "Sebastes flavidus", commonName: "Yellowtail Rockfish", confidence: 0.78 },
            { species: "Sebastes serranoides", commonName: "Olive Rockfish", confidence: 0.65 }
          ]
        }
      });
    }, 2000);
  });

  app.post("/api/ai/dna-match", async (req, res) => {
    const { sequence } = req.body;
    
    if (!sequence) {
      return res.status(400).json({ message: "DNA sequence required" });
    }

    // Mock DNA matching
    setTimeout(() => {
      res.json({
        matches: [
          { species: "Thunnus thynnus", commonName: "Atlantic Bluefin Tuna", similarity: 98.5 },
          { species: "Thunnus orientalis", commonName: "Pacific Bluefin Tuna", similarity: 97.2 },
          { species: "Thunnus maccoyii", commonName: "Southern Bluefin Tuna", similarity: 96.8 }
        ]
      });
    }, 3000);
  });

  // Taxonomy routes
  app.get("/api/taxonomy/tree", async (req, res) => {
    res.json({
      kingdom: "Animalia",
      children: [
        {
          phylum: "Chordata",
          children: [
            {
              class: "Actinopterygii",
              children: [
                {
                  order: "Perciformes",
                  children: [
                    { family: "Scombridae", species: ["Thunnus thynnus", "Katsuwonus pelamis"] },
                    { family: "Carangidae", species: ["Seriola dumerili", "Caranx hippos"] }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

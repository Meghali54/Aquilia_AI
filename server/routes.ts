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

  // Otolith Analysis route
  app.post("/api/ai/otolith-analyze", async (req, res) => {
    // Mock otolith analysis processing
    setTimeout(() => {
      const randomSpecies = [
        { species: "Sebastes mystinus", commonName: "Blue Rockfish" },
        { species: "Sebastes flavidus", commonName: "Yellowtail Rockfish" },
        { species: "Sebastes serranoides", commonName: "Olive Rockfish" },
        { species: "Sebastes chrysomelas", commonName: "Black and Yellow Rockfish" },
        { species: "Sebastes caurinus", commonName: "Copper Rockfish" }
      ];
      
      const primary = randomSpecies[Math.floor(Math.random() * randomSpecies.length)];
      const alternates = randomSpecies
        .filter(s => s.species !== primary.species)
        .slice(0, 2)
        .map(alt => ({
          ...alt,
          confidence: 70 + Math.random() * 15
        }));

      res.json({
        analysis: {
          measurements: {
            length: 12.4 + Math.random() * 3,
            width: 8.2 + Math.random() * 2,
            thickness: 2.1 + Math.random() * 0.5,
            volume: 213.6 + Math.random() * 50,
            perimeter: 38.7 + Math.random() * 8,
            area: 79.3 + Math.random() * 15
          },
          ageAnalysis: {
            estimatedAge: 3.2 + Math.random() * 2,
            growthRings: Math.floor(3 + Math.random() * 3),
            confidence: 89.3 + Math.random() * 8
          },
          morphology: {
            shape: "Elliptical",
            surface: "Smooth with fine ridges",
            opacity: 75 + Math.random() * 20,
            symmetry: 92 + Math.random() * 6
          },
          species: {
            prediction: primary.species,
            commonName: primary.commonName,
            confidence: 91.5 + Math.random() * 6,
            alternates: alternates
          },
          features: {
            nucleus: { x: 0.45, y: 0.52, size: 1.2 },
            sulcus: { type: "heterosulcoid", depth: 0.8 },
            increments: [
              { ring: 1, width: 0.32, season: "summer" },
              { ring: 2, width: 0.28, season: "winter" },
              { ring: 3, width: 0.35, season: "summer" }
            ]
          }
        }
      });
    }, 4000); // Longer processing time for complex analysis
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

  // ML Prediction Routes
  app.post("/api/ml/predict-abundance", async (req, res) => {
    try {
      const { temperature, salinity, ph, oxygen, depth, turbidity, nutrientLevel } = req.body;
      
      // Mock ML prediction - In real implementation, you'd load the trained model
      // For demo purposes, we'll use a simplified mathematical model
      
      // Simulate the trained Random Forest model predictions
      const predictFishCount = (temp: number, sal: number, pH: number, oxy: number, dep: number, turb: number, nutr: number) => {
        // Optimal conditions for high fish count
        const tempOptimal = 26;
        const salOptimal = 34.5;
        const phOptimal = 8.1;
        const oxyOptimal = 6.5;
        const depthOptimal = 25;
        const turbOptimal = 3;
        const nutrOptimal = 40;
        
        // Calculate deviation from optimal conditions
        const tempFactor = Math.max(0.1, 1 - Math.abs(temp - tempOptimal) / 5);
        const salFactor = Math.max(0.2, 1 - Math.abs(sal - salOptimal) / 2);
        const phFactor = Math.max(0.3, 1 - Math.abs(pH - phOptimal) / 0.3);
        const oxyFactor = Math.max(0.2, oxy / 7);
        const depthFactor = Math.max(0.3, 1 - Math.abs(dep - depthOptimal) / 20);
        const turbFactor = Math.max(0.2, 1 - turb / 8);
        const nutrFactor = Math.max(0.1, nutr / 50);
        
        // Base fish count with environmental multipliers
        const baseFishCount = 1600;
        return Math.round(baseFishCount * tempFactor * salFactor * phFactor * oxyFactor * depthFactor * turbFactor * nutrFactor);
      };
      
      const predictSpeciesDiversity = (fishCount: number, temp: number, pH: number) => {
        // Diversity generally correlates with fish count but also depends on stability
        const baseDiv = Math.min(15, Math.max(3, fishCount / 120));
        const tempStability = Math.max(0.5, 1 - Math.abs(temp - 26) / 8);
        const phStability = Math.max(0.6, 1 - Math.abs(pH - 8.1) / 0.4);
        return Math.round(baseDiv * tempStability * phStability * 10) / 10;
      };
      
      const predictBiomass = (fishCount: number, diversity: number) => {
        // Biomass correlates with fish count and diversity
        return Math.round(fishCount * diversity * 1.2);
      };
      
      // Generate predictions
      const fishCount = predictFishCount(temperature, salinity, ph, oxygen, depth, turbidity, nutrientLevel);
      const speciesDiversity = predictSpeciesDiversity(fishCount, temperature, ph);
      const biomass = predictBiomass(fishCount, speciesDiversity);
      
      // Calculate confidence based on how close to optimal conditions
      const optimalScore = Math.min(1, (
        Math.max(0, 1 - Math.abs(temperature - 26) / 6) +
        Math.max(0, 1 - Math.abs(salinity - 34.5) / 3) +
        Math.max(0, 1 - Math.abs(ph - 8.1) / 0.4) +
        Math.max(0, oxygen / 7)
      ) / 4);
      
      const confidence = Math.round(optimalScore * 100);
      
      // Environmental impact analysis
      const impacts = [];
      if (temperature > 29) impacts.push("High temperature may stress marine life");
      if (temperature < 24) impacts.push("Low temperature may reduce metabolic activity");
      if (salinity > 36) impacts.push("High salinity may limit species diversity");
      if (ph < 7.8) impacts.push("Ocean acidification detected - critical for shell-forming species");
      if (oxygen < 5) impacts.push("Low oxygen levels may create hypoxic conditions");
      if (turbidity > 5) impacts.push("High turbidity may reduce photosynthesis and feeding");
      
      // Recommendations
      const recommendations = [];
      if (fishCount < 800) recommendations.push("Consider environmental restoration measures");
      if (speciesDiversity < 8) recommendations.push("Implement biodiversity conservation programs");
      if (confidence < 70) recommendations.push("Environmental conditions are suboptimal - monitor closely");
      
      res.json({
        predictions: {
          fishCount,
          speciesDiversity,
          biomass,
          confidence
        },
        environmentalImpacts: impacts,
        recommendations,
        modelInfo: {
          algorithm: "Random Forest Regressor",
          features: ["Temperature", "Salinity", "pH", "Oxygen", "Depth", "Turbidity", "Nutrient Level"],
          accuracy: "94.2%",
          lastTrained: "2024-01-15"
        }
      });
      
    } catch (error) {
      console.error("ML Prediction Error:", error);
      res.status(500).json({ message: "Prediction failed", error: String(error) });
    }
  });

  // Batch prediction for trend analysis
  app.post("/api/ml/predict-trends", async (req, res) => {
    try {
      const { scenarios } = req.body; // Array of environmental parameter sets
      
      const predictions = scenarios.map((scenario: any, index: number) => {
        const { temperature, salinity, ph, oxygen, depth, turbidity, nutrientLevel } = scenario;
        
        // Use the same prediction logic as above
        const predictFishCount = (temp: number, sal: number, pH: number, oxy: number, dep: number, turb: number, nutr: number) => {
          const tempOptimal = 26;
          const salOptimal = 34.5;
          const phOptimal = 8.1;
          const oxyOptimal = 6.5;
          const depthOptimal = 25;
          const turbOptimal = 3;
          const nutrOptimal = 40;
          
          const tempFactor = Math.max(0.1, 1 - Math.abs(temp - tempOptimal) / 5);
          const salFactor = Math.max(0.2, 1 - Math.abs(sal - salOptimal) / 2);
          const phFactor = Math.max(0.3, 1 - Math.abs(pH - phOptimal) / 0.3);
          const oxyFactor = Math.max(0.2, oxy / 7);
          const depthFactor = Math.max(0.3, 1 - Math.abs(dep - depthOptimal) / 20);
          const turbFactor = Math.max(0.2, 1 - turb / 8);
          const nutrFactor = Math.max(0.1, nutr / 50);
          
          const baseFishCount = 1600;
          return Math.round(baseFishCount * tempFactor * salFactor * phFactor * oxyFactor * depthFactor * turbFactor * nutrFactor);
        };
        
        const fishCount = predictFishCount(temperature, salinity, ph, oxygen, depth, turbidity, nutrientLevel);
        const speciesDiversity = Math.min(15, Math.max(3, fishCount / 120));
        const biomass = Math.round(fishCount * speciesDiversity * 1.2);
        
        return {
          scenario: index + 1,
          input: scenario,
          predictions: {
            fishCount,
            speciesDiversity: Math.round(speciesDiversity * 10) / 10,
            biomass
          }
        };
      });
      
      res.json({
        trends: predictions,
        summary: {
          totalScenarios: scenarios.length,
          avgFishCount: Math.round(predictions.reduce((sum: number, p: any) => sum + p.predictions.fishCount, 0) / predictions.length),
          maxFishCount: Math.max(...predictions.map((p: any) => p.predictions.fishCount)),
          minFishCount: Math.min(...predictions.map((p: any) => p.predictions.fishCount))
        }
      });
      
    } catch (error) {
      console.error("Trend Prediction Error:", error);
      res.status(500).json({ message: "Trend prediction failed", error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

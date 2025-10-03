import { type User, type InsertUser, type Dataset, type InsertDataset, type Analysis, type InsertAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;

  // Dataset operations
  getDatasets(userId?: string): Promise<Dataset[]>;
  getDataset(id: string): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset, userId: string): Promise<Dataset>;
  updateDatasetStatus(id: string, status: string): Promise<void>;

  // Analysis operations
  getAnalyses(datasetId?: string): Promise<Analysis[]>;
  createAnalysis(analysis: InsertAnalysis, userId: string): Promise<Analysis>;
  updateAnalysisResults(id: string, results: any): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private datasets: Map<string, Dataset>;
  private analyses: Map<string, Analysis>;

  constructor() {
    this.users = new Map();
    this.datasets = new Map();
    this.analyses = new Map();

    // Initialize with mock users
    this.seedMockUsers();
    this.seedMockData();
  }

  private seedMockUsers() {
    const mockUsers: InsertUser[] = [
      {
        email: "admin@oceanus.com",
        password: "password", // In real app, this would be hashed
        name: "Admin User",
        role: "admin"
      },
      {
        email: "researcher@oceanus.com",
        password: "password",
        name: "Dr. Sarah Chen",
        role: "researcher"
      },
      {
        email: "policy@oceanus.com",
        password: "password",
        name: "Policy Analyst",
        role: "policy_user"
      },
      {
        email: "guest@oceanus.com",
        password: "password",
        name: "Guest User",
        role: "guest"
      }
    ];

    mockUsers.forEach(userData => {
      const id = randomUUID();
      const user: User = {
        ...userData,
        id,
        createdAt: new Date(),
        lastLoginAt: null
      };
      this.users.set(id, user);
    });
  }

  private seedMockData() {
    // Add some mock datasets
    const mockDatasets = [
      {
        name: "Pacific Kelp Survey 2024",
        type: "Ocean Data",
        location: "California Coast",
        size: "2.4 GB",
        status: "processed",
        metadata: { sensors: 45, depth_range: "0-100m" }
      },
      {
        name: "Coral Reef eDNA Samples",
        type: "eDNA",
        location: "Great Barrier Reef",
        size: "1.8 GB", 
        status: "processing",
        metadata: { samples: 120, species_detected: 87 }
      },
      {
        name: "Salmon Migration Data",
        type: "Fish Data",
        location: "Alaska Peninsula",
        size: "856 MB",
        status: "processed",
        metadata: { tracking_days: 90, fish_tagged: 2500 }
      }
    ];

    const researcherUser = Array.from(this.users.values()).find(u => u.role === "researcher");
    
    mockDatasets.forEach(datasetData => {
      const id = randomUUID();
      const dataset: Dataset = {
        ...datasetData,
        id,
        uploadedBy: researcherUser?.id || null,
        createdAt: new Date(),
      };
      this.datasets.set(id, dataset);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      lastLoginAt: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLoginAt = new Date();
      this.users.set(id, user);
    }
  }

  async getDatasets(userId?: string): Promise<Dataset[]> {
    const datasets = Array.from(this.datasets.values());
    if (userId) {
      return datasets.filter(d => d.uploadedBy === userId);
    }
    return datasets;
  }

  async getDataset(id: string): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async createDataset(dataset: InsertDataset, userId: string): Promise<Dataset> {
    const id = randomUUID();
    const newDataset: Dataset = {
      ...dataset,
      id,
      uploadedBy: userId,
      createdAt: new Date(),
      metadata: dataset.metadata || null,
      size: dataset.size || null,
      location: dataset.location || null,
      status: dataset.status || 'pending',
    };
    this.datasets.set(id, newDataset);
    return newDataset;
  }

  async updateDatasetStatus(id: string, status: string): Promise<void> {
    const dataset = this.datasets.get(id);
    if (dataset) {
      dataset.status = status;
      this.datasets.set(id, dataset);
    }
  }

  async getAnalyses(datasetId?: string): Promise<Analysis[]> {
    const analyses = Array.from(this.analyses.values());
    if (datasetId) {
      return analyses.filter(a => a.datasetId === datasetId);
    }
    return analyses;
  }

  async createAnalysis(analysis: InsertAnalysis, userId: string): Promise<Analysis> {
    const id = randomUUID();
    const newAnalysis: Analysis = {
      ...analysis,
      id,
      createdBy: userId,
      createdAt: new Date(),
      results: analysis.results || null,
      status: analysis.status || 'pending',
      datasetId: analysis.datasetId || null,
    };
    this.analyses.set(id, newAnalysis);
    return newAnalysis;
  }

  async updateAnalysisResults(id: string, results: any): Promise<void> {
    const analysis = this.analyses.get(id);
    if (analysis) {
      analysis.results = results;
      analysis.status = "completed";
      this.analyses.set(id, analysis);
    }
  }
}

export const storage = new MemStorage();

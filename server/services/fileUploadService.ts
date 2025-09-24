import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { config } from '../config';
import { logger } from '../middleware';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export class FileUploadService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = config.upload.uploadDir;
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'images'), { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'data'), { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'processed'), { recursive: true });
    } catch (error) {
      logger.error('Error creating upload directories:', error);
    }
  }

  // Storage configuration for multer
  getMulterStorage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        let subDir = 'data';
        if (config.upload.allowedImageTypes.includes(file.mimetype)) {
          subDir = 'images';
        }
        cb(null, path.join(this.uploadDir, subDir));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    });
  }

  // File filter for multer
  getFileFilter(): multer.Options['fileFilter'] {
    return (req, file, cb) => {
      const allowedTypes = [
        ...config.upload.allowedImageTypes,
        ...config.upload.allowedDataTypes
      ];

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} not allowed`));
      }
    };
  }

  // Configure multer middleware
  getUploadMiddleware(): multer.Multer {
    return multer({
      storage: this.getMulterStorage(),
      fileFilter: this.getFileFilter(),
      limits: {
        fileSize: config.upload.maxFileSize,
        files: 5 // Max 5 files per request
      }
    });
  }

  // Process uploaded image
  async processImage(file: Express.Multer.File): Promise<UploadedFile> {
    try {
      const fileId = uuidv4();
      const processedDir = path.join(this.uploadDir, 'processed');
      
      // Get image metadata
      const metadata = await sharp(file.path).metadata();
      
      // Create multiple sizes for different use cases
      const sizes = [
        { suffix: 'thumb', width: 150, height: 150 },
        { suffix: 'medium', width: 500, height: 500 },
        { suffix: 'large', width: 1200, height: 1200 }
      ];

      const processedFiles = [];
      
      for (const size of sizes) {
        const processedFilename = `${fileId}-${size.suffix}.jpg`;
        const processedPath = path.join(processedDir, processedFilename);
        
        await sharp(file.path)
          .resize(size.width, size.height, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ quality: 85 })
          .toFile(processedPath);
          
        processedFiles.push({
          size: size.suffix,
          path: processedPath,
          url: `/uploads/processed/${processedFilename}`
        });
      }

      // Log processing result
      logger.info(`Image processed: ${file.originalname} -> ${processedFiles.length} sizes`);

      return {
        id: fileId,
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        url: `/uploads/${this.getSubDir(file.mimetype)}/${file.filename}`
      };

    } catch (error) {
      logger.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  // Process CSV data file
  async processDataFile(file: Express.Multer.File): Promise<{
    file: UploadedFile;
    preview: any[];
    stats: {
      rows: number;
      columns: number;
      size: number;
    };
  }> {
    try {
      const fileId = uuidv4();
      
      // Read file content for preview
      const fileContent = await fs.readFile(file.path, 'utf-8');
      const lines = fileContent.split('\\n').filter(line => line.trim());
      
      let preview = [];
      let columns = 0;
      
      if (file.mimetype === 'text/csv') {
        // Parse CSV for preview
        const header = lines[0]?.split(',').map(col => col.trim().replace(/"/g, ''));
        columns = header?.length || 0;
        
        preview = lines.slice(0, 6).map((line, index) => {
          const values = line.split(',').map(val => val.trim().replace(/"/g, ''));
          if (index === 0) {
            return Object.fromEntries(header.map((col, i) => [col, col])); // Header row
          }
          return Object.fromEntries(header.map((col, i) => [col, values[i] || '']));
        });
      } else if (file.mimetype === 'application/json') {
        // Parse JSON for preview
        try {
          const jsonData = JSON.parse(fileContent);
          if (Array.isArray(jsonData)) {
            preview = jsonData.slice(0, 5);
            columns = Object.keys(jsonData[0] || {}).length;
          } else {
            preview = [jsonData];
            columns = Object.keys(jsonData).length;
          }
        } catch (parseError) {
          logger.warn('Invalid JSON file:', parseError);
        }
      }

      logger.info(`Data file processed: ${file.originalname} (${lines.length} rows, ${columns} columns)`);

      return {
        file: {
          id: fileId,
          originalName: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          url: `/uploads/data/${file.filename}`
        },
        preview,
        stats: {
          rows: lines.length - 1, // Exclude header
          columns,
          size: file.size
        }
      };

    } catch (error) {
      logger.error('Error processing data file:', error);
      throw new Error('Failed to process data file');
    }
  }

  // Clean up old files
  async cleanupOldFiles(maxAgeHours: number = 24): Promise<void> {
    try {
      const directories = ['images', 'data', 'processed'];
      const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);

      for (const dir of directories) {
        const dirPath = path.join(this.uploadDir, dir);
        try {
          const files = await fs.readdir(dirPath);
          
          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);
            
            if (stats.mtime.getTime() < cutoffTime) {
              await fs.unlink(filePath);
              logger.info(`Cleaned up old file: ${file}`);
            }
          }
        } catch (error) {
          logger.warn(`Error cleaning directory ${dir}:`, error);
        }
      }
    } catch (error) {
      logger.error('Error during file cleanup:', error);
    }
  }

  // Get file by ID
  async getFile(fileId: string): Promise<UploadedFile | null> {
    // In a real implementation, you'd store file metadata in database
    // For now, return null as this is a simple demo
    return null;
  }

  // Delete file
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      logger.info(`File deleted: ${filePath}`);
    } catch (error) {
      logger.warn(`Failed to delete file: ${filePath}`, error);
    }
  }

  private getSubDir(mimetype: string): string {
    if (config.upload.allowedImageTypes.includes(mimetype)) {
      return 'images';
    }
    return 'data';
  }
}

export const fileUploadService = new FileUploadService();
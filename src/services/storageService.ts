// src/services/storageService.ts
import { minioClient, bucketName } from '../config/minio';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

class StorageService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = `resumes/${new Date().getFullYear()}/${fileName}`;

      await minioClient.putObject(bucketName, filePath, file.buffer, file.size, {
        'Content-Type': file.mimetype,
        'Original-Name': file.originalname,
      });

      // Generate presigned URL (valid for 7 days)
      const url = await minioClient.presignedGetObject(bucketName, filePath, 7 * 24 * 60 * 60);

      console.log(`File uploaded: ${filePath}`);
      return url;
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await minioClient.removeObject(bucketName, filePath);
      console.log(`File deleted: ${filePath}`);
    } catch (error) {
      console.error('File deletion error:', error);
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  async getFileUrl(filePath: string, expirySeconds: number = 3600): Promise<string> {
    try {
      const url = await minioClient.presignedGetObject(bucketName, filePath, expirySeconds);
      return url;
    } catch (error) {
      console.error('Get file URL error:', error);
      throw new Error(`Failed to get file URL: ${error}`);
    }
  }
}

export default new StorageService();
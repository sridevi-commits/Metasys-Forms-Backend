// src/config/minio.ts
import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const bucketName = process.env.MINIO_BUCKET || 'metasys-resumes';

// Initialize bucket
const initializeBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`✓ MinIO bucket '${bucketName}' created`);
    } else {
      console.log('✓ MinIO connected');
    }
  } catch (error) {
    console.error('MinIO initialization error:', error);
  }
};

initializeBucket();

export { minioClient, bucketName };

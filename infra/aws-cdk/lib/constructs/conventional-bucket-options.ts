import { BlockPublicAccess, BucketAccessControl, BucketEncryption } from 'aws-cdk-lib/aws-s3';

export const conventionalBucketOptions = {
  versioned: true,
  enforceSSL: true,
  encryption: BucketEncryption.S3_MANAGED,
  accessControl: BucketAccessControl.PRIVATE,
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
};
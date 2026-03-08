#!/bin/bash
# Deployment script for Anidha Tech Solutions Website

set -e

# Configuration
S3_BUCKET="anidha-website"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-E1234567890ABC}"
BUILD_DIR="public"

echo "Starting deployment..."

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "Error: Build directory $BUILD_DIR does not exist"
    exit 1
fi

# Sync to S3 with cache headers
echo "Syncing files to S3..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET/" \
    --delete \
    --exclude "*.html" \
    --exclude "*.xml" \
    --exclude "robots.txt" \
    --cache-control "public, max-age=31536000, immutable"

echo "Syncing HTML/XML files with no-cache..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET/" \
    --delete \
    --exclude "*" \
    --include "*.html" \
    --include "*.xml" \
    --include "robots.txt" \
    --cache-control "public, max-age=0, must-revalidate"

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo "Invalidation ID: $INVALIDATION_ID"

# Wait for invalidation to complete
echo "Waiting for invalidation to complete..."
aws cloudfront wait invalidation-completed \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --id "$INVALIDATION_ID"

echo "Deployment completed successfully!"

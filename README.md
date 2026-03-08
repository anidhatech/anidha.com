# Anidha Tech Solutions LLP Website

Official website for Anidha Tech Solutions LLP - helping modern enterprises automate boldly and scale intelligently.

## Overview

This is a static website built with HTML and Tailwind CSS, designed to be:
- **Professional**: Modern consulting firm design
- **Lightweight**: Fast loading with minimal dependencies
- **Secure**: HTTPS enabled with security best practices
- **Low Cost**: AWS-hosted with minimal monthly expenses
- **SEO Optimized**: Proper meta tags, structured data, and sitemaps
- **Easy to Maintain**: Simple static site structure

## Pages

- **Home** (`/`) - Main landing page with services overview
- **Services** (`/services.html`) - Detailed service offerings
- **Solutions** (`/solutions.html`) - Enterprise solutions
- **Case Studies** (`/case-studies.html`) - Success stories
- **About Us** (`/about.html`) - Company information
- **Insights** (`/blog/`) - Blog and articles
- **Contact** (`/contact.html`) - Contact form

## Quick Start

### Local Preview

```bash
# Install dependencies
npm install

# Preview the site
npm run preview
```

Visit http://localhost:3000 to view the website.

### Project Structure

```
anidha.com/
├── public/                 # Static files
│   ├── index.html          # Homepage
│   ├── services.html       # Services page
│   ├── solutions.html      # Solutions page
│   ├── case-studies.html   # Case studies
│   ├── about.html         # About us
│   ├── contact.html        # Contact form
│   ├── blog/              # Blog section
│   │   └── index.html
│   └── assets/            # CSS, JS, images
│       ├── css/
│       ├── js/
│       └── images/
├── infra/                 # AWS infrastructure
│   ├── terraform/         # IaC configurations
│   └── aws-cli/          # Deployment scripts
├── scripts/               # Utility scripts
├── .github/               # GitHub workflows
│   └── workflows/
├── package.json
└── README.md
```

## Deployment

### Manual Deployment to AWS

```bash
# Sync to S3
aws s3 sync public/ s3://anidha-website --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

### Automated Deployment via GitHub Actions

Push to the `main` branch to trigger automatic deployment to AWS.

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML + Tailwind CSS |
| JavaScript | Vanilla JS |
| Hosting | AWS S3 (Static) |
| CDN | AWS CloudFront |
| DNS | AWS Route 53 |
| SSL | AWS Certificate Manager |
| Security | AWS WAF |
| CI/CD | GitHub Actions |
| Contact Form | Lambda + API Gateway + DynamoDB + SES |

## Cost Estimate

| Period | Monthly Cost |
|--------|--------------|
| First 12 months (Free Tier) | ~$0.50 |
| After Free Tier | ~$7.50 |

## Services Offered

- DevOps Automation
- Cloud Infrastructure
- AIOps
- MLOps
- Industrial IoT
- Database Migration Orchestration

## Contact

- **Email**: contact@anidha.com
- **Phone**: +91 77998 32255
- **Location**: Hyderabad, India
- **LinkedIn**: https://linkedin.com/company/anidha-tech-solutions

## License

Copyright © 2026 Anidha Tech Solutions LLP. All rights reserved.

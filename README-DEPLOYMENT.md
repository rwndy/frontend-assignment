# Deployment Guide for Wizard Application

## Overview
This project has been configured for Vercel deployment with serverless API functions replacing the local json-server mock APIs.

## What's Been Done

### 1. API Migration from json-server to Vercel Functions
- Created Vercel API functions in `/api/` directory:
  - `api/departments.ts` - Serves department data
  - `api/basicInfo.ts` - Handles basic employee info (GET/POST)
  - `api/details.ts` - Handles employee details (GET/POST)
  - `api/locations.ts` - Serves location data

### 2. Environment Configuration
- Updated `src/libs/constants/index.ts` to use environment-based API endpoints
- Added `.env.production` for production environment variables
- Created `vercel.json` configuration file

### 3. Dependencies
- Added `@vercel/node` for serverless function runtime

## Deployment Steps

### Manual Deployment to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the project directory**:
   ```bash
   cd /path/to/wizard-application
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy
   - Link to existing project (or create new)
   - Configure project settings if needed

### Automatic Deployment via GitHub

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with Vercel deployment setup"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to vercel.com dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Deploy

## API Endpoints

### Development (localhost)
- Basic Info: `http://localhost:4001/basicInfo`
- Details: `http://localhost:4002/details`
- Departments: `http://localhost:4001/departments`
- Locations: `http://localhost:4002/locations`

### Production (Vercel)
- Basic Info: `/api/basicInfo`
- Details: `/api/details`
- Departments: `/api/departments`
- Locations: `/api/locations`

## Features Preserved
- ✅ Multi-step wizard form
- ✅ Employee management
- ✅ Photo upload functionality
- ✅ Draft persistence
- ✅ Search and autocomplete
- ✅ Pagination
- ✅ All original functionality maintained

## CORS Configuration
All API endpoints include proper CORS headers for browser compatibility.

## Notes
- The mock data is simplified for demonstration
- In production, you'd want to connect to a real database
- API responses maintain the same structure as the original json-server endpoints
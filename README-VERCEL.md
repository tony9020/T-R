# Vercel Deployment Guide

## Problem Solved
The original Express.js server with multer middleware doesn't work on Vercel's serverless platform. This fix converts the API endpoints to Vercel serverless functions.

## Changes Made

### 1. Serverless API Functions
- Created `/api/extract-text.js` - Handles DOCX file upload and text extraction
- Created `/api/generate-docx.js` - Generates professional DOCX resumes
- Both use `formidable` for file parsing instead of `multer`

### 2. Vercel Configuration
- Added `vercel.json` with proper routing and function configuration
- Configured static build for React frontend
- Set 30-second timeout for API functions

### 3. Dependencies Updated
- Added `formidable` for serverless file uploads
- Added `@vercel/node` and `@types/formidable` for development

## Deployment Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Set these in your Vercel dashboard under Environment Variables:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `APP_URL`: Your Vercel app URL (auto-injected by Vercel)

### 3. Deploy to Vercel
```bash
vercel --prod
```

## File Support
✅ **DOCX files now work on Vercel**
✅ **TXT files continue to work**
✅ **Professional DOCX export works**

## Technical Details

### Why the Original Failed
- Express.js with multer requires a persistent server
- Vercel runs serverless functions with limited file system access
- multer's memory storage doesn't work in serverless environments

### How This Fix Works
- Uses `formidable` which is serverless-compatible
- Each API endpoint is a separate serverless function
- Proper file cleanup after processing
- Maintains all original functionality

## Testing
Test both file types on your deployed Vercel app:
1. Upload a DOCX file - should extract text successfully
2. Upload a TXT file - should work as before
3. Generate DOCX export - should download properly

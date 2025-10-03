# 🔧 Timeout Error Fix

## Issue: "timeout of 10000ms exceeded"

### Quick Fixes Applied:
1. **Increased timeout**: 10s → 60s in axios.js
2. **Updated baseURL**: Production backend URL

### Manual Steps:

1. **Test Backend Directly**:
   Visit: `https://propertydekho-in.onrender.com/properties`
   - If it loads → Backend is working
   - If timeout → Backend is sleeping (Render free tier)

2. **Wake Up Backend** (Render Free Tier Issue):
   - Visit backend URL 2-3 times
   - Wait 30-60 seconds for cold start
   - Then test frontend

3. **Update Netlify Environment**:
   ```
   VITE_API_URL=https://propertydekho-in.onrender.com
   ```

4. **Redeploy Frontend** after env update

### Root Cause:
Render free tier puts services to sleep after 15 minutes of inactivity. First request takes 30-60 seconds to wake up.

### Solution:
Keep backend active or upgrade to paid Render plan.
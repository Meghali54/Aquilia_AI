# 🚀 AQUILA - Render Deployment Guide

## 📋 Prerequisites
- ✅ GitHub repository (already done!)
- ✅ Render account (free)
- ✅ Build configuration files

## 🎯 Quick Deployment Steps

### 1. 🌐 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 2. 🔗 Connect Your Repository
1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Find and select your **`Aquilia_AI`** repository
5. Choose the **`main`** branch

### 3. ⚙️ Configure Deployment Settings

**Basic Settings:**
- **Name**: `aquila-marine-platform`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Auto-Deploy**: `Yes` (deploys automatically on git push)
- **Branch**: `main`

### 4. 🔧 Environment Variables
Add these environment variables in Render:

```bash
NODE_ENV=production
VITE_API_BASE_URL=https://aquila-marine-platform.onrender.com
VITE_ENABLE_MOCK_API=true
PORT=10000
```

### 5. 🚀 Deploy!
1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build the application
   - Deploy to a live URL

## 📊 Deployment Status

### Expected Build Time: 3-5 minutes
### Expected Deploy URL: `https://aquila-marine-platform.onrender.com`

## 🔍 Troubleshooting

### Common Issues & Solutions:

**1. Build Fails - Missing Dependencies**
```bash
# If build fails, check package.json dependencies
npm install
npm audit fix
```

**2. TypeScript Errors**
```bash
# Fix TypeScript compilation issues
npm run check
```

**3. Environment Variables**
- Ensure all VITE_ prefixed variables are set
- Double-check API URLs and configuration

**4. Static Files Not Found**
- Verify build command generates dist/ folder
- Check vite.config.ts build settings

## ⚡ Alternative Deployment Options

### Option A: Static Site (Recommended for Demo)
If you want faster deployment, you can also deploy as a static site:

1. **Build locally**: `npm run build`
2. **Deploy dist folder** to:
   - Netlify
   - Vercel
   - GitHub Pages

### Option B: Full Stack on Render
For full backend functionality:
1. Use the current render.yaml configuration
2. Add database environment variables if needed
3. Configure external APIs

## 🎯 Post-Deployment Checklist

- [ ] ✅ Site loads successfully
- [ ] ✅ Authentication works with demo credentials
- [ ] ✅ AI Tools functionality is operational
- [ ] ✅ PDF generation works
- [ ] ✅ All pages are accessible
- [ ] ✅ Mobile responsiveness verified
- [ ] ✅ Performance is acceptable (Lighthouse score)

## 📞 Support

If you encounter issues:
1. Check Render build logs
2. Verify environment variables
3. Test locally first with `npm run build && npm start`
4. Check GitHub repository access permissions

## 🌟 Success!

Once deployed, share your live demo URL:
**`https://aquila-marine-platform.onrender.com`**

Perfect for:
- 👨‍💼 **Judges** - Live demonstration
- 🎓 **Academic** - Research showcase
- 💼 **Portfolio** - Professional presentation
- 🤝 **Collaboration** - Team sharing

---

**🌊 Made with ❤️ by Team Nexora 🌊**
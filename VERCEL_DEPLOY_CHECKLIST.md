# Vercel Deployment Checklist

## Issue: GitHub OAuth redirects to localhost instead of production URL

### Fix Applied
✅ Updated [src/app/api/auth/callback/route.ts](src/app/api/auth/callback/route.ts) to properly handle `x-forwarded-host` and `x-forwarded-proto` headers from Vercel

### Required Supabase Configuration

1. **Go to your Supabase Dashboard** → Authentication → URL Configuration

2. **Add these URLs to "Redirect URLs":**
   ```
   https://shadow-rank.vercel.app/api/auth/callback
   http://localhost:3000/api/auth/callback
   ```

3. **Set the Site URL to:**
   ```
   https://shadow-rank.vercel.app
   ```

4. **Verify Additional Redirect URLs includes:**
   - Your production domain: `https://shadow-rank.vercel.app/**`
   - Vercel preview deployments: `https://*.vercel.app/**` (if you want to test on preview branches)

### Vercel Environment Variables

Make sure these are set in your Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key (optional)
GROQ_API_KEY=your_groq_key (optional)
```

### Deploy
After making these changes:
```bash
git add .
git commit -m "fix: GitHub OAuth redirect for production"
git push
```

Vercel will automatically redeploy.

### Testing
1. Go to https://shadow-rank.vercel.app/
2. Click "Sign in with GitHub"
3. After GitHub authorization, you should be redirected to https://shadow-rank.vercel.app/dashboard

---

**Note:** The code now properly reads Vercel's `x-forwarded-host` and `x-forwarded-proto` headers to construct the correct redirect URL for production deployments.

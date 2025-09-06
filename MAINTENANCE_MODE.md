# Maintenance Mode

This document explains how to use the maintenance mode feature to temporarily disable access to the voter board application.

## Overview

The maintenance mode feature allows you to quickly put the entire application into maintenance mode by setting an environment variable. When enabled, all users (including authenticated users) will be redirected to a maintenance page.

## How It Works

The maintenance mode is implemented at the **middleware layer**, which means:
- It runs before any page loads or API calls
- It affects all routes and pages
- It's very fast and efficient
- No code deployment is needed to toggle it

## Environment Variable

Control maintenance mode with the `MAINTENANCE_MODE` environment variable:

```bash
# Disable maintenance mode (normal operation)
MAINTENANCE_MODE=false

# Enable maintenance mode
MAINTENANCE_MODE=true
```

## Usage

### Local Development

1. **Enable maintenance mode:**
   - Edit `.env.local`
   - Set `MAINTENANCE_MODE=true`
   - Save the file
   - The change takes effect immediately (may need to refresh browser)

2. **Disable maintenance mode:**
   - Edit `.env.local`
   - Set `MAINTENANCE_MODE=false`
   - Save the file

### Production Deployment

For production environments (Vercel, Netlify, etc.):

1. **Enable maintenance mode:**
   - Go to your hosting platform's environment variables settings
   - Set `MAINTENANCE_MODE` to `true`
   - Deploy or restart the application

2. **Disable maintenance mode:**
   - Set `MAINTENANCE_MODE` to `false`
   - Deploy or restart the application

## What Happens in Maintenance Mode

When `MAINTENANCE_MODE=true`:

1. **All users are redirected** to `/maintenance` page
2. **Exceptions** (these still work):
   - The maintenance page itself (`/maintenance`)
   - Static assets (`/_next/`, favicon, images)
   - No API routes or other pages are accessible

3. **Authentication is bypassed** - even logged-in users see the maintenance page

## Maintenance Page

The maintenance page (`/src/app/maintenance/page.tsx`) displays:
- A clear maintenance message
- Professional styling with Chakra UI
- Information about the temporary nature of the maintenance
- Contact information for urgent issues

## Customization

You can customize the maintenance page by editing:
- `/src/app/maintenance/page.tsx` - Main content and styling
- `/src/middleware.ts` - Logic for which routes to allow during maintenance

## Best Practices

1. **Plan maintenance windows** and notify users in advance
2. **Test maintenance mode** in a staging environment first
3. **Keep maintenance brief** to minimize user impact
4. **Monitor** that the maintenance page is working correctly
5. **Document** maintenance procedures for your team

## Troubleshooting

If maintenance mode isn't working:

1. **Check the environment variable** is set correctly
2. **Verify case sensitivity** - use `MAINTENANCE_MODE` exactly
3. **Clear browser cache** and refresh
4. **Check server logs** for any middleware errors
5. **Restart the development server** if testing locally

## Security Notes

- Maintenance mode bypasses all authentication
- No sensitive data should be exposed on the maintenance page
- The maintenance page should not contain links to protected areas
- Consider rate limiting the maintenance page if needed

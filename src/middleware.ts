import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Initialize runtime bindings from Cloudflare platform
  // With platformProxy enabled, the bindings are available on context.locals
  if (!context.locals.runtime) {
    // Try multiple ways to access the platform/runtime
    const platform =
      (context as any).locals?.platform ||
      (context as any).platform ||
      (context as any).locals?.env;

    if (platform?.env) {
      context.locals.runtime = {
        env: platform.env,
      };
    } else if (platform) {
      // Platform might be the env object directly
      context.locals.runtime = {
        env: platform,
      };
    }

    // Debug log
    console.log('Middleware - Setting runtime:', {
      hasRuntime: !!context.locals.runtime,
      hasPlatform: !!platform,
      platformKeys: platform ? Object.keys(platform).slice(0, 5) : null,
    });
  }

  return next();
});

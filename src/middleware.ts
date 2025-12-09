import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Initialize runtime bindings from Cloudflare platform
  // With platformProxy enabled, the bindings are available on context.locals
  if (!context.locals.runtime) {
    // Try to get runtime from platform (in case it's not automatically set)
    const platform = (context as any).locals?.platform || (context as any).platform;
    if (platform?.env) {
      context.locals.runtime = {
        env: platform.env,
      };
    }
  }

  return next();
});

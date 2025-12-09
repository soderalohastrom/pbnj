import { defineMiddleware } from 'astro:middleware';
import type { AstroGlobal } from 'astro';

export const onRequest = defineMiddleware(async (context, next) => {
  // Access the Cloudflare runtime from the platform proxy
  // This makes the bindings available in locals.runtime for all requests
  const { locals } = context;

  if (!locals.runtime) {
    try {
      // For Cloudflare Workers with platformProxy enabled
      locals.runtime = {
        env: context.locals.runtime?.env || (context as any).locals?.platform?.env,
      };
    } catch (error) {
      console.error('Failed to initialize runtime:', error);
    }
  }

  return next();
});

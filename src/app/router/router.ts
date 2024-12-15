import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';

export const setupRouter = (): ReturnType<typeof createRouter> => {
  const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL)
  });

  return router;
};

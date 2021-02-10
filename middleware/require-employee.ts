import { Middleware } from '@nuxt/types';

const requireProfileComplete: Middleware = (context) => {
  if (context.$auth.user.data.is_guest) {
    context.$auth.logout();
    return context.redirect('/sign-in?target=dashboard');
  }
};

export default requireProfileComplete;

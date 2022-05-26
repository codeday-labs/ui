import { goto } from '$app/navigation';

export function handleAuthError(error: unknown) {
  const e = error as any;

  if (e.error) {
    console.log(JSON.stringify(e));
    if (e.error === 'login_required') {
      console.log('Login Required redirecting');
      // Redirect to login
      // Think about goto usage
      const loginUrl = new URL('/login', window.location.origin);
      switch (window.location.pathname) {
        case '/login':
        case '/':
          break;
        default:
          loginUrl.searchParams.set('redirect_uri', window.location.pathname);
      }

      goto(loginUrl.toString(), { replaceState: true });
    }
  } else {
    console.log('Authentication Failure', e);
  }
}

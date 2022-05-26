import { handleAuthError } from '$lib/utilities/handle-auth-error';
import type { Auth0Client, User } from '@auth0/auth0-spa-js';
import createAuth0Client from '@auth0/auth0-spa-js';
import { get, writable } from 'svelte/store';

export const AuthStore = writable<Promise<Auth0Client>>();
export const AccessToken = writable<string>();
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const UserData = writable<Promise<User | undefined | void>>(new Promise(() => { }));

try {
  AuthStore.set(
    createAuth0Client({
      domain: 'login.tmprl.cloud',
      client_id: 'nTmmPY5xUpQnSr7gRZh7s33hNamtCeDg',
      audience: 'https://saas-api.tmprl.cloud',
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      redirect_uri: new URL('/login/callback', window.location.origin).toString()
    }).catch((e) => {
      console.log('Error in setting up AuthStore', e);
      handleAuthError(e);
    }) as Promise<Auth0Client>
  );
} catch (e) {
  console.error('Error in creating Auth0 Client', e);
}

AuthStore.subscribe(async (AuthClient) => {
  const client = await AuthClient;

  try {
    const accessToken = await client.getTokenSilently({
      audience: 'https://saas-api.tmprl.cloud'
    });

    AccessToken.set(accessToken);
    UserData.set(client.getUser());
  } catch (e) {
    handleAuthError(e);
  }
});

const authEvents: Array<(authToken: string) => void> = [];

AccessToken.subscribe((newToken) => {
  if (newToken) {
    while (authEvents.length) {
      // Resolve each function as FIFO
      const [authConsumer] = authEvents.splice(0, 1);

      if (authConsumer) {
        authConsumer(newToken);
      }
    }
  }
});

function onAuth(authEventConsumer: (authToken: string) => void): void {
  const accessToken = get(AccessToken);

  if (accessToken) {
    authEventConsumer(accessToken);
  } else {
    authEvents.push(authEventConsumer);
  }
}

export { onAuth };

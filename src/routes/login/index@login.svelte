<script context="module" lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import Button from '$lib/components/button.svelte';
  import { routeForAuthentication } from '$lib/utilities/route-for';
  import { faLock } from '@fortawesome/free-solid-svg-icons';

  import { fetchSettings } from '$lib/services/settings-service';

  import type { Load } from '@sveltejs/kit';

  export const load: Load = async function ({ fetch }) {
    const settings: Settings = await fetchSettings(fetch);

    // if (!settings.auth.enabled) {
    //   return {
    //     status: 404,
    //   };
    // }

    return {
      props: { settings },
      stuff: { settings },
    };
  };
</script>

<script lang="ts">
  import NavigationHeader from '$lib/components/navigation-header.svelte';
  import HamburgerHeader from '$lib/components/hamburger-header.svelte';

  export let settings: Settings;

  import { page } from '$app/stores';
  import { handleAuthError } from '$lib/utilities/handle-auth-error';
  import { AuthStore } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  onMount(async () => {
    const auth = await $AuthStore;
    try {
      const state = await auth.handleRedirectCallback();
      let redirectUri = new URL('', $page.url.origin);
      try {
        if (state.appState.redirectUri) {
          // See if we can create a url with the current redirect uri if not we error out and it
          // isn't set
          // This should prevent all sorts of edge cases like javascript root domains, incorrect origins etc.
          redirectUri = new URL(state.appState.redirectUri, $page.url.origin);
        }
      } catch {}
      // window.location instead of goto because we want the nav to re-load with the current user token
      window.location.assign(redirectUri);
    } catch (e: any) {
      console.log('Callback', e);
      handleAuthError(e);
    }
  });
</script>

<NavigationHeader href="/" user={undefined} />
<HamburgerHeader href="/" user={undefined} />
<section class="text-center my-[20vh]">
  <h1 class="text-8xl font-semibold" data-cy="login-title">Welcome back.</h1>
  <p class="my-7" data-cy="login-info">Let's get you signed in.</p>
  <div class="mx-auto">
    <Button
      dataCy="login-button"
      login
      icon={faLock}
      on:click={() => {
        goto(
          routeForAuthentication({
            settings,
            searchParams: $page.url.searchParams,
            originUrl: $page.url.origin,
          }),
        );
      }}>Continue to SSO</Button
    >
  </div>
</section>

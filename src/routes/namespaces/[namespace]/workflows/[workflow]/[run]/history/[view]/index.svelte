<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async function ({ url, params, stuff }) {
    const { matchingEvents, matchingEventGroups } = stuff;

    let items: IterableEvents = [];

    if (params.view === 'summary' && matchingEvents) items = matchingEvents;
    if (params.view === 'compact' && matchingEventGroups)
      items = matchingEventGroups;

    const [first] = items;

    if (matchingEvents && matchingEvents.length && first?.id) {
      url.pathname = `${url.pathname}/${first.id}`;

      return {
        status: 302,
        redirect: String(url),
      };
    }

    return {};
  };
</script>

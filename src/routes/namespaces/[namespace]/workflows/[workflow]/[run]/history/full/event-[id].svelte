<script lang="ts">
  import { getContext } from 'svelte';
  import { page } from '$app/stores';

  import EventDetails from '$lib/components/event-details.svelte';
  import type { Refreshable } from '$lib/stores/refreshable';

  const findEvent = async (
    data: EventualHistoryEvents,
    id: string,
  ): Promise<HistoryEventWithId> => {
    return data.then((events) => events.find((event) => event.id === id));
  };
  let fasd = getContext('workflow');
  let events = getContext<Refreshable<EventualHistoryEvents>>('events');
  $: event = findEvent($events.data, $page.params.id);
</script>

{#await event then { attributes }}
  <EventDetails {attributes} />
{/await}

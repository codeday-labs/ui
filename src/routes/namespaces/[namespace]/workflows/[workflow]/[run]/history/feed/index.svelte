<script lang="ts">
  import { eventHistory } from '$lib/stores/events';

  import EventSummary from '$lib/components/event/event-summary.svelte';
  import Loading from '$lib/components/loading.svelte';
</script>

{#await $eventHistory}
  <Loading />
{:then { events, eventGroups }}
  <EventSummary items={events} groups={eventGroups} />
{/await}

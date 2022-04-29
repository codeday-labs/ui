<script lang="ts">
  import EventSummary from '$lib/components/event/event-summary.svelte';
  import Loading from '$lib/components/loading.svelte';
  import { eventGroups } from '$lib/stores/events';
</script>

{#await $eventGroups}
  <Loading />
{:then items}
  <EventSummary {items} groups={items} compact={true} />
{/await}

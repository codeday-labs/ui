<script lang="ts">
  import { routeForImport } from '$lib/utilities/route-for';

  import ToggleButton from '$lib/holocene/toggle-button/toggle-button.svelte';
  import ToggleButtons from '$lib/holocene/toggle-button/toggle-buttons.svelte';
  import HistoryImport from '../../../../../_event-history-import.svelte';
</script>

<section id="event-history">
  <nav class="flex items-end justify-between gap-4 pb-4">
    <h3 class="text-lg font-medium">Event History</h3>
    <div class="flex gap-4">
      <HistoryImport />
    </div>
  </nav>
  <nav class="my-4 flex items-end justify-end gap-4">
    <div id="event-view-toggle" class="flex gap-4">
      <ToggleButtons>
        <ToggleButton
          icon="feed"
          href={routeForImport({ importType: 'events', view: 'feed' })}
          >Timeline</ToggleButton
        >
        <ToggleButton
          icon="compact"
          href={routeForImport({ importType: 'events', view: 'compact' })}
          >Compact</ToggleButton
        >
        <ToggleButton
          icon="json"
          href={routeForImport({ importType: 'events', view: 'json' })}
          >JSON</ToggleButton
        >
      </ToggleButtons>
    </div>
  </nav>
  <slot />
</section>

<script lang="ts">
  import Icon from '$lib/holocene/icon/index.svelte';

  import { timeFormat } from '$lib/stores/time-format';
  import { formatDate } from '$lib/utilities/format-date';

  import EmptyState from '$lib/holocene/empty-state.svelte';
  import type { GetPollersResponse } from '$lib/services/pollers-service';

  export let taskQueue: string;
  export let workers: GetPollersResponse;
</script>

<section class="flex flex-col gap-4">
  <h3 class="text-lg font-medium">
    Task Queue: <span class="select-all font-normal">{taskQueue}</span>
  </h3>
  <section class="flex w-full flex-col rounded-lg border-2 border-gray-900">
    <div class="flex flex-row bg-gray-900 p-2 text-white">
      <div class="w-3/12 text-left">ID</div>
      <div class="w-3/12 text-left">Last Accessed</div>
      <div class="w-3/12 text-left">Workflow Task Handler</div>
      <div class="w-2/12 text-left">Activity Handler</div>
    </div>
    {#each workers.pollers as poller (poller.identity)}
      <article
        class="flex h-full w-full flex-row border-b-2 p-2 no-underline last:border-b-0"
        data-cy="worker-row"
      >
        <div class="links w-3/12 text-left" data-cy="worker-identity">
          <p class="select-all">{poller.identity}</p>
        </div>
        <div class="links w-3/12 text-left" data-cy="worker-last-access-time">
          <h3>
            <p class="select-all">
              {formatDate(poller.lastAccessTime, $timeFormat)}
            </p>
          </h3>
        </div>
        <div class="w-3/12 text-left">
          {#if poller.taskQueueTypes.includes('WORKFLOW')}
            <Icon name="checkMark" stroke="blue" />
          {:else}
            <Icon name="close" stroke="black" />
          {/if}
        </div>
        <div class="w-3/12 text-left">
          {#if poller.taskQueueTypes.includes('ACTIVITY')}
            <Icon name="checkMark" stroke="blue" />
          {:else}
            <Icon name="close" stroke="black" />
          {/if}
        </div>
      </article>
    {:else}
      <EmptyState title={'No Workers Found'} />
    {/each}
  </section>
</section>

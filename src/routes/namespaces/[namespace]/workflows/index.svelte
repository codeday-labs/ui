<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit';

  export async function load({ page, fetch }: LoadInput) {
    if (!page.query.has('time-range')) page.query.set('time-range', '24 hours');

    const namespace = page.params.namespace;
    const workflowId = page.query.get('workflow-id');
    const workflowType = page.query.get('workflow-type');
    const timeRange = page.query.get('time-range');
    const executionStatus = page.query.get('status') as WorkflowStatus;

    const parameters: FilterParameters = {
      workflowId,
      workflowType,
      timeRange,
      executionStatus,
    };
    const initialData = await fetchAllWorkflows(namespace, parameters, fetch);

    return {
      props: { initialData, namespace, parameters },
    };
  }
</script>

<script lang="ts">
  import VirtualList from '@sveltejs/svelte-virtual-list';

  import { fetchAllWorkflows } from '$lib/services/workflow-service';
  import { refreshable } from '$lib/stores/refreshable';

  import WorkflowsSummaryTable from './_workflows-summary-table.svelte';
  import WorkflowsSummaryRow from './_workflows-summary-row.svelte';
  import WorkflowFilters from './_workflow-filters.svelte';
  import EmptyState from '$lib/components/empty-state.svelte';
  import WorkflowsLoadingState from './_workflows-loading.svelte';

  export let namespace: string;
  export let initialData: ReturnType<typeof fetchAllWorkflows>;
  export let parameters: FilterParameters;

  let timeFormat: TimeFormat = 'UTC';

  $: data = refreshable(
    () => fetchAllWorkflows(namespace, parameters),
    initialData,
  );
</script>

<h2 class="text-2xl">Workflows</h2>
<WorkflowFilters bind:timeFormat />
{$data.timeRemaining}
{$data.percentCompleted} %
<div class="grid gap-5 grid-cols-12">
  <button
    on:click={data.pause}
    class="rounded bg-blue-500 text-offWhite p-2 col-span-6">Pause</button
  >
  <button
    on:click={data.restart}
    class="rounded bg-blue-500 text-offWhite p-2 col-span-6">Restart</button
  >
</div>
<div class="w-full">
  <div
    class="h-10 bg-blueGray-500 transition-width ease-in duration-200	"
    style:width={$data.percentCompleted + '%'}
  />
</div>
{#await $data.data}
  <WorkflowsLoadingState />
{:then { workflows }}
  {#if workflows.length}
    <WorkflowsSummaryTable>
      <VirtualList items={workflows} let:item>
        <WorkflowsSummaryRow workflow={item} {timeFormat} />
      </VirtualList>
    </WorkflowsSummaryTable>
  {:else}
    <EmptyState
      title={'No Workflows Found'}
      content={'If you have filters applied, try adjusting them.'}
    />
  {/if}
{/await}

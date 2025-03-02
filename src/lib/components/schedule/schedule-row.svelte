<script lang="ts">
  import type { ScheduleListEntry } from '$types';
  import { page } from '$app/stores';
  import { timeFormat } from '$lib/stores/time-format';
  import { formatDate } from '$lib/utilities/format-date';
  import { routeForSchedule, routeForWorkflow } from '$lib/utilities/route-for';
  import WorkflowStatus from '$lib/components/workflow-status.svelte';
  import Link from '$lib/holocene/link.svelte';

  import ScheduleFrequency from './schedule-frequency.svelte';

  let { namespace } = $page.params;
  export let schedule: ScheduleListEntry;

  const getRoute = () =>
    routeForSchedule({
      namespace,
      scheduleId: schedule?.scheduleId as string,
    });
</script>

<a sveltekit:prefetch href={getRoute()} class="row">
  <div class="cell">
    <WorkflowStatus status={schedule?.info?.paused ? 'Paused' : 'Running'} />
  </div>
  <div class="cell truncate">
    {schedule.scheduleId}
    <p>
      <small class="text-gray-900"
        ><ScheduleFrequency
          calendar={schedule?.info?.spec?.calendar?.[0]}
          interval={schedule?.info?.spec?.interval?.[0]}
        /></small
      >
    </p>
  </div>
  <div class="cell">
    {schedule?.info?.workflowType?.name}
  </div>
  <div class="cell links hidden xl:table-cell">
    {#each schedule?.info?.recentActions?.reverse().slice(0, 5) ?? [] as run}
      <p>
        <Link
          href={routeForWorkflow({
            namespace,
            workflow: run?.startWorkflowResult?.workflowId,
            run: run?.startWorkflowResult?.runId,
          })}>{formatDate(run?.actualTime, $timeFormat)}</Link
        >
      </p>
    {/each}
  </div>
  <div class="cell hidden xl:table-cell">
    {#each schedule?.info?.futureActionTimes?.slice(0, 5) ?? [] as run}
      <div>{formatDate(run, $timeFormat, 'from now')}</div>
    {/each}
  </div>
</a>

<style lang="postcss">
  .row {
    @apply block h-36 items-center border-b-2 p-2 text-sm no-underline last-of-type:border-b-0 xl:table-row xl:text-base;
  }

  .row:hover {
    @apply bg-gray-50;
  }

  .cell {
    @apply border-gray-700 p-2 text-left xl:table-cell xl:border-b-2;
  }

  .row:last-of-type .cell {
    @apply border-b-0 first-of-type:rounded-bl-lg  last-of-type:rounded-br-lg;
  }
</style>

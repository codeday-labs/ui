<script lang="ts">
  import type { Refreshable } from '$lib/stores/refreshable';
  import { interval } from '$lib/stores/refreshable';
  export let data: Refreshable<any>;
  $: intervalData = interval(data);
</script>

{$intervalData.timeRemaining}
{$intervalData.percentCompleted} %
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
    style:width={$intervalData.percentCompleted + '%'}
  />
</div>

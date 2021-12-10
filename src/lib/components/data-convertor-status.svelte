<script lang="ts">
  import {
    dataConverterPort,
    lastDataConverterStatus,
  } from '$lib/stores/data-converter-config';
  import Tooltip from '$lib/components/tooltip.svelte';
</script>

{#if $dataConverterPort}
  {#if $lastDataConverterStatus === 'notRequested'}
    <Tooltip text={'Data converter is configured'}>
      <p class="mx-auto text-gray-400 w-8 h-8">Offline</p>
    </Tooltip>
  {:else if $lastDataConverterStatus === 'error'}
    <Tooltip text={`Data converter couldn't connect to the remote converter`}>
      <p class="mx-auto text-red-400 w-8 h-8">Offline</p>
    </Tooltip>
  {:else if $lastDataConverterStatus === 'success'}
    <Tooltip text={'Data converter succesfully converted content'}>
      <p class="mx-auto text-green-500 w-8 h-8">Online</p>
    </Tooltip>
  {/if}
{/if}

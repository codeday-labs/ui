<script lang="ts">
  import Icon from 'svelte-fa';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons';
  import { inputAndResults } from '$lib/stores/events';

  import CodeBlock from '$lib/components/code-block.svelte';
  import Loading from '$lib/components/loading.svelte';

  export let title: string;
  export let type: 'input' | 'results';
  export let workflow: WorkflowExecution;

  $: inProgress = workflow.isRunning && type === 'results';
</script>

<article
  class="flex flex-col border-2 border-gray-300 p-4 rounded-lg w-full lg:w-1/2"
  data-cy="workflow-input-and-results"
>
  <h3 class="text-lg">{title}</h3>
  {#if inProgress}
    <Loading title="In progress…" />
  {:else}
    {#await $inputAndResults}
      <Loading />
    {:then content}
      <CodeBlock content={content[type]} class="mb-2 max-h-96" />
    {/await}
  {/if}
</article>

<script lang="ts">
  import CodeBlock from '$lib/components/code-block.svelte';
  import { events } from '$lib/stores/events';
  import Loading from '$lib/components/loading.svelte';
</script>

{#await $events}
  <Loading />
{:then content}
  <CodeBlock {content} />
{/await}

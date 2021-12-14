<script lang="ts">
  export let id: string;
  export let value: string;
</script>

<div class="flex flex-col items-start justify-center">
  <input class="block border-2 text-sm p-2 w-full h-10" {id} bind:value />
</div>

<style lang="postcss">
  div {
    @apply w-1/5;
  }
</style>

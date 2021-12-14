<script lang="ts">
  export let id: string;
  export let value: string;
  export let name: string = '';
</script>

<div class="flex flex-col items-start justify-center">
  <label for={id} class="hidden">{name}</label>
  <input
    class="block border-2 text-base p-2 w-1 h-10 rounded-lg "
    placeholder={name}
    {id}
    bind:value
  />
</div>

<style lang="postcss">
  div {
    @apply w-1/5;
  }
</style>

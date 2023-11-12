<script lang="ts">
  export let condition: boolean;
  export let cls = '' as string;
  export let url: string;

  //$: console.log(condition);
</script>

{#if condition}
  <a class={cls} href={url}>
    <slot />
  </a>
{:else}
  <slot />
{/if}

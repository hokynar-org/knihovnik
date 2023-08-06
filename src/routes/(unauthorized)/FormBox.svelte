<script lang="ts">
  import Spinner from '$lib/components/Spinner.svelte';

  export let subtitle: string | undefined = undefined;
  export let loading: boolean | undefined = undefined;
</script>

<div
  class="box md:w-[400px] p-4 md:p-8 md:bg-surface-100-800-token border-0 border-muted rounded-xl relative"
>
  <h1 class="text-center text-4xl">Knihovník</h1>
  {#if subtitle}
    <h2 class="text-center text-lg text-surface-500-400-token">{subtitle}</h2>
  {/if}
  <main class="mt-4">
    <slot />
  </main>
  {#if loading}
    <div
      class="absolute inset-0 rounded-xl bg-surface opacity-90 flex center items-center justify-center"
    >
      <Spinner color="rgb(var(--color-foreground))" />
    </div>
  {/if}
</div>

<style lang="scss">
  @media screen and (min-width: 768px) {
    .box {
      margin-top: min(10svmin, theme('margin.48'));
    }
  }
</style>

<script lang="ts">
  import Spinner from '$lib/components/Spinner.svelte';

  export let subtitle: string | undefined = undefined;
  export let loading: boolean | undefined = undefined;
</script>

<div
  class="box md:min-w-[420px] p-4 md:bg-surface border-0 border-muted rounded-xl relative"
>
  <h1 class="text-center text-4xl">Knihovník</h1>
  {#if subtitle}
    <h2 class="text-center text-lg text-muted">{subtitle}</h2>
  {/if}
  <main class="mt-4">
    <slot />
  </main>
  {#if loading}
    <div
      class="absolute inset-0 rounded-xl bg-surface opacity-90 flex items-center justify-center"
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

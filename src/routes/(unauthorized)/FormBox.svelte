<script lang="ts">
  export let subtitle: string | undefined = undefined;
</script>

<div
  class="box md:min-w-[420px] p-4 md:bg-surface border-0 border-muted rounded-xl"
>
  <h1 class="text-center text-4xl">Knihovník</h1>
  {#if subtitle}
    <h2 class="text-center text-lg text-muted">{subtitle}</h2>
  {/if}
  <main class="mt-4">
    <slot />
  </main>
</div>

<style lang="scss">
  @media screen and (min-width: 768px) {
    .box {
      margin-top: min(10svmin, theme('margin.48'));
    }
  }
</style>

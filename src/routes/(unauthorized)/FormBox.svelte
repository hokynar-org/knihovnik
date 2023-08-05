<script lang="ts">
  export let subtitle: string | undefined = undefined;
</script>

<div
  class="md:min-w-[420px] md:mt-48 p-4 md:bg-surface border-0 border-muted rounded-xl"
>
  <h1 class="text-center text-4xl">Knihovník</h1>
  {#if subtitle}
    <h2 class="text-center text-lg text-muted">{subtitle}</h2>
  {/if}
  <main class="mt-4">
    <slot />
  </main>
</div>

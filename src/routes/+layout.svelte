<script lang="ts">
  import '../app.scss';
</script>

<svelte:head>
  <title>Knihovník</title>
</svelte:head>

<div id="root" class="text-foreground bg-background">
  <slot />
</div>

<style>
  #root {
    min-height: 100vh;
    min-height: 100dvh;
  }
</style>

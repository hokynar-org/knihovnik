<script lang="ts">
  import '../app.scss';

  import { browser } from '$app/environment';

  export let data;
  $: darkMode = data.darkMode;

  // TODO: remove this later
  if (browser) {
    (window as any).toggleDarkMode = () => {
      darkMode.update((v) => !v);
    };
  }
</script>

<svelte:head>
  <title>Knihovník</title>
</svelte:head>

<div id="root" class="text-foreground bg-background" class:dark={$darkMode}>
  <slot />
</div>

<style>
  #root {
    min-height: 100vh;
    min-height: 100dvh;
  }
</style>

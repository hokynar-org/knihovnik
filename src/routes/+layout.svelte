<script lang="ts">
  import '../app.css';

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

<div
  id="root"
  class="min-h-screen text-foreground bg-background"
  class:dark={$darkMode}
>
  <slot />
</div>

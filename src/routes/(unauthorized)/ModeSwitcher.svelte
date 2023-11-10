<script lang="ts">
  import type { Writable } from 'svelte/store';

  export let darkMode: Writable<boolean>;

  $: nextMode = $darkMode ? 'light' : 'dark';

  function toggle() {
    darkMode.update((v) => !v);
  }
</script>

<div class="mt-4 space-y-2 text-center text-surface-500-400-token">
  <slot />
  <button class="underline text-sm" on:click|preventDefault={toggle}>
    Switch to {nextMode} mode
  </button>
</div>

<script lang="ts">
  import { selectedIcon } from '$lib/components/IconSelector/stores';
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
  export let icon: IconDefinition;
  import Fa from 'svelte-fa';
  function selectIcon(icon: IconDefinition) {
    $selectedIcon = icon;
  }
</script>

<button
  class="relative flex h-16 w-16 items-center justify-center rounded-full p-5 text-center shadow-2xl;"
  type="button"
  on:click={() => {
    selectIcon(icon);
  }}
  class:bg-surface-600={$selectedIcon == icon}
  class:bg-surface-800={$selectedIcon != icon}
>
  <Fa size="2x" {icon} />
</button>

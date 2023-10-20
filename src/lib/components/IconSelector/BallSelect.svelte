<script lang="ts">
  import { selectedIconNameStore } from '$lib/components/IconSelector/stores';
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
  export let icon: IconDefinition;
  import Fa from 'svelte-fa';
  function selectIcon(icon: IconDefinition) {
    $selectedIconNameStore = icon.iconName;
  }
</script>

<button
  class="relative flex h-16 w-16 items-center justify-center rounded-full p-5 text-center shadow-2xl;"
  type="button"
  on:click={() => {
    selectIcon(icon);
  }}
  class:bg-surface-300-600-token={$selectedIconNameStore == icon.iconName}
  class:bg-surface-100-800-token={$selectedIconNameStore != icon.iconName}
>
  <Fa size="2x" {icon} />
</button>

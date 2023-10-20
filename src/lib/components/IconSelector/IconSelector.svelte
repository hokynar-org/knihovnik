<script lang="ts">
  import BallSelect from './BallSelect.svelte';
  import { iconList } from './iconList';
  import { selectedIconNameStore } from './stores';
  export let selectedIconName: string | null;
  $selectedIconNameStore = selectedIconName;
  $: selectedIconName = $selectedIconNameStore;
</script>

<div class="grid grid-cols-4 gap-y-2 gap-x-2">
  {#each iconList as icon}
    <BallSelect {icon} />
  {/each}
</div>

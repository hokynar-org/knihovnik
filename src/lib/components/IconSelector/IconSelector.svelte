<script lang="ts">
  import BallSelect from './BallSelect.svelte';
  import { iconList } from './iconList';
  import { selectedIcon } from './stores';
  export let selectedIconName: string | null = null;
  $: selectedIconName = $selectedIcon ? $selectedIcon.iconName : null;
  $: console.log(selectedIconName);
</script>

<div class="grid grid-cols-4 gap-y-2 gap-x-2">
  {#each iconList as icon}
    <BallSelect {icon} />
  {/each}
</div>

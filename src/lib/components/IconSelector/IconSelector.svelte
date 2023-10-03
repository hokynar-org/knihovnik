<script lang="ts">
  import BallSelect from './BallSelect.svelte';
  import Fa from 'svelte-fa';
  import { iconList } from './iconList';
</script>

<div class="grid grid-cols-4 gap-y-2 gap-x-2">
  {#each iconList as iconName, index}
    <BallSelect no={index + 1}><Fa size="2x" icon={iconName} /></BallSelect>
  {/each}
</div>

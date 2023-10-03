<script lang="ts">
  import { selectedIconId } from '$lib/components/IconSelector/stores';
  export let no = -1;

  function selectIcon(n: number): void {
    $selectedIconId = n;
  }
</script>

<button
  class="relative flex h-16 w-16 items-center justify-center rounded-full p-5 text-center shadow-2xl;"
  on:click={() => {
    selectIcon(no);
  }}
  class:bg-surface-600={$selectedIconId == no}
  class:bg-surface-800={$selectedIconId != no}
>
  <slot />
</button>

<script lang="ts">
  import Fa from 'svelte-fa';
  import { faHandHoldingHand } from '@fortawesome/free-solid-svg-icons';
  export let options: string[];
  export let selected: string = options[0];
</script>

<div class="flex flex-col">
  {#each options as option, index}
    <label>
      <input
        class="radio"
        type="radio"
        name="option"
        value={option}
        bind:group={selected}
      />
      {option}
    </label>
  {/each}
</div>

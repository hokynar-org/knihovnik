<script lang="ts">
  import Fa from 'svelte-fa';
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
  export let options: string[];
  export let emojis: IconDefinition[];
  export let selected: string = options[0];
</script>

<div class="flex flex-col">
  {#each options as option, index}
    <label class="flex items-center">
      <input
        class="radio"
        type="radio"
        name="option"
        value={option}
        bind:group={selected}
      />
      <p class="flex items-center ml-2 mr-1">
        <Fa size="lg" icon={emojis[index]} />
      </p>
      <p>
        {option}
      </p>
    </label>
  {/each}
</div>

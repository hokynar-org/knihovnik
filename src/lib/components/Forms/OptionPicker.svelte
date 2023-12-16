<script lang="ts">
  import Fa from 'svelte-fa';
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
  export let options: { name: string; value: string; icon: IconDefinition }[];
  export let selected: string = options[0].value;
</script>

<div class="flex flex-col w-min">
  {#each options as option, index}
    <label class="flex items-center">
      <input
        class="radio"
        type="radio"
        name="option"
        value={option.value}
        bind:group={selected}
      />
      <p class="flex items-center ml-2 mr-1">
        <Fa size="lg" icon={option.icon} />
      </p>
      <p>
        {option.name}
      </p>
    </label>
  {/each}
</div>

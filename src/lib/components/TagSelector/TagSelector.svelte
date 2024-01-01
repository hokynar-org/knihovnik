<script lang="ts">
  import { tagList } from './tagList';
  const possibleTags: string[] = tagList;
  export let selectedTags: string[] = [];

  let notSelectedTags: string[] = [];
  $: notSelectedTags = possibleTags.filter(
    (element) => !selectedTags.includes(element),
  );

  function Select(tag: string): void {
    if (!selectedTags.includes(tag)) {
      selectedTags = [...selectedTags, tag];
    }
  }
  function DeSelect(tag: string): void {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter((element) => element !== tag);
    }
  }
</script>

<p>selected</p>

{#each selectedTags as tag}
  <button
    type="button"
    class="chip variant-filled mx-1 my-1"
    on:click={() => {
      DeSelect(tag);
    }}
  >
    {tag}
  </button>
{/each}

<p>not selected</p>

{#each notSelectedTags as tag}
  <button
    type="button"
    class="chip variant-filled mx-1 my-1"
    on:click={() => {
      Select(tag);
    }}
  >
    {tag}
  </button>
{/each}

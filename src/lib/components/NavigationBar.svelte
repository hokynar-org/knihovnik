<script lang="ts">
  import { page } from '$app/stores';
  import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
  import ConditionalAnchor from './Utilities/ConditionalAnchor.svelte';

  export let names: string[];
  export let urls: string[];
  export let activeNo: number;
  export let cls = '';

  let url: string = '';
  $: url = String($page.url);

  $: for (let i = 0; i < urls.length; i++) {
    if (url.endsWith(urls[i])) {
      activeNo = i;
    }
  }
</script>

<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
  {#each names as name, id}
    <ConditionalAnchor condition={!(id == activeNo)} url={urls[id]}>
      <RadioItem bind:group={activeNo} name="justify" value={id}>
        <span class={cls}>{name}</span>
      </RadioItem>
    </ConditionalAnchor>
  {/each}
</RadioGroup>

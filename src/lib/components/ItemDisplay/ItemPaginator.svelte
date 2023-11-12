<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    faArrowLeft,
    faArrowRight,
    faEllipsis,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import PageButton from './PageButton.svelte';
  export let limit: number;
  export let offset: number;
  export let length: number;
  export let root: string;
  export let search: string | null;
  export let cls = '' as string;
  const pagesShown = (length: number, limit: number, offset: number) => {
    const pagesTotal = Math.max(Math.ceil(length / limit), 1);
    const thisPage = Math.max(Math.floor(offset / limit) + 1, 1);
    const pgs: number[] = [];
    for (let i = 1; i <= pagesTotal; i++) {
      if (
        i == 1 ||
        i == pagesTotal ||
        i == thisPage ||
        Math.abs(i - thisPage) <= 1
      ) {
        pgs.push(i);
      }
    }
    return pgs;
  };
  let pages = pagesShown(length, limit, offset);
  $: pages = pagesShown(length, limit, offset);
</script>

{#if length > 0}
  <div class="flex gap-0 {cls}">
    {#each pages as page, index (page)}
      {#if index > 0 && pages[index - 1] != page - 1}
        <div class="w-10 h-10 flex items-center justify-center">
          <Fa icon={faEllipsis} />
        </div>
      {/if}
      <PageButton
        {page}
        {limit}
        {root}
        {search}
        disabled={page == Math.max(Math.floor(offset / limit) + 1, 1)}
      />
    {/each}
  </div>
{/if}

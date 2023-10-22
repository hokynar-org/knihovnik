<script lang="ts">
  import { onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import type { Community, CommunityRelation } from '$lib/types';
  export let community: Community;
  export let relation: CommunityRelation | null;

  var fontSize = 16;
</script>

<div
  id="oneCard"
  class="card w-80 h-min rounded shadow-lg variant-filled-surface-700 overflow-visible"
>
  <div class="pt-1 px-4 1 h-auto overflow-visible">
    <div>
      <h4 class="py-1 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
        <a href="/community/{community.id}">{community.name}</a>
      </h4>
    </div>
    <a class="font-normal" href="/community/{community.id}">
      <div
        id="textbox"
        style="--fsize:{fontSize}"
        class="mt-2 min-h-12e text-min-height"
      >
        {#if community.description}
          {community.description}
        {/if}
      </div></a
    >
  </div>
  <div class="my-2 px-4 pt-2">
    {#if relation}
      {#if relation.role == 'MEMBER'}
        You are a member
      {:else if relation.role == 'ADMIN'}
        You are a admin
      {:else if relation.role == 'INVITED'}
        You have been invited
      {:else if relation.role == 'REQUESTED'}
        Your request is pending
      {/if}
    {/if}
  </div>
</div>

<style>
  .text-min-height {
    min-height: calc(1.5 * var(--fsize) * 1px * 4); /* 4 lines of text */
  }
</style>

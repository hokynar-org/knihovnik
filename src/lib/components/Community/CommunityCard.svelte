<script lang="ts">
  import { onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import type { Community, CommunityRelation } from '$lib/types';
  import { faLock } from '@fortawesome/free-solid-svg-icons';
  export let community: Community;
  export let relation: CommunityRelation | null;

  var fontSize = 16;
</script>

<div>
  <a href="/community/{community.id}" class="inherit !no-underline font-normal">
    <div
      id="oneCard"
      class="card w-80 h-min rounded shadow-lg variant-filled-surface-700 overflow-visible hover:shadow-xl"
    >
      <div class="pt-1 px-4 1 h-auto overflow-visible">
        <div class="flex flex-row justify-between items-center">
          <h4 class="py-1 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
            {community.name}
          </h4>
          {#if !community.visibility}
            <Fa icon={faLock} />
          {/if}
        </div>
        <div
          id="textbox"
          style="--fsize:{fontSize}"
          class="mt-2 min-h-12e text-min-height"
        >
          {#if community.description}
            {community.description}
          {/if}
        </div>
      </div>
      <div class="py-2 px-4 pt-2">
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
        {:else}
          <br />
        {/if}
      </div>
    </div>
  </a>
</div>

<style>
  .text-min-height {
    min-height: calc(1.5 * var(--fsize) * 1px * 4); /* 4 lines of text */
  }
</style>

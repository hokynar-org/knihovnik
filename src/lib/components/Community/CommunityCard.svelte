<script lang="ts">
  import { onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import { faUser, faCube, faC } from '@fortawesome/free-solid-svg-icons';
  import type { Community, CommunityPlus, CommunityRelation } from '$lib/types';
  import { faLock } from '@fortawesome/free-solid-svg-icons';
  export let community: CommunityPlus;

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
      <div class="py-2 px-4 pt-2 flex items-end w-full justify-between">
        <div>
          {#if community.role}
            {#if community.role == 'MEMBER'}
              You are a member
            {:else if community.role == 'ADMIN'}
              You are a admin
            {:else if community.role == 'INVITED'}
              You have been invited
            {:else if community.role == 'REQUESTED'}
              Your request is pending
            {/if}
          {:else}
            <br />
          {/if}
        </div>
        <table>
          <tbody>
            <tr>
              <td class="w-6">
                <Fa icon={faUser} />
              </td>
              <td class="w-10">
                {community.userCount}
              </td>
            </tr>
            <tr>
              <td>
                <Fa icon={faCube} />
              </td>
              <td>
                {community.itemCount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </a>
</div>

<style>
  .text-min-height {
    min-height: calc(1.5 * var(--fsize) * 1px * 4); /* 4 lines of text */
  }
</style>

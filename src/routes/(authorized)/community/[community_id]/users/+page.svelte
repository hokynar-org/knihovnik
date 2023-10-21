<script lang="ts">
  import CommunityUsers from '$lib/components/Community/CommunityUsers.svelte';
  import type { CommunityRelation } from '$lib/types.js';
  export let data;
  $: community = data.community;
  $: community_users = data.community_users;
  $: role = data.role;

  let disabled = false;

  const leave = async () => {
    const res = await fetch('/api/community/' + community.id + '/leave', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
</script>

{#if role && (role == 'MEMBER' || role == 'ADMIN')}
  <div class="mt-6">
    Your role is {role}
    <button
      {disabled}
      class="btn variant-filled-error py-1 my-2"
      on:click={() => {
        disabled = true;
        leave()
          .then((value) => {
            disabled = false;

            role = null;
          })
          .catch((reason) => {
            disabled = false;
          });
      }}
    >
      Leave
    </button>
  </div>
{/if}

<CommunityUsers {community_users} cls="mt-6" />

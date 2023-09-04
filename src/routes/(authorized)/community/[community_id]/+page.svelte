<script lang="ts">
  import type { Community, PublicUserSafe, User } from '$lib/types';
  export let data;
  $: community = data.community;
  $: community_users = data.community_users;
  $: role = data.role;
  let found_users: PublicUserSafe[] = [];
  let search_name = '';
  const search = async (user_name: string) => {
    const res = await fetch('/api/find_user/' + user_name, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as PublicUserSafe[];
  };
  const invite = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/invite',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  };
  const kick = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/kick',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  };
  const confirm = async () => {
    const res = await fetch('/api/community/' + community.id + '/confirm', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  };
  const reject = async () => {
    const res = await fetch('/api/community/' + community.id + '/reject', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  };
</script>

<h4>Community: {community.name}</h4>
<p>{community.description}</p>
<div>
  {#if role}
    You are a {role}
  {/if}
</div>
<div>
  {#each community_users as community_user}
    {community_user.user.user_name} ({community_user.relation.role})
    {#if role == 'ADMIN'}
      <button
        class="btn variant-filled-error py-1 my-2"
        on:click={() => {
          kick(community_user.user.id)
            .then((value) => {})
            .catch((reason) => {});
        }}
      >
        Kick
      </button>
    {/if}
    <br />
  {/each}
</div>
{#if role == 'ADMIN'}
  <div>
    <input type="text" bind:value={search_name} />
    <button
      class="btn variant-filled-primary py-1 my-2"
      on:click={() => {
        search(search_name)
          .then((value) => {
            found_users = value;
          })
          .catch((reason) => {
            found_users = [];
          });
      }}
    >
      Hledej
    </button>
    <div>
      {#each found_users as user (user.id)}
        {user.user_name}
        <button
          class="btn variant-filled-primary py-1 my-2"
          on:click={() => {
            invite(user.id)
              .then((value) => {})
              .catch((reason) => {});
          }}
        >
          Invite
        </button>
      {/each}
    </div>
  </div>
{/if}
{#if role == 'INVITED'}
  <button
    class="btn variant-filled-primary py-1 my-2"
    on:click={() => {
      confirm()
        .then((value) => {})
        .catch((reason) => {});
    }}
  >
    Confirm
  </button>
  <button
    class="btn variant-filled-error py-1 my-2"
    on:click={() => {
      reject()
        .then((value) => {})
        .catch((reason) => {});
    }}
  >
    Reject
  </button>
{/if}

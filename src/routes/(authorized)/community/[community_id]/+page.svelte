<script lang="ts">
  import Item from '$lib/Item.svelte';
  import Chat from '$lib/Chat.svelte';
  import { pusher } from '$lib/store.js';
  import type {
    CommunityMessage,
    Community,
    PublicUserSafe,
    User,
    CommunityMessagePlus,
  } from '$lib/types';
  import { onDestroy } from 'svelte';

  export let data;
  $: user = data.user;
  $: community = data.community;
  $: community_users = data.community_users;
  $: community_messages = data.community_messages;
  $: community_items = data.community_items;
  $: role = data.role;

  let found_users: PublicUserSafe[] = [];
  let search_name = '';
  let disabled = false;
  let fallback = false;
  if ($pusher) {
    const channel = $pusher.subscribe(
      'private-community-' + String(data.community.id),
    );
    channel.bind('message', (data: { message: CommunityMessagePlus }) => {
      community_messages = [...community_messages, data.message];
    });
    onDestroy(() => {
      channel.unsubscribe();
    });
  } else {
    fallback = true;
  }
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
  const accept = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/accept',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  };
  const deny = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/deny',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  };
  const promote = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/promote',
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
  const request = async () => {
    const res = await fetch('/api/community/' + community.id + '/request', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  };
  const leave = async () => {
    const res = await fetch('/api/community/' + community.id + '/leave', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  };
</script>

<h4 class="mt-4 mb-2">Community: {community.name}</h4>
<p>
  {community.description}
</p>
<div>
  {#if role}
    Your role is {role}
    {#if role == 'MEMBER' || role == 'ADMIN'}
      <button
        class="btn variant-filled-error py-1 my-2"
        on:click={() => {
          leave()
            .then((value) => {})
            .catch((reason) => {});
        }}
      >
        Leave
      </button>
    {/if}
  {:else}
    <button
      class="btn variant-filled-primary py-1 my-2"
      on:click={() => {
        request()
          .then((value) => {})
          .catch((reason) => {});
      }}
    >
      Request
    </button>
  {/if}
</div>

<div>
  <h3 class="mt-4 mb-2 text-xl">Users in this community</h3>
  {#each community_users as community_user}
    <a href={'/user/' + user.id}>{community_user.user.user_name}</a>
    ({community_user.relation.role})
    {#if role == 'ADMIN'}
      {#if community_user.relation.role == 'MEMBER'}
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
        <button
          class="btn variant-filled-primary py-1 my-2"
          on:click={() => {
            promote(community_user.user.id)
              .then((value) => {})
              .catch((reason) => {});
          }}
        >
          Promote
        </button>
      {:else if community_user.relation.role == 'REQUESTED'}
        <button
          class="btn variant-filled-primary py-1 my-2"
          on:click={() => {
            accept(community_user.user.id)
              .then((value) => {})
              .catch((reason) => {});
          }}
        >
          Accept
        </button>
        <button
          class="btn variant-filled-error py-1 my-2"
          on:click={() => {
            deny(community_user.user.id)
              .then((value) => {})
              .catch((reason) => {});
          }}
        >
          Deny
        </button>
      {/if}
    {/if}
    <br />
  {/each}
</div>
{#if role == 'ADMIN'}
  <h3 class="mt-4 mb-2 text-xl">Find and invite users</h3>
  <div>
    <input class="input" type="text" bind:value={search_name} />
    <div class="flex content-center justify-center my-3">
      <button
        class="btn variant-filled-primary py-1"
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
    </div>
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
<div class="mt-6 border-solid border-2 pl-4">
  <h3 class="mt-4 mb-2 text-xl">Community chat</h3>
  <Chat messages={community_messages} {user} isadmin={false} />
</div>

<div class="mt-6">
  {#each community_items as offer (offer.item.id)}
    <Item item={offer.item} owner={offer.owner} holder={null}></Item>
  {/each}
</div>

<style>
</style>

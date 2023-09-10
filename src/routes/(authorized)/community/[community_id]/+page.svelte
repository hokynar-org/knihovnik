<script lang="ts">
  import Item from '$lib/Item.svelte';
  import Chat from '$lib/Chat.svelte';
  import Fa from 'svelte-fa';
  import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
  import { pusher } from '$lib/store.js';
  import type {
    CommunityMessage,
    CommunityRelation,
    PublicUserSafe,
    User,
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
    channel.bind('message', (data: { message: CommunityMessage }) => {
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
    return (await res.json()) as CommunityRelation;
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
    return (await res.json()) as CommunityRelation;
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
    return (await res.json()) as CommunityRelation;
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
    return (await res.json()) as CommunityRelation;
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
    return (await res.json()) as CommunityRelation;
  };
  const confirm = async () => {
    const res = await fetch('/api/community/' + community.id + '/confirm', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
  const reject = async () => {
    const res = await fetch('/api/community/' + community.id + '/reject', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
  const request = async () => {
    const res = await fetch('/api/community/' + community.id + '/request', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
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

<h4 class="mt-4 mb-2">Community: {community.name}</h4>
<p>
  {community.description}
</p>
<div>
  {#if role}
    Your role is {role}
    {#if role == 'MEMBER' || role == 'ADMIN'}
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
    {/if}
  {:else}
    <button
      class="btn variant-filled-primary py-1 my-2"
      on:click={() => {
        request()
          .then((value) => {
            role = value.role;
          })
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
    <a href={'/user/' + community_user.user.id}
      >{community_user.user.user_name}</a
    >
    ({community_user.relation.role})
    {#if role == 'ADMIN'}
      {#if community_user.relation.role == 'MEMBER'}
        <button
          {disabled}
          class="btn variant-filled-error py-1 my-2"
          on:click={() => {
            disabled = true;

            kick(community_user.user.id)
              .then((value) => {
                community_users = community_users.filter((fvalue) => {
                  value.user_id != fvalue.user.id;
                });
                disabled = false;
              })
              .catch((reason) => {
                disabled = false;
              });
          }}
        >
          Kick
        </button>
        <button
          class="btn variant-filled-primary py-1 my-2"
          {disabled}
          on:click={() => {
            disabled = true;

            promote(community_user.user.id)
              .then((value) => {
                community_users = community_users.flatMap((fvalue) => {
                  if (value.user_id != fvalue.user.id) {
                    return fvalue;
                  } else {
                    return { relation: value, user: fvalue.user };
                  }
                });
                disabled = false;
              })
              .catch((reason) => {
                disabled = false;
              });
          }}
        >
          Promote
        </button>
      {:else if community_user.relation.role == 'REQUESTED'}
        <button
          class="btn variant-filled-primary py-1 my-2"
          {disabled}
          on:click={() => {
            disabled = true;
            accept(community_user.user.id)
              .then((value) => {
                community_users = community_users.flatMap((fvalue) => {
                  if (value.user_id != fvalue.user.id) {
                    return fvalue;
                  } else {
                    return { relation: value, user: fvalue.user };
                  }
                });
                disabled = false;
              })
              .catch((reason) => {
                disabled = false;
              });
          }}
        >
          Accept
        </button>
        <button
          {disabled}
          class="btn variant-filled-error py-1 my-2"
          on:click={() => {
            disabled = true;
            deny(community_user.user.id)
              .then((value) => {
                community_users = community_users.filter((fvalue) => {
                  value.user_id != fvalue.user.id;
                });
                disabled = false;
              })
              .catch((reason) => {
                disabled = false;
              });
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
        {disabled}
        class="btn variant-filled-primary py-1"
        on:click={() => {
          disabled = true;
          search(search_name)
            .then((value) => {
              disabled = false;
              found_users = value;
            })
            .catch((reason) => {
              disabled = false;
              found_users = [];
            });
        }}
      >
        Hledej
      </button>
    </div>
    <div>
      {#each found_users as user (user.id)}
        <a href={'/user/' + user.id}>{user.user_name}</a>
        <button
          {disabled}
          class="btn variant-filled-primary py-1 my-2"
          on:click={() => {
            disabled = true;
            invite(user.id)
              .then((value) => {
                community_users = [
                  ...community_users,
                  { relation: value, user: user },
                ];
                disabled = false;
              })
              .catch((reason) => {
                disabled = false;
              });
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
    {disabled}
    on:click={() => {
      disabled = true;
      confirm()
        .then((value) => {
          community_users = community_users.flatMap((fvalue) => {
            if (value.user_id != fvalue.user.id) {
              return fvalue;
            } else {
              return { relation: value, user: fvalue.user };
            }
          });
          role = 'MEMBER';
          disabled = false;
        })
        .catch((reason) => {
          disabled = false;
        });
    }}
  >
    Confirm
  </button>
  <button
    class="btn variant-filled-error py-1 my-2"
    {disabled}
    on:click={() => {
      disabled = true;
      reject()
        .then((value) => {
          community_users = community_users.filter((fvalue) => {
            value.user_id != fvalue.user.id;
          });
          role = null;
          disabled == false;
        })
        .catch((reason) => {
          disabled = false;
        });
    }}
  >
    Reject
  </button>
{/if}
<div class="mt-6 border-solid border-2 pl-4 w-modal">
  <div
    class="inline-grid items-baseline grid-cols-2"
    title="This chat is not encrypted. Do not share any sensitive information: use
    end-to-end encrypted services like Signal for that."
  >
    <h3 class="mt-4 mb-2 text-xl">Community chat</h3>
    <p class="ml-2">
      <Fa class="inline text-xl" icon={faLockOpen} />
    </p>
  </div>
  <Chat messages={community_messages} {user} {community} isadmin={false} />
</div>

<div class="mt-6 w-full">
  {#each community_items as offer (offer.item.id)}
    <Item item={offer.item} owner={offer.owner} holder={null}></Item>
  {/each}
</div>

<style>
</style>

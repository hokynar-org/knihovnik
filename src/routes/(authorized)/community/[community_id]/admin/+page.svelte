<script lang="ts">
  import type { CommunityRelation, PublicUserSafe } from '$lib/types';

  export let data;
  $: community = data.community;
  $: community_users = data.community_users;

  let found_users: PublicUserSafe[] = [];
  let search_name = '';
  let disabled = false;
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
</script>

<div>
  <h4>Admin page</h4>
</div>

<div>
  <h3 class="mt-4 mb-2 text-xl">Users in this community</h3>
  {#each community_users as community_user}
    <a href={'/user/' + community_user.user.id}
      >{community_user.user.user_name}</a
    >
    ({community_user.relation.role})
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
    <br />
  {/each}
</div>
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

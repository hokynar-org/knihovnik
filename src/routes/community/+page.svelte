<script lang="ts">
  import type { Community, User } from '$lib/types';

  const user1: User = {
    id: -1,
    user_name: 'Mišal',
    email: 'michal@cz.michal',
    full_name: 'Michislav Slovaslov',
    pronouns: 'he/him',
    role: 'USER',
  };

  const user2: User = {
    id: -2,
    user_name: 'Ondřa',
    email: 'ondra@cz.ondra',
    full_name: 'Ondřej Ondřejovský',
    pronouns: 'he/him',
    role: 'ADMIN',
  };

  const testCommunity: Community = {
    id: 1,
    dateCreated: new Date(),
    communityName: 'Cummulative commumunity',
    communityDescription: 'We cumulation. Da.',
    users: [user1, user2],
  };
</script>

<h1>Community: {testCommunity.communityName}</h1>
<p>{testCommunity.communityDescription}</p>
<p>Created: {testCommunity.dateCreated.toLocaleDateString()}</p>

<h2>Community Members:</h2>
{#if testCommunity.users.length > 0}
  <ul>
    {#each testCommunity.users as user (user.id)}
      <li>{user.user_name} {user.email}</li>
    {/each}
  </ul>
{:else}
  <p>No users found.</p>
{/if}

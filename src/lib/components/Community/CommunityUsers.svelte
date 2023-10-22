<script lang="ts">
  import type { CommunityUserSafe } from '$lib/types';
  export let community_users: CommunityUserSafe[];
  export let cls = '' as string;
</script>

<div class={cls}>
  <h3 class="mb-2 text-2xl">Users in this community</h3>
  <table class="table-fixed table max-w-lg">
    <thead>
      <tr>
        <th> User Name </th>
        <th> Role </th>
      </tr>
    </thead>
    <tbody>
      {#each community_users as community_user}
        <tr>
          <td>
            <a href={'/user/' + community_user.user.id}
              >{community_user.user.user_name}</a
            >
          </td>
          <td>
            {community_user.relation.role}
          </td>
        </tr>
      {/each}
    </tbody><tbody />
    <table />
  </table>
</div>

<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import { page } from '$app/stores';
  import type { PageData } from './$types';

  export let data: PageData;
  $: profiled_user = data.profiled_user;
</script>

<h4>
  {profiled_user.user_name}
</h4>
{#if profiled_user.full_name && profiled_user.pronouns && profiled_user.bio}
  <h4>
    {profiled_user.full_name}, {profiled_user.pronouns}
  </h4>
  <div>
    {profiled_user.bio ? profiled_user.bio : ''}
  </div>
{/if}

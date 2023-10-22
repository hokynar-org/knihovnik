<script lang="ts">
  import { page } from '$app/stores';
</script>

<div>
  <div class="">
    <ol class="breadcrumb">
      <li class="text-lg">
        {#if $page.route.id == '/(authorized)/community'}
          Your communities
        {:else}
          <a class="text-base" href={'/community'}>Your communities</a>
        {/if}
      </li>

      <li class="crumb-separator" aria-hidden>/</li>

      <li class="text-lg">
        {#if $page.route.id == '/(authorized)/community/search'}
          Find a community
        {:else}
          <a class="text-base" href={'/community/search'}>Find a community</a>
        {/if}
      </li>

      <li class="crumb-separator" aria-hidden>/</li>

      <li class="text-lg">
        {#if $page.route.id == '/(authorized)/community/new'}
          New Community
        {:else}
          <a class="text-base" href={'/community/new'}>New Community</a>
        {/if}
      </li>
    </ol>
  </div>
</div>
<slot />

<script lang="ts">
  import { page } from '$app/stores';
</script>

<div>
  <div class="">
    <ol class="breadcrumb">
      <li class="text-lg">
        {#if $page.route.id == '/(authorized)/communities'}
          Your communities
        {:else}
          <a class="text-base" href={'/communities'}>Your communities</a>
        {/if}
      </li>

      <li class="crumb-separator" aria-hidden>/</li>

      <li class="text-lg">
        {#if $page.route.id == '/(authorized)/communities/search'}
          Find a community
        {:else}
          <a class="text-base" href={'/communities/search'}>Find a community</a>
        {/if}
      </li>

      <li class="crumb-separator" aria-hidden>/</li>

      <li class="text-lg">
        {#if $page.route.id == '/(authorized)/communities/new'}
          New Community
        {:else}
          <a class="text-base" href={'/communities/new'}>New Community</a>
        {/if}
      </li>
    </ol>
  </div>
</div>
<slot />

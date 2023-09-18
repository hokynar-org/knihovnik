<script>
  import { page } from '$app/stores';
  let isNew = false;
  $: isNew = String($page.url).includes('new');
</script>

<div>
  <ol class="breadcrumb">
    <li class:text-4xl={!isNew} class:text-2xl={isNew}>
      {#if !isNew}
        Items you offered
      {:else}
        <a href={'/offer'}>Items you offered</a>
      {/if}
    </li>
    <li class="crumb-separator text-3xl" aria-hidden>/</li>

    <li class:text-4xl={isNew} class:text-2xl={!isNew}>
      {#if isNew}
        Offer an item
      {:else}
        <a href={'/offer/new'}>Offer an item</a>
      {/if}
    </li>
  </ol>
</div>
<slot />

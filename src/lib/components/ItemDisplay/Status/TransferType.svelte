<script lang="ts">
  import Fa from 'svelte-fa';
  import {
    faHandHoldingHand,
    faHandHolding,
    faHandsHolding,
    type IconDefinition,
  } from '@fortawesome/free-solid-svg-icons';
  import type { PublicItemSafe, PublicUserSafe } from '$lib/types';
  export let item: PublicItemSafe | null;
  import { page } from '$app/stores';
  $: user = $page.data.user as PublicUserSafe;

  let faIcon: IconDefinition;
  if (item?.transfeType === 'BORROW') {
    faIcon = faHandHolding;
  } else if (item?.transfeType === 'TRANSITIVE') {
    faIcon = faHandHoldingHand;
  } else if (item?.transfeType === 'GIVE') {
    faIcon = faHandsHolding;
  }
</script>

{#if item}
  <div class="flex items-baseline">
    <p><Fa icon={faIcon} /></p>
    <p class="pl-2">Transfer Type: {item.transfeType}</p>
  </div>
{/if}

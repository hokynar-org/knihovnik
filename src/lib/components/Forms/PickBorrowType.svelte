<script lang="ts">
  import OptionPicker from './OptionPicker.svelte';
  import type { BorrowMode } from '$lib/types';
  import {
    faHandHoldingHand,
    faHandHolding,
    faHandsHolding,
  } from '@fortawesome/free-solid-svg-icons';

  export let selectedType: BorrowMode;
</script>

<div class="flex items-center space-x-4 h-[8rem] mt-0">
  <OptionPicker
    options={[
      { name: 'Borrow', value: 'BORROW', icon: faHandHolding },
      {
        name: 'Transitive',
        value: 'TRANSITIVE',
        icon: faHandHoldingHand,
      },
      { name: 'Give', value: 'GIVE', icon: faHandsHolding },
    ]}
    bind:selected={selectedType}
  />
  <div class="grow">
    {#if selectedType == 'BORROW'}
      <p>
        Borrow: a person A can borrow the item, but they can only return it to
        you.
      </p>
    {:else if selectedType == 'TRANSITIVE'}
      <p>
        Transitive: a person A can borrow the item. They can then “transfer the
        borrowing” to a person B. If they do so, B will be the borrower. Only B
        will be able to return the item to you.
      </p>
    {:else if selectedType == 'GIVE'}
      <p>
        Give: you can give the item to person A. Person A will then own the item
        and will be able to borrow or give it further. You will lose the rights
        for the item.
      </p>
    {/if}
  </div>
</div>

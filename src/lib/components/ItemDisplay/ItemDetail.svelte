<script lang="ts">
  import Fa from 'svelte-fa';
  import { faCube, faUser } from '@fortawesome/free-solid-svg-icons';
  import type { PublicItemSafe, PublicUserSafe } from '$lib/types';
  import { iconList } from '../IconSelector/iconList';
  import BorrowItem from './BorrowItem.svelte';
  import OwnedBy from './Status/OwnedBy.svelte';
  import HeldBy from './Status/HeldBy.svelte';
  import type { last_request } from '$lib/types';
  export let last_requst: last_request | null;
  import { page } from '$app/stores';
  $: user = $page.data.user as PublicUserSafe;

  export let item: PublicItemSafe;
  export let owner: PublicUserSafe | null;
  export let holder: PublicUserSafe | null;

  let imageAltText = 'TODO';

  let clamped = true;
  function toggleClamp() {
    clamped = !clamped;
  }
</script>

<div class="mx-6">
  <div class="flex gap-4 justify-center">
    <div
      data-tooltip={imageAltText}
      data-placement="top"
      class="mr-2 w-[25%] overflow-hidden flex justify-center items-center"
    >
      {#if item.hasMainPic}
        <img
          class="object-cover w-[100%] h-[100%] max-h-60"
          src={item.image_src}
          alt={imageAltText}
        />
      {:else if item.iconName}
        <div>
          <Fa
            size="4x"
            icon={iconList.findLast((value) => {
              return value.iconName == item.iconName;
            })}
          />
        </div>
      {:else}
        <div>
          <Fa size="4x" icon={iconList[10]} />
        </div>
      {/if}
    </div>

    <div class="max-h grid grid-flow-row items-center">
      <div>
        <h2 class="mb-2 text-3xl max-w-xs">
          <a href="/item/{item.id}">{item.name}</a>
        </h2>

        <OwnedBy {owner} />
        <HeldBy {holder} />
        Transfer Type: {item.transfeType}
      </div>
      {#if holder}
        {#if user.id != holder.id}
          <div class="mt-2">
            <BorrowItem borrow_request={last_requst} {item} />
          </div>
        {/if}
      {:else if owner && user.id != owner.id}
        <div class="mt-2">
          <BorrowItem borrow_request={last_requst} {item} />
        </div>
      {/if}
    </div>
  </div>

  <div class="mt-6 flex justify-center">
    <div
      class="overflow-hidden max-w-xl"
      class:line-clamp={clamped}
      on:click={toggleClamp}
      on:keypress={toggleClamp}
      role="button"
      tabindex="0"
    >
      {@html item.description.replace(/\n/g, '<br>')}
    </div>
  </div>
</div>

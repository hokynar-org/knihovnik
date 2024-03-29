<script lang="ts">
  import Fa from 'svelte-fa';
  import { iconList } from '../IconSelector/iconList';
  import BorrowItem from './Actions/BorrowItem.svelte';
  import OfferItem from '$lib/components/ItemDisplay/Actions/OfferItem.svelte';
  import OwnedBy from './Status/OwnedBy.svelte';
  import HeldBy from './Status/HeldBy.svelte';
  import TransferType from './Status/TransferType.svelte';
  import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import { page } from '$app/stores';
  import type { last_request } from '$lib/types';
  import type { PublicItemSafe, PublicUserSafe } from '$lib/types';

  export let last_requst: last_request | null;
  export let item: PublicItemSafe;
  export let owner: PublicUserSafe | null;
  export let holder: PublicUserSafe | null;

  $: user = $page.data.user as PublicUserSafe;

  let imageAltText = 'TODO';

  let clamped = false;
  function toggleClamp() {
    clamped = !clamped;
  }

  let displayImage: boolean = item.hasMainPic && item.image_src !== null;
  const imageView: ModalSettings = {
    type: 'alert',
    title: '',
    body: '',
    image: item.image_src!,
  };

  function triggerModal(): void {
    if (displayImage) {
      modalStore.trigger(imageView);
    }
  }
</script>

<div class="mx-6 grid justify-center">
  <div class="flex flex-col w-80 md:w-96 lg:w-[42rem]">
    <div class="gap-4 justify-center grid grid-flow-row grid-rows-1 lg:flex">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div
        data-placement="top"
        data-tooltip={displayImage ? imageAltText : null}
        on:click={displayImage ? triggerModal : null}
        on:keydown={displayImage ? triggerModal : null}
        tabindex={displayImage ? 0 : null}
        role={displayImage ? 'button' : null}
        class="mr-2 min-h-[10rem] lg:w-80 overflow-hidden flex justify-center items-center shadow-xl"
      >
        {#if displayImage}
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
          <TransferType {item} />
        </div>
        {#if holder}
          {#if user.id != holder.id}
            <div class="mt-2">
              <BorrowItem borrow_request={last_requst} {item} isReturn={true} />
            </div>
          {/if}
        {:else if owner && user.id != owner.id}
          <div class="mt-2">
            <BorrowItem borrow_request={last_requst} {item} />
          </div>
        {/if}

        {#if (owner && user.id == owner.id && holder && holder.id == owner.id) || (item.transfeType == 'TRANSITIVE' && holder && user.id == holder.id)}
          <div
            class="w-full mt-2 grid justify-items-center lg:justify-items-start"
          >
            <OfferItem {item} />
          </div>
        {/if}
      </div>
    </div>

    <div class="mt-6 flex justify-center flex-1">
      <div
        class="overflow-hidden max-w-xs md:max-w-sm lg:max-w-none lg:w-max"
        class:line-clamp={clamped}
      >
        {@html item.description.replace(/\n/g, '<br>')}
      </div>
    </div>
  </div>
</div>

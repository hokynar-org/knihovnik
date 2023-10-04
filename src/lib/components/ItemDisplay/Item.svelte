<script lang="ts">
  import Fa from 'svelte-fa';
  import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
  import type { Item, PublicItemSafe, PublicUserSafe } from '../../types';
  import { onMount } from 'svelte';
  import Spinner from '../Spinner.svelte';
  export let item: PublicItemSafe;
  export let owner: PublicUserSafe | null;
  export let holder: PublicUserSafe | null;
  import { page } from '$app/stores';
  import { iconList } from '../IconSelector/iconList';
  $: user = $page.data.user as PublicUserSafe;
  const imageAltText = 'todo: change this';

  let clamped = true;
  function toggleClamp() {
    clamped = !clamped;
  }
  // async function getImageUrl(image_src: string) {
  //   const response = await fetch('/api/image/' + image_src, {
  //     method: 'GET',
  //   });
  //   if (!response.ok) {
  //     throw new Error(String(response.status));
  //   }
  //   const body = await response.json();
  //   const image_url = body.image_url;
  //   return image_url as string;
  // }
  // let image_url = Promise.resolve('/mia.jpeg');
  // onMount(async () => {
  //   if (item.image_src) {
  //     image_url = getImageUrl(item.image_src);
  //   }
  // });
</script>

<article
  class="relative flex rounded-xl overflow-hidden bg-surface-100-800-token m-4 pr-4"
>
  <div
    data-tooltip={imageAltText}
    data-placement="top"
    class="mr-2 w-[25%] overflow-hidden flex justify-center items-center"
  >
    {#if item.image_src !== null}
      <img
        class="object-cover w-[100%] h-[100%] max-h-60"
        src={item.image_src}
        alt={imageAltText}
      />
    {:else}
      <div>
        <Fa size="4x" icon={iconList[10]} />
      </div>
    {/if}
  </div>
  <div class="flex w-full flex-nowrap justify-between py-2">
    <div class="m-4 w-[50%]">
      <h4 class="mb-2">
        <a href="/item/{item.id}">{item.name}</a>
      </h4>
      <div
        class="overflow-hidden"
        class:line-clamp={clamped}
        on:click={toggleClamp}
        on:keypress={toggleClamp}
        role="button"
        tabindex="0"
      >
        {item.description}
      </div>
    </div>
    <div class="pt-4 pb-4 w-[25%]">
      <div class="">
        {#if owner}
          {#if owner.id == user.id}
            You own this item
          {:else}
            This item is owned by <a href={'/user/' + owner.id}
              >{owner.user_name}</a
            >
          {/if}
        {/if}
      </div>
      <div class="">
        {#if holder}
          {#if holder.id == user.id}
            You hold this item
          {:else}
            This item is held by <a href={'/user/' + holder.id}
              >{holder.user_name}</a
            >
          {/if}
        {/if}
      </div>
      {#if item.offered && owner && owner.id != user.id}
        You can borrow this item
      {:else if owner && owner.id != user.id}
        At the moment, you cannot borrow this item
      {/if}
    </div>

    <div class="m-2">
      <slot />
    </div>
  </div>
</article>

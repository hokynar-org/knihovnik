<script lang="ts">
  import { onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import type { PublicItemSafe, PublicUserSafe } from '$lib/types';
  export let item: PublicItemSafe;
  // export let owner: PublicUserSafe | null;
  // export let holder: PublicUserSafe | null;

  import { iconList } from '../IconSelector/iconList';
  const imageAltText = 'todo: change this';

  let clamped = true;
  function toggleClamp() {
    clamped = !clamped;
  }

  var fontSize = 16;
  onMount(() => {
    // get dom element by id
    const element = document.getElementById('textbox');

    if (element) {
      const computedStyle = window.getComputedStyle(element);
      //lineHeight = parseFloat(computedStyle.getPropertyValue('line-height')); //Alternative, not used
      fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    }
  });
</script>

<div>
  <div
    id="oneCard"
    class="card w-80 h-min rounded shadow-lg variant-filled-surface-700 overflow-visible hover:shadow-xl"
  >
    <a href="/item/{item.id}" class="!no-underline font-normal">
      <div class="flex h-40 justify-center items-center py-auto shadow-md">
        {#if item.hasMainPic && item.image_src !== null}
          <div class="h-full w-full">
            <img
              class="object-cover w-full h-full max-h-60 rounded"
              src={item.image_src}
              alt={imageAltText}
            />
          </div>
        {:else if !item.hasMainPic && item.iconName !== null}
          <div class="w-full py-auto">
            <div class="flex justify-center w-full">
              <Fa
                size="4x"
                icon={iconList.findLast((value) => {
                  return value.iconName == item.iconName;
                })}
              />
            </div>
          </div>
        {:else}
          <div class="w-full py-auto">
            <div class="flex justify-center w-full">
              <Fa size="4x" icon={iconList[10]} />
            </div>
          </div>
        {/if}
      </div>

      <div class="pt-1 px-4 1 h-auto overflow-visible">
        <div>
          <h4 class="py-1 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
            {item.name}
          </h4>
        </div>
        <div
          id="textbox"
          style="--fsize:{fontSize}"
          class="mt-2 min-h-12e text-min-height"
          class:line-clamp={clamped}
          class:overflow-hidden={clamped}
        >
          {item.description}
        </div>
      </div>
    </a>

    <div class="mt-2 px-4 pt-2">
      <slot />
    </div>

    {#if $$slots}
      <div class="mt-2"></div>
    {/if}
  </div>
</div>

<style>
  .text-min-height {
    min-height: calc(1.5 * var(--fsize) * 1px * 4); /* 4 lines of text */
  }
</style>

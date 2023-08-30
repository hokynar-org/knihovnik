<script lang="ts">
  import Fa from 'svelte-fa';
  import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
  import type { Item, PublicItemSafe } from './types';
  export let image: string = '/mia.jpeg';
  export let imageAltText: string = 'cute black cat';
  export let item: PublicItemSafe;
</script>

<article
  class="relative flex rounded-xl overflow-hidden bg-surface-300-600-token m-4"
>
  <div data-tooltip={imageAltText} data-placement="top">
    <img class="max-h-60" src={image} alt={imageAltText} />
  </div>
  <div class="flex w-full flex-nowrap justify-between">
    <div class="m-2">
      <h4 class="mb-2">
        <a href="/item/{item.id}">{item.name}</a>
      </h4>
      <div class="descr">{item.description}</div>
    </div>
    <div class="m-2">
      <slot />
    </div>
  </div>
</article>

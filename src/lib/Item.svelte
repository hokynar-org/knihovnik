<script lang="ts">
  import Fa from 'svelte-fa';
  import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
  import type { Item, PublicItemSafe } from './types';
  import { onMount } from 'svelte';
  import Spinner from './components/Spinner.svelte';
  export let imageAltText: string = 'cute black cat';
  export let item: PublicItemSafe;
  async function getImageUrl(image_src: string) {
    const response = await fetch('/api/image/' + image_src, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    const body = await response.json();
    const image_url = body.image_url;
    return image_url as string;
  }
  let image_url = Promise.resolve('/mia.jpeg');
  onMount(async () => {
    if (item.image_src) {
      image_url = getImageUrl(item.image_src);
    }
  });
</script>

<article
  class="relative flex rounded-xl overflow-hidden bg-surface-100-800-token m-4"
>
  <div data-tooltip={imageAltText} data-placement="top" class="max-h-60">
    {#await image_url then image_url}
      <img class="max-h-60" src={image_url} alt={imageAltText} />
    {/await}
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

<script lang="ts">
  import Fa from 'svelte-fa';
  import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
  import type { Item } from './types';
  export let image: string = '/mia.jpeg';
  export let imageAltText: string = 'cute black cat';
  import { user_items } from '$lib/store';
  // export let what: string = "Kočka";
  // export let description: string = "Kočka je černá a je to kočka.";
  export let where: string = 'Kolodějova 123';
  // export let fromWho: string = " persn";
  export let mapUrl: string = 'https://mapy.cz/s/3sQ5y';
  export let item: Item;
  async function deleteItem() {
    const response = await fetch('/api/item/' + item.id + '/remove', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
  }
  let deleting = false;
</script>

<article>
  <div data-tooltip={imageAltText} data-placement="top">
    <img src={image} alt={imageAltText} />
  </div>
  <div class="text">
    <div class="nameAndDesc">
      <h4>
        <a href="/item/{item.id}">{item.name}</a>
      </h4>
      <div class="descr">{item.description}</div>
    </div>
    <div class="contact">
      <div class="place" data-tooltip="hai">
        <a href={mapUrl}> <Fa icon={faLocationDot} /> {where} </a>
      </div>
      <div class="borrow">
        <button
          on:click={() => {
            deleting = true;
            deleteItem().then((value) => {
              const index = $user_items.indexOf(item);
              console.log($user_items);
              if (index > -1) {
                $user_items.splice(index, 1);
                $user_items = $user_items; // důležité pro Svelte
              }
              console.log($user_items);
            });
          }}
          disabled={deleting}
        >
          Delete</button
        >
      </div>
    </div>
  </div>
</article>

<style lang="scss">
  :root {
    --image-height: 150px;
    --image-width: 250px;
    --padding: 20px;
  }
  article {
    display: flex;
    margin: 20px;
    background-color: var(--secondaryColor);
    border-radius: 10px;
    padding: var(--padding);
    max-height: calc(var(--image-height) + 2 * var(--padding));
  }
  img {
    max-width: var(--image-width);
    max-height: var(--image-height);
    display: flex;
  }
  .text {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-left: 10px;
    overflow: hidden;
  }
  .nameAndDesc {
    flex: 4;
    a {
      text-decoration: none;
      color: var(--primaryColor);
      :hover {
        background-color: var(--secondaryColor);
      }
    }
  }

  .contact {
    display: flex;
    flex-direction: column;
    align-items: end;
    flex: 1;
  }

  .descr {
    display: -webkit-box;
    -webkit-line-clamp: 4; /* Adjust the number of lines you want */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @mixin placeAndLendor {
    font-size: medium;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* Adjust the number of lines you want */
    -webkit-box-orient: vertical;
  }
  .place {
    @include placeAndLendor;
  }
</style>

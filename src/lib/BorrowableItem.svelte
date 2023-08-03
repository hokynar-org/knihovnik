<script lang="ts">
  import Fa from 'svelte-fa';
  import { faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
  import type { BorrowRequest, Offer } from './types';
  export let image: string = '/mia.jpeg';
  export let imageAltText: string = 'cute black cat';
  // export let what: string = "Kočka";
  // export let description: string = "Kočka je černá a je to kočka.";
  export let where: string = 'Kolodějova 123';
  // export let fromWho: string = " persn";
  export let mapUrl: string = 'https://mapy.cz/s/3sQ5y';
  export let lendorUrl: string = 'https://www.youtube.com/watch?v=8czrx7GJa5c';
  export let offer: Offer;
  export let user_id: number;
  async function borrow() {
    const response = await fetch(
      '/api/borrow_request/' + '?item_id=' + offer.item.id,
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as BorrowRequest;
  }
  async function cancel() {
    if (!offer.borrow_request) {
      throw new Error('Nothing to cancel');
    }
    const response = await fetch(
      '/api/borrow_request/' + offer.borrow_request.id + '/cancel',
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as BorrowRequest;
  }
  let disabled = false;
</script>

<article>
  <div data-tooltip={imageAltText} data-placement="top">
    <img src={image} alt={imageAltText} />
  </div>
  <div class="text">
    <div class="nameAndDesc">
      <h4>
        <a href="/item/{offer.item.id}">{offer.item.name}</a>
      </h4>
      <div class="descr">{offer.item.description}</div>
    </div>
    <div class="contact">
      <div class="place" data-tooltip="hai">
        <a href={mapUrl}> <Fa icon={faLocationDot} /> {where} </a>
      </div>
      <div class="lendor">
        <a href={lendorUrl}> <Fa icon={faUser} />{offer.user.user_name}</a>
      </div>
      {#if user_id != offer.user.id && !offer.borrow_request}
        <div class="borrow">
          <button
            on:click={() => {
              disabled = true;
              borrow()
                .then((value) => {
                  offer.borrow_request = value;
                  disabled = false;
                })
                .catch((reson) => {
                  disabled = false;
                });
            }}
            {disabled}>Borrow</button
          >
        </div>
      {/if}
      {#if offer.borrow_request}
        <div class="cancel">
          <button
            on:click={() => {
              disabled = true;
              cancel()
                .then((value) => {
                  offer.borrow_request = null;
                  disabled = false;
                })
                .catch((reson) => {
                  disabled = false;
                });
            }}
            {disabled}>Cancel</button
          >
        </div>
        {offer.borrow_request.status}
      {/if}
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
    background-color: var(--color-secondary);
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
        background-color: var(--color-secondary);
      }
    }
  }

  .contact {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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
  .lendor {
    @include placeAndLendor;
  }
</style>

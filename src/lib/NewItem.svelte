<script lang="ts">
  import Fa from 'svelte-fa';
  import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
  import type { Item } from './types';
  export let image: string = '/mia.jpeg';
  export let imageAltText: string = 'cute black cat';
  export let where: string = 'Kolodějova 123';
  export let mapUrl: string = 'https://mapy.cz/s/3sQ5y';
</script>

<article>
  <div data-tooltip={imageAltText} data-placement="top">
    <img src={image} alt={imageAltText} />
  </div>
  <div class="text">
    <div class="nameAndDesc">
      <h4>
        <input type="name" />
      </h4>
      <div class="descr">
        <textarea rows="4" />
      </div>
    </div>
    <div class="contact">
      <div class="place" data-tooltip="hai">
        <a href={mapUrl}> <Fa icon={faLocationDot} /> {where} </a>
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
    background-color: rgb(var(--color-secondary));
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
    input {
      width: 100%;
      background-color: rgb(var(--color-background));
      border-width: 0;
    }
    textarea {
      width: 100%;
      background-color: rgb(var(--color-background));
      resize: none;
      border-width: 0;
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
</style>

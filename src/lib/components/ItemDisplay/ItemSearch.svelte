<script lang="ts">
  import type { Offer, UserOffer } from '$lib/types';
  export let cls = '';
  export let offersFiltered: (Offer | UserOffer)[];
  let offersAll = offersFiltered; //backup

  export let searchTerm = '';
  //$: console.log(searchTerm);
  //$: console.log(offersFiltered);

  function unionArr(arr1: (Offer | UserOffer)[], arr2: (Offer | UserOffer)[]) {
    function isNotInArr1(elt: Offer | UserOffer) {
      return !arr1.includes(elt);
    }
    const arrFiltered = arr2.filter(isNotInArr1);
    const unionArr = arr1.concat(arrFiltered);

    return unionArr;
  }

  //Search through name and description
  $: if (offersFiltered) {
    offersFiltered = unionArr(
      offersAll.filter((offer) =>
        offer.item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
      offersAll.filter((offer) =>
        offer.item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }
</script>

<div class="p-2 {cls} flex items-baseline">
  <p class="text-lg mr-2">Search:</p>
  <input class="input" type="text" bind:value={searchTerm} />
</div>

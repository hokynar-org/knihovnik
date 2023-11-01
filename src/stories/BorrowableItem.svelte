<script lang="ts">
  import Item from '$lib/components/ItemDisplay/Item.svelte';
  import type { PublicItemSafe } from '$lib/types';

  const item = {
    id: 0,
    name: 'Test Item',
    description: 'Test Item Description',
    owner_id: 0,
  } as PublicItemSafe;
</script>

<Item {item} owner={null} holder={null} />

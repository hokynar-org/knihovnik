<script lang="ts">
  import BorrowableItem from '$lib/BorrowableItem.svelte';
</script>

<BorrowableItem
  user_id={0}
  offer={{
    borrow_request: null,
    item: {
      id: 0,
      name: 'Test Item',
      description: 'Test Item Description',
      owner_id: 0,
    },
    user: {
      id: 0,
      user_name: 'tester420',
      full_name: 'User Testerson',
      pronouns: 'it/its',
    },
  }}
/>

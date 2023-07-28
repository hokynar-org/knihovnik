<script lang="ts">
    import BorrowableItem from '$lib/BorrowableItem.svelte';
</script>

<BorrowableItem
    user_id={0}
    offer={{
        item: {
            id: 0,
            name: 'Test Item',
            description: 'Test Item Description',
            user_id: 0,
        },
        user: {
            id: 0,
            user_name: 'tester420',
            full_name: 'User Testerson',
        },
    }}
/>

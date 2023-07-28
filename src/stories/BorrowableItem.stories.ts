import Item from './BorrowableItem.svelte';

export default {
    component: Item,
};

export const Primary = {
    render: () => ({
        Component: Item,
        props: {},
    }),
};

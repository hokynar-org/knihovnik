<script lang="ts">
    import BorrowItem from "../../lib/BorrowItem.svelte";
    import type { PageServerData } from "./$types";
    export let data:PageServerData;
</script>

<div class="grid">
{#each data.offers as offer (offer.item.id)}
    <div class="offer">
        <article>
            <header>
                <nav>
                    <ul>
                        <li>
                            {offer.item.name}
                        </li>
                        <li>
                            {offer.user.email}
                        </li>
                    </ul>
                </nav>
            </header>
            <body>
                {offer.item.description}
            </body>
        </article>
    </div>
{/each}
</div>
<!-- 
<div class="results">
    <BorrowItem />
</div> -->


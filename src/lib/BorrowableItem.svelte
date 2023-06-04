<script lang="ts">
    import Fa from "svelte-fa";
    import { faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";
    import type { PublicItemSafe, PublicUserSafe } from "./types";

    export let image: string = "/mia.jpeg";
    export let imageAltText: string = "cute black cat";
    // export let what: string = "Kočka";
    // export let description: string = "Kočka je černá a je to kočka.";
    export let where: string = "Kolodějova 123";
    // export let fromWho: string = " persn";
    export let mapUrl: string = "https://mapy.cz/s/3sQ5y";
    export let lendorUrl: string =
        "https://www.youtube.com/watch?v=8czrx7GJa5c";
    export let offer:{item:PublicItemSafe,user:PublicUserSafe};
    export let user_id: number;
</script>

<head>
    <link rel="stylesheet" href="src/lib/style.css">
</head>
<article>
    <div data-tooltip={imageAltText} data-placement="top">
        <img src={image} alt={imageAltText} />
    </div>
    <div class="text">
        <div class="item">
            <h4>
                {offer.item.name}
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
            {#if user_id != offer.user.id}
            <div class="borrow">
                <form method="POST" action="borrow?/new_borrow_ask&id={offer.item.id}">
                    <button>Borrow</button>
                </form>
            </div>
            {/if}
        </div>
    </div>
</article>

<style>
    article {
        display: flex;
        margin: 20px;
    }
    .text {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }
    img {
        max-width: 20vw;
        display: flex;
    }

    .text {
        margin-left: 10px;
    }

    .place {
        font-size: medium;
        width: fit-content;
    }
    .descr {
        font-size: medium;
        width: fit-content;
    }
    .lendor {
        font-size: medium;
        width: fit-content;
    }
    .item {
        width: 75%;
    }
    .borrow{
        margin:0;
        padding: 0rem;
    }
    .borrow button{
        margin:0;
        padding: 0rem;
    }
</style>

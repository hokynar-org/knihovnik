<script lang="ts">
    import Fa from "svelte-fa";
    import { faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";

    export let image : string = "/mia.jpeg";
    export let imageAltText : string = "cute black cat";
    export let what : string = "Kočka";
    export let description : string = "Kočka je černá a je to kočka.";
    export let where : string = "Kolodějova 123";
    export let fromWho : string = " persn" ;
    export let mapUrl : string = "https://mapy.cz/s/3sQ5y";
    export let lendorUrl : string = "https://www.youtube.com/watch?v=8czrx7GJa5c";
</script>

<article>
    <div data-tooltip={imageAltText} data-placement="top">
        <img src={image} alt={imageAltText} />
    </div>
    <div class="text">
        <div class="name">
            {what}
            </div>
            <div class="descr">{description}</div>
            <div class="place" data-tooltip="hai"> <a href={mapUrl}> <Fa icon={faLocationDot} /> {where} </a> </div>
            <div class="lendor"> <a href={lendorUrl}> <Fa icon={faUser} />{fromWho} </a> </div>
    </div>
</article>

<style>
    article {
        display: flex;
    }
    .text {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    img {
        max-width: 20vw;
        display: flex;
    }

    .text {
        margin-left: 10px;
    }

    .name {
        display: flex;
        font-size: large;
    }

    .place {
        font-size: small;
        width: fit-content;
    }
    .descr {
        font-size: small;
        width: fit-content;
    }
    .lendor {
        font-size: small;
        width: fit-content;
    }
</style>

<script lang="ts">
    export let image = "/mia.jpeg";
    export let imageAltText = "cute black cat";
    export let name = "name";
    export let place = "place";
    export let description = "description";
</script>

<div class="item">
    <img src={image} alt={imageAltText}>
    <div class="name"> {name} </div>
    <div class="place"> {place} </div>
    <div class="descr"> {description} </div>
</div>

<style>
    .item {
        display: flex;
        min-height: 150px;
        border: 2px solid black;
        border-radius: 10px;
    }

    img {
        max-width: 20vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .name {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .place {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .descr {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';
    import type { PageServerData } from './$types';
    export let data: PageServerData;
    const item_form = superForm(data.item_form).form;
</script>
<div>
    {data.user_items.length}
</div>
I want to give shit away!!! (HELL YEAH!!)
<div class=container>

    <form method="POST" action="?/new_item">
      <label for="name">Name</label>
      <input type="name" name="name" bind:value={$item_form.name} />
    
      <label for="description">Description</label>
      <textarea id="description" name="description" rows="4" bind:value={$item_form.description} style="resize: none;"/>
      <div><button>Submit</button></div>
    </form>
</div>
{#each data.user_items as item (item.id)}
    <div class=container>
        <article>
            <header>
                {item.name}
            </header>
            <body>
                {item.description}
            </body>
        </article>
        <form method="POST" action="?/remove_item&id={item.id}">
            <div>
                <button>Remove</button>
            </div>
        </form>
    </div>
{/each}
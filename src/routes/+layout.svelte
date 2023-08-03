<script lang="ts">
  import '../app.css';

  import { navigating } from '$app/stores';
  import { browser } from '$app/environment';

  export let data;

  $: darkMode = data.darkMode;
  $: user = data.user;

  // TODO: remove this later
  if (browser) {
    (window as any).toggleDarkMode = () => {
      darkMode.update((v) => !v);
    };
  }
</script>

<svelte:head>
  <title>Knihovník</title>
</svelte:head>

<div id="root" class="text-foreground bg-background" class:dark={$darkMode}>
  <nav>
    <a href="/"><h2>Knihovnik</h2></a>
    {#if user}
      {@const isAdmin = user.role == 'ADMIN'}
      <div class="userInfo">
        {user.user_name}
      </div>
      <!-- {#if isAdmin}
        <a href="/admin" data-sveltekit-preload-data="hover">
          <h3>Admin</h3>
        </a>
      {/if} -->
      <a href="/borrow" data-sveltekit-preload-data="hover">
        <h3>Borrow</h3>
      </a>
      <a href="/offer" data-sveltekit-preload-data="hover">
        <h3>Offer</h3>
      </a>
      <!-- <a href="/community" data-sveltekit-preload-data="hover">
        <h3>Community</h3>
      </a> -->
      <a href="/user" data-sveltekit-preload-data="hover">
        <h3>User</h3>
      </a>
      <a href="/logout" data-sveltekit-preload-data="hover">
        <h3>Logout</h3>
      </a>
    {:else}
      <a href="/register" data-sveltekit-preload-data="hover">
        <h3>Register</h3>
      </a>
      <a href="/login" data-sveltekit-preload-data="hover">
        <h3>Login</h3>
      </a>
    {/if}
    {#if $navigating?.to}
      navigating to {$navigating?.to.route.id}
    {/if}
  </nav>
  <main>
    <slot />
  </main>
</div>

<style lang="scss">
  #root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas: 'nav' 'main';
    min-height: 100vh;

    @media screen and (min-width: 768px) {
      grid-template-columns: 1fr 4fr;
      grid-template-areas: 'nav main';
    }
  }

  nav {
    grid-area: nav;
    display: flex;
    flex-direction: column;
    padding: 20px;

    a {
      text-decoration: none;
      :hover {
        background-color: rgb(var(--color-secondary));
      }
    }
    @mixin marginsForNavs {
      margin: 2px;
      padding: 10px;
      border-radius: 10px;
    }
    h2 {
      @include marginsForNavs;
      font-size: 2em;
    }
    .userInfo {
      display: flex;
      @include marginsForNavs;
      background-color: rgb(var(--color-secondary));
      text-overflow: ellipsis;
      overflow: hidden;
    }
    h3 {
      @include marginsForNavs;
    }
  }

  main {
    padding: 20px;
    grid-area: main;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
</style>

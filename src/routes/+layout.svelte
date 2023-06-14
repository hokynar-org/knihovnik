<script lang="ts">
  import "./style.scss";

  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { ColorTheme, colorTheme } from "$lib/colorTheme";

  const user = $page.data.user;

  // $: if (browser) {
  //   document.body.className = $colorTheme;
  // }

  if (!browser) {
    $colorTheme = $page.data.theme;
  }
</script>

<div id="theme-indicator"
  class:light={$colorTheme === ColorTheme.Light}
  class:dark={$colorTheme === ColorTheme.Dark}
/>

<div class="scaffold">
  <nav>
    <a href="/"><h2>Knihovnik</h2></a>
    {#if user}
      <div class="userInfo">
        {user.user_name}
      </div>
      {#if user.role == "ADMIN"}
        <a href="/admin">
          <h3>Admin</h3>
        </a>
      {/if}
    {/if}
    {#if !user}
      <a href="/register">
        <h3>Register</h3>
      </a>
      <a href="/login">
        <h3>Login</h3>
      </a>
    {/if}
    {#if user}
      <a href="/borrow">
        <h3>Borrow</h3>
      </a>
      <a href="/offer">
        <h3>Offer</h3>
      </a>
      <a href="/community">
        <h3>Community</h3>
      </a>
    {/if}
    {#if user}
      <a href="/user">
        <h3>User</h3>
      </a>
      <a href="/logout">
        <h3>Logout</h3>
      </a>
      {#if user.role == "ADMIN"}
        <a href="/admin">
          <h3>Admin</h3>
        </a>
      {/if}
    {/if}
  </nav>
  <main>
    <slot />
  </main>
</div>

<style lang="scss">
  .scaffold {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr;
    grid-template-areas: "nav main";
  }
  nav {
    grid-area: nav;
    display: flex;
    flex-direction: column;
    background-color: var(--primaryColor);
    padding: 20px;
    a {
      text-decoration: none;
      color: var(--primaryColor);
      :hover {
        background-color: var(--secondaryColor);
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
      background-color: var(--secondaryColor);
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
  }
</style>

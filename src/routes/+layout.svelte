<script lang="ts">
  import "@picocss/pico/css/pico.css";
  import {page} from '$app/stores';
  const user = $page.data.user
</script>
<nav>
<ul>
  <li><a href="/"><h2>Knihovnik</h2></a></li>
</ul>
{#if user}
<ul>
  <li>{user.user_name}, {user.role}, {user.email}</li>
</ul>
{/if}
</nav>
<nav>
  <ul>
    {#if !user}
    <li>
      <a href="/register">
        <h3>Register</h3>
      </a>
    </li>
    <li>
      <a href="/login">
        <h3>Login</h3>
      </a>
    </li>
    {/if}
    {#if user}
    <li>
      <a href="/borrow">
      <h3>Borrow</h3>
      </a>
    </li>
    <li>
      <a href="/offer">
      <h3>Offer</h3>
      </a>
    </li>
    <li>
      <a href="/community">
      <h3>Community</h3>
      </a>
    </li>
    {/if}
  </ul>
  {#if user}
  <ul>
    <li>
      <a href="/user">
      <h3>User</h3>
      </a>
    </li>
    <li>
      <a href="/logout">
      <h3>Logout</h3>
      </a>
    </li>
    {#if user.role=="ADMIN"}
    <li>
      <a href="/admin">
      <h3>Admin</h3>
      </a>
    </li> 
    {/if}
  </ul>
  
  {/if}
</nav>
<slot />

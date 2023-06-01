<script lang="ts">
  import "@picocss/pico/css/pico.css";
</script>
<a href="/"><h2>Knihovnik</h2></a>
<nav>
  <ul>
    <li>
      <a href="/register">
        <h3>Register</h3>
      </a>
    </li>
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
  </ul>
  <ul>
    <li>
      <a href="/admin">
      <h3>Admin</h3>
      </a>
    </li>
  </ul>
</nav>
<slot />

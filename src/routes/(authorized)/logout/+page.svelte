<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="center-content">
  <h3>Logout user {$page.data.user.user_name}</h3>
  <form action="?/logout" method="POST">
    <button>Logout</button>
  </form>
</div>

<script lang="ts">
    import {page} from '$app/stores'
</script>
<div class="container">
<h3>Logout user {$page.data.user.user_name}</h3>
<form method="POST">
    <button>
        Logout
    </button>
</form>
</div>
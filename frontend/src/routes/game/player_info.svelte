<script>
	import profile_fallback from '$lib/images/default_avatar.webp';
	import { userData } from '$lib/stores/userDataStore';
	import { loggedIn } from '$lib/stores/loggedStore';
</script>

<div class="player_info row-left">
	{#if $loggedIn}
		<div class="profile-img" style="background-image: url({$userData.imageUrl});" />
		<div class="column-center-left">
			<span class="player_name">{$userData.pseudo}</span>
			<div class="player-status">Status: connected ◉</div>
		</div>
	{/if}
</div>

<style>
	.player_info {
		width: 100%;
		gap: 0.5rem;
	}

	.profile-img {
		height: 45px;
		width: 45px;
		border-radius: 1rem;

		background-size: cover;
		background-position: center;
	}

	.player_name {
		font-size: 16px;
		font-weight: 700;

		color: rgba(var(--white), 1);
	}

	.player-status {
		font-size: 12px;
		color: rgba(var(--success), 1);
	}
</style>

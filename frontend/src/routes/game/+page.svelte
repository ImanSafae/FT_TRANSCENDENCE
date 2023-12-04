<script>
	import { goto } from '$app/navigation';
	import PlayerInfo from './player_info.svelte';
	import { loggedIn } from '$lib/stores/loggedStore';
	import './styles.css';
	import PleaseLogin from '$lib/error/PleaseLogin.svelte';

	import { onMount } from 'svelte';
	import { twoFaLocked } from '$lib/stores/twoFaLockedState';

	onMount(() => {
		if ($twoFaLocked) {
			goto('/2fa');
			return;
		}
	});
</script>

{#if !$loggedIn}
    <PleaseLogin />
{:else}
<div class="column-center" style="height: 80vh">
	<section class="menu column-center-top">
		<div class="row-center title_area">
			<span class="title">Welcome to</span>
			<span class="title title_end">Pong !</span>
		</div>
		<PlayerInfo />
		<div class="btn-area column-center">
			<button
				style="background-color: {$loggedIn ? `rgb(var(--dominant), 1)` : `rgb(120, 120, 120, 1)`}; 
					cursor: {$loggedIn ? `pointer` : `not-allowed`}"
				class="btn_start_game"
				on:click={() => {
					if ($loggedIn) goto('/pong');
				}}>Play</button
			>
		</div>
	</section>
</div>
{/if}

<style>
	.menu {
		width: 210px;
		border: 0.2rem dashed rgba(var(--white), 0.6);
		border-radius: 1rem;

		padding: 2rem;
		gap: 1rem;
	}

	.title_area {
		gap: 0.5rem;
	}

	.title {
		font-size: 25px;
		font-weight: 600;
		color: rgb(var(--dominant));
		margin: 0;
	}

	.title_end {
		color: rgba(var(--white), 1);
		font-weight: 900;
	}

	.btn-area {
		margin-top: 2rem;
		width: 100%;
		gap: 1rem;
	}

	button {
		font-family: 'Montserrat';
		color: rgba(var(--white), 1);
		font-weight: 700;
		font-size: 20px;

		background-color: rgb(var(--dominant));

		border: 0.4rem solid rgba(var(--white), 1);
		border-radius: 1rem;
		padding: 0.5rem 1.7rem;

		cursor: pointer;
		width: 80%;
	}
</style>

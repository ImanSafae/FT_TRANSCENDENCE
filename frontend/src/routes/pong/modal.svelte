<script lang="ts">
	import { goto } from '$app/navigation';
	import type { MySocket } from './socket';
	import type { PlayerScore } from './types/PlayerScore';

	export let playerScore: PlayerScore;
	export let restartGame: () => void;
</script>

<div class="modal column-center">
	<div class="modal-window column-center">
		<h1 class="modal-score">{playerScore.p1} - {playerScore.p2}</h1>
		<span class="modal-subtitle">Maybe try another game ?</span>
		<div class="btn-row row-center">
			<button
				class="btn_quit"
				on:click={() => {
					goto('/game');
				}}>Quit</button
			>
			<button
				class="btn_restart"
				on:click={() => {
					restartGame();
				}}>Restart</button
			>
		</div>
	</div>
</div>

<style>
	.modal {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(12, 12, 12, 0.6);
	}

	.modal-window {
		background-color: rgba(var(--background), 1);
		width: 25vw;
		height: 35vh;

		border-radius: 1.5rem;
		border: 0.4rem solid rgba(var(--white), 1);

		gap: 1.5rem;
	}

	.btn-row {
		margin-top: 1rem;
		gap: 1.5rem;
	}

	.modal-score {
		font-size: 75px;
		color: rgba(var(--dominant), 1);
	}

	.modal-subtitle {
		font-size: 18px;
		color: rgba(var(--white), 1);
	}

	.btn_quit {
		font-weight: 500;
	}

	.btn_restart {
		border: 0.3rem solid rgba(var(--dominant), 1);
		color: rgba(var(--dominant), 1);
	}

	button {
		font-family: 'Montserrat';
		color: rgba(var(--white), 1);
		font-weight: 700;
		font-size: 20px;

		background-color: rgb(var(--background));

		border: 0.3rem solid rgba(var(--white), 1);
		border-radius: 1rem;
		padding: 0.5rem 1.7rem;

		cursor: pointer;
		width: 80%;
	}
</style>

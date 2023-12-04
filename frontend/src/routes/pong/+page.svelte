<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { twoFaLocked } from '$lib/stores/twoFaLockedState';
	import Playground from './playground.svelte';
	import { userData } from '$lib/stores/userDataStore';
	import type { PlayerScore } from './types/PlayerScore';
	import { MySocket } from './socket';
	import '../game/styles.css';
	import Modal from './modal.svelte';
	import { loggedIn } from '$lib/stores/loggedStore';
	import profile_fallback from '$lib/images/default_avatar.webp';

	let playerScore: PlayerScore = {
		p1: 0,
		p2: 0
	};

	let socket: MySocket | null;

	let opponent: any;

	let modal: boolean;
	let inQueue: boolean;

	const restartGame = () => {
		modal = false;
		playerScore = {
			p1: 0,
			p2: 0
		};
		opponent = null;
		if (!socket) return;
		socket.registerQueue();
	};

	const scoreCallback = (rawData: MessageEvent<any>) => {
		playerScore = JSON.parse(rawData.toString());
		console.log(playerScore);
		return;
	};

	const endCallback = (rawData: MessageEvent<any>) => {
		//display ending modal
		modal = true;
		return;
	};

	const newGameCallBack = (rawData: MessageEvent<any>) => {
		const datata = JSON.parse(rawData.toString());

		let opponentNickname: string;
		if (datata.user1 === $userData.nickname) opponentNickname = datata.user2;
		else opponentNickname = datata.user1;
		getUserByNickname(opponentNickname).then((data) => {
			opponent = data;
		});
		modal = false;
		inQueue = false;
		return;
	};

	const onQueue = () => {
		inQueue = true;
	};

	const setupSocket = () => {
		if (!$loggedIn) return;
		socket = new MySocket(4242, $userData.nickname);
		socket.connect();
		socket.setScoreHandler(scoreCallback);
		socket.setEndGameHandler(endCallback);
		socket.setNewGameHandler(newGameCallBack);
		socket.setEnterQueueHandler(onQueue);
	};
	setupSocket();

	let hostname: any;
	if (import.meta.env.SSR === false) {
		hostname = location.hostname;
	}
	async function getUserByNickname(nickname: string) {
		try {
			const response = await fetch(`http://${hostname}:3000/user/info?nickname=${nickname}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Erreur lors de la récupération des données utilisateur');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	onMount(() => {
		if ($twoFaLocked) {
			goto('/2fa');
			return;
		}
		getUserByNickname($userData.nickname);
		modal = false;
		inQueue = false;
	});
</script>

<div class="row-center pong-container">
	<div class="score column-center">
		<div class="profile row-center">
			<div
				class="profile-img"
				style="background-image: url({$loggedIn ? $userData.imageUrl : profile_fallback});"
			/>
			<span class="nickname">{$loggedIn ? $userData.pseudo : 'Disconnected'}</span>
		</div>
		<h1 class="score-1 column-center">{playerScore.p1}</h1>
	</div>
	<!-- <h1>TEEEEEEEEEEEEEEEEEEEEEEST</h1> -->
	<Playground bind:socket />
	<div class="score column-center">
		<div class="profile row-center">
			<picture class="column-center">
				<img src={opponent ? opponent.imageUrl : profile_fallback} alt="Default avatar" />
			</picture>
			<span class="nickname">{opponent ? opponent.pseudo : 'Awaiting'}</span>
		</div>
		<h1 class="score-2 column-center">{playerScore.p2}</h1>
	</div>
</div>
{#if inQueue}
	<div class="inqueue-container row-center">
		<span>Waiting for players...</span>
	</div>
{/if}
{#if modal}
	<Modal {restartGame} {playerScore} />
{/if}

<style>
	:root {
		--white: 255, 253, 250;
		--success: 124, 252, 0;

		--background: 0, 35, 71;
		--dominant: 255, 142, 0;
	}

	picture img {
		height: 45px;
		width: 45px;
		border-radius: 1rem;
	}

	.profile {
		gap: 0.9rem;
		background-color: rgba(12, 12, 12, 0.4);
		padding: 0.3rem 2rem;

		border-radius: 1rem;
	}

	.profile-img {
		height: 45px;
		width: 45px;
		border-radius: 1rem;

		background-size: cover;
		background-position: center;
	}

	.profile > .nickname {
		color: rgba(var(--white), 1);
	}

	.score-1,
	.score-2 {
		width: 14vw;
		font-size: 150px;
		font-weight: 900;
		text-transform: uppercase;

		color: rgba(var(--dominant), 1);
		background-color: transparent;
	}
	.pong-container {
		margin-top: 3rem;
		background-color: rgba(var(--background), 1);
	}

	.inqueue-container {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(var(--dominant), 0.35);
		padding: 0.75rem 1.5rem;

		border-radius: 1.5rem;

		animation: blink 5s infinite;
	}

	.inqueue-container > span {
		color: rgba(var(--white), 1);
	}

	@keyframes blink {
		0% {
			background-color: rgba(var(--dominant), 0.35);
		}
		50% {
			background-color: rgba(var(--dominant), 0.55);
		}
		100% {
			background-color: rgba(var(--dominant), 0.35);
		}
	}
</style>

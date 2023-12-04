<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { MySocket } from './socket';
	import type { PlayerScore } from './types/PlayerScore';
	import Instructions from './instructions.svelte';

	export let socket: MySocket | null;
	let mooveSpeed = 30;
	const barHeight = 100;
	const playgroundWidth = 1000;
	const playgroundHeight = 600;
	let player1Y = playgroundHeight / 2;
	let player2Y = playgroundHeight / 2;

	let ball = {
		x: playgroundWidth / 2,
		y: playgroundHeight / 2
	};

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' && player1Y - getMooveSpeed() > barHeight / 2) {
			handleArrowUp();
		}
		if (
			event.key === 'ArrowDown' &&
			player1Y + getMooveSpeed() < playgroundHeight - barHeight / 2
		) {
			handleArrowDown();
		}
	}

	function handleArrowUp() {
		player1Y -= getMooveSpeed();
		if (socket) socket.setBarY(getServerBarY(player1Y));
	}

	function handleArrowDown() {
		player1Y += getMooveSpeed();
		if (socket) socket.setBarY(getServerBarY(player1Y));
	}

	function moveBall(x: number, y: number) {
		ball.x = x;
		ball.y = y;
	}

	function moveBar(y: number) {
		player2Y = y;
	}

	const getPlayGroundSize = () => {
		const element = document.getElementById('playground');
		if (!element) return;
		return {
			width: element.clientWidth,
			height: element.clientHeight
		};
	};

	const getServerBarY = (currentY: number) => {
		const size = getPlayGroundSize();
		if (!size) return 0;

		return (currentY * playgroundHeight) / size.height;
	};

	function getClientX(serverX: number) {
		const size = getPlayGroundSize();
		if (!size) return 0;

		return (size.width * serverX) / playgroundWidth;
	}

	function getClientY(serverY: number) {
		const size = getPlayGroundSize();
		if (!size) return 0;

		return (size.height * serverY) / playgroundHeight;
	}

	function getMooveSpeed() {
		const size = getPlayGroundSize();
		if (!size) return 0;

		return (mooveSpeed * playgroundHeight) / size.height;
	}

	const ballCallback = (rawData: MessageEvent<any>) => {
		const data = JSON.parse(rawData.toString());
		moveBall(getClientX(data.x), getClientY(data.y));
		return;
	};

	const barCallback = (rawData: MessageEvent<any>) => {
		const data = JSON.parse(rawData.toString());
		moveBar(getClientY(data.y));
		return;
	};

	function setupSocket() {
		if (!socket) return;
		socket.setBarY(getServerBarY(player1Y));
		socket.setBallHandler(ballCallback);
		socket.setBarHandler(barCallback);
	}

	onMount(() => {
		setupSocket();
		document.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		if (socket) socket.close();
	});
</script>

<div
	class="playground"
	id="playground"
	style="width: {playgroundWidth}px; height: {playgroundHeight}px;"
>
	<div class="game-ui topbar" />
	<div class="game-ui subbar" />
	<div class="game-ui ball" style="top: {ball.y}px; left: {ball.x}px;" />
	<div class="game-ui first_bar" style="top: {player1Y}px; height: {barHeight}px;" />
	<div class="game-ui second_bar" style="top: {player2Y}px; height: {barHeight}px;" />
	<div class="game-ui background">pong</div>
	<Instructions />
</div>

<style>
	.playground {
		position: relative;
	}

	.game-ui {
		position: absolute;
		background-color: rgba(var(--white), 1);

		transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.1s;
	}

	.topbar {
		height: 10px;
		width: 90%;

		top: 0;
		left: 50%;

		transform: translate(-50%, 0);
	}

	.subbar {
		height: 10px;
		width: 90%;

		bottom: 0;
		left: 50%;

		transform: translate(-50%, 0);
	}

	.ball {
		top: 50%;
		left: 50%;

		transform: translate(-50%, -50%);

		height: 15px;
		width: 15px;

		border-radius: 1rem;

		z-index: 2;
	}

	.first_bar {
		width: 10px;

		left: 0.2rem;
		top: 50%;
		transform: translate(0, -50%);
	}

	.second_bar {
		width: 10px;

		right: 0.2rem;
		top: 50%;
		transform: translate(0, -50%);
	}

	.background {
		width: min-content;

		top: 50%;
		left: 50%;

		transform: translate(-50%, -50%);
		font-size: 150px;
		font-weight: 900;
		text-transform: uppercase;

		color: rgba(var(--dominant), 0.25);
		background-color: transparent;

		z-index: -1;
	}
</style>

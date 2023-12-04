<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import socket from '../socket';
	import { userData } from '$lib/stores/userDataStore';

	import Navbar from '../lib/home/Navbar.svelte';
	import { twoFaLocked } from '$lib/stores/twoFaLockedState';

	onMount(() => {
		if ($twoFaLocked) {
			goto('/2fa');
			return;
		}
	});
</script>

<title> FT_TRANSCENDENCE </title>
<meta charset="utf-8" />
<div class="main">
	<Navbar />
	<img src="/wire.png" alt="wire" style="width:10%;position:fixed;right:0;bottom:0" />
	<slot />
</div>

<style>
	.main {
		min-height: 100vh;
		height: auto;
		background-image: url('ffflux.svg');
		background-size: cover;
		background-repeat: no-repeat;
		/* background-attachment: fixed; */
		font-family: 'Coolvetica';
		margin: 0;
    	padding: 0;
	}
</style>

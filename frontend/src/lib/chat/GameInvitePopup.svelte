<script lang="ts">
	import { goto } from "$app/navigation";

	let showPopUp: boolean = true;

    export let inviter: string;

	export function show()
    {
		showPopUp = true;
	}

	export function hide()
    {
		showPopUp = false;
	}



</script>


{#if showPopUp}
<div class="wrapper">
<div id="container">

	<span on:click={hide}>&times;</span>
	<h3>{inviter} is inviting you to a Pong game!</h3>
        <br>
		<button on:click={() => {goto("/pong")}}>accept</button>
        <button on:click={() => {showPopUp = false}}>decline</button>
</div>
</div>

{/if}



<style>

	.wrapper {
		background-color: rgba(0,0,0,0.6);
		position:fixed;
		height:100%;
		width:100%;
		top:0;
		left:0;
        overflow: auto;
        z-index: 100;
	}
	
    #container {
        font-family: sans-serif;
		background-color:white;
		margin: 15% auto;
		padding: 20px;
        width:50%;
        height: auto;
        border: double black;
		border-radius: 10px;
        z-index: 101;
        text-align: center;
    }

		
	span {
		float:right;
		cursor:pointer;
	}
	span:hover {
		font-weight:bold;
	}

    button  {
        padding: 1%;
    }
</style>

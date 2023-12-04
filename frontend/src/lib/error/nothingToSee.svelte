<script>
	import { goto } from "$app/navigation";

    import GlitchyButton from "./GlitchyButton.svelte";

    // const imgLink = "https://static.vecteezy.com/system/resources/previews/010/265/390/original/cute-3d-robot-say-hello-png.png";
</script>


<div class="container">
	<div class="box">
		<p>Nothing to see here!</p>
        <GlitchyButton buttonText="GO BACK HOME" on:click={() => {
			goto("/");
		}}/>
	</div>
	<img src="cute-robot.png" alt="robot">
</div>

<style>

.container {
	position:relative;
	width:50%;
	height: 150px;
	margin: 15% auto;
	/* background-color: white; */
}
	
.box {
    font-family: "Coolvetica";
    font-size: larger;
    color: white;
	width:85%;
	height:100%;
	/* margin: 0 auto; */
	border: dashed 1px white;
	border-radius: 10px;
	display: flex;
	flex-direction:column;
	justify-content: center;
	align-items: center;
	position:absolute;
	left:0;
	top:0;
	z-index:1;
    background-color: black;
	background-image: url("ffflurry.svg");
    opacity: 0.6;
    row-gap: 20px;
}
	
img {
	max-width:30%;
	height:auto;
	position:absolute;
	right:0;
	top:0;
	z-index:2;
    opacity: 0.95;
}


</style>

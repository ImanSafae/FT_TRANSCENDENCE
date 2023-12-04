<script lang="ts">
	import { goto } from "$app/navigation";

    import GlitchyButton from "./GlitchyButton.svelte";

    // const imgLink: string = "https://static.vecteezy.com/system/resources/previews/010/265/390/original/cute-3d-robot-say-hello-png.png";
    let loginPage: string = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0c5d0153eee0509ce923228ecef6e8ebb0cfb2e2fe4ab50b6bdc528d6a86dd21&redirect_uri=http%3A%2F%2F159.65.54.159%3A5173&response_type=code";
</script>


<div class="container">
	<div class="box">
		<p>You need to log in to access this page!</p>
        <GlitchyButton buttonText="LOG IN" on:click={() => {
            goto(loginPage);
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

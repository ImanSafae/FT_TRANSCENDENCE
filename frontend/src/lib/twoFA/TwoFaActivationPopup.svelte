<script lang="ts">
	import { userData } from "../stores/userDataStore";

	let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }

    export let secret:string;
    export let qrCodeUrl: string;
	let securityCode: string;
    let securityCodeEndpoint = `http://${hostname}:3000/auth/2fa/activate`
	
	let showPopUp: boolean = false;
	let showSuccessMsg: boolean = false;
	let showErrorMsg: boolean = false;

	export function show()
    {
		showPopUp = true;
	}

	export function hide()
    {
		showPopUp = false;
	}

	function showSuccessMessage()
	{
		showSuccessMsg = true;
		if (showErrorMsg)
			showErrorMsg = false;
	}

	function showErrorMessage()
	{
		showErrorMsg = true;
		if (showSuccessMsg)
			showSuccessMsg = false;
	}

    async function sendSecurityCode()
    {
        let content = {
            "code":securityCode.toString(),
            "secret":secret,
			"userData":$userData
        }
		console.log("Security Code sent: ", securityCode);
        // send code to back through POST method
        // get true or false in return depending on whether it was verified
        try {
            let data = await fetch(securityCodeEndpoint, {
                method:"POST",
				headers: {
            	"Content-Type": "application/json",
				},
                body:JSON.stringify(content)
            });
            if (data.ok)
            {
                let success:boolean = await data.json();
				if (success == true)
				{
					showSuccessMessage();
				}
				else
				{
					showErrorMessage();
				}
            }
        }
		catch (error) {
			console.log("error: ", error);
		}
    }


</script>


{#if showPopUp}
<div class="wrapper">
<div id="container">

	<span on:click={hide}>&times;</span>
	<h2>Activate two-factor authentication</h2>
	<h3>You will have to repeat these steps everytime you log in.</h3>
	<div class="steps-list">
			<div class="step">
				<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Google_Authenticator_%28April_2023%29.svg/1200px-Google_Authenticator_%28April_2023%29.svg.png" alt="Google Authenticator logo" style="width:10%">
				<div class="step-description">
					<h3>STEP 1 </h3> Download the Google Authenticator app on your phone and log in using the same e-mail address you previously provided.
				</div>
			</div>
			<div class="step">
				<img src={qrCodeUrl} alt="your qr code" style="width:10%">
				<div class="step-description">
					<h3>STEP 2</h3> Scan the QR code with the app.
				</div>
			</div>
			<div class="step">
				<img src="https://www.freeiconspng.com/thumbs/lock-icon/lock-icon-11.png" alt="a lock" style="width:10%">
				<div class="step-description">
					<h3>STEP 3</h3> Enter the security code provided by the Google Authenticator app.
				</div>
			<div class="form">
			<form on:submit|preventDefault={sendSecurityCode}>
				<label for="security-code">Enter the security code</label>
				<input name="security-code" type="text" bind:value={securityCode} required>
				<button>ACTIVATE</button>
			</form>
			</div>
			</div>
		</div>
		{#if showSuccessMsg}
		<p class="success-msg" style="color:green">Two-factor authentication successfully activated!</p>
		{/if}
		{#if showErrorMsg}
		<p class="error-msg" style="color:red">Wrong code. Two-factor authentication couldn't be activated.</p>
		{/if}
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
        z-index: 100000;
	}
	
    #container {
        font-family: sans-serif;
		background-color:white;
		margin: 15% auto;
		padding: 20px;
        width: 70%;
        height: auto;
        border: double black;
		border-radius: 10px;
        z-index: 100001;
    }

		.steps-list {
			display: flex;
			flex-direction: column;
			justify-content:space-evenly;
			row-gap: 20px;
		}

		.step {
			display:flex;
			flex-direction: row;
			column-gap: 20px;
			align-items: center;
			margin-bottom:0;
			flex-wrap: wrap;
		}
		.step-description {
			display:flex;
			height:auto;
			width:70%;
			flex-direction: column;
			/* flex-wrap: wrap; */
			margin-bottom:30px;
		}
		.step-description h3 {
			display:inline;
		}

	form {
		display:flex;
		justify-content: center;
		column-gap:10px;
	}

	span {
		float:right;
		cursor:pointer;
	}
	span:hover {
		font-weight:bold;
	}
</style>

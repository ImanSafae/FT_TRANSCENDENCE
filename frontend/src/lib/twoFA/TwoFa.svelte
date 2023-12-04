<script lang="ts">

    import TwoFaPopup from "./TwoFaActivationPopup.svelte";
    import { userData } from "$lib/stores/userDataStore";

    let popup: any;    
    let email: string ="";
    let secret2FA: string = "";
    let codeQR2FA: string;

    let disableForm: boolean = false;
    let enableForm: boolean = false;

    let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }

    const getQrCodeEndpoint = `http://${hostname}:3000/auth/2fa/getqrcode`;
    const activate2FAEndpoint = `http://${hostname}:3000/auth/2fa/activate`;
    const deactivate2FAEndpoint = `http://${hostname}:3000/auth/2fa/deactivate`

    function showDisableForm()
    {
        disableForm = true;
        if (enableForm)
            enableForm = false;
    }

    function showEnableForm()
    {
        enableForm = true;
        if (disableForm)
            disableForm = false;
    }

    function hideDisableForm()
    {
        disableForm = false;
        if (enableForm)
            enableForm = true;
    }

    function hideEnableForm()
    {
        enableForm = false;
        if (disableForm)
            disableForm = true;
    }

    async function generateQrCode()
    {
        let content = {"email":email};
        console.log("attempting to send email: ", email);
        try {
            let data = await fetch(getQrCodeEndpoint, {
                method:"POST",
                headers: {
            	"Content-Type": "application/json",
				},
                body:JSON.stringify(content)
            });
            if (data.ok)
            {
                let {secret, codeQR} = await data.json();
                secret2FA = secret;
                codeQR2FA = codeQR;
                console.log("Secret:", secret);
                console.log("QR Code:", codeQR);
                popup.show();
                // afficher le qrcode et attendre un code fourni par Google A.
                // garder le secret pour le renvoyer au back en même temps que le code
            }
        }
        catch (error) {
            console.log("error: "), error;
        }
    }

    function activate2FA()
    {
        generateQrCode();
    }

    async function enableOrDisable()
    {
        // let data = await fetch(check2FAStatus);
        // if (data.ok)
        // {
            // twoFaStatus = await data.json();
            if ($userData.twoFA && !disableForm)
                showDisableForm();
            else if ($userData.twoFA && disableForm)
                hideDisableForm();
            else if (!$userData.twoFA && !enableForm)
                showEnableForm();
            else if (!$userData.twoFA && enableForm)
                hideEnableForm();
        // }
    }

    async function disable2FA()
    {
        let data = await fetch(deactivate2FAEndpoint, {
            method: "POST",
            headers: {
            	"Content-Type": "application/json",
				},
                body:JSON.stringify($userData)
            });
        if (data.ok)
        {
            let success: boolean = await data.json();
            if (success)
            {
                alert("Two-Factor authentication successfully disabled!");
                $userData.twoFA = false;
                disableForm = false;
            }
        }
    }

</script>

<div id="twofa">
    <!-- <a on:click={enableOrDisable}>Enable/Disable double-factor authentication</a> -->
    <button id="enable-disable-button" on:click={enableOrDisable}>Enable/Disable double-factor authentication</button>

    {#if enableForm}
        <div class="enable-form">
            <p>To enable double-factor authentication, you will need to verify your email address by scanning a QR code on the Google Authenticator app.</p>
            <div class="my-form">
                <form on:submit|preventDefault={activate2FA}>
                    <!-- <label for="email">E-mail:</label> -->
                    <input class="email-bar" type="email" placeholder="Email" name="email" bind:value={email} required>
                    <!-- <input type="checkbox" required> -->
                    <button class="activate-2fa-button">Activate two-factor authentication</button>
                </form>
            </div>
        </div>
        {:else if disableForm}
        <div class="disable-form">
            <p>Click to disable double-factor authentication</p>
            <button id="disable-button" on:click={disable2FA}>Disable</button>
        </div>
        {/if}
    </div>
    <TwoFaPopup bind:this={popup} qrCodeUrl={codeQR2FA} secret={secret2FA} />
    
    <style>
        
#twofa {
    font-family: "Coolvetica";
    margin-top: 0%;
    color:whitesmoke;
    margin-left: 20px;
    width: auto;
    /* border: 1px solid black; */
    
}

.enable-form {
    margin-top: 5%;
    margin-bottom: 5%;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
}

/* form {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding-right: 5%;
} */


.email-bar {
    padding: 2%;
    border: none;
    border-radius: 10px;
}

.activate-2fa-button {
    padding: 2%;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

/* BOUTON */

.disable-form {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    margin-top: 20px;
}

.disable-form button {
    padding: 1%;
    border-radius: 10px;
    width: 30%;
}

#enable-disable-button {
  text-decoration: none;
  position: relative;
  border: none;
  font-size: 14px;
  font-family: inherit;
  color: black;
  width: auto;
  height: auto;
  line-height: 2em;
  text-align: center;
  background: linear-gradient(90deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4);
  background-size: 300%;
  border-radius: 35px;
  /* margin: 20px; */
  /* margin-left: 10px; */
  z-index: 1;
}

#enable-disable-button:hover {
  animation: ani 8s linear infinite;
  border: none;
}

@keyframes ani {
  0% {
    background-position: 0%;
  }

  100% {
    background-position: 400%;
  }
}

#enable-disable-button:before {
  content: '';
/*position: absolute;*/
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  background: linear-gradient(90deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4);
  background-size: 400%;
  border-radius: 10px;
  border: 2px solid black;
  color: black;
  transition: 1s;
}

#enable-disable-button:hover::before {
  filter: blur(20px);
}

#enable-disable-button:active {
  background: linear-gradient(32deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4);
}

</style>
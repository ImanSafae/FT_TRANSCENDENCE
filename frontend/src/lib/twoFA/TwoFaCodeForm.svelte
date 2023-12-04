<script lang="ts">
	import { goto } from "$app/navigation";
	import { loggedIn } from "$lib/stores/loggedStore";

  import { twoFaLocked } from "$lib/stores/twoFaLockedState";
	import { userData } from "$lib/stores/userDataStore";
	import socket from "../../socket";

  let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }
  
  let code: string = "";
  const codeVerifEndpoint = `http://${hostname}:3000/auth/2fa/verifcode`

  let showErrMsg:boolean = false;

  function showErrorMsg()
  {
    showErrMsg = true;
  }

  function hideErrorMsg()
  {
    showErrMsg = false;
  }

  function clearInput()
  {
    code = "";
  }

  async function submit2FACode()
  {
    console.log("submitting code from", $userData.nickname);
    let content: any = {
      code: code,
      userData: $userData
    };
    try {
      let data = await fetch(codeVerifEndpoint, {
        method:"POST",
        headers: {
          "Content-type":"application/json"
        },
        body:JSON.stringify(content)
      });

      if (data.ok)
      {
        const isValid = await data.json();
        console.log("isValid: ", isValid);
        if (isValid)
        {
          twoFaLocked.set(false);
          loggedIn.set(true);
          userData.set(isValid);
          socket.auth = { username: isValid.nickname };
          socket.connect();
          goto("/profile");
        }
        else
          showErrorMsg();
      }
    }
    catch (error)
    {
      console.log("error: ", error);
    }
  }


</script>


  <form class="form">
      <div class="info">
      <span class="title">Two-Factor Verification</span>
    <p class="description">Enter the two-factor authentication code provided by the authenticator app.</p>
      </div>
        <div class="input-fields">
        <input bind:value={code} placeholder="" type="tel" maxlength="6">
      </div>
    
          <div class="action-btns">
            <a on:click={submit2FACode} class="verify" href="#">Verify</a>
            <a on:click={clearInput} class="clear" href="#">Clear</a>
          </div>
      {#if showErrMsg}
        <p class="error-msg">Wrong code. Please try again.</p>
      {/if}
    </form>



  <style>

    .form {
    --glow-color: rgb(176, 255, 251);
    --glow-spread-color: rgba(123, 246, 255, 0.781);
    --enhanced-glow-color: rgb(182, 71, 71);
    --btn-color: rgba(65, 65, 65, 0.508);
    border: 2px solid var(--glow-color);
    padding: 25px;
    display: flex;
    max-width: 420px;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    color: var(--glow-color);
    background-color: var(--btn-color);
    border-radius: 20px;
    position: relative;
    margin: 5% auto;
    font-family: "Coolvetica";
  }

  
  /*----heading and description-----*/
  
  .info {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .title {
    color: #fff;
    font-size: 2.5rem;
    /* font-weight: 900; */
    font-family: "Bad Signal";
  }
  
  .description {
    color: #fff;
    margin-top: 10px;
    font-size: 1rem;
    /* text-transform: uppercase; */
    /* font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; */
  }
  
  /*----input-fields------*/
  
  .form .input-fields {
    display: flex;
    justify-content: space-between;
    /* gap: 10px; */
  }
  
  .form .input-fields input {
    height: 2.5em;
    width: 5.5em;
    outline: none;
    text-align: center;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 1.5rem;
    color: #fff;
    border-radius: 12px;
    border: 2.5px solid rgba(253, 253, 253, 0.363);
    background-color: rgb(255 255 255 / 0.05);
  }
  
  .form .input-fields input:focus {
    border: 1px solid rgb(99, 236, 241);
    box-shadow: inset -1px -1px 5px rgba(255, 255, 255, .6),
          inset 10px 10px 10px rgba(0, 0, 0, .25);
    transform: scale(1.05);
    transition: 0.5s;
  }
  
  /*-----verify and clear buttons-----*/
  
  .action-btns {
    display: flex;
    margin-top: 12px;
    gap: 0.5rem;
    font-family: "13misa";
    /* text-transform: uppercase; */
  }
  
  .verify {
    padding: 10px 20px;
    /* text-transform: uppercase; */
    text-decoration: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    color: #00e1ff;
    text-shadow: none;
    background: transparent;
    box-shadow: transparent;
    border: 1px solid #ffffff80;
    transition: 0.5s ease;
    user-select: none;
  }
  
  .verify:hover,:focus {
    color: #ffffff;
    background: #4090b5;
    border: 1px solid #4090b5;
    text-shadow: 0 0 5px #ffffff,
                0 0 10px #ffffff,
                0 0 20px #ffffff;
    box-shadow: 0 0 5px #4090b5,
                0 0 20px #4090b5,
                0 0 50px #4090b5,
                0 0 100px #4090b5;
  }
  
  .clear {
    padding: 10px 20px;
    /* text-transform: uppercase; */
    text-decoration: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    color: #9e30a9;
    text-shadow: none;
    background: transparent;
    box-shadow: transparent;
    border: 1px solid #ffffff80;
    transition: 0.5s ease;
    user-select: none;
  }
  
  .clear:hover,:focus {
    color: #ffffff;
    background: #9e30a9;
    border: 1px solid #9e30a9;
    text-shadow: 0 0 5px #ffffff,
                0 0 10px #ffffff,
                0 0 20px #ffffff;
    box-shadow: 0 0 5px #9e30a9,
                0 0 20px #9e30a9,
                0 0 50px #9e30a9,
                0 0 100px #9e30a9;
  }
  
.error-msg {
    color:red;
    margin-top: 10px;
    font-size:larger;
    font-family: sans-serif;
  }
  
  </style>
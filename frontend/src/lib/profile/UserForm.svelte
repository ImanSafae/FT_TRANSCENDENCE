<script lang="ts">
	import { userData } from "$lib/stores/userDataStore";
	import socket from "../../socket";

  let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }

  const updateUserEndpoint: string = `http://${hostname}:3000/user/newnickname`;
  let newNickname: string = "";
  let formShown: boolean = false;

  function showForm()
  {
    formShown = true;
  }

  function hideForm()
  {
    formShown = false;
  }

  function toggleForm()
  {
    formShown = !formShown;
  }

  function isAlphaNum(str: string): boolean
  {
    const regex = /^[a-zA-Z0-9]+$/;
    return (regex.test(str));
  }

  async function changeNickname()
  {
    if (newNickname === "")
      return ;
    if (!isAlphaNum(newNickname))
    {
      alert("Your new nickname should contain letters and numbers only.");
      newNickname = "";
      return ;
    }
    newNickname = newNickname.toLowerCase();
    console.log("sending", newNickname, "as a new nickname, and user data:", $userData);
    let content = {
      userData: $userData,
      newNickname: newNickname
    };
    let data = await fetch(updateUserEndpoint, {
      method:"POST",
      headers: {
          "Content-Type": "application/json",
				},
        body: JSON.stringify(content)
    });
    let result: boolean = await data.json();
    // console.log("here is the result", result);
    if (result === true)
    {
      alert("In-game name successfully changed!")
      $userData.pseudo = newNickname;
      // socket.auth = { username: newNickname };
    }
    else if (result === false)
      alert("This nickname is already taken.");
    else
      alert("Internal error. Please try again later.");
    newNickname = "";
  }

</script>


<button id="show-form" on:click={toggleForm}>Change my in-game name</button>

{#if formShown}
<div id="main-container">
  <span id="SubscribeTXT">Change your game nickname</span>
    <div class="input-container">
      <form class="container" on:submit|preventDefault={changeNickname}>
        <input placeholder="nickname" type="text" class="input-is" bind:value={newNickname}>
        <button class="submit-button">SUBMIT</button>
        </form>
      </div>
  </div>
{/if}

<style>

/* BUTTON */

#show-form {
  text-decoration: none;
  position: relative;
  border: none;
  font-size: 14px;
  font-family: "Coolvetica";
  color: black;
  width: auto;
  height: 25px;
  /* line-height: 2em; */
  text-align: center;
  justify-content: center;
  border-radius: 10px;
  margin: 20px;
  z-index: 1;
  /* padding: 2%; */
}

#show-form:hover {
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

#show-form:before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  background: linear-gradient(90deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4);
  border: 2px solid black;
  background-size: 400%;
  border-radius: 10px;
  transition: 1s;
}

#show-form:hover::before {
  filter: blur(20px);
}

#show-form:active {
  background: linear-gradient(32deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4);
}

#main-container {
  margin: 0px 20px 20px 20px;
  color: white;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
}

.submit-button {
  padding: 2%;
  border-radius: 10px;
}

.input-is {
  padding: 2%;
  border-radius: 10px;
}
</style>
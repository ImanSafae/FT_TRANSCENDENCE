import { Client } from "./client.model";
import { Game } from "./game.model";

export class Queue {
    private static waitingPlayer: Client[] = []

    constructor() {};

    public static addClient(client: Client) {
        this.waitingPlayer.push(client);
        client.setInQueue(true);
        console.log("Adding a client")

        if (this.waitingPlayer.length >= 2)
            this.launchGame()
    }

    public static removeClient(client: Client)
    {
        for(let i = 0; i < this.waitingPlayer.length; i++)
        {
            if (this.waitingPlayer[i].isEqual(client))
            {
                this.waitingPlayer.splice(i, 1);
                return;
            }
        }
    }

    private static launchGame()
    {
        console.log("Starting game")
        //instance of Game is saved in Player class in constructor
        new Game(this.waitingPlayer[0], this.waitingPlayer[1]);
        //deleting first 2 players from waiting list
        this.waitingPlayer.splice(0, 2);
    }
}
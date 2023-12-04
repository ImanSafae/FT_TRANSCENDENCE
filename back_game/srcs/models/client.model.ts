import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "./game.model";
import { Queue } from "./queue.model";
require('dotenv').config();

export class Client {
	private static clients: Client[] = [];

	private static addClient = (client: Client) => {
		this.clients.push(client);
	} 

	public static removeClient(client: Client)
    {
        for(let i = 0; i < this.clients.length; i++)
        {
            if (this.clients[i].isEqual(client))
            {
                this.clients.splice(i, 1);
                return;
            }
        }
    }

    private id: string;
	private nickname: string | null;
    private socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
	private functionMap: Map<string, ((m: string[]) => void)>;
	private currentGame: (Game | null) = null;

	private barY = 600 / 2;
	private score: number = 0;
	private inQueue:boolean = false;
	private barHandler: ((n:number) => void) | null = null;

    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
      	this.id = socket.id;
      	this.socket = socket;
		this.nickname = null;

		this.functionMap = new Map<string, ((m: string[]) => void)>();
		this.initializeMap();

		Client.addClient(this);
    }

	public getMap(): Map<string, ((m: string[]) => void)>
	{
		return (this.functionMap);
	}

	public getNickName() { return this.nickname };

	public setCurrentGame(game: Game)
	{
		// if (this.currentGame) throw new Error("Trying to set a currentGame to a client that already has one");
		this.currentGame = game;
		this.socket.emit("newGame", JSON.stringify(game.getInfos()));
	}

	public setInQueue(status:boolean)
	{
		this.inQueue = status;
	}

	public resetCurrentGame()
	{
		this.currentGame = null;
		this.score = 0;
		this.sendEndGame();
	}

	public getId():string {return this.id};

	public getBarY():number {return this.barY};

	public getScore():number {return this.score};

	public increaseScore() {
		this.score++;
	}

	public isEqual(client: Client): boolean {
		return (client.getId() === this.id)
	}
  
    public send(type:string, message: string) {
      	this.socket.emit(type, message);
    }

    public sendBallPosition(pos: {x:number, y:number}) {
      	if (!isFinite(pos.x) || !isFinite(pos.y)) throw new TypeError("Ball x and y position must be a number.");
      	this.socket.emit("ballPosition", JSON.stringify(pos));
    }

	public sendOpponentBarY(y: number) {
		if (!isFinite(y)) throw new TypeError("Bar y position must be a number.");
		this.socket.emit("barPosition", JSON.stringify({y: y}));
	}

	public sendScore(score: {p1: number, p2: number}) {
		this.socket.emit("updateScore", JSON.stringify(score));
	}

	public sendEndGame() {
		this.socket.emit("gameEnd", "");
	}

    public receiveMessage(message:string) {
		const words = message.split(' ');
		if (!words[0]) return;

		const func = this.functionMap.get(words[0]);
		if (func) 
		  func(words);
    }

	private initializeMap()
	{
		this.functionMap.set("SET_STATUS", this.setStatus.bind(this));
		this.functionMap.set("SET_BAR", this.setBar.bind(this));
	}

	//Security
	//Needs nickname check to see if user exist. 
	private setStatus(message:string[]) {
		if (message.length > 2 
			&& message[1] === "WAITING")
		{
			this.nickname = message[2];
			Queue.addClient(this);
		}
		if (message.length > 1
			&& message[1] === "IDLE")
			Queue.removeClient(this);
	}

	private setBar(message:string[]) {
		if (!message[1]) return;
		const playGroundHeight = 600;

		let newY = Number(message[1]);
		if (newY < 0 || newY >= playGroundHeight) return;
		this.barY = newY;

		if (this.barHandler)
			this.barHandler(newY)
	}

	public setBarHandler(callback: (n:number) => void) {
		this.barHandler = callback;
	}

	public disconnect()
	{
		console.log("Client disconnected")
		this.score = 0;
		if (this.currentGame)
			this.currentGame.playerLeaving(this);
		if (this.inQueue)
			Queue.removeClient(this);
		Client.removeClient(this);
	}
}

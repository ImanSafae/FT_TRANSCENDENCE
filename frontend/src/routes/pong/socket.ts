import { Socket, io } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";


export class MySocket
{
    private port: number;
    private userId: string;
    private socket: (Socket<DefaultEventsMap, DefaultEventsMap> | null) = null;
    private ballHandler: ((event: MessageEvent<any>) => void) | null = null;
    private barHandler: ((event: MessageEvent<any>) => void) | null = null;
    private scoreHandler: ((event: MessageEvent<any>) => void) | null = null;
    private endGameHandler: ((event: MessageEvent<any>) => void) | null = null;
    private newGameHandler: ((event: MessageEvent<any>) => void) | null = null;
    private queueHandler: (() => void) | null = null;
    private barGetter: (() => number) | null = null;

    //50ms for 20 ticks per seconds
    private updateInterval = 50;
    private loop: (number | null) = null;

    private barY: number = 0;

    constructor(port:number, userId:string)
    {
        this.port = port;
        this.userId = userId;
    }

    public getSocket()
    {
        return (this.socket);
    }

    public connect() {

        let hostname;
        if (import.meta.env.SSR === false) {
            hostname = location.hostname;
        }
        this.socket = io(`http://${hostname}:` + this.port);

        this.socket.on("connect", this.registerQueue.bind(this));
        this.handlingConnection();
    };

    private handlingConnection()
    {
        if (!this.socket) return;

        this.socket.on("ballPosition", this.onBallMovement.bind(this));
        this.socket.on("barPosition", this.onBarMovement.bind(this));
        this.socket.on("updateScore", this.onScore.bind(this));
        this.socket.on("gameEnd", this.onGameEnd.bind(this));
        this.socket.on("newGame", this.onNewGame.bind(this));
        this.socket.on("disconnect", this.onClose.bind(this));
    }

    private onBallMovement(event: MessageEvent<any>)
    {
        if (!this.ballHandler) return;
        this.ballHandler(event);
    }

    private onBarMovement(event: MessageEvent<any>)
    {
        if (!this.barHandler) return;
        this.barHandler(event);
    }

    private onScore(event: MessageEvent<any>)
    {
        if (!this.scoreHandler) return;
        this.scoreHandler(event);
    }

    private onGameEnd(event: MessageEvent<any>)
    {
        if (!this.endGameHandler) return;
        this.endGameHandler(event);
        this.stopRoutine();
    }

    private onNewGame(event: MessageEvent<any>)
    {
        if (!this.newGameHandler) return;
        this.newGameHandler(event);
        this.startRoutine();
    }

    public setBallHandler(callback: (event: MessageEvent<any>) => void) {
        this.ballHandler = callback;
    }

    public setBarHandler(callback: (event: MessageEvent<any>) => void) {
        this.barHandler = callback;
    }

    public setScoreHandler(callback: (event: MessageEvent<any>) => void) {
        this.scoreHandler = callback;
    }

    public setEndGameHandler(callback: (event: MessageEvent<any>) => void) {
        this.endGameHandler = callback;
    }

    public setNewGameHandler(callback: (event: MessageEvent<any>) => void) {
        this.newGameHandler = callback;
    }

    public setEnterQueueHandler(callback: () => void) {
        this.queueHandler = callback;
    }

    public setBarGetter(callback: () => number) {
        this.barGetter = callback;
    }

    public registerQueue()
    {
        if (!this.socket) return;
        this.socket.send("SET_STATUS WAITING " + this.userId);
        if (!this.queueHandler) return;
        this.queueHandler();
    }

    public startRoutine()
    {
        if (this.loop) return;
        this.loop = setInterval(() => {
            if (!this.socket) return;
            this.socket.send("SET_BAR " + this.barY);
        }, this.updateInterval);
    }

    public stopRoutine()
    {
        if (!this.loop) return;
        clearInterval(this.loop);
        this.loop = null;
    }

    public setBarY(y: number)
    {
        this.barY = y;
    }

    public close()
    {
        if (this.socket)
            this.socket.close()
    }

    private onClose()
    {
        //todo handle socket close
        console.log("Socket closed");
    }
}

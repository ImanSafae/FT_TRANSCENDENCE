import { Socket, io } from "socket.io-client";
export class MySocket {
    port;
    userId;
    socket = null;
    ballHandler = null;
    barHandler = null;
    scoreHandler = null;
    endGameHandler = null;
    newGameHandler = null;
    queueHandler = null;
    barGetter = null;
    //50ms for 20 ticks per seconds
    updateInterval = 50;
    loop = null;
    barY = 0;
    constructor(port, userId) {
        this.port = port;
        this.userId = userId;
    }
    getSocket() {
        return (this.socket);
    }
    connect() {
        let hostname;
        if (import.meta.env.SSR === false) {
            hostname = location.hostname;
        }
        this.socket = io(`http://${hostname}:` + this.port);
        this.socket.on("connect", this.registerQueue.bind(this));
        this.handlingConnection();
    }
    ;
    handlingConnection() {
        if (!this.socket)
            return;
        this.socket.on("ballPosition", this.onBallMovement.bind(this));
        this.socket.on("barPosition", this.onBarMovement.bind(this));
        this.socket.on("updateScore", this.onScore.bind(this));
        this.socket.on("gameEnd", this.onGameEnd.bind(this));
        this.socket.on("newGame", this.onNewGame.bind(this));
        this.socket.on("disconnect", this.onClose.bind(this));
    }
    onBallMovement(event) {
        if (!this.ballHandler)
            return;
        this.ballHandler(event);
    }
    onBarMovement(event) {
        if (!this.barHandler)
            return;
        this.barHandler(event);
    }
    onScore(event) {
        if (!this.scoreHandler)
            return;
        this.scoreHandler(event);
    }
    onGameEnd(event) {
        if (!this.endGameHandler)
            return;
        this.endGameHandler(event);
        this.stopRoutine();
    }
    onNewGame(event) {
        if (!this.newGameHandler)
            return;
        this.newGameHandler(event);
        this.startRoutine();
    }
    setBallHandler(callback) {
        this.ballHandler = callback;
    }
    setBarHandler(callback) {
        this.barHandler = callback;
    }
    setScoreHandler(callback) {
        this.scoreHandler = callback;
    }
    setEndGameHandler(callback) {
        this.endGameHandler = callback;
    }
    setNewGameHandler(callback) {
        this.newGameHandler = callback;
    }
    setEnterQueueHandler(callback) {
        this.queueHandler = callback;
    }
    setBarGetter(callback) {
        this.barGetter = callback;
    }
    registerQueue() {
        if (!this.socket)
            return;
        this.socket.send("SET_STATUS WAITING " + this.userId);
        if (!this.queueHandler)
            return;
        this.queueHandler();
    }
    startRoutine() {
        if (this.loop)
            return;
        this.loop = setInterval(() => {
            if (!this.socket)
                return;
            this.socket.send("SET_BAR " + this.barY);
        }, this.updateInterval);
    }
    stopRoutine() {
        if (!this.loop)
            return;
        clearInterval(this.loop);
        this.loop = null;
    }
    setBarY(y) {
        this.barY = y;
    }
    close() {
        if (this.socket)
            this.socket.close();
    }
    onClose() {
        //todo handle socket close
        console.log("Socket closed");
    }
}
//# sourceMappingURL=socket.js.map
import { Client } from "./client.model";
import axios from "axios";
require('dotenv').config();

export class Game {
    private player1: Client;
    private player2: Client;
    private ball: Ball;

    private playGroundHeight = 600;
    private playGroundWidth = 1000;
    private pointsToWin = 10;

    //50ms for 20 ticks per seconds
    private updateInterval = 50;
    private loop: (NodeJS.Timeout | null) = null;

    constructor(player1: Client, player2: Client) {
        this.player1 = player1;
        this.player2 = player2;

        this.ball = new Ball(0, 0, this);

        player1.setCurrentGame(this);
        player2.setCurrentGame(this);

        this.startNewRound();
    };

    public stop()
    {
        console.log("stopping game");
        //no need to await since we dont need response
        this.saveGameData();
        if (this.loop)
            clearInterval(this.loop);
        this.player1.resetCurrentGame();
        this.player2.resetCurrentGame();
    }

    public playerLeaving(client: Client)
    {
        //leaver point is set to 0.
        //if the other player has 0 point, just increase his score.
        //so other player win.
        console.log("Player left during the game")
        if (client.isEqual(this.player1) && !this.player2.getScore())
            this.player2.increaseScore();
        if (client.isEqual(this.player2) && !this.player1.getScore())
            this.player1.increaseScore();

        this.sendScore();
        this.stop();
    }

    public getInfos()
    {
        return({
            user1: this.player1.getNickName(),
            user2: this.player2.getNickName(),
            score1: this.player1.getScore(),
            score2: this.player2.getScore() 
        });
    }

    private startNewRound()
    {
        //reset tick loop
        if (this.loop)
            clearInterval(this.loop);
        this.ball = new Ball(this.playGroundWidth / 2, this.playGroundHeight / 2, this);

        this.startActualize();
    }

    private startActualize()
    {
        this.loop = setInterval(() => {
            // if (!this.maybeBallTakeBar())
            //     this.maybeBallOut();
            // this.maybeBallTakeWall();

            this.ball.actualize();
            this.player1.sendBallPosition(this.ball.getPosition());
            this.player1.sendOpponentBarY(this.player2.getBarY());

            this.player2.sendBallPosition(this.getInvertedPosition(this.ball.getPosition()));
            this.player2.sendOpponentBarY(this.player1.getBarY());
        }, this.updateInterval);
    }

    private getInvertedPosition(pos: { x: number; y: number; })
    {
        return ({
            x: this.getInvertedX(pos.x),
            y: pos.y
        })
    }

    private getInvertedX(x: number)
    {
        const middleX = this.playGroundWidth / 2;
        return (2 * middleX - x)
    }

    public getPlayer1Y() {
        return (this.player1.getBarY());
    }

    public getPlayer2Y() {
        return (this.player2.getBarY());
    }

    public ballOut(x: number)
    {
        if (x >= this.playGroundWidth / 2)
            this.player1.increaseScore();
        else
            this.player2.increaseScore();

        this.sendScore();
        if (this.isGameFinished())
        {
            this.stop();
            return;
        }
        this.startNewRound();
    }

    private sendScore()
    {
        const newScoreP1 = {
            p1: this.player1.getScore(),
            p2: this.player2.getScore()
        }
        const newScoreP2 = {
            p1: this.player2.getScore(),
            p2: this.player1.getScore()
        }
        this.player1.sendScore(newScoreP1);
        this.player2.sendScore(newScoreP2);
    }

    private isGameFinished(): boolean
    {
        return ((this.player1.getScore() >= this.pointsToWin)
            || (this.player2.getScore() >= this.pointsToWin))
    }

    private async saveGameData()
    {
        console.log("saving game data...");
        const updateScoreData = {
            user1: this.player1.getNickName(),
            user2: this.player2.getNickName(),
            score1: this.player1.getScore(),
            score2: this.player2.getScore()
        };
        try
        {
            //todo brut ip data has nothing to do here.
            console.log("attempting to save score:", updateScoreData);
            // const data = await fetch("http://localhost:3000/database/add_score", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(updateScoreData)
            // });
            // const res = await data.json();
            const res = await axios.post("http://backend:3000/database/add_score", updateScoreData);
            return (res);
        }
        catch (e)
        {
            console.log("ERROR HERE:", e);
            return (null);
        }
    }
}

class Ball {
    private currentInstance: Game;
    private x: number;
    private y: number;
    private xSpeed = 10;
    private ySpeed = 10;
    private playGroundHeight = 600;
    private playGroundWidth = 1000;
    private barHeight = 100;
    private barWidth = 10;
    private ballSize = 15;
    private a = 3;

    constructor(x: number, y: number, instance: Game) {
        this.x = x;
        this.y = y;
        this.currentInstance = instance;
    }

    public actualize()
    {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        this.checkForHappening();
    }

    private checkForHappening()
    {
        if (!this.isBallIn())
        {
            if (this.maybeBallTakeBar()) return;
            this.currentInstance.ballOut(this.x);
            return;
        }
        this.maybeBallTakeWall();
    }

    private maybeBallTakeWall(): boolean
    {
        if (this.y >= (this.playGroundHeight - 10 - (this.ballSize / 2))
            || this.y <= (10 + (this.ballSize / 2)))
        {
            this.takeWall();
            return (true);
        }
        return (false);
    }

    private maybeBallTakeBar(): boolean
    {
        //Condition for ball touching bar:
        //X: bar x is greater than (playGroundWidth - this.barWidth) or less than (this.barWidth)
        //Y: Absolute value of BallY - BarY is less than (BarHeight / 2)
        if ((Math.abs(this.currentInstance.getPlayer1Y() - this.y) <= (this.barHeight / 2)))
        {
            this.takeBar();
            return (true);
        }

        if ((Math.abs(this.currentInstance.getPlayer2Y() - this.y) <= (this.barHeight / 2)))
        {
            this.takeBar();
            return (true);
        }
        return (false);
    }

    private isBallIn() : boolean
    {
        //Check if ball still in the playground
        //We subtract barWith from playground width
        return (this.x <= (this.playGroundWidth - this.barWidth - (this.ballSize / 2))
            && this.x >= (this.barWidth + (this.ballSize / 2)));
    }

    public getX(): number {
        return (this.x);
    }

    public getY(): number {
        return (this.y);
    }

    public getPosition(): { x: number; y: number; } {
        return ({x: this.x, y: this.y});
    }

    public takeWall()
    {
        this.ySpeed = -this.ySpeed;
    }

    public takeBar()
    {
        //accelaration
        this.xSpeed += this.a;
        this.ySpeed += this.a;

        this.xSpeed = -this.xSpeed;
    }
}
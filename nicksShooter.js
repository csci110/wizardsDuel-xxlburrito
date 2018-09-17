import {game, Sprite} from "./sgc/sgc.js";

game.setBackground("universe.png"); 
//https://3c1703fe8d.site.internapcdn.net/newman/gfx/news/hires/2018/universe.jpg

class Laser extends Sprite{
    constructor() {
        super();
        this.speed = 300;
        this.height = 72;
        this.width = 72;
        this.defineAnimation("laser");
        this.playAnimation("laser", true);
    }
    handleBoundaryContact() {
        // delete laser when it leaves display area
        game.removeSprite(this);
    }
    handleCollision(otherSprite) {
        // Compare images so Sith's spells don't destroy each other.
        if (this.getImage() !== otherSprite.getImage()) {
        // Adjust mostly blank spell image to vertical center.
            let verticalOffset = Math.abs(this.y - otherSprite.y);
            if (verticalOffset < this.height / 2) {
                game.removeSprite(this);
                new Fireball(otherSprite);
            }
        }
        return false;
    }
}

class Rebel extends Sprite{
    constructor() {
        super();
        this.name = "X-Wing";
        this.setImage("xWing.png");
        this.width = 72;
        this.height = 72;
        this.x = 5;
        this.y = game.displayHeight - this.height - 1;
        this.speedWhenWalking = 250;
        this.spellCastTime = 0;
    }
    handleLeftArrowKey() {
        this.speed = this.speedWhenWalking;
        this.angle = 180;
    }
    handleRightArrowKey() {
        this.speed = this.speedWhenWalking;
        this.angle = 0;
    }
    handleGameLoop() {
        this.x = Math.max(5, this.x);
        this.x = Math.min(728, this.x);
    }
    handleSpacebar() {
        let now = game.getTime(); 
        // get the number of seconds since game start
        // if the current time is 2 or more seconds greater than 
        // the previous spellCastTime 
        if (now - this.spellCastTime >= 0.25) { 
        // reset the timer                               
            this.spellCastTime = now;
        // and shoot a laser 
            let laser = new Laser();
            laser.x = this.x; 
            // this sets the position of the laser object equal to 
            // the position of any object created from the Rebel class
            laser.y = this.y - 74; 
            laser.name = "Red laser";
            laser.setImage("redLaser.png");
            laser.angle = 90;
        }    
    }
}

let rebel = new Rebel();

class Sith extends Sprite{
    constructor() {
        super();
        this.name = "Tie fighter";
        this.setImage("tieFighter.png");
        this.width = 72;
        this.height = 72;
        this.x = game.displayWidth - 2 * this.width;
        this.y = 5;
        this.angle = 180;
        this.speed = 500;
    }
    handleGameLoop() {
        this.x = Math.max(1, this.x);
        this.x = Math.min(728, this.x);
        if (this.x <= 5) {
        // Left motion has reached left, so go right
            this.x = 5;
            this.angle = 0;
        }
        if (this.x >= game.displayWidth - this.width) {
        // Right motion has reached right, so go left
            this.x = game.displayWidth - this.width;
            this.angle = 180;
        }
        // random behavior
        if (Math.random() < 0.15) {
            let laser = new Laser();
            laser.x = this.x; 
            // this sets the position of the laser object equal to 
            // the position of any object created from the Rebel class
            laser.y = this.y + 72; 
            laser.name = "Green laser";
            laser.setImage("greenLaser.png");
            laser.angle = 270;
        }
    }
}

let sith = new Sith();

class Fireball extends Sprite {
    constructor(deadSprite) {
        super();
        this.x = deadSprite.x;
        this.y = deadSprite.y;
        this.setImage("explosionSheet.png");
        this.name = "Fireball";
        game.removeSprite(deadSprite);
        this.defineAnimation("explode", 0, 5);
        this.playAnimation("explode");
    }
    //https://thumbs.dreamstime.com/z/video-game-explosion-animation-pixel-art-frames-bomb-boom-flame-69425877.jpg
    handleAnimationEnd() {
        game.removeSprite(this);
        if (!game.isActiveSprite(sith)) {
            game.end("Congratulations!\n\nYou defeated the dark side!"
            + "\n\nRefresh the page to try again!");
        }
        if (!game.isActiveSprite(rebel)) {
            game.end("You have died :( Better luck next time." 
            + "\n\nRefresh the page button to try again!");
        }
    }
}
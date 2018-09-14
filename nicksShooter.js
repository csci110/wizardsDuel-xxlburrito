import {game, Sprite} from "./sgc/sgc.js";

game.setBackground("gray.png");

class Spell extends Sprite{
    constructor() {
        super();
        this.speed = 300;
        this.height = 48;
        this.width = 48;
        this.defineAnimation("magic", 0, 7);
        this.playAnimation("magic", true);
    }
    handleBoundaryContact() {
        // delete spell when it leaves display area
        game.removeSprite(this);
    }
    handleCollision(otherSprite) {
        // Compare images so Stranger's spells don't destroy each other.
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

class PlayerWizard extends Sprite{
    constructor() {
        super();
        this.name = "My glider";
        this.setImage("gliderSheet.png");
        this.width = 48;
        this.height = 48;
        this.x = this.width;
        this.y = game.displayHeight - this.height - 1;
        this.defineAnimation("move", 0, 15);
        this.speedWhenWalking = 250;
        this.spellCastTime = 0;
    }
    handleLeftArrowKey() {
        this.playAnimation("move");
        this.speed = this.speedWhenWalking;
        this.angle = 180;
    }
    handleRightArrowKey() {
        this.playAnimation("move");
        this.speed = this.speedWhenWalking;
        this.angle = 0;
    }
    handleGameLoop() {
        this.x = Math.max(5, this.x);
        this.x = Math.min(752, this.x);
    }
    handleSpacebar() {
        let now = game.getTime(); 
        // get the number of seconds since game start
        // if the current time is 2 or more seconds greater than 
        // the previous spellCastTime 
        if (now - this.spellCastTime >= 0.2) { 
        // reset the timer                               
            this.spellCastTime = now;
        // and cast a spell 
            let spell = new Spell();
            spell.x = this.x; 
            // this sets the position of the spell object equal to 
            // the position of any object created from the PlayerWizard class
            spell.y = this.y - 48; 
            spell.name = "Dot";
            spell.setImage("dot.png");
            this.playAnimation("move", false);
            spell.angle = 90;
        }    
    }
}

let marcus = new PlayerWizard();

class NonPlayerWizard extends Sprite{
    constructor() {
        super();
        this.name = "The mysterious stranger";
        this.setImage("gliderSheetRed.png");
        this.width = 48;
        this.height = 48;
        this.x = game.displayWidth - 2 * this.width;
        this.y = this.height;
        this.angle = 180;
        this.speed = 500;
        this.defineAnimation("move", 0, 15);
    }
    handleGameLoop() {
        this.x = Math.max(0, this.x);
        this.x = Math.min(752, this.x);
        if (this.x <= 5) {
        // Upward motion has reached top, so turn down
            this.x = 5;
            this.angle = 0;
            this.playAnimation("move");
        }
        if (this.x >= game.displayWidth - this.width) {
        // Downward motion has reached bottom, so turn up
            this.x = game.displayWidth - this.width;
            this.angle = 180;
            this.playAnimation("move");
        }
        // random behavior
        if (Math.random() < 0.15) {
            let spell = new Spell();
            spell.x = this.x; 
            // this sets the position of the spell object equal to 
            // the position of any object created from the PlayerWizard class
            spell.y = this.y + 48; 
            spell.name = "Bad dot";
            spell.setImage("otherDot.png");
            spell.angle = 270;
            this.playAnimation("move", false);
        }
    }
}

let stranger = new NonPlayerWizard();

class Fireball extends Sprite {
    constructor(deadSprite) {
        super();
        this.x = deadSprite.x;
        this.y = deadSprite.y;
        this.setImage("galaxySheet.png");
        this.name = "Galaxy";
        game.removeSprite(deadSprite);
        this.defineAnimation("explode", 0, 7);
        this.playAnimation("explode");
    }
    handleAnimationEnd() {
        game.removeSprite(this);
        if (!game.isActiveSprite(stranger)) {
            game.end("Congratulations!\n\nYour dot blew up the red glider!"
            + "\n\nPress 'Shift' and hit the refresh button to try again!");
        }
        if (!game.isActiveSprite(marcus)) {
            game.end("Your glider has been destroyed :(\n\nBetter luck next time." 
            + "\n\nPress 'Shift' and hit the refresh button to try again!");
        }
    }
}
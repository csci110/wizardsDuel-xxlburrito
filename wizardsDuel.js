import {game, Sprite} from "./sgc/sgc.js";

game.setBackground("floor.png");

class Spell extends Sprite{
    constructor() {
        super();
        this.speed = 200;
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
        this.name = "Marcus the Wizard";
        this.setImage("marcusSheet.png");
        this.width = 48;
        this.height = 48;
        this.x = this.width;
        this.y = this.height;
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("right", 3, 5);
        this.speedWhenWalking = 100;
        this.spellCastTime = 0;
    }
    handleDownArrowKey() {
        this.playAnimation("down");
        this.speed = this.speedWhenWalking;
        this.angle = 270;
    }
    handleUpArrowKey() {
        this.playAnimation("up");
        this.speed = this.speedWhenWalking;
        this.angle = 90;
    }
    handleGameLoop() {
        this.y = Math.max(5, this.y); // Keep Marcus in the display area
        this.y = Math.min(552, this.y);
    }
    handleSpacebar() {
        let now = game.getTime(); // get the number of seconds since game start
        // if the current time is 2 or more seconds greater than the previous spellCastTime 
        if (now - this.spellCastTime >= 2) { 
        // reset the timer                               
            this.spellCastTime = now;
        // and cast a spell 
            let spell = new Spell();
            spell.x = this.x + 48; 
            // this sets the position of the spell object equal to 
            // the position of any object created from the PlayerWizard class
            spell.y = this.y; 
            spell.name = "A spell cast by Marcus";
            spell.setImage("marcusSpellSheet.png");
            spell.angle = 0;
            this.playAnimation("right", false);
        }
    }
}

let marcus = new PlayerWizard();

class NonPlayerWizard extends Sprite{
    constructor() {
        super();
        this.name = "The mysterious stranger";
        this.setImage("strangerSheet.png");
        this.width = 48;
        this.height = 48;
        this.x = game.displayWidth - 2 * this.width;
        this.y = this.height;
        this.angle = 270;
        this.speed = 150;
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("left", 9, 11);
    }
    handleGameLoop() {
        this.y = Math.max(0, this.y);
        this.y = Math.min(552, this.y);
        if (this.y <= 0) {
        // Upward motion has reached top, so turn down
            this.y = 0;
            this.angle = 270;
            this.playAnimation("down");
        }
        if (this.y >= game.displayHeight - this.height) {
        // Downward motion has reached bottom, so turn up
            this.y = game.displayHeight - this.height;
            this.angle = 90;
            this.playAnimation("up");
        }
        // random behavior
        if (Math.random() < 0.01) {
            let spell = new Spell();
            spell.x = this.x - 48; 
            // this sets the position of the spell object equal to 
            // the position of any object created from the PlayerWizard class
            spell.y = this.y; 
            spell.name = "A spell cast by the stranger";
            spell.setImage("strangerSpellSheet.png");
            spell.angle = 180;
            this.playAnimation("left", false);
        }
    }
}

let stranger = new NonPlayerWizard();

class Fireball extends Sprite {
    constructor(deadSprite) {
        super();
        this.x = deadSprite.x;
        this.y = deadSprite.y;
        this.setImage("fireballSheet.png");
        this.name = "A ball of fire";
        game.removeSprite(deadSprite);
        this.defineAnimation("explode", 0, 7);
        this.playAnimation("explode");
    }
    handleAnimationEnd() {
        game.removeSprite(this);
        if (!game.isActiveSprite(stranger)) {
            game.end("Congratulations!\n\nMarcus has defeated the mysterious"
            + "\nstranger in the dark cloak!");
        }
        if (!game.isActiveSprite(marcus)) {
            game.end("Marcus is defeated by the mysterious\nstranger in "
            +"the dark cloak!\n\nBetter luck next time.");
        }
    }
}
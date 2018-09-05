import {game, Sprite} from "./sgc/sgc.js";

game.setBackground("floor.png");

class Spell extends Sprite{
    constructor() {
        super();
        this.speed = 200;
        this.height = 48;
        this.width = 48;
        this.defineAnimation("magic", 0, 7);
    }
    handleBoundaryContact() {
        // delete spell when it leaves display area
        game.removeSprite(this);
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
        this.y = this.y;
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("right", 3, 5);
        this.speedWhenWalking = 100;
        
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
        this.y = Math.max(0, this.y); // Keep Marcus in the display area
        this.y = Math.min(552, this.y);
    }
    handleSpaceBar() {
        let spell = new Spell();
        spell.x = this.x; // this sets the position of the spell object equal to 
        spell.y = this.y; // the position of any object created from the PlayerWizard class
        spell.name = "A spell cast by Marcus";
        spell.setImage("marcusSpellSheet.png");
        spell.angle = 0;
        spell.playAnimation("magic", true);
        spell.playAnimation("right", false);
    }
}

let marcus = new PlayerWizard();




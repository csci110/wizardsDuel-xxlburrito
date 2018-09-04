import {game, Sprite} from "./sgc/sgc.js";

game.setBackground("floor.png");

class PlayerWizard extends Sprite{
    constructor() {
        super();
        this.name = "Marcus the Wizard";
        this.setimage("marcusSheet.png");
        this.width = 48;
        this.height = 48;
        this.x = this.width;
        this.y = this.y;
    }
}

let marcus = new PlayerWizard();

// is there supposed to be a loader.js for this game?


import { GameState } from "./game_state.mjs";
import { distance } from "./utils.mjs";

export function updateHomes(game: GameState) {
    if (game.timer % 200 == 0) {
        game.homes.forEach(home => {
            let hasResources = false;
            game.resources.forEach(resource => {
                if (distance(home, resource) < game.homeRadius && !hasResources) {
                    game.money++;
                    game.totalMoney++;
                    resource.amount--;
                    hasResources = true;
                }
            }); 
            if (!hasResources) {
                home.hp = -999999;
                game.money += game.homeCost;
            }
        });
        game.resources = game.resources.filter(r => r.amount > 0);
        game.homes.filter(h => h.hp != -999999);
    }
}
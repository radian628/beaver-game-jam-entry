import { GameState } from "./game_state.mjs";

export function updateParticles(game: GameState) {
    game.particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.dx *= 0.97;
        p.dy *= 0.97;
        p.dx += Math.random() - 0.5;
        p.dy += Math.random() - 0.5;
        p.lifetimeRemaining -= 1;
    });
    game.particles = game.particles.filter(p => p.lifetimeRemaining > 0);
}
import { GameState, NoteType } from "./game_state.mjs";

export function updateNotes(game: GameState) {
    game.notes.forEach(n => {
        if (n.type == NoteType.TEXT) {
            n.lifetimeRemaining--;
            n.y -= 0.2;
        } else if (n.type == NoteType.RING) {
            n.radius += 6;
            n.lifetimeRemaining--;
        }
    });

    game.notes = game.notes.filter(note => note.lifetimeRemaining > 0);
}
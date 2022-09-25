import { getAllKeysDown, getMousePos, keycombo, rightMouseDown, setRightMouseDown, viewBottom, viewTopLeft, mousePosScreen } from "./controls.mjs";
import { enemyTextures, towerTextures, GameState, NoteType } from "./game_state.mjs";
import { getAngleToMouse } from "./tower_logic.mjs";
const imageCache = new Map<string, HTMLImageElement>();
const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

function drawOutlinedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}

export async function getimg(url: string): Promise<HTMLImageElement> {
    let img = imageCache.get(url);
    if (img) {
        return img;
    }
    let newimg = new Image();
    return new Promise((resolve, reject) => {
        newimg.onload = () => {
            imageCache.set(url, newimg);
            resolve(newimg);
        }
        newimg.src = url;
    });
}
export async function drawTitle(ctx: CanvasRenderingContext2D, game: GameState){
    ctx.fillStyle = "#00000022";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff99";
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, Math.min(canvas.height, canvas.width)/2, 0, 2*Math.PI);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    if((mousePosScreen.x-canvas.width/2) ** 2 + (mousePosScreen.y-canvas.height/2) ** 2 < (Math.min(canvas.width, canvas.height)/2)**2 && mousePosScreen.y > canvas.height/2){
        if(mousePosScreen.x > canvas.width/2){
            ctx.arc(canvas.width/2, canvas.height/2, Math.min(canvas.height, canvas.width)/2, 0, 0.5*Math.PI);
            ctx.fillStyle = "00FF00AA";
        }
        else{
            ctx.arc(canvas.width/2, canvas.height/2, Math.min(canvas.height, canvas.width)/2, 0.5*Math.PI, Math.PI);
            ctx.fillStyle = "FF0000AA";
        }
    }
    ctx.fill();
    ctx.closePath();
    ctx.textAlign = "center";
    ctx.font = "64px TexGyreAdventor";
    drawOutlinedText(ctx, "Control Freak", canvas.width/2, canvas.height/4);
    drawOutlinedText(ctx, "😃", canvas.width/2+Math.min(canvas.width,canvas.height)/4, canvas.height*3/4);
    drawOutlinedText(ctx, "😒", canvas.width/2-Math.min(canvas.width,canvas.height)/4, canvas.height*3/4);
    ctx.font = "40px TexGyreAdventor";
    drawOutlinedText(ctx, "A GAME by Adrian and Will", canvas.width/2, canvas.height/2.5);
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.moveTo(canvas.width/2 - Math.min(canvas.width, canvas.height)/2,canvas.height/2);
    ctx.lineTo(canvas.width/2 + Math.min(canvas.width, canvas.height)/2,canvas.height/2);
    ctx.stroke();
    ctx.moveTo(canvas.width/2,canvas.height/2);
    ctx.lineTo(canvas.width/2,canvas.height/2 + Math.min(canvas.width, canvas.height)/2);
    ctx.stroke();
    ctx.closePath();
}
export async function drawGame(ctx: CanvasRenderingContext2D, game: GameState){
    const sf = window.innerHeight/(viewBottom - viewTopLeft.y);
    const bg = document.getElementById("bg");
    if (bg) {
        bg.style.backgroundPosition = "" + (-viewTopLeft.x * sf) + "px " + (-viewTopLeft.y * sf) + "px";
        bg.style.backgroundSize = (600000/(viewBottom - viewTopLeft.y)) +"px";
    }
    ctx.scale(sf, sf);
    ctx.translate(-viewTopLeft.x, -viewTopLeft.y);
    ctx.font = "48px TexGyreAdventor";
    ctx.fillStyle = "red";
    game.towerProjectiles.forEach(t => {
        ctx.fillRect(t.x - 4, t.y - 4, 8, 8);
    });
    game.enemyProjectiles.forEach(t => {
        ctx.fillRect(t.x - 4, t.y - 4, 8, 8);
    });
    for (let t of game.towers) {
        //ctx.filter = `hue-rotate(${t.type * 75}deg)`;
        ctx.save();
        ctx.drawImage(await getimg(towerTextures[t.type].base), t.x - 25, t.y - 25, 50, 50);
        ctx.translate(t.x, t.y);
        const mouseAngle = getAngleToMouse(t.x, t.y);
        ctx.rotate(mouseAngle);
        ctx.drawImage(await getimg(towerTextures[t.type].cannon), -50, -25, 100, 50);
        const mousePos = getMousePos();
        ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(1, 30 / Math.hypot(mousePos.x - t.x, mousePos.y - t.y))})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, 30 / Math.hypot(mousePos.x - t.x, mousePos.y - t.y))})`;
        ctx.font = "32px TexGyreAdventor";
        ctx.textAlign = "center";
        ctx.lineWidth = 5;
        ctx.rotate(-mouseAngle);
        ctx.strokeText(t.fireKeys.join("+"), 0,10);
        ctx.fillText(t.fireKeys.join("+"), 0, 10);
        ctx.restore();

        ctx.lineWidth = 5;
        ctx.strokeStyle = "hsla(200, 75%, 75%, 0.6)";
        ctx.beginPath();
        ctx.arc(t.x, t.y, 45, 0, Math.PI * 2 * (1 - t.fireTimeRemaining / t.fireTimeCooldown));
        ctx.stroke();
    }
    for (let t of game.enemies) {
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.drawImage(await getimg(enemyTextures[t.type]), -25, -25, 50, 50);
        ctx.restore();
    }
    ctx.textAlign = "center";
    for (let t of game.resources) {
        ctx.save();
        ctx.translate(t.x, t.y);
        drawOutlinedText(ctx, "$", 0, 0);
        ctx.restore();


        ctx.lineWidth = 5;
        ctx.strokeStyle = "hsla(30, 75%, 75%, 0.6)";
        ctx.beginPath();
        ctx.arc(t.x, t.y, 45, 0, Math.PI * 2 * (t.amount / t.totalAmount));
        ctx.stroke();
    }
    for (let t of game.homes) {
        ctx.save();
        ctx.translate(t.x, t.y);
        drawOutlinedText(ctx, "H", 0, 0);
        ctx.restore();

        ctx.lineWidth = 5;
        ctx.strokeStyle = "hsla(170, 75%, 75%, 0.6)";
        ctx.beginPath();
        ctx.arc(t.x, t.y, 45, 0, Math.PI * 2 * (t.hp / t.maxHP));
        ctx.stroke();
    }
    ctx.textAlign = "center";
    for (let n of game.notes) {
        if (n.type == NoteType.TEXT) {
            ctx.globalAlpha = Math.min(1, n.lifetimeRemaining / 10);
            drawOutlinedText(ctx, n.text, n.x, n.y);
            ctx.globalAlpha = 1;
        } else if (n.type == NoteType.RING) {
            ctx.strokeStyle = "#ffffffaa";
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    ctx.textAlign = "left";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.lineWidth = 10;
    ctx.font = "48px TexGyreAdventor";
    drawOutlinedText(ctx, "$" + game.money, 10, 50);
    drawOutlinedText(ctx, "Score: " + game.totalMoney, 10, 100);
}


export function drawDeadScreen(ctx: CanvasRenderingContext2D, game: GameState) {
    ctx.textAlign = "center";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = "48px TexGyreAdventor";
    drawOutlinedText(ctx, "Game Over!", window.innerWidth / 2, window.innerHeight / 2);
    drawOutlinedText(ctx, `Final Score: ${game.totalMoney}`, window.innerWidth / 2, window.innerHeight / 2 + 50);
    drawOutlinedText(ctx, "Press any button to continue!", window.innerWidth/2, window.innerHeight*3/4)
}

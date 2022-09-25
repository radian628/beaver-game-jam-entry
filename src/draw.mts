const imageCache = new Map<string, HTMLImageElement>();
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
export function drawTitle(ctx){
    ctx.fillStyle = "#00000022";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#ffffffaa"
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2,Math.min(canvas.height, canvas.width)/2, 0, 2*Math.PI);
    ctx.fill();
    ctx.endPath();
}

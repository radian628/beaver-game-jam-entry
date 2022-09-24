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
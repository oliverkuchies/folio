
function buildCanvas() {
    const canvas = document.querySelector<HTMLCanvasElement>("#snake-canvas");

    if (!canvas) {
        throw new Error("Canvas not found for building Snake game")
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to build context");
    }

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 150, 75);    
}
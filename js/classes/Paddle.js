// Clase del Paddle
class Paddle {
    constructor(options = {}) {
        this.width = options.width || CONFIG.PADDLE_WIDTH;
        this.height = options.height || CONFIG.PADDLE_HEIGHT;
        this.x = options.x || (CONFIG.CANVAS_WIDTH - this.width) / 2;
        this.y = options.y || CONFIG.CANVAS_HEIGHT - CONFIG.PADDLE_Y_OFFSET;
        this.speed = options.speed || CONFIG.PADDLE_SPEED;
        
        // Control
        this.moveLeft = false;
        this.moveRight = false;
        this.targetX = this.x;
        
        // Colores
        this.color1 = options.color1 || '#667eea';
        this.color2 = options.color2 || '#764ba2';
    }
    
    update() {
        // Movimiento con teclado
        if (this.moveLeft) {
            this.x -= this.speed;
        }
        if (this.moveRight) {
            this.x += this.speed;
        }
        
        // Suavizado hacia posición del mouse
        const diff = this.targetX - this.x;
        if (Math.abs(diff) > 2) {
            this.x += diff * 0.15;
        }
        
        // Límites
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CONFIG.CANVAS_WIDTH) {
            this.x = CONFIG.CANVAS_WIDTH - this.width;
        }
    }
    
    draw(ctx) {
        // Sombra
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(102, 126, 234, 0.5)';
        
        // Gradiente
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, this.color1);
        gradient.addColorStop(1, this.color2);
        
        // Cuerpo del paddle
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 8);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Borde brillante superior
        ctx.beginPath();
        ctx.roundRect(this.x + 2, this.y + 2, this.width - 4, 4, 3);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
    
    setPosition(x) {
        this.targetX = x - this.width / 2;
    }
    
    reset() {
        this.x = (CONFIG.CANVAS_WIDTH - this.width) / 2;
        this.width = CONFIG.PADDLE_WIDTH;
    }
}
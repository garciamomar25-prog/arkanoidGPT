// Clase de Power-Up que cae
class PowerUpDrop {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = 30;
        this.height = 30;
        this.speed = CONFIG.POWERUP_SPEED;
        this.typeId = options.typeId || 'bonus';
        this.icon = options.icon || '★';
        this.color = options.color || '#FFD700';
        this.active = true;
        
        // Animación
        this.rotation = 0;
        this.pulse = 0;
    }
    
    update() {
        this.y += this.speed;
        this.rotation += 0.05;
        this.pulse += 0.1;
        
        // Verificar si salió de la pantalla
        if (this.y > CONFIG.CANVAS_HEIGHT) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Efecto de brillo pulsante
        const pulseSize = Math.sin(this.pulse) * 3;
        
        // Sombra y glow
        ctx.shadowBlur = 15 + pulseSize;
        ctx.shadowColor = this.color;
        
        // Círculo de fondo
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2 + pulseSize);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.7, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2 + pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Borde
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Icono
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, 0, 0);
        
        ctx.restore();
    }
    
    // Colisión con paddle
    checkCollision(paddle) {
        return (this.y + this.height / 2 >= paddle.y &&
                this.y - this.height / 2 <= paddle.y + paddle.height &&
                this.x + this.width / 2 >= paddle.x &&
                this.x - this.width / 2 <= paddle.x + paddle.width);
    }
}

// Clase Laser
class Laser {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 20;
        this.speed = 10;
        this.active = true;
    }
    
    update() {
        this.y -= this.speed;
        if (this.y < 0) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF00FF';
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#FF00FF');
        gradient.addColorStop(1, '#FF88FF');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }
    
    checkBrickCollision(brick) {
        if (!brick.active) return false;
        
        return (this.x >= brick.x &&
                this.x <= brick.x + brick.width &&
                this.y <= brick.y + brick.height &&
                this.y + this.height >= brick.y);
    }
}
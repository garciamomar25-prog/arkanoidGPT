// Clase de Bloque
class Brick {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || CONFIG.BRICK_WIDTH;
        this.height = options.height || CONFIG.BRICK_HEIGHT;
        this.type = options.type || 1;
        this.maxHits = options.maxHits || 1;
        this.hits = options.hits || 0;
        this.hasPowerup = options.hasPowerup || false;
        this.active = true;
        
        // Animación
        this.scale = 1;
        this.shakeX = 0;
        this.shakeY = 0;
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        const colors = CONFIG.BRICK_COLORS[this.type] || CONFIG.BRICK_COLORS[1];
        
        ctx.save();
        ctx.translate(this.x + this.width / 2 + this.shakeX, this.y + this.height / 2 + this.shakeY);
        ctx.scale(this.scale, this.scale);
        
        // Sombra
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors[0];
        
        // Gradiente
        const gradient = ctx.createLinearGradient(-this.width / 2, -this.height / 2, -this.width / 2, this.height / 2);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        
        // Cuerpo
        ctx.beginPath();
        ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 5);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Brillo superior
        ctx.beginPath();
        ctx.roundRect(-this.width / 2 + 3, -this.height / 2 + 3, this.width - 6, 6, 3);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        
        // Indicador de resistencia (cracks)
        if (this.maxHits > 1 && this.hits > 0) {
            const damage = this.hits / this.maxHits;
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.3 + damage * 0.4})`;
            ctx.lineWidth = 2;
            
            // Grietas
            if (damage >= 0.25) {
                ctx.beginPath();
                ctx.moveTo(-this.width / 4, -this.height / 4);
                ctx.lineTo(0, 0);
                ctx.stroke();
            }
            if (damage >= 0.5) {
                ctx.beginPath();
                ctx.moveTo(this.width / 4, -this.height / 4);
                ctx.lineTo(0, this.height / 4);
                ctx.stroke();
            }
            if (damage >= 0.75) {
                ctx.beginPath();
                ctx.moveTo(-this.width / 3, this.height / 4);
                ctx.lineTo(this.width / 6, 0);
                ctx.stroke();
            }
        }
        
        // Indicador de power-up
        if (this.hasPowerup) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('★', 0, 0);
        }
        
        // Indicador indestructible
        if (this.type === 'indestructible') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.width / 2 + 5, -this.height / 2 + 5, this.width - 10, this.height - 10);
        }
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        // Reducir shake
        this.shakeX *= 0.8;
        this.shakeY *= 0.8;
    }
    
    hit() {
        if (this.type === 'indestructible') {
            this.shake();
            return false;
        }
        
        this.hits++;
        this.shake();
        
        if (this.hits >= this.maxHits) {
            this.active = false;
            return true; // Destruido
        }
        
        return false;
    }
    
    shake() {
        this.shakeX = (Math.random() - 0.5) * 6;
        this.shakeY = (Math.random() - 0.5) * 6;
    }
    
    getPoints() {
        if (this.type === 'gold') return CONFIG.BRICK_POINTS.gold;
        if (this.type === 'powerup') return CONFIG.BRICK_POINTS.powerup;
        return CONFIG.BRICK_POINTS[this.maxHits] || 10;
    }
    
    getColor() {
        const colors = CONFIG.BRICK_COLORS[this.type] || CONFIG.BRICK_COLORS[1];
        return colors[0];
    }
}
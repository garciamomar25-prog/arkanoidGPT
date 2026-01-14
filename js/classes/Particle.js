// Clase de Partículas para efectos visuales
class Particle {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.dx = options.dx || (Math.random() - 0.5) * 8;
        this.dy = options.dy || (Math.random() - 0.5) * 8;
        this.radius = options.radius || Math.random() * 3 + 1;
        this.color = options.color || '#FFFFFF';
        this.alpha = options.alpha || 1;
        this.decay = options.decay || 0.02;
        this.gravity = options.gravity || 0.1;
        this.friction = options.friction || 0.98;
    }
    
    update() {
        this.dx *= this.friction;
        this.dy *= this.friction;
        this.dy += this.gravity;
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= this.decay;
    }
    
    draw(ctx) {
        if (this.alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    isDead() {
        return this.alpha <= 0;
    }
}

// Sistema de partículas
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.enabled = true;
    }
    
    // Explosión de bloque
    explode(x, y, color, count = 10) {
        if (!this.enabled) return;
        
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle({
                x: x,
                y: y,
                color: color,
                dx: (Math.random() - 0.5) * 10,
                dy: (Math.random() - 0.5) * 10,
                radius: Math.random() * 4 + 2
            }));
        }
    }
    
    // Efecto de impacto de bola
    impact(x, y, color = '#FFFFFF') {
        if (!this.enabled) return;
        
        for (let i = 0; i < 5; i++) {
            this.particles.push(new Particle({
                x: x,
                y: y,
                color: color,
                radius: Math.random() * 2 + 1,
                decay: 0.05
            }));
        }
    }
    
    // Efecto de power-up recolectado
    powerupCollect(x, y, color) {
        if (!this.enabled) return;
        
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            this.particles.push(new Particle({
                x: x,
                y: y,
                dx: Math.cos(angle) * 5,
                dy: Math.sin(angle) * 5,
                color: color,
                radius: 3,
                decay: 0.03,
                gravity: 0
            }));
        }
    }
    
    // Estela de la bola
    trail(x, y, color) {
        if (!this.enabled) return;
        
        this.particles.push(new Particle({
            x: x,
            y: y,
            dx: 0,
            dy: 0,
            color: color,
            radius: 4,
            decay: 0.1,
            gravity: 0
        }));
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
    
    clear() {
        this.particles = [];
    }
}
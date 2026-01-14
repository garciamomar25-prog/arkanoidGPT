// Clase de la Pelota
class Ball {
    constructor(options = {}) {
        this.x = options.x || CONFIG.CANVAS_WIDTH / 2;
        this.y = options.y || CONFIG.CANVAS_HEIGHT - 100;
        this.radius = options.radius || CONFIG.BALL_RADIUS;
        this.baseSpeed = options.speed || CONFIG.BALL_BASE_SPEED;
        this.dx = options.dx || this.baseSpeed * (Math.random() > 0.5 ? 1 : -1);
        this.dy = options.dy || -this.baseSpeed;
        
        // Skin
        this.skin = options.skin || Skins.getSelected();
        
        // Estados especiales
        this.fireball = false;
        this.sticky = false;
        this.stuckToPaddle = false;
        this.paddleOffset = 0;
        
        // Velocidad actual
        this.speedMultiplier = options.speedMultiplier || 1;
    }
    
    update(timeScale = 1) {
        if (this.stuckToPaddle) return;
        
        this.x += this.dx * timeScale;
        this.y += this.dy * timeScale;
    }
    
    draw(ctx) {
        // Renderizar con skin
        if (this.skin && typeof this.skin.render === 'function') {
            this.skin.render(ctx, this.x, this.y, this.radius);
        } else {
            // Fallback
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        }
        
        // Efecto de fuego si está activo
        if (this.fireball) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FF4500';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 69, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    
    // Colisión con paredes
    checkWallCollision() {
        // Pared izquierda
        if (this.x - this.radius <= 0) {
            this.x = this.radius;
            this.dx = Math.abs(this.dx);
            return 'left';
        }
        
        // Pared derecha
        if (this.x + this.radius >= CONFIG.CANVAS_WIDTH) {
            this.x = CONFIG.CANVAS_WIDTH - this.radius;
            this.dx = -Math.abs(this.dx);
            return 'right';
        }
        
        // Pared superior
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.dy = Math.abs(this.dy);
            return 'top';
        }
        
        return null;
    }
    
    // Colisión con paddle
    checkPaddleCollision(paddle) {
        if (this.dy < 0) return false; // Solo si va hacia abajo
        
        const paddleTop = paddle.y;
        const paddleBottom = paddle.y + paddle.height;
        const paddleLeft = paddle.x;
        const paddleRight = paddle.x + paddle.width;
        
        if (this.y + this.radius >= paddleTop &&
            this.y - this.radius <= paddleBottom &&
            this.x + this.radius >= paddleLeft &&
            this.x - this.radius <= paddleRight) {
            
            // Posición relativa de impacto (-1 a 1)
            const hitPos = (this.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            
            // Calcular ángulo de rebote
            const maxAngle = Math.PI / 3; // 60 grados máximo
            const angle = hitPos * maxAngle;
            
            // Mantener velocidad total
            const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            
            this.dx = Math.sin(angle) * speed;
            this.dy = -Math.abs(Math.cos(angle) * speed);
            
            // Ajustar posición para evitar atravesar
            this.y = paddleTop - this.radius;
            
            // Si es sticky, adherirse
            if (this.sticky && !this.stuckToPaddle) {
                this.stuckToPaddle = true;
                this.paddleOffset = this.x - (paddle.x + paddle.width / 2);
            }
            
            return true;
        }
        
        return false;
    }
    
    // Colisión con bloque
    checkBrickCollision(brick) {
        if (!brick.active) return false;
        
        const brickLeft = brick.x;
        const brickRight = brick.x + brick.width;
        const brickTop = brick.y;
        const brickBottom = brick.y + brick.height;
        
        // Verificar colisión
        if (this.x + this.radius > brickLeft &&
            this.x - this.radius < brickRight &&
            this.y + this.radius > brickTop &&
            this.y - this.radius < brickBottom) {
            
            // Si es fireball, no rebotar (a menos que sea indestructible)
            if (!this.fireball || brick.type === 'indestructible') {
                // Determinar lado de colisión
                const overlapLeft = this.x + this.radius - brickLeft;
                const overlapRight = brickRight - (this.x - this.radius);
                const overlapTop = this.y + this.radius - brickTop;
                const overlapBottom = brickBottom - (this.y - this.radius);
                
                const minOverlapX = Math.min(overlapLeft, overlapRight);
                const minOverlapY = Math.min(overlapTop, overlapBottom);
                
                if (minOverlapX < minOverlapY) {
                    this.dx = -this.dx;
                } else {
                    this.dy = -this.dy;
                }
            }
            
            return true;
        }
        
        return false;
    }
    
    // Verificar si cayó
    isOut() {
        return this.y - this.radius > CONFIG.CANVAS_HEIGHT;
    }
    
    // Adherir al paddle
    attachToPaddle(paddle) {
        this.x = paddle.x + paddle.width / 2 + this.paddleOffset;
        this.y = paddle.y - this.radius;
    }
    
    // Lanzar desde paddle
    launch() {
        if (this.stuckToPaddle) {
            this.stuckToPaddle = false;
            this.dy = -Math.abs(this.baseSpeed * this.speedMultiplier);
            this.dx = (Math.random() - 0.5) * this.baseSpeed;
        }
    }
    
    // Incrementar velocidad
    increaseSpeed(factor = 1.02) {
        const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        const maxSpeed = CONFIG.BALL_MAX_SPEED;
        
        if (currentSpeed < maxSpeed) {
            this.dx *= factor;
            this.dy *= factor;
        }
    }
    
    // Establecer velocidad
    setSpeed(multiplier) {
        this.speedMultiplier = multiplier;
        const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        const targetSpeed = this.baseSpeed * multiplier;
        const ratio = targetSpeed / currentSpeed;
        this.dx *= ratio;
        this.dy *= ratio;
    }
}
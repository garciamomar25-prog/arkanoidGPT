// Motor principal del juego
const Game = {
    canvas: null,
    ctx: null,
    state: CONFIG.STATES.MENU,
    
    // Entidades
    paddle: null,
    balls: [],
    bricks: [],
    powerupDrops: [],
    lasers: [],
    particleSystem: null,
    
    // Estado del juego
    currentLevel: 1,
    score: 0,
    lives: CONFIG.INITIAL_LIVES,
    multiplier: 1,
    consecutiveHits: 0,
    
    // Power-ups activos
    activePowerups: [],
    hasShield: false,
    hasLaser: false,
    timeScale: 1,
    laserCooldown: 0,
    
    // Estadísticas de partida
    sessionStats: {
        bricksDestroyed: 0,
        powerupsCollected: 0,
        startTime: 0
    },
    
    // Control
    keys: {},
    mouseX: 0,
    lastTime: 0,
    animationId: null,
    
    init() {
        // Configurar canvas
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        // Inicializar sistemas
        this.particleSystem = new ParticleSystem();
        AudioManager.init();
        UI.init();
        
        // Cargar opciones
        const data = Storage.load();
        AudioManager.enabled = data.soundEnabled;
        this.particleSystem.enabled = data.particlesEnabled;
        
        // Bind eventos
        this.bindEvents();
        
        // Iniciar loop de animación
        this.loop();
    },
    
    bindEvents() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === 'Escape') {
                if (this.state === CONFIG.STATES.PLAYING) {
                    this.pauseGame();
                } else if (this.state === CONFIG.STATES.PAUSED) {
                    this.resumeGame();
                }
            }
            
            if (e.key === ' ' || e.key === 'ArrowUp') {
                if (this.state === CONFIG.STATES.PLAYING) {
                    // Lanzar bola pegajosa
                    this.balls.forEach(ball => ball.launch());
                    
                    // Disparar láser
                    if (this.hasLaser && this.laserCooldown <= 0) {
                        this.fireLaser();
                    }
                }
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            this.mouseX = (e.clientX - rect.left) * scaleX;
        });
        
        this.canvas.addEventListener('click', () => {
            if (this.state === CONFIG.STATES.PLAYING) {
                this.balls.forEach(ball => ball.launch());
                
                if (this.hasLaser && this.laserCooldown <= 0) {
                    this.fireLaser();
                }
            }
        });
        
        // Touch
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            this.mouseX = (e.touches[0].clientX - rect.left) * scaleX;
        }, { passive: false });
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.state === CONFIG.STATES.PLAYING) {
                this.balls.forEach(ball => ball.launch());
            }
        });
    },
    
    startGame(level = null) {
        // Determinar nivel
        if (level) {
            this.currentLevel = level;
        } else {
            const data = Storage.load();
            this.currentLevel = data.highestLevel;
        }
        
        this.initLevel();
        this.state = CONFIG.STATES.PLAYING;
        UI.hideAllMenus();
        UI.showHUD(true);
        
        // Incrementar contador de partidas
        Storage.increment('totalGames');
    },
    
    initLevel() {
        const levelConfig = Levels.getLevel(this.currentLevel);
        
        // Resetear
        this.paddle = new Paddle();
        this.balls = [];
        this.powerupDrops = [];
        this.lasers = [];
        this.activePowerups = [];
        this.hasShield = false;
        this.hasLaser = false;
        this.timeScale = 1;
        this.laserCooldown = 0;
        this.multiplier = 1;
        this.consecutiveHits = 0;
        this.particleSystem.clear();
        
        // Crear bola inicial
        const skin = Skins.getSelected();
        const ball = new Ball({
            skin: skin,
            speedMultiplier: levelConfig.speedMultiplier
        });
        ball.stuckToPaddle = true;
        ball.paddleOffset = 0;
        this.balls.push(ball);
        
        // Generar bloques
        this.bricks = Levels.generateBricks(this.currentLevel);
        
        // Estadísticas de sesión
        this.sessionStats = {
            bricksDestroyed: 0,
            powerupsCollected: 0,
            startTime: Date.now()
        };
    },
    
    pauseGame() {
        this.state = CONFIG.STATES.PAUSED;
        UI.showMenu('pauseMenu');
    },
    
    resumeGame() {
        this.state = CONFIG.STATES.PLAYING;
        UI.hideAllMenus();
    },
    
    restartLevel() {
        this.score = 0;
        this.lives = CONFIG.INITIAL_LIVES;
        this.initLevel();
        this.state = CONFIG.STATES.PLAYING;
        UI.hideAllMenus();
        UI.showHUD(true);
    },
    
    quitToMenu() {
        this.state = CONFIG.STATES.MENU;
        UI.showHUD(false);
        UI.showMenu('mainMenu');
    },
    
    nextLevel() {
        if (this.currentLevel < Levels.getTotalLevels()) {
            this.currentLevel++;
            this.initLevel();
            this.state = CONFIG.STATES.PLAYING;
            UI.hideAllMenus();
        } else {
            // Juego completado!
            this.quitToMenu();
        }
    },
    
    loop(timestamp = 0) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update(deltaTime);
        this.render();
        
        this.animationId = requestAnimationFrame((t) => this.loop(t));
    },
    
    update(deltaTime) {
        if (this.state !== CONFIG.STATES.PLAYING) return;
        
        // Actualizar controles del paddle
        this.paddle.moveLeft = this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A'];
        this.paddle.moveRight = this.keys['ArrowRight'] || this.keys['d'] || this.keys['D'];
        this.paddle.setPosition(this.mouseX);
        this.paddle.update();
        
        // Actualizar bolas
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            
            if (ball.stuckToPaddle) {
                ball.attachToPaddle(this.paddle);
            } else {
                ball.update(this.timeScale);
                
                // Colisiones con paredes
                const wallHit = ball.checkWallCollision();
                if (wallHit) {
                    AudioManager.playBounce();
                    this.particleSystem.impact(ball.x, ball.y);
                }
                
                // Colisión con paddle
                if (ball.checkPaddleCollision(this.paddle)) {
                    AudioManager.playBounce();
                    this.particleSystem.impact(ball.x, ball.y, '#667eea');
                    this.consecutiveHits = 0;
                    this.multiplier = 1;
                }
                
                // Colisión con bloques
                for (const brick of this.bricks) {
                    if (ball.checkBrickCollision(brick)) {
                        this.hitBrick(brick);
                        
                        // Si no es fireball, solo un bloque por frame
                        if (!ball.fireball) break;
                    }
                }
                
                // Bola perdida
                if (ball.isOut()) {
                    // Verificar escudo
                    if (this.hasShield && this.balls.length <= 1) {
                        ball.y = CONFIG.CANVAS_HEIGHT - 100;
                        ball.dy = -Math.abs(ball.dy);
                        this.hasShield = false;
                        // Remover power-up de escudo
                        this.activePowerups = this.activePowerups.filter(p => p.typeId !== 'shield');
                    } else {
                        this.balls.splice(i, 1);
                        
                        if (this.balls.length === 0) {
                            this.loseLife();
                        }
                    }
                }
            }
        }
        
        // Actualizar power-up drops
        for (let i = this.powerupDrops.length - 1; i >= 0; i--) {
            const drop = this.powerupDrops[i];
            drop.update();
            
            if (drop.checkCollision(this.paddle)) {
                this.collectPowerup(drop);
                this.powerupDrops.splice(i, 1);
            } else if (!drop.active) {
                this.powerupDrops.splice(i, 1);
            }
        }
        
        // Actualizar láseres
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            laser.update();
            
            for (const brick of this.bricks) {
                if (laser.checkBrickCollision(brick)) {
                    this.hitBrick(brick);
                    laser.active = false;
                    break;
                }
            }
            
            if (!laser.active) {
                this.lasers.splice(i, 1);
            }
        }
        
        // Actualizar cooldown de láser
        if (this.laserCooldown > 0) {
            this.laserCooldown -= deltaTime;
        }
        
        // Actualizar power-ups activos
        const now = Date.now();
        for (let i = this.activePowerups.length - 1; i >= 0; i--) {
            const p = this.activePowerups[i];
            if (p.duration > 0 && now >= p.endTime) {
                // Remover efecto
                const type = PowerUps.getType(p.typeId);
                if (type.remove) type.remove(this);
                this.activePowerups.splice(i, 1);
            }
        }
        
        // Actualizar partículas
        this.particleSystem.update();
        
        // Actualizar HUD
        UI.updateHUD(this.score, this.multiplier, this.currentLevel, this.lives);
        UI.updateActivePowerups(this.activePowerups);
        
        // Verificar victoria
        const remainingBricks = this.bricks.filter(b => b.active && b.type !== 'indestructible').length;
        if (remainingBricks === 0) {
            this.levelComplete();
        }
        
        // Actualizar tiempo jugado
        Storage.increment('totalTimePlayedSeconds', deltaTime / 1000);
    },
    
    render() {
        const ctx = this.ctx;
        
        // Limpiar canvas con fondo
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // Fondo con gradiente
        const bgGradient = ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
        bgGradient.addColorStop(0, 'rgba(26, 26, 60, 0.8)');
        bgGradient.addColorStop(1, 'rgba(10, 10, 30, 0.9)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        if (this.state === CONFIG.STATES.PLAYING || 
            this.state === CONFIG.STATES.PAUSED ||
            this.state === CONFIG.STATES.VICTORY ||
            this.state === CONFIG.STATES.GAME_OVER) {
            
            // Dibujar escudo si está activo
            if (this.hasShield) {
                ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
                ctx.fillRect(0, CONFIG.CANVAS_HEIGHT - 5, CONFIG.CANVAS_WIDTH, 5);
            }
            
            // Dibujar bloques
            this.bricks.forEach(brick => brick.draw(ctx));
            
            // Dibujar power-up drops
            this.powerupDrops.forEach(drop => drop.draw(ctx));
            
            // Dibujar láseres
            this.lasers.forEach(laser => laser.draw(ctx));
            
            // Dibujar partículas
            this.particleSystem.draw(ctx);
            
            // Dibujar paddle
            this.paddle.draw(ctx);
            
            // Dibujar indicador de láser
            if (this.hasLaser) {
                ctx.fillStyle = '#FF00FF';
                ctx.fillRect(this.paddle.x + 5, this.paddle.y - 5, 5, 5);
                ctx.fillRect(this.paddle.x + this.paddle.width - 10, this.paddle.y - 5, 5, 5);
            }
            
            // Dibujar bolas
            this.balls.forEach(ball => ball.draw(ctx));
        }
    },
    
    hitBrick(brick) {
        const destroyed = brick.hit();
        
        if (destroyed) {
            // Puntos
            this.addScore(brick.getPoints());
            
            // Estadísticas
            this.sessionStats.bricksDestroyed++;
            Storage.increment('totalBricksDestroyed');
            
            // Efectos
            AudioManager.playBrickDestroy();
            this.particleSystem.explode(
                brick.x + brick.width / 2,
                brick.y + brick.height / 2,
                brick.getColor(),
                15
            );
            
            // Multiplicador
            this.consecutiveHits++;
            if (this.consecutiveHits >= 5) this.multiplier = 2;
            if (this.consecutiveHits >= 10) this.multiplier = 3;
            if (this.consecutiveHits >= 20) this.multiplier = 5;
            
            // Spawn power-up
            if (brick.hasPowerup || Math.random() < CONFIG.POWERUP_CHANCE) {
                const drop = PowerUps.createDrop(
                    brick.x + brick.width / 2,
                    brick.y + brick.height / 2
                );
                this.powerupDrops.push(drop);
            }
            
            // Incrementar velocidad ligeramente
            this.balls.forEach(ball => ball.increaseSpeed(1.005));
        } else {
            AudioManager.playBrickHit();
            this.particleSystem.impact(
                brick.x + brick.width / 2,
                brick.y + brick.height / 2,
                brick.getColor()
            );
        }
    },
    
    addScore(points) {
        this.score += points * this.multiplier;
    },
    
    collectPowerup(drop) {
        const type = PowerUps.getType(drop.typeId);
        
        AudioManager.playPowerup();
        this.particleSystem.powerupCollect(drop.x, drop.y, drop.color);
        
        // Aplicar efecto
        type.apply(this);
        
        // Si tiene duración, añadir a activos
        if (type.duration > 0) {
            // Remover si ya existe
            this.activePowerups = this.activePowerups.filter(p => p.typeId !== drop.typeId);
            
            this.activePowerups.push({
                typeId: drop.typeId,
                duration: type.duration,
                endTime: Date.now() + type.duration
            });
        }
        
        // Estadísticas
        this.sessionStats.powerupsCollected++;
        Storage.increment('totalPowerupsCollected');
    },
    
    fireLaser() {
        const leftLaser = new Laser(this.paddle.x + 10, this.paddle.y);
        const rightLaser = new Laser(this.paddle.x + this.paddle.width - 10, this.paddle.y);
        this.lasers.push(leftLaser, rightLaser);
        AudioManager.playLaser();
        this.laserCooldown = 200; // ms entre disparos
    },
    
    loseLife() {
        this.lives--;
        AudioManager.playLoseLife();
        
        Storage.increment('totalDeaths');
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Resetear para nueva vida
            this.resetBall();
        }
    },
    
    resetBall() {
        // Limpiar power-ups con duración
        this.activePowerups.forEach(p => {
            const type = PowerUps.getType(p.typeId);
            if (type.remove) type.remove(this);
        });
        this.activePowerups = [];
        this.hasShield = false;
        this.hasLaser = false;
        this.timeScale = 1;
        
        // Nueva bola
        this.balls = [];
        const skin = Skins.getSelected();
        const levelConfig = Levels.getLevel(this.currentLevel);
        const ball = new Ball({
            skin: skin,
            speedMultiplier: levelConfig.speedMultiplier
        });
        ball.stuckToPaddle = true;
        ball.paddleOffset = 0;
        this.balls.push(ball);
        
        // Reset multiplicador
        this.multiplier = 1;
        this.consecutiveHits = 0;
        
        // Reset paddle
        this.paddle.reset();
    },
    
    levelComplete() {
        this.state = CONFIG.STATES.VICTORY;
        AudioManager.playVictory();
        
        const timeSpent = Math.floor((Date.now() - this.sessionStats.startTime) / 1000);
        
        // Calcular estrellas (basado en vidas restantes y puntuación)
        let stars = 1;
        if (this.lives >= 2) stars = 2;
        if (this.lives >= 3) stars = 3;
        
        // Guardar progreso
        const unlocks = Storage.completeLevel(this.currentLevel, this.score, stars);
        
        // Mostrar pantalla de victoria
        UI.showVictory({
            score: this.score,
            bricksDestroyed: this.sessionStats.bricksDestroyed,
            powerupsCollected: this.sessionStats.powerupsCollected,
            time: timeSpent
        });
        
        // Mostrar desbloqueos
        unlocks.forEach(skin => {
            setTimeout(() => UI.showUnlockNotification(skin), 1000);
        });
    },
    
    gameOver() {
        this.state = CONFIG.STATES.GAME_OVER;
        AudioManager.playGameOver();
        
        UI.showGameOver({
            score: this.score,
            level: this.currentLevel,
            bricksDestroyed: this.sessionStats.bricksDestroyed
        });
        
        // Guardar high score si aplica
        const data = Storage.load();
        if (this.score > data.highScore) {
            Storage.update('highScore', this.score);
        }
    }
};

// Iniciar cuando carga la página
window.addEventListener('load', () => {
    Game.init();
});
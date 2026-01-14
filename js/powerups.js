// Sistema de Power-ups
const PowerUps = {
    types: {
        multiball: {
            name: 'Multi-Bola',
            icon: '⚪',
            color: '#FFFFFF',
            duration: 0, // Instantáneo
            description: 'Añade 2 bolas extra',
            apply: function(game) {
                const mainBall = game.balls[0];
                if (!mainBall) return;
                
                for (let i = 0; i < 2; i++) {
                    const newBall = new Ball({
                        x: mainBall.x,
                        y: mainBall.y,
                        radius: mainBall.radius,
                        skin: mainBall.skin
                    });
                    
                    const angle = (Math.random() - 0.5) * Math.PI / 2;
                    const speed = Math.sqrt(mainBall.dx * mainBall.dx + mainBall.dy * mainBall.dy);
                    newBall.dx = Math.sin(angle) * speed;
                    newBall.dy = -Math.abs(Math.cos(angle) * speed);
                    
                    game.balls.push(newBall);
                }
            }
        },
        
        fireball: {
            name: 'Bola de Fuego',
            icon: '🔥',
            color: '#FF4500',
            duration: 8000,
            description: 'La bola atraviesa bloques',
            apply: function(game) {
                game.balls.forEach(ball => {
                    ball.fireball = true;
                });
            },
            remove: function(game) {
                game.balls.forEach(ball => {
                    ball.fireball = false;
                });
            }
        },
        
        expand: {
            name: 'Paddle Grande',
            icon: '↔️',
            color: '#00FF00',
            duration: 12000,
            description: 'Aumenta el tamaño del paddle',
            apply: function(game) {
                game.paddle.width = CONFIG.PADDLE_WIDTH * 1.5;
            },
            remove: function(game) {
                game.paddle.width = CONFIG.PADDLE_WIDTH;
            }
        },
        
        shrink: {
            name: 'Paddle Pequeño',
            icon: '↕️',
            color: '#FF0000',
            duration: 8000,
            description: 'Reduce el tamaño del paddle',
            apply: function(game) {
                game.paddle.width = CONFIG.PADDLE_WIDTH * 0.6;
            },
            remove: function(game) {
                game.paddle.width = CONFIG.PADDLE_WIDTH;
            }
        },
        
        slowmo: {
            name: 'Cámara Lenta',
            icon: '⏱️',
            color: '#87CEEB',
            duration: 6000,
            description: 'Ralentiza el tiempo',
            apply: function(game) {
                game.timeScale = 0.5;
            },
            remove: function(game) {
                game.timeScale = 1;
            }
        },
        
        shield: {
            name: 'Escudo',
            icon: '🛡️',
            color: '#FFD700',
            duration: 15000,
            description: 'Protege el fondo',
            apply: function(game) {
                game.hasShield = true;
            },
            remove: function(game) {
                game.hasShield = false;
            }
        },
        
        laser: {
            name: 'Láser',
            icon: '💥',
            color: '#FF00FF',
            duration: 10000,
            description: 'Dispara a los bloques',
            apply: function(game) {
                game.hasLaser = true;
            },
            remove: function(game) {
                game.hasLaser = false;
                game.lasers = [];
            }
        },
        
        sticky: {
            name: 'Pegajosa',
            icon: '🫛',
            color: '#9932CC',
            duration: 10000,
            description: 'La bola se adhiere al paddle',
            apply: function(game) {
                game.balls.forEach(ball => {
                    ball.sticky = true;
                });
            },
            remove: function(game) {
                game.balls.forEach(ball => {
                    ball.sticky = false;
                    ball.stuckToPaddle = false;
                });
            }
        },
        
        extralife: {
            name: 'Vida Extra',
            icon: '❤️',
            color: '#FF69B4',
            duration: 0,
            description: '+1 Vida',
            apply: function(game) {
                game.lives = Math.min(game.lives + 1, 5);
            }
        },
        
        bonus: {
            name: 'Bonus',
            icon: '⭐',
            color: '#FFD700',
            duration: 0,
            description: '+500 puntos',
            apply: function(game) {
                game.addScore(500);
            }
        }
    },
    
    // Obtener tipo aleatorio (excluyendo shrink con probabilidad)
    getRandomType() {
        const types = Object.keys(this.types);
        // Reducir probabilidad de shrink
        const filtered = types.filter(t => {
            if (t === 'shrink') return Math.random() < 0.3;
            return true;
        });
        return filtered[Math.floor(Math.random() * filtered.length)];
    },
    
    // Obtener información del tipo
    getType(typeId) {
        return this.types[typeId] || this.types.bonus;
    },
    
    // Crear drop de power-up
    createDrop(x, y) {
        const typeId = this.getRandomType();
        const type = this.getType(typeId);
        
        return new PowerUpDrop({
            x: x,
            y: y,
            typeId: typeId,
            icon: type.icon,
            color: type.color
        });
    }
};
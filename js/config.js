// Configuración global del juego
const CONFIG = {
    // Canvas
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 700,
    
    // Paddle
    PADDLE_WIDTH: 120,
    PADDLE_HEIGHT: 15,
    PADDLE_SPEED: 10,
    PADDLE_Y_OFFSET: 50,
    
    // Ball
    BALL_RADIUS: 10,
    BALL_BASE_SPEED: 6,
    BALL_MAX_SPEED: 12,
    
    // Bricks
    BRICK_ROWS: 6,
    BRICK_COLS: 12,
    BRICK_WIDTH: 65,
    BRICK_HEIGHT: 25,
    BRICK_PADDING: 5,
    BRICK_OFFSET_TOP: 80,
    BRICK_OFFSET_LEFT: 35,
    
    // Game
    INITIAL_LIVES: 3,
    POWERUP_CHANCE: 0.2,
    POWERUP_SPEED: 3,
    POWERUP_DURATION: 10000,
    
    // Scoring
    BRICK_POINTS: {
        1: 10,   // Normal
        2: 25,   // Medio
        3: 50,   // Duro
        4: 100,  // Muy duro
        'gold': 200,
        'powerup': 50
    },
    
    // Estados del juego
    STATES: {
        MENU: 'menu',
        LEVEL_SELECT: 'level_select',
        SKINS: 'skins',
        STATS: 'stats',
        OPTIONS: 'options',
        PLAYING: 'playing',
        PAUSED: 'paused',
        VICTORY: 'victory',
        GAME_OVER: 'game_over'
    },
    
    // Colores de bloques por resistencia
    BRICK_COLORS: {
        1: ['#FF6B6B', '#FF8E8E'],
        2: ['#4ECDC4', '#6EE7DF'],
        3: ['#45B7D1', '#67D4ED'],
        4: ['#96CEB4', '#B8E6CC'],
        'gold': ['#FFD700', '#FFEC8B'],
        'silver': ['#C0C0C0', '#E8E8E8'],
        'powerup': ['#FF00FF', '#FF66FF'],
        'indestructible': ['#333333', '#555555']
    },
    
    // Tipos de power-ups
    POWERUP_TYPES: [
        'multiball',
        'fireball',
        'expand',
        'shrink',
        'slowmo',
        'shield',
        'laser',
        'sticky',
        'extralife',
        'bonus'
    ]
};

// Hacer CONFIG global e inmutable
Object.freeze(CONFIG);
Object.freeze(CONFIG.STATES);
Object.freeze(CONFIG.BRICK_POINTS);
Object.freeze(CONFIG.BRICK_COLORS);
Object.freeze(CONFIG.POWERUP_TYPES);
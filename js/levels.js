// Configuración de los 15 niveles
const Levels = {
    // Cada nivel define: patron de bloques, velocidad base, modificadores
    // Tipos de bloque: 0=vacío, 1-4=resistencia, 'g'=gold, 'p'=powerup, 'x'=indestructible
    
    levels: [
        // Nivel 1: Introducción simple
        {
            name: "Iniciación",
            speedMultiplier: 1.0,
            pattern: [
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 1, 1, 1, 'p', 1, 1, 'p', 1, 1, 1, 0],
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            ]
        },
        
        // Nivel 2: Filas alternas
        {
            name: "Rayas",
            speedMultiplier: 1.0,
            pattern: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 'p', 1, 1, 'p', 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            ]
        },
        
        // Nivel 3: Pirámide
        {
            name: "Pirámide",
            speedMultiplier: 1.05,
            pattern: [
                [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
                [0, 0, 0, 2, 2, 'g', 'g', 2, 2, 0, 0, 0],
                [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                [0, 2, 2, 2, 2, 'p', 'p', 2, 2, 2, 2, 0],
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            ]
        },
        
        // Nivel 4: Tablero de ajedrez
        {
            name: "Ajedrez",
            speedMultiplier: 1.05,
            pattern: [
                [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0],
                [0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
                [1, 0, 2, 0, 'p', 0, 0, 'p', 2, 0, 1, 0],
                [0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
                [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0],
                [0, 2, 0, 1, 0, 'g', 'g', 0, 1, 0, 2, 0],
                [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0],
            ]
        },
        
        // Nivel 5: Fortaleza
        {
            name: "Fortaleza",
            speedMultiplier: 1.1,
            pattern: [
                [3, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 3],
                [3, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 3],
                [3, 0, 0, 2, 'p', 1, 1, 'p', 2, 0, 0, 3],
                [3, 0, 0, 2, 1, 'g', 'g', 1, 2, 0, 0, 3],
                [3, 0, 0, 2, 1, 1, 1, 1, 2, 0, 0, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            ]
        },
        
        // Nivel 6: Corazón
        {
            name: "Corazón",
            speedMultiplier: 1.1,
            pattern: [
                [0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0],
                [2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 'p', 'p', 2, 2, 2, 2, 2],
                [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
                [0, 0, 2, 2, 2, 'g', 'g', 2, 2, 2, 0, 0],
                [0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                [0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
            ]
        },
        
        // Nivel 7: Muralla con huecos
        {
            name: "Muralla",
            speedMultiplier: 1.15,
            pattern: [
                [3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3],
                [3, 2, 2, 3, 0, 'p', 'p', 0, 3, 2, 2, 3],
                [3, 2, 2, 3, 0, 0, 0, 0, 3, 2, 2, 3],
                [3, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 3],
                [3, 2, 2, 2, 2, 'g', 'g', 2, 2, 2, 2, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            ]
        },
        
        // Nivel 8: Espiral
        {
            name: "Espiral",
            speedMultiplier: 1.15,
            pattern: [
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2],
                [2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2],
                [2, 0, 'g', 'g', 'p', 'p', 'g', 'g', 0, 2, 0, 2],
                [2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2],
                [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            ]
        },
        
        // Nivel 9: Diamante
        {
            name: "Diamante",
            speedMultiplier: 1.2,
            pattern: [
                [0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 3, 2, 2, 3, 0, 0, 0, 0],
                [0, 0, 0, 3, 2, 1, 1, 2, 3, 0, 0, 0],
                [0, 0, 3, 2, 1, 'g', 'g', 1, 2, 3, 0, 0],
                [0, 0, 0, 3, 2, 'p', 'p', 2, 3, 0, 0, 0],
                [0, 0, 0, 0, 3, 2, 2, 3, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0],
            ]
        },
        
        // Nivel 10: Calavera
        {
            name: "Calavera",
            speedMultiplier: 1.2,
            pattern: [
                [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
                [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
                [3, 3, 0, 0, 3, 3, 3, 3, 0, 0, 3, 3],
                [3, 3, 0, 'p', 3, 3, 3, 3, 'p', 0, 3, 3],
                [3, 3, 3, 3, 3, 'g', 'g', 3, 3, 3, 3, 3],
                [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
                [0, 0, 3, 0, 3, 0, 0, 3, 0, 3, 0, 0],
            ]
        },
        
        // Nivel 11: Bunker
        {
            name: "Bunker",
            speedMultiplier: 1.25,
            pattern: [
                ['x', 'x', 'x', 'x', 0, 0, 0, 0, 'x', 'x', 'x', 'x'],
                ['x', 3, 3, 'x', 0, 0, 0, 0, 'x', 3, 3, 'x'],
                ['x', 3, 2, 'x', 0, 'p', 'p', 0, 'x', 2, 3, 'x'],
                ['x', 2, 1, 'x', 0, 'g', 'g', 0, 'x', 1, 2, 'x'],
                ['x', 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
            ]
        },
        
        // Nivel 12: Zigzag
        {
            name: "Zigzag",
            speedMultiplier: 1.25,
            pattern: [
                [4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 4, 3, 2, 1, 'p', 0, 0, 0, 0, 0],
                [0, 0, 0, 4, 3, 2, 1, 'g', 0, 0, 0, 0],
                [0, 0, 0, 0, 4, 3, 2, 1, 'p', 0, 0, 0],
                [0, 0, 0, 0, 0, 4, 3, 2, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 3, 2, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 4, 3, 2, 1, 0],
            ]
        },
        
        // Nivel 13: Invasión
        {
            name: "Invasión",
            speedMultiplier: 1.3,
            pattern: [
                [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
                [0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0],
                [0, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 0],
                [3, 3, 'p', 3, 3, 0, 0, 3, 3, 'p', 3, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [0, 3, 3, 3, 3, 'g', 'g', 3, 3, 3, 3, 0],
                [0, 3, 0, 0, 0, 3, 3, 0, 0, 0, 3, 0],
                [0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0],
            ]
        },
        
        // Nivel 14: Laberinto
        {
            name: "Laberinto",
            speedMultiplier: 1.35,
            pattern: [
                [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
                [4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4],
                [4, 0, 4, 'p', 0, 0, 0, 0, 'g', 4, 0, 4],
                [4, 0, 4, 0, 4, 4, 4, 4, 0, 4, 0, 4],
                [4, 0, 4, 0, 4, 'g', 'g', 4, 0, 4, 0, 4],
                [4, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 4],
                [4, 4, 4, 0, 4, 0, 0, 4, 0, 4, 4, 4],
                [4, 'p', 0, 0, 0, 0, 0, 0, 0, 0, 'p', 4],
                [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            ]
        },
        
        // Nivel 15: Jefe Final
        {
            name: "Jefe Final",
            speedMultiplier: 1.4,
            pattern: [
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'x'],
                ['x', 4, 3, 3, 3, 'g', 'g', 3, 3, 3, 4, 'x'],
                ['x', 4, 3, 2, 2, 2, 2, 2, 2, 3, 4, 'x'],
                ['x', 4, 3, 2, 'p', 1, 1, 'p', 2, 3, 4, 'x'],
                ['x', 4, 3, 2, 1, 'g', 'g', 1, 2, 3, 4, 'x'],
                ['x', 4, 3, 2, 'p', 1, 1, 'p', 2, 3, 4, 'x'],
                ['x', 4, 3, 2, 2, 2, 2, 2, 2, 3, 4, 'x'],
                ['x', 4, 3, 3, 3, 'g', 'g', 3, 3, 3, 4, 'x'],
                ['x', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
            ]
        }
    ],
    
    // Obtener configuración de nivel
    getLevel(levelNum) {
        const index = Math.max(0, Math.min(levelNum - 1, this.levels.length - 1));
        return this.levels[index];
    },
    
    // Obtener total de niveles
    getTotalLevels() {
        return this.levels.length;
    },
    
    // Generar bloques desde patrón
    generateBricks(levelNum) {
        const level = this.getLevel(levelNum);
        const bricks = [];
        const pattern = level.pattern;
        
        const startX = CONFIG.BRICK_OFFSET_LEFT;
        const startY = CONFIG.BRICK_OFFSET_TOP;
        
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                const cell = pattern[row][col];
                
                if (cell === 0) continue;
                
                const x = startX + col * (CONFIG.BRICK_WIDTH + CONFIG.BRICK_PADDING);
                const y = startY + row * (CONFIG.BRICK_HEIGHT + CONFIG.BRICK_PADDING);
                
                let brick = {
                    x: x,
                    y: y,
                    width: CONFIG.BRICK_WIDTH,
                    height: CONFIG.BRICK_HEIGHT,
                    type: cell,
                    hits: 0
                };
                
                // Determinar resistencia según tipo
                switch (cell) {
                    case 1: brick.maxHits = 1; break;
                    case 2: brick.maxHits = 2; break;
                    case 3: brick.maxHits = 3; break;
                    case 4: brick.maxHits = 4; break;
                    case 'g': brick.maxHits = 2; brick.type = 'gold'; break;
                    case 'p': brick.maxHits = 1; brick.type = 'powerup'; brick.hasPowerup = true; break;
                    case 'x': brick.maxHits = Infinity; brick.type = 'indestructible'; break;
                }
                
                bricks.push(new Brick(brick));
            }
        }
        
        return bricks;
    }
};
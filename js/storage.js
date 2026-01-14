// Sistema de almacenamiento con localStorage
const Storage = {
    STORAGE_KEY: 'arkanoid_pro_save',
    
    defaultData: {
        // Progreso
        highestLevel: 1,
        completedLevels: [],
        levelStars: {},
        
        // Puntuaciones
        highScore: 0,
        highScores: [],
        totalScore: 0,
        
        // Estadísticas
        totalGames: 0,
        totalBricksDestroyed: 0,
        totalPowerupsCollected: 0,
        totalDeaths: 0,
        totalTimePlayedSeconds: 0,
        
        // Skins
        unlockedSkins: ['classic', 'neon', 'fire', 'ice'],
        selectedSkin: 'classic',
        
        // Opciones
        soundEnabled: true,
        musicEnabled: true,
        particlesEnabled: true
    },
    
    // Cargar datos
    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                // Merge con defaults para nuevas propiedades
                return { ...this.defaultData, ...data };
            }
        } catch (e) {
            console.error('Error loading save data:', e);
        }
        return { ...this.defaultData };
    },
    
    // Guardar datos
    save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    },
    
    // Actualizar campo específico
    update(field, value) {
        const data = this.load();
        data[field] = value;
        return this.save(data);
    },
    
    // Incrementar estadística
    increment(field, amount = 1) {
        const data = this.load();
        if (typeof data[field] === 'number') {
            data[field] += amount;
            return this.save(data);
        }
        return false;
    },
    
    // Completar nivel
    completeLevel(levelNum, score, stars) {
        const data = this.load();
        
        // Marcar como completado
        if (!data.completedLevels.includes(levelNum)) {
            data.completedLevels.push(levelNum);
        }
        
        // Desbloquear siguiente nivel
        if (levelNum >= data.highestLevel && levelNum < 15) {
            data.highestLevel = levelNum + 1;
        }
        
        // Guardar estrellas (máximo)
        const currentStars = data.levelStars[levelNum] || 0;
        if (stars > currentStars) {
            data.levelStars[levelNum] = stars;
        }
        
        // Actualizar puntuación máxima
        if (score > data.highScore) {
            data.highScore = score;
        }
        
        // Añadir a high scores
        data.highScores.push({
            score: score,
            level: levelNum,
            date: new Date().toISOString()
        });
        
        // Mantener solo top 10
        data.highScores.sort((a, b) => b.score - a.score);
        data.highScores = data.highScores.slice(0, 10);
        
        // Añadir a total
        data.totalScore += score;
        
        this.save(data);
        
        // Verificar desbloqueos de skins
        return this.checkSkinUnlocks(data);
    },
    
    // Verificar desbloqueos de skins
    checkSkinUnlocks(data) {
        const newUnlocks = [];
        const skins = Skins.getAllSkins();
        
        for (const skin of skins) {
            if (data.unlockedSkins.includes(skin.id)) continue;
            
            let unlocked = false;
            
            switch (skin.requirement.type) {
                case 'levels':
                    unlocked = data.completedLevels.length >= skin.requirement.value;
                    break;
                case 'score':
                    unlocked = data.highScore >= skin.requirement.value;
                    break;
                case 'bricks':
                    unlocked = data.totalBricksDestroyed >= skin.requirement.value;
                    break;
                case 'powerups':
                    unlocked = data.totalPowerupsCollected >= skin.requirement.value;
                    break;
                case 'perfect':
                    // Completar nivel sin perder vidas
                    break;
            }
            
            if (unlocked) {
                data.unlockedSkins.push(skin.id);
                newUnlocks.push(skin);
            }
        }
        
        if (newUnlocks.length > 0) {
            this.save(data);
        }
        
        return newUnlocks;
    },
    
    // Desbloquear skin manualmente
    unlockSkin(skinId) {
        const data = this.load();
        if (!data.unlockedSkins.includes(skinId)) {
            data.unlockedSkins.push(skinId);
            this.save(data);
            return true;
        }
        return false;
    },
    
    // Seleccionar skin
    selectSkin(skinId) {
        const data = this.load();
        if (data.unlockedSkins.includes(skinId)) {
            data.selectedSkin = skinId;
            this.save(data);
            return true;
        }
        return false;
    },
    
    // Resetear progreso
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        return this.load();
    },
    
    // Obtener opción
    getOption(option) {
        const data = this.load();
        return data[option];
    },
    
    // Establecer opción
    setOption(option, value) {
        return this.update(option, value);
    }
};
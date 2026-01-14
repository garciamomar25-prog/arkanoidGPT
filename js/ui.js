// Sistema de UI y Menús
const UI = {
    elements: {},
    
    init() {
        // Cachear elementos
        this.elements = {
            mainMenu: document.getElementById('main-menu'),
            levelSelect: document.getElementById('level-select'),
            skinsMenu: document.getElementById('skins-menu'),
            statsMenu: document.getElementById('stats-menu'),
            optionsMenu: document.getElementById('options-menu'),
            pauseMenu: document.getElementById('pause-menu'),
            victoryScreen: document.getElementById('victory-screen'),
            gameoverScreen: document.getElementById('gameover-screen'),
            hud: document.getElementById('game-hud'),
            activePowerups: document.getElementById('active-powerups'),
            
            // HUD
            hudScore: document.getElementById('hud-score'),
            hudMultiplier: document.getElementById('hud-multiplier'),
            hudLevel: document.getElementById('hud-level'),
            hudLives: document.getElementById('hud-lives'),
            
            // Grids
            levelsGrid: document.getElementById('levels-grid'),
            skinsGrid: document.getElementById('skins-grid'),
            statsContent: document.getElementById('stats-content'),
            highscoresList: document.getElementById('highscores-list'),
            victoryStats: document.getElementById('victory-stats'),
            gameoverStats: document.getElementById('gameover-stats')
        };
        
        this.bindEvents();
    },
    
    bindEvents() {
        // Menú principal
        document.getElementById('btn-play').addEventListener('click', () => {
            AudioManager.playClick();
            Game.startGame();
        });
        
        document.getElementById('btn-levels').addEventListener('click', () => {
            AudioManager.playClick();
            this.showMenu('levelSelect');
            this.renderLevels();
        });
        
        document.getElementById('btn-skins').addEventListener('click', () => {
            AudioManager.playClick();
            this.showMenu('skinsMenu');
            this.renderSkins();
        });
        
        document.getElementById('btn-stats').addEventListener('click', () => {
            AudioManager.playClick();
            this.showMenu('statsMenu');
            this.renderStats();
        });
        
        document.getElementById('btn-options').addEventListener('click', () => {
            AudioManager.playClick();
            this.showMenu('optionsMenu');
            this.updateOptionsUI();
        });
        
        // Botones de volver
        document.getElementById('btn-back-levels').addEventListener('click', () => {
            AudioManager.playClick();
            this.showMenu('mainMenu');
        });
        
        document.getElementById('btn-back-skins').addEventListener('click', () => {
            AudioManager.playClick();
            this.showMenu('mainMenu');
        });
        
        document.getElementById('btn-back-stats').addEventListener('click', () => {
            AudioManager.playClick();
            this.showMenu('mainMenu');
        });
        
        document.getElementById('btn-back-options').addEventListener('click', () => {
            AudioManager.playClick();
            this.showMenu('mainMenu');
        });
        
        // Pausa
        document.getElementById('btn-resume').addEventListener('click', () => {
            AudioManager.playClick();
            Game.resumeGame();
        });
        
        document.getElementById('btn-restart').addEventListener('click', () => {
            AudioManager.playClick();
            Game.restartLevel();
        });
        
        document.getElementById('btn-quit').addEventListener('click', () => {
            AudioManager.playClick();
            Game.quitToMenu();
        });
        
        // Victoria
        document.getElementById('btn-next-level').addEventListener('click', () => {
            AudioManager.playClick();
            Game.nextLevel();
        });
        
        document.getElementById('btn-victory-menu').addEventListener('click', () => {
            AudioManager.playClick();
            Game.quitToMenu();
        });
        
        // Game Over
        document.getElementById('btn-retry').addEventListener('click', () => {
            AudioManager.playClick();
            Game.restartLevel();
        });
        
        document.getElementById('btn-gameover-menu').addEventListener('click', () => {
            AudioManager.playClick();
            Game.quitToMenu();
        });
        
        // Opciones
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            AudioManager.toggle(e.target.checked);
            Storage.setOption('soundEnabled', e.target.checked);
            if (e.target.checked) AudioManager.playClick();
        });
        
        document.getElementById('music-toggle').addEventListener('change', (e) => {
            AudioManager.musicEnabled = e.target.checked;
            Storage.setOption('musicEnabled', e.target.checked);
        });
        
        document.getElementById('particles-toggle').addEventListener('change', (e) => {
            Game.particleSystem.enabled = e.target.checked;
            Storage.setOption('particlesEnabled', e.target.checked);
        });
        
        document.getElementById('btn-reset-progress').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres borrar todo tu progreso?')) {
                Storage.reset();
                AudioManager.playClick();
                alert('Progreso borrado');
                this.updateOptionsUI();
            }
        });
    },
    
    showMenu(menuName) {
        // Ocultar todos los menús
        Object.values(this.elements).forEach(el => {
            if (el && el.classList && el.classList.contains('menu')) {
                el.classList.remove('active');
            }
        });
        
        // Mostrar el menú solicitado
        if (this.elements[menuName]) {
            this.elements[menuName].classList.add('active');
        }
    },
    
    hideAllMenus() {
        Object.values(this.elements).forEach(el => {
            if (el && el.classList && el.classList.contains('menu')) {
                el.classList.remove('active');
            }
        });
    },
    
    showHUD(show) {
        if (show) {
            this.elements.hud.classList.add('active');
        } else {
            this.elements.hud.classList.remove('active');
        }
    },
    
    updateHUD(score, multiplier, level, lives) {
        this.elements.hudScore.textContent = `Puntos: ${score.toLocaleString()}`;
        this.elements.hudMultiplier.textContent = `x${multiplier}`;
        this.elements.hudLevel.textContent = `Nivel ${level}`;
        this.elements.hudLives.textContent = '❤️'.repeat(Math.max(0, lives));
    },
    
    renderLevels() {
        const data = Storage.load();
        let html = '';
        
        for (let i = 1; i <= 15; i++) {
            const isUnlocked = i <= data.highestLevel;
            const isCompleted = data.completedLevels.includes(i);
            const stars = data.levelStars[i] || 0;
            
            let className = 'level-btn';
            if (!isUnlocked) className += ' locked';
            if (isCompleted) className += ' completed';
            
            html += `
                <button class="${className}" data-level="${i}" ${!isUnlocked ? 'disabled' : ''}>
                    ${isUnlocked ? i : '🔒'}
                    <span class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>
                </button>
            `;
        }
        
        this.elements.levelsGrid.innerHTML = html;
        
        // Bind click events
        this.elements.levelsGrid.querySelectorAll('.level-btn:not(.locked)').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = parseInt(btn.dataset.level);
                AudioManager.playClick();
                Game.startGame(level);
            });
        });
    },
    
    renderSkins() {
        const data = Storage.load();
        const allSkins = Skins.getAllSkins();
        let html = '';
        
        allSkins.forEach(skin => {
            const isUnlocked = data.unlockedSkins.includes(skin.id);
            const isSelected = data.selectedSkin === skin.id;
            
            let className = 'skin-card';
            if (!isUnlocked) className += ' locked';
            if (isSelected) className += ' selected';
            
            // Crear preview canvas
            const previewId = `preview-${skin.id}`;
            
            html += `
                <div class="${className}" data-skin="${skin.id}">
                    <canvas id="${previewId}" class="skin-preview" width="60" height="60"></canvas>
                    <span class="skin-name">${skin.name}</span>
                    ${!isUnlocked && skin.requirement.text ? `<span class="skin-requirement">🔒 ${skin.requirement.text}</span>` : ''}
                    ${isUnlocked && isSelected ? '<span class="skin-requirement">✔️ Equipada</span>' : ''}
                </div>
            `;
        });
        
        this.elements.skinsGrid.innerHTML = html;
        
        // Renderizar previews
        allSkins.forEach(skin => {
            const canvas = document.getElementById(`preview-${skin.id}`);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, 60, 60);
                skin.render(ctx, 30, 30, 20);
            }
        });
        
        // Bind click events
        this.elements.skinsGrid.querySelectorAll('.skin-card:not(.locked)').forEach(card => {
            card.addEventListener('click', () => {
                const skinId = card.dataset.skin;
                Storage.selectSkin(skinId);
                AudioManager.playClick();
                this.renderSkins();
            });
        });
    },
    
    renderStats() {
        const data = Storage.load();
        
        const stats = [
            { label: 'Puntuación Máxima', value: data.highScore.toLocaleString() },
            { label: 'Puntuación Total', value: data.totalScore.toLocaleString() },
            { label: 'Niveles Completados', value: `${data.completedLevels.length}/15` },
            { label: 'Partidas Jugadas', value: data.totalGames },
            { label: 'Bloques Destruidos', value: data.totalBricksDestroyed.toLocaleString() },
            { label: 'Power-ups Recolectados', value: data.totalPowerupsCollected },
            { label: 'Skins Desbloqueadas', value: `${data.unlockedSkins.length}/${Skins.getAllSkins().length}` },
            { label: 'Tiempo Jugado', value: this.formatTime(data.totalTimePlayedSeconds) }
        ];
        
        let html = '';
        stats.forEach(stat => {
            html += `
                <div class="stat-item">
                    <div class="value">${stat.value}</div>
                    <div class="label">${stat.label}</div>
                </div>
            `;
        });
        this.elements.statsContent.innerHTML = html;
        
        // High scores
        let hsHtml = '';
        data.highScores.slice(0, 10).forEach((hs, i) => {
            hsHtml += `
                <div class="highscore-item">
                    <span>#${i + 1}</span>
                    <span>${hs.score.toLocaleString()}</span>
                    <span>Nivel ${hs.level}</span>
                </div>
            `;
        });
        this.elements.highscoresList.innerHTML = hsHtml || '<p style="color:#888;text-align:center">Sin puntuaciones aún</p>';
    },
    
    updateOptionsUI() {
        const data = Storage.load();
        document.getElementById('sound-toggle').checked = data.soundEnabled;
        document.getElementById('music-toggle').checked = data.musicEnabled;
        document.getElementById('particles-toggle').checked = data.particlesEnabled;
    },
    
    showVictory(stats) {
        this.elements.victoryStats.innerHTML = `
            <p>Puntuación: <span class="highlight">${stats.score.toLocaleString()}</span></p>
            <p>Bloques destruidos: ${stats.bricksDestroyed}</p>
            <p>Power-ups: ${stats.powerupsCollected}</p>
            <p>Tiempo: ${this.formatTime(stats.time)}</p>
        `;
        this.showMenu('victoryScreen');
    },
    
    showGameOver(stats) {
        this.elements.gameoverStats.innerHTML = `
            <p>Puntuación: <span class="highlight">${stats.score.toLocaleString()}</span></p>
            <p>Nivel alcanzado: ${stats.level}</p>
            <p>Bloques destruidos: ${stats.bricksDestroyed}</p>
        `;
        this.showMenu('gameoverScreen');
    },
    
    updateActivePowerups(powerups) {
        let html = '';
        powerups.forEach(p => {
            const type = PowerUps.getType(p.typeId);
            const remaining = Math.max(0, (p.endTime - Date.now()) / p.duration * 100);
            html += `
                <div class="powerup-indicator" title="${type.name}">
                    ${type.icon}
                    <div class="timer" style="width: ${remaining}%"></div>
                </div>
            `;
        });
        this.elements.activePowerups.innerHTML = html;
    },
    
    showUnlockNotification(skin) {
        const notification = document.createElement('div');
        notification.className = 'unlock-notification';
        notification.innerHTML = `
            <h3>🎉 ¡Skin Desbloqueada!</h3>
            <p>${skin.name}</p>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        
        if (h > 0) {
            return `${h}h ${m}m`;
        } else if (m > 0) {
            return `${m}m ${s}s`;
        } else {
            return `${s}s`;
        }
    }
};
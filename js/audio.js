// Sistema de audio con Web Audio API
const AudioManager = {
    ctx: null,
    enabled: true,
    musicEnabled: true,
    
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },
    
    // Generar sonido sintético
    playTone(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.enabled || !this.ctx) return;
        
        try {
            // Resumir contexto si está suspendido
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            
            const oscillator = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.ctx.destination);
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
            
            oscillator.start(this.ctx.currentTime);
            oscillator.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Ignorar errores de audio
        }
    },
    
    // Sonidos del juego
    playBounce() {
        this.playTone(440, 0.1, 'square', 0.2);
    },
    
    playBrickHit() {
        this.playTone(600, 0.1, 'square', 0.2);
    },
    
    playBrickDestroy() {
        this.playTone(800, 0.15, 'square', 0.25);
        setTimeout(() => this.playTone(1000, 0.1, 'square', 0.2), 50);
    },
    
    playPowerup() {
        this.playTone(523, 0.1, 'sine', 0.3);
        setTimeout(() => this.playTone(659, 0.1, 'sine', 0.3), 100);
        setTimeout(() => this.playTone(784, 0.15, 'sine', 0.3), 200);
    },
    
    playLoseLife() {
        this.playTone(200, 0.3, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(150, 0.3, 'sawtooth', 0.2), 200);
    },
    
    playGameOver() {
        this.playTone(300, 0.2, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(250, 0.2, 'sawtooth', 0.3), 200);
        setTimeout(() => this.playTone(200, 0.3, 'sawtooth', 0.3), 400);
    },
    
    playVictory() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.2, 'sine', 0.3), i * 150);
        });
    },
    
    playLaser() {
        this.playTone(1200, 0.05, 'square', 0.15);
    },
    
    playClick() {
        this.playTone(700, 0.05, 'square', 0.15);
    },
    
    toggle(enabled) {
        this.enabled = enabled;
    }
};
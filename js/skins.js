// Sistema de skins para la pelota
const Skins = {
    skins: [
        // Skins disponibles desde el inicio
        {
            id: 'classic',
            name: 'Clásica',
            unlocked: true,
            requirement: { type: 'none', value: 0 },
            render: function(ctx, x, y, radius) {
                const gradient = ctx.createRadialGradient(x - radius/3, y - radius/3, 0, x, y, radius);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.5, '#DDDDDD');
                gradient.addColorStop(1, '#AAAAAA');
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.strokeStyle = '#888888';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        },
        {
            id: 'neon',
            name: 'Neón',
            unlocked: true,
            requirement: { type: 'none', value: 0 },
            render: function(ctx, x, y, radius) {
                // Glow effect
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#00FFFF';
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.5, '#00FFFF');
                gradient.addColorStop(1, '#0088AA');
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                ctx.shadowBlur = 0;
            }
        },
        {
            id: 'fire',
            name: 'Fuego',
            unlocked: true,
            requirement: { type: 'none', value: 0 },
            render: function(ctx, x, y, radius) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#FF4500';
                
                const gradient = ctx.createRadialGradient(x, y - radius/2, 0, x, y, radius);
                gradient.addColorStop(0, '#FFFF00');
                gradient.addColorStop(0.4, '#FF8C00');
                gradient.addColorStop(0.8, '#FF4500');
                gradient.addColorStop(1, '#8B0000');
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                ctx.shadowBlur = 0;
            }
        },
        {
            id: 'ice',
            name: 'Hielo',
            unlocked: true,
            requirement: { type: 'none', value: 0 },
            render: function(ctx, x, y, radius) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#87CEEB';
                
                const gradient = ctx.createRadialGradient(x - radius/3, y - radius/3, 0, x, y, radius);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.3, '#E0FFFF');
                gradient.addColorStop(0.7, '#87CEEB');
                gradient.addColorStop(1, '#4169E1');
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Crystal effect
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.shadowBlur = 0;
            }
        },
        // Skins desbloqueables
        {
            id: 'galaxy',
            name: 'Galaxia',
            unlocked: false,
            requirement: { type: 'levels', value: 3, text: 'Completa 3 niveles' },
            render: function(ctx, x, y, radius) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#9400D3';
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.3, '#9400D3');
                gradient.addColorStop(0.6, '#4B0082');
                gradient.addColorStop(1, '#000033');
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Stars
                ctx.fillStyle = '#FFFFFF';
                for (let i = 0; i < 5; i++) {
                    const angle = (i / 5) * Math.PI * 2;
                    const dist = radius * 0.5;
                    const sx = x + Math.cos(angle + Date.now() * 0.002) * dist;
                    const sy = y + Math.sin(angle + Date.now() * 0.002) * dist;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.shadowBlur = 0;
            }
        },
        {
            id: 'rainbow',
            name: 'Arcoíris',
            unlocked: false,
            requirement: { type: 'levels', value: 5, text: 'Completa 5 niveles' },
            render: function(ctx, x, y, radius) {
                const time = Date.now() * 0.003;
                const hue = (time * 50) % 360;
                
                ctx.shadowBlur = 15;
                ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.5, `hsl(${hue}, 100%, 60%)`);
                gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 40%)`);
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                ctx.shadowBlur = 0;
            }
        },
        {
            id: 'plasma',
            name: 'Plasma',
            unlocked: false,
            requirement: { type: 'score', value: 5000, text: 'Alcanza 5,000 puntos' },
            render: function(ctx, x, y, radius) {
                const time = Date.now() * 0.005;
                
                ctx.shadowBlur = 25;
                ctx.shadowColor = '#FF00FF';
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.3, '#FF00FF');
                gradient.addColorStop(0.6, '#8800FF');
                gradient.addColorStop(1, '#4400AA');
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Plasma rings
                ctx.strokeStyle = `rgba(255, 0, 255, ${0.3 + Math.sin(time) * 0.2})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, radius * (0.8 + Math.sin(time) * 0.2), 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.shadowBlur = 0;
            }
        },
        {
            id: 'gold',
            name: 'Oro',
            unlocked: false,
            requirement: { type: 'score', value: 15000, text: 'Alcanza 15,000 puntos' },
            render: function(ctx, x, y, radius) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#FFD700';
                
                const gradient = ctx.createRadialGradient(x - radius/3, y - radius/3, 0, x, y, radius);
                gradient.addColorStop(0, '#FFFACD');
                gradient.addColorStop(0.3, '#FFD700');
                gradient.addColorStop(0.7, '#DAA520');
                gradient.addColorStop(1, '#B8860B');
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Shine
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(x - radius/3, y - radius/3, radius/4, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.shadowBlur = 0;
            }
        },
        {
            id: 'toxic',
            name: 'Tóxica',
            unlocked: false,
            requirement: { type: 'bricks', value: 200, text: 'Destruye 200 bloques' },
            render: function(ctx, x, y, radius) {
                const time = Date.now() * 0.004;
                
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#00FF00';
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, '#ADFF2F');
                gradient.addColorStop(0.5, '#32CD32');
                gradient.addColorStop(1, '#006400');
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Bubbles
                ctx.fillStyle = 'rgba(173, 255, 47, 0.5)';
                for (let i = 0; i < 3; i++) {
                    const bx = x + Math.cos(time + i * 2) * radius * 0.4;
                    const by = y + Math.sin(time + i * 2) * radius * 0.4;
                    ctx.beginPath();
                    ctx.arc(bx, by, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.shadowBlur = 0;
            }
        },
        {
            id: 'diamond',
            name: 'Diamante',
            unlocked: false,
            requirement: { type: 'levels', value: 15, text: 'Completa todos los niveles' },
            render: function(ctx, x, y, radius) {
                const time = Date.now() * 0.002;
                
                ctx.shadowBlur = 25;
                ctx.shadowColor = '#00BFFF';
                
                // Multi-color shimmer
                const gradient = ctx.createRadialGradient(x - radius/4, y - radius/4, 0, x, y, radius);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.2, '#E0FFFF');
                gradient.addColorStop(0.5, '#00BFFF');
                gradient.addColorStop(0.8, '#1E90FF');
                gradient.addColorStop(1, '#0000CD');
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Sparkles
                ctx.fillStyle = '#FFFFFF';
                for (let i = 0; i < 4; i++) {
                    const angle = (i / 4) * Math.PI * 2 + time;
                    const dist = radius * 0.6;
                    const sx = x + Math.cos(angle) * dist;
                    const sy = y + Math.sin(angle) * dist;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.shadowBlur = 0;
            }
        }
    ],
    
    // Obtener todas las skins
    getAllSkins() {
        return this.skins;
    },
    
    // Obtener skin por ID
    getSkin(id) {
        return this.skins.find(s => s.id === id) || this.skins[0];
    },
    
    // Verificar si está desbloqueada
    isUnlocked(id) {
        const data = Storage.load();
        return data.unlockedSkins.includes(id);
    },
    
    // Obtener skin seleccionada
    getSelected() {
        const data = Storage.load();
        return this.getSkin(data.selectedSkin);
    }
};
import { useRef, useEffect } from 'react';

// F1 Team colors - historical spectrum
const F1_COLORS = [
    '#E10600', // Ferrari Red
    '#FF8000', // McLaren Papaya
    '#00D2BE', // Mercedes Teal
    '#1E41FF', // Red Bull Blue
    '#006F62', // Aston Martin Green
    '#0090FF', // Alpine Blue
    '#B6BABD', // Silver
    '#FFD700', // Lotus Gold
    '#FFFFFF', // Williams White
];

class Particle {
    constructor(canvas, color) {
        this.canvas = canvas;
        this.color = color;
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * this.canvas.width;
        this.y = initial ? Math.random() * this.canvas.height : -20;
        this.size = 1 + Math.random() * 2;
        this.speedY = 0.15 + Math.random() * 0.25;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.alpha = 0.2 + Math.random() * 0.3;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.01 + Math.random() * 0.01;
    }

    update(time, mouseX, mouseY) {
        this.wobble += this.wobbleSpeed;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.wobble) * 0.2;

        // Gentle mouse repulsion
        if (mouseX !== null && mouseY !== null) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (1 - dist / 120) * 0.8;
                this.x += (dx / dist) * force;
                this.y += (dy / dist) * force;
            }
        }

        if (this.y > this.canvas.height + 20) this.reset();
        if (this.x < -20) this.x = this.canvas.width + 20;
        if (this.x > this.canvas.width + 20) this.x = -20;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
    }
}

export default function ParticleCanvas({ particleCount = 200 }) {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: null, y: null });
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Create particles with random team colors
            particlesRef.current = [];
            for (let i = 0; i < particleCount; i++) {
                const color = F1_COLORS[Math.floor(Math.random() * F1_COLORS.length)];
                particlesRef.current.push(new Particle(canvas, color));
            }
        };

        const onMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const onMouseLeave = () => {
            mouseRef.current = { x: null, y: null };
        };

        const animate = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;

            particlesRef.current.forEach(p => {
                p.update(time, mouseRef.current.x, mouseRef.current.y);
                p.draw(ctx);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
            cancelAnimationFrame(animationRef.current);
        };
    }, [particleCount]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
}

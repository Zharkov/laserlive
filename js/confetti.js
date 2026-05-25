/**
 * CONFETTI — взрыв розовых конфетти.
 * Вызывается через window.LaserConfetti.fire()
 */
(function () {
  'use strict';

  const COLORS = ['#ff3d8f', '#ff6fb0', '#ff9ec9', '#c084fc', '#ff7e6b', '#f7c873', '#a855f7'];
  const SHAPES = ['square', 'circle', 'rect'];

  let canvas = null;
  let ctx = null;
  let particles = [];
  let animationId = null;

  const initCanvas = () => {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  };

  const resize = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createParticle = (x, y) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 8 + Math.random() * 12;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 8, // лёгкий толчок вверх
      gravity: 0.35,
      friction: 0.98,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      opacity: 1,
      lifetime: 0,
      maxLifetime: 100 + Math.random() * 60,
    };
  };

  const drawParticle = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    }
    ctx.restore();
  };

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((p) => {
      p.vx *= p.friction;
      p.vy = p.vy * p.friction + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.lifetime++;

      // Угасание во второй половине жизни
      if (p.lifetime > p.maxLifetime * 0.6) {
        p.opacity = 1 - (p.lifetime - p.maxLifetime * 0.6) / (p.maxLifetime * 0.4);
      }

      const alive = p.lifetime < p.maxLifetime && p.y < canvas.height + 50;
      if (alive) drawParticle(p);
      return alive;
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(animationId);
      animationId = null;
      // Очищаем canvas из DOM чтобы не висел зря
      setTimeout(() => {
        if (canvas && particles.length === 0) {
          canvas.remove();
          canvas = null;
          ctx = null;
        }
      }, 100);
    }
  };

  const fire = (x, y, count = 80) => {
    // Уважаем настройки пользователя
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    initCanvas();

    // Если координаты не заданы — центр экрана, чуть ниже формы
    const fx = x ?? window.innerWidth / 2;
    const fy = y ?? window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(fx, fy));
    }

    if (!animationId) {
      animationId = requestAnimationFrame(tick);
    }
  };

  // Публичный API
  window.LaserConfetti = { fire };
})();

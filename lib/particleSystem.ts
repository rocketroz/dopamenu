'use client';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  hue: number;
}

export interface ParticleSystemConfig {
  particleCount: number;
  colors: string[];
  maxRadius: number;
  minRadius: number;
  attractStrength: number;
  repelStrength: number;
  friction: number;
  returnForce: number;
  glowIntensity: number;
}

const DEFAULT_CONFIG: ParticleSystemConfig = {
  particleCount: 300,
  colors: ['#E85A4F', '#1B998B', '#F4C95D', '#EAEAEA', '#FF6B6B', '#4ECDC4'],
  maxRadius: 6,
  minRadius: 2,
  attractStrength: 0.08,
  repelStrength: 0.15,
  friction: 0.96,
  returnForce: 0.02,
  glowIntensity: 20,
};

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private config: ParticleSystemConfig;
  private width: number = 0;
  private height: number = 0;
  private animationId: number | null = null;
  private interactionPoints: { x: number; y: number; strength: number; isAttract: boolean }[] = [];
  private trailPoints: { x: number; y: number; age: number }[] = [];

  constructor(canvas: HTMLCanvasElement, config: Partial<ParticleSystemConfig> = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.resize();
    this.initParticles();
  }

  private resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private initParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(x?: number, y?: number): Particle {
    const posX = x ?? Math.random() * this.width;
    const posY = y ?? Math.random() * this.height;
    const hue = Math.random() * 360;

    return {
      x: posX,
      y: posY,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: this.config.minRadius + Math.random() * (this.config.maxRadius - this.config.minRadius),
      baseRadius: this.config.minRadius + Math.random() * (this.config.maxRadius - this.config.minRadius),
      color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
      alpha: 0.6 + Math.random() * 0.4,
      life: 1,
      maxLife: 1,
      hue,
    };
  }

  public setInteractionPoints(points: { x: number; y: number; strength: number; isAttract: boolean }[]) {
    this.interactionPoints = points;
  }

  public addTrailPoint(x: number, y: number) {
    this.trailPoints.push({ x, y, age: 0 });
    // Limit trail length
    if (this.trailPoints.length > 50) {
      this.trailPoints.shift();
    }
  }

  public clearTrail() {
    this.trailPoints = [];
  }

  private update() {
    // Age trail points
    this.trailPoints = this.trailPoints
      .map(p => ({ ...p, age: p.age + 1 }))
      .filter(p => p.age < 30);

    this.particles.forEach((particle) => {
      // Apply interaction forces
      this.interactionPoints.forEach((point) => {
        const dx = point.x * this.width - particle.x;
        const dy = point.y * this.height - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance && distance > 0) {
          const force = (1 - distance / maxDistance) * point.strength;
          const angle = Math.atan2(dy, dx);

          if (point.isAttract) {
            // Attract - particles flow toward hand
            particle.vx += Math.cos(angle) * force * this.config.attractStrength;
            particle.vy += Math.sin(angle) * force * this.config.attractStrength;
            // Increase size when attracted
            particle.radius = particle.baseRadius * (1 + force * 0.5);
          } else {
            // Repel - particles push away from hand
            particle.vx -= Math.cos(angle) * force * this.config.repelStrength;
            particle.vy -= Math.sin(angle) * force * this.config.repelStrength;
            // Decrease size when repelled
            particle.radius = particle.baseRadius * (1 - force * 0.3);
          }
        }
      });

      // Trail influence - particles are attracted to finger trails
      this.trailPoints.forEach((trailPoint) => {
        const dx = trailPoint.x * this.width - particle.x;
        const dy = trailPoint.y * this.height - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;
        const strength = 1 - trailPoint.age / 30;

        if (distance < maxDistance && distance > 0) {
          const force = (1 - distance / maxDistance) * strength * 0.02;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force;
          particle.vy += Math.sin(angle) * force;
        }
      });

      // Apply friction
      particle.vx *= this.config.friction;
      particle.vy *= this.config.friction;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Soft boundary wrapping
      const margin = 50;
      if (particle.x < -margin) particle.x = this.width + margin;
      if (particle.x > this.width + margin) particle.x = -margin;
      if (particle.y < -margin) particle.y = this.height + margin;
      if (particle.y > this.height + margin) particle.y = -margin;

      // Slowly return radius to base
      particle.radius += (particle.baseRadius - particle.radius) * 0.1;

      // Gentle drift
      particle.vx += (Math.random() - 0.5) * 0.1;
      particle.vy += (Math.random() - 0.5) * 0.1;

      // Subtle hue shift over time
      particle.hue = (particle.hue + 0.1) % 360;
    });
  }

  private draw() {
    // Clear with fade effect for trails
    this.ctx.fillStyle = 'rgba(26, 26, 46, 0.15)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw connections between nearby particles
    this.ctx.strokeStyle = 'rgba(234, 234, 234, 0.03)';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 80) {
          this.ctx.globalAlpha = (1 - distance / 80) * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Draw trail points
    this.trailPoints.forEach((point) => {
      const alpha = (1 - point.age / 30) * 0.5;
      const radius = (1 - point.age / 30) * 15;

      // Glow effect
      const gradient = this.ctx.createRadialGradient(
        point.x * this.width, point.y * this.height, 0,
        point.x * this.width, point.y * this.height, radius * 2
      );
      gradient.addColorStop(0, `rgba(244, 201, 93, ${alpha})`);
      gradient.addColorStop(1, 'rgba(244, 201, 93, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(point.x * this.width, point.y * this.height, radius * 2, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw particles with glow
    this.particles.forEach((particle) => {
      // Outer glow
      const glowGradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      glowGradient.addColorStop(0, this.hexToRgba(particle.color, particle.alpha * 0.5));
      glowGradient.addColorStop(1, this.hexToRgba(particle.color, 0));

      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Core particle
      this.ctx.fillStyle = this.hexToRgba(particle.color, particle.alpha);
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Inner highlight
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha * 0.3})`;
      this.ctx.beginPath();
      this.ctx.arc(
        particle.x - particle.radius * 0.3,
        particle.y - particle.radius * 0.3,
        particle.radius * 0.4,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    });

    // Draw interaction points (hand positions) with glow
    this.interactionPoints.forEach((point) => {
      const x = point.x * this.width;
      const y = point.y * this.height;
      const radius = 30 * point.strength;

      // Pulsing glow
      const pulseRadius = radius + Math.sin(Date.now() / 200) * 5;

      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, pulseRadius * 2);
      const color = point.isAttract ? '#1B998B' : '#E85A4F';
      gradient.addColorStop(0, this.hexToRgba(color, 0.3));
      gradient.addColorStop(0.5, this.hexToRgba(color, 0.1));
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, pulseRadius * 2, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.globalAlpha = 1;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(234, 234, 234, ${alpha})`;
  }

  public start() {
    const animate = () => {
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public handleResize() {
    this.resize();
  }

  public burst(x: number, y: number, count: number = 20) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 3 + Math.random() * 3;
      const particle = this.createParticle(x * this.width, y * this.height);
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.radius = this.config.maxRadius;
      this.particles.push(particle);
    }
    // Remove excess particles
    while (this.particles.length > this.config.particleCount + 100) {
      this.particles.shift();
    }
  }
}

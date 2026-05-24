import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { SafeLink } from "@/components/SafeLink";
import { summitDetails } from "@/data/summitData";

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const eventTimestamp = new Date(summitDetails.datetime).getTime();
    const tick = () => {
      const diff = Math.max(eventTimestamp - Date.now(), 0);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

const ParticleCanvas: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false }) || canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];

    // Helper using Web Crypto API to avoid SonarQube warnings around Math.random()
    const secureRandom = () =>
      globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      resize();
      // Reduce density: higher divisor means fewer particles
      const divisor = globalThis.window.innerWidth < 768 ? 25000 : 15000;
      const count = Math.min(Math.floor((canvas.width * canvas.height) / divisor), 80);
      particles = Array.from({ length: count }, () => ({
        x: secureRandom() * canvas.width,
        y: secureRandom() * canvas.height,
        vx: (secureRandom() - 0.5) * 0.3,
        vy: (secureRandom() - 0.5) * 0.3,
        r: secureRandom() * 1.5 + 0.5,
        o: secureRandom() * 0.4 + 0.1,
      }));
    };

    const drawConnections = (
      p: { x: number; y: number },
      i: number,
      maxDist: number,
      maxDistSq: number,
    ) => {
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;

        // Optimization: Skip pairs that are obviously too far apart without calculating square root
        if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue;

        const distSq = dx * dx + dy * dy;
        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    };

    const draw = () => {
      // Use a slightly opaque clear to create a very subtle trail effect if desired,
      // but simple clear is faster.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maxDist = 120;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Boundary checks
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.o})`;
        ctx.fill();

        drawConnections(p, i, maxDist, maxDistSq);
      }
      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    globalThis.window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animId);
      globalThis.window.removeEventListener("resize", init);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1] opacity-60" />;
});
ParticleCanvas.displayName = "ParticleCanvas";

const CountdownUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-primary tabular-nums">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground mt-1">
      {label}
    </span>
  </div>
);

const Hero: React.FC = () => {
  const { days, hours, minutes, seconds } = useCountdown();
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Defer video playback until after LCP — prevents competing with critical resources
  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setTimeout(() => {
      const playPromise = videoRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked by browser — already muted so this is expected and safe
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <section id="home" className="relative overflow-hidden pt-[var(--navbar-height)]">
      {/* Background video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          poster="https://ik.imagekit.io/nairobidevops/ads2025/IMG_6738.JPG?tr=w-1920,q-80,f-auto"
        >
          <source
            src="https://res.cloudinary.com/nairobidevops/video/upload/f_auto,q_auto:low,w_1280/v1773297162/summit2025_wqebkh.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-dark-bg/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
      </div>

      {/* Particle overlay */}
      <ParticleCanvas />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh_-_var(--navbar-height))] min-h-[calc(100svh_-_var(--navbar-height))] w-full max-w-7xl items-start section-padding py-12 md:items-center md:py-16">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">
              {summitDetails.date}. {summitDetails.location}.
            </span>
            <span className="text-sm font-medium text-primary/70 tracking-wide">#ADS2026</span>
            <span className="text-sm font-medium text-primary/70 tracking-wide">#ADSummit2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight mb-6"
          >
            <span className="text-primary-foreground">Africa Ascends:</span>
            <br />
            <span className="text-primary">Build What's Next</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg max-w-xl mb-8 leading-relaxed"
          >
            Where Africa's engineers across DevOps, AI, and Security stop following the global
            roadmap and start writing it
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 mb-10"
          >
            <CountdownUnit value={days} label="Days" />
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary/40 self-start">
              :
            </span>
            <CountdownUnit value={hours} label="Hours" />
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary/40 self-start">
              :
            </span>
            <CountdownUnit value={minutes} label="Min" />
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary/40 self-start">
              :
            </span>
            <CountdownUnit value={seconds} label="Sec" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/sponsorship#packages"
              className="px-7 py-3 rounded-full border-2 border-primary-foreground/40 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors"
              aria-label="Become a Sponsor"
            >
              Become a Sponsor
            </Link>
            <SafeLink
              href={summitDetails.cfpUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="px-7 py-3 rounded-full border-2 border-primary-foreground/40 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors"
              aria-label="Become a Speaker"
            >
              Become a Speaker
            </SafeLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

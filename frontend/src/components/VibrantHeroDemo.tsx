import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tag3D } from "#components/common/Tag3D";
import { Container } from "#components/layout/Container";
import { Button } from "#components/ui/button";
import {
  Zap,
  Sparkles,
  Target,
  Heart,
  Rocket,
  Shield,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Vibrant Hero Demo Page
 * Showcases the new playful, animated, 3D-heavy aesthetic
 */
export function VibrantHeroDemo() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const blobRef1 = useRef<HTMLDivElement>(null);
  const blobRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ---- GSAP Hero Animation ----
    const tl = gsap.timeline();

    const titleEl = document.querySelector(".hero-title");
    const subtitleEl = document.querySelector(".hero-subtitle");
    const ctaEl = document.querySelector(".hero-cta");

    if (titleEl) {
      tl.from(titleEl, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    if (subtitleEl) {
      tl.from(
        subtitleEl,
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }

    if (ctaEl) {
      tl.from(
        ctaEl,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
        },
        "-=0.3"
      );
    }

    // ---- Stats Counter Animation ----
    if (statsRef.current) {
      gsap.utils.toArray(".stat-number").forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          textContent: 0,
          duration: 2,
          snap: { textContent: 1 },
          ease: "power2.out",
        });
      });
    }

    // ---- Feature Cards Stagger ----
    if (featuresRef.current) {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 70%",
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
      });
    }

    // ---- Parallax Background ----
    if (blobRef1.current) {
      gsap.to(blobRef1.current, {
        scrollTrigger: {
          trigger: "body",
          scrub: 0.5,
        },
        y: 300,
        rotation: 180,
        ease: "none",
      });
    }

    if (blobRef2.current) {
      gsap.to(blobRef2.current, {
        scrollTrigger: {
          trigger: "body",
          scrub: 0.5,
        },
        y: -200,
        rotation: -180,
        ease: "none",
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors">
      {/* ---- Hero Section ---- */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 bg-white dark:bg-slate-950"
      >
        {/* Animated Gradient Blobs */}
        <div
          ref={blobRef1}
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none"
        />
        <div
          ref={blobRef2}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl pointer-events-none"
        />

        <Container className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <motion.h1
              className="hero-title font-display text-5xl md:text-7xl font-bold leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="bg-gradient-to-r from-indigo-600 via-pink-600 to-cyan-500 bg-clip-text text-transparent">
                Never Lose
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">
                What Matters
              </span>
            </motion.h1>

            <motion.p
              className="hero-subtitle text-xl text-slate-600 dark:text-slate-300 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              AI-powered tracking tags that learn your habits. Find anything,
              anywhere. The future of finding.
            </motion.p>

            <motion.div
              className="hero-cta flex gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                See Demo
              </Button>
            </motion.div>
          </div>

          {/* Right: 3D Product */}
          <motion.div
            className="h-[400px] md:h-[500px] bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Tag3D autoRotate color="cyan" scale={1.2} />
          </motion.div>
        </Container>
      </section>

      {/* ---- Stats Section ---- */}
      <section
        ref={statsRef}
        className="py-20 bg-slate-50 dark:bg-slate-900"
      >
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Users", value: "50K+" },
              { label: "Recovery Rate", value: "99.9%" },
              { label: "Battery Life", value: "1 Year" },
              { label: "Range", value: "300ft" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-6 rounded-lg bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700"
                whileHover={{ y: -4 }}
              >
                <div className="stat-number text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- Features Section ---- */}
      <section
        ref={featuresRef}
        className="py-20 bg-white dark:bg-slate-950"
      >
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                TagX
              </span>
              ?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Everything you need, nothing you don't
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Real-time location tracking with 300ft Bluetooth range",
              },
              {
                icon: Target,
                title: "AI Predictions",
                desc: "Machine learning predicts where you might lose things",
              },
              {
                icon: Sparkles,
                title: "Smart Habits",
                desc: "Learns your patterns and alerts before you lose it",
              },
              {
                icon: Heart,
                title: "For Everyone",
                desc: "Bags, phones, keys, pets, kids, vehicles & more",
              },
              {
                icon: Shield,
                title: "Privacy First",
                desc: "End-to-end encrypted. Your data stays yours",
              },
              {
                icon: Rocket,
                title: "1 Year Battery",
                desc: "Ultra-efficient chip means year-long tracking",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  className="feature-card p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-400 group"
                  whileHover={{ y: -8 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-pink-600 to-cyan-500">
        <Container className="text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl font-bold mb-4">
              Ready to never lose anything again?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join 50K+ users who trust TagX to find what matters
            </p>
            <Button size="lg" variant="secondary">
              Shop Now
            </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

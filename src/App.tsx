"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { animate, stagger } from "motion";
import "../app/globals.css";

const reasons = [
  ["01", "Your laugh", "The kind of sound that makes an ordinary Tuesday feel like a celebration."],
  ["02", "Your beautiful mind", "How you notice the little things, dream boldly, and make every conversation feel alive."],
  ["03", "Your kindness", "The quiet, effortless way you make the world softer for everyone around you."],
  ["04", "The way you see me", "With you, I feel understood, believed in, and completely at home."],
];

function Constellation() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mount.current) return;
    const host = mount.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
    camera.position.z = 7;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    host.appendChild(renderer.domElement);

    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(2600 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      const r = 8 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffd9e3, size: 0.025, transparent: true, opacity: 0.8 }));
    scene.add(stars);

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.55);
    heartShape.bezierCurveTo(0.8, 1.45, 2.1, 0.55, 0, -1.45);
    heartShape.bezierCurveTo(-2.1, 0.55, -0.8, 1.45, 0, 0.55);
    const heart = new THREE.Mesh(
      new THREE.ExtrudeGeometry(heartShape, { depth: 0.32, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.12, bevelSegments: 6 }),
      new THREE.MeshPhysicalMaterial({ color: 0xe82f67, emissive: 0x7a102f, emissiveIntensity: 1.6, roughness: 0.22, metalness: 0.12, clearcoat: 1 })
    );
    heart.scale.setScalar(0.82);
    heart.rotation.x = 0.12;
    scene.add(heart);
    scene.add(new THREE.PointLight(0xff4f80, 28, 12));
    const fill = new THREE.DirectionalLight(0xffe4ce, 3);
    fill.position.set(2, 4, 5);
    scene.add(fill);

    let mx = 0, my = 0, frame = 0;
    const move = (e: PointerEvent) => { mx = (e.clientX / innerWidth - 0.5) * 0.6; my = (e.clientY / innerHeight - 0.5) * 0.4; };
    const resize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
    addEventListener("pointermove", move); addEventListener("resize", resize);
    const tick = (t: number) => {
      stars.rotation.y = t * 0.000025; stars.rotation.x = my * 0.06;
      heart.rotation.y += (mx - heart.rotation.y) * 0.025;
      heart.position.y = Math.sin(t * 0.0012) * 0.09;
      const beat = 1 + Math.pow(Math.max(0, Math.sin(t * 0.0032)), 12) * 0.055;
      heart.scale.setScalar(0.82 * beat);
      renderer.render(scene, camera); frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); removeEventListener("pointermove", move); removeEventListener("resize", resize); renderer.dispose(); starGeo.dispose(); host.replaceChildren(); };
  }, []);
  return <div className="constellation" ref={mount} aria-hidden="true" />;
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [names, setNames] = useState({ to: "Ayushi", from: "Yash" });
  const [answered, setAnswered] = useState(false);
  const [pulled, setPulled] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setNames({ to: p.get("to") || "Ayushi", from: p.get("from") || "Yash" });
    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true });
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update); gsap.ticker.lagSmoothing(0); lenis.on("scroll", ScrollTrigger.update);
    const ctx = gsap.context(() => {
      gsap.from(".eyebrow, .hero-line, .hero-copy, .scroll-cue", { y: 60, opacity: 0, duration: 1.4, stagger: 0.13, ease: "power4.out", delay: 0.25 });
      gsap.to(".hero-content", { opacity: 0, scale: 0.84, y: -120, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 35%", scrub: 1 } });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach(el => gsap.from(el, { y: 80, opacity: 0, duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%" } }));
      gsap.utils.toArray<HTMLElement>(".reason-card").forEach((el, i) => gsap.from(el, { x: i % 2 ? 100 : -100, rotate: i % 2 ? 3 : -3, opacity: 0, scrollTrigger: { trigger: el, start: "top 85%", end: "top 55%", scrub: 1 } }));
      gsap.to(".marquee-track", { xPercent: -50, ease: "none", scrollTrigger: { trigger: ".marquee", scrub: 1, start: "top bottom", end: "bottom top" } });
      gsap.to(".finale-glow", { scale: 1.35, opacity: 0.8, scrollTrigger: { trigger: ".finale", start: "top bottom", end: "center center", scrub: 1 } });
    }, root);
    animate(".spark", { opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }, { duration: 3, delay: stagger(0.18), repeat: Infinity });
    return () => { ctx.revert(); lenis.destroy(); gsap.ticker.remove(update); };
  }, []);

  const sayYes = () => {
    setAnswered(true);
    const colors = ["#ff477e", "#ffd166", "#fff1f5", "#b78cff"];
    for (let i = 0; i < 90; i++) {
      const bit = document.createElement("i"); bit.className = "confetti";
      bit.style.left = `${50 + (Math.random() - .5) * 16}%`; bit.style.top = "56%"; bit.style.background = colors[i % colors.length];
      document.body.appendChild(bit);
      gsap.to(bit, { x: (Math.random() - .5) * innerWidth, y: -180 - Math.random() * innerHeight * .55, rotate: Math.random() * 900, opacity: 0, duration: 1.6 + Math.random() * 1.6, ease: "power2.out", onComplete: () => bit.remove() });
    }
  };

  const pullLove = () => {
    if (pulled) return;
    setPulled(true);
    requestAnimationFrame(() => {
      gsap.fromTo(".panda-sticker", { y: 220, scale: .35, rotate: -8, opacity: 0 }, { y: 0, scale: 1, rotate: 0, opacity: 1, duration: 1.35, ease: "back.out(1.7)" });
      gsap.fromTo(".panda-message", { y: 20, opacity: 0 }, { y: 0, opacity: 1, delay: .65, duration: .8 });
    });
  };

  return <main ref={root}>
    <Constellation />
    <div className="grain" aria-hidden="true" />
    <div className="spark s1" /><div className="spark s2" /><div className="spark s3" />
    <nav><a className="mark" href="#top">∞</a><span>A little universe for {names.to}</span><a href="#question">The question <b>↘</b></a></nav>

    <section className="hero" id="top">
      <div className="hero-content">
        <p className="eyebrow"><span /> FOR THE ONE WHO CHANGED EVERYTHING</p>
        <h1><span className="hero-line">In every universe,</span><span className="hero-line italic">I’d still choose you.</span></h1>
        <p className="hero-copy">Some feelings are too big for a text message.<br />So I made you a whole universe instead.</p>
        <div className="scroll-cue"><i /> SCROLL TO ENTER OUR STORY</div>
      </div>
    </section>

    <section className="letter section-pad">
      <p className="section-tag reveal">01 / A NOTE FROM MY HEART</p>
      <div className="letter-grid">
        <h2 className="reveal">Before you,<br />love was only<br /><em>a word.</em></h2>
        <div className="letter-copy reveal"><p>Then you arrived, and suddenly it had a voice, a laugh, a hand to hold. It had your eyes. Your warmth. Your beautifully impossible way of making every place feel like home.</p><p>You turned the smallest moments into memories I want to keep forever.</p><div className="signature">{names.from}<span>always & forever</span></div></div>
      </div>
    </section>

    <div className="marquee"><div className="marquee-track">YOU ARE MY FAVORITE PLACE&nbsp; ✦ &nbsp;MY ONCE IN A LIFETIME&nbsp; ✦ &nbsp;YOU ARE MY FAVORITE PLACE&nbsp; ✦ &nbsp;MY ONCE IN A LIFETIME&nbsp; ✦ &nbsp;</div></div>

    <section className="reasons section-pad">
      <div className="reasons-head reveal"><div><p className="section-tag">02 / THE REASONS</p><h2>A few of the <em>million</em><br />things I adore about you.</h2></div><p>There could never be enough pages,<br />but let’s begin here.</p></div>
      <div className="cards">{reasons.map(([n, title, copy]) => <article className="reason-card" key={n}><span>{n}</span><div className="mini-heart">♥</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className={`panda-surprise ${pulled ? "is-pulled" : ""}`}>
      <div className="panda-copy reveal"><p className="section-tag">03 / A TINY SURPRISE</p><h2>Whenever you need<br /><em>a hug from me…</em></h2><p>Pull the string. I saved one right here.</p></div>
      <div className="panda-stage">
        <div className="curtain-line" />
        {pulled && <><img className="panda-sticker" src={`${import.meta.env.BASE_URL}pandas-hug.png`} alt="Two adorable pandas hugging" /><p className="panda-message">This is us. You’re never getting rid of my hugs, Ayushi. ♥</p></>}
        <button className="pull-string" onClick={pullLove} aria-label="Pull the string to reveal a panda hug"><span className="cord" /><span className="handle">♥</span><b>{pulled ? "HUG DELIVERED" : "PULL FOR A HUG"}</b></button>
      </div>
    </section>

    <section className="quote section-pad"><p className="section-tag reveal">04 / MY PROMISE</p><blockquote className="reveal">“Whatever our souls<br />are made of, yours and<br />mine are <em>the same.</em>”</blockquote><p className="quote-by reveal">— EMILY BRONTË</p></section>

    <section className="finale" id="question">
      <div className="finale-glow" />
      <div className="ring reveal"><span>♥</span></div>
      {!answered ? <div className="proposal"><p className="section-tag reveal">05 / ONE BEAUTIFUL QUESTION</p><h2 className="reveal">{names.to},<br /><em>will you be mine,</em><br />forever?</h2><p className="reveal">I choose you today. I’ll choose you tomorrow.<br />I want to choose you for every day after.</p><div className="actions reveal"><button onClick={sayYes}>YES, A THOUSAND TIMES <span>♥</span></button><span className="tiny-note">P.S. There is only one right answer</span></div></div> : <div className="answer"><p>✦ OUR FOREVER STARTS HERE ✦</p><h2>You just made me<br /><em>the happiest person alive.</em></h2><span>I love you, {names.to}. Always.</span></div>}
      <footer><span>Made with an unreasonable amount of love</span><b>♥</b><span>{names.from} · {new Date().getFullYear()}</span></footer>
    </section>
  </main>;
}

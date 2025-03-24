"use client";

import { useEffect, useRef } from "react";
import styles from "./Antigravity.module.css";

const symbols = ["〇", "◆", "✖", "⬟", "⬠"]; // シンプルな形
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// 🔹 `Particle` クラスをコンポーネントの外に定義
class Particle {
  item: HTMLElement;
  position: number;
  friction: number;
  scale: number;
  rotation: string;
  dimensions: { width: number; height: number };
  steps: number;
  siner: number;

  constructor(symbol: string, container: HTMLDivElement) {
    this.steps = window.innerHeight / 2;
    this.friction = 1 + Math.random() * 3;
    this.position = window.innerHeight;
    this.rotation = Math.random() > 0.5 ? "-" : "+";
    this.scale = 2 + Math.random() * 2; // 2～3cm (20～30px) ほど大きく
    this.siner = 200 * Math.random();

    // 🎯 パーティクルの要素作成
    this.item = document.createElement("div");
    this.item.textContent = symbol;
    this.item.className = styles.particle;
    this.item.style.left = `${Math.random() * 100}%`;

    // 🔹 カラフルな色をランダムに設定
    const hue = Math.floor(Math.random() * 360);
    const saturation = 80 + Math.random() * 20;
    const lightness = 50 + Math.random() * 10;
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    this.item.style.color = color; // 文字色を設定
    container.appendChild(this.item);

    this.dimensions = {
      width: this.item.offsetWidth,
      height: this.item.offsetHeight,
    };
  }

  move() {
    this.position -= this.friction;
    const top = this.position;
    const left =
      Math.sin(this.position * Math.PI / this.steps) * this.siner;
    this.item.style.transform = `translate(${left}px, ${top}px) scale(${this.scale}) rotate(${this.rotation}${this.position + this.dimensions.height}deg)`;

    if (this.position < -this.dimensions.height) {
      this.item.remove();
      return false;
    }
    return true;
  }
}

export default function Antigravity() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isPaused = false;
    window.onblur = () => (isPaused = true);
    window.onfocus = () => (isPaused = false);

    const particles: Particle[] = [];
    const interval = setInterval(() => {
      if (!isPaused) {
        particles.push(new Particle(symbols[randomInt(0, symbols.length - 1)], container));
      }
    }, 200);

    const update = () => {
      particles.filter((p) => p.move());
      requestAnimationFrame(update);
    };
    update();

    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className={styles.container}></div>;
}

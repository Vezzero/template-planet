"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const WORDS = [
  "aura", "buongiorno", "shitpost", "ferrara", "luminescenza",
  "sofficini", "meteo", "esercito di", "normie", "textpost",
  "dank", "soltero", "lol", "gormita", "ADESSO", "morto di",
  "cobblestone", "shamn", "fico", "testo sopra", "testo sotto",
  "testo", "ceo", "abbiate grasso", "pescara calcio", "spermuta",
  "impact",
];

const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz!@#$%&*?{}";

type WordItem = {
  id: number;
  word: string;
  display: string;
  x: number;
  y: number;
  phase: "scramble" | "hold" | "exit" | "done";
};

function pickPosition() {
  const zone = Math.random();
  let x: number, y: number;
  if (zone < 0.4) {
    // left 20%: x 2-18%
    x = 2 + Math.random() * 16;
    y = 8 + Math.random() * 80;
  } else if (zone < 0.8) {
    // right 20%: x 82-96%
    x = 82 + Math.random() * 14;
    y = 8 + Math.random() * 80;
  } else {
    // bottom 20%: y 80-95%
    x = 5 + Math.random() * 88;
    y = 80 + Math.random() * 15;
  }
  return { x, y };
}

function pickWord(exclude: string[]) {
  let word = WORDS[Math.floor(Math.random() * WORDS.length)];
  let safety = 0;
  while (exclude.includes(word) && safety++ < 8) {
    word = WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  return word;
}

function scrambleStr(word: string) {
  return word
    .split("")
    .map((c) =>
      c === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    )
    .join("");
}

export function HeroFloatingWords() {
  const [items, setItems] = useState<WordItem[]>([]);
  const idRef = useRef(0);
  const mountedRef = useRef(true);

  const spawnWord = useCallback(() => {
    if (!mountedRef.current) return;

    const activeWords = items.map((i) => i.word);
    const word = pickWord(activeWords);
    const { x, y } = pickPosition();
    idRef.current += 1;
    const id = idRef.current;

    const newItem: WordItem = {
      id,
      word,
      display: scrambleStr(word),
      x,
      y,
      phase: "scramble",
    };

    setItems((prev) => [...prev.filter((i) => i.phase !== "done"), newItem]);

    // scramble in
    let frame = 0;
    const totalFrames = word.length * 2 + 3;
    const scrambleInt = setInterval(() => {
      if (!mountedRef.current) { clearInterval(scrambleInt); return; }
      frame += 1;
      const display = word
        .split("")
        .map((c, i) => {
          if (c === " ") return " ";
          if (frame >= i * 2 + 2) return c;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, display } : it))
      );
      if (frame >= totalFrames) {
        clearInterval(scrambleInt);
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, phase: "hold" } : it))
        );
        // hold then exit
        setTimeout(() => {
          if (!mountedRef.current) return;
          setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, phase: "exit" } : it))
          );
          // remove after exit transition
          setTimeout(() => {
            if (!mountedRef.current) return;
            setItems((prev) =>
              prev.map((it) => (it.id === id ? { ...it, phase: "done" } : it))
            );
          }, 200);
        }, 800);
      }
    }, 22);
  }, [items]);

  // Spawn loop: every 600ms try to add a new word (max 3 visible at once)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    mountedRef.current = true;
    const interval = setInterval(() => {
      setItems((prev) => {
        const active = prev.filter((i) => i.phase !== "done");
        if (active.length >= 3) return prev;
        return prev; // trigger spawn via effect below
      });
    }, 600);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // Spawn trigger: keep 3 words alive
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const active = items.filter((i) => i.phase !== "done");
    if (active.length < 3) {
      const delay = active.length === 0 ? 500 : 200 + Math.random() * 400;
      const t = setTimeout(() => {
        if (mountedRef.current) spawnWord();
      }, delay);
      return () => clearTimeout(t);
    }
  }, [items, spawnWord]);

  const visibleItems = items.filter((i) => i.phase !== "done");

  return (
    <>
      {visibleItems.map((it) => {
        const isExiting = it.phase === "exit";
        return (
          <span
            key={it.id}
            className="absolute select-none whitespace-nowrap pointer-events-none"
            aria-hidden="true"
            style={{
              left: `${it.x}%`,
              top: `${it.y}%`,
              zIndex: 1,
              color: "var(--paper)",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              fontWeight: 500,
              fontSize: "10px",
              opacity: isExiting ? 0 : 0.2,
              transform: isExiting
                ? "translateX(-10px) skewX(-10deg)"
                : "translateX(0) skewX(0)",
              clipPath: isExiting ? "inset(0 100% 0 0)" : "inset(0 0 0 0)",
              transition: isExiting
                ? "clip-path 180ms cubic-bezier(0.77,0,0.18,1), opacity 160ms ease, transform 180ms cubic-bezier(0.77,0,0.18,1)"
                : "none",
              textShadow: "0 0 14px rgba(212, 255, 0, 0.06)",
            }}
          >
            {it.display}
          </span>
        );
      })}
    </>
  );
}

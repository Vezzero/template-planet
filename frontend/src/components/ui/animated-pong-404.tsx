"use client";

import { useEffect, useRef } from "react";

const COLOR = "#f5f1e8"; // paper
const HIT_COLOR = "#5a564e"; // ghost
const BACKGROUND_COLOR = "#0a0908"; // ink
const BALL_COLOR = "#d4ff00"; // acid
const PADDLE_COLOR = "#f5f1e8"; // paper
const LETTER_SPACING = 1;
const WORD_SPACING = 3;

const PIXEL_MAP: Record<string, number[][]> = {
  "0": [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  "4": [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
  ],
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  V: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  ":": [
    [0],
    [1],
    [0],
    [1],
    [0],
  ],
  "(": [
    [0, 1],
    [1, 0],
    [1, 0],
    [1, 0],
    [0, 1],
  ],
};

interface Pixel {
  x: number;
  y: number;
  size: number;
  hit: boolean;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetY: number;
  isVertical: boolean;
}

export function NotFoundPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 });
  const paddlesRef = useRef<Paddle[]>([]);
  const scaleRef = useRef(1);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000);
      initializeGame();
    };

    const initializeGame = () => {
      const scale = scaleRef.current;
      const LARGE_PIXEL_SIZE = 8 * scale;
      const SMALL_PIXEL_SIZE = 4 * scale;
      const BALL_SPEED = 6 * scale;

      pixelsRef.current = [];

      type Line = { text: string; size: "large" | "small" };
      const lines: Line[] = [
        { text: "404", size: "large" },
        { text: "PAGINA NON", size: "small" },
        { text: "TROVATA :(", size: "small" },
      ];

      const calculateLineWidth = (text: string, pixelSize: number) => {
        return text.split(" ").reduce((width, word, idx) => {
          const wordWidth =
            word.split("").reduce((w, letter) => {
              const lw = PIXEL_MAP[letter]?.[0]?.length ?? 0;
              return w + lw * pixelSize + LETTER_SPACING * pixelSize;
            }, 0) - LETTER_SPACING * pixelSize;
          return width + wordWidth + (idx > 0 ? WORD_SPACING * pixelSize : 0);
        }, 0);
      };

      // Compute scale factor so the widest line fits AND total height fits
      const widestLine = Math.max(
        ...lines.map((l) =>
          calculateLineWidth(
            l.text,
            l.size === "large" ? LARGE_PIXEL_SIZE : SMALL_PIXEL_SIZE
          )
        )
      );
      // Width budget: 65% of canvas (was 80%)
      const widthScaleFactor = (canvas.width * 0.65) / widestLine;

      // Height budget at base sizes (large = 5*8=40, small = 5*4=20, gaps proportional)
      // Total base height: 40 + 16 (gap after large) + 20 + 8 (gap small) + 20 = 104
      const baseTextHeight =
        5 * LARGE_PIXEL_SIZE + // line 1
        4 * LARGE_PIXEL_SIZE + // gap after large
        5 * SMALL_PIXEL_SIZE + // line 2
        2 * SMALL_PIXEL_SIZE + // gap between small
        5 * SMALL_PIXEL_SIZE; // line 3
      // Height budget: 55% of canvas to leave room for top/bottom UI
      const heightScaleFactor = (canvas.height * 0.55) / baseTextHeight;

      // Use the more restrictive scale so text never overflows
      const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor;
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor;

      const sizeFor = (s: "large" | "small") =>
        s === "large" ? adjustedLargePixelSize : adjustedSmallPixelSize;

      // Heights and spacing
      const lineHeights = lines.map((l) => 5 * sizeFor(l.size));
      const gapAfterLarge = 4 * adjustedLargePixelSize;
      const gapBetweenSmall = 2 * adjustedSmallPixelSize;

      const totalTextHeight =
        lineHeights.reduce((a, b) => a + b, 0) +
        gapAfterLarge + // gap after the large line
        gapBetweenSmall * (lines.filter((l) => l.size === "small").length - 1);

      let startY = (canvas.height - totalTextHeight) / 2;

      lines.forEach((line, lineIndex) => {
        const pxSize = sizeFor(line.size);
        const lineWidth = calculateLineWidth(line.text, pxSize);
        let startX = (canvas.width - lineWidth) / 2;

        line.text.split(" ").forEach((subWord, wIdx) => {
          if (wIdx > 0) startX += WORD_SPACING * pxSize;
          subWord.split("").forEach((letter) => {
            const pixelMap = PIXEL_MAP[letter];
            if (!pixelMap) return;
            for (let i = 0; i < pixelMap.length; i++) {
              for (let j = 0; j < pixelMap[i].length; j++) {
                if (pixelMap[i][j]) {
                  const x = startX + j * pxSize;
                  const y = startY + i * pxSize;
                  pixelsRef.current.push({ x, y, size: pxSize, hit: false });
                }
              }
            }
            startX += (pixelMap[0].length + LETTER_SPACING) * pxSize;
          });
        });

        startY += lineHeights[lineIndex];
        // gap after this line
        if (lineIndex === 0) startY += gapAfterLarge;
        else if (lineIndex < lines.length - 1) startY += gapBetweenSmall;
      });

      // Ball start
      const ballStartX = canvas.width * 0.9;
      const ballStartY = canvas.height * 0.1;
      ballRef.current = {
        x: ballStartX,
        y: ballStartY,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjustedSmallPixelSize * 0.55,
      };

      const paddleWidth = adjustedSmallPixelSize * 0.85;
      const paddleLength = 9 * adjustedSmallPixelSize;

      paddlesRef.current = [
        {
          x: 0,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width - paddleWidth,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 0,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: canvas.height - paddleWidth,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
      ];
    };

    const updateGame = () => {
      const ball = ballRef.current;
      const paddles = paddlesRef.current;

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
      }
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx;
      }

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            ball.dx = -ball.dx;
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            ball.dy = -ball.dy;
          }
        }
      });

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2;
          paddle.targetY = Math.max(
            0,
            Math.min(canvas.height - paddle.height, paddle.targetY)
          );
          paddle.y += (paddle.targetY - paddle.y) * 0.1;
        } else {
          paddle.targetY = ball.x - paddle.width / 2;
          paddle.targetY = Math.max(
            0,
            Math.min(canvas.width - paddle.width, paddle.targetY)
          );
          paddle.x += (paddle.targetY - paddle.x) * 0.1;
        }
      });

      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true;
          const centerX = pixel.x + pixel.size / 2;
          const centerY = pixel.y + pixel.size / 2;
          if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }
        }
      });
    };

    const drawGame = () => {
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      });

      ctx.fillStyle = BALL_COLOR;
      ctx.beginPath();
      ctx.arc(
        ballRef.current.x,
        ballRef.current.y,
        ballRef.current.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.fillStyle = PADDLE_COLOR;
      paddlesRef.current.forEach((paddle) => {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      });
    };

    const gameLoop = () => {
      updateGame();
      drawGame();
      rafRef.current = requestAnimationFrame(gameLoop);
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(parent);
    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      aria-label="404 Pagina non trovata - Pong autoplay"
    />
  );
}

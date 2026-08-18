import { useEffect, useRef } from "react";

import { cn } from "lib/utils";

export interface ShigoShaderProps {
  className?: string;
}

const vertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
  uv.x *= u_resolution.x / max(u_resolution.y, 1.0);

  float t = u_time * 0.08;
  vec2 p1 = uv - vec2(-0.45 + sin(t) * 0.12, 0.10 + cos(t * 0.7) * 0.12);
  vec2 p2 = uv - vec2(0.55 + cos(t * 0.8) * 0.12, -0.25 + sin(t * 1.1) * 0.10);
  vec2 p3 = uv - vec2(0.05 + sin(t * 0.45) * 0.18, 0.62 + cos(t * 0.6) * 0.08);

  float violetField = exp(-1.45 * dot(p1, p1));
  float tealField = exp(-1.85 * dot(p2, p2));
  float indigoField = exp(-2.1 * dot(p3, p3));
  float wave = 0.5 + 0.5 * sin(uv.x * 1.45 + uv.y * 1.12 + t * 2.0 + sin(uv.y * 2.0 - t));

  vec3 background = vec3(0.035, 0.039, 0.059);
  vec3 violet = vec3(0.506, 0.451, 0.961);
  vec3 teal = vec3(0.345, 0.812, 0.753);
  vec3 indigo = vec3(0.215, 0.230, 0.470);

  vec3 color = background;
  color += violet * violetField * (0.34 + 0.13 * wave);
  color += teal * tealField * (0.055 + 0.025 * wave);
  color += indigo * indigoField * 0.12;

  float vignette = smoothstep(1.55, 0.28, length(uv * vec2(0.72, 0.84)));
  color *= 0.68 + 0.32 * vignette;
  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ShigoShader({ className }: ShigoShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    if (positionLocation < 0) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let frameId = 0;
    let startTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      if (resolutionLocation) gl.uniform2f(resolutionLocation, width, height);
    };

    const draw = (now: number) => {
      resize();
      if (timeLocation) {
        const elapsed = reducedMotion ? 0 : (now - startTime) / 1000;
        gl.uniform1f(timeLocation, elapsed);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reducedMotion) frameId = requestAnimationFrame(draw);
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      cancelAnimationFrame(frameId);
      startTime = performance.now();
      frameId = requestAnimationFrame(draw);
    };

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);
    if (!observer) window.addEventListener("resize", resize);
    motionQuery.addEventListener?.("change", handleMotionChange);

    resize();
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", resize);
      motionQuery.removeEventListener?.("change", handleMotionChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 size-full bg-[#090A0F]", className)}
    />
  );
}

"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A sketch portrait that will not sit still.
 *
 * The site this is modelled on ships a looping .mov per portrait — a
 * video of the drawing moving. That is the right answer with an
 * illustrator on retainer and the wrong one here: a megabyte per face,
 * no reaction to the reader, and a re-render every time the portrait
 * changes.
 *
 * So the movement is assembled instead, from three drawings of the
 * same head — looking left, straight ahead, and right. Two things then
 * happen at once:
 *
 *   the turn      the cursor chooses which pose, and the crossfade
 *                 between neighbouring poses is deliberately fast and
 *                 hard, so it reads as animation drawn on threes
 *                 rather than as two photographs dissolving
 *   the life      the chosen pose is warped continuously by two
 *                 crossed sine fields and sampled twice a hair apart,
 *                 so the pencil lines gain and lose weight — the
 *                 drawing looks like it is being redrawn while you
 *                 watch, which is what stops a still sketch from
 *                 looking like a still sketch between turns
 *
 * With no cursor — a phone, or a reader who has not moved yet — the
 * head drifts through the poses on its own, slowly, so the loader is
 * never a frozen face.
 *
 * Hand-written WebGL rather than three.js: this is one quad and one
 * shader, and three would be several hundred kilobytes of scene graph
 * to draw a rectangle, on a loader, where every kilobyte is in front
 * of the reader. If the book later wants real page-curl geometry,
 * that is where three earns its place.
 */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uT0;
uniform sampler2D uT1;
uniform sampler2D uT2;
uniform float uTime;
uniform float uPose;    // 0..2, fractional
uniform float uAmp;
uniform float uFlash;   // spikes on a pose change
uniform vec2  uCover;

vec4 poseSample(vec2 uv) {
  // Hard-ish crossfade: mostly one drawing, briefly both.
  float p = clamp(uPose, 0.0, 2.0);
  float f = smoothstep(0.34, 0.66, fract(p));
  int i = int(floor(p));

  vec4 a, b;
  if (i <= 0) {
    a = texture(uT0, uv);
    b = texture(uT1, uv);
  } else {
    a = texture(uT1, uv);
    b = texture(uT2, uv);
  }
  if (p >= 2.0) { a = texture(uT2, uv); b = a; f = 0.0; }
  return mix(a, b, f);
}

void main() {
  vec2 uv = (vUv - 0.5) * uCover + 0.5;
  float t = uTime;

  // Two crossed fields on irrational periods, so the loop never
  // announces itself.
  float wx = sin(uv.y * 5.3 + t * 0.83) * cos(uv.x * 3.1 - t * 0.47);
  float wy = sin(uv.x * 4.7 - t * 0.61) * cos(uv.y * 2.9 + t * 0.39);

  // The crown moves more than the chin — that asymmetry is what reads
  // as a head rather than a sliding picture.
  float crown = smoothstep(1.0, 0.0, uv.y);
  vec2 breath = vec2(wx, wy) * (uAmp * 0.0055) * (0.55 + crown);

  vec2 p = uv + breath;

  float jig = (0.0011 + uFlash * 0.004) * uAmp;
  vec2 jitter = vec2(
    sin(t * 2.7 + uv.y * 40.0),
    cos(t * 2.3 + uv.x * 37.0)
  ) * jig;

  vec4 a = poseSample(p);
  vec4 b = poseSample(p + jitter);

  // Darkest ink wins, heaviest coverage wins: strokes thicken and thin
  // without the drawing dissolving at its edges.
  vec3 rgb = min(a.rgb, b.rgb);
  float alpha = max(a.a, b.a);

  if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) alpha = 0.0;

  outColor = vec4(rgb, alpha);
}`

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function LivingPortrait({
  frames,
  alt,
  className,
  amplitude = 1,
}: {
  /** Three drawings: looking left, straight ahead, looking right. */
  frames: string[]
  alt: string
  className?: string
  amplitude?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || frames.length === 0) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setFallback(true)
      return
    }

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    })
    if (!gl) {
      setFallback(true)
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const program = gl.createProgram()
    if (!vs || !fs || !program) {
      setFallback(true)
      return
    }
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFallback(true)
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(program, "aPos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, "uTime")
    const uPose = gl.getUniformLocation(program, "uPose")
    const uAmp = gl.getUniformLocation(program, "uAmp")
    const uFlash = gl.getUniformLocation(program, "uFlash")
    const uCover = gl.getUniformLocation(program, "uCover")

    gl.uniform1i(gl.getUniformLocation(program, "uT0"), 0)
    gl.uniform1i(gl.getUniformLocation(program, "uT1"), 1)
    gl.uniform1i(gl.getUniformLocation(program, "uT2"), 2)

    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA,
    )

    const sources = [frames[0], frames[1] ?? frames[0], frames[2] ?? frames[0]]
    const textures = sources.map((_, index) => {
      const texture = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0 + index)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      // One transparent pixel until the drawing arrives.
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 0]),
      )
      return texture
    })

    let imageAspect = 1
    let loaded = 0
    let frame = 0
    let running = true
    let pose = 1
    let target = 1
    let lastPoseStep = 1
    let flash = 0
    let lastPointer = -Infinity
    const start = performance.now()

    sources.forEach((src, index) => {
      const image = new Image()
      image.onload = () => {
        if (index === 1) imageAspect = image.naturalWidth / image.naturalHeight
        gl.activeTexture(gl.TEXTURE0 + index)
        gl.bindTexture(gl.TEXTURE_2D, textures[index])
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image,
        )
        loaded += 1
        if (loaded === 1) {
          resize()
          loop()
        }
      }
      image.onerror = () => setFallback(true)
      image.src = src
    })

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
      }
      gl!.viewport(0, 0, w, h)

      // "contain" the drawing: a portrait must never be cropped.
      const canvasAspect = w / h
      const cover =
        canvasAspect > imageAspect
          ? [canvasAspect / imageAspect, 1]
          : [1, imageAspect / canvasAspect]
      gl!.uniform2f(uCover, cover[0], cover[1])
    }

    function onMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      // Track across the whole window, not just the drawing — the head
      // should follow you around the page.
      const x = (event.clientX - (rect.left + rect.width / 2)) / window.innerWidth
      target = 1 + Math.max(-1, Math.min(1, x * 2.4))
      lastPointer = performance.now()
    }

    function loop() {
      if (!running) return
      frame = requestAnimationFrame(loop)
      const now = performance.now()
      const t = (now - start) / 1000

      // Nobody has moved for a while: drift on your own.
      if (now - lastPointer > 2600) {
        target = 1 + Math.sin(t * 0.34) * 0.92 + Math.sin(t * 0.13) * 0.18
      }

      pose += (target - pose) * 0.055

      // A change of drawing gets a brief spike of redraw jitter, so the
      // cut lands like a pencil rather than a slideshow.
      const step = Math.round(pose)
      if (step !== lastPoseStep) {
        lastPoseStep = step
        flash = 1
      }
      flash *= 0.88

      gl!.uniform1f(uTime, t)
      gl!.uniform1f(uPose, Math.max(0, Math.min(2, pose)))
      gl!.uniform1f(uAmp, amplitude)
      gl!.uniform1f(uFlash, flash)
      gl!.clearColor(0, 0, 0, 0)
      gl!.clear(gl!.COLOR_BUFFER_BIT)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    window.addEventListener("pointermove", onMove)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("pointermove", onMove)
      textures.forEach((texture) => gl.deleteTexture(texture))
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [frames, amplitude])

  if (fallback) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={frames[1] ?? frames[0]}
        alt={alt}
        className={`breathe object-contain ${className ?? ""}`}
        draggable={false}
      />
    )
  }

  return (
    <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />
  )
}

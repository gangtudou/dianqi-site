<template>
  <div class="kvl-demo">
    <div class="demo-title">🎮 动手玩：KVL 回路电压闭合为零</div>
    <div class="demo-sub">绿色=电压升（电池），黄色=电压降（电阻）。点"绕行一圈"看高亮箭头顺时针走一圈——无论怎么调电阻，累加永远归零。</div>

    <svg viewBox="0 0 600 320" class="circuit">
      <line class="wire" x1="100" y1="60" x2="500" y2="60"/>
      <line class="wire" x1="500" y1="60" x2="500" y2="260"/>
      <line class="wire" x1="100" y1="260" x2="500" y2="260"/>
      <line class="wire" x1="100" y1="60" x2="100" y2="180"/>
      <line class="wire" x1="100" y1="200" x2="100" y2="260"/>

      <line x1="85" y1="180" x2="115" y2="180" stroke="#4ade80" stroke-width="3"/>
      <line x1="90" y1="200" x2="110" y2="200" stroke="#4ade80" stroke-width="2"/>
      <text x="60" y="194" text-anchor="middle" class="kvl-label rise" style="font-size:14px;font-weight:600">+</text>
      <text x="60" y="204" text-anchor="middle" class="kvl-label dim" style="font-size:12px">−</text>
      <text x="40" y="192" text-anchor="middle" class="kvl-label rise" transform="rotate(-90 40 190)">E = 10V</text>

      <rect x="260" y="48" width="80" height="24" rx="4" fill="#272727" stroke="#fbbf24" stroke-width="2"/>
      <text x="300" y="40" text-anchor="middle" class="kvl-label drop">R₁</text>

      <rect x="488" y="140" width="24" height="60" rx="4" fill="#272727" stroke="#fbbf24" stroke-width="2"/>
      <text x="540" y="172" text-anchor="middle" class="kvl-label drop">R₂=2Ω</text>

      <rect x="260" y="248" width="80" height="24" rx="4" fill="#272727" stroke="#fbbf24" stroke-width="2"/>
      <text x="300" y="290" text-anchor="middle" class="kvl-label drop">R₃=3Ω</text>

      <text x="300" y="92" text-anchor="middle" class="kvl-label drop">U₁ = {{ fmt(U1) }}</text>
      <text x="560" y="160" text-anchor="middle" class="kvl-label drop">U₂ = {{ fmt(U2) }}</text>
      <text x="300" y="238" text-anchor="middle" class="kvl-label drop">U₃ = {{ fmt(U3) }}</text>

      <path :class="['loop-trace', { active: looping }]" d="M 100 200 L 100 60 L 500 60 L 500 260 L 100 260 L 100 200"/>

      <circle class="node" cx="100" cy="60" r="3"/>
      <circle class="node" cx="500" cy="60" r="3"/>
      <circle class="node" cx="500" cy="260" r="3"/>
      <circle class="node" cx="100" cy="260" r="3"/>
    </svg>

    <div class="btn-row">
      <button class="btn" @click="looping = true">▶ 绕行一圈</button>
      <button class="btn ghost" @click="looping = false">⏸ 暂停</button>
    </div>

    <div class="controls">
      <label>拖动 R₁（电阻值）<span class="val">{{ fmt(R1, 'Ω') }}</span></label>
      <input type="range" min="1" max="10" step="0.5" v-model.number="R1">
    </div>

    <div class="equation">
      <div class="eq-row">
        <span class="dot rise"></span>
        <span>沿绕行方向累加：</span>
        <span class="num rise">+E = +10.0 V</span>
      </div>
      <div class="eq-row">
        <span class="dot drop"></span>
        <span>− U₁ − U₂ − U₃ =</span>
        <span class="num drop">−{{ fmt(U1+U2+U3) }}</span>
      </div>
      <div class="eq-row">
        <span class="eq-sign">⇒</span>
        <span>E − U₁ − U₂ − U₃ =</span>
        <span class="num accent">{{ fmt(10 - (U1+U2+U3)) }}</span>
        <span class="check">✓ 闭合为零</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const R1 = ref(2)
const looping = ref(false)
const E = 10.0, R2 = 2.0, R3 = 3.0

const Itotal = computed(() => E / (R1.value + R2 + R3))
const U1 = computed(() => Itotal.value * R1.value)
const U2 = computed(() => Itotal.value * R2)
const U3 = computed(() => Itotal.value * R3)

const fmt = (v, unit = 'V') => v.toFixed(1) + ' ' + unit
</script>

<style scoped>
.kvl-demo {
  background: var(--vp-code-bg, #1f1f1f);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider, #333);
}
.demo-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.demo-sub { font-size: 13px; color: var(--vp-c-text-2, #9b9b9b); margin-bottom: 16px; line-height: 1.5; }
.circuit { width: 100%; height: auto; display: block; margin-bottom: 12px; }
.wire { stroke: #555; stroke-width: 2; fill: none; }
.kvl-label { font-family: Manrope, monospace; font-size: 13px; }
.kvl-label.dim { fill: var(--vp-c-text-2, #9b9b9b); }
.kvl-label.rise { fill: #4ade80; }
.kvl-label.drop { fill: #fbbf24; }
.node { fill: #888; }
.loop-trace {
  stroke: #448aff;
  stroke-width: 3;
  fill: none;
  stroke-dasharray: 12 8;
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.loop-trace.active {
  opacity: 1;
  animation: kvl-loop-flow 2.5s linear infinite;
}
@keyframes kvl-loop-flow {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -40; }
}
.btn-row { display: flex; gap: 8px; margin-bottom: 12px; }
.btn {
  background: #448aff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms;
}
.btn:hover { opacity: 0.9; }
.btn:active { transform: scale(0.97); }
.btn.ghost { background: var(--vp-code-bg, #272727); color: var(--vp-c-text-1, #f5f5f5); }
.controls {
  background: var(--vp-code-bg, #272727);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
}
.controls label { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: var(--vp-c-text-1, #f5f5f5); }
.controls label .val { color: #448aff; font-weight: 600; font-variant-numeric: tabular-nums; }
.controls input[type=range] { width: 100%; accent-color: #448aff; cursor: pointer; }
.equation {
  background: rgba(68,138,255,0.08);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.9;
}
.eq-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.dot.rise { background: #4ade80; }
.dot.drop { background: #fbbf24; }
.num { font-variant-numeric: tabular-nums; font-weight: 600; }
.num.rise { color: #4ade80; }
.num.drop { color: #fbbf24; }
.num.accent { color: #448aff; }
.eq-sign { color: var(--vp-c-text-2, #9b9b9b); }
.check { color: #4ade80; font-weight: 600; }
@media (hover: hover) and (pointer: fine) {
  .btn:hover { transform: translateY(-1px); }
}
@media (prefers-reduced-motion: reduce) {
  .loop-trace.active { animation: none; }
  .btn { transition: none; }
}
</style>

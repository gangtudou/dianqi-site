<template>
  <div class="vd-demo">
    <div class="demo-title">🎮 动手玩：串联分压公式推导</div>
    <div class="demo-sub">两个电阻串联接在电压 U 上，电流相同。拖滑块调 R₁，看 U₁/U₂ 怎么按电阻比例分——这就是分压公式的推导过程。</div>

    <svg viewBox="0 0 600 260" class="circuit">
      <!-- 串联回路：电池 → R1 → R2 → 回电池 -->
      <line class="wire" x1="80" y1="60" x2="200" y2="60"/>
      <line class="wire" x1="320" y1="60" x2="420" y2="60"/>
      <line class="wire" x1="480" y1="60" x2="540" y2="60"/>
      <line class="wire" x1="540" y1="60" x2="540" y2="200"/>
      <line class="wire" x1="80" y1="200" x2="540" y2="200"/>
      <line class="wire" x1="80" y1="60" x2="80" y2="120"/>
      <line class="wire" x1="80" y1="140" x2="80" y2="200"/>

      <!-- 电池 -->
      <line x1="65" y1="120" x2="95" y2="120" stroke="#4ade80" stroke-width="3"/>
      <line x1="70" y1="140" x2="90" y2="140" stroke="#4ade80" stroke-width="2"/>
      <text x="50" y="134" text-anchor="middle" class="vd-label rise" style="font-size:13px;font-weight:600">+</text>
      <text x="50" y="148" text-anchor="middle" class="vd-label dim" style="font-size:11px">−</text>
      <text x="30" y="134" text-anchor="middle" class="vd-label rise" transform="rotate(-90 30 130)">U = 10V</text>

      <!-- R1 -->
      <rect x="200" y="48" width="120" height="24" rx="4" fill="#272727" stroke="#fbbf24" stroke-width="2"/>
      <text x="260" y="40" text-anchor="middle" class="vd-label drop">R₁ = {{ fmt(R1, 'Ω') }}</text>

      <!-- R2 -->
      <rect x="420" y="48" width="60" height="24" rx="4" fill="#272727" stroke="#fbbf24" stroke-width="2"/>
      <text x="450" y="40" text-anchor="middle" class="vd-label drop">R₂=2Ω</text>

      <!-- 电压标签 -->
      <text x="260" y="92" text-anchor="middle" class="vd-label drop">U₁ = {{ fmt(U1) }}</text>
      <text x="450" y="92" text-anchor="middle" class="vd-label drop">U₂ = {{ fmt(U2) }}</text>

      <!-- 电流箭头 -->
      <text x="300" y="225" text-anchor="middle" class="vd-label dim" style="font-size:12px">I = {{ fmt(I, 'A') }}（串联电流处处相等）</text>
    </svg>

    <div class="controls">
      <label>拖动 R₁（电阻值）<span class="val">{{ fmt(R1, 'Ω') }}</span></label>
      <input type="range" min="1" max="10" step="0.5" v-model.number="R1">
    </div>

    <div class="equation">
      <div class="eq-row">
        <span class="eq-title">推导过程：</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">① 串联总电阻：R_eq = R₁ + R₂ = {{ fmt(R1+R2, 'Ω') }}</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">② 由欧姆定律：I = U / R_eq = 10 / {{ fmt(R1+R2, 'Ω') }} = <span class="num">{{ fmt(I, 'A') }}</span></span>
      </div>
      <div class="eq-row">
        <span class="eq-step">③ 分压：U₁ = I·R₁ = {{ fmt(I, 'A') }} × {{ fmt(R1, 'Ω') }} = <span class="num drop">{{ fmt(U1) }}</span></span>
      </div>
      <div class="eq-row">
        <span class="eq-step">④ 分压：U₂ = I·R₂ = {{ fmt(I, 'A') }} × 2Ω = <span class="num drop">{{ fmt(U2) }}</span></span>
      </div>
      <div class="eq-row">
        <span class="eq-sign">⇒</span>
        <span>U₁ + U₂ = {{ fmt(U1+U2) }} = U ✓</span>
        <span class="check">分压公式验证成立</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const R1 = ref(3)
const R2 = 2.0
const U = 10.0

const Req = computed(() => R1.value + R2)
const I = computed(() => U / Req.value)
const U1 = computed(() => I.value * R1.value)
const U2 = computed(() => I.value * R2)

const fmt = (v, unit = 'V') => v.toFixed(1) + ' ' + unit
</script>

<style scoped>
.vd-demo { background: var(--vp-code-bg, #1f1f1f); border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid var(--vp-c-divider, #333); }
.demo-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.demo-sub { font-size: 13px; color: var(--vp-c-text-2, #9b9b9b); margin-bottom: 16px; line-height: 1.5; }
.circuit { width: 100%; height: auto; display: block; margin-bottom: 16px; }
.wire { stroke: #555; stroke-width: 2; fill: none; }
.vd-label { font-family: Manrope, monospace; font-size: 13px; }
.vd-label.dim { fill: var(--vp-c-text-2, #9b9b9b); }
.vd-label.rise { fill: #4ade80; }
.vd-label.drop { fill: #fbbf24; }
.controls { background: var(--vp-code-bg, #272727); border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
.controls label { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: var(--vp-c-text-1, #f5f5f5); }
.controls label .val { color: #448aff; font-weight: 600; font-variant-numeric: tabular-nums; }
.controls input[type=range] { width: 100%; accent-color: #448aff; cursor: pointer; }
.equation { background: rgba(68,138,255,0.08); border-radius: 8px; padding: 12px 16px; font-size: 13px; line-height: 2; }
.eq-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.eq-title { font-weight: 600; color: var(--vp-c-text-1, #f5f5f5); }
.eq-step { color: var(--vp-c-text-2, #9b9b9b); }
.num { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--vp-c-text-1, #f5f5f5); }
.num.drop { color: #fbbf24; }
.eq-sign { color: var(--vp-c-text-2, #9b9b9b); }
.check { color: #4ade80; font-weight: 600; }
</style>

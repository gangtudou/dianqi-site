<template>
  <div class="kcl-demo">
    <div class="demo-title">🎮 动手玩：KCL 节点电流守恒</div>
    <div class="demo-sub">绿色=流入，黄色=流出。拖动滑块，看支路电流自动重新分配——等式永远成立。</div>

    <svg viewBox="0 0 600 360" class="circuit">
      <defs>
        <marker id="kcl-arr-in" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#4ade80"/>
        </marker>
        <marker id="kcl-arr-out" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24"/>
        </marker>
      </defs>

      <circle cx="300" cy="180" r="12" fill="white"/>
      <text x="300" y="210" text-anchor="middle" class="kcl-label dim" style="font-size:12px">节点 N</text>

      <line :stroke-width="w(I1)" class="branch-line" x1="90" y1="60" x2="288" y2="172" stroke="#4ade80" marker-end="url(#kcl-arr-in)"/>
      <text x="95" y="50" text-anchor="start" class="kcl-label in">I₁ = {{ fmt(I1) }}</text>

      <line stroke-width="3" class="branch-line" x1="90" y1="300" x2="288" y2="188" stroke="#4ade80" marker-end="url(#kcl-arr-in)"/>
      <text x="95" y="320" text-anchor="start" class="kcl-label in">I₂ = 2.0 A（固定）</text>

      <line :stroke-width="w(I3)" class="branch-line" x1="312" y1="172" x2="510" y2="60" stroke="#fbbf24" marker-end="url(#kcl-arr-out)"/>
      <text x="505" y="50" text-anchor="end" class="kcl-label out">I₃ = {{ fmt(I3) }}</text>

      <line :stroke-width="w(I4)" class="branch-line" x1="312" y1="188" x2="510" y2="300" stroke="#fbbf24" marker-end="url(#kcl-arr-out)"/>
      <text x="505" y="320" text-anchor="end" class="kcl-label out">I₄ = {{ fmt(I4) }}</text>
    </svg>

    <div class="controls">
      <label>拖动 I₁（流入电流）<span class="val">{{ fmt(I1) }}</span></label>
      <input type="range" min="0" max="10" step="0.1" v-model.number="I1">
    </div>

    <div class="equation">
      <div class="eq-row">
        <span class="dot in"></span>
        <span>流入：I₁ + I₂ =</span>
        <span class="num in">{{ fmt(Iin) }}</span>
      </div>
      <div class="eq-row">
        <span class="dot out"></span>
        <span>流出：I₃ + I₄ =</span>
        <span class="num out">{{ fmt(Iin) }}</span>
      </div>
      <div class="eq-row">
        <span class="eq-sign">⇒</span>
        <span>ΣI流入 = ΣI流出</span>
        <span class="check">✓ 等式成立</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const I1 = ref(4)
const I2 = 2.0

const Iin = computed(() => I1.value + I2)
const I3 = computed(() => Iin.value * 0.6)
const I4 = computed(() => Iin.value * 0.4)

const fmt = (v) => v.toFixed(1) + ' A'
const w = (I) => Math.max(1.5, 1.5 + I * 0.5)
</script>

<style scoped>
.kcl-demo {
  background: var(--vp-code-bg, #1f1f1f);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider, #333);
}
.demo-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}
.demo-sub {
  font-size: 13px;
  color: var(--vp-c-text-2, #9b9b9b);
  margin-bottom: 16px;
  line-height: 1.5;
}
.circuit { width: 100%; height: auto; display: block; margin-bottom: 16px; }
.branch-line { transition: stroke-width 200ms cubic-bezier(0.23, 1, 0.32, 1); }
.kcl-label { font-family: Manrope, monospace; font-size: 13px; }
.kcl-label.dim { fill: var(--vp-c-text-2, #9b9b9b); }
.kcl-label.in { fill: #4ade80; }
.kcl-label.out { fill: #fbbf24; }
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
.dot.in { background: #4ade80; }
.dot.out { background: #fbbf24; }
.num { font-variant-numeric: tabular-nums; font-weight: 600; }
.num.in { color: #4ade80; }
.num.out { color: #fbbf24; }
.eq-sign { color: var(--vp-c-text-2, #9b9b9b); }
.check { color: #4ade80; font-weight: 600; }
@media (prefers-reduced-motion: reduce) {
  .branch-line { transition: none; }
}
</style>

<template>
  <div class="te-demo">
    <div class="demo-title">🎮 动手玩：三要素法——一阶电路指数曲线</div>
    <div class="demo-sub">电容充电曲线：从初始值 y(0⁺) 指数上升到稳态值 y(∞)。拖滑块调时间常数 τ，看曲线上升快慢——t=τ 时完成 63.2%，t=5τ 基本稳定。</div>

    <svg viewBox="0 0 600 280" class="chart">
      <!-- 坐标轴 -->
      <line x1="60" y1="240" x2="560" y2="240" stroke="#555" stroke-width="1.5"/>
      <line x1="60" y1="40" x2="60" y2="240" stroke="#555" stroke-width="1.5"/>
      <text x="310" y="265" text-anchor="middle" class="te-axis">时间 t →</text>
      <text x="30" y="140" text-anchor="middle" class="te-axis" transform="rotate(-90 30 140)">y(t)</text>

      <!-- 稳态值虚线 -->
      <line x1="60" y1="60" x2="560" y2="60" stroke="#4ade80" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>
      <text x="560" y="55" text-anchor="end" class="te-label rise">y(∞) = 10V</text>

      <!-- 初始值点 -->
      <circle cx="60" cy="220" r="4" fill="#fbbf24"/>
      <text x="70" y="235" class="te-label drop">y(0⁺) = 1V</text>

      <!-- 充电曲线 -->
      <path :d="curvePath" fill="none" stroke="#448aff" stroke-width="3"/>

      <!-- t=τ 标记 -->
      <line :x1="tauX" y1="60" :x2="tauX" y2="240" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>
      <circle :cx="tauX" :cy="tauY" r="5" fill="#fbbf24"/>
      <text :x="tauX + 8" y="tauY - 8" class="te-label drop">t=τ：6.3V（63.2%）</text>
    </svg>

    <div class="controls">
      <label>拖动时间常数 τ（秒）<span class="val">{{ tau.toFixed(1) }} s</span></label>
      <input type="range" min="0.5" max="5" step="0.1" v-model.number="tau">
    </div>

    <div class="equation">
      <div class="eq-row">
        <span class="eq-title">三要素公式：</span>
      </div>
      <div class="eq-row">
        <span class="eq-formula">f(t) = f(∞) + [f(0⁺) − f(∞)] · e^(−t/τ)</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">① 初值 f(0⁺) = 1V（电容电压不能突变，换路前为 0，假设电源接上前充了 1V）</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">② 稳态值 f(∞) = 10V（t→∞ 时电容开路，电压等于电源）</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">③ 时间常数 τ = {{ tau.toFixed(1) }}s（τ = R·C，R 越大或 C 越大，充电越慢）</span>
      </div>
      <div class="eq-row">
        <span class="eq-sign">⇒</span>
        <span>t=τ 时完成 63.2%；t=5τ ≈ {{ (5*tau).toFixed(1) }}s 时基本稳定</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tau = ref(2)
const y0 = 1.0, yInf = 10.0

// 曲线：f(t) = yInf + (y0 - yInf) * exp(-t/tau)
// SVG 坐标：x = 60 + t * 100（t 从 0 到 5τ），y = 240 - f(t) * 18（y 从 0 到 10V）
const curvePath = computed(() => {
  const tMax = 5 * tau.value
  const points = []
  for (let t = 0; t <= tMax; t += tMax / 50) {
    const f = yInf + (y0 - yInf) * Math.exp(-t / tau.value)
    const x = 60 + t * (500 / (5 * tau.value))
    const y = 240 - f * 18
    points.push(`${t === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return points.join(' ')
})

// t=τ 时的点
const tauX = computed(() => 60 + tau.value * (500 / (5 * tau.value)))
const tauY = computed(() => 240 - (yInf + (y0 - yInf) * Math.exp(-1)) * 18)
</script>

<style scoped>
.te-demo { background: var(--vp-code-bg, #1f1f1f); border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid var(--vp-c-divider, #333); }
.demo-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.demo-sub { font-size: 13px; color: var(--vp-c-text-2, #9b9b9b); margin-bottom: 16px; line-height: 1.5; }
.chart { width: 100%; height: auto; display: block; margin-bottom: 16px; }
.te-axis { font-family: Manrope, monospace; font-size: 11px; fill: var(--vp-c-text-2, #9b9b9b); }
.te-label { font-family: Manrope, monospace; font-size: 12px; }
.te-label.rise { fill: #4ade80; }
.te-label.drop { fill: #fbbf24; }
.controls { background: var(--vp-code-bg, #272727); border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
.controls label { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: var(--vp-c-text-1, #f5f5f5); }
.controls label .val { color: #448aff; font-weight: 600; font-variant-numeric: tabular-nums; }
.controls input[type=range] { width: 100%; accent-color: #448aff; cursor: pointer; }
.equation { background: rgba(68,138,255,0.08); border-radius: 8px; padding: 12px 16px; font-size: 13px; line-height: 2; }
.eq-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.eq-title { font-weight: 600; color: var(--vp-c-text-1, #f5f5f5); }
.eq-formula { font-family: Manrope, monospace; font-size: 14px; color: #448aff; font-weight: 600; }
.eq-step { color: var(--vp-c-text-2, #9b9b9b); }
.eq-sign { color: var(--vp-c-text-2, #9b9b9b); }
</style>

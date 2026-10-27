<template>
  <div class="ph-demo">
    <div class="demo-title">🎮 动手玩：相量 = 旋转的正弦波</div>
    <div class="demo-sub">左边是旋转的相量（箭头），右边是对应的正弦波。拖滑块调初相 φ，看相量初始位置怎么影响正弦波起点——相量不是抽象复数，就是"旋转的那个东西"。</div>

    <svg viewBox="0 0 600 320" class="chart">
      <!-- 左：相量图 -->
      <text x="150" y="25" text-anchor="middle" class="ph-title">相量图（旋转的箭头）</text>
      <circle cx="150" cy="160" r="80" fill="none" stroke="#444" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="70" y1="160" x2="230" y2="160" stroke="#555" stroke-width="1"/>
      <line x1="150" y1="80" x2="150" y2="240" stroke="#555" stroke-width="1"/>
      <!-- 相量箭头（从中心出发，角度随动画） -->
      <line x1="150" y1="160" :x2="arrowX" :y2="arrowY" stroke="#448aff" stroke-width="3"/>
      <circle :cx="arrowX" :cy="arrowY" r="5" fill="#448aff"/>
      <!-- 初相角标注 -->
      <path :d="phiArc" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="2 2"/>
      <text x="185" y="140" class="ph-label drop">φ = {{ phi.toFixed(0) }}°</text>

      <!-- 右：波形图 -->
      <text x="430" y="25" text-anchor="middle" class="ph-title">对应的正弦波</text>
      <line x1="320" y1="160" x2="560" y2="160" stroke="#555" stroke-width="1"/>
      <line x1="320" y1="80" x2="320" y2="240" stroke="#555" stroke-width="1"/>
      <!-- 正弦曲线 -->
      <path :d="wavePath" fill="none" stroke="#4ade80" stroke-width="2.5"/>
      <!-- 当前时刻的点（随动画） -->
      <circle :cx="dotX" :cy="dotY" r="5" fill="#4ade80"/>
      <text x="430" y="265" text-anchor="middle" class="ph-label dim">u(t) = U_m · sin(ωt + φ)</text>
    </svg>

    <div class="controls">
      <label>拖动初相 φ（度）<span class="val">{{ phi.toFixed(0) }}°</span></label>
      <input type="range" min="-90" max="90" step="5" v-model.number="phi">
    </div>

    <div class="equation">
      <div class="eq-row">
        <span class="eq-title">相量法的本质：</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">① 正弦量 u(t) = U_m · sin(ωt + φ) 是时间的函数</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">② 相量 Û = U∠φ 是复数（有效值 U，角度 φ），省略了 ω（因为所有同频率的量 ω 都一样）</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">③ 相量旋转一圈 = 正弦波走一个周期；相量在 y 轴的投影 = 正弦波的瞬时值</span>
      </div>
      <div class="eq-row">
        <span class="eq-sign">⇒</span>
        <span>微分方程 → 复数代数方程，一劳永逸</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const phi = ref(30)  // 初相角（度）
const omega = ref(0)  // 动画相位（弧度），随时间旋转

let rafId = null
let lastTime = 0
function animate(time) {
  if (!lastTime) lastTime = time
  const dt = (time - lastTime) / 1000
  omega.value += dt * 1.5  // 旋转速度
  lastTime = time
  rafId = requestAnimationFrame(animate)
}
onMounted(() => { rafId = requestAnimationFrame(animate) })
onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })

// 相量箭头终点（半径 80）
const arrowX = computed(() => 150 + 80 * Math.cos(omega.value + phi.value * Math.PI / 180))
const arrowY = computed(() => 160 - 80 * Math.sin(omega.value + phi.value * Math.PI / 180))

// 初相角弧线
const phiArc = computed(() => {
  const r = 30
  const phiRad = phi.value * Math.PI / 180
  const x2 = 150 + r * Math.cos(phiRad)
  const y2 = 160 - r * Math.sin(phiRad)
  return `M 150 160 L ${x2} ${y2}`
})

// 正弦波曲线（一个周期）
const wavePath = computed(() => {
  const points = []
  const period = 240  // 像素宽度对应 2π
  for (let x = 0; x <= period; x += 4) {
    const t = x / period * 2 * Math.PI
    const y = 160 - 60 * Math.sin(t + phi.value * Math.PI / 180)
    points.push(`${x === 0 ? 'M' : 'L'} ${320 + x} ${y.toFixed(1)}`)
  }
  return points.join(' ')
})

// 当前时刻对应的波形点
const dotX = computed(() => 320 + (omega.value / (2 * Math.PI)) * 240)
const dotY = computed(() => 160 - 60 * Math.sin(omega.value + phi.value * Math.PI / 180))
</script>

<style scoped>
.ph-demo { background: var(--vp-code-bg, #1f1f1f); border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid var(--vp-c-divider, #333); }
.demo-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.demo-sub { font-size: 13px; color: var(--vp-c-text-2, #9b9b9b); margin-bottom: 16px; line-height: 1.5; }
.chart { width: 100%; height: auto; display: block; margin-bottom: 16px; }
.ph-title { font-family: Manrope, monospace; font-size: 13px; fill: var(--vp-c-text-1, #f5f5f5); font-weight: 600; }
.ph-label { font-family: Manrope, monospace; font-size: 12px; }
.ph-label.dim { fill: var(--vp-c-text-2, #9b9b9b); }
.ph-label.drop { fill: #fbbf24; }
.controls { background: var(--vp-code-bg, #272727); border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
.controls label { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: var(--vp-c-text-1, #f5f5f5); }
.controls label .val { color: #448aff; font-weight: 600; font-variant-numeric: tabular-nums; }
.controls input[type=range] { width: 100%; accent-color: #448aff; cursor: pointer; }
.equation { background: rgba(68,138,255,0.08); border-radius: 8px; padding: 12px 16px; font-size: 13px; line-height: 2; }
.eq-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.eq-title { font-weight: 600; color: var(--vp-c-text-1, #f5f5f5); }
.eq-step { color: var(--vp-c-text-2, #9b9b9b); }
.eq-sign { color: var(--vp-c-text-2, #9b9b9b); }
</style>

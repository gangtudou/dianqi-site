<template>
  <div class="yd-demo">
    <div class="demo-title">🎮 动手玩：星形（Y）⇄ 三角形（Δ）等效变换</div>
    <div class="demo-sub">对称情况：Y 形三个电阻相等 R_Y，Δ 形三个电阻相等 R_Δ。拖滑块调 R_Y，自动算出 R_Δ = 3·R_Y——对外任意两端口的等效电阻完全一样，所以两种接法"等效"。</div>

    <svg viewBox="0 0 600 320" class="circuit">
      <!-- 左：Y 形 -->
      <text x="150" y="25" text-anchor="middle" class="yd-title">星形 Y</text>
      <!-- 共节点 -->
      <circle cx="150" cy="160" r="6" fill="white"/>
      <!-- 三个端口 -->
      <circle cx="150" cy="80" r="5" fill="#448aff"/>
      <circle cx="90" cy="240" r="5" fill="#448aff"/>
      <circle cx="210" cy="240" r="5" fill="#448aff"/>
      <text x="150" y="70" text-anchor="middle" class="yd-label accent">端口 1</text>
      <text x="75" y="260" text-anchor="middle" class="yd-label accent">端口 2</text>
      <text x="225" y="260" text-anchor="middle" class="yd-label accent">端口 3</text>
      <!-- 三条 Y 支路 -->
      <line x1="150" y1="86" x2="150" y2="130" stroke="#fbbf24" stroke-width="2"/>
      <rect x="135" y="100" width="30" height="20" rx="3" fill="#272727" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="150" y="114" text-anchor="middle" class="yd-label drop" style="font-size:10px">R_Y</text>

      <line x1="145" y1="165" x2="105" y2="220" stroke="#fbbf24" stroke-width="2"/>
      <rect x="105" y="185" width="25" height="18" rx="3" fill="#272727" stroke="#fbbf24" stroke-width="1.5" transform="rotate(-45 117 194)"/>
      <text x="100" y="205" text-anchor="middle" class="yd-label drop" style="font-size:10px">R_Y</text>

      <line x1="155" y1="165" x2="195" y2="220" stroke="#fbbf24" stroke-width="2"/>
      <rect x="170" y="185" width="25" height="18" rx="3" fill="#272727" stroke="#fbbf24" stroke-width="1.5" transform="rotate(45 182 194)"/>
      <text x="200" y="205" text-anchor="middle" class="yd-label drop" style="font-size:10px">R_Y</text>

      <!-- 变换箭头 -->
      <text x="300" y="165" text-anchor="middle" class="yd-arrow">⇄</text>
      <text x="300" y="190" text-anchor="middle" class="yd-arrow-label">R_Δ = 3·R_Y</text>

      <!-- 右：Δ 形 -->
      <text x="450" y="25" text-anchor="middle" class="yd-title">三角形 Δ</text>
      <!-- 三个顶点（端口） -->
      <circle cx="450" cy="80" r="5" fill="#448aff"/>
      <circle cx="380" cy="250" r="5" fill="#448aff"/>
      <circle cx="520" cy="250" r="5" fill="#448aff"/>
      <text x="450" y="70" text-anchor="middle" class="yd-label accent">端口 1</text>
      <text x="365" y="270" text-anchor="middle" class="yd-label accent">端口 2</text>
      <text x="535" y="270" text-anchor="middle" class="yd-label accent">端口 3</text>
      <!-- 三条 Δ 边 -->
      <line x1="450" y1="85" x2="385" y2="245" stroke="#fbbf24" stroke-width="2"/>
      <line x1="450" y1="85" x2="515" y2="245" stroke="#fbbf24" stroke-width="2"/>
      <line x1="385" y1="250" x2="515" y2="250" stroke="#fbbf24" stroke-width="2"/>
      <!-- Δ 边电阻标注 -->
      <text x="395" y="170" text-anchor="middle" class="yd-label drop" style="font-size:10px" transform="rotate(-65 395 170)">R_Δ</text>
      <text x="505" y="170" text-anchor="middle" class="yd-label drop" style="font-size:10px" transform="rotate(65 505 170)">R_Δ</text>
      <text x="450" y="240" text-anchor="middle" class="yd-label drop" style="font-size:10px">R_Δ</text>

      <!-- 端口等效验证标注 -->
      <text x="150" y="295" text-anchor="middle" class="yd-label dim">端口1-2间 = 2·R_Y = {{ fmt(2*RY,'Ω') }}</text>
      <text x="450" y="295" text-anchor="middle" class="yd-label dim">端口1-2间 = {{ fmt(2*RD/3,'Ω') }}</text>
    </svg>

    <div class="controls">
      <label>拖动 Y 形电阻 R_Y（每个臂）<span class="val">{{ fmt(RY,'Ω') }}</span></label>
      <input type="range" min="1" max="10" step="0.5" v-model.number="RY">
    </div>

    <div class="equation">
      <div class="eq-row">
        <span class="eq-title">变换推导：</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">① Y 形端口 1-2 间：R_Y + R_Y = 2·R_Y = <span class="num">{{ fmt(2*RY,'Ω') }}</span>（两个 Y 臂串联，中间共节点）</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">② Δ 形端口 1-2 间：R_Δ 并联 (R_Δ + R_Δ) = 2·R_Δ/3 = <span class="num">{{ fmt(2*RD/3,'Ω') }}</span>（直接边和另外两条边串联后并联）</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">③ 等效要求：2·R_Y = 2·R_Δ/3 → R_Δ = 3·R_Y = <span class="num drop">{{ fmt(RD,'Ω') }}</span></span>
      </div>
      <div class="eq-row">
        <span class="check">✓ 两种接法对外完全一样——这就是"等效变换"</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const RY = ref(3)
const RD = computed(() => 3 * RY.value)

const fmt = (v, unit = 'Ω') => v.toFixed(1) + ' ' + unit
</script>

<style scoped>
.yd-demo { background: var(--vp-code-bg, #1f1f1f); border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid var(--vp-c-divider, #333); }
.demo-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.demo-sub { font-size: 13px; color: var(--vp-c-text-2, #9b9b9b); margin-bottom: 16px; line-height: 1.5; }
.circuit { width: 100%; height: auto; display: block; margin-bottom: 16px; }
.yd-title { font-family: Manrope, monospace; font-size: 14px; fill: var(--vp-c-text-1, #f5f5f5); font-weight: 600; }
.yd-label { font-family: Manrope, monospace; font-size: 11px; }
.yd-label.dim { fill: var(--vp-c-text-2, #9b9b9b); }
.yd-label.drop { fill: #fbbf24; }
.yd-label.accent { fill: #448aff; font-weight: 600; }
.yd-arrow { font-size: 28px; fill: #4ade80; font-weight: 600; }
.yd-arrow-label { font-family: Manrope, monospace; font-size: 11px; fill: #4ade80; font-weight: 600; }
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
.check { color: #4ade80; font-weight: 600; }
</style>

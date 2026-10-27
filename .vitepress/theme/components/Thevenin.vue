<template>
  <div class="th-demo">
    <div class="demo-title">🎮 动手玩：戴维南等效——两边端口表现完全一致</div>
    <div class="demo-sub">左边是含源一端口（电压源 u_s 串内阻 R_eq），右边是戴维南等效电路（开路电压 u_oc 串同样的 R_eq）。拖滑块调负载 R_L，两边的端口电压、电流始终相等——这就是"等效"的含义。</div>

    <svg viewBox="0 0 600 340" class="circuit">
      <!-- 左：原电路 -->
      <text x="150" y="30" text-anchor="middle" class="th-title">原电路（含源一端口）</text>
      <line class="wire" x1="60" y1="80" x2="120" y2="80"/>
      <line class="wire" x1="180" y1="80" x2="240" y2="80"/>
      <line class="wire" x1="240" y1="80" x2="240" y2="240"/>
      <line class="wire" x1="60" y1="240" x2="240" y2="240"/>
      <line class="wire" x1="60" y1="80" x2="60" y2="130"/>
      <line class="wire" x1="60" y1="150" x2="60" y2="240"/>
      <!-- 电压源 -->
      <line x1="45" y1="130" x2="75" y2="130" stroke="#4ade80" stroke-width="3"/>
      <line x1="50" y1="150" x2="70" y2="150" stroke="#4ade80" stroke-width="2"/>
      <text x="30" y="144" text-anchor="middle" class="th-label rise" transform="rotate(-90 30 140)">u_s=12V</text>
      <!-- 内阻 Rs -->
      <rect x="120" y="68" width="60" height="24" rx="4" fill="#272727" stroke="#fbbf24" stroke-width="2"/>
      <text x="150" y="60" text-anchor="middle" class="th-label drop">R_eq=2Ω</text>
      <!-- 负载 RL（左端口） -->
      <rect x="225" y="140" width="30" height="60" rx="4" fill="#272727" stroke="#448aff" stroke-width="2"/>
      <text x="270" y="175" text-anchor="start" class="th-label accent">R_L={{ fmt(RL,'Ω') }}</text>
      <!-- 左端口电压 -->
      <text x="150" y="290" text-anchor="middle" class="th-label accent">端口：{{ fmt(Vload) }} / {{ fmt(Iload,'A') }}</text>

      <!-- 右：等效电路 -->
      <text x="450" y="30" text-anchor="middle" class="th-title">戴维南等效</text>
      <line class="wire" x1="360" y1="80" x2="420" y2="80"/>
      <line class="wire" x1="480" y1="80" x2="540" y2="80"/>
      <line class="wire" x1="540" y1="80" x2="540" y2="240"/>
      <line class="wire" x1="360" y1="240" x2="540" y2="240"/>
      <line class="wire" x1="360" y1="80" x2="360" y2="130"/>
      <line class="wire" x1="360" y1="150" x2="360" y2="240"/>
      <!-- 等效电压源 u_oc = u_s = 12V -->
      <line x1="345" y1="130" x2="375" y2="130" stroke="#4ade80" stroke-width="3"/>
      <line x1="350" y1="150" x2="370" y2="150" stroke="#4ade80" stroke-width="2"/>
      <text x="330" y="144" text-anchor="middle" class="th-label rise" transform="rotate(-90 330 140)">u_oc=12V</text>
      <!-- 等效内阻 2Ω -->
      <rect x="420" y="68" width="60" height="24" rx="4" fill="#272727" stroke="#fbbf24" stroke-width="2"/>
      <text x="450" y="60" text-anchor="middle" class="th-label drop">R_eq=2Ω</text>
      <!-- 负载 RL（右端口） -->
      <rect x="525" y="140" width="30" height="60" rx="4" fill="#272727" stroke="#448aff" stroke-width="2"/>
      <text x="560" y="175" text-anchor="start" class="th-label accent">R_L={{ fmt(RL,'Ω') }}</text>
      <!-- 右端口电压 -->
      <text x="450" y="290" text-anchor="middle" class="th-label accent">端口：{{ fmt(Vload) }} / {{ fmt(Iload,'A') }}</text>

      <!-- 中间"≈"号 -->
      <text x="300" y="180" text-anchor="middle" class="th-eq">≈</text>
    </svg>

    <div class="controls">
      <label>拖动负载 R_L<span class="val">{{ fmt(RL,'Ω') }}</span></label>
      <input type="range" min="1" max="20" step="0.5" v-model.number="RL">
    </div>

    <div class="equation">
      <div class="eq-row">
        <span class="eq-title">推导：</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">① 开路电压：u_oc = u_s = 12V（端口开路时负载电流=0，内阻压降=0）</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">② 等效内阻：R_eq = 2Ω（电压源短路后从端口看入）</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">③ 接负载后：I = u_oc / (R_eq + R_L) = 12 / (2 + {{ fmt(RL,'Ω') }}) = <span class="num">{{ fmt(Iload,'A') }}</span></span>
      </div>
      <div class="eq-row">
        <span class="eq-step">④ 端口电压：V = I × R_L = <span class="num">{{ fmt(Vload) }}</span></span>
      </div>
      <div class="eq-row">
        <span class="check">✓ 左右两边端口完全一致——这就是"等效"</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const RL = ref(4)
const us = 12.0, Req = 2.0

const Iload = computed(() => us / (Req + RL.value))
const Vload = computed(() => Iload.value * RL.value)

const fmt = (v, unit = 'V') => v.toFixed(1) + ' ' + unit
</script>

<style scoped>
.th-demo { background: var(--vp-code-bg, #1f1f1f); border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid var(--vp-c-divider, #333); }
.demo-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.demo-sub { font-size: 13px; color: var(--vp-c-text-2, #9b9b9b); margin-bottom: 16px; line-height: 1.5; }
.circuit { width: 100%; height: auto; display: block; margin-bottom: 16px; }
.wire { stroke: #555; stroke-width: 2; fill: none; }
.th-title { font-family: Manrope, monospace; font-size: 13px; fill: var(--vp-c-text-1, #f5f5f5); font-weight: 600; }
.th-label { font-family: Manrope, monospace; font-size: 12px; }
.th-label.rise { fill: #4ade80; }
.th-label.drop { fill: #fbbf24; }
.th-label.accent { fill: #448aff; }
.th-eq { font-size: 32px; fill: #448aff; font-weight: 600; }
.controls { background: var(--vp-code-bg, #272727); border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
.controls label { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: var(--vp-c-text-1, #f5f5f5); }
.controls label .val { color: #448aff; font-weight: 600; font-variant-numeric: tabular-nums; }
.controls input[type=range] { width: 100%; accent-color: #448aff; cursor: pointer; }
.equation { background: rgba(68,138,255,0.08); border-radius: 8px; padding: 12px 16px; font-size: 13px; line-height: 2; }
.eq-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.eq-title { font-weight: 600; color: var(--vp-c-text-1, #f5f5f5); }
.eq-step { color: var(--vp-c-text-2, #9b9b9b); }
.num { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--vp-c-text-1, #f5f5f5); }
.check { color: #4ade80; font-weight: 600; }
</style>

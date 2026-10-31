<template>
  <div class="cs-demo">
    <div class="demo-title">🎮 动手玩：受控源的四种类型</div>
    <div class="demo-sub">受控源的输出量不由自己定，而是跟着电路另一处的"控制量"走。点下面切换四种类型，拖动控制量和系数，看受控输出怎么跟着变化。</div>

    <!-- 类型切换 -->
    <div class="tabs">
      <button v-for="(t, key) in types" :key="key"
        :class="['tab', { active: current === key }]"
        @click="current = key">{{ key }}</button>
    </div>
    <div class="type-name">{{ types[current].name }}</div>

    <svg viewBox="0 0 600 280" class="circuit">
      <!-- 左：控制支路 -->
      <text x="150" y="28" text-anchor="middle" class="cs-title">控制支路（控制量在这里）</text>

      <!-- 电压控制：开路端口，标 u₁ -->
      <template v-if="types[current].ctrlKind === 'voltage'">
        <circle cx="110" cy="140" r="5" fill="#448aff"/>
        <circle cx="190" cy="140" r="5" fill="#448aff"/>
        <line x1="110" y1="140" x2="190" y2="140" stroke="#448aff" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="150" y="125" text-anchor="middle" class="cs-label accent">控制电压 u₁ = {{ ctrl.toFixed(1) }} V</text>
        <text x="150" y="175" text-anchor="middle" class="cs-label dim">（开路端口，只取电压、不取电流）</text>
      </template>

      <!-- 电流控制：导线 + 电流箭头 -->
      <template v-else>
        <line x1="80" y1="140" x2="220" y2="140" stroke="#448aff" stroke-width="2"/>
        <line x1="150" y1="140" x2="150" y2="140" stroke="#448aff" stroke-width="2"/>
        <path d="M 120 132 L 150 140 L 120 148" fill="none" stroke="#448aff" stroke-width="2"/>
        <text x="150" y="125" text-anchor="middle" class="cs-label accent">控制电流 i₁ = {{ ctrl.toFixed(1) }} A</text>
        <text x="150" y="175" text-anchor="middle" class="cs-label dim">（支路电流就是控制量）</text>
      </template>

      <!-- 中间控制关系虚线箭头 -->
      <line x1="230" y1="140" x2="330" y2="140" stroke="#4ade80" stroke-width="2" stroke-dasharray="6 4"/>
      <path d="M 322 133 L 334 140 L 322 147" fill="none" stroke="#4ade80" stroke-width="2"/>
      <text x="280" y="125" text-anchor="middle" class="cs-label rise">控制</text>

      <!-- 右：受控支路（闭合回路：菱形源 + 负载电阻） -->
      <text x="450" y="28" text-anchor="middle" class="cs-title">受控支路（输出受控量）</text>
      <!-- 回路框 -->
      <line x1="370" y1="80" x2="530" y2="80" stroke="#888" stroke-width="1.5"/>
      <line x1="370" y1="80" x2="370" y2="210" stroke="#888" stroke-width="1.5"/>
      <line x1="530" y1="80" x2="530" y2="210" stroke="#888" stroke-width="1.5"/>
      <line x1="370" y1="210" x2="530" y2="210" stroke="#888" stroke-width="1.5"/>
      <!-- 菱形受控源（左侧） -->
      <polygon points="370,145 395,120 420,145 395,170" fill="#272727" stroke="#fbbf24" stroke-width="2"/>
      <!-- 电压源：菱形内 + − -->
      <template v-if="types[current].outKind === 'voltage'">
        <text x="386" y="150" class="cs-label drop" style="font-size:11px">+</text>
        <text x="404" y="150" class="cs-label drop" style="font-size:11px">−</text>
        <text x="395" y="195" text-anchor="middle" class="cs-label drop">u₂ = {{ out.toFixed(2) }} V</text>
      </template>
      <!-- 电流源：菱形内箭头 -->
      <template v-else>
        <path d="M 388 150 L 402 145 L 388 140" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="395" y="195" text-anchor="middle" class="cs-label drop">i₂ = {{ out.toFixed(2) }} A</text>
      </template>
      <!-- 负载电阻（右侧） -->
      <rect x="510" y="125" width="40" height="40" rx="3" fill="#272727" stroke="#888" stroke-width="1.5"/>
      <text x="530" y="150" text-anchor="middle" class="cs-label dim" style="font-size:10px">R_L</text>
    </svg>

    <!-- 滑块 -->
    <div class="controls">
      <label>拖动{{ types[current].ctrl }}<span class="val">{{ ctrl.toFixed(1) }} {{ types[current].ctrlUnit }}</span></label>
      <input type="range" :min="0" :max="types[current].ctrlMax" step="0.1" v-model.number="ctrl">
      <label>拖动控制系数<span class="val">{{ coef.toFixed(2) }} {{ types[current].coefUnit }}</span></label>
      <input type="range" :min="0.1" :max="types[current].coefMax" step="0.1" v-model.number="coef">
    </div>

    <div class="equation">
      <div class="eq-row">
        <span class="eq-title">当前公式：</span>
        <span class="eq-formula">{{ types[current].formula }}</span>
      </div>
      <div class="eq-row">
        <span class="eq-step">系数含义：{{ types[current].coef }}</span>
      </div>
      <div class="eq-row">
        <span class="eq-sign">⇒</span>
        <span>代入数值：{{ types[current].out }} = {{ coef.toFixed(2) }} × {{ ctrl.toFixed(1) }} = <b class="drop">{{ out.toFixed(2) }} {{ types[current].outUnit }}</b></span>
      </div>
    </div>

    <!-- 四种类型对照表 -->
    <table class="cs-table">
      <thead>
        <tr><th>类型</th><th>控制量</th><th>受控量</th><th>关系式</th><th>系数名称 / 单位</th></tr>
      </thead>
      <tbody>
        <tr v-for="(t, key) in types" :key="key" :class="{ rowactive: current === key }">
          <td><b>{{ key }}</b></td><td>{{ t.ctrl }}</td><td>{{ t.out }}</td><td>{{ t.formula }}</td><td>{{ t.coef }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const types = {
  VCVS: {
    name: '电压控制电压源（Voltage-Controlled Voltage Source）',
    ctrl: '控制电压 u₁', out: '受控电压 u₂',
    formula: 'u₂ = μ · u₁',
    coef: 'μ 电压放大倍数（无量纲）', coefUnit: '', coefMax: 5,
    ctrlKind: 'voltage', outKind: 'voltage',
    ctrlUnit: 'V', outUnit: 'V', ctrlMax: 10
  },
  VCCS: {
    name: '电压控制电流源（Voltage-Controlled Current Source）',
    ctrl: '控制电压 u₁', out: '受控电流 i₂',
    formula: 'i₂ = g · u₁',
    coef: 'g 跨导（转移电导，西门子 S）', coefUnit: 'S', coefMax: 2,
    ctrlKind: 'voltage', outKind: 'current',
    ctrlUnit: 'V', outUnit: 'A', ctrlMax: 10
  },
  CCVS: {
    name: '电流控制电压源（Current-Controlled Voltage Source）',
    ctrl: '控制电流 i₁', out: '受控电压 u₂',
    formula: 'u₂ = r · i₁',
    coef: 'r 转移电阻（欧姆 Ω）', coefUnit: 'Ω', coefMax: 10,
    ctrlKind: 'current', outKind: 'voltage',
    ctrlUnit: 'A', outUnit: 'V', ctrlMax: 5
  },
  CCCS: {
    name: '电流控制电流源（Current-Controlled Current Source）',
    ctrl: '控制电流 i₁', out: '受控电流 i₂',
    formula: 'i₂ = α · i₁',
    coef: 'α 电流放大倍数（无量纲）', coefUnit: '', coefMax: 10,
    ctrlKind: 'current', outKind: 'current',
    ctrlUnit: 'A', outUnit: 'A', ctrlMax: 5
  }
}

const current = ref('VCVS')
const ctrl = ref(5)
const coef = ref(2)

// 切换类型时重置系数到该类型默认范围中点
const out = computed(() => coef.value * ctrl.value)
</script>

<style scoped>
.cs-demo { background: var(--vp-code-bg, #1f1f1f); border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid var(--vp-c-divider, #333); }
.demo-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.demo-sub { font-size: 13px; color: var(--vp-c-text-2, #9b9b9b); margin-bottom: 16px; line-height: 1.5; }
.tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.tab { background: var(--vp-code-bg, #272727); color: var(--vp-c-text-2, #9b9b9b); border: 1px solid var(--vp-c-divider, #333); border-radius: 8px; padding: 8px 14px; font-size: 13px; cursor: pointer; transition: transform 160ms ease-out, background 200ms ease, color 200ms ease; }
.tab.active { background: #448aff; color: #fff; border-color: #448aff; }
@media (hover: hover) and (pointer: fine) { .tab:hover { transform: scale(1.04); } }
.tab:active { transform: scale(0.97); }
.type-name { font-size: 13px; color: #448aff; font-weight: 600; margin-bottom: 12px; }
.circuit { width: 100%; height: auto; display: block; margin-bottom: 16px; }
.cs-title { font-family: Manrope, monospace; font-size: 12px; fill: var(--vp-c-text-1, #f5f5f5); font-weight: 600; }
.cs-label { font-family: Manrope, monospace; font-size: 12px; }
.cs-label.dim { fill: var(--vp-c-text-2, #9b9b9b); }
.cs-label.drop { fill: #fbbf24; }
.cs-label.accent { fill: #448aff; font-weight: 600; }
.cs-label.rise { fill: #4ade80; }
.controls { background: var(--vp-code-bg, #272727); border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
.controls label { display: flex; justify-content: space-between; font-size: 13px; margin: 6px 0; color: var(--vp-c-text-1, #f5f5f5); }
.controls label .val { color: #448aff; font-weight: 600; font-variant-numeric: tabular-nums; }
.controls input[type=range] { width: 100%; accent-color: #448aff; cursor: pointer; }
.equation { background: rgba(68,138,255,0.08); border-radius: 8px; padding: 12px 16px; font-size: 13px; line-height: 2; margin-bottom: 16px; }
.eq-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.eq-title { font-weight: 600; color: var(--vp-c-text-1, #f5f5f5); }
.eq-formula { font-family: Manrope, monospace; font-size: 14px; color: #448aff; font-weight: 600; }
.eq-step { color: var(--vp-c-text-2, #9b9b9b); }
.eq-sign { color: var(--vp-c-text-2, #9b9b9b); }
.drop { color: #fbbf24; }
.cs-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.cs-table th, .cs-table td { padding: 8px 10px; border-bottom: 1px solid var(--vp-c-divider, #333); text-align: left; }
.cs-table th { color: var(--vp-c-text-2, #9b9b9b); font-weight: 600; }
.rowactive { background: rgba(68,138,255,0.10); }
</style>

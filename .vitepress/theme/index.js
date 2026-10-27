/**
 * 电气系统自习室 — 自定义主题入口
 * 基于 landing-page-design 与 emilkowalski animate 两套 Skill 的视觉/动效规则构建
 */
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import KclDemo from './components/KclDemo.vue'
import KvlDemo from './components/KvlDemo.vue'
import VoltageDivider from './components/VoltageDivider.vue'
import Thevenin from './components/Thevenin.vue'
import ThreeElement from './components/ThreeElement.vue'
import Phasor from './components/Phasor.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    // 全局注册交互动画组件（md 里直接用 <KclDemo /> <KvlDemo /> 等）
    app.component('KclDemo', KclDemo)
    app.component('KvlDemo', KvlDemo)
    app.component('VoltageDivider', VoltageDivider)
    app.component('Thevenin', Thevenin)
    app.component('ThreeElement', ThreeElement)
    app.component('Phasor', Phasor)

    // SSR 构建阶段无 DOM，全部初始化只在客户端执行
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    // ---------- 滚动揭示（once；只动 transform/opacity） ----------
    // 默认元素完全可见；JS 可用时才加隐藏态（降级：无 JS 也可读）
    function observeReveals() {
      if (typeof IntersectionObserver === 'undefined') return
      const targets = document.querySelectorAll(
        '.reveal-on-scroll:not([data-reveal-bound]), .VPFeature:not([data-reveal-bound])'
      )
      if (!targets.length) return
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              io.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      )
      targets.forEach((el) => {
        el.setAttribute('data-reveal-bound', '1')
        el.classList.add('will-reveal')
        io.observe(el)
      })
    }

    // ---------- 首页大字标语：滚动逐字激活 ----------
    function initSlogan() {
      document.querySelectorAll('.slogan-reveal[data-text]').forEach((block) => {
        if (block.dataset.bound) return
        block.dataset.bound = '1'
        const text = block.dataset.text
        block.innerHTML = ''
        Array.from(text.trim()).forEach((ch, i) => {
          const span = document.createElement('span')
          span.className = 'slogan-word'
          span.textContent = ch === ' ' ? '\u00A0' : ch
          span.style.setProperty('--wi', String(i))
          block.appendChild(span)
        })
        if (typeof IntersectionObserver !== 'undefined') {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  block.classList.add('is-active')
                  io.unobserve(block)
                }
              })
            },
            { threshold: 0.3 }
          )
          io.observe(block)
        } else {
          block.classList.add('is-active')
        }
      })
    }

    initSlogan()
    observeReveals()
    router.onAfterRouteChange = () => {
      initSlogan()
      observeReveals()
    }
  },
}

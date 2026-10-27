import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "电气系统自习室",
  description: "从零基础到精通的电气自学笔记",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '电路原理', link: '/course/电路原理' },
      { text: '电机学', link: '/course/电机学' }
    ],

    sidebar: [
      {
        text: '课程',
        items: [
          { text: '电路原理 · 归纳总结', link: '/course/电路原理' },
          { text: '电机学（发电侧版）· 归纳总结', link: '/course/电机学' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gangtudou/dianqi-site' }
    ]
  }
})

import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/healer-blog/",

  lang: "zh-CN",
  title: "healer's blog",
  description: "个人技术博客",

  theme,

  themeConfig: {
    // 导航栏
    navbar: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "Java",
        children: [
          {
            text: "Java 基础",
            link: "/posts/java/basic/",
          },
          {
            text: "Spring 系列",
            link: "/posts/java/spring/",
          },
          {
            text: "设计模式",
            link: "/posts/java/design-patterns/",
          },
          {
            text: "并发编程",
            link: "/posts/java/concurrent/",
          },
          {
            text: "JVM",
            link: "/posts/java/jvm/",
          },
        ],
      },
      {
        text: "数据库",
        children: [
          {
            text: "MySQL",
            link: "/posts/database/mysql/",
          },
          {
            text: "Redis",
            link: "/posts/database/redis/",
          },
          {
            text: "MongoDB",
            link: "/posts/database/mongodb/",
          },
        ],
      },
      {
        text: "中间件",
        children: [
          {
            text: "消息队列",
            link: "/posts/middleware/mq/",
          },
          {
            text: "注册中心",
            link: "/posts/middleware/registry/",
          },
          {
            text: "网关",
            link: "/posts/middleware/gateway/",
          },
        ],
      },
      {
        text: "架构设计",
        link: "/posts/architecture/",
      },
      {
        text: "开发工具",
        link: "/posts/tools/",
      },
      {
        text: "关于",
        link: "/about/",
      },
    ],

    // 侧边栏
    sidebar: {
      "/posts/java/": [
        {
          text: "Spring 系列",
          collapsible: true,
          children: [
            "/posts/java/spring/spring-core.md",
            "/posts/java/spring/spring-mvc.md",
            "/posts/java/spring/spring-boot.md",
            "/posts/java/spring/spring-security.md",
            "/posts/java/spring/spring-cloud.md",
            "/posts/java/spring/spring-data.md",
            "/posts/java/spring/spring-batch.md",
            "/posts/java/spring/spring-integration.md",
            "/posts/java/spring/spring-amqp.md",
            "/posts/java/spring/spring-kafka.md",
            "/posts/java/spring/spring-webflux.md",
            "/posts/java/spring/spring-graphql.md",
            "/posts/java/spring/spring-native.md",
            "/posts/java/spring/spring-shell.md",
            "/posts/java/spring/spring-statemachine.md",
          ],
        },
      ],
    },

    // 页脚
    footer: "MIT Licensed | Copyright © 2024-present",

    // 显示编辑链接
    editLink: false,

    // 显示更新时间
    lastUpdated: true,
  },

  // 添加网站图标
  head: [
    ['link', { rel: 'icon', href: '/healer-blog/logo.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/healer-blog/logo.png' }],
  ],

  // 开启调试模式
  debug: true,

  // 配置 Markdown
  markdown: {
    headers: {
      level: [2, 3, 4, 5]  // 配置要提取的标题级别
    }
  },

  // 和 PWA 一起启用
  // shouldPrefetch: false,

});

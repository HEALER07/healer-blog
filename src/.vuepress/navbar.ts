import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: "首页",
    link: "/",
    icon: "home"
  },
  {
    text: "Java",
    icon: "java",
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
    icon: "database",
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
    icon: "server",
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
    icon: "sitemap",
    link: "/posts/architecture/",
  },
  {
    text: "日常记录",
    icon: "daily",
    link: "/posts/daily/",
  },
  {
    text: "关于",
    icon: "info",
    link: "/about/",
  },
]);

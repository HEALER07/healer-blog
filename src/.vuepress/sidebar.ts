import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/posts/java/": [
    {
      text: "Java 基础",
      icon: "leaf",
      collapsible: true,
      prefix: "basic/",
      children: "structure",
    },
    {
      text: "Spring 系列",
      icon: "leaf",
      collapsible: true,
      prefix: "spring/",
      children: [
        "spring-core",
        "spring-mvc",
        "spring-boot",
        "spring-security",
        "spring-cloud",
        "spring-data",
        "spring-batch",
        "spring-integration",
        "spring-amqp",
        "spring-kafka",
        "spring-webflux",
        "spring-graphql",
        "spring-native",
        "spring-shell",
        "spring-statemachine",
      ],
    },
    {
      text: "设计模式",
      icon: "pattern",
      collapsible: true,
      prefix: "design-patterns/",
      children: "structure",
    },
    {
      text: "并发编程",
      icon: "async",
      collapsible: true,
      prefix: "concurrent/",
      children: "structure",
    },
    {
      text: "JVM",
      icon: "jvm",
      collapsible: true,
      prefix: "jvm/",
      children: "structure",
    },
  ],
  "/posts/database/": [
    {
      text: "MySQL",
      icon: "mysql",
      collapsible: true,
      prefix: "mysql/",
      children: "structure",
    },
    {
      text: "Redis",
      icon: "redis",
      collapsible: true,
      prefix: "redis/",
      children: "structure",
    },
    {
      text: "MongoDB",
      icon: "mongodb",
      collapsible: true,
      prefix: "mongodb/",
      children: "structure",
    },
  ],
  "/posts/middleware/": [
    {
      text: "消息队列",
      icon: "mq",
      collapsible: true,
      prefix: "mq/",
      children: "structure",
    },
    {
      text: "注册中心",
      icon: "registry",
      collapsible: true,
      prefix: "registry/",
      children: "structure",
    },
    {
      text: "网关",
      icon: "gateway",
      collapsible: true,
      prefix: "gateway/",
      children: "structure",
    },
  ],
  "/posts/architecture/": [
    {
      text: "架构设计",
      icon: "architecture",
      collapsible: true,
      children: "structure",
    },
  ],
  "/posts/daily/": [
    {
      text: "日常记录",
      icon: "daily",
      collapsible: true,
      children: "structure",
    },
  ],
});

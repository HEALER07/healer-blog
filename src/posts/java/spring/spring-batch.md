---
title: Spring Batch
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 批处理
date: 2024-03-19
---

# Spring Batch

## 基础配置

### 1. 批处理作业配置
```java
@Configuration
@EnableBatchProcessing
public class BatchConfig {
    
    @Autowired
    private JobBuilderFactory jobBuilderFactory;
    
    @Autowired
    private StepBuilderFactory stepBuilderFactory;
    
    @Bean
    public Job importJob() {
        return jobBuilderFactory.get("importJob")
            .start(importStep())
            .next(processStep())
            .next(exportStep())
            .build();
    }
    
    @Bean
    public Step importStep() {
        return stepBuilderFactory.get("importStep")
            .<User, User>chunk(10)
            .reader(userReader())
            .writer(userWriter())
            .build();
    }
}
```

### 2. 数据读取器
```java
public class BatchReader {
    // 1. 文件读取器
    @Bean
    public FlatFileItemReader<User> fileReader() {
        FlatFileItemReader<User> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource("users.csv"));
        reader.setLineMapper(new DefaultLineMapper<User>() {{
            setLineTokenizer(new DelimitedLineTokenizer() {{
                setNames("id", "username", "email");
                setDelimiter(",");
            }});
            setFieldSetMapper(new BeanWrapperFieldSetMapper<User>() {{
                setTargetType(User.class);
            }});
        }});
        return reader;
    }
    
    // 2. 数据库读取器
    @Bean
    public JdbcCursorItemReader<User> dbReader() {
        JdbcCursorItemReader<User> reader = new JdbcCursorItemReader<>();
        reader.setDataSource(dataSource);
        reader.setSql("SELECT id, username, email FROM users");
        reader.setRowMapper(new BeanPropertyRowMapper<>(User.class));
        return reader;
    }
}
```

### 3. 数据处理器
```java
public class BatchProcessor {
    // 1. 数据转换
    @Bean
    public ItemProcessor<User, UserDTO> userProcessor() {
        return user -> {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername().toUpperCase());
            dto.setEmail(user.getEmail().toLowerCase());
            return dto;
        };
    }
    
    // 2. 数据验证
    @Bean
    public ValidatingItemProcessor<User> validatingProcessor() {
        ValidatingItemProcessor<User> processor = new ValidatingItemProcessor<>();
        processor.setValidator(new UserValidator());
        return processor;
    }
}
```

## 高级特性

### 1. 作业监听器
```java
public class JobListener {
    @Component
    public class ImportJobListener implements JobExecutionListener {
        @Override
        public void beforeJob(JobExecution jobExecution) {
            log.info("Job {} starting", jobExecution.getJobInstance().getJobName());
        }
        
        @Override
        public void afterJob(JobExecution jobExecution) {
            if (jobExecution.getStatus() == BatchStatus.COMPLETED) {
                log.info("Job {} completed successfully", 
                    jobExecution.getJobInstance().getJobName());
            } else if (jobExecution.getStatus() == BatchStatus.FAILED) {
                log.error("Job {} failed", jobExecution.getJobInstance().getJobName());
            }
        }
    }
}
```

### 2. 步骤监听器
```java
public class StepListener {
    @Component
    public class ImportStepListener implements StepExecutionListener {
        @Override
        public void beforeStep(StepExecution stepExecution) {
            log.info("Step {} starting", stepExecution.getStepName());
        }
        
        @Override
        public ExitStatus afterStep(StepExecution stepExecution) {
            if (stepExecution.getStatus() == BatchStatus.COMPLETED) {
                log.info("Step {} completed successfully", stepExecution.getStepName());
                return ExitStatus.COMPLETED;
            } else {
                log.error("Step {} failed", stepExecution.getStepName());
                return ExitStatus.FAILED;
            }
        }
    }
}
```

### 3. 错误处理
```java
public class ErrorHandling {
    @Bean
    public Step errorHandlingStep() {
        return stepBuilderFactory.get("errorHandlingStep")
            .<User, User>chunk(10)
            .reader(userReader())
            .processor(userProcessor())
            .writer(userWriter())
            .faultTolerant()
            .skipLimit(10)
            .skip(Exception.class)
            .retryLimit(3)
            .retry(Exception.class)
            .build();
    }
}
```

## 作业调度

### 1. 定时调度
```java
@Configuration
@EnableScheduling
public class SchedulingConfig {
    
    @Autowired
    private JobLauncher jobLauncher;
    
    @Autowired
    private Job importJob;
    
    @Scheduled(cron = "0 0 1 * * ?")
    public void runJob() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
                
            jobLauncher.run(importJob, jobParameters);
        } catch (Exception e) {
            log.error("Error running job", e);
        }
    }
}
```

### 2. 条件执行
```java
@Configuration
public class ConditionalConfig {
    
    @Bean
    public Job conditionalJob() {
        return jobBuilderFactory.get("conditionalJob")
            .start(step1())
            .on("COMPLETED").to(step2())
            .from(step1())
            .on("FAILED").to(errorStep())
            .end()
            .build();
    }
    
    @Bean
    public Step step1() {
        return stepBuilderFactory.get("step1")
            .<User, User>chunk(10)
            .reader(userReader())
            .writer(userWriter())
            .build();
    }
}
```

## 练习

1. 基础批处理实践：
   - 实现文件导入导出
   - 实现数据库批量处理
   - 实现数据转换处理

2. 高级特性实践：
   - 实现作业监听
   - 实现步骤监听
   - 实现错误处理

3. 调度实践：
   - 实现定时调度
   - 实现条件执行
   - 实现并行处理

4. 综合实践：
   - 实现完整批处理流程
   - 实现监控和告警
   - 实现性能优化

::: tip
批处理作业需要考虑性能、可靠性和可维护性，建议根据实际需求选择合适的处理策略。
:::

::: info 扩展阅读
- [Spring Batch 官方文档](https://docs.spring.io/spring-batch/docs/current/reference/html/)
- [Spring Batch 最佳实践](https://docs.spring.io/spring-batch/docs/current/reference/html/batch-processing.html)
- [Spring Batch 示例](https://github.com/spring-projects/spring-batch/tree/main/spring-batch-samples)
::: 
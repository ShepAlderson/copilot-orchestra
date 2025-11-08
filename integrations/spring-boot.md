# Spring Boot Integration Guide

Integration guide for using GitHub Copilot Orchestra with Spring Boot framework.

## Quick Setup

```bash
# Using Spring Initializr
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,h2,validation \
  -d type=maven-project \
  -d language=java \
  -d bootVersion=3.2.0 \
  -d baseDir=myapp \
  -o myapp.zip && unzip myapp.zip
```

## Agent Configuration

```markdown
<spring_conventions>
- Use Spring annotations (@RestController, @Service, @Repository)
- Follow package structure: controller, service, repository, model
- Write tests with @SpringBootTest and MockMvc
- Use constructor injection for dependencies
- Follow REST conventions
</spring_conventions>
```

## Common Pattern: REST API

**Request:** Create a User REST API with CRUD operations

**Plan:**
- Phase 1: Entity and Repository with tests
- Phase 2: Service layer with business logic
- Phase 3: Controller with validation
- Phase 4: Integration tests

## Example

```java
// User.java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @NotBlank
    private String name;
    
    @Email
    private String email;
    // getters, setters
}

// UserControllerTest.java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldCreateUser() throws Exception {
        mockMvc.perform(post("/api/users")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Test\",\"email\":\"test@example.com\"}"))
            .andExpect(status().isCreated());
    }
}
```

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Testing](https://docs.spring.io/spring-framework/reference/testing.html)

# ASP.NET Core Integration Guide

Quick integration guide for ASP.NET Core with Orchestra.

## Setup
```bash
dotnet new webapi -n MyApp
cd MyApp
dotnet add package xunit
dotnet add package Moq
```

## Testing with xUnit
```csharp
public class UserControllerTests
{
    [Fact]
    public async Task GetUsers_ReturnsOkResult()
    {
        var controller = new UserController();
        var result = await controller.GetUsers();
        Assert.IsType<OkObjectResult>(result);
    }
}
```

## Pattern: API Endpoint
- Phase 1: Model and repository with tests
- Phase 2: Service layer implementation
- Phase 3: Controller endpoints with validation

Resources: [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/) | [xUnit](https://xunit.net/)

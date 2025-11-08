# Django Integration Guide

Integration guide for using GitHub Copilot Orchestra with Django web framework.

## Overview

Django's "batteries included" philosophy and strong conventions make it excellent for Orchestra:
- Clear MVC (Model-View-Template) structure
- Built-in test framework
- Well-defined patterns
- Strong ORM and admin interface

## Setup

### Prerequisites

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Django
pip install django

# Create new project
django-admin startproject myproject
cd myproject

# Install testing dependencies
pip install pytest pytest-django factory-boy
```

### Configure pytest-django

Create `pytest.ini`:
```ini
[pytest]
DJANGO_SETTINGS_MODULE = myproject.settings
python_files = tests.py test_*.py *_tests.py
addopts = --reuse-db
```

Create `conftest.py`:
```python
import pytest
from django.conf import settings

@pytest.fixture(scope='session')
def django_db_setup():
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
```

## Agent Configuration

### Recommended Models

For Django development:
- **implement-subagent**: Claude Haiku 4.5 (good for models/views)
- **planning-subagent**: Claude Sonnet 4.5 (understands Django architecture)
- **code-review-subagent**: Claude Sonnet 4.5 (checks Django patterns)

### Custom Conductor Instructions

Add to your Conductor.agent.md:

```markdown
<django_conventions>
- Follow Django coding style (PEP 8 + Django conventions)
- Use class-based views when appropriate
- Models in models.py, views in views.py, URLs in urls.py
- Write tests in tests.py or tests/ directory
- Use Django ORM, avoid raw SQL
- Include migrations in implementation phases
- Use Django forms for input validation
- Follow Django security best practices
</django_conventions>
```

## Common Patterns

### Pattern 1: Model with CRUD Views

**User Request:**
```
Create a Blog model with title, content, and author.
Include list, detail, create, update, and delete views with tests.
```

**Expected Plan:**
- Phase 1: Model definition and tests
- Phase 2: List and detail views with templates
- Phase 3: Create, update, delete views
- Phase 4: URL configuration and integration tests

### Pattern 2: REST API with Django REST Framework

**User Request:**
```
Add REST API for the User model using Django REST Framework.
Include serializers, viewsets, and permissions.
```

**Expected Plan:**
- Phase 1: Serializer and tests
- Phase 2: ViewSet implementation
- Phase 3: URL routing and permissions
- Phase 4: API documentation

### Pattern 3: Custom Management Command

**User Request:**
```
Create a management command to import users from CSV file.
Include error handling and progress reporting.
```

**Expected Plan:**
- Phase 1: Command structure and tests
- Phase 2: CSV parsing and validation
- Phase 3: Error handling and logging

## Example Workflow

### Scenario: Building a Task Management App

**Initial Request:**
```
Create a Task model with title, description, due_date, and status.
Include CRUD views, authentication, and comprehensive tests.
```

#### Phase 1: Task Model and Tests

**Model and tests:**
```python
# tasks/models.py
from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
```

```python
# tasks/tests/test_models.py
import pytest
from django.contrib.auth.models import User
from tasks.models import Task
from datetime import date, timedelta

@pytest.mark.django_db
class TestTaskModel:
    def test_create_task(self):
        user = User.objects.create_user('testuser', 'test@example.com', 'password')
        task = Task.objects.create(
            title='Test Task',
            description='Test description',
            owner=user
        )
        assert task.title == 'Test Task'
        assert task.status == 'todo'
        assert str(task) == 'Test Task'
    
    def test_task_ordering(self):
        user = User.objects.create_user('testuser', 'test@example.com', 'password')
        task1 = Task.objects.create(title='First', owner=user)
        task2 = Task.objects.create(title='Second', owner=user)
        
        tasks = Task.objects.all()
        assert tasks[0] == task2  # Most recent first
        assert tasks[1] == task1
    
    def test_status_choices(self):
        user = User.objects.create_user('testuser', 'test@example.com', 'password')
        task = Task.objects.create(title='Test', owner=user)
        
        for status, _ in Task.STATUS_CHOICES:
            task.status = status
            task.save()
            assert task.status == status
```

**Run tests:**
```bash
pytest tasks/tests/test_models.py -v
```

**Create migration:**
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Phase 2: List and Detail Views

**Views:**
```python
# tasks/views.py
from django.views.generic import ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Task

class TaskListView(LoginRequiredMixin, ListView):
    model = Task
    template_name = 'tasks/task_list.html'
    context_object_name = 'tasks'
    paginate_by = 20
    
    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

class TaskDetailView(LoginRequiredMixin, DetailView):
    model = Task
    template_name = 'tasks/task_detail.html'
    context_object_name = 'task'
    
    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)
```

**Tests:**
```python
# tasks/tests/test_views.py
import pytest
from django.test import Client
from django.urls import reverse
from django.contrib.auth.models import User
from tasks.models import Task

@pytest.mark.django_db
class TestTaskViews:
    def test_task_list_requires_login(self):
        client = Client()
        response = client.get(reverse('task-list'))
        assert response.status_code == 302  # Redirect to login
    
    def test_task_list_shows_user_tasks(self):
        user = User.objects.create_user('testuser', 'test@example.com', 'password')
        other_user = User.objects.create_user('other', 'other@example.com', 'password')
        
        task1 = Task.objects.create(title='My Task', owner=user)
        task2 = Task.objects.create(title='Other Task', owner=other_user)
        
        client = Client()
        client.login(username='testuser', password='password')
        response = client.get(reverse('task-list'))
        
        assert response.status_code == 200
        assert task1 in response.context['tasks']
        assert task2 not in response.context['tasks']
```

## Testing Strategies

### Model Testing

```python
@pytest.mark.django_db
class TestYourModel:
    def test_model_creation(self):
        # Test creating instance
        pass
    
    def test_model_str_method(self):
        # Test __str__ representation
        pass
    
    def test_model_validation(self):
        # Test field validation
        pass
    
    def test_model_relationships(self):
        # Test foreign keys, many-to-many
        pass
```

### View Testing

```python
@pytest.mark.django_db
class TestYourViews:
    def test_view_requires_authentication(self):
        # Test login requirement
        pass
    
    def test_view_returns_correct_template(self):
        # Test template usage
        pass
    
    def test_view_context_data(self):
        # Test context variables
        pass
    
    def test_view_permissions(self):
        # Test user permissions
        pass
```

### Form Testing

```python
class TestYourForm:
    def test_form_valid_data(self):
        # Test form with valid data
        pass
    
    def test_form_invalid_data(self):
        # Test form validation errors
        pass
    
    def test_form_save(self):
        # Test form save behavior
        pass
```

## Tips & Tricks

### Phase Sizing for Django

**Good phase sizes:**
- ✅ One model per phase (with tests and migrations)
- ✅ One or two related views per phase
- ✅ One form per phase
- ✅ One API endpoint per phase (with DRF)

**Grouping suggestions:**
- Model + Admin configuration
- Related views (list + detail OR create + update + delete)
- Form + validation logic
- Serializer + ViewSet (for DRF)

### Using Factories

Install factory_boy for test data:
```python
# tasks/tests/factories.py
import factory
from django.contrib.auth.models import User
from tasks.models import Task

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.username}@example.com')

class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Task
    
    title = factory.Faker('sentence')
    description = factory.Faker('paragraph')
    owner = factory.SubFactory(UserFactory)
    status = 'todo'
```

### Database Migrations

**Include migrations in implementation:**
```python
# After creating/modifying models
python manage.py makemigrations
python manage.py migrate

# Test migration
python manage.py migrate --fake-initial
```

### Admin Interface

**Quick admin setup:**
```python
# tasks/admin.py
from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'status', 'due_date', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'description']
    date_hierarchy = 'created_at'
```

## Common Issues

### Issue: Migration conflicts

**Solution:**
```bash
# Reset migrations (development only!)
python manage.py migrate --fake app_name zero
rm -rf app_name/migrations/
python manage.py makemigrations
python manage.py migrate
```

### Issue: Tests failing due to database state

**Solution:** Use `@pytest.mark.django_db` decorator and fixtures:
```python
@pytest.fixture
def clean_database(db):
    # Database is clean for each test
    yield
```

### Issue: Import errors in tests

**Solution:** Ensure DJANGO_SETTINGS_MODULE is set:
```bash
export DJANGO_SETTINGS_MODULE=myproject.settings
pytest
```

## Django REST Framework Integration

### Setup

```bash
pip install djangorestframework
pip install django-filter  # Optional, for filtering
```

### Configuration

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'rest_framework',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

### Example API Implementation

```python
# tasks/serializers.py
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'status', 'owner', 'created_at']
        read_only_fields = ['created_at']
```

```python
# tasks/viewsets.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
```

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [pytest-django](https://pytest-django.readthedocs.io/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Factory Boy](https://factoryboy.readthedocs.io/)

---

**Questions?** Open an issue or discussion!

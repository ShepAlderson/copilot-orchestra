# React/Next.js Integration Guide

Integration guide for using GitHub Copilot Orchestra with React and Next.js applications.

## Overview

React and Next.js are ideal for the Orchestra workflow because:
- Component-based architecture aligns with phase-based development
- Strong testing ecosystem (Jest, React Testing Library)
- Clear separation of concerns
- Excellent TypeScript support

## Setup

### Prerequisites

```bash
# Install Next.js (if new project)
npx create-next-app@latest my-app --typescript --tailwind --app

# Or for React only
npx create-react-app my-app --template typescript

# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

### Configure Jest

Create `jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom'
```

### Update package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "next lint"
  }
}
```

## Agent Configuration

### Recommended Models

For React/Next.js development:
- **implement-subagent**: Claude Haiku 4.5 (fast component creation)
- **planning-subagent**: Claude Sonnet 4.5 (understands component structure)
- **code-review-subagent**: Claude Sonnet 4.5 (catches React patterns)

### Custom Conductor Instructions

Add to your Conductor.agent.md:

```markdown
<react_conventions>
- Use functional components with hooks
- Follow Next.js App Router conventions (if using Next.js)
- Use TypeScript for type safety
- Component file structure: ComponentName/index.tsx, ComponentName.test.tsx, ComponentName.module.css
- Test with React Testing Library
- Use server components by default in Next.js App Router
- Mark client components with 'use client' directive
</react_conventions>
```

## Common Patterns

### Pattern 1: New Component with Tests

**User Request:**
```
Create a UserCard component that displays user information (name, email, avatar).
Include tests for rendering and prop validation.
```

**Expected Plan:**
- Phase 1: Component interface and tests
- Phase 2: Component implementation and styling
- Phase 3: Storybook/documentation (optional)

**Implementation Notes:**
- Write tests first using React Testing Library
- Test rendering, props, and user interactions
- Use semantic HTML and accessibility attributes

### Pattern 2: API Route (Next.js)

**User Request:**
```
Add a REST API endpoint at /api/users that fetches users from database.
Include input validation and error handling.
```

**Expected Plan:**
- Phase 1: Route handler tests and validation schema
- Phase 2: Database query implementation
- Phase 3: Error handling and response formatting

### Pattern 3: Custom Hook

**User Request:**
```
Create a useAuth hook for authentication state management.
Should handle login, logout, and token refresh.
```

**Expected Plan:**
- Phase 1: Hook interface and test setup
- Phase 2: State management and API calls
- Phase 3: Error handling and edge cases

## Example Workflow

### Scenario: Building a Todo List Component

**Initial Request:**
```
Create a TodoList component with add, delete, and toggle functionality.
Use TypeScript, include tests, and follow React best practices.
```

#### Phase 1: Component Structure and Tests

**Tests created:**
```typescript
// components/TodoList/TodoList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import TodoList from './index'

describe('TodoList', () => {
  test('renders empty list', () => {
    render(<TodoList />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  test('adds new todo', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add todo')
    const button = screen.getByText('Add')
    
    fireEvent.change(input, { target: { value: 'New task' } })
    fireEvent.click(button)
    
    expect(screen.getByText('New task')).toBeInTheDocument()
  })

  test('toggles todo completion', () => {
    render(<TodoList />)
    // ... test implementation
  })

  test('deletes todo', () => {
    render(<TodoList />)
    // ... test implementation
  })
})
```

**Run tests (should fail):**
```bash
npm test -- TodoList.test.tsx
```

#### Phase 2: Component Implementation

**Component created:**
```typescript
// components/TodoList/index.tsx
'use client'

import { useState } from 'react'
import styles from './TodoList.module.css'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (!input.trim()) return
    
    setTodos([...todos, {
      id: crypto.randomUUID(),
      text: input,
      completed: false
    }])
    setInput('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Add todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      
      <ul role="list" className={styles.list}>
        {todos.map(todo => (
          <li key={todo.id} className={styles.item}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? styles.completed : ''}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Run tests (should pass):**
```bash
npm test -- TodoList.test.tsx
```

**Lint:**
```bash
npm run lint
```

## Testing Strategies

### Component Testing

**Test coverage requirements:**
- ✅ Component renders without crashing
- ✅ Props are properly used
- ✅ User interactions work correctly
- ✅ Edge cases handled (empty state, errors)
- ✅ Accessibility attributes present

**Example test patterns:**
```typescript
// Test rendering
test('renders with default props', () => {
  render(<MyComponent />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})

// Test user interaction
test('calls onClick when button clicked', () => {
  const handleClick = jest.fn()
  render(<MyComponent onClick={handleClick} />)
  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

// Test async behavior
test('loads data on mount', async () => {
  render(<MyComponent />)
  expect(await screen.findByText('Loaded')).toBeInTheDocument()
})
```

### Hook Testing

Use `@testing-library/react-hooks` for custom hooks:

```typescript
import { renderHook, act } from '@testing-library/react'

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter())
  
  act(() => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})
```

### API Route Testing (Next.js)

```typescript
import { GET, POST } from './route'
import { NextRequest } from 'next/server'

test('GET /api/users returns users', async () => {
  const request = new NextRequest('http://localhost/api/users')
  const response = await GET(request)
  const data = await response.json()
  
  expect(response.status).toBe(200)
  expect(Array.isArray(data)).toBe(true)
})
```

## Tips & Tricks

### Optimizing Phase Size

**Good phase size:**
- ✅ One component per phase
- ✅ One hook per phase
- ✅ One API route per phase

**Too large:**
- ❌ Multiple components in one phase
- ❌ Component + hook + API route together

**Exception:** Tightly coupled code can be in same phase (component + its types file)

### Handling Next.js Specifics

**App Router:**
- Server components by default (no 'use client')
- Client components need 'use client' directive
- Separate Server Actions into their own phases

**Pages Router:**
- Pages (routes) in one phase
- API routes in separate phases
- getServerSideProps/getStaticProps with page

### Performance Optimization

**When to optimize:**
- After functionality works (separate phase)
- Use React DevTools profiler first
- Add React.memo, useMemo, useCallback as needed

**Example request:**
```
Optimize the UserList component for performance.
Add memoization to prevent unnecessary re-renders.
```

### State Management

**For smaller apps:**
- useState + Context API (built-in)
- Phase 1: Context setup
- Phase 2: Provider implementation
- Phase 3: Consumer hooks

**For larger apps:**
- Consider Zustand, Redux, or Jotai
- Phase 1: Store setup and types
- Phase 2: Actions/reducers
- Phase 3: Integration with components

## Common Issues

### Issue: Tests failing due to Next.js imports

**Solution:** Configure Jest to handle Next.js modules:
```javascript
// jest.config.js
moduleNameMapper: {
  '^next/navigation$': '<rootDir>/__mocks__/next-navigation.js',
}
```

### Issue: "window is not defined" in SSR

**Solution:** 
- Use 'use client' for components that need browser APIs
- Add conditional checks: `if (typeof window !== 'undefined')`
- Use useEffect for client-side only code

### Issue: Async rendering in tests

**Solution:** Use `findBy` queries instead of `getBy`:
```typescript
// ❌ May fail
expect(screen.getByText('Loaded')).toBeInTheDocument()

// ✅ Waits for element
expect(await screen.findByText('Loaded')).toBeInTheDocument()
```

## Resources

- [React Testing Library](https://testing-library.com/react)
- [Next.js Documentation](https://nextjs.org/docs)
- [Jest Documentation](https://jestjs.io/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Example Repository

Check out our example Next.js project using Orchestra:
- [examples/nextjs-todo-app](../examples/nextjs-todo-app) (coming soon)

---

**Questions?** Open an issue or discussion!

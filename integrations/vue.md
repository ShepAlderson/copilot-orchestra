# Vue.js Integration Guide

Quick integration guide for Vue.js with Orchestra.

## Setup
```bash
npm create vue@latest
cd project-name
npm install
npm install --save-dev @testing-library/vue vitest
```

## Testing with Vitest
```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent, { props: { msg: 'Hello' } })
    expect(wrapper.text()).toContain('Hello')
  })
})
```

## Pattern: Component Development
- Phase 1: Component structure and tests
- Phase 2: Template and logic implementation
- Phase 3: Styling and composables

Resources: [Vue.js](https://vuejs.org/) | [Vitest](https://vitest.dev/)

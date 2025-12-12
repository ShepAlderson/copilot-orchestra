# Ruby on Rails Integration Guide

Quick integration guide for Ruby on Rails with Orchestra.

## Setup
```bash
rails new myapp
cd myapp
bundle install
```

## Testing with RSpec
```ruby
# spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
  it 'is valid with valid attributes' do
    user = User.new(name: 'John', email: 'john@example.com')
    expect(user).to be_valid
  end
end
```

## Pattern: Resource Development
- Phase 1: Model with validations and tests
- Phase 2: Controller actions and routes
- Phase 3: Views and helpers

Resources: [Rails](https://rubyonrails.org/) | [RSpec](https://rspec.info/)

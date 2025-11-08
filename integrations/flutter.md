# Flutter Integration Guide

Quick integration guide for Flutter with Orchestra.

## Setup
```bash
flutter create my_app
cd my_app
flutter test
```

## Testing
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/main.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.text('0'), findsOneWidget);
    
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();
    
    expect(find.text('1'), findsOneWidget);
  });
}
```

## Pattern: Widget Development
- Phase 1: Widget interface and tests
- Phase 2: Widget implementation and state
- Phase 3: Integration with providers/BLoC

Resources: [Flutter](https://flutter.dev/) | [Testing](https://docs.flutter.dev/testing)

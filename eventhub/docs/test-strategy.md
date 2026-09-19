# Test Strategy — Booking Management

## Scope
This strategy covers the booking-management flows in the EventHub app: booking creation, booking detail review, refund eligibility checks, cancellation, sandbox isolation, and booking-limit enforcement.

Primary sources used:
- [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md)
- [eventhub/business-rules.md](../business-rules.md)
- [eventhub/user-flows.md](../user-flows.md)
- Existing example tests in [tests/Assignment2.spec.js](../../tests/Assignment2.spec.js) and [tests/UIBasicstest.spec.js](../../tests/UIBasicstest.spec.js)

## Test Pyramid Distribution

| Layer | Count | Focus | Time Cost |
| --- | ---: | --- | --- |
| Unit | 5 | Pure validation logic, pricing math, reference generation, FIFO data rules | Low |
| API | 7 | Backend validation, auth/authorization, seat checks, booking lifecycle | Medium |
| Component | 4 | Booking form validation, refund eligibility UI, empty-state and banner rendering | Medium |
| E2E | 8 | End-to-end booking and cancellation journeys, sandbox isolation, full user flows | High |

### Recommended distribution summary
- Unit: 5
- API: 7
- Component: 4
- E2E: 8

## Layer assignments

### Unit tests
| ID | Scenario ID | Reasoning | Source refs |
| --- | --- | --- | --- |
| U-01 | TC-100 | Booking reference generation is deterministic business logic; should be tested as a pure function in isolation. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| U-02 | TC-101 | Quantity and pricing validation are pure rule checks and should not require a browser or server. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| U-03 | TC-103 | Dynamic seat availability formula is a computation rule: totalSeats - sum(user booking quantities). | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| U-04 | TC-400 | Boundary logic for quantity 1, 10, 0, and 11 is classic pure validation logic. | [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| U-05 | TC-401 | FIFO prune rule for the max-booking limit can be expressed as a simple ordering function and tested at low cost. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |

### API tests
| ID | Scenario ID | Reasoning | Source refs |
| --- | --- | --- | --- |
| A-01 | TC-002 | Booking creation is a backend contract and should validate input, ref generation, price, and response shape. | [eventhub/user-flows.md](../user-flows.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| A-02 | TC-004 | Cancellation should confirm seat release and deletion semantics through an API contract. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| A-03 | TC-005 | Clear-all endpoint should delete all sandbox bookings and restore seat availability. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| A-04 | TC-100 | Reference format and collision retry behavior should be validated at API layer where generation occurs. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| A-05 | TC-101 | Validation for quantity, seat shortage, and invalid payloads belongs at the API boundary. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| A-06 | TC-102 | Booking-limit FIFO pruning is a server-side rule and should be validated through API behavior. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| A-07 | TC-200 | Cross-user authorization should be enforced by the backend and return 403 with proper denial. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |

### Component tests
| ID | Scenario ID | Reasoning | Source refs |
| --- | --- | --- | --- |
| C-01 | TC-003 | Refund eligibility message and spinner timing are UI behaviors with presentation logic, not backend contracts. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| C-02 | TC-300 | Validation errors on the booking form are best tested at component level for inline feedback and field states. | [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| C-03 | TC-400 | Quantity boundary controls and disabled states belong in component behavior tests. | [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| C-04 | TC-501 | Group-vs-single refund decision rendering is a UI-state test with client-side logic. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |

### E2E tests
| ID | Scenario ID | Reasoning | Source refs |
| --- | --- | --- | --- |
| E-01 | TC-001 | Full booking list access and sandbox display is a multi-page user flow. | [eventhub/user-flows.md](../user-flows.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| E-02 | TC-002 | Booking creation from browse to confirmation is a critical user journey. | [eventhub/user-flows.md](../user-flows.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| E-03 | TC-003 | Refund-check flow is user-facing and requires navigation, wait states, and UI confirmation. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| E-04 | TC-004 | Cancellation flow from booking list to confirmation is a critical end-to-end workflow. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| E-05 | TC-005 | Clear-all booking action is a full user journey and should be observed end-to-end. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| E-06 | TC-200 | Cross-user access denial is a security regression that must be validated end-to-end. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| E-07 | TC-201 | Auth protection across routes is a full-stack user restriction scenario. | [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| E-08 | TC-500 | Banner state transitions across counts are browser-visible UI behaviors. | [eventhub/business-rules.md](../business-rules.md), [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |
| E-09 | TC-502 | Empty booking state is important as a full user experience journey. | [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) |

## Contested assignment rationale

### 1) Booking reference rule: API vs Unit
This rule is best tested in both places.
- Unit: validates the deterministic transformation of title-first-letter and random suffix generation.
- API: validates database uniqueness, collision retry, and the actual booking payload produced at the service boundary.
This is a classic defense-in-depth case, with lower-layer tests fast and cheaper while API tests validate real integration with persistence.

### 2) Refund eligibility: Component vs E2E
The refund result is presented on the booking details page and the rule is client-side only. It belongs primarily in component tests because the main concern is render timing and message logic.
E2E is still useful for one critical happy-path flow to confirm the full user journey works in the browser.

### 3) Quantity validation: API vs Component
The business rule itself is server-enforced and should be tested strongly at API level. The form’s inline validation and disabled states are also important and can be asserted at the component layer. This avoids overloading E2E with validation-only checks while still keeping a few UI checks near the user.

### 4) Cross-user access: API vs E2E
The backend must enforce the 403 response with explicit authorization checks, but the real regression also needs an E2E check to confirm the browser behavior and UX are correct. This is a critical security path and therefore deserves layered coverage.

## Anti-patterns observed in existing tests
The current examples in [tests/Assignment2.spec.js](../../tests/Assignment2.spec.js) and [tests/UIBasicstest.spec.js](../../tests/UIBasicstest.spec.js) are useful as generic Playwright exercises, but they do not align with the EventHub booking-management domain.

Primary anti-patterns:
- E2E-only coverage for validation logic, which should be lower-layer tests.
- Tests are tied to a different shopping app and not the booking sandbox model used here.
- Missing security checks for cross-user access and auth denial.
- No clear split between business-rule validation and user-journey validation.
- Hard-coded UI selectors not derived from the EventHub domain or selector map.
- No emphasis on booking limits, FIFO pruning, refund logic, or sandbox isolation.

## Recommended next actions
1. Implement the highest-priority API tests first: booking creation, booking cancellation, and authorization denial.
2. Add component tests for the refund spinner and booking form validation.
3. Keep a small but critical set of E2E tests for full booking and security flows.
4. Reuse the scenario IDs in [eventhub/docs/test-scenarios.md](../docs/test-scenarios.md) as the canonical mapping to automation coverage.

## Final recommendation
The booking-management feature should follow a layered pyramid with a moderate API/core emphasis and a small but non-trivial E2E layer. The most business-critical rules are identity isolation, booking limits, seat math, and reference generation, so they should be defended at multiple layers to minimize regressions.

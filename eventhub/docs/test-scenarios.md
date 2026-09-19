### TC-001: User views their booking list
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User is signed in and has access to the bookings dashboard; at least one booking exists in their sandbox.
**Steps**:
1. Sign in with a valid account.
2. Navigate to the Bookings page.
3. Observe the booking list and summary area.
4. Select a booking card or the View Details action.
**Expected Results**:
- The user sees only their own bookings.
- Bookings are displayed with booking reference, event title, quantity, and total price.
- The page loads without errors and shows the correct booking count.
**Business Rule**: Each user can only view bookings in their sandbox; static events are shared but user-created booking data remains isolated.
**Suggested Layer**: E2E

### TC-002: User books a valid event with confirmed totals
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User is signed in; the selected event has available seats and a valid price; the booking form is visible.
**Steps**:
1. Open the event listing and choose a valid event.
2. Click Book Now and confirm the event details are displayed.
3. Select quantity between 1 and 10.
4. Enter valid customer name, email, and phone.
5. Click Confirm Booking.
**Expected Results**:
- The booking succeeds and a confirmation card is shown.
- The booking reference starts with the event title’s first letter in uppercase.
- Total price equals event price multiplied by quantity.
- The booking appears in My Bookings immediately.
- Available seats decrease after booking confirmation.
**Business Rule**: Booking reference format is [FIRST_LETTER]-[6_RANDOM_ALPHANUMERIC]; totalPrice = event.price x quantity.
**Suggested Layer**: E2E

### TC-003: User opens a booking detail page and checks refund eligibility for a single ticket
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User has a booking with quantity = 1.
**Steps**:
1. Open the bookings list.
2. Click View Details for the eligible booking.
3. Click Check Refund Eligibility.
4. Wait for the 4-second spinner to complete.
**Expected Results**:
- The spinner appears before the result is shown.
- The result says “Single-ticket bookings qualify for a full refund”.
- The event and customer details are visible on the detail page.
**Business Rule**: Single-ticket bookings are eligible for full refund; client-side refund logic uses a 4-second spinner before revealing result.
**Suggested Layer**: E2E

### TC-004: User cancels an individual booking and confirms seat release
**Category**: Happy Path
**Priority**: P0
**Preconditions**: User has at least one booking with a valid event and available seats.
**Steps**:
1. Open the booking details for a booking.
2. Click Cancel Booking or Delete.
3. Confirm the action if prompted.
4. Return to the bookings page.
**Expected Results**:
- The booking is removed from the list.
- Seat availability is restored immediately for the affected event.
- The user is redirected or refreshed to a valid list state without stale data.
**Business Rule**: Booking deletion immediately frees seats and removes the booking from the user sandbox.
**Suggested Layer**: E2E

### TC-005: User clears all bookings in one action
**Category**: Happy Path
**Priority**: P1
**Preconditions**: User has multiple bookings in their sandbox.
**Steps**:
1. Navigate to the bookings list.
2. Click Clear All Bookings.
3. Confirm the destructive action.
**Expected Results**:
- All bookings in the sandbox are removed.
- The page shows an empty state or no bookings remain.
- The related seat counts for each event are restored as expected.
**Business Rule**: Clear All Bookings removes all bookings in one go and releases seats.
**Suggested Layer**: E2E

### TC-100: Booking reference must match the first letter of the event title
**Category**: Business Rule
**Priority**: P0
**Preconditions**: User is signed in; a valid event title is selected and is not empty.
**Steps**:
1. Choose an event whose title begins with a specific letter.
2. Complete booking form with valid data.
3. Submit the booking.
4. Capture the generated booking reference.
**Expected Results**:
- The reference begins with the event title’s first letter in uppercase.
- The remaining six characters are alphanumeric and unique.
- If a collision occurs, a retry is performed transparently.
**Business Rule**: Booking reference format is [FIRST_LETTER]-[6_RANDOM_ALPHANUMERIC] and first letter comes from the event title.
**Suggested Layer**: API

### TC-101: Booking quantity is validated against seat and limit constraints
**Category**: Business Rule
**Priority**: P0
**Preconditions**: User is on the event booking form for an event with a known available seat count.
**Steps**:
1. Attempt to confirm a booking with quantity 1.
2. Increase quantity to the maximum allowed value.
3. Attempt to exceed available seat capacity.
4. Retry with quantity outside the valid range.
**Expected Results**:
- Quantity must be between 1 and 10.
- Booking cannot exceed available seats.
- Validation prevents invalid submissions and displays a useful error state.
**Business Rule**: Booking quantity must be within 1-10 and total demand cannot exceed available seats.
**Suggested Layer**: API

### TC-102: FIFO pruning applies when the user reaches nine bookings
**Category**: Business Rule
**Priority**: P1
**Preconditions**: User has 8 active bookings and is creating another booking; booking limit is near the maximum.
**Steps**:
1. Create a new booking while the user is at or near the 9-booking limit.
2. Continue creating additional bookings until the maximum is exceeded.
3. Review the bookings list after each addition.
**Expected Results**:
- The oldest booking is automatically removed when the 9-booking threshold is exceeded.
- Newer bookings remain visible.
- The list always keeps only the most recent 9 bookings.
**Business Rule**: Max 9 bookings per user; oldest bookings are pruned via FIFO when the limit is reached.
**Suggested Layer**: API

### TC-103: Dynamic event seat availability is computed correctly for repeat bookings
**Category**: Business Rule
**Priority**: P1
**Preconditions**: User owns or can create a dynamic event with totalSeats set and no seed restrictions.
**Steps**:
1. Create a dynamic event with a total seat count.
2. Book one ticket for the event.
3. Book more tickets for the same event in a second transaction.
4. Inspect the event details or booking totals.
**Expected Results**:
- Available seats are computed as totalSeats - sum(user booking quantities for that event).
- The same user can book the same event multiple times for testing.
- Seat counts decrease immediately after booking confirmation.
**Business Rule**: For dynamic user-created events, available seats are computed from the user’s booking quantities for that event.
**Suggested Layer**: API

### TC-200: Cross-user cannot view another user’s booking details
**Category**: Security
**Priority**: P0
**Preconditions**: User A has a valid booking and User B is signed in with a different sandbox.
**Steps**:
1. Log in as User A and create or capture a booking ID.
2. Log out and log in as User B.
3. Navigate directly to /bookings/:userA_booking_id.
4. Attempt to open the booking details page.
**Expected Results**:
- User B sees an Access Denied message.
- The booking data does not load.
- The system rejects the request with a 403 Forbidden response.
**Business Rule**: Cross-user access to bookings returns 403 Forbidden (“Access Denied”).
**Suggested Layer**: E2E

### TC-201: User without authentication cannot access booking routes
**Category**: Security
**Priority**: P1
**Preconditions**: Session token is absent or expired.
**Steps**:
1. Open the bookings page in a fresh browser without logging in.
2. Attempt to visit a direct booking detail URL.
3. Observe the redirect or auth error response.
**Expected Results**:
- Access is blocked before booking data is displayed.
- The user is redirected to login or shown an unauthorized error state.
- No booking details leak to unauthenticated users.
**Business Rule**: User sandbox access requires authentication and valid JWT.
**Suggested Layer**: E2E

### TC-300: Booking form rejects invalid customer data
**Category**: Negative
**Priority**: P0
**Preconditions**: User is on the event booking form.
**Steps**:
1. Enter a customer name shorter than 2 characters.
2. Enter an email in an invalid format.
3. Enter a phone number with fewer than 10 digits.
4. Submit the form.
**Expected Results**:
- The booking is not created.
- Validation messages are shown for each invalid field.
- The user remains on the form and can fix inputs.
**Business Rule**: Customer name must be at least 2 characters; customer email must be valid; customer phone must have at least 10 digits.
**Suggested Layer**: E2E

### TC-301: Booking fails when quantity exceeds the available seats for an event
**Category**: Negative
**Priority**: P0
**Preconditions**: User selects an event with limited remaining seats.
**Steps**:
1. Attempt to book more tickets than the event currently has available.
2. Submit the booking request.
3. Observe the validation or backend error.
**Expected Results**:
- The booking request is blocked.
- The page shows a clear error explaining that seat availability is insufficient.
- No booking record is added.
**Business Rule**: Bookings cannot exceed the available seat count for the selected event.
**Suggested Layer**: API

### TC-400: Quantity boundary values at the minimum and maximum are handled correctly
**Category**: Edge Case
**Priority**: P1
**Preconditions**: Event has enough seats and user is on booking form.
**Steps**:
1. Book with quantity 1.
2. Book with quantity 10.
3. Attempt quantity 0 and quantity 11.
**Expected Results**:
- Quantity 1 and 10 are accepted when enough seats are available.
- Quantity 0 and 11 are rejected by validation.
- The UI and backend enforce the same boundary behavior.
**Business Rule**: Quantity range is 1 to 10 inclusive.
**Suggested Layer**: Component

### TC-401: Oldest booking is pruned when the limit is reached exactly at the boundary
**Category**: Edge Case
**Priority**: P1
**Preconditions**: User has 9 existing bookings and another valid event is available.
**Steps**:
1. Create a 10th booking.
2. Wait for the booking to confirm.
3. Review the bookings list.
**Expected Results**:
- The new booking is added and the oldest booking is removed automatically.
- The user sees exactly 9 bookings after the action.
- The pruned record is no longer visible in the list.
**Business Rule**: Max 9 bookings per user with FIFO pruning when the limit is exceeded.
**Suggested Layer**: API

### TC-500: Bookings page banner appears near the booking limit and hides when counts are low
**Category**: UI State
**Priority**: P1
**Preconditions**: User has a booking count near the limit and then reduces bookings below the warning threshold.
**Steps**:
1. Start with a low booking count and navigate to Bookings.
2. Add bookings until near the limit.
3. Confirm the warning banner appears.
4. Delete bookings until the count is below the threshold.
**Expected Results**:
- The warning banner appears when a user has close to or more than the allowed booking count.
- The banner is hidden when counts are sufficiently low.
- The message warns about sandbox limits and booking thresholds.
**Business Rule**: Banner appears when the user is near or at the sandbox booking limit and hides when counts are low.
**Suggested Layer**: E2E

### TC-501: Refund eligibility result and spinner behavior are correct for group bookings
**Category**: UI State
**Priority**: P1
**Preconditions**: User has a booking with quantity greater than 1; the booking detail page is open.
**Steps**:
1. Open the detail page for a group booking.
2. Click Check Refund Eligibility.
3. Wait for the 4-second spinner to finish.
**Expected Results**:
- The spinner is visible during the delayed result.
- The final message says “Group bookings (N tickets) are non-refundable”.
- The result reflects the booked quantity rather than the event total seats.
**Business Rule**: Multi-ticket bookings are ineligible for refund and show a quantity-based message.
**Suggested Layer**: Component

### TC-502: Empty state is shown when the user does not have any bookings
**Category**: UI State
**Priority**: P2
**Preconditions**: User is signed in and has zero bookings in their sandbox.
**Steps**:
1. Navigate to the Bookings page.
2. Observe the list and the available actions.
**Expected Results**:
- The page handles zero-booking state gracefully.
- No stale data or broken booking cards are shown.
- The user can still browse events or create a new booking from the empty state.
**Business Rule**: Bookings list should support an empty sandbox without crashing or showing invalid data.
**Suggested Layer**: E2E

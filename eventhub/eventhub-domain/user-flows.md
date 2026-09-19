EventHub User Flows & Test Data
Flow 1: Registration & Login
Navigate to /register
Enter email (must be unique) and password (min 6 chars)
Submit -> JWT issued -> redirected to home
Or: Navigate to /login -> enter credentials -> JWT issued -> home
Flow 2: Browse & Filter Events
Login -> navigate to /events
Use search bar (searches title, description, venue)
Filter by category dropdown (Conference, Concert, etc.)
Filter by city dropdown (Bangalore, Mumbai, etc.)
Paginate (12 events per page)
Click "Book Now" on any event card
Flow 3: Book an Event
From event card -> click "Book Now" -> navigate to /events/:id
See event details (title, date, venue, price, available seats)
Select quantity (1-10) using +/- buttons
Fill customer form: name, email, phone
Click "Confirm Booking"
See confirmation card with booking reference
Navigate to "View My Bookings" or "Browse Events"
Flow 4: Manage Bookings
Navigate to /bookings
See list of all bookings with details
Click "View Details" -> /bookings/:id
See full booking info + event details
Check refund eligibility (spinner + result)
Cancel booking (delete)
Or: "Clear all bookings" from bookings list
Flow 5: Admin - Manage Events
Navigate to /admin/events
Fill event creation form (title, category, city, venue, date, price, seats)
Submit -> "Event created!" toast
See list of user-created events
Edit existing events (update form)
Delete events (with cascade to bookings)
Flow 6: Cross-User Security
User A creates a booking
User A captures booking ID
Switch to User B (clear localStorage, re-login)
User B navigates to /bookings/:userA_booking_id
Sees "Access Denied" message
---
Test Data
Seeded Data (10 Static Events)
Run `npm run seed` to insert:
Tech Conference Bangalore (Conference, 500 seats, $1499)
Bollywood Night Mumbai (Concert, 1000 seats, $999)
IPL Cricket Finals (Sports, 40000 seats, $2499)
Digital Marketing Workshop (Workshop, 100 seats, $299)
Holi Festival Delhi (Festival, 5000 seats, $199)
AI Summit Hyderabad (Conference, 300 seats, $1999)
Classical Music Evening (Concert, 200 seats, $799)
Marathon Chennai (Sports, 10000 seats, $49)
Photography Workshop (Workshop, 50 seats, $399)
Food Festival Bangalore (Festival, 2000 seats, $149)
Test Accounts
Account	Email	Password
Gmail User	rahulshetty1@gmail.com	Magiclife1!
Yahoo User	rahulshetty1@yahoo.com	Magiclife1!

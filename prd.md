# OttoNexus EMS — Product Requirements Document (PRD)

# Overview
OttoNexus EMS is a prototype event management system built for **Otto employees (Organisers)** to create and manage client events, and for **client employees (Guests)** to register and manage their participation.

This **prototype** version will:
- Skip authentication.
- Use **CSV files** for storing event & guest data.
- Use an **internal `/uploads` folder** for KYC document storage.
- Be built fully in **Next.js (App Router)** with APIs.

# Users

## Organiser (Otto Employee)
- Access via `/organiser`.
- Can view all events.
- Can create new events for clients.
- Can manage event dashboard via `/organiser/:event_id`.

## Guest (Client Employee)
- Access starts at `/` (simple login).
- Enters username (email/employee ID).
- Redirected to `/guests/:guest_id`.
- Can view assigned event(s).
- Can submit personal details + upload KYC file.
- Can update participation details.

## Corporate (Client Company)
- Access via `/corporate/:company_id`.
- Can view all events assigned to their company.
- Can manage company employees and their registrations.
- Can view participation analytics and reports.
- Can export employee data and event reports.
- Can update company settings and requirements.

# Routes (Prototype)

## Frontend Pages
- `/` → Guest login (enter username → redirect to `/guests/:guest_id`).
- `/organiser` → Organiser panel (list of events + "create new event").
- `/organiser/:event_id` → Event dashboard (edit event, view guest list, download CSV).
- `/guests/:guest_id` → Guest dashboard (registration form + KYC upload).
- `/corporate/:company_id` → Corporate dashboard (company events, employee management, analytics).

## Backend API (Next.js Route Handlers in `app/api/`)
- **Events**
  - `POST /api/events` → Create new event (write to `events.csv`).
  - `GET /api/events` → List all events (read `events.csv`).
  - `GET /api/events/:id` → Event details + guests (cross-read from `events.csv` + `guests.csv`).
  - `PUT /api/events/:id` → Update event.
  - `DELETE /api/events/:id` → Delete event.

- **Guests**
  - `POST /api/guests` → Register new guest (write to `guests.csv`).
  - `GET /api/guests/:id` → Guest details (from `guests.csv`).
  - `PUT /api/guests/:id` → Update guest details.
  - `POST /api/guests/:id/kyc` → Upload KYC file to `/uploads` folder.

- **Login**
  - `POST /api/login` → Check if username exists in `guests.csv`, return guest_id.

- **Corporate**
  - `GET /api/companies` → List all companies (read `companies.csv`).
  - `GET /api/companies/:id` → Get company details and settings.
  - `GET /api/companies/:id/employees` → Get all employees for a company.
  - `GET /api/companies/:id/events` → Get all events for a company.
  - `PUT /api/companies/:id` → Update company settings.
  - `POST /api/corporate-login` → Corporate login (company name lookup).

# Prototype Features

## Organiser Side
- Event list view (`/organiser`).
- Create event (fields: client name, title, date, time, venue, description).
- Event dashboard (`/organiser/:event_id`):
  - View guest list (pulled from `guests.csv`).
  - View uploaded KYC (from `/uploads`).
  - Export guest list as CSV.
  - Edit event details (reschedule, update venue, change status).
  - Manage communications (send announcements, reminders via email/SMS integration in future phases).

## Guest Side
- Guest login via `/` → redirect to dashboard.
- Guest dashboard (`/guests/:guest_id`):
  - Register/update details (written to `guests.csv`).
  - Upload KYC file → saved to `/uploads`.
  - View event details (agenda, venue, time, organiser contact info).
  - RSVP to event (Yes/No/Maybe).
  - Download event materials (agenda PDF, ticket, instructions).

## Corporate Side
- Corporate login via company name → redirect to dashboard.
- Corporate dashboard (`/corporate/:company_id`):
  - View all company events and participation status.
  - Employee management (view all employees, registration status, RSVP tracking).
  - Analytics dashboard (participation rates, KYC completion, event-wise stats).
  - Bulk operations (send notifications, export data, update employee info).
  - Company settings (update company info, manage requirements).
  - Export reports (employee lists, participation reports, event summaries).

# Functional Requirements
- **CSV Storage:**
  - `events.csv` for event data.
  - `guests.csv` for guest data.
  - `companies.csv` for company data and settings.
- **File Uploads:** Save KYC to `/uploads` folder with filename pattern `guestid_filename.ext`.
- **CSV Export:** Organisers can download updated guest list per event.
- **Minimal Login:** Guest username lookup from `guests.csv`.
- **Corporate Access:** Company name lookup for corporate dashboard access.
- **Analytics:** Real-time participation and registration statistics.

# Database Design (CSV-based Prototype)

## events.csv
| Column       | Type   | Description                        | Example                      |
| ------------ | ------ | ---------------------------------- | ---------------------------- |
| event_id     | String | Unique ID for event (UUID or auto) | `evt_001`                    |
| client_name  | String | Name of client hosting the event   | `Kotak Bank`                 |
| event_title  | String | Title of the event                 | `Kotak Annual Meet 2025`     |
| date         | Date   | Event date                         | `2025-12-15`                 |
| time         | String | Event time                         | `10:00 AM`                   |
| venue        | String | Event venue/location               | `Mumbai Convention Center`   |
| description  | String | Short description of the event     | `Annual corporate gathering` |

## guests.csv
| Column      | Type   | Description                        | Example                       |
| ----------- | ------ | ---------------------------------- | ----------------------------- |
| guest_id    | String | Unique ID for guest (UUID or auto) | `gst_101`                     |
| event_id    | String | ID of the event guest is linked to | `evt_001`                     |
| name        | String | Guest’s full name                  | `Rahul Sharma`                |
| email       | String | Guest’s email (used as username)   | `rahul.sharma@kotak.com`      |
| phone       | String | Guest’s phone number               | `+91-9876543210`              |
| company_id  | String | Guest’s employee/company ID        | `KOT12345`                    |
| kyc_file    | String | Path to uploaded KYC file          | `/uploads/gst_101_aadhar.pdf` |
| status      | String | Registration status (pending/ok)   | `registered`                  |

## companies.csv
| Column         | Type   | Description                        | Example                       |
| -------------- | ------ | ---------------------------------- | ----------------------------- |
| company_id     | String | Unique ID for company              | `comp_001`                    |
| company_name   | String | Name of the company                | `Kotak Bank`                  |
| contact_email  | String | Primary contact email              | `events@kotak.com`            |
| contact_phone  | String | Primary contact phone              | `+91-9876543210`              |
| address        | String | Company address                    | `Mumbai, Maharashtra`         |
| settings       | String | JSON string of company settings    | `{"kyc_required": true}`      |
| created_at     | String | Company registration date          | `2025-01-15`                  |

# Non-Functional Requirements
- **Performance:** <2s load time (CSV read/write is lightweight).
- **File Size Limits:** 5MB max per KYC file.
- **Simplicity:** Prioritize quick prototype delivery.
- **Persistence:** Data stored in CSV & `/uploads` folder (no DB).

# UI Guidelines
- **Tone:** Premium, calm, and functional.
- **Colors:** Dark background (`#0B1220`), gold accents (`#D4AF37`), off-white text, muted grays for secondary info.
- **Typography:** Clean UI font (Inter/DM Sans). Serif only for event landing/invites.
- **Layout:** Mobile-first responsive design; max width ~1200px; use cards for grouping.
- **Hierarchy:** Data clarity first; accents only for highlights (buttons, status, links).
- **Branding:** Allow event-level banners/themes for landing pages, but keep admin/guest dashboards simple.

# Phases

## Phase 1 — Core Setup
- Project setup in Next.js (App Router).
- Create `/data/events.csv` and `/data/guests.csv`.
- Implement `/api/events` (CRUD).
- Implement `/api/guests` (basic create + fetch).
- `/organiser` page: list events from CSV + create event.
- `/organiser/:event_id`: show event details (no guests yet).

## Phase 2 — Guest Flow
- `/` page with username input.
- `/api/login` to lookup `guests.csv` and redirect to `/guests/:guest_id`.
- `/guests/:guest_id`: form to fill name/email/phone/company ID.
- Implement KYC upload (save to `/uploads`).
- Update `/api/guests/:id` for updates.

## Phase 3 — Dashboard Enhancements
- `/organiser/:event_id`: show guest list from `guests.csv`.
- Show KYC file links in dashboard.
- Add CSV export (download guest list).
- Add basic error handling (invalid user, missing event, file too big).
- Polish UI with premium theme (dark + gold accents).

## Phase 4 — Corporate Panel
- Create `/corporate/:company_id` route and page.
- Implement corporate login system (`/api/corporate-login`).
- Build corporate dashboard with company events overview.
- Add employee management interface (view, filter, search employees).
- Implement analytics dashboard (participation rates, KYC completion).
- Add bulk operations (notifications, data export, employee updates).
- Create company settings management.
- Add corporate-specific CSV exports and reports.
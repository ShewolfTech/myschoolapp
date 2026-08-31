# Feature Reference & Test Steps

A complete list of everything currently built, organized by user type, with
steps to verify each feature works. Use this as a regression checklist
whenever you make changes — run through it before deploying if you've
touched anything auth- or role-related, since those are the areas most
prone to breaking silently.

Covers through the email notification system (post Step 5, plus everything
added since: curriculum filter, multi-school registration, media uploads,
password reset/change, admin review page, and transactional emails).

---

## Account basics (all roles)

### Sign up
- Go to `/signup`, pick a role (parent or school rep), fill in the form
- Password field must show a live checklist (8+ chars, uppercase, lowercase,
  number, special character) and an example strong password
- Confirm-password field must block submission if it doesn't match
- Every password field (signup, login, reset, change) has a click-to-reveal
  eye icon — confirm it toggles visibility correctly
- After signup: you're logged in immediately, and a gold banner appears
  site-wide saying you need to verify your email

### Email verification
- Check the inbox for the email used at signup — an activation email should
  arrive from `noreply@myschoolapp-ug.com`
- Click the link → should land on `/verify-email`, show "Email verified!",
  and the site-wide banner should disappear on the next page load
- **Restricted while unverified** (test both):
  - Try to save a favorite as an unverified parent → should show a clear
    inline error ("Please verify your email before saving schools."), not
    fail silently
  - Try to register a school as an unverified school_rep → same pattern,
    error shows inline on the registration form
- From the banner, click "Resend email" → confirm a fresh activation email
  arrives and the old link still works (or a new one does — either is fine,
  just confirm *something* usable arrives)
- Try an expired/garbage token in the `/verify-email?token=` URL → should
  show a clear "invalid or expired" message, not crash

### Login / logout
- Log in, refresh — should stay logged in
- Log out from any page — should redirect home, header immediately reflects
  logged-out state (no stale flash of the old state)

### Forgot password
- From `/login`, click "Forgot password?" → `/forgot-password`
- Submit an email — response message is the same generic text whether or
  not that email is registered (don't test by comparing wording, just
  confirm no error either way for a well-formed email)
- Check inbox for the real registered email → reset link arrives
- Click it → `/reset-password?token=...` → set a new password (same
  strength rules apply here too)
- Confirm a "your password was changed" notification email arrives
  separately from the reset email itself
- Try reusing the same reset link a second time → should fail (token is
  single-use)
- Try an old/expired link → clear error message

### Change password (logged in)
- From the header, "Change password" → requires current password + new
  password + confirm
- Wrong current password → clear inline error, doesn't proceed
- Success → confirms on-page, and a "password changed" notification email
  arrives (same email as the forgot-password flow triggers)

---

## Parent

### Search and filter schools
- `/schools` requires login — logged-out visitors get redirected to
  `/login`, both for this page and for `/schools/[slug]` directly
- Filters: name search, region, district (cascades from region), ownership
  type, level, boarding type, **and curriculum** (this one's newer — confirm
  picking "British" correctly isolates British-curriculum schools only)
- Empty-result state shows a helpful message, not a blank screen

### View school details
- Region/district, tags, description, facilities, grouped fee table,
  contact buttons
- **Photos and video**: if the school rep uploaded any, they should render
  here — a 3-photo grid plus an embedded video player if one was added

### Save / unsave a school
- Requires a **verified** email (see verification section above for the
  unverified-error case)
- Once verified: save from a detail page, confirm it shows under "Saved
  schools" in the nav, unsave and confirm it disappears

---

## School Representative

### Multiple schools per account
- A single school_rep account can now register more than one school (this
  changed from the original one-school limit) — confirm by registering two
  different schools on the same test account
- `/register-school` is now a **dashboard** listing all of that rep's
  schools with status badges, not a single-school status view
- "+ Register a school" goes to `/register-school/new`; each listed school
  has an "Edit" link to `/register-school/[id]/edit`

### Registering a school
- Requires a **verified** email — see verification section for the
  unverified-error case
- Fill out the full form: basic details, cascading region/district,
  ownership, levels (multi-select), boarding type, curriculum, facilities
  (tag input), fee structure (dynamic rows)
- **Photos**: up to 3, 2MB each, JPG/PNG/WEBP only — try exceeding either
  limit and confirm the upload is rejected *before* any network request
  fires, with a clear message
- **Video**: up to 1, 10MB, MP4/MOV only — same validation pattern
- Submit → status shows "pending" on the dashboard
- Confirm an email arrives at every admin account's inbox notifying them of
  the new submission, with a working link to the review page

### Editing a school
- Any edit (regardless of current status — pending, approved, or rejected)
  resets status to "pending" and requires re-review — this is intentional
- Rejected schools show the admin's rejection reason on the dashboard

### Approval / rejection notifications
- Once an admin approves: confirm an email arrives at the rep's address
  with a working link to the now-live public listing
- Once an admin rejects: confirm an email arrives with the rejection reason
  and a working link straight to the edit form

---

## Admin

Admin accounts are created via `scripts/makeAdmin.ts`, not self-service
signup — see README for the process.

### Access control
- `/admin` and `/admin/schools/[id]` both redirect non-admins away (to
  `/login` if logged out, to `/` if logged in as the wrong role)

### Review workflow
- `/admin` shows a simple list (name, district/region, ownership,
  submitter) with a "Review" button per row — **no approve/reject buttons
  directly in the list**
- Clicking "Review" opens the full submission: description, photos, video,
  facilities, complete fee table, contact info, and submitter details
- Approve/Reject actions live at the bottom of *that* page, not the list —
  confirm you can't approve/reject without first opening the review page
- Rejecting requires a typed reason; submitting empty should block with an
  inline error
- For already-decided schools, confirm the "change my mind" secondary
  action works (approve after a rejection, or vice versa)
- Status tabs (Pending/Approved/Rejected/All) filter correctly

### Notifications
- New submissions email **every** admin account, not just one hardcoded
  address — worth testing with two admin accounts if you have them
- Confirm the notification email actually lands in the real
  `admin@myschoolapp-ug.com` inbox, not just Resend's dashboard logs

---

## Cross-cutting checks (run after any auth/role/email change)

- Role-based nav in the header only shows links relevant to that role
- Session persists across refresh; logout is immediate and complete
- Public API routes (`/api/schools`, `/api/schools/[slug]`) never leak
  pending/rejected schools regardless of who's asking
- Every transactional email (activation, reset, password-changed, new
  submission, approved, rejected) sends from `noreply@myschoolapp-ug.com`
  and doesn't block the underlying action if sending fails (e.g. approving
  a school should still succeed even if the notification email errors)
  
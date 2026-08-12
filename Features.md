# Feature Reference & Test Steps

A complete list of everything currently built, organized by user type, with
steps to verify each feature works. Use this as a regression checklist
whenever you make changes — run through it before deploying if you've
touched anything auth- or role-related, since those are the areas most
prone to breaking silently (a page that should be protected but isn't, or
a feature that's now hidden for the wrong role).

Covers through **Step 5**. Will be updated as new steps land.

---

## Parent (no account required)

Parents can do everything below **without logging in**. An account only
adds the ability to save favorites.

### Search and filter schools
- Go to `/schools`
- Test each filter independently, then in combination:
  - Free-text search by school name (partial matches should work, e.g.
    "Gayaza" finds "Gayaza High School")
  - Region tabs (Central / Eastern / Northern / Western / All)
  - District dropdown — should only populate with districts from the
    currently selected region, and reset when you change region
  - Ownership type (Government / Private / Government-Aided)
  - Level (Nursery / Primary / Secondary)
  - Boarding type (Day / Boarding / Both)
- **Expected:** result count updates live, list only ever shows
  **approved** schools (never pending/rejected ones)
- Try a filter combination that matches nothing — should show the "No
  schools match yet" empty state, not an error

### View school details
- Click into any school from the search results
- **Expected:** region/district, ownership/level/boarding/curriculum tags,
  description, facilities list, grouped fee table (by level + term), and
  working "Call" / "Email" contact buttons
- Try a school with no email set — the Email button should simply not
  render (not show a broken link)

### Save / unsave a school (requires login)
- While logged out, click "Save school" on a detail page
- **Expected:** redirects to `/login` (doesn't silently fail or error)
- Log in as a parent, return to a school detail page, click "Save school"
- **Expected:** button fills in and changes to "Saved"
- Go to "Saved schools" in the nav — the school should appear there
- Go back to the school detail page, click "Saved" to unsave
- **Expected:** disappears from `/favorites` list
- Log in as a **different** parent account — their saved list should be
  empty / independent of the first account's saves

---

## School Representative

### Sign up as a school rep
- Go to `/signup`, choose "I represent a school"
- **Expected:** redirected to home page, logged in, header shows your
  name + "school_rep" and a "My school" nav link

### Register a school
- Click "My school" → fill out the form:
  - Required fields enforced: name, region, district, ownership type, at
    least one level, boarding type, phone
  - District dropdown is empty until a region is picked
  - Add a few facilities via the tag input (Enter or "Add" button both
    work; duplicates are prevented)
  - Add at least one fee row; try removing a row too
- Submit
- **Expected:** status view showing "pending", with a note that it won't
  appear in public search yet
- Search for the school name at `/schools` — **should not appear** (still
  pending)

### One school per account
- While still logged in as the same school_rep, try to find a way to
  register a second school
- **Expected:** there's no UI path to do this — "My school" always shows
  your existing school's status/edit view once you have one registered.
  (If testing the API directly: a second POST to `/api/schools/mine`
  should return a 409 error.)

### Edit a pending/approved/rejected submission
- Click "Edit details" from the status view
- Change something (e.g. add a facility) and resubmit
- **Expected:** status resets to "pending" regardless of what it was
  before — even editing an already-approved school sends it back for
  re-review (this is intentional, not a bug)

### View a rejection reason
- (Needs an admin to reject the submission first — see Admin section)
- Log back in as the school_rep after a rejection
- **Expected:** status view shows "rejected" plus the admin's typed
  reason, with an option to edit and resubmit

---

## Admin

Admin accounts aren't self-service — see `README.md` for how to create one
via `scripts/makeAdmin.ts`.

### Access control
- Try visiting `/admin` while logged out — should redirect to `/login`
- Try visiting `/admin` while logged in as a parent or school_rep —
  should redirect to `/` (not show the dashboard, not error)
- Log in as an actual admin — `/admin` should load normally, and an
  "Admin" link should appear in the header nav

### Review pending submissions
- Go to `/admin`, confirm the **Pending** tab is selected by default
- Find a school submitted by a school_rep (see previous section)
- Click **Approve**
- **Expected:** school disappears from Pending tab, appears under
  Approved tab, and now shows up in public search at `/schools`

### Reject a submission
- Submit another test school as a school_rep (or reuse one)
- In the admin dashboard, click **Reject**
- Try submitting with an empty reason — should show a validation error
  and not proceed
- Type a reason, confirm rejection
- **Expected:** moves to Rejected tab; logging in as that school_rep shows
  the reason on their status view (see School Rep section above)

### Status tabs and filtering
- Click through Pending / Approved / Rejected / All tabs
- **Expected:** each tab's list matches its label; "All" shows everything
  regardless of status, sorted newest-first

---

## Cross-cutting things worth checking after any change

These aren't single features but behaviors that touch multiple roles —
worth a quick pass whenever you touch auth, roles, or the School model:

- **Session persistence:** log in, refresh the page — should stay logged
  in (not bounce to logged-out state)
- **Role-based nav:** log in as each of the three roles in turn and
  confirm the header shows only the links relevant to that role ("My
  school" only for school_rep, "Admin" only for admin, "Saved schools"
  only for parent)
- **Logout:** works from any page, redirects to home, and immediately
  reflects the logged-out header state (no stale "logged in" flash)
- **Public data never leaks pending/rejected schools:** the two public
  routes (`/api/schools` and `/api/schools/[slug]`) should always filter
  to `status: "approved"` — worth double-checking after any edit to
  either route file
  
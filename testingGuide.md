# School Directory Uganda — Testing Guide

Thanks for taking the time to try this out. This is an early working version —
the goal right now is to test the **core flow**: parents finding schools,
schools registering themselves, and an admin approving what gets published.

A few things aren't built yet (parent favorites, in-app inquiry messaging,
photos) — those are coming in later steps. For now, please focus on whether
the flows below feel clear and useful.

**App link:** _[to be added once deployed]_

---

## 1. As a Parent (no account needed)

This is the main experience — most parents will never need to log in.

1. Go to the homepage and click **"Find a school"** (or click one of the four
   region names).
2. Try the filters:
   - Search by school name
   - Filter by Region → District (district list updates based on region)
   - Filter by ownership type (Government / Private / Government-Aided)
   - Filter by level (Nursery / Primary / Secondary)
   - Filter by boarding type
3. Click into a few schools and check the detail page:
   - Are the fees shown clearly?
   - Is the contact info (call / email buttons) useful?
   - Does anything feel missing that you'd want to see before choosing a
     school for your child?

**What to tell us:** Would this have helped you find a school outside your
usual area? What's the first thing you'd want to filter by that isn't there
yet?

---

## 2. As a School Representative

This simulates a school signing up to be listed.

1. Click **"Sign up"** (top right).
2. Choose **"I represent a school"**, fill in your name/email/password.
3. After signing up, click **"My school"** in the top nav.
4. Fill out the registration form:
   - Basic details, region/district, ownership type, levels offered
   - Add a few facilities (type one, hit Enter or click Add)
   - Add at least one fee line item (e.g. "Senior 1 / Term 1 / Tuition / 500000")
   - Add contact info
5. Submit. You'll see a **"pending"** status — this is normal. It won't show
   up in public search yet.
6. Try clicking **"Edit details"** and changing something, then resubmit.

**What to tell us:** Was any part of the form confusing? Is there information
about your school you'd want to add that isn't on the form?

> Note: each account can register **one** school for now.

---

## 3. As the Admin (reviewing submissions)

This role is normally just for us, but it's worth seeing how approvals work.

**You'll need admin credentials from us first** — we'll set this account up
separately and send you the login. Once you have it:

1. Log in with the admin account.
2. Click **"Admin"** in the top nav.
3. You'll see tabs: Pending / Approved / Rejected / All.
4. On the **Pending** tab, find the school submitted in Step 2:
   - Click **Approve** — it should now show up in public search
   - Or click **Reject** and type a reason — the school rep will see that
     reason when they log back in
5. Go back to the public **"Find a school"** page (log out, or open an
   incognito window) and confirm the approved school now appears in search.

**What to tell us:** Is there anything you'd want to check before approving a
school (e.g. verifying it's a real school) that this doesn't currently
support?

---

## Quick reference

| Role | How to access | Notes |
|---|---|---|
| Parent | No login needed | Just visit the site |
| School Rep | Sign up → choose "I represent a school" | One school per account |
| Admin | Login provided separately by us | Not self-service signup |

If anything breaks, crashes, or looks obviously wrong, please send us:
- What you clicked right before it happened
- A screenshot if possible
- Whether you were logged in, and as which role

Thank you for testing!

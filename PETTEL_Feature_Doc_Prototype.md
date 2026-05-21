# PETTEL Prototype Feature Document
**For:** Developer adding 3 new solution features to the existing Test-UI prototype
**Existing prototype:** `index.html` (listing + filter), `detail.html` (sitter profile), `data.js` (mock data), `script.js`, `styles.css`
**Scope:** UI/prototype only — no real backend needed. All data stays in `data.js` as mock.

---

## Context: 3 Solutions to Implement

| Solution | HMW Problem | Feature Name |
|----------|-------------|--------------|
| 1 | Trust & Safety | Trust Badge System + In-app Chat with Live Updates |
| 2 | Personalization & Fit | Pet ID Cards (multi-pet) + Smart Match |
| 3 | Decision-making & Confidence | Confidence Score + Escrow Payment |

---

## Solution 1 — Trust Badge System

### What it is
A 3-tier badge system displayed on sitter cards and profiles so users immediately know how vetted a caregiver is.

### Trust Levels
| Level | Label | Requirements | Badge Color |
|-------|-------|--------------|-------------|
| 3 | PETTEL Pro | Full background check + 50+ verified reviews + certificate | Gold 🥇 |
| 2 | PETTEL Verified | ID verified + 10+ verified reviews | Silver 🥈 |
| 1 | New Member | ID submitted, building reputation | Bronze 🥉 |

### Changes to `data.js`
Add 2 new fields to every sitter object:
```js
trustLevel: "pro" | "verified" | "new",   // determines badge
verifiedDetails: {
  idCheck: true | false,
  backgroundCheck: true | false,
  hasCertificate: true | false,
  verifiedReviewCount: 312,               // reviews from completed bookings only
  liveUpdates: true | false               // can send real-time photo/video
}
```

### Changes to listing cards (`index.html` / `script.js`)
- Add a badge chip below the sitter name on each card
  - Pro → gold medal icon + "PETTEL Pro"
  - Verified → silver medal icon + "PETTEL Verified"
  - New Member → bronze medal icon + "New Member"
- Add a filter pill in the filter bar: `[ ] Chỉ PETTEL Pro` `[ ] Verified trở lên`

### Changes to detail page (`detail.html`)
- Add a "Trust & Verification" section (below the description, above amenities):
  - Row items with ✅/❌ icons: ID Check | Background Check | Certificate | Live Updates
  - Count of verified reviews: "312 đánh giá từ booking đã hoàn thành"
- Add a small badge next to the sitter name in the page title
- In the reviews section: tag each review with "✅ Đã hoàn thành booking" label (verified reviews only)

### In-app Chat with Live Updates, Video Call & Live Cam

**New page: `chat.html`** — accessible from the detail page via a "Nhắn tin" button in the booking sidebar, and from the owner's booking history.

The chat page simulates a conversation between **Pet Owner** and **Pet Service Provider**, and is the hub for all 3 real-time communication features.

---

#### Feature A — Text Chat with Photo Updates

**Chat UI layout:**
- Header: sitter avatar + name + online status dot + action buttons (see Feature B & C below)
- Message bubbles (owner on right, sitter on left)
- Input bar at the bottom: text field + send button + 📷 photo icon (non-functional for prototype)

**Mock messages to pre-populate:**
```
[Sitter - 12:30]
"Min đang ăn trưa ngoan lắm ạ! 🍽️"
[Photo card: placeholder image · caption "Min đang ăn trưa 🍽️ · 12:30"]

[Sitter - 14:00]
"Mun đang ngủ rồi ạ 😴 Bé ngủ rất ngon!"
[Photo card: placeholder image · caption "Mun đang ngủ 😴 · 14:00"]

[Owner - 14:05]
"Cảm ơn bạn nhiều nhé! Trông có vẻ bé ổn rồi 🥰"
```

Photo cards are static image thumbnails with a caption below. No real upload needed.

---

#### Feature B — Video Call

**What it is:** Owner initiates a one-on-one video call with the sitter to visually check on their pet in real time.

**Entry point:** A `📹 Gọi video` icon button in the chat header (top right, next to the sitter name).

**UI — Video Call screen (`videocall.html` or full-screen overlay on `chat.html`):**
```
┌────────────────────────────────────────┐
│  [Remote feed — sitter's camera]       │
│  Large area, dark background           │
│  Placeholder: looping gif / static     │
│  image of a cat being held by sitter   │
│                                        │
│  ┌──────────────┐                      │
│  │ [Self view]  │  ← small PiP corner  │
│  │ (owner cam)  │     static avatar ok  │
│  └──────────────┘                      │
│                                        │
│  ── Call timer: 00:47 ──               │
│                                        │
│  [🎤 Tắt mic]  [📹 Tắt camera]  [🔴 Kết thúc]  │
└────────────────────────────────────────┘
```

- No real WebRTC needed — this is a static mock screen
- "Remote feed" area: use a looping placeholder image or a short gif of a cat/dog being held
- Self-view PiP corner: use a static avatar or grey box labeled "Bạn"
- Call timer counts up using `setInterval` in JS (purely cosmetic)
- `[🔴 Kết thúc]` closes the overlay and returns to chat

---

#### Feature C — Live Cam Feed (no call needed)

**What it is:** The pet sitter has set up a dedicated camera in the room or cage. The owner can open a live feed at any time during the booking period — no call, no interaction with the sitter required.

This is distinct from Video Call: it's always-on, passive monitoring, like a security camera.

**Entry point:** A `📷 Xem cam trực tiếp` button in the chat header, shown **only if** the sitter has `liveUpdates: true` in their `verifiedDetails` (already in `data.js` schema).

**UI — Live Cam screen (`livecam.html` or full-screen overlay on `chat.html`):**
```
┌────────────────────────────────────────┐
│  🔴 LIVE                               │
│                                        │
│  [Camera feed area]                    │
│  Static placeholder image or looping   │
│  gif showing pet in a cage/room        │
│                                        │
│  📍 Phòng của Min & Mun · Cat Moon Hotel│
│  🕐 Cập nhật: vừa xong                 │
│                                        │
│  [Chụp màn hình]    [Đóng]             │
└────────────────────────────────────────┘
```

- "🔴 LIVE" badge pulses with a CSS animation (red dot blink)
- Feed area: static placeholder image (e.g. `images/hotel_interior.png` already in the prototype)
- "Chụp màn hình" button is non-functional (can show a toast: "Đã lưu ảnh")
- Timestamp "vừa xong" updates every 30s using `setInterval` (cosmetic)
- `[Đóng]` returns to chat

**If sitter does NOT have `liveUpdates: true`:** hide the button entirely — do not show a disabled state, to avoid confusion.

---

**"Nhắn tin" entry point on `detail.html`:** Add a secondary button below "Đặt lịch ngay" in the booking sidebar: `💬 Nhắn tin với sitter`

---

## Solution 2 — Pet ID Card + Smart Match

### What it is
Owner creates a digital profile for their pet once. It auto-attaches to every booking. The search filters use it to surface only matching sitters.

### New page: `pet-profile.html`
A standalone page linked from the header ("Hồ sơ thú cưng" button).

**Rule: 1 pet = 1 ID Card. 1 owner can have multiple pets = multiple cards.**

**Page layout:**
- Top: "Thú cưng của tôi" heading + `[+ Thêm thú cưng]` button
- Below: a horizontal row (or grid) of Pet ID Cards, one per pet
- Mock pre-populate with 2 cards for the persona (Min and Mun) so the page isn't empty

**Each Pet ID Card (individual card UI):**
```
┌─────────────────────────────────────────┐
│ 🐱 Min                                  │
│ Digital pet profile · Auto-shared        │
├──────────────┬──────────────────────────┤
│ Species      │ Diet                     │
│ Cat · Male · │ 2× daily · No fish       │
│ 3 yrs        │                          │
├──────────────┼──────────────────────────┤
│ Vaccination  │ Personality              │
│ Up to date · │ Shy · Indoor only        │
│ Mar 2026     │                          │
├──────────────┴──────────────────────────┤
│ ⚠️ Special Note                          │
│ Stress when meeting strangers —          │
│ needs 30 min warm-up before handling    │
└─────────────────────────────────────────┘
         [✏️ Chỉnh sửa]  [🗑️ Xóa]
```

```
┌─────────────────────────────────────────┐
│ 🐱 Mun                                  │
│ Digital pet profile · Auto-shared        │
├──────────────┬──────────────────────────┤
│ Species      │ Diet                     │
│ Cat · Male · │ 3× daily · Wet food only │
│ 1.5 yrs      │                          │
├──────────────┼──────────────────────────┤
│ Vaccination  │ Personality              │
│ Up to date · │ Active · Shy w/ strangers│
│ Jan 2026     │                          │
├──────────────┴──────────────────────────┤
│ ⚠️ Special Note                          │
│ Ăn nhiều, cần kiểm soát khẩu phần       │
└─────────────────────────────────────────┘
         [✏️ Chỉnh sửa]  [🗑️ Xóa]
```

**"+ Thêm thú cưng" → opens a form (inline or modal) to create a new card:**
- Pet name (text)
- Species: Cat / Dog (radio)
- Sex: Male / Female (radio)
- Age (number, years)
- Diet notes (textarea)
- Vaccination status + date (checkbox + date picker)
- Personality tags (multi-select checkboxes): Friendly / Shy / Active / Indoor only / Outdoor
- Special notes (textarea)
- [Lưu thẻ] button → adds a new card to the page

Clicking [✏️ Chỉnh sửa] on an existing card opens the same form pre-filled with that pet's data.

No backend needed — use `localStorage` to store the array of pet profiles. Each pet is one object in the array.

**localStorage data shape:**
```js
// key: "pettel_pets"
[
  { id: "min", name: "Min", species: "cat", sex: "male", age: 3, diet: "2× daily · No fish", vaccination: "Up to date · Mar 2026", personality: ["shy", "indoor-only"], specialNote: "Stress when meeting strangers — needs 30 min warm-up" },
  { id: "mun", name: "Mun", species: "cat", sex: "male", age: 1.5, diet: "3× daily · Wet food only", vaccination: "Up to date · Jan 2026", personality: ["active", "shy"], specialNote: "Ăn nhiều, cần kiểm soát khẩu phần" }
]
```

### Smart Match — changes to `index.html` / `script.js`
- Add a "Smart Match" toggle button in the filter bar: `✨ Smart Match`
- When toggled ON: show a dropdown to select which pet to match for (e.g. "Min" / "Mun" / "Tất cả")
  - Auto-populate filters using the selected pet's profile from localStorage
  - e.g. selecting Min (Shy + Indoor only + No fish) → auto-check those filter checkboxes
  - Show a banner below the filter bar: "Bộ lọc đang dựa trên hồ sơ của Min 🐱"
- The existing filter logic already handles petType, personality, specialNeeds, diet, environment — Smart Match just pre-fills those checkboxes based on the chosen pet

### Care Instruction Notes — changes to detail page
- Add a "Ghi chú cho người chăm" section in the booking sidebar
- Textarea for owner to type specific instructions
- Show a static example: "Min cần 30 phút làm quen trước khi được chạm vào. Không cho ăn cá."
- Label it "Sẽ được gửi tự động khi đặt lịch"

---

## Solution 3 — Confidence Score + Escrow

### Confidence Score

**What it is:** A 0–100 composite score shown on every sitter card and detail page. Replaces the need for users to mentally aggregate all signals.

**Score formula (for mock data — just hardcode values in `data.js`):**
Add field: `confidenceScore: 92` (integer 0–100)

Guidelines for assigning mock scores:
- Pro + 300+ reviews + background check → 85–100
- Verified + 50–299 reviews → 65–84
- New Member or few reviews → 40–64

**Changes to listing cards:**
- Add a score pill top-right of the card image: `Score 92` (dark background, white text)
- Sort cards by confidenceScore descending by default

**Changes to detail page:**
- Add a "Confidence Score" row in the sidebar/booking panel: large number "92 / 100"
- Add a short breakdown below it:
  - ⭐ Reviews: 4.9 (147)
  - ✅ Trust Level: PETTEL Pro
  - 🎯 Match with your pet: 95%  ← static mock, tie to pet profile if time allows

### Escrow Payment UI

**Changes to detail page — booking sidebar:**
- After the date picker and price summary, add a section:

```
🔒 Thanh toán an toàn qua PETTEL
   Tiền giữ tạm · Hoàn trả 100% nếu hủy
   Chỉ chuyển cho sitter sau khi bạn xác nhận hoàn thành
   [Đặt lịch ngay]
```

- Style the escrow note with a light green background and lock icon
- The "Đặt lịch ngay" button is a mock — clicking shows a success modal: "Đặt lịch thành công! Tiền đang được giữ an toàn bởi PETTEL."

---

## Summary of Files to Edit

| File | Changes |
|------|---------|
| `data.js` | Add `trustLevel`, `verifiedDetails`, `confidenceScore` to all sitter objects |
| `index.html` | Smart Match toggle + pet selector dropdown, Smart Match banner, Trust filter pills |
| `script.js` | Smart Match logic (read selected pet from localStorage array → pre-fill filters), sort by confidenceScore |
| `detail.html` | Trust & Verification section, "Nhắn tin" button in sidebar, Care Instruction notes textarea, Confidence Score in sidebar, Escrow payment block, Booking success modal |
| `chat.html` | **New file** — chat UI with 3 features: text chat (mock messages + photo cards), Video Call button, Live Cam button |
| `videocall.html` or overlay | **New file/overlay** — mock video call screen: remote feed placeholder, self-view PiP, JS call timer, end call button |
| `livecam.html` or overlay | **New file/overlay** — mock live cam screen: pulsing LIVE badge, static feed image, cosmetic timestamp, only shown for sitters with `liveUpdates: true` |
| `pet-profile.html` | **New file** — multi-pet list page, individual Pet ID Cards (one per pet), add/edit/delete pet form, localStorage array |
| `styles.css` | Badge styles (gold/silver/bronze), Score pill, Escrow block, Pet ID Card styles, Chat bubble styles, Video Call overlay, Live Cam LIVE badge pulse animation |

---

## What NOT to build (out of scope for prototype)
- Real authentication or login
- Real payment processing
- Real media upload for live updates
- Real background check API
- Push notifications
- Backend / database

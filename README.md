# PowerApps Modern Controls Plus

A suite of professional, Fluent UI v9 based PCF components for Power Apps Canvas Apps. These components provide a premium look and feel, matching the modern Microsoft design language.

## Components Included

| Component | Description |
|-----------|-------------|
| **FluentBreadcrumb** | A breadcrumb navigation trail. |
| **FluentMessageBar** | A notification/alert bar with various intents (Success, Error, Warning, Info). |
| **FluentCard** | A versatile card component for displaying content. |
| **FluentDialog** | A modal/non-modal dialog for confirmations, alerts, and forms. |
| **FluentToast** | Temporary notification messages that auto-dismiss. |

---

## Installation

1. Download the latest `Solution.zip` from the [Releases](https://github.com/armanaxf/PowerApps-ModernControls-Plus/releases) page.
2. Go to the **Power Apps Maker Portal** (make.powerapps.com).
3. Navigate to **Solutions** -> **Import solution**.
4. Select the `Solution.zip` file and follow the wizard to import.
5. In your Canvas App, go to **Insert** -> **Get more components** -> **Code**.
6. Search for the component name and import it.

---

## Component Usage

### FluentDialog

A modal dialog for confirmations, alerts, and user interactions. Blocks page interaction until dismissed.

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `IsOpen` | Boolean | `false` | Controls dialog visibility. Bind to a variable. |
| `ModalType` | Enum | `"modal"` | `"modal"` (blocks page), `"nonmodal"` (page interactive), `"alert"` (must use button) |
| `Title` | Text | `"Dialog Title"` | Header text |
| `ContentText` | Text | | Main message body |
| `PrimaryButtonText` | Text | `"OK"` | Primary action button label |
| `SecondaryButtonText` | Text | `"Cancel"` | Secondary action button label |
| `ShowPrimaryButton` | Boolean | `true` | Show/hide primary button |
| `ShowSecondaryButton` | Boolean | `true` | Show/hide secondary button |
| `ShowCloseButton` | Boolean | `false` | Show X button in title bar (auto-shown for non-modal) |
| `ActionsPosition` | Enum | `"end"` | `"end"` (right-aligned) or `"start"` (left-aligned) |
| `FluidActions` | Boolean | `false` | Stretch buttons to full width |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `UserAction` | Text | Last action: `"primary"`, `"secondary"`, `"close"`, or `"dismiss"` |

**Events:**

| Event | When it fires |
|-------|---------------|
| `OnPrimaryAction` | Primary button clicked |
| `OnSecondaryAction` | Secondary button clicked |
| `OnClose` | Dialog closed (any method) |
| `OnOpenChange` | Open state changes |

**Example - Confirmation Dialog:**

```powerfx
// Button to open dialog
Set(varShowDialog, true)

// FluentDialog1.OnPrimaryAction
Remove(MyCollection, SelectedRecord);
Set(varShowDialog, false)

// FluentDialog1.OnSecondaryAction  
Set(varShowDialog, false)
```

---

### FluentToast

Temporary notification messages that appear and auto-dismiss. Ideal for success messages, errors, and status updates.

> **Important**: The toast renders inside its component boundary. Give the component sufficient width/height (minimum 400x200px) and place it in a corner of your screen.

**How It Works:**

The toast uses **edge-triggered dispatch**. A toast appears when `DispatchToast` transitions from `false` → `true`.

```
DispatchToast:  false → true → false → true
                       ↑              ↑
                  Toast 1        Toast 2
```

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `DispatchToast` | Boolean | `false` | `false` → `true` shows a new toast |
| `Title` | Text | `"Notification"` | Toast header |
| `BodyText` | Text | | Toast message body |
| `Subtitle` | Text | | Small text below body |
| `Intent` | Enum | `"info"` | `"success"` (green), `"info"` (blue), `"warning"` (yellow), `"error"` (red) |
| `Position` | Enum | `"bottom-end"` | Toast position: `"top"`, `"top-start"`, `"top-end"`, `"bottom"`, `"bottom-start"`, `"bottom-end"` |
| `Timeout` | Number | `3000` | Auto-dismiss in milliseconds. Use `-1` for no auto-dismiss. |
| `PauseOnHover` | Boolean | `true` | Pause timeout when mouse hovers |
| `PauseOnWindowBlur` | Boolean | `false` | Pause timeout when window loses focus |
| `MaxToasts` | Number | `5` | Maximum visible toasts (extras are queued) |
| `ShowAction` | Boolean | `false` | Show action link in toast |
| `ActionText` | Text | `"Dismiss"` | Action link text |
| `DismissAllToasts` | Boolean | `false` | `false` → `true` dismisses all visible toasts |
| `Appearance` | Enum | `"default"` | `"default"` or `"inverted"` (dark) |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `ToastStatus` | Text | Current status: `"queued"`, `"visible"`, `"dismissed"`, `"unmounted"` |
| `LastToastId` | Text | ID of last dispatched toast |
| `ActionClicked` | Boolean | `true` when action link clicked |
| `VisibleToastCount` | Number | Count of visible toasts |

**Events:**

| Event | When it fires |
|-------|---------------|
| `OnToastDispatched` | Toast created |
| `OnToastDismissed` | Toast dismissed (timeout or action) |
| `OnActionClick` | User clicks action link |
| `OnStatusChange` | Toast lifecycle changes |

**Example - Show Success Toast:**

```powerfx
// Submit button OnSelect
SubmitForm(EditForm1);
Set(varToastTitle, "Saved!");
Set(varToastIntent, "success");
Set(varShowToast, true);
Set(varShowToast, false)  // Reset for next use
```

**Example - Auto-Reset Pattern:**

```powerfx
// FluentToast1.OnToastDismissed
Set(varShowToast, false)  // Auto-reset when toast disappears
```

---

### FluentMessageBar

Display inline status messages to the user.

**Properties:**
- **Message** (String): Text to display.
- **Intent** (String): `success`, `error`, `warning`, `info`.
- **Type** (String): `message` (inline) or `alert` (popup style).

---

### FluentBreadcrumb

Navigation trail for hierarchical data.

**Properties:**
- **Items** (Table): Crumbs with `key`, `text`, `href`.

**Events:**
- **OnSelect**: Fires when a crumb is clicked.

---

### FluentCard

A versatile card component for displaying content.

---

## Build & Development

```bash
# Install Dependencies
npm install

# Build Components
npm run build

# Package Solution
dotnet build Solution/Solution.cdsproj --configuration Release
```

---

*Maintained by PowerApps Modern Controls Plus Team*

# PowerApps Modern Controls Plus

A suite of professional, Fluent UI v9 based PCF components for Power Apps Canvas Apps. These components provide a premium look and feel, matching the modern Microsoft design language.

![Modern Controls Overview](assets/overview.png)
*(Replace with actual screenshot of components in action)*

## Components Included

| Component | Description |
|-----------|-------------|
| **FluentNav** | A collapsible, responsive navigation drawer with support for nested items and icons. |
| **FluentHamburger** | A lightweight hamburger menu button to control the navigation drawer. |
| **FluentBreadcrumb** | A breadcrumb navigation trail. |
| **FluentMessageBar** | A notification/alert bar with various intents (Success, Error, Warning, Info). |
| **FluentCard** | A versatile card component for displaying content. |

---

## Installation

1. Download the latest `Solution.zip` from the [Releases](https://github.com/armanaxf/PowerApps-ModernControls-Plus/releases) page.
2. Go to the **Power Apps Maker Portal** (make.powerapps.com).
3. Navigate to **Solutions** -> **Import solution**.
4. Select the `Solution.zip` file and follow the wizard to import.
5. In your Canvas App, go to **Insert** -> **Get more components** -> **Code**.
6. Search for `FluentNav`, `FluentHamburger`, etc., and import them.

---

## Component Usage

### 1. FluentNav `FluentNav`

The core navigation component.

**Properties:**
- **Items** (Table): The navigation structure.
  - `key`: Unique ID.
  - `name`: Display text.
  - `icon`: Icon name (e.g., "Home", "Settings", "Document", "Grid", "Apps").
  - `parentKey`: (Optional) Key of the parent item for nesting.
- **SelectedKey** (String): The key of the currently selected item.
- **IsOpen** (Boolean): Controls the expanded/collapsed state. *Note: The component manages its own state, but this property can force a state.*
- **HeaderTitle** (String): Title displayed at the top of the nav.
- **HeaderImageUrl** (String): URL for the header avatar/logo.

**Outputs:**
- **IsCollapsed** (Boolean): Returns `true` if the nav is currently collapsed.
- **SelectedKey** (String): The current selection.

**Events:**
- **OnSelect**: Fires when an item is selected. use `FluentNav1.SelectedKey` to get the value.

**Power Fx Example:**
```powerfx
// Items Table
Table(
    { key: "home", name: "Home", icon: "Home" },
    { key: "docs", name: "Documents", icon: "Document" },
    { key: "settings", name: "Settings", icon: "Settings" }
)

// OnSelect
Notify("Selected: " & FluentNav1.SelectedKey)
```

![FluentNav Screenshot](assets/fluent-nav.png)

---

### 2. FluentHamburger `FluentHamburger`

A dedicated button to toggle the Navigation component externally.

**Properties:**
- **Tooltip** (String): Text shown on hover (default: "Toggle navigation").
- **Theme** (String): "webLightTheme" or custom.

**Events:**
- **OnSelect**: Fires when clicked.

**Common Usage (Toggle Navigation):**
Place this component outside the `FluentNav` (or in a header bar).

```powerfx
// OnSelect
Set(varNavOpen, !varNavOpen)
```
*Link this variable to the `FluentNav.IsOpen` property.*

![FluentHamburger Screenshot](assets/fluent-hamburger.png)

---

### 3. FluentMessageBar `FluentMessageBar`

Display status messages to the user.

**Properties:**
- **Message** (String): The text to display.
- **Intent** (String): The style of the message. Options:
  - `success` (Green)
  - `error` (Red)
  - `warning` (Yellow)
  - `info` (Blue)
- **Type** (String): `message` (inline) or `alert` (popup style).

**Example:**
```powerfx
// Show a success message
If(varSuccess, 
   "Record saved successfully!", 
   "Please check your input."
)
```

![FluentMessageBar Screenshot](assets/fluent-message-bar.png)

---

### 4. FluentBreadcrumb `FluentBreadcrumb`

Navigation trail for hierarchical data.

**Properties:**
- **Items** (Table):
  - `key`: Unique ID.
  - `text`: Display text.
  - `href`: (Optional) Link URL.

**Events:**
- **OnSelect**: Fires when a crumb is clicked.

**Example:**
```powerfx
Table(
    { key: "home", text: "Home" },
    { key: "folder", text: "My Files" },
    { key: "file", text: "Report.pdf" }
)
```

![FluentBreadcrumb Screenshot](assets/fluent-breadcrumb.png)

---

## Build & Development

To build the solution locally:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Build Components:**
   ```bash
   npm run build
   ```
   *Note: The production build is optimized to reduce bundle size.*

3. **Package Solution:**
   ```bash
   dotnet build Solution/Solution.cdsproj --configuration Release
   ```

---
*Maintained by PowerApps Modern Controls Plus Team*

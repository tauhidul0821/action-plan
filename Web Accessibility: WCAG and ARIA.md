# Web Accessibility: WCAG and ARIA

This document covers **WCAG (Web Content Accessibility Guidelines)** and **ARIA (Accessible Rich Internet Applications)**, two essential frameworks for making the web accessible to everyone, including people with disabilities.

---

## WCAG (Web Content Accessibility Guidelines)

WCAG is a set of guidelines from the W3C to ensure web content is accessible to users with visual, auditory, physical, cognitive, or neurological impairments.

### Overview
- **Purpose**: Provides a universal standard for accessibility and inclusion.
- **Versions**:
  - **WCAG 2.0** (2008): The foundational standard.
  - **WCAG 2.1** (2018): Adds criteria for mobile and cognitive accessibility.
  - **WCAG 2.2** (2023): Enhances usability for low vision and motor impairments.
  - **WCAG 3.0**: In draft as of March 21, 2025.
- **Conformance Levels**:
  - **A**: Basic accessibility (e.g., alt text for images).
  - **AA**: Widely adopted standard (e.g., 4.5:1 color contrast).
  - **AAA**: Highest level, harder to achieve (e.g., sign language for videos).
- **Principles (POUR)**:
  - **Perceivable**: Content must be noticeable (e.g., video captions).
  - **Operable**: Usable by all (e.g., keyboard navigation).
  - **Understandable**: Clear and consistent (e.g., predictable layouts).
  - **Robust**: Compatible with assistive tools (e.g., screen readers).

### Examples
- **Level A**: Image alt text.
- **Level AA**: Sufficient contrast ratios.
- **Level AAA**: Extended audio descriptions.

### Legal Context
Many laws (e.g., U.S. ADA, Section 508) align with WCAG 2.0/2.1 AA.

---

## ARIA (Accessible Rich Internet Applications)

ARIA is a set of attributes that enhance HTML to make dynamic, interactive content accessible, especially for assistive technologies.

### Overview
- **Purpose**: Adds semantic meaning to custom or complex UI elements.
- **How It Works**: Uses roles, states, and properties:
  - **Roles**: Define an element’s purpose (e.g., `role="button"`).
  - **States**: Show current conditions (e.g., `aria-expanded="true"`).
  - **Properties**: Provide extra info (e.g., `aria-label="Close"`).
- **Use Cases**:
  - Custom widgets (tabs, modals).
  - Live updates (chat messages).
  - Navigation landmarks.

### Examples
- `<div role="alert" aria-live="polite">Error: Invalid input</div>`: Announces errors.
- `<button aria-pressed="false">Toggle</button>`: Indicates toggle state.

### Limitations
- ARIA is semantic only—it doesn’t add functionality.
- Misuse can confuse assistive tech (“No ARIA is better than bad ARIA”).

### Relation to WCAG
ARIA supports WCAG goals, like the “Name, Role, Value” criterion (4.1.2).

---

## Common ARIA Roles

ARIA roles define an element’s purpose. Here’s a list of key roles beyond `role="button"`:

### Interactive Widget Roles
- `role="checkbox"`: A checkable input.
- `role="radio"`: A single-select option in a group.
- `role="slider"`: A range selector (e.g., volume).
- `role="spinbutton"`: Numeric input with up/down controls.
- `role="menuitem"`: A menu option.
- `role="tab"`: A tab in a tabbed interface.
- `role="switch"`: An on/off toggle.
- `role="textbox"`: A text input.

### Structural Roles
- `role="navigation"`: Navigation links section.
- `role="main"`: Primary content area.
- `role="banner"`: Site header.
- `role="contentinfo"`: Footer/metadata area.
- `role="region"`: Significant section (use with `aria-label`).
- `role="complementary"`: Supporting content (e.g., sidebar).
- `role="search"`: Search functionality.

### Document Structure Roles
- `role="article"`: Standalone content (e.g., blog post).
- `role="heading"`: Heading (with `aria-level`).
- `role="list"`: Group of items.
- `role="listitem"`: Item in a list.
- `role="paragraph"`: Text block.

### Live Region Roles
- `role="alert"`: Urgent, immediate announcement.
- `role="status"`: Non-urgent update.
- `role="log"`: Live feed (e.g., chat).
- `role="timer"`: Time-based update.

### Landmark Roles
- `role="application"`: App-like region with managed focus.
- `role="form"`: Form section (label recommended).

### Miscellaneous Roles
- `role="dialog"`: Modal/popup (use `aria-modal="true"`).
- `role="progressbar"`: Task completion indicator.
- `role="tooltip"`: Info popup.
- `role="presentation"`: Hides semantics (decorative elements).
- `role="separator"`: Divider (focusable if interactive).

### Usage Tips
- Use native HTML (e.g., `<button>`) when possible.
- Pair roles with states/properties (e.g., `aria-checked`, `aria-label`).
- Avoid abstract roles (e.g., `widget`) in practice.

### Example
```html
<div role="checkbox" aria-checked="false" tabindex="0">Toggle me</div>

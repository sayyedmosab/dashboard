# Holistic Transformation Dashboard Component

This project is a sophisticated, data-driven dashboard component designed to be used as a standalone micro-frontend. It provides a holistic view of a transformation program across four key zones: Transformation Health, Strategic Insights, Internal Outputs, and Sector-Level Outcomes. It is built to be embedded in any web application and can be dynamically updated and styled.

## Key Features

- **Four-Zone Layout:** A comprehensive view of program health and performance.
- **Rich Visualizations:** Utilizes a variety of charts (Spider, Bubble, Bullet, Doughnut, Combo) to represent complex data clearly.
- **Gemini-Powered Analysis:** Integrates with Google's Gemini API to provide on-demand AI-powered analysis of data segments.
- **Embeddable & Sandboxed:** Designed to run within an `<iframe>`, with a clean API for parent-child communication.
- **Theme-able:** All styling is controlled by CSS Custom Properties, allowing for easy visual integration with any host application.

---

## Integration Guide

The component is designed to be embedded into a host application using an `<iframe>`. It operates in two modes: "demo" (default) and "integration".

- **Demo Mode:** The default mode. The component runs with its own internal data and all controls (e.g., "Analyze" buttons) are visible. This is useful for showcasing functionality.
- **Integration Mode:** Activated by adding `?integration=true` to the `<iframe>`'s `src` URL. In this mode, demo-specific controls are hidden, and the component listens for data from the parent window via `postMessage`.

### 1. Embedding the Component

Add the following `<iframe>` to your host application's HTML.

```html
<iframe
  id="dashboard-component"
  src="[URL_TO_YOUR_DEPLOYED_COMPONENT]?integration=true"
  width="100%"
  height="1200px" 
  frameborder="0"
  scrolling="no"
></iframe>
```

_Note: You may need to adjust the `height` or implement a solution like `iframe-resizer` for a perfect fit._

### 2. Sending Data via `postMessage`

In your host application's JavaScript, you can send data to the component to update its visualizations. The component expects a specific message format.

**Message Format:**
```json
{
  "type": "UPDATE_COMPONENT_DATA",
  "payload": { ... } 
}
```
The `payload` must be an object that matches the `DashboardData` interface defined in the component's `types.ts`.

**Example JavaScript:**
```javascript
// Get a reference to the iframe element
const dashboardIframe = document.getElementById('dashboard-component');

// This is the full data structure the component expects.
// It should match the structure from `constants.ts` or `types.ts`.
const newDashboardData = {
    dimensions: [
        // ... new dimension data
    ],
    insight1: {
        // ... new insight1 data
    },
    // ... and so on for all dashboard data
};

// When the iframe has loaded, send the data
dashboardIframe.onload = () => {
  dashboardIframe.contentWindow.postMessage({
    type: 'UPDATE_COMPONENT_DATA',
    payload: newDashboardData
  }, '[URL_OF_THE_COMPONENT_ORIGIN]'); // IMPORTANT: Always specify the target origin for security
};
```

---

## Styling & Theming

The component's appearance is controlled entirely by CSS Custom Properties (variables). You can easily override these variables in your host application's stylesheet to match your own branding.

### How to Override Styles

In your host application's CSS file, define the variables you want to change. Make sure your stylesheet is loaded *after* any default styles.

**Example CSS Override:**
```css
/* In your application's main stylesheet */
:root {
  /* Example: Change the theme to a light mode with green accents */
  --component-bg-primary: #ffffff;
  --component-panel-bg: #f9f9f9;
  --component-panel-border: #e0e0e0;
  --component-text-primary: #222222;
  --component-text-muted: #666666;
  --component-text-accent: #008060;
  --component-color-success: #22a55a;
  --component-color-warning: #f59e0b;
  --component-color-danger: #ef4444;
}
```

### Key CSS Variables

Here is a list of the primary variables you can use for theming:

```css
/* --- Core Colors --- */
--component-bg-primary: #202028;
--component-panel-bg: #2c2c38;
--component-panel-border: #4a4a58;

/* --- Text Colors --- */
--component-text-primary: #EBEBEB;
--component-text-muted: #a0a0b0;
--component-text-accent: #00AEEF;

/* --- Semantic Colors --- */
--component-color-success: #28a745;
--component-color-warning: #ffc107;
--component-color-danger: #dc3545;

/* --- Fonts --- */
--component-font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif';
```

# Holistic Transformation Dashboard Component

This project is a sophisticated, data-driven dashboard component designed to be used as a standalone micro-frontend. It provides a holistic view of a transformation program across four key zones: Transformation Health, Strategic Insights, Internal Outputs, and Sector-Level Outcomes. It is built to be embedded in any web application and can be dynamically updated and styled.

## Key Features

- **Four-Zone Layout:** A comprehensive view of program health and performance.
- **Rich Visualizations:** Utilizes a variety of charts (Spider, Bubble, Bullet, Doughnut, Combo) to represent complex data clearly.
- **Dynamic Data Fetching:** Includes a header to select a year (2025-2029) and fetch the corresponding data from a backend service (mocked Supabase function).
- **Gemini-Powered Analysis:** Integrates with Google's Gemini API to provide on-demand AI-powered analysis of data segments.
- **Embeddable & Sandboxed:** Designed to run within an `<iframe>`, with a clean API for parent-child communication.
- **Theme-able:** All styling is controlled by CSS Custom Properties, allowing for easy visual integration with any host application.

---

## Running the Project

This is a static web application with no build step.

1.  **Serve the files:** Use a simple local web server to serve the project directory. You can use `npx serve` or Python's `http.server`.
2.  **Configure API Key:** For the Gemini AI features to work, you must have the `API_KEY` environment variable available in the context where the app is served.
3.  **Open in browser:** Navigate to `index.html` on your local server.

The application will start in "Standalone Mode," showing the year selection header and using the mock Supabase API to fetch data.

---

## Backend Integration (Supabase)

The dashboard is designed to fetch its data from a backend endpoint, such as a Supabase Edge Function.

### Data Contract

The exact data structure that the frontend expects from your backend function is fully typed and defined in **`api/supabase.types.ts`**. Your function should accept a `year` and return a JSON object matching the `RawDashboardData` interface.

The key principle is that the backend should provide **raw, uncalculated numbers**. The frontend is responsible for calculating derived values (like health scores) and formatting them for display (e.g., turning `1.2` into `"1.2M"`).

### Mock API

The file **`api/supabase.ts`** contains a mock implementation (`fetchDataForYear`) that simulates a call to a Supabase function. It includes a 1-second delay to demonstrate the loading state and generates dynamic data based on the selected year. You can replace the contents of this function with your actual `fetch` call to your Supabase endpoint.

---

## Embedding & Integration (Micro-Frontend)

The component can be embedded into a host application using an `<iframe>`. It operates in two modes:

-   **Standalone Mode (default):** The component runs with its own data fetching controls (year selector, "Fetch Data" button). This is the default behavior.
-   **Integration Mode:** Activated by adding `?integration=true` to the `<iframe>`'s `src` URL. In this mode, the data fetching header is hidden, and the component listens for data pushed from the parent window via `postMessage`. This is ideal for scenarios where the host application controls the data state.

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

In your host application's JavaScript, you can send data to the component to update its visualizations. This is useful for real-time updates driven by the parent application.

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
const newDashboardData = {
    dimensions: [ /* ... new dimension data */ ],
    insight1: { /* ... new insight1 data */ },
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

In your host application's CSS file, define the variables you want to change.

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

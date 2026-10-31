# Layout Verification & Screenshot Suite

## 1. Final Grid Map

```
========================================================================================================================
ROW 1:  [       Intro (5 cols)       ] [ Project A (3 cols) ] [ Project B (2 cols) ] [   Socials (2 cols / 3x2)   ]
------------------------------------------------------------------------------------------------------------------------
ROW 2:  [ Portrait (2) ] [     About (4 cols)     ] [      Project C (4 cols)      ] [    Resources (2 cols)      ]
------------------------------------------------------------------------------------------------------------------------
ROW 3:  [     Newsletter (5 cols)    ] [    Stack (3 cols)    ] [  Theme (2 cols)  ] [    Contact (2 cols)      ]
========================================================================================================================
```

### Dimensions & Formulas
- **Outer Container:**
  - Width: `calc(100vw - 48px)` (Max: `1900px`)
  - Margins: `24px auto`
  - Internal Padding: `16px`
  - Border Radius: `32px`
  - Background: `#0f0f0f`
  - Border: `1px solid rgba(255, 255, 255, 0.06)`
- **Grid:**
  - Columns: `repeat(12, minmax(0, 1fr))`
  - Gap: `16px`
  - Row Calculation: `calc((100vh - 48px - 32px - 2 * 16px) / 3)`
  - Total Rows: Exactly 3 rows
  - Page Overflow: `hidden` (Zero vertical scrollbar at 1440×900 and 1920×1080)

---

## 2. Screenshot Gallery

### 1920×1080 Desktop Comparison (Target vs. Build)
![1920x1080 Side-by-Side Comparison](/public/comparisons/comparison-1920.png)

### 1920×1080 Full Viewport
![1920x1080 Viewport](/public/screenshots/screenshot-1920.png)

### 1440×900 Full Viewport
![1440x900 Viewport](/public/screenshots/screenshot-1440.png)

### 1024×768 Viewport (6 Columns)
![1024x768 Viewport](/public/screenshots/screenshot-1024.png)

### 768×1024 Viewport (2 Columns)
![768x1024 Viewport](/public/screenshots/screenshot-768.png)

### 390×844 Mobile Viewport (1 Column)
![390x844 Viewport](/public/screenshots/screenshot-390.png)

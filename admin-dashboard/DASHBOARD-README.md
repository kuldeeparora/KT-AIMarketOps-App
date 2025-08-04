# 🛠️ Admin Dashboard - Modular & AI-Powered

## Overview
This dashboard is a modern, modular, and AI-powered interface for inventory management, analytics, and business operations. It features:
- **Modular React components** for filters, tables, summaries, and AI features
- **AI-powered product description generation** (LangChain/LLM)
- **Quick inventory insights** (summary cards)
- **Easy extensibility and testing**

---

## Directory Structure

```
components/
  inventory/
    InventoryFilters.jsx         # Search/filter/sync UI
    InventoryTable.jsx           # Local inventory table
    ShopifyInventoryTable.jsx    # Shopify inventory table
    InventorySummaryCard.jsx     # Summary stats card
    AIDescriptionGenerator.jsx   # AI product description generator
    __tests__/                   # Tests for all components
lib/
  ai/
    groqClient.ts                # GROQ LLM utility
    langchainClient.ts           # LangChain utility
    langgraphClient.ts           # LangGraph utility (stub)
    langsmithClient.ts           # LangSmith utility (stub)
```

---

## Key Features

- **InventoryFilters**: Modular search, low stock filter, and sync button.
- **InventoryTable / ShopifyInventoryTable**: Modular tables for local and Shopify inventory.
- **InventorySummaryCard**: Quick stats (total, low stock count) for each inventory source.
- **AIDescriptionGenerator**: Generate product descriptions using LLMs (LangChain, GROQ, etc.).
- **Full test coverage** for all new components.

---

## Usage Example

```jsx
import InventoryFilters from './components/inventory/InventoryFilters';
import InventoryTable from './components/inventory/InventoryTable';
import InventorySummaryCard from './components/inventory/InventorySummaryCard';
import AIDescriptionGenerator from './components/inventory/AIDescriptionGenerator';

// ...in your dashboard page/component:
<InventoryFilters ...props />
<AIDescriptionGenerator />
<InventorySummaryCard title="Local Inventory" total={total} lowStock={lowStock} />
<InventoryTable data={...} loading={...} error={...} onRefresh={...} />
```

---

## AI Integration
- **LangChain**: Used for product description generation and future AI workflows.
- **GROQ**: Modular utility for LLM chat/completions.
- **LangGraph/LangSmith**: Stubs for future advanced workflow and evaluation integration.

---

## Extending the Dashboard
- Add new modular components to `components/inventory/`.
- Add new AI utilities to `lib/ai/`.
- Write tests in `components/inventory/__tests__/`.
- Use usage comments in each component for guidance.

---

## Running Tests
```sh
npm test
# or
yarn test
```

---

## Contributing
- Follow modular/component-based patterns.
- Add/expand tests for all new features.
- Document usage and props in each component.

---

## Roadmap
- [ ] AI-powered smart inventory alert suggestions
- [ ] AI Copilot for business insights
- [ ] Enhanced accessibility and performance
- [ ] SellerDynamics integration improvements 
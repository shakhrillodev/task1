## Assessment Tasks

### Task 1: Implement a Similar Feature (Product Management)

**Objective**: Create a Product Management page similar to the existing User Management page.

**Requirements**:

1. Create a new `ProductManagement.vue` component
2. Implement a data table displaying products with the following columns:

   - Product Name
   - Category
   - Price
   - Stock Quantity
   - Status (In Stock, Out of Stock, Discontinued)
   - Actions (Edit, Delete)

3. **Product Interface**:

```typescript
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  status: "in_stock" | "out_of_stock" | "discontinued";
  createdAt?: string;
}
```

4. **Functionality to Implement**:

   - Display products in a data table
   - Add new product functionality with a modal form
   - Edit existing products
   - Delete products with confirmation dialog
   - Form validation for required fields
   - Price formatting (display as currency)
   - Status badge styling with appropriate colors
   - Stock quantity warnings (red text if quantity < 10)

5. **Acceptance Criteria**:
   - [* ] Table displays all product data correctly
   - [ *] Add/Edit forms work properly with validation
   - [ *] Delete confirmation dialog functions correctly
   - [ *] Price is formatted as currency (e.g., $29.99)
   - [ *] Stock warnings display appropriately
   - [ *] Status badges have correct styling
   - [ *] Code follows the same patterns as UserManagement
   - [ *] TypeScript types are properly defined
   - [ *] Component is responsive and accessible

### Task 2: Implement a New Feature (Dashboard Analytics)

**Objective**: Create a dashboard with analytics cards and a simple chart.

**Requirements**:

1. Create a new `AnalyticsDashboard.vue` component
2. Display analytics cards showing:

   - Total Users
   - Total Products
   - Total Revenue
   - Active Sessions

3. **Analytics Interface**:

```typescript
interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  activeSessions: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}
```

4. **Features to Implement**:

   - **Analytics Cards**: Display key metrics in card format
   - **Data Visualization**: Create a simple bar chart showing revenue by month (can use basic HTML/CSS or introduce a simple chart library)
   - **Real-time Updates**: Simulate real-time data updates every 5 seconds
   - **Responsive Design**: Cards should stack appropriately on mobile devices
   - **Loading States**: Show loading skeleton while data is being fetched
   - **Empty States**: Handle cases where data might be unavailable

5. **Card Design Requirements**:

   - Each card should have an icon, title, value, and percentage change
   - Use color coding: green for positive changes, red for negative
   - Include trend indicators (↑ ↓ arrows)
   - Add hover effects for better UX

6. **Chart Requirements**:

   - Simple bar chart showing monthly revenue
   - Responsive design
   - Hover tooltips showing exact values
   - Smooth animations on data updates

7. **Acceptance Criteria**:
   - [ ] Four analytics cards display correctly
   - [ ] Chart renders and updates properly
   - [ ] Real-time updates work every 5 seconds
   - [ ] Responsive design works on different screen sizes
   - [ ] Loading states are implemented
   - [ ] Proper TypeScript typing throughout
   - [ ] Clean, maintainable code structure
   - [ ] Good user experience with animations and interactions

# Employee Wizard Form

A multi-step role-based employee registration wizard with advanced form handling, draft auto-save, and employee management.

## Features

- **Role-Based Access**: Admin (2 steps) and Ops (1 step) workflows
- **Async Autocomplete**: Department and location search with debouncing
- **File Upload**: Photo upload with Base64 conversion and preview
- **Auto-Generated IDs**: Employee IDs based on department code
- **Draft Auto-Save**: Automatic form saving every 2 seconds
- **Responsive Design**: Works on devices from 360px to 1440px
- **Validation**: Real-time field validation with error messages
- **Pagination**: Employee list with configurable page size

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Vanilla CSS with BEM naming
- **API**: json-server (mock APIs on ports 4001 & 4002)
- **Testing**: Vitest & React Testing Library
- **Deployment**: Vercel

## Setup

### Prerequisites
- Node.js 24+
- pnpm

### Installation

\`\`\`bash
# Clone repository
git clone <https://github.com/rwndy/employee-wizard>
cd employee-wizard

# Install dependencies
pnpm install
\`\`\`

### Development

# Start all services (frontend + mock APIs)
pnpm run dev
pnpm run mock:step1 <- for step 1 mock api
pnpm run mock:step2 <- for step 2 mock api
\`\`\`

The app will be available at `http://localhost:3000`

### Mock APIs

**Step 1 API (port 4001)**
- `GET /departments?name_like=query` - Search departments
- `GET /basicInfo` - Get all basic info records
- `POST /basicInfo` - Create basic info record

**Step 2 API (port 4002)**
- `GET /locations?name_like=query` - Search locations
- `GET /details?_page=1&_limit=10` - Get details with pagination
- `POST /details` - Create details record

### Usage

1. **Access Wizard**: Navigate to `/wizard`
   - Use role toggle to switch between Admin and Ops
   - Or use query params: `/wizard?role=admin` or `/wizard?role=ops`

2. **Admin Workflow**:
   - Step 1: Enter basic personal information
   - Step 2: Add employment details and upload photo

3. **Ops Workflow**:
   - Step 2 only: Add employment details and upload photo

4. **View Employees**: Navigate to `/employees` to see the employee directory

### Testing

\`\`\`bash
# Run all tests
pnpm run test:ui

\`\`\`

#### Test Coverage

- `AutocompleteField.test.tsx`: Autocomplete rendering and suggestion fetching
- `form-suWizard.test.tsx`: Form validation and sequential submission flow

### Building

\`\`\`bash
# Build for production
pnpm run build

# Start production server
pnpm run preview
\`\`\`

### Deployment to Vercel

1. **Push to GitHub**
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`


## Draft Auto-Save

Forms automatically save every 2 seconds of inactivity. Drafts are stored per role:
- Admin: `draft_admin`
- Ops: `draft_ops`

Use "Clear Draft" button to reset the current role's draft.

## Responsive Design

Breakpoints:
- Mobile: 360px
- Tablet: 768px
- Desktop: 1440px

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Atomic Commits

Each feature is committed separately for easy tracking. Key commits:
1. Project setup & types
2. Wizard form & routing
3. Autocomplete & validation
4. File upload & photo preview
5. Draft auto-save & localStorage
6. Employee list & pagination
7. Tests & error handling
8. Docker

## Troubleshooting

### Mock APIs not connecting
- Ensure ports 4001 & 4002 are available
- Check if json-server is running: `lsof -i :4001` and `lsof -i :4002`

### Draft not saving
- Check browser's localStorage is enabled
- Clear browser cache and try again

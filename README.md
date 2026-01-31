# 🎯 SSE Monitor

A professional and modern web application for monitoring Server-Sent Events (SSE) in real-time. Built with React, TypeScript, and Tailwind CSS.

![SSE Monitor](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue) ![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)

## ✨ Features

### 🔌 Connection Management
- **Easy SSE Connection**: Connect to any SSE endpoint with a simple URL
- **Bearer Token Authentication**: Optional authentication support
- **Connection Timer**: Real-time monitoring of connection duration
- **Abort During Connection**: Cancel connection attempts
- **Auto-reconnection**: Handles connection failures gracefully

### 📊 Event Monitoring
- **Real-time Event Display**: View events as they arrive
- **Event Counter**: Track total events received
- **Event Metadata**: View timestamps, types, and IDs
- **Data Preview**: Automatic JSON formatting and truncation
- **Copy to Clipboard**: Quick copy of event data

### 🔍 Advanced Filtering
- **Custom Filters**: Create filters for any JSON field
- **Nested Field Support**: Filter by nested properties (e.g., `data.userId`)
- **Multi-value Selection**: Toggle multiple values per filter
- **Real-time Filtering**: Instant filter application
- **Filter Statistics**: See event counts per filter value
- **Multiple Filters**: Combine filters with AND logic

### 💾 Profile Management
- **Save Profiles**: Store URL and token combinations
- **Quick Switching**: Tab-based profile interface
- **Persistent Storage**: Profiles saved in localStorage
- **Easy Management**: Create, load, and delete profiles

### 🎨 Modern UI
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Professional transitions
- **Color-coded Events**: Visual distinction for event types
- **Intuitive Layout**: Clean and organized interface

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (Download from [nodejs.org](https://nodejs.org))
- **npm** or **yarn** package manager

### Installation

1. **Clone or download the repository**

```bash
cd sse-monitor
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure port (optional)**

Create a `.env` file in the root directory:

```env
VITE_PORT=5003
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open in browser**

Navigate to `http://localhost:5003` (or the port you configured)

## 📖 How to Use

### 1. Basic Connection

1. **Enter SSE Endpoint URL**
   - Type or paste your SSE endpoint URL
   - Example: `https://api.example.com/events`

2. **Add Bearer Token (Optional)**
   - If your endpoint requires authentication
   - Paste your Bearer token in the password field
   - Token will be sent as: `Authorization: Bearer <your-token>`

3. **Click Connect**
   - Starts the SSE connection
   - Connection status indicator turns green
   - Timer starts counting

### 2. Saving Profiles

1. **Enter Profile Details**
   - Fill in URL and Bearer token (if needed)
   - Enter a name for the profile

2. **Click Save (💾)**
   - Profile appears as a tab at the top
   - Automatically switches to the new profile

3. **Using Saved Profiles**
   - Click on any profile tab to load its settings
   - Auto-disconnects current connection
   - Creates new profile with "➕ New" button

### 3. Creating Custom Filters

1. **Add a Filter**
   - Type field path in the input (e.g., `type`, `data.userId`, `status`)
   - Press Enter or click "➕ Add"
   - Filter appears as a card below

2. **Select Values**
   - Each filter shows all unique values found
   - Click value buttons to toggle filtering
   - Selected values are highlighted in blue

3. **Manage Filters**
   - **Clear**: Remove all selected values
   - **✕ Remove**: Delete the entire filter
   - Multiple filters work with AND logic

### 4. Viewing Events

- **Event List**: Newest events appear at the top
- **Event Details**:
  - 🔵 ID number (sequential)
  - ⏰ Timestamp (HH:MM:SS)
  - 🏷️ Type badge (color-coded)
  - 📝 Event type
  - 📋 Copy button

- **Copy Event Data**: Click "📋 Copy" to copy to clipboard

### 5. Theme Toggle

- Click **☀️ Light** or **🌙 Dark** in the header
- Theme preference is saved automatically
- All components adapt to the selected theme

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Development server port
VITE_PORT=5003
```

### SSE Proxy Configuration

The application uses a built-in Vite proxy to handle SSE connections and CORS. Configuration is in `vite.config.ts`:

```typescript
// Proxy routes
/api/sse?url=<target>&auth=<token>
```

The proxy:
- Handles CORS headers
- Adds Bearer token authentication
- Proxies HTTPS/HTTP requests
- Streams SSE responses

### Customizing Event Colors

Edit `src/utils/eventUtils.ts`:

```typescript
export const colorMap: Record<string, string> = {
    'YOUR_EVENT_TYPE': 'bg-color-600 hover:bg-color-700',
    // Add more mappings
}
```

## 📁 Project Structure

```
sse-monitor/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Header with theme toggle
│   │   ├── ProfileTabs.tsx  # Profile management tabs
│   │   ├── Instructions.tsx # Usage instructions
│   │   ├── ConnectionPanel.tsx # SSE connection controls
│   │   ├── CustomFilters.tsx   # Custom filter interface
│   │   ├── EventsList.tsx      # Events display
│   │   └── Footer.tsx          # Footer component
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useTheme.ts     # Theme management
│   │   ├── useProfiles.ts  # Profile management
│   │   └── useCustomFilters.ts # Filter logic
│   │
│   ├── types/              # TypeScript definitions
│   │   └── index.ts        # All interfaces and types
│   │
│   ├── utils/              # Utility functions
│   │   └── eventUtils.ts   # Event processing utilities
│   │
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
│
├── vite.config.ts          # Vite configuration + SSE proxy
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies
└── README.md               # This file
```

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

## 🔌 API Requirements

Your SSE endpoint should:

1. **Return `Content-Type: text/event-stream`**
2. **Send events in SSE format**:
   ```
   data: {"type": "EVENT_TYPE", "message": "data"}
   
   ```
3. **Support CORS** (or use the built-in proxy)
4. **Accept Bearer token** (optional):
   ```
   Authorization: Bearer <token>
   ```

### Example SSE Event Format

```json
{
  "type": "AUTH_LOGIN",
  "userId": "12345",
  "timestamp": "2026-01-30T10:30:00Z",
  "data": {
    "username": "john.doe",
    "ip": "192.168.1.1"
  }
}
```

## 🎨 Customization

### Adding New Event Type Colors

1. Open `src/utils/eventUtils.ts`
2. Add to `colorMap`:
   ```typescript
   'NEW_TYPE': 'bg-purple-600 hover:bg-purple-700'
   ```

### Changing Theme Colors

1. Edit `tailwind.config.js`
2. Modify or extend color palette
3. Update component theme classes

### Custom Filter Fields

Filters support:
- **Top-level fields**: `type`, `status`, `userId`
- **Nested fields**: `data.user.name`, `meta.location.city`
- **Array indices**: `items.0.id`

## 🐛 Troubleshooting

### Connection Issues

**Problem**: "Failed to connect"
- ✅ Check URL is correct and accessible
- ✅ Verify endpoint returns SSE format
- ✅ Check Bearer token if authentication required
- ✅ Review browser console for errors

**Problem**: "Connection closed by server"
- ✅ Server may have timeout limits
- ✅ Check server logs for errors
- ✅ Verify authentication is valid

### Filter Issues

**Problem**: "No values found for this field"
- ✅ Field path may be incorrect
- ✅ Events may not contain that field
- ✅ Check event data structure

**Problem**: Filters not working
- ✅ Ensure field path matches event structure
- ✅ Values must match exactly (case-sensitive)
- ✅ Check filtered events counter

### Profile Issues

**Problem**: Profiles not saving
- ✅ Check browser localStorage is enabled
- ✅ Try clearing localStorage and recreating
- ✅ Check browser console for errors

## 📊 Technologies Used

- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling framework
- **[EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)** - SSE client

## 📝 License

This project is available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📧 Support

For issues and questions:
- Open an issue on the repository
- Check existing documentation
- Review troubleshooting section

---

**Made with ❤️ using React + Tailwind CSS**

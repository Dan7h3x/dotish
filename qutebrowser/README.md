# Personal Dashboard - Enhanced Version

A modern, responsive personal dashboard with dynamic widgets and improved functionality.

## 🚀 New Features & Improvements

### ✅ Issues Fixed
- **Calculator widget removed** as requested
- **Dynamic widget sizing** - widgets now auto-resize based on content
- **Improved color schemes** with better readability across all themes
- **Enhanced localStorage support** for qutebrowser
- **Better visual design** with smooth animations and modern styling

### 🎨 Enhanced Color Themes

#### Light Theme
- Improved contrast for better readability
- Clean, minimal design with soft shadows
- Better color hierarchy

#### Dark Theme  
- High contrast, eye-friendly colors
- Reduced eye strain in low-light conditions
- Professional appearance

#### Solar Theme
- Warm, comfortable reading experience
- Inspired by Solarized color scheme
- Easy on the eyes for long usage

#### Neon Theme
- Cyberpunk aesthetic with good readability
- Bright accent colors that pop
- Futuristic visual appeal

### 📱 Responsive Design
- **Mobile-first approach** with better mobile layouts
- **Tablet optimization** for medium screen sizes
- **Desktop enhancements** for large displays
- **Flexible grid system** that adapts to screen size

### 🔧 Dynamic Widget Sizing
Widgets now intelligently resize based on their content:

- **Todo Widget**: Expands as you add more tasks
- **Notes Widget**: Adjusts to note content length  
- **Bookmarks Widget**: Grows with bookmark collection
- **Quick Links Widget**: Adapts to number of links
- **All widgets**: Smooth transitions when resizing

### ⚡ Performance Improvements
- **Optimized for qutebrowser** with specific settings
- **Reduced memory usage** with smarter rendering
- **Faster localStorage operations** with fallbacks
- **Smooth animations** without performance impact

### 🎯 Enhanced User Experience
- **Smooth hover effects** with subtle animations
- **Better button feedback** with improved states
- **Loading animations** for better perceived performance
- **Keyboard shortcuts** for power users
- **Improved focus states** for accessibility

## 🛠️ Setup Instructions

### 1. File Structure
```
dashboard/
├── homepage.html          # Main HTML file
├── style.css             # Enhanced styles
├── script.js             # JavaScript functionality
├── qutebrowser-config.md # Browser configuration guide
└── README.md            # This file
```

### 2. Qutebrowser Configuration
See `qutebrowser-config.md` for detailed setup instructions to enable:
- localStorage functionality
- Optimal performance settings
- Security settings for local files
- Theme persistence

### 3. Quick Start
1. Download all files to a directory
2. Configure qutebrowser using the provided guide
3. Open `homepage.html` in qutebrowser
4. Enjoy your enhanced dashboard!

## 🎛️ Widget Features

### 📚 Bookmark Manager
- Add/remove bookmarks with titles and URLs
- Clean, organized display
- **Auto-resize** as you add bookmarks

### 🔍 Search Widget
- Multiple search engines (Google, DuckDuckGo, Bing, GitHub)
- Quick search functionality
- Remembers last used engine

### 📝 Todo Manager + Calendar
- Add tasks with dates and priorities
- Visual priority indicators (color-coded)
- Interactive calendar with task highlights
- Filter by status (all/pending/completed)
- **Dynamic sizing** based on task count

### 🍅 Pomodoro Timer
- Customizable work/break intervals
- Session tracking with statistics
- Audio notifications
- Daily session counter

### 🌤️ Weather Widget
- Location-based weather display
- Clean, informative layout
- Caches last location

### 📌 Sticky Notes Generator
- Create unlimited color-coded notes
- **Each note becomes its own widget**
- Edit/delete functionality
- **Auto-resize** based on content length

### 🕐 Digital + Analog Clock
- Dual time display
- Current date information
- Smooth second hand animation

### 🔗 Quick Links Manager
- Add frequently used links
- Grid-based layout
- Easy management with delete buttons
- **Grows dynamically** with link collection

## ⌨️ Keyboard Shortcuts
- `Ctrl+E`: Toggle edit mode
- `Ctrl+T`: Cycle through themes  
- `Escape`: Exit edit mode
- `Ctrl+/`: Focus search input

## 🎨 Customization

### Adding New Themes
Add new theme variables in `style.css`:
```css
body[data-theme="custom"] {
  --bg-color: #your-bg;
  --text-color: #your-text;
  --accent-color: #your-accent;
  /* ... other variables */
}
```

### Creating Custom Widgets
1. Add HTML structure in `homepage.html`
2. Add styles in `style.css`
3. Add functionality in `script.js`
4. Call `autoResizeWidget('widget-id')` for dynamic sizing

## 🔧 Technical Details

### Dynamic Sizing System
- Uses `ResizeObserver` for automatic content-based sizing
- Fallback methods for browser compatibility
- Smooth transitions between size changes
- Content-aware height calculations

### Storage System
- Primary: `localStorage`
- Fallback: `sessionStorage`
- Final fallback: In-memory storage
- Error handling for all storage operations

### Performance Features
- Lazy loading of particle effects
- Debounced resize operations
- Optimized DOM manipulation
- Efficient event handling

## 🐛 Troubleshooting

### localStorage Issues
1. Check qutebrowser configuration
2. Verify file permissions
3. Clear browser cache
4. Use debugging mode

### Performance Issues
1. Disable particle effects for slower devices
2. Reduce animation complexity
3. Use simplified themes
4. Check hardware acceleration settings

### Widget Not Resizing
1. Ensure `autoResizeWidget()` is called
2. Check console for JavaScript errors
3. Verify widget has proper data attributes
4. Try manual refresh

## 📊 Browser Compatibility
- **Qutebrowser**: Fully optimized
- **Chrome/Chromium**: Full support
- **Firefox**: Full support  
- **Safari**: Most features supported
- **Edge**: Full support

## 🔄 Updates & Maintenance
- Widgets auto-save all data
- Themes persist between sessions
- Layout preferences remembered
- No manual backup needed

## 🎯 Future Enhancements
- More widget types
- Advanced customization options
- Import/export functionality
- Widget marketplace
- Mobile app companion

---

**Enjoy your enhanced personal dashboard!** 🚀

For issues or suggestions, check the qutebrowser configuration guide first, then verify your setup matches the requirements. 
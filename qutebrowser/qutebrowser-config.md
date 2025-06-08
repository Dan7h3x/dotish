# Qutebrowser Configuration for Personal Dashboard

This guide will help you configure qutebrowser to work properly with your personal dashboard, especially for localStorage functionality and optimal performance.

## Essential Settings

### 1. Enable Local Storage

Add these lines to your qutebrowser config file (`~/.config/qutebrowser/config.py`):

```python
# Enable local storage for your dashboard
c.content.local_storage = True

# Enable cookies (required for some storage operations)
c.content.cookies.accept = 'all'

# Allow JavaScript (required for dashboard functionality)
c.content.javascript.enabled = True

# Increase local storage quota
c.content.local_content_can_access_remote_urls = True

# Enable WebGL for better particle effects
c.content.webgl = True

# Enable canvas for animations
c.content.canvas_reading = True
```

### 2. Security Settings for Local Files

```python
# Allow file:// URLs to access localStorage
c.content.local_content_can_access_file_urls = True

# Allow cross-origin requests for local files
c.content.local_content_can_access_remote_urls = True

# Disable mixed content blocking for local development
c.content.ssl_strict = False

# Enable smooth scrolling
c.scrolling.smooth = True
```

### 3. Performance Optimizations

```python
# Reduce memory usage
c.qt.chromium.low_end_device_mode = 'auto'

# Optimize for performance
c.content.prefers_reduced_motion = False

# Enable hardware acceleration
c.qt.force_software_rendering = 'none'

# Increase cache size for better performance
c.content.cache.size = 52428800  # 50MB
```

### 4. Font and Display Settings

```python
# Set default font family for better readability
c.fonts.default_family = ["Segoe UI", "SF Pro Display", "Arial", "sans-serif"]

# Default font size
c.fonts.default_size = '12pt'

# Enable font hinting
c.fonts.hints = 'auto'

# Zoom level (adjust as needed)
c.zoom.default = '100%'
```

## Alternative Config File Location

If you prefer using a config file instead of Python config:

Create/edit `~/.config/qutebrowser/autoconfig.yml`:

```yaml
global:
  content.canvas_reading: true
  content.cookies.accept: all
  content.javascript.enabled: true
  content.local_content_can_access_file_urls: true
  content.local_content_can_access_remote_urls: true
  content.local_storage: true
  content.ssl_strict: false
  content.webgl: true
  scrolling.smooth: true
  zoom.default: "100%"
```

## Troubleshooting localStorage Issues

### If localStorage still doesn't work:

1. **Check data directory permissions:**

   ```bash
   ls -la ~/.local/share/qutebrowser/
   chmod -R 755 ~/.local/share/qutebrowser/
   ```

2. **Clear qutebrowser cache:**

   ```bash
   rm -rf ~/.cache/qutebrowser/
   ```

3. **Start qutebrowser with debugging:**

   ```bash
   qutebrowser --debug --log-level debug
   ```

4. **Create a specific profile for your dashboard:**
   ```bash
   qutebrowser --basedir ~/.config/qutebrowser-dashboard
   ```

### For persistent localStorage:

Add this to your config to ensure data persists:

```python
# Ensure session data is saved
c.auto_save.session = True

# Keep data when closing
c.content.persistent_storage = True

# Set data location explicitly
import os
data_dir = os.path.expanduser("~/.local/share/qutebrowser")
c.downloads.location.directory = data_dir + "/downloads"
```

## Testing localStorage

To test if localStorage is working, open the developer console in qutebrowser:

1. Press `F12` or `:inspector` to open developer tools
2. In the console, run:
   ```javascript
   localStorage.setItem("test", "hello");
   console.log(localStorage.getItem("test"));
   ```
3. If it prints "hello", localStorage is working!

## Performance Tips

### For better particle effects:

```python
# Enable smooth rendering
c.qt.force_software_rendering = 'none'
c.content.prefers_reduced_motion = False

# Increase FPS limit
c.content.frame_flattening = False
```

### For slower devices:

```python
# Reduce visual effects
c.content.prefers_reduced_motion = True
c.qt.chromium.low_end_device_mode = 'enabled'

# Disable some features
c.content.webgl = False
```

## Setting as Homepage

To set your dashboard as the qutebrowser homepage:

```python
# Set your local dashboard as homepage
import os
dashboard_path = "file://" + os.path.expanduser("~/path/to/your/homepage.html")
c.url.default_page = dashboard_path
c.url.start_pages = [dashboard_path]
```

## Keybindings for Dashboard

Add useful keybindings for your dashboard:

```python
# Quick access to edit mode
config.bind('<Ctrl+e>', 'jseval document.getElementById("editModeToggle").click()')

# Theme switching
config.bind('<Ctrl+t>', 'jseval document.getElementById("themeSelector").dispatchEvent(new Event("change"))')

# Focus search
config.bind('<Ctrl+/>', 'jseval document.getElementById("searchQuery").focus()')
```

## Final Setup

1. Restart qutebrowser after making config changes
2. Navigate to your dashboard file (`file:///path/to/homepage.html`)
3. Test localStorage by adding a bookmark or todo item
4. Check if themes persist after browser restart

If you're still having issues, try running qutebrowser in a clean profile:

```bash
qutebrowser --temp-basedir
```

This should resolve all localStorage and functionality issues with your dashboard!


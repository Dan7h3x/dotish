// Utility helpers
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));

// Storage fallback for qutebrowser
const storage = {
  data: {},
  get(key, def = null) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? def;
    } catch (e) {
      try {
        return JSON.parse(sessionStorage.getItem(key)) ?? def;
      } catch (e2) {
        return this.data[key] ?? def;
      }
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      try {
        sessionStorage.setItem(key, JSON.stringify(val));
      } catch (e2) {
        this.data[key] = val;
      }
    }
  }
};

const lsGet = (key, def = null) => storage.get(key, def);
const lsSet = (key, val) => storage.set(key, val);

// THEME HANDLING ---------------------------------------------------------
function initTheme() {
  const select = qs('#themeSelector');
  const savedTheme = lsGet('theme', 'light');
  document.body.setAttribute('data-theme', savedTheme);
  select.value = savedTheme;
  select.addEventListener('change', () => {
    document.body.setAttribute('data-theme', select.value);
    lsSet('theme', select.value);
    // Reinitialize particles with new colors
    setTimeout(() => initParticles(), 100);
  });
}

// SIMPLE DRAG & DROP SYSTEM --------------------------------------------
class SimpleDragSystem {
  constructor() {
    this.container = qs('#widgetContainer');
    this.isEditMode = false;
    this.draggedWidget = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.widgets = [];
    
    this.initializeWidgets();
  }
  
  initializeWidgets() {
    const widgets = qsa('.widget');
    this.widgets = Array.from(widgets);
    
    // Position widgets in a simple flow layout initially
    this.layoutWidgets();
  }
  
  layoutWidgets() {
    const container = this.container;
    const containerRect = container.getBoundingClientRect();
    const gap = 16;
    let currentX = gap;
    let currentY = gap;
    let rowHeight = 0;
    
    this.widgets.forEach(widget => {
      const rect = widget.getBoundingClientRect();
      const widgetWidth = Math.max(250, rect.width || 250);
      const widgetHeight = Math.max(200, rect.height || 200);
      
      // Check if widget fits in current row
      if (currentX + widgetWidth > containerRect.width - gap && currentX > gap) {
        currentX = gap;
        currentY += rowHeight + gap;
        rowHeight = 0;
      }
      
      // Position widget
      widget.style.position = 'absolute';
      widget.style.left = `${currentX}px`;
      widget.style.top = `${currentY}px`;
      widget.style.width = `${widgetWidth}px`;
      widget.style.minHeight = `${widgetHeight}px`;
      
      currentX += widgetWidth + gap;
      rowHeight = Math.max(rowHeight, widgetHeight);
    });
  }
  
  checkCollision(widget, x, y) {
    const widgetRect = {
      left: x,
      top: y,
      right: x + widget.offsetWidth,
      bottom: y + widget.offsetHeight
    };
    
    const gap = 16; // Minimum gap between widgets
    
    return this.widgets.some(otherWidget => {
      if (otherWidget === widget) return false;
      
      const otherRect = {
        left: otherWidget.offsetLeft - gap,
        top: otherWidget.offsetTop - gap,
        right: otherWidget.offsetLeft + otherWidget.offsetWidth + gap,
        bottom: otherWidget.offsetTop + otherWidget.offsetHeight + gap
      };
      
      return !(widgetRect.right <= otherRect.left || 
               widgetRect.left >= otherRect.right || 
               widgetRect.bottom <= otherRect.top || 
               widgetRect.top >= otherRect.bottom);
    });
  }
  
  findValidPosition(widget, preferredX, preferredY) {
    // Try the preferred position first
    if (!this.checkCollision(widget, preferredX, preferredY)) {
      return { x: preferredX, y: preferredY };
    }
    
    // Try nearby positions in a spiral pattern
    const step = 20;
    const maxDistance = 200;
    
    for (let distance = step; distance <= maxDistance; distance += step) {
      // Try positions in a circle around the preferred position
      for (let angle = 0; angle < 360; angle += 45) {
        const radian = (angle * Math.PI) / 180;
        const x = preferredX + Math.cos(radian) * distance;
        const y = preferredY + Math.sin(radian) * distance;
        
        // Make sure position is within container bounds
        if (x >= 0 && y >= 0 && 
            x + widget.offsetWidth <= this.container.offsetWidth &&
            y + widget.offsetHeight <= this.container.offsetHeight) {
          
          if (!this.checkCollision(widget, x, y)) {
            return { x, y };
          }
        }
      }
    }
    
    // If no valid position found, keep original position
    return { x: widget.offsetLeft, y: widget.offsetTop };
  }
}

// Initialize simple drag system
const dragSystem = new SimpleDragSystem();

// EDIT MODE HANDLING -----------------------------------------------------
function initEditMode() {
  const editBtn = qs('#editModeToggle');
  const editText = qs('#editModeText');
  const container = qs('#widgetContainer');
  
  editBtn.addEventListener('click', () => {
    dragSystem.isEditMode = !dragSystem.isEditMode;
    console.log('Edit mode toggled:', dragSystem.isEditMode);
    
    if (dragSystem.isEditMode) {
      container.classList.add('edit-mode');
      editBtn.classList.add('active');
      editText.textContent = 'Exit Edit';
      enableMouseDragging();
    } else {
      container.classList.remove('edit-mode');
      editBtn.classList.remove('active');
      editText.textContent = 'Edit Layout';
      disableMouseDragging();
    }
  });
}

function enableMouseDragging() {
  const widgets = qsa('.widget');
  
  widgets.forEach(widget => {
    widget.style.cursor = 'move';
    widget.addEventListener('mousedown', handleMouseDown);
  });
  
  console.log('Mouse dragging enabled for', widgets.length, 'widgets');
}

function disableMouseDragging() {
  const widgets = qsa('.widget');
  
  widgets.forEach(widget => {
    widget.style.cursor = '';
    widget.removeEventListener('mousedown', handleMouseDown);
  });
  
  // Clean up any ongoing drag
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  
  console.log('Mouse dragging disabled');
}

function handleMouseDown(e) {
  e.preventDefault();
  
  const widget = e.currentTarget;
  dragSystem.draggedWidget = widget;
  dragSystem.isDragging = true;
  
  // Calculate offset from mouse to widget top-left
  const rect = widget.getBoundingClientRect();
  const containerRect = dragSystem.container.getBoundingClientRect();
  
  dragSystem.dragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  
  // Add drag styling
  widget.style.zIndex = '1000';
  widget.style.opacity = '0.8';
  widget.style.transform = 'scale(1.05)';
  widget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
  
  // Add event listeners to document
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  console.log('Drag started for widget:', widget.dataset.widget);
}

function handleMouseMove(e) {
  if (!dragSystem.isDragging || !dragSystem.draggedWidget) return;
  
  e.preventDefault();
  
  const widget = dragSystem.draggedWidget;
  const containerRect = dragSystem.container.getBoundingClientRect();
  
  // Calculate new position relative to container
  let newX = e.clientX - containerRect.left - dragSystem.dragOffset.x;
  let newY = e.clientY - containerRect.top - dragSystem.dragOffset.y;
  
  // Keep widget within container bounds
  newX = Math.max(0, Math.min(newX, dragSystem.container.offsetWidth - widget.offsetWidth));
  newY = Math.max(0, Math.min(newY, dragSystem.container.offsetHeight - widget.offsetHeight));
  
  // Update widget position temporarily
  widget.style.left = `${newX}px`;
  widget.style.top = `${newY}px`;
}

function handleMouseUp(e) {
  if (!dragSystem.isDragging || !dragSystem.draggedWidget) return;
  
  const widget = dragSystem.draggedWidget;
  const containerRect = dragSystem.container.getBoundingClientRect();
  
  // Calculate final position
  let finalX = e.clientX - containerRect.left - dragSystem.dragOffset.x;
  let finalY = e.clientY - containerRect.top - dragSystem.dragOffset.y;
  
  // Keep within bounds
  finalX = Math.max(0, Math.min(finalX, dragSystem.container.offsetWidth - widget.offsetWidth));
  finalY = Math.max(0, Math.min(finalY, dragSystem.container.offsetHeight - widget.offsetHeight));
  
  // Find valid position without collision
  const validPosition = dragSystem.findValidPosition(widget, finalX, finalY);
  
  // Apply final position
  widget.style.left = `${validPosition.x}px`;
  widget.style.top = `${validPosition.y}px`;
  
  // Reset drag styling
  widget.style.zIndex = '';
  widget.style.opacity = '';
  widget.style.transform = '';
  widget.style.boxShadow = '';
  
  // Clean up
  dragSystem.isDragging = false;
  dragSystem.draggedWidget = null;
  
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  
  // Save positions
  saveWidgetPositions();
  
  console.log('Drag ended, widget positioned at:', validPosition);
}

function saveWidgetPositions() {
  const positions = {};
  dragSystem.widgets.forEach(widget => {
    const widgetId = widget.dataset.widget;
    if (widgetId) {
      positions[widgetId] = {
        x: widget.offsetLeft,
        y: widget.offsetTop
      };
    }
  });
  lsSet('widget-positions', positions);
}

function loadWidgetPositions() {
  const positions = lsGet('widget-positions', {});
  
  Object.entries(positions).forEach(([widgetId, pos]) => {
    const widget = qs(`[data-widget="${widgetId}"]`);
    if (widget) {
      widget.style.position = 'absolute';
      widget.style.left = `${pos.x}px`;
      widget.style.top = `${pos.y}px`;
    }
  });
}

// PARTICLE BACKGROUND ----------------------------------------------------
function initParticles() {
  // Get current theme colors
  const computedStyle = getComputedStyle(document.body);
  const accentColor = computedStyle.getPropertyValue('--accent-color').trim();
  const glowColor = computedStyle.getPropertyValue('--glow-color').trim();
  const theme = document.body.getAttribute('data-theme');
  
  // Theme-specific particle configurations
  let particleColors = ['#ffffff', '#ffdd00', '#00ccff', '#ff0077', accentColor];
  let particleCount = 80;
  
  if (theme === 'tokyonight') {
    particleColors = ['#7aa2f7', '#bb9af7', '#9ece6a', '#f7768e', '#e0af68'];
  } else if (theme === 'rosepine') {
    particleColors = ['#c4a7e7', '#eb6f92', '#31748f', '#f6c177', '#9ccfd8'];
  } else if (theme === 'neon') {
    particleColors = ['#00ff88', '#ffff00', '#ff0066', '#00ccff', '#ff8800'];
    particleCount = 120;
  } else if (theme === 'dark') {
    particleColors = ['#4fc3f7', '#66bb6a', '#ffb74d', '#f06292', '#90a4ae'];
  } else if (theme === 'spirited') {
    particleColors = ['#d4af37', '#f4e4bc', '#8b7355', '#2e8b57', '#ff6347'];
    particleCount = 90;
  } else if (theme === 'mononoke') {
    particleColors = ['#4a7c59', '#e8f4f8', '#2d4a35', '#228b22', '#b8860b'];
    particleCount = 85;
  } else if (theme === 'howl') {
    particleColors = ['#cd853f', '#f5e6d3', '#8b4513', '#32cd32', '#ffd700'];
    particleCount = 95;
  } else if (theme === 'laputa') {
    particleColors = ['#4682b4', '#e6f2ff', '#2f4f4f', '#20b2aa', '#ffa500'];
    particleCount = 100;
  } else if (theme === 'kiki') {
    particleColors = ['#d2691e', '#faf0e6', '#8b4513', '#9acd32', '#ff8c00'];
    particleCount = 75;
  }
  
  tsParticles.load('tsparticles', {
    fpsLimit: 120,
    fullScreen: { enable: true, zIndex: -1 },
    background: {
      color: { value: 'transparent' },
    },
    particles: {
      number: { 
        value: particleCount, 
        density: { enable: true, area: 800 } 
      },
      color: { 
        value: particleColors 
      },
      shape: { 
        type: ['circle', 'triangle', 'polygon'],
        polygon: { sides: 6 }
      },
      opacity: { 
        value: { min: 0.3, max: 0.8 },
        animation: {
          enable: true,
          speed: 1,
          sync: false
        }
      },
      size: { 
        value: { min: 1, max: 6 },
        animation: {
          enable: true,
          speed: 2,
          sync: false
        }
      },
      move: { 
        enable: true, 
        speed: { min: 1, max: 3 },
        direction: 'none', 
        random: true, 
        straight: false, 
        outModes: {
          default: 'bounce'
        },
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      },
      links: { 
        enable: true, 
        distance: 150, 
        color: '#ffffff', 
        opacity: 0.4, 
        width: 1,
        triangles: {
          enable: true,
          opacity: 0.1
        }
      },
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: {
          enable: true,
          mode: ['repulse', 'bubble']
        },
        onClick: {
          enable: true,
          mode: 'push'
        }
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        bubble: {
          distance: 200,
          size: 8,
          duration: 2,
          opacity: 0.8
        },
        push: {
          quantity: 4
        }
      }
    },
    detectRetina: true,
  });
}

// FAVICON UTILITIES -----------------------------------------------------
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  } catch {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="%23cccccc"/></svg>';
  }
}

// BOOKMARK WIDGET -------------------------------------------------------
function initBookmarks() {
  const form = qs('#bookmarkForm');
  const list = qs('#bookmarkList');

  function render() {
    list.innerHTML = '';
    const bookmarks = lsGet('bookmarks', []);
    bookmarks.forEach((bm, idx) => {
      const li = document.createElement('li');
      li.className = 'bookmark-item';
      
      const favicon = document.createElement('img');
      favicon.src = getFaviconUrl(bm.url);
      favicon.className = 'bookmark-favicon';
      favicon.onerror = () => {
        favicon.style.display = 'none';
      };
      
      const span = document.createElement('span');
      span.textContent = bm.title;
      span.addEventListener('click', () => window.open(bm.url, '_blank'));
      
      const del = document.createElement('button');
      del.textContent = '✕';
      del.addEventListener('click', () => {
        bookmarks.splice(idx, 1);
        lsSet('bookmarks', bookmarks);
        render();
      });
      
      li.append(favicon, span, del);
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = qs('#bookmarkTitle').value.trim();
    const url = qs('#bookmarkURL').value.trim();
    if (!title || !url) return;
    const bookmarks = lsGet('bookmarks', []);
    bookmarks.push({ title, url });
    lsSet('bookmarks', bookmarks);
    form.reset();
    render();
    
    // Auto-resize after adding new bookmark
    setTimeout(() => {
      autoResizeWidget('bookmark');
      window.optimizeLayout && window.optimizeLayout();
    }, 100);
  });

  render();
}

// SEARCH WIDGET ---------------------------------------------------------
function initSearch() {
  qs('#searchBtn').addEventListener('click', () => {
    const engine = qs('#searchEngine').value;
    const query = encodeURIComponent(qs('#searchQuery').value.trim());
    if (!query) return;
    window.open(engine + query, '_blank');
  });
}

// TODO + CALENDAR WIDGET ------------------------------------------------
function initTodo() {
  const form = qs('#todoForm');
  const list = qs('#todoList');
  const calendarContainer = qs('#calendar');
  let currentFilter = 'all';

  function getTasks() {
    return lsGet('tasks', []);
  }

  function setTasks(tasks) {
    lsSet('tasks', tasks);
  }

  function renderTasks(filterDate = null) {
    list.innerHTML = '';
    let tasks = getTasks();
    
    if (filterDate) {
      tasks = tasks.filter((t) => t.date === filterDate);
    }
    
    // Apply filter
    if (currentFilter === 'pending') {
      tasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      tasks = tasks.filter(t => t.completed);
    }

    tasks.forEach((task, idx) => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      if (task.completed) li.classList.add('completed');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed || false;
      checkbox.addEventListener('change', () => {
        const allTasks = getTasks();
        const taskIndex = allTasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          allTasks[taskIndex].completed = checkbox.checked;
          setTasks(allTasks);
          renderTasks(filterDate);
          renderCalendar();
        }
      });
      
      const priority = document.createElement('div');
      priority.className = `todo-priority ${task.priority || 'medium'}`;
      
      const span = document.createElement('span');
      span.textContent = `${task.title} (${task.date})`;
      
      const del = document.createElement('button');
      del.textContent = '✕';
      del.addEventListener('click', () => {
        const allTasks = getTasks();
        const taskIndex = allTasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          allTasks.splice(taskIndex, 1);
          setTasks(allTasks);
          renderCalendar();
          renderTasks(filterDate);
        }
      });
      
      li.append(checkbox, priority, span, del);
      list.appendChild(li);
    });
    
    // Auto-resize the todo widget after rendering
    autoResizeWidget('todo');
    setTimeout(() => window.optimizeLayout && window.optimizeLayout(), 50);
  }

  // Filter buttons
  qs('#filterAll').addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterButtons();
    renderTasks();
  });
  
  qs('#filterPending').addEventListener('click', () => {
    currentFilter = 'pending';
    updateFilterButtons();
    renderTasks();
  });
  
  qs('#filterCompleted').addEventListener('click', () => {
    currentFilter = 'completed';
    updateFilterButtons();
    renderTasks();
  });
  
  qs('#clearCompleted').addEventListener('click', () => {
    const tasks = getTasks().filter(t => !t.completed);
    setTasks(tasks);
    renderTasks();
    renderCalendar();
  });
  
  function updateFilterButtons() {
    qsa('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (currentFilter === 'all') qs('#filterAll').classList.add('active');
    if (currentFilter === 'pending') qs('#filterPending').classList.add('active');
    if (currentFilter === 'completed') qs('#filterCompleted').classList.add('active');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = qs('#todoTitle').value.trim();
    const date = qs('#todoDate').value;
    const priority = qs('#todoPriority').value;
    if (!title || !date) return;
    
    const tasks = getTasks();
    tasks.push({ 
      id: Date.now(),
      title, 
      date, 
      priority,
      completed: false 
    });
    setTasks(tasks);
    form.reset();
    renderCalendar();
    renderTasks();
    
    // Auto-resize after adding new task
    setTimeout(() => {
      autoResizeWidget('todo');
      window.optimizeLayout && window.optimizeLayout();
    }, 100);
  });

  function renderCalendar() {
    calendarContainer.innerHTML = '';
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startDay; i++) {
      calendarContainer.appendChild(document.createElement('div'));
    }

    const tasks = getTasks();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const div = document.createElement('div');
      div.textContent = day;
      div.className = 'calendar-day';
      if (tasks.some((t) => t.date === dateStr)) {
        div.classList.add('has-task');
      }
      div.addEventListener('click', () => renderTasks(dateStr));
      calendarContainer.appendChild(div);
    }
  }

  renderCalendar();
  renderTasks();
}

// POMODORO WIDGET -------------------------------------------------------
function initPomodoro() {
  const display = qs('#pomodoroDisplay');
  const status = qs('#pomodoroStatus');
  const startBtn = qs('#pomodoroStart');
  const stopBtn = qs('#pomodoroStop');
  const resetBtn = qs('#pomodoroReset');
  const workInput = qs('#workMinutes');
  const breakInput = qs('#breakMinutes');
  const sessionCountEl = qs('#sessionCount');
  const todayCountEl = qs('#todayCount');

  let timer = null;
  let remaining = 25 * 60;
  let isBreak = false;
  let isRunning = false;
  let sessionCount = lsGet('pomodoro-sessions', 0);
  let todayCount = lsGet('pomodoro-today', { date: new Date().toDateString(), count: 0 });

  // Check if it's a new day
  if (todayCount.date !== new Date().toDateString()) {
    todayCount = { date: new Date().toDateString(), count: 0 };
    lsSet('pomodoro-today', todayCount);
  }

  function updateDisplay() {
    const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
    const secs = String(remaining % 60).padStart(2, '0');
    display.textContent = `${mins}:${secs}`;
    
    if (isBreak) {
      status.textContent = isRunning ? 'Break time! Relax...' : 'Break - Paused';
      display.style.color = '#26de81';
    } else {
      status.textContent = isRunning ? 'Work time! Focus...' : (remaining === parseInt(workInput.value) * 60 ? 'Ready to start' : 'Work - Paused');
      display.style.color = '';
    }
    
    sessionCountEl.textContent = sessionCount;
    todayCountEl.textContent = todayCount.count;
  }

  function playNotification() {
    // Create audio notification (works in most browsers)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    } catch (e) {
      // Fallback for browsers without Web Audio API
      console.log('Audio notification not supported');
    }
  }

  function startTimer() {
    if (timer) return;
    isRunning = true;
    startBtn.textContent = '⏸️ Pause';
    
    timer = setInterval(() => {
      remaining--;
      if (remaining < 0) {
        clearInterval(timer);
        timer = null;
        isRunning = false;
        
        if (!isBreak) {
          sessionCount++;
          todayCount.count++;
          lsSet('pomodoro-sessions', sessionCount);
          lsSet('pomodoro-today', todayCount);
        }
        
        isBreak = !isBreak;
        remaining = isBreak ? parseInt(breakInput.value) * 60 : parseInt(workInput.value) * 60;
        startBtn.textContent = '▶️ Start';
        
        playNotification();
        alert(isBreak ? 'Break time! Take a rest.' : 'Back to work! Stay focused.');
      }
      updateDisplay();
    }, 1000);
  }

  function pauseTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
      isRunning = false;
      startBtn.textContent = '▶️ Start';
      updateDisplay();
    }
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
    isRunning = false;
    remaining = parseInt(workInput.value) * 60;
    isBreak = false;
    startBtn.textContent = '▶️ Start';
    updateDisplay();
  }

  function resetTimer() {
    stopTimer();
    remaining = parseInt(workInput.value) * 60;
    updateDisplay();
  }

  startBtn.addEventListener('click', () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });
  
  stopBtn.addEventListener('click', stopTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  workInput.addEventListener('change', () => {
    if (!isRunning && !isBreak) {
      remaining = parseInt(workInput.value) * 60;
      updateDisplay();
    }
  });
  
  breakInput.addEventListener('change', () => {
    if (!isRunning && isBreak) {
      remaining = parseInt(breakInput.value) * 60;
      updateDisplay();
    }
  });

  updateDisplay();
}

// WEATHER WIDGET --------------------------------------------------------
function initWeather() {
  const form = qs('#weatherForm');
  const display = qs('#weatherDisplay');

  async function fetchWeather(loc) {
    try {
      display.textContent = 'Loading...';
      const res = await fetch(`https://wttr.in/${encodeURIComponent(loc)}?format=j1`);
      const data = await res.json();
      const curr = data.current_condition?.[0];
      if (!curr) throw new Error('No data');
      display.innerHTML = `${loc}: ${curr.temp_C}°C, ${curr.weatherDesc[0].value}`;
      lsSet('weather-last', loc);
    } catch (err) {
      display.textContent = 'Unable to fetch weather.';
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const loc = qs('#weatherLocation').value.trim();
    if (loc) fetchWeather(loc);
  });

  // Load last location
  const last = lsGet('weather-last');
  if (last) {
    qs('#weatherLocation').value = last;
    fetchWeather(last);
  }
}

// STICKY NOTES WIDGET ---------------------------------------------------
function initNotes() {
  const form = qs('#noteForm');
  const container = qs('#widgetContainer');

  function createNoteWidget(note) {
    const widget = document.createElement('section');
    widget.className = 'widget note-widget';
    widget.dataset.widget = `note-${note.id}`;
    
    widget.innerHTML = `
      <div class="widget-handle">⋮⋮</div>
      <h2>📝 ${note.title}</h2>
      <div class="note-content">${note.content}</div>
      <div class="note-actions">
        <button class="edit-note-btn">Edit</button>
        <button class="delete-note-btn">Delete</button>
      </div>
    `;

    // Add event listeners
    widget.querySelector('.edit-note-btn').addEventListener('click', () => {
      editNote(note.id, widget);
    });

    widget.querySelector('.delete-note-btn').addEventListener('click', () => {
      deleteNote(note.id, widget);
    });

    // Auto-resize based on content
    autoResizeWidget(`note-${note.id}`);

    return widget;
  }

  function editNote(noteId, widget) {
    const notes = lsGet('notes', []);
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = note.title;
    titleInput.style.marginBottom = '0.5rem';

    const contentTextarea = document.createElement('textarea');
    contentTextarea.value = note.content;
    contentTextarea.rows = 4;
    contentTextarea.style.width = '100%';
    contentTextarea.style.marginBottom = '0.5rem';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.marginRight = '0.5rem';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';

    const editContainer = document.createElement('div');
    editContainer.append(titleInput, contentTextarea, saveBtn, cancelBtn);

    const originalContent = widget.innerHTML;
    widget.innerHTML = '';
    widget.appendChild(editContainer);

    saveBtn.addEventListener('click', () => {
      const updatedTitle = titleInput.value.trim();
      const updatedContent = contentTextarea.value.trim();
      
      if (updatedTitle && updatedContent) {
        note.title = updatedTitle;
        note.content = updatedContent;
        lsSet('notes', notes);
        
        widget.innerHTML = `
          <div class="widget-handle">⋮⋮</div>
          <h2>📝 ${note.title}</h2>
          <div class="note-content">${note.content}</div>
          <div class="note-actions">
            <button class="edit-note-btn">Edit</button>
            <button class="delete-note-btn">Delete</button>
          </div>
        `;
        
        // Re-add event listeners
        widget.querySelector('.edit-note-btn').addEventListener('click', () => {
          editNote(note.id, widget);
        });
        widget.querySelector('.delete-note-btn').addEventListener('click', () => {
          deleteNote(note.id, widget);
        });
      }
    });

    cancelBtn.addEventListener('click', () => {
      widget.innerHTML = originalContent;
      // Re-add event listeners
      widget.querySelector('.edit-note-btn').addEventListener('click', () => {
        editNote(note.id, widget);
      });
      widget.querySelector('.delete-note-btn').addEventListener('click', () => {
        deleteNote(note.id, widget);
      });
    });
  }

  function deleteNote(noteId, widget) {
    if (confirm('Are you sure you want to delete this note?')) {
      const notes = lsGet('notes', []);
      const filteredNotes = notes.filter(n => n.id !== noteId);
      lsSet('notes', filteredNotes);
      widget.remove();
    }
  }

  function loadExistingNotes() {
    const notes = lsGet('notes', []);
    notes.forEach(note => {
      const widget = createNoteWidget(note);
      container.appendChild(widget);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = qs('#noteTitle').value.trim();
    const content = qs('#noteContent').value.trim();
    
    if (!title || !content) return;

    const note = {
      id: Date.now(),
      title,
      content,
      created: new Date().toISOString()
    };

    const notes = lsGet('notes', []);
    notes.push(note);
    lsSet('notes', notes);

    // Create and add the widget
    const widget = createNoteWidget(note);
    container.appendChild(widget);

    form.reset();
    
    // Auto-resize after adding new note
    setTimeout(() => {
      autoResizeWidget(`note-${note.id}`);
      window.optimizeLayout && window.optimizeLayout();
    }, 100);
  });

  loadExistingNotes();
}

// CLOCK WIDGET ----------------------------------------------------------
function initClock() {
  const digitalClock = qs('#digitalClock');
  const dateDisplay = qs('#dateDisplay');
  const hourHand = qs('.hour-hand');
  const minuteHand = qs('.minute-hand');
  const secondHand = qs('.second-hand');

  function updateClock() {
    const now = new Date();
    
    // Digital clock
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    digitalClock.textContent = timeString;
    
    // Date display
    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    dateDisplay.textContent = dateString;
    
    // Analog clock
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + minute adjustment
    const minuteAngle = minutes * 6; // 6 degrees per minute
    const secondAngle = seconds * 6; // 6 degrees per second
    
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// QUICK LINKS WIDGET ----------------------------------------------------
function initQuickLinks() {
  const form = qs('#linkForm');
  const grid = qs('#linkGrid');

  function renderLinks() {
    grid.innerHTML = '';
    const links = lsGet('quick-links', []);
    
    links.forEach((link, index) => {
      const linkEl = document.createElement('a');
      linkEl.className = 'link-item';
      linkEl.href = link.url;
      linkEl.target = '_blank';
      
      const favicon = document.createElement('img');
      favicon.src = getFaviconUrl(link.url);
      favicon.className = 'link-favicon';
      favicon.onerror = () => {
        favicon.style.display = 'none';
      };
      
      const linkText = document.createElement('span');
      linkText.textContent = link.name;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-link';
      deleteBtn.textContent = '×';
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const links = lsGet('quick-links', []);
        links.splice(index, 1);
        lsSet('quick-links', links);
        renderLinks();
      });
      
      linkEl.appendChild(favicon);
      linkEl.appendChild(linkText);
      linkEl.appendChild(deleteBtn);
      grid.appendChild(linkEl);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = qs('#linkName').value.trim();
    const url = qs('#linkUrl').value.trim();
    
    if (!name || !url) return;
    
    const links = lsGet('quick-links', []);
    links.push({ name, url });
    lsSet('quick-links', links);
    
    form.reset();
    renderLinks();
    
    // Auto-resize after adding new link
    setTimeout(() => {
      autoResizeWidget('links');
      window.optimizeLayout && window.optimizeLayout();
    }, 100);
  });

  renderLinks();
}

// KEYBOARD SHORTCUTS ----------------------------------------------------
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + E: Toggle edit mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      qs('#editModeToggle').click();
    }
    
    // Ctrl/Cmd + T: Change theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
      e.preventDefault();
      const themeSelect = qs('#themeSelector');
      const themes = ['light', 'dark', 'solar', 'neon'];
      const currentIndex = themes.indexOf(themeSelect.value);
      const nextIndex = (currentIndex + 1) % themes.length;
      themeSelect.value = themes[nextIndex];
      themeSelect.dispatchEvent(new Event('change'));
    }
    
    // Escape: Exit edit mode
    if (e.key === 'Escape') {
      const container = qs('#widgetContainer');
      if (container.classList.contains('edit-mode')) {
        qs('#editModeToggle').click();
      }
    }
    
    // Ctrl/Cmd + M: Optimize layout
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
      e.preventDefault();
      window.optimizeLayout && window.optimizeLayout();
    }
  });
}

// SMOOTH ANIMATIONS ----------------------------------------------------
function addEntranceAnimations() {
  const widgets = qsa('.widget');
  
  // Create intersection observer for entrance animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  // Initially hide widgets and set up animation
  widgets.forEach((widget, index) => {
    widget.style.opacity = '0';
    widget.style.transform = 'translateY(50px)';
    widget.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(widget);
  });
}

// PERFORMANCE OPTIMIZATIONS ----------------------------------------
function optimizeForQutebrowser() {
  // Detect qutebrowser or other browsers with limited capabilities
  const isQutebrowser = navigator.userAgent.includes('qutebrowser') || 
                       navigator.userAgent.includes('QtWebEngine');
  
  if (isQutebrowser) {
    // Reduce particle count for better performance
    document.documentElement.style.setProperty('--reduced-motion', '1');
    
    // Disable some heavy animations in qutebrowser
    const style = document.createElement('style');
    style.textContent = `
      .widget:hover {
        transform: translateY(-2px) scale(1.01);
      }
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// SYSTEM INFO WIDGET ---------------------------------------------------
function initSystemInfo() {
  const browserInfo = qs('#browserInfo');
  const platformInfo = qs('#platformInfo');
  const memoryInfo = qs('#memoryInfo');
  
  if (browserInfo) browserInfo.textContent = navigator.userAgent.split(' ').slice(-2).join(' ');
  if (platformInfo) platformInfo.textContent = navigator.platform || 'Unknown';
  
  // Memory info (if available)
  if ('memory' in performance && memoryInfo) {
    const memory = performance.memory;
    const used = Math.round(memory.usedJSHeapSize / 1048576);
    memoryInfo.textContent = `${used}MB`;
  } else if (memoryInfo) {
    memoryInfo.textContent = 'N/A';
  }
}

// RANDOM QUOTE WIDGET ---------------------------------------------------
function initQuoteWidget() {
  const quoteText = qs('#quoteText');
  const quoteAuthor = qs('#quoteAuthor');
  const refreshBtn = qs('#refreshQuote');
  
  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr." },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Darkness cannot drive out darkness; only light can do that.", author: "Martin Luther King Jr." },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" }
  ];
  
  function displayRandomQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    if (quoteText) quoteText.textContent = `"${randomQuote.text}"`;
    if (quoteAuthor) quoteAuthor.textContent = `— ${randomQuote.author}`;
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', displayRandomQuote);
    displayRandomQuote(); // Show initial quote
  }
}

// UNIT CONVERTER WIDGET ------------------------------------------------
function initUnitConverter() {
  const converterType = qs('#converterType');
  const fromValue = qs('#fromValue');
  const toValue = qs('#toValue');
  const fromUnit = qs('#fromUnit');
  const toUnit = qs('#toUnit');
  
  const conversions = {
    length: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      inch: 39.3701,
      foot: 3.28084,
      yard: 1.09361,
      mile: 0.000621371
    },
    weight: {
      kilogram: 1,
      gram: 1000,
      pound: 2.20462,
      ounce: 35.274,
      ton: 0.001
    },
    temperature: {
      celsius: (val, to) => to === 'fahrenheit' ? (val * 9/5) + 32 : to === 'kelvin' ? val + 273.15 : val,
      fahrenheit: (val, to) => to === 'celsius' ? (val - 32) * 5/9 : to === 'kelvin' ? (val - 32) * 5/9 + 273.15 : val,
      kelvin: (val, to) => to === 'celsius' ? val - 273.15 : to === 'fahrenheit' ? (val - 273.15) * 9/5 + 32 : val
    }
  };
  
  function updateUnits() {
    const type = converterType?.value;
    if (!type || !fromUnit || !toUnit) return;
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    if (type === 'temperature') {
      ['celsius', 'fahrenheit', 'kelvin'].forEach(unit => {
        fromUnit.add(new Option(unit.charAt(0).toUpperCase() + unit.slice(1), unit));
        toUnit.add(new Option(unit.charAt(0).toUpperCase() + unit.slice(1), unit));
      });
    } else {
      Object.keys(conversions[type] || {}).forEach(unit => {
        const displayName = unit.charAt(0).toUpperCase() + unit.slice(1);
        fromUnit.add(new Option(displayName, unit));
        toUnit.add(new Option(displayName, unit));
      });
    }
  }
  
  function convert() {
    const type = converterType?.value;
    const value = parseFloat(fromValue?.value || 0);
    const from = fromUnit?.value;
    const to = toUnit?.value;
    
    if (!type || !from || !to || isNaN(value)) {
      if (toValue) toValue.value = '';
      return;
    }
    
    let result;
    if (type === 'temperature') {
      result = conversions.temperature[from](value, to);
    } else {
      const conversion = conversions[type];
      result = (value / conversion[from]) * conversion[to];
    }
    
    if (toValue) toValue.value = result.toFixed(4);
  }
  
  if (converterType) {
    converterType.addEventListener('change', updateUnits);
    updateUnits();
  }
  
  if (fromValue) fromValue.addEventListener('input', convert);
  if (fromUnit) fromUnit.addEventListener('change', convert);
  if (toUnit) toUnit.addEventListener('change', convert);
}

// COLOR PALETTE WIDGET --------------------------------------------------
function initColorPalette() {
  const mainColor = qs('#mainColor');
  const generateBtn = qs('#generatePalette');
  const palette = qs('#colorPalette');
  
  function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  }
  
  function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  
  function generatePalette() {
    if (!mainColor || !palette) return;
    
    const baseColor = mainColor.value;
    const [h, s, l] = hexToHsl(baseColor);
    
    palette.innerHTML = '';
    
    // Generate complementary, triadic, and analogous colors
    const colors = [
      baseColor,
      hslToHex((h + 180) % 360, s, l), // Complementary
      hslToHex((h + 120) % 360, s, l), // Triadic 1
      hslToHex((h + 240) % 360, s, l), // Triadic 2
      hslToHex((h + 30) % 360, s, l)   // Analogous
    ];
    
    colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      swatch.title = color;
      swatch.addEventListener('click', () => {
        navigator.clipboard?.writeText(color);
        swatch.style.transform = 'scale(1.2)';
        setTimeout(() => swatch.style.transform = '', 200);
      });
      palette.appendChild(swatch);
    });
  }
  
  if (generateBtn) {
    generateBtn.addEventListener('click', generatePalette);
    generatePalette(); // Generate initial palette
  }
}

// GIF PLAYER WIDGET -----------------------------------------------------
function initGifPlayer() {
  const gifInput = qs('#gifInput');
  const gifSelector = qs('#gifSelector');
  const gifImage = qs('#gifImage');
  const gifPlaceholder = qs('#gifPlaceholder');
  const gifContainer = qs('#gifContainer');
  
  if (!gifInput || !gifSelector || !gifImage || !gifPlaceholder) return;
  
  // Load saved GIF
  const savedGif = lsGet('gif-image');
  if (savedGif) {
    loadGif(savedGif);
  }
  
  function loadGif(src) {
    gifImage.src = src;
    gifImage.style.display = 'block';
    gifPlaceholder.style.display = 'none';
    lsSet('gif-image', src);
  }

  function clearGif() {
    gifImage.src = '';
    gifImage.style.display = 'none';
    gifPlaceholder.style.display = 'flex';
    lsSet('gif-image', null);
  }
  
  // Event listeners
  gifSelector.addEventListener('click', (e) => {
    e.stopPropagation();
    gifInput.click();
  });
  
  gifContainer.addEventListener('click', () => {
    if (gifImage.style.display === 'block') {
      // If GIF is loaded, clear it
      clearGif();
    } else {
      // If no GIF, open file selector
      gifInput.click();
    }
  });
  
  gifInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/gif') {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('GIF too large. Please choose a GIF under 10MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        loadGif(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid GIF file');
    }
  });
  
  // Update selector button based on state
  function updateSelectorButton() {
    if (gifImage.style.display === 'block') {
      gifSelector.textContent = '🗑️';
      gifSelector.title = 'Clear GIF';
    } else {
      gifSelector.textContent = '📁';
      gifSelector.title = 'Select GIF';
    }
  }
  
  // Override selector click when GIF is loaded
  gifSelector.addEventListener('click', (e) => {
    e.stopPropagation();
    if (gifImage.style.display === 'block') {
      clearGif();
      updateSelectorButton();
    } else {
      gifInput.click();
    }
  });
  
  // Initial button state
  updateSelectorButton();
}

// WIDGET SIZE MANAGEMENT ------------------------------------------------
function addWidgetSizeControls() {
  if (qs('.widget-size-controls')) return; // Already added
  
  const editBtn = qs('#editModeToggle');
  const sizeControls = document.createElement('div');
  sizeControls.className = 'widget-size-controls';
  sizeControls.innerHTML = `
    <button id="toggleSizeMode" class="edit-btn">📏 Resize</button>
  `;
  
  editBtn.parentNode.insertBefore(sizeControls, editBtn);
  
  let isSizeMode = false;
  qs('#toggleSizeMode').addEventListener('click', () => {
    isSizeMode = !isSizeMode;
    document.body.classList.toggle('size-mode', isSizeMode);
    
    if (isSizeMode) {
      addSizeSelectorsToWidgets();
      qs('#toggleSizeMode').textContent = '✅ Done';
    } else {
      removeSizeSelectorsFromWidgets();
      qs('#toggleSizeMode').textContent = '📏 Resize';
    }
  });
}

function addSizeSelectorsToWidgets() {
  qsa('.widget').forEach(widget => {
    if (widget.querySelector('.size-selector')) return;
    
    const sizeSelector = document.createElement('select');
    sizeSelector.className = 'size-selector';
    sizeSelector.style.cssText = `
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 10;
      font-size: 0.7rem;
      padding: 3px 6px;
      border-radius: 6px;
      background: var(--accent-color);
      color: white;
      border: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
    `;
    
    const sizes = [
      { value: 'size-1x1', label: '1×1' },
      { value: 'size-1x2', label: '1×2' },
      { value: 'size-2x1', label: '2×1' },
      { value: 'size-2x2', label: '2×2' },
      { value: 'size-3x2', label: '3×2' },
      { value: 'size-3x3', label: '3×3' }
    ];
    
    sizes.forEach(size => {
      const option = document.createElement('option');
      option.value = size.value;
      option.textContent = size.label;
      sizeSelector.appendChild(option);
    });
    
    // Set current size
    const currentSize = sizes.find(s => widget.classList.contains(s.value));
    if (currentSize) {
      sizeSelector.value = currentSize.value;
    } else {
      sizeSelector.value = 'size-2x2'; // Default
    }
    
    sizeSelector.addEventListener('change', () => {
      const oldSizes = sizes.map(s => s.value);
      widget.classList.remove(...oldSizes);
      widget.classList.add(sizeSelector.value);
      
      // Update widget dimensions based on size class
      const sizeClass = sizeSelector.value;
      if (sizeClass === 'size-1x1') {
        widget.style.width = '200px';
        widget.style.minHeight = '150px';
      } else if (sizeClass === 'size-1x2') {
        widget.style.width = '200px';
        widget.style.minHeight = '300px';
      } else if (sizeClass === 'size-2x1') {
        widget.style.width = '350px';
        widget.style.minHeight = '150px';
      } else if (sizeClass === 'size-2x2') {
        widget.style.width = '350px';
        widget.style.minHeight = '300px';
      } else if (sizeClass === 'size-3x2') {
        widget.style.width = '500px';
        widget.style.minHeight = '300px';
      } else if (sizeClass === 'size-3x3') {
        widget.style.width = '500px';
        widget.style.minHeight = '450px';
      }
    });
    
    widget.appendChild(sizeSelector);
  });
}

function removeSizeSelectorsFromWidgets() {
  qsa('.size-selector').forEach(selector => selector.remove());
}

function autoResizeWidget(widgetId) {
  const widget = qs(`[data-widget="${widgetId}"]`);
  if (widget) {
    // Simple auto-resize based on content
    const contentHeight = widget.scrollHeight;
    if (contentHeight > widget.offsetHeight) {
      widget.style.minHeight = `${contentHeight + 20}px`;
    }
  }
}

// INITIALIZE ALL --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Performance optimization
  optimizeForQutebrowser();
  
  // Core functionality
  initTheme();
  initEditMode();
  initKeyboardShortcuts();
  
  // Initialize simple drag system
  console.log('Initializing simple drag system...');
  setTimeout(() => {
    dragSystem.initializeWidgets();
    loadWidgetPositions(); // Load saved positions
    console.log('Simple drag system initialized with', dragSystem.widgets.length, 'widgets');
  }, 200);
  
  // Initialize widgets
  initBookmarks();
  initSearch();
  initTodo();
  initPomodoro();
  initWeather();
  initNotes();
  initClock();
  initQuickLinks();
  
  // Initialize new widgets
  initSystemInfo();
  initQuoteWidget();
  initUnitConverter();
  initColorPalette();
  initGifPlayer();
  
  // Add widget size controls
  addWidgetSizeControls();
  
  // Initialize dynamic sizing for all widgets
  qsa('.widget').forEach(widget => {
    const widgetId = widget.dataset.widget;
    if (widgetId) {
      autoResizeWidget(widgetId);
    }
  });
  
  // Visual enhancements
  setTimeout(() => {
    initParticles();
    addEntranceAnimations();
  }, 500);
}); 
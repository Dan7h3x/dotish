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

// EDIT MODE HANDLING -----------------------------------------------------
function initEditMode() {
  const editBtn = qs('#editModeToggle');
  const editText = qs('#editModeText');
  const container = qs('#widgetContainer');
  let isEditMode = false;
  
  editBtn.addEventListener('click', () => {
    isEditMode = !isEditMode;
    if (isEditMode) {
      container.classList.add('edit-mode');
      editBtn.classList.add('active');
      editText.textContent = 'Exit Edit';
      enableWidgetDragging();
    } else {
      container.classList.remove('edit-mode');
      editBtn.classList.remove('active');
      editText.textContent = 'Edit Layout';
      disableWidgetDragging();
    }
  });
}

let draggedWidget = null;
let placeholder = null;

function enableWidgetDragging() {
  const widgets = qsa('.widget');
  
  widgets.forEach(widget => {
    widget.draggable = true;
    widget.addEventListener('dragstart', handleDragStart);
    widget.addEventListener('dragover', handleDragOver);
    widget.addEventListener('drop', handleDrop);
    widget.addEventListener('dragend', handleDragEnd);
  });
}

function disableWidgetDragging() {
  const widgets = qsa('.widget');
  
  widgets.forEach(widget => {
    widget.draggable = false;
    widget.removeEventListener('dragstart', handleDragStart);
    widget.removeEventListener('dragover', handleDragOver);
    widget.removeEventListener('drop', handleDrop);
    widget.removeEventListener('dragend', handleDragEnd);
  });
}

function handleDragStart(e) {
  draggedWidget = this;
  this.style.opacity = '0.5';
  
  // Create placeholder
  placeholder = document.createElement('div');
  placeholder.className = 'widget-placeholder';
  placeholder.style.cssText = `
    border: 3px dashed var(--accent-color);
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.1);
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-color);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
  `;
  placeholder.textContent = 'Drop Here';
}

function handleDragOver(e) {
  e.preventDefault();
  const container = qs('#widgetContainer');
  const afterElement = getDragAfterElement(container, e.clientY);
  
  if (afterElement == null) {
    container.appendChild(placeholder);
  } else {
    container.insertBefore(placeholder, afterElement);
  }
}

function handleDrop(e) {
  e.preventDefault();
  if (placeholder && placeholder.parentNode) {
    placeholder.parentNode.insertBefore(draggedWidget, placeholder);
    placeholder.remove();
  }
  saveWidgetOrder();
}

function handleDragEnd(e) {
  if (draggedWidget) {
    draggedWidget.style.opacity = '';
    draggedWidget = null;
  }
  if (placeholder && placeholder.parentNode) {
    placeholder.remove();
  }
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.widget:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveWidgetOrder() {
  const widgets = qsa('.widget');
  const order = widgets.map(w => w.dataset.widget);
  lsSet('widget-order', order);
}

function loadWidgetOrder() {
  const order = lsGet('widget-order');
  if (!order) return;
  
  const container = qs('#widgetContainer');
  const widgets = qsa('.widget');
  
  // Create a map of widgets by their data-widget attribute
  const widgetMap = {};
  widgets.forEach(widget => {
    widgetMap[widget.dataset.widget] = widget;
  });
  
  // Reorder widgets according to saved order
  order.forEach(widgetId => {
    if (widgetMap[widgetId]) {
      container.appendChild(widgetMap[widgetId]);
    }
  });
}

// PARTICLE BACKGROUND ----------------------------------------------------
function initParticles() {
  // Get current theme colors
  const computedStyle = getComputedStyle(document.body);
  const accentColor = computedStyle.getPropertyValue('--accent-color').trim();
  const glowColor = computedStyle.getPropertyValue('--glow-color').trim();
  
  tsParticles.load('tsparticles', {
    fpsLimit: 120,
    fullScreen: { enable: true, zIndex: -1 },
    background: {
      color: { value: 'transparent' },
    },
    particles: {
      number: { 
        value: 100, 
        density: { enable: true, area: 800 } 
      },
      color: { 
        value: ['#ffffff', '#ffdd00', '#00ccff', '#ff0077', accentColor] 
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

// BOOKMARK WIDGET -------------------------------------------------------
function initBookmarks() {
  const form = qs('#bookmarkForm');
  const list = qs('#bookmarkList');

  function render() {
    list.innerHTML = '';
    const bookmarks = lsGet('bookmarks', []);
    bookmarks.forEach((bm, idx) => {
      const li = document.createElement('li');
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
      li.append(span, del);
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
    setTimeout(() => autoResizeWidget('bookmark'), 100);
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
    setTimeout(() => autoResizeWidget('todo'), 100);
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
    setTimeout(() => autoResizeWidget(`note-${note.id}`), 100);
  });

  loadExistingNotes();
}

// DYNAMIC WIDGET SIZING ------------------------------------------------
function updateWidgetSize(widget) {
  // Remove existing size classes
  widget.classList.remove('small', 'medium', 'large');
  
  // Calculate content height
  const content = widget.querySelector('.widget-content') || widget;
  const contentHeight = content.scrollHeight;
  
  // Apply appropriate size class based on content
  if (contentHeight <= 300) {
    widget.classList.add('small');
  } else if (contentHeight <= 500) {
    widget.classList.add('medium');
  } else {
    widget.classList.add('large');
  }
  
  // Add smooth transition
  widget.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

function autoResizeWidget(widgetId) {
  const widget = qs(`[data-widget="${widgetId}"]`);
  if (widget) {
    // Use ResizeObserver for automatic resizing
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          updateWidgetSize(entry.target);
        }
      });
      resizeObserver.observe(widget);
    } else {
      // Fallback for browsers without ResizeObserver
      updateWidgetSize(widget);
    }
  }
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
      linkEl.textContent = link.name;
      
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
    setTimeout(() => autoResizeWidget('links'), 100);
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

// INITIALIZE ALL --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Performance optimization
  optimizeForQutebrowser();
  
  // Core functionality
  initTheme();
  initEditMode();
  initKeyboardShortcuts();
  
  // Load saved widget order before initializing widgets
  loadWidgetOrder();
  
  // Initialize widgets
  initBookmarks();
  initSearch();
  initTodo();
  initPomodoro();
  initWeather();
  initNotes();
  initClock();
  initQuickLinks();
  
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
  }, 100);
}); 
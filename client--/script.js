/**
 * ============================================================================
 * CAMPUS CONNECT PORTAL - CLIENT-SIDE JAVASCRIPT (DOM MANIPULATION & EVENTS)
 * Course: CS3301 - Full Stack Web Development
 * Institution: RV University - School of Computer Science & Engineering
 * ============================================================================
 * 
 * Learning Outcomes Covered:
 * 1. DOM Selection & Manipulation: Selecting elements with querySelector/getElementById,
 *    creating new DOM nodes with createElement, changing text/styles, appending and removing nodes.
 * 2. Event Handling:
 *    - 'click' events: Add item, delete item, toggle completed style, clear list, carousel nav, filter tabs.
 *    - 'input' events: Real-time live text reflection, character counting, dynamic list search filtering.
 *    - 'keydown' events: Enter key to add item, Escape key to clear input field.
 * 3. Asynchronous / Dynamic Updates: Seamlessly updating UI state without page reloads.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c[CampusConnect] DOM fully loaded and parsed. Initializing client-side scripts...', 'color: #0d5c3a; font-weight: bold; font-size: 13px;');

  // ==========================================================================
  // 1. DOM Element Cache / Selection
  // ==========================================================================
  
  // Activity / Task Board Elements
  const taskInput = document.getElementById('taskInput');
  const taskCategory = document.getElementById('taskCategory');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const clearInputBtn = document.getElementById('clearInputBtn');
  const taskList = document.getElementById('taskList');
  const charCounter = document.getElementById('charCounter');
  const livePreviewText = document.getElementById('livePreviewText');
  const livePreviewCategory = document.getElementById('livePreviewCategory');
  const taskSearchInput = document.getElementById('taskSearchInput');
  const totalTasksCount = document.getElementById('totalTasksCount');
  const completedTasksCount = document.getElementById('completedTasksCount');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  // Navigation & Scroll Elements
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header');
  const backToTopBtn = document.getElementById('backToTop');

  // Carousel Elements
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselDots = document.querySelectorAll('#carouselDots .dot');
  const carouselSlides = document.querySelectorAll('.carousel-slide');

  // Event Category Filter Elements
  const filterButtons = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-card');

  // ==========================================================================
  // 2. Real-Time Input Reflection & Character Counting ('input' Event)
  // ==========================================================================
  
  if (taskInput) {
    /**
     * Input Event Listener:
     * Fires immediately whenever the user types, pastes, or deletes text.
     * Updates the live preview box and dynamic character counter in real time.
     */
    taskInput.addEventListener('input', (event) => {
      const userText = event.target.value;
      const charLength = userText.length;

      // Update character counter display
      if (charCounter) {
        charCounter.textContent = `${charLength} / 120 chars`;
        if (charLength > 100) {
          charCounter.style.color = '#e11d48'; // Red warning near limit
        } else {
          charCounter.style.color = 'var(--text-muted)';
        }
      }

      // Dynamically reflect text in the Live Preview container
      if (livePreviewText) {
        if (userText.trim().length === 0) {
          livePreviewText.textContent = 'Start typing to see live preview...';
          livePreviewText.style.color = '#15803d';
        } else {
          livePreviewText.textContent = `"${userText}"`;
          livePreviewText.style.color = '#052e1c';
        }
      }
    });

    // Update category tag in the live preview box when dropdown changes
    if (taskCategory && livePreviewCategory) {
      taskCategory.addEventListener('change', (event) => {
        const selectedCategoryText = event.target.options[event.target.selectedIndex].text;
        livePreviewCategory.textContent = selectedCategoryText;
      });
    }
  }

  // ==========================================================================
  // 3. Keyboard Event Handling ('keydown' Event)
  // ==========================================================================
  
  if (taskInput) {
    /**
     * Keydown Event Listener:
     * Listens for specific key presses:
     * - 'Enter': Triggers adding the item directly from the keyboard.
     * - 'Escape': Resets and clears the input field.
     */
    taskInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent accidental form submissions
        console.log('[CampusConnect Event] Keyboard "Enter" detected on input.');
        createNewTaskItem();
      } else if (event.key === 'Escape') {
        console.log('[CampusConnect Event] Keyboard "Escape" detected - clearing input.');
        resetInputField();
      }
    });
  }

  // ==========================================================================
  // 4. Dynamic Element Creation & Insertion (Click Event)
  // ==========================================================================
  
  if (addTaskBtn) {
    /**
     * Click Event Listener on 'Add Item' Button:
     * Validates input, constructs new DOM elements, and appends them to the list.
     */
    addTaskBtn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('[CampusConnect Event] "Add Task" button clicked.');
      createNewTaskItem();
    });
  }

  if (clearInputBtn) {
    clearInputBtn.addEventListener('click', (event) => {
      event.preventDefault();
      resetInputField();
    });
  }

  /**
   * Helper function: Resets the input field and live preview.
   */
  function resetInputField() {
    if (taskInput) {
      taskInput.value = '';
      if (charCounter) charCounter.textContent = '0 / 120 chars';
      if (livePreviewText) {
        livePreviewText.textContent = 'Start typing to see live preview...';
      }
      taskInput.focus();
    }
  }

  /**
   * Core function: Dynamically creates and appends a new task/announcement item
   * using native DOM methods (document.createElement, appendChild, classList).
   */
  function createNewTaskItem() {
    if (!taskInput || !taskList) return;

    const taskText = taskInput.value.trim();
    const categoryValue = taskCategory ? taskCategory.value : 'academic';
    const categoryName = taskCategory ? taskCategory.options[taskCategory.selectedIndex].text : 'Academic';

    // Simple validation check
    if (taskText === '') {
      taskInput.focus();
      taskInput.style.borderColor = '#ef4444';
      setTimeout(() => {
        taskInput.style.borderColor = 'var(--border-color)';
      }, 1200);
      return;
    }

    // Remove empty state message if it exists
    const emptyState = taskList.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }

    // Format timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Create outer list item container (<li>)
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-category', categoryValue);

    // 2. Create left wrapper
    const leftDiv = document.createElement('div');
    leftDiv.className = 'task-item-left';

    // 3. Create interactive toggle checkbox button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'task-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle complete status');
    toggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    // 4. Create content block with title, category tag, and timestamp
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = taskText;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'task-meta';

    const catBadge = document.createElement('span');
    catBadge.className = `task-category-tag cat-${categoryValue}`;
    catBadge.textContent = categoryName;

    const timeSpan = document.createElement('span');
    timeSpan.textContent = `• Added at ${timeString}`;

    metaDiv.appendChild(catBadge);
    metaDiv.appendChild(timeSpan);
    contentDiv.appendChild(titleSpan);
    contentDiv.appendChild(metaDiv);

    leftDiv.appendChild(toggleBtn);
    leftDiv.appendChild(contentDiv);

    // 5. Create delete action button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete item');
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;

    // 6. Attach Event Listeners to Newly Created Elements
    
    // Toggle completed state on click
    toggleBtn.addEventListener('click', () => {
      li.classList.toggle('completed');
      console.log(`[CampusConnect Event] Toggled item completed state for: "${taskText}"`);
      updateTaskCounters();
    });

    // Delete item on click
    deleteBtn.addEventListener('click', () => {
      li.style.transform = 'translateX(20px)';
      li.style.opacity = '0';
      setTimeout(() => {
        li.remove();
        console.log(`[CampusConnect Event] Removed item from DOM: "${taskText}"`);
        checkEmptyState();
        updateTaskCounters();
      }, 250);
    });

    // Assemble and insert at top of taskList (prepend)
    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);
    taskList.prepend(li);

    // Reset input field and update stats
    resetInputField();
    updateTaskCounters();
  }

  /**
   * Helper function: Check if list is empty and render placeholder
   */
  function checkEmptyState() {
    if (taskList && taskList.querySelectorAll('.task-item').length === 0) {
      taskList.innerHTML = `
        <div class="empty-state">
          <p>No tasks or announcements listed yet. Type in the box above and click <strong>Add Item</strong> or press <kbd class="kbd-badge">Enter</kbd> to create one!</p>
        </div>
      `;
    }
  }

  /**
   * Helper function: Dynamically update statistics badges
   */
  function updateTaskCounters() {
    if (!taskList) return;
    const allItems = taskList.querySelectorAll('.task-item');
    const completedItems = taskList.querySelectorAll('.task-item.completed');

    if (totalTasksCount) {
      totalTasksCount.textContent = allItems.length;
    }
    if (completedTasksCount) {
      completedTasksCount.textContent = completedItems.length;
    }
  }

  // ==========================================================================
  // 5. Existing Starter List Items - Attach Event Listeners
  // ==========================================================================
  
  if (taskList) {
    taskList.querySelectorAll('.task-item').forEach(item => {
      const toggleBtn = item.querySelector('.task-toggle-btn');
      const deleteBtn = item.querySelector('.task-delete-btn');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          item.classList.toggle('completed');
          updateTaskCounters();
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          item.style.transform = 'translateX(20px)';
          item.style.opacity = '0';
          setTimeout(() => {
            item.remove();
            checkEmptyState();
            updateTaskCounters();
          }, 250);
        });
      }
    });

    updateTaskCounters();
  }

  // Clear all completed items button
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      const completedItems = taskList.querySelectorAll('.task-item.completed');
      completedItems.forEach(item => {
        item.style.opacity = '0';
        setTimeout(() => {
          item.remove();
          checkEmptyState();
          updateTaskCounters();
        }, 200);
      });
    });
  }

  // ==========================================================================
  // 6. Real-Time Dynamic List Search Filtering ('input' Event)
  // ==========================================================================
  
  if (taskSearchInput && taskList) {
    taskSearchInput.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase().trim();
      const items = taskList.querySelectorAll('.task-item');

      items.forEach(item => {
        const text = item.querySelector('.task-title').textContent.toLowerCase();
        const category = item.getAttribute('data-category').toLowerCase();
        if (text.includes(query) || category.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // ==========================================================================
  // 7. Event Category Filter Component ('click' Event)
  // ==========================================================================
  
  if (filterButtons.length > 0 && eventCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const category = btn.getAttribute('data-category');
        eventCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // 8. Interactive Highlights Carousel Component
  // ==========================================================================
  
  if (carouselTrack && carouselSlides.length > 0) {
    let currentSlideIndex = 0;
    let autoSlideTimer;

    function renderSlide(index) {
      if (index < 0) index = carouselSlides.length - 1;
      if (index >= carouselSlides.length) index = 0;
      currentSlideIndex = index;

      carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      carouselDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
      });
    }

    if (carouselPrev) {
      carouselPrev.addEventListener('click', () => {
        renderSlide(currentSlideIndex - 1);
        resetAutoSlideTimer();
      });
    }

    if (carouselNext) {
      carouselNext.addEventListener('click', () => {
        renderSlide(currentSlideIndex + 1);
        resetAutoSlideTimer();
      });
    }

    carouselDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-index'));
        renderSlide(targetIndex);
        resetAutoSlideTimer();
      });
    });

    function startAutoSlideTimer() {
      autoSlideTimer = setInterval(() => {
        renderSlide(currentSlideIndex + 1);
      }, 5000);
    }

    function resetAutoSlideTimer() {
      clearInterval(autoSlideTimer);
      startAutoSlideTimer();
    }

    startAutoSlideTimer();
  }

  // ==========================================================================
  // 9. Mobile Responsive Navigation & Scroll Spy
  // ==========================================================================
  
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll Spy & Back to Top Controller
  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.pageYOffset >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });

    if (backToTopBtn) {
      if (window.pageYOffset > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.log('%c[CampusConnect] All event listeners & DOM controllers initialized successfully.', 'color: #059669; font-weight: bold;');
});

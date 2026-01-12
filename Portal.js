// DOM Elements
const navItems = document.querySelectorAll('.nav-menu li');
const sections = document.querySelectorAll('.section');
const logoutBtn = document.getElementById('logout-btn');
const datetimeElement = document.getElementById('datetime');
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.getElementById('sidebar');
const body = document.body;

// Chart instance
let progressChart = null;

// Initialize the portal
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme preference
    loadThemePreference();
    
    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initialize navigation
    initNavigation();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize logout functionality
    initLogout();
    
    // Load initial section content
    loadSectionContent('dashboard');
});

// Load saved theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('diu-theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
    };
    
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    datetimeElement.innerHTML = `
        <i class="fas fa-calendar-alt"></i> ${dateString} 
        <i class="fas fa-clock" style="margin-left: 10px;"></i> ${timeString}
    `;
}

// Initialize navigation
function initNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get section to show
            const sectionId = this.getAttribute('data-section');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            document.getElementById(`${sectionId}-section`).classList.add('active');
            
            // Load section content
            loadSectionContent(sectionId);
            
            // Close mobile menu if open
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
                const overlay = document.querySelector('.mobile-overlay');
                if (overlay) overlay.remove();
            }
        });
    });
}

// Initialize theme toggle
function initThemeToggle() {
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            // Switch to light mode
            body.classList.remove('dark-mode');
            this.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('diu-theme', 'light');
            
            // Update chart colors for light mode
            if (progressChart) {
                updateChartTheme('light');
            }
        } else {
            // Switch to dark mode
            body.classList.add('dark-mode');
            this.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('diu-theme', 'dark');
            
            // Update chart colors for dark mode
            if (progressChart) {
                updateChartTheme('dark');
            }
        }
    });
}

// Initialize mobile menu
function initMobileMenu() {
    mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        
        // Add overlay when menu is open
        if (sidebar.classList.contains('active')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-overlay active';
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                this.remove();
            });
            document.body.appendChild(overlay);
        } else {
            const overlay = document.querySelector('.mobile-overlay');
            if (overlay) overlay.remove();
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            const overlay = document.querySelector('.mobile-overlay');
            if (overlay) overlay.remove();
        }
    });
}

// Load content for different sections
function loadSectionContent(sectionId) {
    const sectionElement = document.getElementById(`${sectionId}-section`);
    
    // Clear existing content (except for dashboard which is already loaded)
    if (sectionId !== 'dashboard') {
        sectionElement.innerHTML = '';
    }
    
    // Load content based on section
    switch(sectionId) {
        case 'courses':
            loadCoursesContent(sectionElement);
            break;
        case 'schedule':
            loadScheduleContent(sectionElement);
            break;
        case 'results':
            loadResultsContent(sectionElement);
            break;
        case 'attendance':
            loadAttendanceContent(sectionElement);
            break;
        case 'finance':
            loadFinanceContent(sectionElement);
            break;
        case 'library':
            loadLibraryContent(sectionElement);
            break;
        case 'resources':
            loadResourcesContent(sectionElement);
            break;
        case 'settings':
            loadSettingsContent(sectionElement);
            break;
        case 'dashboard':
            // Initialize dashboard chart
            setTimeout(() => {
                initProgressChart();
            }, 100);
            break;
    }
}

// Load courses content
function loadCoursesContent(sectionElement) {
    sectionElement.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-book"></i> My Courses</h2>
            <p>Current semester courses and details</p>
        </div>
        
        <div class="content-card full-width">
            <div class="courses-filter">
                <button class="filter-btn active" data-filter="current">Current Semester</button>
                <button class="filter-btn" data-filter="previous">Previous</button>
                <button class="filter-btn" data-filter="upcoming">Upcoming</button>
            </div>
            
            <div class="courses-grid" id="courses-container">
                <!-- Courses will be loaded here -->
            </div>
        </div>
    `;
    
    // Initialize courses
    setTimeout(() => {
        const coursesData = [
            { code: "CSE-101", name: "Data Structures & Algorithms", credits: 3, instructor: "Dr. Ahmed Hossain", time: "Mon, Wed 10:00 AM", progress: 85 },
            { code: "CSE-203", name: "Database Management System", credits: 3, instructor: "Prof. Fatima Begum", time: "Tue, Thu 12:00 PM", progress: 70 },
            { code: "CSE-305", name: "Web Technologies", credits: 3, instructor: "Dr. Karim Ahmed", time: "Mon, Wed 2:00 PM", progress: 65 },
            { code: "MAT-201", name: "Discrete Mathematics", credits: 3, instructor: "Dr. Rahman Khan", time: "Sun, Tue 11:00 AM", progress: 90 },
            { code: "ENG-101", name: "Technical Writing", credits: 2, instructor: "Ms. Sabrina Chowdhury", time: "Wed 3:00 PM", progress: 80 },
            { code: "CSE-299", name: "Software Engineering", credits: 3, instructor: "Dr. Nasir Uddin", time: "Thu 9:00 AM", progress: 75 }
        ];
        
        const coursesContainer = document.getElementById('courses-container');
        coursesContainer.innerHTML = coursesData.map(course => `
            <div class="course-card">
                <div class="course-header">
                    <h4>${course.code}</h4>
                    <span class="course-credits">${course.credits} Credits</span>
                </div>
                <h3 class="course-name">${course.name}</h3>
                <div class="course-instructor">
                    <i class="fas fa-user"></i> ${course.instructor}
                </div>
                <div class="course-time">
                    <i class="fas fa-clock"></i> ${course.time}
                </div>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <span class="progress-text">${course.progress}% Complete</span>
                </div>
                <button class="course-btn" onclick="viewCourseDetails('${course.code}')">
                    <i class="fas fa-external-link-alt"></i> View Details
                </button>
            </div>
        `).join('');
        
        // Initialize filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // In a real app, this would filter courses
                alert(`Filtering by: ${this.dataset.filter} (simulated)`);
            });
        });
    }, 100);
}

// Load schedule content
function loadScheduleContent(sectionElement) {
    sectionElement.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-calendar-alt"></i> Class Schedule</h2>
            <p>Weekly class schedule and timetable</p>
        </div>
        
        <div class="content-card full-width">
            <div class="schedule-controls">
                <button class="schedule-btn" id="prev-week"><i class="fas fa-chevron-left"></i> Previous Week</button>
                <h3 id="current-week">Week of December 18, 2023</h3>
                <button class="schedule-btn" id="next-week">Next Week <i class="fas fa-chevron-right"></i></button>
            </div>
            
            <div class="schedule-table">
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Monday</th>
                            <th>Tuesday</th>
                            <th>Wednesday</th>
                            <th>Thursday</th>
                            <th>Friday</th>
                        </tr>
                    </thead>
                    <tbody id="schedule-body">
                        <!-- Schedule will be loaded here -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Initialize schedule
    setTimeout(() => {
        document.getElementById('schedule-body').innerHTML = `
            <tr>
                <td class="time-slot">9:00 - 10:30</td>
                <td></td>
                <td class="has-class" data-course="CSE-299">Software Engineering<br>Room: 401</td>
                <td></td>
                <td class="has-class" data-course="CSE-299">Software Engineering<br>Room: 401</td>
                <td></td>
            </tr>
            <tr>
                <td class="time-slot">10:30 - 12:00</td>
                <td class="has-class" data-course="CSE-101">Data Structures<br>Room: 502</td>
                <td class="has-class" data-course="MAT-201">Discrete Math<br>Room: 305</td>
                <td class="has-class" data-course="CSE-101">Data Structures<br>Room: 502</td>
                <td class="has-class" data-course="MAT-201">Discrete Math<br>Room: 305</td>
                <td></td>
            </tr>
            <tr>
                <td class="time-slot">12:00 - 1:30</td>
                <td></td>
                <td class="has-class" data-course="CSE-203">Database System<br>Room: 305</td>
                <td></td>
                <td class="has-class" data-course="CSE-203">Database System<br>Room: 305</td>
                <td class="has-class" data-course="ENG-101">Technical Writing<br>Room: 201</td>
            </tr>
            <tr>
                <td class="time-slot">2:00 - 3:30</td>
                <td class="has-class" data-course="CSE-305">Web Technologies<br>Room: 701</td>
                <td></td>
                <td class="has-class" data-course="CSE-305">Web Technologies<br>Room: 701</td>
                <td></td>
                <td></td>
            </tr>
        `;
        
        // Add click handlers for schedule navigation
        document.getElementById('prev-week').addEventListener('click', () => {
            document.getElementById('current-week').textContent = 'Week of December 11, 2023';
            alert("Loaded previous week's schedule");
        });
        
        document.getElementById('next-week').addEventListener('click', () => {
            document.getElementById('current-week').textContent = 'Week of December 25, 2023';
            alert("Loaded next week's schedule");
        });
        
        // Add click handlers for class cells
        document.querySelectorAll('.has-class').forEach(cell => {
            cell.addEventListener('click', function() {
                const course = this.getAttribute('data-course');
                alert(`Showing details for ${course}`);
            });
        });
    }, 100);
}

// Load results content
function loadResultsContent(sectionElement) {
    sectionElement.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-chart-line"></i> Academic Results</h2>
            <p>View your semester results and GPA</p>
        </div>
        
        <div class="content-row">
            <div class="content-card">
                <h3><i class="fas fa-graduation-cap"></i> CGPA Overview</h3>
                <div class="cgpa-display">
                    <div class="cgpa-circle">
                        <div class="cgpa-value">3.75</div>
                        <div class="cgpa-label">Current CGPA</div>
                    </div>
                    <div class="cgpa-details">
                        <div class="detail-item">
                            <span>Credit Completed</span>
                            <span class="detail-value">98</span>
                        </div>
                        <div class="detail-item">
                            <span>Credit Remaining</span>
                            <span class="detail-value">34</span>
                        </div>
                        <div class="detail-item">
                            <span>Current Semester GPA</span>
                            <span class="detail-value">3.82</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="content-card">
                <h3><i class="fas fa-medal"></i> Academic Standing</h3>
                <div class="standing-info">
                    <div class="standing-item">
                        <i class="fas fa-trophy standing-icon"></i>
                        <div>
                            <h4>Dean's List</h4>
                            <p>Last 3 Semesters</p>
                        </div>
                    </div>
                    <div class="standing-item">
                        <i class="fas fa-award standing-icon"></i>
                        <div>
                            <h4>Scholarship</h4>
                            <p>25% Tuition Waiver</p>
                        </div>
                    </div>
                    <div class="standing-item">
                        <i class="fas fa-chart-bar standing-icon"></i>
                        <div>
                            <h4>Class Rank</h4>
                            <p>Top 15%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="content-card full-width">
            <h3><i class="fas fa-list-ol"></i> Semester Results</h3>
            <div class="results-table">
                <table>
                    <thead>
                        <tr>
                            <th>Semester</th>
                            <th>GPA</th>
                            <th>Credits</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Summer 2023</td>
                            <td>3.82</td>
                            <td>18</td>
                            <td><span class="status-completed">Completed</span></td>
                            <td><button class="view-btn" onclick="viewSemesterResults('Summer 2023')">View</button></td>
                        </tr>
                        <tr>
                            <td>Spring 2023</td>
                            <td>3.68</td>
                            <td>15</td>
                            <td><span class="status-completed">Completed</span></td>
                            <td><button class="view-btn" onclick="viewSemesterResults('Spring 2023')">View</button></td>
                        </tr>
                        <tr>
                            <td>Fall 2022</td>
                            <td>3.75</td>
                            <td>16</td>
                            <td><span class="status-completed">Completed</span></td>
                            <td><button class="view-btn" onclick="viewSemesterResults('Fall 2022')">View</button></td>
                        </tr>
                        <tr>
                            <td>Summer 2022</td>
                            <td>3.80</td>
                            <td>17</td>
                            <td><span class="status-completed">Completed</span></td>
                            <td><button class="view-btn" onclick="viewSemesterResults('Summer 2022')">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Load attendance content
function loadAttendanceContent(sectionElement) {
    sectionElement.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-clipboard-check"></i> Attendance</h2>
            <p>Track your class attendance records</p>
        </div>
        
        <div class="attendance-summary">
            <div class="attendance-card">
                <h3>Overall Attendance</h3>
                <div class="attendance-percentage">92%</div>
                <p>Across all courses</p>
                <div class="attendance-details">
                    <div class="detail-box">
                        <div class="detail-value">42</div>
                        <div class="detail-label">Present</div>
                    </div>
                    <div class="detail-box">
                        <div class="detail-value">4</div>
                        <div class="detail-label">Absent</div>
                    </div>
                </div>
            </div>
            
            <div class="attendance-card">
                <h3>This Month</h3>
                <div class="attendance-percentage" style="color: var(--accent-color);">96%</div>
                <p>December 2023</p>
                <div class="attendance-details">
                    <div class="detail-box">
                        <div class="detail-value">24</div>
                        <div class="detail-label">Present</div>
                    </div>
                    <div class="detail-box">
                        <div class="detail-value">1</div>
                        <div class="detail-label">Absent</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="content-card full-width">
            <h3><i class="fas fa-calendar-check"></i> Attendance by Course</h3>
            <div class="results-table">
                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Percentage</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Data Structures & Algorithms</td>
                            <td>28</td>
                            <td>2</td>
                            <td>93%</td>
                            <td><span class="status-completed">Good</span></td>
                        </tr>
                        <tr>
                            <td>Database Management System</td>
                            <td>26</td>
                            <td>4</td>
                            <td>87%</td>
                            <td><span style="background: rgba(245, 166, 35, 0.1); color: var(--warning-color); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">Warning</span></td>
                        </tr>
                        <tr>
                            <td>Web Technologies</td>
                            <td>30</td>
                            <td>0</td>
                            <td>100%</td>
                            <td><span class="status-completed">Excellent</span></td>
                        </tr>
                        <tr>
                            <td>Discrete Mathematics</td>
                            <td>29</td>
                            <td>1</td>
                            <td>97%</td>
                            <td><span class="status-completed">Good</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Load finance content
function loadFinanceContent(sectionElement) {
    sectionElement.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-money-check-alt"></i> Finance</h2>
            <p>View tuition fees and payment history</p>
        </div>
        
        <div class="finance-summary">
            <div class="content-card">
                <h3><i class="fas fa-wallet"></i> Financial Summary</h3>
                <div class="cgpa-details">
                    <div class="detail-item">
                        <span>Total Due</span>
                        <span class="detail-value">৳ 15,000</span>
                    </div>
                    <div class="detail-item">
                        <span>Paid This Semester</span>
                        <span class="detail-value">৳ 85,000</span>
                    </div>
                    <div class="detail-item">
                        <span>Scholarship</span>
                        <span class="detail-value">৳ 25,000</span>
                    </div>
                    <div class="detail-item">
                        <span>Next Due Date</span>
                        <span class="detail-value">Jan 15, 2024</span>
                    </div>
                </div>
            </div>
            
            <div class="content-card">
                <h3><i class="fas fa-credit-card"></i> Quick Actions</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                    <button class="payment-btn" style="width: 100%;">
                        <i class="fas fa-money-bill-wave"></i> Pay Dues Online
                    </button>
                    <button class="payment-btn" style="background: var(--secondary-color); width: 100%;">
                        <i class="fas fa-file-invoice"></i> Download Invoice
                    </button>
                    <button class="payment-btn" style="background: var(--warning-color); width: 100%;">
                        <i class="fas fa-history"></i> Payment History
                    </button>
                </div>
            </div>
        </div>
        
        <div class="content-card full-width">
            <h3><i class="fas fa-file-invoice-dollar"></i> Pending Invoices</h3>
            <div class="invoice-list">
                <div class="invoice-item">
                    <div class="invoice-details">
                        <h4>Tuition Fee - Fall 2023</h4>
                        <p>Due Date: Dec 30, 2023</p>
                    </div>
                    <div class="invoice-amount">৳ 10,000</div>
                    <button class="payment-btn">Pay Now</button>
                </div>
                <div class="invoice-item">
                    <div class="invoice-details">
                        <h4>Lab Fee - CSE Department</h4>
                        <p>Due Date: Jan 5, 2024</p>
                    </div>
                    <div class="invoice-amount">৳ 5,000</div>
                    <button class="payment-btn">Pay Now</button>
                </div>
            </div>
        </div>
    `;
}

// Load library content
function loadLibraryContent(sectionElement) {
    sectionElement.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-book-reader"></i> Library</h2>
            <p>Access library resources and borrowed books</p>
        </div>
        
        <div class="content-card full-width">
            <div class="book-search">
                <div class="search-box">
                    <input type="text" placeholder="Search books, journals, articles..." id="book-search-input">
                    <button onclick="searchBooks()">
                        <i class="fas fa-search"></i> Search
                    </button>
                </div>
            </div>
            
            <div class="content-row">
                <div class="content-card">
                    <h3><i class="fas fa-book"></i> Currently Borrowed</h3>
                    <div class="courses-grid" style="grid-template-columns: 1fr;">
                        <div class="course-card">
                            <div class="course-header">
                                <h4>ISBN: 978-0134685991</h4>
                                <span class="course-credits">Due: Jan 15</span>
                            </div>
                            <h3 class="course-name">Effective Java</h3>
                            <div class="course-instructor">
                                <i class="fas fa-user"></i> Joshua Bloch
                            </div>
                            <div class="course-time">
                                <i class="fas fa-calendar"></i> Borrowed: Dec 1, 2023
                            </div>
                            <button class="course-btn">
                                <i class="fas fa-sync-alt"></i> Renew
                            </button>
                        </div>
                        
                        <div class="course-card">
                            <div class="course-header">
                                <h4>ISBN: 978-0262033848</h4>
                                <span class="course-credits">Due: Jan 10</span>
                            </div>
                            <h3 class="course-name">Introduction to Algorithms</h3>
                            <div class="course-instructor">
                                <i class="fas fa-user"></i> Cormen, Leiserson, et al.
                            </div>
                            <div class="course-time">
                                <i class="fas fa-calendar"></i> Borrowed: Dec 5, 2023
                            </div>
                            <button class="course-btn">
                                <i class="fas fa-sync-alt"></i> Renew
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="content-card">
                    <h3><i class="fas fa-chart-line"></i> Library Stats</h3>
                    <div class="cgpa-details">
                        <div class="detail-item">
                            <span>Books Borrowed</span>
                            <span class="detail-value">24</span>
                        </div>
                        <div class="detail-item">
                            <span>Current Loans</span>
                            <span class="detail-value">2</span>
                        </div>
                        <div class="detail-item">
                            <span>Overdue Books</span>
                            <span class="detail-value">0</span>
                        </div>
                        <div class="detail-item">
                            <span>Library Fine</span>
                            <span class="detail-value">৳ 0</span>
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem;">
                        <h4>Digital Resources</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-top: 1rem;">
                            <button class="filter-btn" style="justify-content: flex-start;">
                                <i class="fas fa-newspaper"></i> E-Journals
                            </button>
                            <button class="filter-btn" style="justify-content: flex-start;">
                                <i class="fas fa-database"></i> Research Databases
                            </button>
                            <button class="filter-btn" style="justify-content: flex-start;">
                                <i class="fas fa-theater-masks"></i> Thesis Repository
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load resources content
function loadResourcesContent(sectionElement) {
    sectionElement.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-folder-open"></i> Resources</h2>
            <p>Course materials and study resources</p>
        </div>
        
        <div class="content-card full-width">
            <div class="courses-filter">
                <button class="filter-btn active" data-filter="all">All Courses</button>
                <button class="filter-btn" data-filter="cse">CSE</button>
                <button class="filter-btn" data-filter="mat">Mathematics</button>
                <button class="filter-btn" data-filter="eng">English</button>
            </div>
            
            <div class="courses-grid" id="resources-container">
                <!-- Resources will be loaded here -->
            </div>
        </div>
    `;
    
    // Initialize resources
    setTimeout(() => {
        const resourcesData = [
            { course: "CSE-101", title: "Data Structures Lecture Slides", type: "pdf", size: "4.2 MB", date: "Nov 15, 2023" },
            { course: "CSE-203", title: "Database Lab Assignment", type: "doc", size: "2.1 MB", date: "Nov 20, 2023" },
            { course: "CSE-305", title: "Web Development Project Guidelines", type: "pdf", size: "3.5 MB", date: "Nov 25, 2023" },
            { course: "MAT-201", title: "Discrete Math Practice Problems", type: "pdf", size: "1.8 MB", date: "Nov 10, 2023" },
            { course: "ENG-101", title: "Technical Writing Template", type: "doc", size: "0.8 MB", date: "Nov 5, 2023" },
            { course: "CSE-299", title: "Software Engineering Case Study", type: "pdf", size: "5.2 MB", date: "Nov 30, 2023" }
        ];
        
        const resourcesContainer = document.getElementById('resources-container');
        resourcesContainer.innerHTML = resourcesData.map(resource => `
            <div class="course-card">
                <div class="course-header">
                    <h4>${resource.course}</h4>
                    <span class="course-credits">${resource.type.toUpperCase()}</span>
                </div>
                <h3 class="course-name">${resource.title}</h3>
                <div class="course-instructor">
                    <i class="fas fa-file"></i> Size: ${resource.size}
                </div>
                <div class="course-time">
                    <i class="fas fa-calendar"></i> Uploaded: ${resource.date}
                </div>
                <button class="course-btn" onclick="downloadResource('${resource.title}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        `).join('');
        
        // Initialize filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter resources by course category
                const filter = this.dataset.filter;
                if (filter === 'all') {
                    document.querySelectorAll('.course-card').forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    document.querySelectorAll('.course-card').forEach(card => {
                        const courseCode = card.querySelector('h4').textContent;
                        if (courseCode.includes(filter.toUpperCase())) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }, 100);
}

// Load settings content
function loadSettingsContent(sectionElement) {
    sectionElement.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-cog"></i> Settings</h2>
            <p>Manage your account and preferences</p>
        </div>
        
        <div class="settings-container">
            <div class="setting-group">
                <h3><i class="fas fa-user-cog"></i> Account Settings</h3>
                <div class="setting-item">
                    <div>
                        <h4>Email Notifications</h4>
                        <p>Receive updates via email</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div>
                        <h4>SMS Notifications</h4>
                        <p>Receive updates via SMS</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div>
                        <h4>Two-Factor Authentication</h4>
                        <p>Extra security for your account</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="setting-group">
                <h3><i class="fas fa-bell"></i> Notification Preferences</h3>
                <div class="setting-item">
                    <div>
                        <h4>Assignment Deadlines</h4>
                        <p>Get reminders for assignments</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div>
                        <h4>Class Schedule Changes</h4>
                        <p>Notify about schedule updates</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div>
                        <h4>Exam Notifications</h4>
                        <p>Get exam updates and reminders</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="setting-group">
                <h3><i class="fas fa-palette"></i> Display Settings</h3>
                <div class="setting-item">
                    <div>
                        <h4>Dark Mode</h4>
                        <p>Toggle dark/light theme</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="dark-mode-toggle" ${body.classList.contains('dark-mode') ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div>
                        <h4>Font Size</h4>
                        <p>Adjust text size</p>
                    </div>
                    <select style="padding: 0.5rem; border-radius: 6px; background: var(--card-bg); color: var(--dark-text); border: 1px solid var(--border-color);">
                        <option>Small</option>
                        <option selected>Medium</option>
                        <option>Large</option>
                    </select>
                </div>
            </div>
            
            <div class="setting-group">
                <h3><i class="fas fa-shield-alt"></i> Privacy & Security</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <button class="course-btn" style="background: var(--secondary-color);">
                        <i class="fas fa-key"></i> Change Password
                    </button>
                    <button class="course-btn" style="background: var(--warning-color);">
                        <i class="fas fa-history"></i> Login Activity
                    </button>
                    <button class="course-btn" style="background: var(--danger-color);">
                        <i class="fas fa-trash-alt"></i> Delete Account
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Initialize dark mode toggle in settings
    setTimeout(() => {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', function() {
                if (this.checked) {
                    body.classList.add('dark-mode');
                    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                    localStorage.setItem('diu-theme', 'dark');
                } else {
                    body.classList.remove('dark-mode');
                    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                    localStorage.setItem('diu-theme', 'light');
                }
            });
        }
        
        // Initialize other toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', function() {
                const settingName = this.closest('.setting-item').querySelector('h4').textContent;
                const status = this.checked ? 'enabled' : 'disabled';
                console.log(`${settingName}: ${status}`);
            });
        });
    }, 100);
}

// Initialize progress chart
function initProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    // Destroy previous chart if exists
    if (progressChart) {
        progressChart.destroy();
    }
    
    const isDarkMode = body.classList.contains('dark-mode');
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDarkMode ? '#E0E0E0' : '#2C3E50';
    
    progressChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'CGPA Trend',
                data: [3.5, 3.6, 3.65, 3.7, 3.72, 3.68, 3.7, 3.73, 3.75, 3.77, 3.75, 3.75],
                borderColor: '#4A90E2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 3.0,
                    max: 4.0,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: textColor
                    }
                }
            }
        }
    });
}

// Update chart theme
function updateChartTheme(theme) {
    if (!progressChart) return;
    
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = theme === 'dark' ? '#E0E0E0' : '#2C3E50';
    
    progressChart.options.scales.x.ticks.color = textColor;
    progressChart.options.scales.y.ticks.color = textColor;
    progressChart.options.scales.y.grid.color = gridColor;
    progressChart.options.plugins.legend.labels.color = textColor;
    
    progressChart.update();
}

// Initialize logout functionality
function initLogout() {
    logoutBtn.addEventListener('click', function() {
        if (confirm("Are you sure you want to logout?")) {
            // Show logout animation
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            // Simulate logout process
            setTimeout(() => {
                alert("Successfully logged out! In a real application, this would redirect to login page.");
                // window.location.href = "/login";
            }, 1000);
        }
    });
}

// Utility functions for actions
function viewCourseDetails(courseCode) {
    alert(`Viewing details for ${courseCode}`);
}

function viewSemesterResults(semester) {
    alert(`Showing detailed results for ${semester}`);
}

function searchBooks() {
    const query = document.getElementById('book-search-input')?.value || '';
    if (query.trim()) {
        alert(`Searching for: "${query}" (simulated search)`);
    } else {
        alert("Please enter a search term");
    }
}

function downloadResource(resourceName) {
    alert(`Downloading: ${resourceName} (simulated download)`);
}

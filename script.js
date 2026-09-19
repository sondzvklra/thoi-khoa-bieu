/**
 * Timetable — THCS Yên Phúc
 * Professional Education Schedule System
 * Multi-view: All Classes, Per Class (Weekly), Per Teacher (Weekly)
 * High-Contrast Harmonious Subject Colors
 */

// ============================================
// STATE
// ============================================

const state = {
    viewMode: 'all',          // 'all' | 'class' | 'teacher'
    selectedDay: 2,           // 2 = Thứ 2, ..., 6 = Thứ 6
    selectedClass: '6A01',
    selectedTeacher: '',
    selectedSession: 'all',   // 'all' | 'morning' | 'afternoon'
    searchTerm: '',
    theme: localStorage.getItem('tkb_theme') || 'light',
    legendExpanded: false
};

// ============================================
// CONSTANTS & SUBJECT METADATA
// ============================================

const DAY_NAMES = {
    2: 'Thứ 2',
    3: 'Thứ 3',
    4: 'Thứ 4',
    5: 'Thứ 5',
    6: 'Thứ 6'
};

const SESSION_LABELS = {
    morning: 'Buổi sáng',
    afternoon: 'Buổi chiều',
    all: 'Cả ngày'
};

const PERIOD_TIMES_MORNING = {
    1: { start: '07:00', end: '07:45' },
    2: { start: '07:50', end: '08:35' },
    3: { start: '08:50', end: '09:35' },
    4: { start: '09:40', end: '10:25' },
    5: { start: '10:30', end: '11:15' }
};

const PERIOD_TIMES_AFTERNOON = {
    1: { start: '13:30', end: '14:15' },
    2: { start: '14:20', end: '15:05' },
    3: { start: '15:20', end: '16:05' },
    4: { start: '16:10', end: '16:55' },
    5: { start: '17:00', end: '17:45' }
};

// Danh mục môn học phục vụ bảng chú giải (Legend) và gán màu
const SUBJECT_DEFINITIONS = [
    { key: 'TOAN', name: 'Toán học' },
    { key: 'VAN', name: 'Ngữ văn' },
    { key: 'TIẾNG ANH', name: 'Tiếng Anh' },
    { key: 'KHTN', name: 'KHTN (Lý/Hóa/Sinh)' },
    { key: 'SU', name: 'Lịch sử' },
    { key: 'DIA', name: 'Địa lý' },
    { key: 'TIN', name: 'Tin học' },
    { key: 'CN', name: 'Công nghệ' },
    { key: 'TD', name: 'Thể dục' },
    { key: 'MT', name: 'Mỹ thuật' },
    { key: 'NHAC', name: 'Âm nhạc' },
    { key: 'GDCD', name: 'GDCD' },
    { key: 'TrNg', name: 'HĐTN / Trải nghiệm' },
    { key: 'GDDP', name: 'GD Địa phương' },
    { key: 'CHÀO CỜ', name: 'Chào cờ' },
    { key: 'SH', name: 'Sinh hoạt lớp' }
];

// Inline SVG Icons
const ICONS = {
    calendar: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    search: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(state.theme);
    detectCurrentDay();
    initializeDateDisplay();
    populateSelectOptions();
    renderDayTabs();
    renderSubjectLegend();
    setupEventListeners();
    renderCurrentView();

    // Start auto-refresh for current period highlight
    setInterval(updateCurrentPeriodHighlight, 60000);
});

function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tkb_theme', theme);

    const sunIcon = document.querySelector('#themeToggle .icon-sun');
    const moonIcon = document.querySelector('#themeToggle .icon-moon');
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

function detectCurrentDay() {
    const today = new Date();
    const jsDay = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const dayMap = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
    state.selectedDay = dayMap[jsDay] || 2;
}

function initializeDateDisplay() {
    const today = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    const dateStr = today.toLocaleDateString('vi-VN', dateOptions);
    const el = document.getElementById('currentDate');
    if (el) el.textContent = dateStr;

    if (scheduleData && scheduleData.classes) {
        document.documentElement.style.setProperty('--class-count', scheduleData.classes.length);
    }
}

// Trích xuất toàn bộ danh sách giáo viên từ scheduleData
function getAllTeachers() {
    const teacherSet = new Set();
    if (!scheduleData || !scheduleData.schedule) return [];

    Object.values(scheduleData.schedule).forEach(dayObj => {
        ['morning', 'afternoon'].forEach(session => {
            const periods = dayObj[session] || [];
            periods.forEach(p => {
                scheduleData.classes.forEach(c => {
                    const text = p[c];
                    if (text && text.includes(' - ')) {
                        const dashIdx = text.indexOf(' - ');
                        const teacher = text.substring(dashIdx + 3).trim();
                        if (teacher) teacherSet.add(teacher);
                    }
                });
            });
        });
    });

    return Array.from(teacherSet).sort((a, b) => a.localeCompare(b, 'vi'));
}

function populateSelectOptions() {
    // Populate Classes
    const classSelect = document.getElementById('classSelect');
    if (classSelect && scheduleData.classes) {
        classSelect.innerHTML = '';
        scheduleData.classes.forEach(cls => {
            const opt = document.createElement('option');
            opt.value = cls;
            opt.textContent = `Lớp ${cls}`;
            classSelect.appendChild(opt);
        });
        state.selectedClass = scheduleData.classes[0];
    }

    // Populate Teachers
    const teacherSelect = document.getElementById('teacherSelect');
    if (teacherSelect) {
        teacherSelect.innerHTML = '';
        const teachers = getAllTeachers();
        teachers.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = `GV ${t}`;
            teacherSelect.appendChild(opt);
        });
        if (teachers.length > 0) {
            state.selectedTeacher = teachers[0];
        }
    }
}

// ============================================
// DAY TABS
// ============================================

function renderDayTabs() {
    const container = document.getElementById('dayTabs');
    if (!container) return;

    const today = new Date();
    const jsDay = today.getDay();
    const dayMap = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
    const todayNum = dayMap[jsDay] || null;

    container.innerHTML = '';
    Object.keys(DAY_NAMES).forEach(dayNum => {
        const num = parseInt(dayNum);
        const btn = document.createElement('button');
        btn.className = 'day-tab';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', num === state.selectedDay ? 'true' : 'false');
        btn.setAttribute('data-day', num);

        if (num === todayNum) {
            btn.classList.add('is-today');
        }

        btn.innerHTML = `<span>${DAY_NAMES[num]}</span>`;
        btn.addEventListener('click', () => {
            state.selectedDay = num;
            updateDayTabStates();
            renderCurrentView();
        });

        container.appendChild(btn);
    });
}

function updateDayTabStates() {
    const tabs = document.querySelectorAll('.day-tab');
    tabs.forEach(tab => {
        const d = parseInt(tab.getAttribute('data-day'));
        tab.setAttribute('aria-selected', d === state.selectedDay ? 'true' : 'false');
    });
}

// ============================================
// SUBJECT COLOR LEGEND
// ============================================

function renderSubjectLegend() {
    const container = document.getElementById('legendItems');
    if (!container) return;

    container.innerHTML = '';
    SUBJECT_DEFINITIONS.forEach(subj => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.setAttribute('data-color', subj.key);
        item.innerHTML = `<span class="legend-dot"></span><span>${subj.name}</span>`;
        item.title = `Xem môn ${subj.name}`;
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = subj.key;
                state.searchTerm = subj.key.toLowerCase();
                document.getElementById('searchClear').style.display = 'flex';
                renderCurrentView();
            }
        });
        container.appendChild(item);
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Mode Switcher (All / Class / Teacher)
    document.querySelectorAll('.view-mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.view-mode-tab').forEach(t => {
                t.classList.remove('is-active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');

            state.viewMode = tab.getAttribute('data-mode');
            handleViewModeChange();
        });
    });

    // Class Select
    const classSelect = document.getElementById('classSelect');
    if (classSelect) {
        classSelect.addEventListener('change', (e) => {
            state.selectedClass = e.target.value;
            renderCurrentView();
        });
    }

    // Teacher Select
    const teacherSelect = document.getElementById('teacherSelect');
    if (teacherSelect) {
        teacherSelect.addEventListener('change', (e) => {
            state.selectedTeacher = e.target.value;
            renderCurrentView();
        });
    }

    // Session Select
    const sessionSelect = document.getElementById('sessionSelect');
    if (sessionSelect) {
        sessionSelect.addEventListener('change', (e) => {
            state.selectedSession = e.target.value;
            renderCurrentView();
        });
    }

    // Search Input
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    if (searchInput && searchClear) {
        searchInput.addEventListener('input', (e) => {
            state.searchTerm = e.target.value.toLowerCase().trim();
            searchClear.style.display = state.searchTerm ? 'flex' : 'none';
            renderCurrentView();
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            state.searchTerm = '';
            searchClear.style.display = 'none';
            renderCurrentView();
        });
    }

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    // Print Button
    const printBtn = document.getElementById('btnPrint');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Today Button
    const todayBtn = document.getElementById('btnToday');
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            detectCurrentDay();
            updateDayTabStates();
            renderCurrentView();
        });
    }

    // Modal Close
    const modal = document.getElementById('detailModal');
    const closeBtn = document.querySelector('.modal-close');
    const backdrop = document.querySelector('.modal-backdrop');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    // Legend Toggle
    const legendToggle = document.getElementById('legendToggle');
    const legendItems = document.getElementById('legendItems');
    if (legendToggle && legendItems) {
        legendToggle.addEventListener('click', () => {
            state.legendExpanded = !state.legendExpanded;
            legendToggle.setAttribute('aria-expanded', state.legendExpanded);
            legendItems.style.display = state.legendExpanded ? 'none' : 'flex';
            legendToggle.querySelector('span').textContent = state.legendExpanded ? 'Hiện' : 'Ẩn';
        });
    }
}

function handleViewModeChange() {
    const dayTabsBar = document.getElementById('dayTabsBar');
    const groupSession = document.getElementById('controlGroupSession');
    const groupClass = document.getElementById('controlGroupClass');
    const groupTeacher = document.getElementById('controlGroupTeacher');

    if (state.viewMode === 'all') {
        if (dayTabsBar) dayTabsBar.style.display = 'block';
        if (groupSession) groupSession.style.display = 'flex';
        if (groupClass) groupClass.style.display = 'none';
        if (groupTeacher) groupTeacher.style.display = 'none';
    } else if (state.viewMode === 'class') {
        if (dayTabsBar) dayTabsBar.style.display = 'none';
        if (groupSession) groupSession.style.display = 'none';
        if (groupClass) groupClass.style.display = 'flex';
        if (groupTeacher) groupTeacher.style.display = 'none';
    } else if (state.viewMode === 'teacher') {
        if (dayTabsBar) dayTabsBar.style.display = 'none';
        if (groupSession) groupSession.style.display = 'none';
        if (groupClass) groupClass.style.display = 'none';
        if (groupTeacher) groupTeacher.style.display = 'flex';
    }

    renderCurrentView();
}

// ============================================
// MAIN RENDERING ROUTER
// ============================================

function renderCurrentView() {
    if (state.viewMode === 'all') {
        renderAllClassesSchedule();
    } else if (state.viewMode === 'class') {
        renderClassWeeklySchedule();
    } else if (state.viewMode === 'teacher') {
        renderTeacherWeeklySchedule();
    }
}

// --------------------------------------------
// VIEW 1: TOÀN TRƯỜNG (THEO NGÀY)
// --------------------------------------------

function renderAllClassesSchedule() {
    const content = document.getElementById('scheduleContent');
    const dayNum = state.selectedDay;

    if (!scheduleData.schedule[dayNum]) {
        showEmptyState(content, 'calendar', 'Không có lịch học', 'Ngày này không có dữ liệu thời khóa biểu');
        return;
    }

    const scheduleData_obj = scheduleData.schedule[dayNum];
    const fragment = document.createDocumentFragment();
    let hasContent = false;

    const currentPeriod = isToday() ? getCurrentPeriod() : null;

    if (state.selectedSession === 'all' || state.selectedSession === 'morning') {
        const morningEl = renderSessionGrid('morning', scheduleData_obj.morning, currentPeriod);
        if (morningEl) {
            fragment.appendChild(morningEl);
            hasContent = true;
        }
    }

    if (state.selectedSession === 'all' || state.selectedSession === 'afternoon') {
        const afternoonEl = renderSessionGrid('afternoon', scheduleData_obj.afternoon, currentPeriod);
        if (afternoonEl) {
            fragment.appendChild(afternoonEl);
            hasContent = true;
        }
    }

    if (!hasContent) {
        showEmptyState(content, 'search', 'Không tìm thấy kết quả', 'Vui lòng thử từ khóa khác');
    } else {
        content.innerHTML = '';
        content.appendChild(fragment);
        setupSubjectClickHandlers();
    }
}

function renderSessionGrid(session, periods, currentPeriod) {
    if (!periods || periods.length === 0) return null;

    // Filter check
    const hasMatch = periods.some(period =>
        scheduleData.classes.some(className => {
            const subjectText = period[className] || '';
            if (!subjectText) return false;
            if (state.searchTerm && !subjectText.toLowerCase().includes(state.searchTerm)) return false;
            return true;
        })
    );
    if (!hasMatch) return null;

    const sessionBlock = document.createElement('div');
    sessionBlock.className = 'session-block';

    const sessionHeader = document.createElement('div');
    sessionHeader.className = 'session-header';
    sessionHeader.innerHTML = `
        <h3 class="session-title">
            <span>${session === 'morning' ? '☀️' : '🌤️'}</span>
            <span>${SESSION_LABELS[session]}</span>
        </h3>
        <div class="session-divider"></div>
    `;
    sessionBlock.appendChild(sessionHeader);

    const gridContainer = document.createElement('div');
    gridContainer.className = 'schedule-grid';

    const grid = document.createElement('div');
    grid.className = 'grid';

    // Header Row
    const headerRow = document.createElement('div');
    headerRow.className = 'grid-header-row';
    headerRow.innerHTML = `<div class="grid-cell-header">Tiết</div>`;
    scheduleData.classes.forEach(c => {
        headerRow.innerHTML += `<div class="grid-cell-header">${c}</div>`;
    });
    grid.appendChild(headerRow);

    // Rows
    periods.forEach(p => {
        const row = document.createElement('div');
        row.className = 'grid-row';
        if (currentPeriod && currentPeriod.session === session && currentPeriod.period === p.period) {
            row.classList.add('is-current-period');
        }

        // Period Cell
        const periodTimes = (session === 'morning' ? PERIOD_TIMES_MORNING : PERIOD_TIMES_AFTERNOON)[p.period] || { start: '', end: '' };
        const periodCell = document.createElement('div');
        periodCell.className = 'grid-cell-period';
        periodCell.innerHTML = `
            <span class="period-number">Tiết ${p.period}</span>
            <span class="period-time">${periodTimes.start}</span>
        `;
        row.appendChild(periodCell);

        // Class Cells
        scheduleData.classes.forEach(className => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell-subject';
            const subjectText = p[className] || '';

            if (state.searchTerm && !subjectText.toLowerCase().includes(state.searchTerm)) {
                row.appendChild(cell);
                return;
            }

            if (subjectText) {
                renderCellContent(cell, subjectText, className);
            }
            row.appendChild(cell);
        });

        grid.appendChild(row);
    });

    gridContainer.appendChild(grid);
    sessionBlock.appendChild(gridContainer);
    return sessionBlock;
}

// --------------------------------------------
// VIEW 2: THEO LỚP HỌC (LỊCH TUẦN 5 NGÀY)
// --------------------------------------------

function renderClassWeeklySchedule() {
    const content = document.getElementById('scheduleContent');
    const selectedClass = state.selectedClass;

    const wrapper = document.createElement('div');
    wrapper.className = 'session-block';

    const header = document.createElement('div');
    header.className = 'session-header';
    header.innerHTML = `
        <h3 class="session-title">
            <span>📚 Thời khóa biểu tuần — Lớp <strong>${selectedClass}</strong></span>
        </h3>
        <div class="session-divider"></div>
    `;
    wrapper.appendChild(header);

    const gridContainer = document.createElement('div');
    gridContainer.className = 'weekly-schedule-grid';

    // Header Row: Tiết | Thứ 2 | Thứ 3 | Thứ 4 | Thứ 5 | Thứ 6
    const today = new Date();
    const jsDay = today.getDay();
    const dayMap = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
    const todayNum = dayMap[jsDay] || null;

    const gridHeader = document.createElement('div');
    gridHeader.className = 'weekly-grid-header';
    gridHeader.innerHTML = `<div class="grid-cell-header">Tiết</div>`;

    [2, 3, 4, 5, 6].forEach(d => {
        const isCur = d === todayNum ? 'is-today' : '';
        gridHeader.innerHTML += `<div class="weekly-day-header ${isCur}">${DAY_NAMES[d]}</div>`;
    });
    gridContainer.appendChild(gridHeader);

    // Morning Periods (1 - 5)
    for (let period = 1; period <= 5; period++) {
        const row = document.createElement('div');
        row.className = 'weekly-grid-row';

        const pTime = PERIOD_TIMES_MORNING[period];
        row.innerHTML = `
            <div class="grid-cell-period">
                <span class="period-number">S${period}</span>
                <span class="period-time">${pTime.start}</span>
            </div>
        `;

        [2, 3, 4, 5, 6].forEach(d => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell-subject';

            const dayData = scheduleData.schedule[d];
            const morningPeriods = dayData ? dayData.morning : [];
            const periodObj = morningPeriods ? morningPeriods.find(item => item.period === period) : null;
            const subjectText = periodObj ? (periodObj[selectedClass] || '') : '';

            if (subjectText) {
                renderCellContent(cell, subjectText, selectedClass, DAY_NAMES[d]);
            }
            row.appendChild(cell);
        });

        gridContainer.appendChild(row);
    }

    // Afternoon Periods (1 - 5)
    for (let period = 1; period <= 5; period++) {
        const row = document.createElement('div');
        row.className = 'weekly-grid-row';

        const pTime = PERIOD_TIMES_AFTERNOON[period];
        row.innerHTML = `
            <div class="grid-cell-period" style="background: var(--c-surface-hover);">
                <span class="period-number">C${period}</span>
                <span class="period-time">${pTime.start}</span>
            </div>
        `;

        [2, 3, 4, 5, 6].forEach(d => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell-subject';

            const dayData = scheduleData.schedule[d];
            const afternoonPeriods = dayData ? dayData.afternoon : [];
            const periodObj = afternoonPeriods ? afternoonPeriods.find(item => item.period === period) : null;
            const subjectText = periodObj ? (periodObj[selectedClass] || '') : '';

            if (subjectText) {
                renderCellContent(cell, subjectText, selectedClass, DAY_NAMES[d]);
            }
            row.appendChild(cell);
        });

        gridContainer.appendChild(row);
    }

    wrapper.appendChild(gridContainer);
    content.innerHTML = '';
    content.appendChild(wrapper);
    setupSubjectClickHandlers();
}

// --------------------------------------------
// VIEW 3: THEO GIÁO VIÊN (LỊCH DẠY CẢ TUẦN)
// --------------------------------------------

function renderTeacherWeeklySchedule() {
    const content = document.getElementById('scheduleContent');
    const teacher = state.selectedTeacher;

    if (!teacher) {
        showEmptyState(content, 'search', 'Chưa chọn giáo viên', 'Vui lòng chọn giáo viên từ danh sách');
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'session-block';

    const header = document.createElement('div');
    header.className = 'session-header';
    header.innerHTML = `
        <h3 class="session-title">
            <span>👨‍🏫 Lịch giảng dạy tuần — Giáo viên <strong>${teacher}</strong></span>
        </h3>
        <div class="session-divider"></div>
    `;
    wrapper.appendChild(header);

    const gridContainer = document.createElement('div');
    gridContainer.className = 'weekly-schedule-grid';

    const today = new Date();
    const jsDay = today.getDay();
    const dayMap = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
    const todayNum = dayMap[jsDay] || null;

    const gridHeader = document.createElement('div');
    gridHeader.className = 'weekly-grid-header';
    gridHeader.innerHTML = `<div class="grid-cell-header">Tiết</div>`;

    [2, 3, 4, 5, 6].forEach(d => {
        const isCur = d === todayNum ? 'is-today' : '';
        gridHeader.innerHTML += `<div class="weekly-day-header ${isCur}">${DAY_NAMES[d]}</div>`;
    });
    gridContainer.appendChild(gridHeader);

    // Morning Periods
    for (let period = 1; period <= 5; period++) {
        const row = document.createElement('div');
        row.className = 'weekly-grid-row';
        const pTime = PERIOD_TIMES_MORNING[period];
        row.innerHTML = `
            <div class="grid-cell-period">
                <span class="period-number">S${period}</span>
                <span class="period-time">${pTime.start}</span>
            </div>
        `;

        [2, 3, 4, 5, 6].forEach(d => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell-subject';

            const dayData = scheduleData.schedule[d];
            const morningPeriods = dayData ? dayData.morning : [];
            const periodObj = morningPeriods ? morningPeriods.find(item => item.period === period) : null;

            if (periodObj) {
                // Find if teacher teaches any class in this period
                scheduleData.classes.forEach(c => {
                    const text = periodObj[c] || '';
                    if (text.includes(` - ${teacher}`) || text.endsWith(`-${teacher}`)) {
                        renderCellContent(cell, text, c, DAY_NAMES[d]);
                    }
                });
            }
            row.appendChild(cell);
        });

        gridContainer.appendChild(row);
    }

    // Afternoon Periods
    for (let period = 1; period <= 5; period++) {
        const row = document.createElement('div');
        row.className = 'weekly-grid-row';
        const pTime = PERIOD_TIMES_AFTERNOON[period];
        row.innerHTML = `
            <div class="grid-cell-period" style="background: var(--c-surface-hover);">
                <span class="period-number">C${period}</span>
                <span class="period-time">${pTime.start}</span>
            </div>
        `;

        [2, 3, 4, 5, 6].forEach(d => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell-subject';

            const dayData = scheduleData.schedule[d];
            const afternoonPeriods = dayData ? dayData.afternoon : [];
            const periodObj = afternoonPeriods ? afternoonPeriods.find(item => item.period === period) : null;

            if (periodObj) {
                scheduleData.classes.forEach(c => {
                    const text = periodObj[c] || '';
                    if (text.includes(` - ${teacher}`) || text.endsWith(`-${teacher}`)) {
                        renderCellContent(cell, text, c, DAY_NAMES[d]);
                    }
                });
            }
            row.appendChild(cell);
        });

        gridContainer.appendChild(row);
    }

    wrapper.appendChild(gridContainer);
    content.innerHTML = '';
    content.appendChild(wrapper);
    setupSubjectClickHandlers();
}

// --------------------------------------------
// CELL RENDERING HELPER
// --------------------------------------------

function renderCellContent(cell, subjectText, className, dayLabel) {
    cell.setAttribute('data-subject', subjectText);
    cell.setAttribute('data-class', className);
    if (dayLabel) cell.setAttribute('data-day', dayLabel);
    cell.setAttribute('tabindex', '0');

    const colorKey = getSubjectColorKey(subjectText);
    if (colorKey) {
        cell.setAttribute('data-color', colorKey);
    }

    const dashIndex = subjectText.indexOf(' - ');
    const subjectName = dashIndex >= 0 ? subjectText.substring(0, dashIndex).trim() : subjectText.trim();
    const teacherName = dashIndex >= 0 ? subjectText.substring(dashIndex + 3).trim() : '';

    cell.innerHTML = `
        <span class="subj-name">${subjectName}</span>
        ${teacherName ? `<span class="subj-teacher">${teacherName}</span>` : ''}
    `;
}

// ============================================
// SUBJECT COLOR IDENTIFICATION (PRECISE)
// ============================================

function getSubjectColorKey(subjectText) {
    if (!subjectText) return null;

    const dashIndex = subjectText.indexOf(' - ');
    const subjectPart = (dashIndex >= 0 ? subjectText.substring(0, dashIndex) : subjectText).trim();

    // Check TrNg (case-sensitive)
    if (subjectPart.includes('TrNg')) return 'TrNg';

    const upper = subjectPart.toUpperCase();

    // Priority multi-word or compound
    if (upper.includes('CHÀO CỜ')) return 'CHÀO CỜ';
    if (upper.includes('TIẾNG ANH')) return 'TIẾNG ANH';
    if (upper.includes('GDDP')) return 'GDDP';
    if (upper.includes('GDCD')) return 'GDCD';
    if (upper.includes('KHTN')) return 'KHTN';
    if (upper.includes('NHAC')) return 'NHAC';
    if (upper.includes('TOAN')) return 'TOAN';

    // Exact or prefix matches
    if (upper.startsWith('VAN')) return 'VAN';
    if (upper.startsWith('TIN')) return 'TIN';
    if (upper.startsWith('DIA')) return 'DIA';
    if (upper.startsWith('TD')) return 'TD';
    if (upper.startsWith('MT')) return 'MT';
    if (upper.startsWith('CN')) return 'CN';
    if (upper.startsWith('SH')) return 'SH';
    if (upper.startsWith('BD')) return 'BD';

    if (/^SU\b/.test(upper) || upper.startsWith('SU ')) return 'SU';

    return null;
}

// ============================================
// REAL-TIME PERIOD HIGHLIGHT
// ============================================

function getCurrentPeriod() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Morning check
    for (const [period, times] of Object.entries(PERIOD_TIMES_MORNING)) {
        const [startH, startM] = times.start.split(':').map(Number);
        const [endH, endM] = times.end.split(':').map(Number);
        if (currentTime >= (startH * 60 + startM) && currentTime <= (endH * 60 + endM)) {
            return { period: parseInt(period), session: 'morning' };
        }
    }

    // Afternoon check
    for (const [period, times] of Object.entries(PERIOD_TIMES_AFTERNOON)) {
        const [startH, startM] = times.start.split(':').map(Number);
        const [endH, endM] = times.end.split(':').map(Number);
        if (currentTime >= (startH * 60 + startM) && currentTime <= (endH * 60 + endM)) {
            return { period: parseInt(period), session: 'afternoon' };
        }
    }

    return null;
}

function isToday() {
    const today = new Date();
    const jsDay = today.getDay();
    const dayMap = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
    return dayMap[jsDay] === state.selectedDay;
}

function updateCurrentPeriodHighlight() {
    if (state.viewMode === 'all') {
        const currentPeriod = isToday() ? getCurrentPeriod() : null;
        document.querySelectorAll('.grid-row').forEach(row => {
            row.classList.remove('is-current-period');
        });
        if (currentPeriod) {
            // Re-render or highlight rows
            renderCurrentView();
        }
    }
}

// ============================================
// MODAL DETAILS
// ============================================

function setupSubjectClickHandlers() {
    document.querySelectorAll('[data-subject]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            showSubjectDetail(
                el.getAttribute('data-subject'),
                el.getAttribute('data-class'),
                el.getAttribute('data-day')
            );
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showSubjectDetail(
                    el.getAttribute('data-subject'),
                    el.getAttribute('data-class'),
                    el.getAttribute('data-day')
                );
            }
        });
    });
}

function showSubjectDetail(subjectText, className, dayLabel) {
    const dashIndex = subjectText.indexOf(' - ');
    const subjectName = dashIndex >= 0 ? subjectText.substring(0, dashIndex).trim() : subjectText.trim();
    const teacherName = dashIndex >= 0 ? subjectText.substring(dashIndex + 3).trim() : null;
    const colorKey = getSubjectColorKey(subjectText) || 'default';

    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const dayName = dayLabel || DAY_NAMES[state.selectedDay];

    modalBody.innerHTML = `
        <div class="detail-card">
            <span class="detail-subject-badge" data-color="${colorKey}">${subjectName}</span>
            <h2 class="detail-subject-name" id="modalTitle">${subjectName}</h2>

            <div class="detail-row">
                <span class="detail-label">Lớp học</span>
                <span class="detail-value">${className || state.selectedClass || 'Toàn khối'}</span>
            </div>

            ${teacherName ? `
            <div class="detail-row">
                <span class="detail-label">Giáo viên giảng dạy</span>
                <span class="detail-value">Thầy/Cô ${teacherName}</span>
            </div>` : ''}

            <div class="detail-row">
                <span class="detail-label">Ngày học</span>
                <span class="detail-value">${dayName}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Học kỳ</span>
                <span class="detail-value">Học kỳ 1 (2026 - 2027)</span>
            </div>
        </div>
    `;

    modal.setAttribute('aria-hidden', 'false');
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.setAttribute('aria-hidden', 'true');
}

// ============================================
// EMPTY STATE
// ============================================

function showEmptyState(container, iconType, heading, description) {
    const iconSvg = iconType === 'search' ? ICONS.search : ICONS.calendar;
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">${iconSvg}</div>
            <h3 class="empty-heading">${heading}</h3>
            <p class="empty-desc">${description}</p>
        </div>
    `;
}

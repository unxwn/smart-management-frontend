function renderCalendar(year = null, month = null) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const calendarEl = document.getElementById('calendar');
    const today = new Date();
    let currentMonth = month !== null ? month : today.getMonth();
    let currentYear = year !== null ? year : today.getFullYear();

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const startingDayAdjusted = startingDay === 0 ? 6 : startingDay - 1;

    let calendarHTML = `
        <div class="calendar-header">
            <button class="calendar-nav" onclick="renderCalendar(${currentYear}, ${currentMonth - 1})"><i class="fas fa-chevron-left"></i></button>
            <span class="month-name">${new Date(currentYear, currentMonth).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })}</span>
            <button class="calendar-nav" onclick="renderCalendar(${currentYear}, ${currentMonth + 1})"><i class="fas fa-chevron-right"></i></button>
        </div>
        <table class="mini-calendar">
            <thead>
                <tr>
                    <th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Нд</th>
                </tr>
            </thead>
            <tbody>
                <tr>
    `;

    for (let i = 0; i < startingDayAdjusted; i++) {
        calendarHTML += '<td></td>';
    }

    let dayCount = 1;
    for (let i = startingDayAdjusted; i < 42; i++) {
        if (dayCount > daysInMonth) break;

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;
        const hasAppointments = appointments.some(a => a.date === dateStr);
        const isToday = dayCount === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

        calendarHTML += `
            <td class="${isToday ? 'today' : ''} ${hasAppointments ? 'has-appointment' : ''}">
                <div class="day-number">${dayCount}</div>
                ${hasAppointments ? '<div class="appointment-dot"></div>' : ''}
            </td>
        `;

        dayCount++;
        if (i % 7 === 6) {
            calendarHTML += '</tr><tr>';
        }
    }

    calendarHTML += '</tr></tbody></table>';
    calendarEl.innerHTML = calendarHTML;

    document.querySelectorAll('.mini-calendar td').forEach(dayCell => {
        dayCell.addEventListener('click', function () {
            const day = this.querySelector('.day-number')?.textContent;
            if (day) {
                const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
                document.querySelector('.nav-links li[data-tab="appointments"]').click();
                document.getElementById('appointment-filter-date').value = selectedDate;
                renderAppointments(selectedDate);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', renderCalendar);
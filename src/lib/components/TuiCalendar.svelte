<script>
    import {onMount, onDestroy} from 'svelte';
    import 'tui-calendar/dist/tui-calendar.css';
    import Calendar from 'tui-calendar';
    import calendars from "../utils/CalendarPattern.js";
    import fetchEventsByMonth from "../utils/Api.js";

    let calendar;
    let viewMode = 'month';
    let isCurrentWeek = true;
    let currentDate = new Date();
    let year = currentDate.getFullYear(); // Get current year
    let month = currentDate.getMonth() + 1; // Get current month (0-11)


    calendar = new Calendar('#calendar', {
        defaultView: viewMode,
        taskView: false,
        useDetailPopup: true,
        isReadOnly: true,
        template: {
            monthDayname: day => `<span class="calendar-week-dayname">${day.label}</span>`,
        },
        calendars: calendars(),
    });

    // Fetch month event data from API


    // Load Events
    onMount(async () => {
        loadEvents(year, month);
    });

    onDestroy(() => {
        calendar.destroy();
    });

    function loadEvents(year, month) {
        fetchEventsByMonth(year, month)
            .then(monthlyEvents => {
                if (calendar) {
                    calendar.clear(); // Clear existing events
                    monthlyEvents.forEach(function (event) {
                        let body = '';

                        if (event.URL) {
                            body = "<a href='+ event.URL + ' target='_href'>eCentennial Link</a>"
                        }

                        calendar.createSchedules([
                            {
                                id: event._id,
                                calendarId: event.Type,
                                title: event.Subject,
                                category: 'time',
                                dueDateClass: '',
                                start: event.FromDate,
                                end: event.ToDate,
                                location: event.Location,
                                body: body
                            }
                        ]);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }

    function isViewingCurrentWeek() {
        const currentDate = new Date();
        const calendarDate = calendar.getDate();
        return (
            currentDate.getFullYear() === calendarDate.getFullYear() &&
            currentDate.getMonth() === calendarDate.getMonth() &&
            currentDate.getDate() === calendarDate.getDate()
        );
    }

    function prevMonth() {
        calendar.prev();
        if (viewMode === 'month') {
            if (month === 1) {
                month = 12;
                year -= 1;
            } else {
                month -= 1;
            }
        }

        loadEvents(year, month);
        isCurrentWeek = isViewingCurrentWeek();
    }

    function nextMonth() {
        calendar.next();
        if (viewMode == 'month') {
            if (month === 12) {
                month = 1;
                year += 1;
            } else {
                month += 1;
            }
        }
        loadEvents(year, month);
        isCurrentWeek = isViewingCurrentWeek();
    }

    function switchView() {
        viewMode = viewMode === 'month' ? 'day' : 'month';
        calendar.changeView(viewMode, true);
    }

    function goToCurrentMonth() {
        isCurrentWeek = true;
        calendar.today();
    }
</script>

<div class="button-wrapper">
    <button on:click={switchView}>Switch View</button>
    <button on:click={prevMonth}>&lt;</button>
    <button>{month}, {year}</button>
    <button on:click={nextMonth}>&gt;</button>
</div>


{#if !isCurrentWeek}
    <button on:click={goToCurrentMonth}>Go to Current Month</button>
{/if}

<div id="calendar"></div>

<style>
    @import "../../styles/pages/calendar.scss";
</style>
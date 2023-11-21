<script>
    import {onDestroy, onMount} from 'svelte';
    import 'tui-calendar/dist/tui-calendar.css';
    import Calendar from 'tui-calendar';
    import calendars from "../utils/CalendarPattern.js";
    import fetchEventsByMonth from "../utils/Api.js";
    import {Img, Button, Dropdown, DropdownItem} from 'flowbite-svelte';

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
                            body = "<a href='"+ event.URL + "' target='_href'>eCentennial Link</a>"
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

    function switchView(mode) {
        //viewMode = viewMode === 'month' ? 'day' : 'month';
        switch(mode) {
            case "week":
                viewMode = "week";
                break;
            case "day":
                viewMode = "day";
                break;
            default:
                viewMode = "month";
                break;
        }
        calendar.changeView(viewMode, true);
    }

    function goToCurrentMonth() {
        isCurrentWeek = true;
        calendar.today();
    }

</script>
<div class="flex-container">
    <div class="button-cal-wrapper">
        <a href="https://www.centennialcollege.ca/" target="_blank"><Img src="src/assets/logo.jpeg" width="120" 
        height="40" alt="logo" /></a>
        <div><p>eCentennial Calendar</p></div>
        <div class="viewmode">
            <Button>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</Button>
            <Dropdown>
                {#if viewMode!="day"}
                <DropdownItem on:click={() => switchView("day")} class="viewmodeitem">Day</DropdownItem>
                {/if}
                {#if viewMode!="week"}
                <DropdownItem on:click={() => switchView("week")} class="viewmodeitem">Week</DropdownItem>
                {/if}
                {#if viewMode!="month"}
                <DropdownItem on:click={() => switchView("month")} class="viewmodeitem">Month</DropdownItem>
                {/if}
            </Dropdown>
        </div>

        <button on:click={prevMonth}>&lt;</button>
        <button>{month}, {year}</button>
        <button on:click={nextMonth}>&gt;</button>
        {#if !isCurrentWeek}
            <button on:click={goToCurrentMonth}>Go to Current Month</button>
        {/if}
    </div>
    <div class="button-tool-wrapper">
        <a href='./help' target='_blank'><button>Help</button></a>
        <Img src="src/assets/user.png" width="60" height="40" alt="logo" />
        <div>Sophia Laxman</div>
    </div>
</div>



<div id="calendar"></div>

<style>
    @import "../../styles/pages/calendar.scss";
</style>
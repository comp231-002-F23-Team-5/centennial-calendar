<script>
    import {onMount} from 'svelte';
    import Calendar from 'tui-calendar';

    import 'tui-calendar/dist/tui-calendar.css';

    let calendar;
    let viewMode = 'month';
    let isCurrentWeek = true;

    onMount(async () => {
        let eventDataRaw = await fetch('http://localhost:3000/api/events/2023/10/');
        let eventData = await eventDataRaw.json();

        let schedules = Array.from(eventData).map(event => ({
            id: event._id,
            title: event.Subject,
            isAllDay: false,
            start: event.FromDate,
            end: event.ToDate,
            category: 'time',
            location: event.Location,
            raw: {
                type: event.Type
            },
            state: 'Busy'
        }));

        calendar = new Calendar('#calendar', {
            defaultView: viewMode,
            taskView: false,
            template: {
                monthDayname: day => `<span class="calendar-week-dayname">${day.label}</span>`,
            },
        });

        calendar.createSchedules(schedules);

        calendar.on('clickSchedule', event => {
            console.log(event.schedule);
        });
    });

    function isViewingCurrentWeek() {
        const currentDate = new Date();
        const calendarDate = calendar.getDate();

        return currentDate.getFullYear() === calendarDate.getFullYear() &&
            currentDate.getMonth() === calendarDate.getMonth() &&
            currentDate.getDate() === calendarDate.getDate();
    }

    function prevWeek() {
        calendar.prev();
        isCurrentWeek = isViewingCurrentWeek();
    }

    function nextWeek() {
        calendar.next();
        isCurrentWeek = isViewingCurrentWeek();
    }

    function switchView() {
        viewMode = viewMode === 'month' ? 'day' : 'month';
        calendar.changeView(viewMode, true);
    }

    function goToCurrentWeek() {
        isCurrentWeek = true;
        calendar.today();
    }
</script>

<button on:click={switchView}>Switch View</button>
<button on:click={prevWeek}>&lt;</button>
<button on:click={nextWeek}>&gt;</button>

{#if !isCurrentWeek}
    <button on:click={goToCurrentWeek}>Go to Current Week</button>
{/if}

<div id="calendar"></div>

<style>
    @import "../../styles/pages/calendar.scss";
</style>
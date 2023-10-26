<script>
    import {onMount} from 'svelte';
    import 'tui-calendar/dist/tui-calendar.css';
    import Calendar from 'tui-calendar';

    let calendar;
    let viewMode = 'month';
    let isCurrentWeek = true;

    onMount(() => {
        calendar = new Calendar('#calendar', {
            defaultView: viewMode,
            taskView: false,
            template: {
                monthDayname: day => `<span class="calendar-week-dayname">${day.label}</span>`,
            },
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
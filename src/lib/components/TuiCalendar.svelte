<script>
    import { onMount, onDestroy } from 'svelte';
    import 'tui-calendar/dist/tui-calendar.css';
    import Calendar from 'tui-calendar';


    let calendar;
    let viewMode = 'month';
    let isCurrentWeek = true;
    let currentDate = new Date();
    let year = currentDate.getFullYear(); // Get current year
    let month = currentDate.getMonth() + 1; // Get current month (0-11)

    const calendars = [
    {
      id: "Class",
      name: "Class",
      color: "#ffffff",
      bgColor: "#32cf4c",
      dragBgColor: "#32cf4c",
      borderColor: "#32cf4c"
    },
    {
      id: "Assignment",
      name: "Quiz",
      color: "#ffffff",
      bgColor: "#6067f0",
      dragBgColor: "#6067f0",
      borderColor: "#6067f0"
    },
    {
      id: "Quiz",
      name: "Assignment",
      color: "#ffffff",
      bgColor: "#d42fb5",
      dragBgColor: "#d42fb5",
      borderColor: "#d42fb5"
    }
  ];

    calendar = new Calendar('#calendar', {
            defaultView: viewMode,
            taskView: false,
            useDetailPopup: true,
            isReadOnly: true,
            template: {
                monthDayname: day => `<span class="calendar-week-dayname">${day.label}</span>`,
            },
            calendars: calendars,
        });
    
    // Fetch month event data from API
    async function fetchEventsByMonth(year, month) {
      const response = await fetch(`http://localhost:3000/api/events/${year}/${month}`);
      const data = await response.json();
      console.log(data);
      return data;
    }

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
          monthlyEvents.forEach(event => {
            if (event.URL){
              var body = "<a href='+ event.URL + ' target='_href'>eCentennial Link</a>"
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
    if(viewMode == 'month'){
        if (month === 1) {
            month = 12;
            year -= 1;
        } else {
            month -= 1;
        }
    };
    loadEvents(year, month);
    isCurrentWeek = isViewingCurrentWeek();
  }

  function nextMonth() {
    calendar.next();
    if(viewMode == 'month'){
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

<button on:click={switchView}>Switch View</button>
<button on:click={prevMonth}>&lt;</button>
<button>{month}, {year}</button>
<button on:click={nextMonth}>&gt;</button>

{#if !isCurrentWeek}
  <button on:click={goToCurrentMonth}>Go to Current Month</button>
{/if}

<div id="calendar"></div>

<style>
  @import "../../styles/pages/calendar.scss";
</style>
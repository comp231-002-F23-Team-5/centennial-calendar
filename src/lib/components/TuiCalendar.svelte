<script>
    import {onDestroy, onMount} from 'svelte';
    import 'tui-calendar/dist/tui-calendar.css';
    import Calendar from 'tui-calendar';
    import calendars from "../utils/CalendarPattern.js";
    import fetchEventsByMonth from "../utils/Api.js";
    import {Img, Button, Dropdown, DropdownItem} from 'flowbite-svelte';
    import { Sun, CloudMoon, PatchQuestionFill, Fonts, PersonCircle } from "svelte-bootstrap-icons";

    let calendar;
    let viewMode = 'month';
    let isCurrentWeek = true;
    let currentDate = new Date();
    let year = currentDate.getFullYear(); // Get current year
    let month = currentDate.getMonth() + 1; // Get current month (0-11)
    let current_theme = "light";
    let current_fontsize = "s";
    let showAssignment = true;
    let showQuiz = true;
    let showClass = true;
    let currentDateRange;

    calendar = new Calendar('#calendar', {
        defaultView: viewMode,
        taskView: false,
        useDetailPopup: true,
        isReadOnly: true,
        template: {
            monthDayname: day => `<span class="calendar-week-dayname">${day.label}</span>`
        },
        calendars: calendars(),
    });
    
    
    // Fetch month event data from API


    // Load Events
    onMount(async () => {
  
        //load events
        loadEvents(year, month, showAssignment, showQuiz, showClass);
        getCurrentDateRange();
        //set theme & font from saved cookie / window settings
        //theme
        const savedTheme = getCookie("theme");
        if (savedTheme) {
            current_theme = savedTheme;
        }else{
            const preference_is_dark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
            current_theme = preference_is_dark ? "dark" : "light";
        }
        set_theme(current_theme); // TODO
        //font size
        const savedFontsize = getCookie("fontsize");
        if (savedFontsize) {
            current_fontsize = savedFontsize;
        }
        set_fontsize(current_fontsize); // TODO
    });
    function changeCalBgColor(theme){
        if(theme === "light"){
                document.querySelector('.tui-full-calendar-layout')["style"].backgroundColor = 'white';
                calendar.setTheme({'week.timegridLeft.backgroundColor': 'white', 
                'month.moreView.backgroundColor': 'white',});
            } else {
                document.querySelector('.tui-full-calendar-layout')["style"].backgroundColor = '#8b8a8a';
                calendar.setTheme({'week.timegridLeft.backgroundColor': 'rgba(0,0,0,0.1)','month.moreView.backgroundColor':'#d4d2d2'});
        }
        
    }
    onDestroy(() => {
        calendar.destroy();
    });
    $: loadEvents(year, month, showAssignment, showQuiz, showClass);
    function loadEvents(year, month, showAssignment, showQuiz, showClass) {
        fetchEventsByMonth(year, month)
            .then(monthlyEvents => {
                if (calendar) {
                    calendar.clear(); // Clear existing events
                    monthlyEvents.forEach(function (event) {
                        let body = '';

                        if (event.URL) {
                            body = "<a href='"+ event.URL + "' target='_href'>eCentennial Link</a>"
                        }

                        const calendarId = event.Type.toLowerCase();
                        if (
                            (calendarId === 'assignment' && showAssignment) ||
                            (calendarId === 'quiz' && showQuiz) ||
                            (calendarId === 'class' && showClass)
                        ) {
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
                                    isAllDay: event.isAllDay,
                                    body: body,
                                }
                            ]);
                        }  
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

    function prevRange() {
        calendar.prev();
        const date = new Date(calendar.getDate());
        year = date.getFullYear();
        month = date.getMonth() + 1;
        loadEvents(year, month, showAssignment, showQuiz, showClass);
        isCurrentWeek = isViewingCurrentWeek();
        getCurrentDateRange();
    }

    function nextRange() {
        calendar.next();
        const date = new Date(calendar.getDate());
        year = date.getFullYear();
        month = date.getMonth() + 1;
        loadEvents(year, month, showAssignment, showQuiz, showClass);
        isCurrentWeek = isViewingCurrentWeek();
        getCurrentDateRange();
    }

    function switchView(mode) {
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
        getCurrentDateRange();
    }

    function goToCurrentMonth() {
        isCurrentWeek = true;
        year = currentDate.getFullYear(); // Get current year
        month = currentDate.getMonth() + 1; // Get current month (0-11)
        calendar.today();
    }

    function toggle_theme(){
        const theme = current_theme === "light" ? "dark" : "light";
        set_theme(theme);
    }
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function set_theme(theme) {
        current_theme = theme;
        const one_year = 60 * 60 * 24 * 365;
        document.cookie = `theme=${theme}; max-age=${one_year}; path=/`;
        // set page
        document.documentElement.setAttribute("data-theme", theme);
        changeCalBgColor(theme);
    }
    function set_fontsize(size){
        current_fontsize = size;
        const one_year = 60 * 60 * 24 * 365;
        document.cookie = `fontsize=${size}; max-age=${one_year}; path=/`;
        // set page
        document.documentElement.setAttribute("fontsize", size);
        // set calendar
        const fontSizeMap = {
            's': '16px',
            'm': '20px',
            'l': '24px',
        };

        const updatedTheme = {
            'month.day.fontSize': fontSizeMap[size],
            'month.dayname.fontSize': fontSizeMap[size],
            'week.currentTime.fontSize': fontSizeMap[size]
        };

        calendar.setTheme(updatedTheme);
    }

    function getCurrentDateRange(){
        var str;
        if (viewMode == "day"){
            str = convertDateStr(calendar.getDate());
        }else{
            str = convertDateStr(calendar.getDateRangeStart()) + " - " + convertDateStr(calendar.getDateRangeEnd());
        }
        currentDateRange = str;
    }

    function convertDateStr(tz_date){
        const date = new Date(tz_date);
        return date.toLocaleDateString('en-US')
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

        <button on:click={prevRange} data-action="move-prev">&lt;</button>
        <div class="monthDisplay">{currentDateRange}</div>
        <button on:click={nextRange} data-action="move-next">&gt;</button>
        {#if !isCurrentWeek}
            <button on:click={goToCurrentMonth}>Go to Current {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</button>
        {/if}
    </div>
    <div class="button-tool-wrapper">
        {#if current_theme=="dark"}
        <button on:click={toggle_theme}><Sun color="white" width={26} height={26} /></button>
        <button on:click={() => set_fontsize("s")}><Fonts color="white" width={18} height={18} /></button>
        <button on:click={() => set_fontsize("m")}><Fonts color="white" width={22} height={22} /></button>
        <button on:click={() => set_fontsize("l")}><Fonts color="white" width={28} height={28} /></button>
        <button><a href='./help' target='_blank'><PatchQuestionFill color= "rgb(190, 193, 255)" width={26} height={26}/></a></button>
        <PersonCircle color="white" width="60" height="40" />
        {:else}
        <button on:click={toggle_theme}><CloudMoon width={26} height={26} /></button>
        <button on:click={() => set_fontsize("s")}><Fonts width={18} height={18} /></button>
        <button on:click={() => set_fontsize("m")}><Fonts width={22} height={22} /></button>
        <button on:click={() => set_fontsize("l")}><Fonts width={28} height={28} /></button>
        <button><a href='./help' target='_blank'><PatchQuestionFill width={26} height={26}/></a></button>
        <PersonCircle width="60" height="40" />
        {/if}
        
        <div>Sophia Laxman</div>
    </div>
</div>


<div class="checkboxes">
    <label>
        <input type="checkbox" id="cb_assignment" bind:checked={showAssignment}>
        Assignment
    </label>
    <label>
        <input type="checkbox" id="cb_quiz" bind:checked={showQuiz}>
        Quiz
    </label>
    <label>
        <input type="checkbox" id="cb_class" bind:checked={showClass}>
        Class
    </label>
</div>

<div id="calendar"></div>

<style>
    @import "../../styles/pages/calendar.scss";
</style>
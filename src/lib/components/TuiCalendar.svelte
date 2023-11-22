<script>
    import {onDestroy, onMount} from 'svelte';
    import 'tui-calendar/dist/tui-calendar.css';
    import Calendar from 'tui-calendar';
    import calendars from "../utils/CalendarPattern.js";
    import fetchEventsByMonth from "../utils/Api.js";
    import {Img, Button, Dropdown, DropdownItem} from 'flowbite-svelte';
    import { Sun, CloudMoon, PatchQuestionFill, Fonts } from "svelte-bootstrap-icons";
    
    /*export const handle = async ({ event, resolve }) => {
        //get theme from cookie
        const theme = event.cookies.get("theme");
        if (!theme) {
            return await resolve(event);
        }
    };*/

    let calendar;
    let viewMode = 'month';
    let isCurrentWeek = true;
    let currentDate = new Date();
    let year = currentDate.getFullYear(); // Get current year
    let month = currentDate.getMonth() + 1; // Get current month (0-11)
    let current_theme = "light";
    let current_fontsize = "m";
    let showAssignment = true;
    let showQuiz = true;
    let showClass = true;
    console.log(calendars())
    calendar = new Calendar('#calendar', {
        defaultView: viewMode,
        taskView: false,
        useDetailPopup: true,
        isReadOnly: true,
        template: {
            monthDayname: day => `<span class="calendar-week-dayname">${day.label}</span>`
        },
        calendars: calendars(),
        theme : {'common.backgroundColor': 'light'},//set the background color first
    });
    
    
    // Fetch month event data from API


    // Load Events
    onMount(async () => {
  
        //load events
        loadEvents(year, month, showAssignment, showQuiz, showClass);

        //set theme & font from saved cookie / window settings
        //theme
        const savedTheme = getCookie("theme");
        if (savedTheme) {
            current_theme = savedTheme;
            console.log("saved theme:"+current_theme);
        }else{
            const preference_is_dark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
            current_theme = preference_is_dark ? "dark" : "light";
        }
        set_theme(current_theme); // TODO
        console.log(current_theme)

        //font size
        const savedFontsize = getCookie("fontsize");
        if (savedFontsize) {
            current_fontsize = savedFontsize;
            console.log("saved fontsize:"+savedFontsize);
        }
        set_fontsize(current_fontsize); // TODO
        console.log(current_fontsize)
    });

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
                                    calendarId: calendarId,
                                    title: event.Subject,
                                    category: 'time',
                                    dueDateClass: '',
                                    start: event.FromDate,
                                    end: event.ToDate,
                                    location: event.Location,
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
        console.log("set theme:"+theme)
        current_theme = theme;
        const one_year = 60 * 60 * 24 * 365;
        document.cookie = `theme=${theme}; max-age=${one_year}; path=/`;
        // set page
        document.documentElement.setAttribute("data-theme", theme);
        // set calendar
        // refer: https://github.com/nhn/tui.calendar/blob/main/docs/en/apis/theme.md
        const themeMap = {
            'background-dark': '#a9a9a9',
            'font-dark': 'white',
            'border-dark': '24px',
            'background-light': 'white',
            'font-light': 'black',
            'border-light': '24px',
        };
        calendar.setTheme({
            //'common.backgroundColor': themeMap['background-'+theme],
            'week.timegridLeft.backgroundColor': themeMap['background-'+theme],
            'month.moreView.backgroundColor': 'black',
            'common.backgroundColor': themeMap['background-'+theme]
            },
        );
    }
    function set_fontsize(size){
        console.log("set fontsize:"+size);
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
            's_time': '12px',
            'm_time': '14px',
            'l_time': '16px',
        };

        const updatedTheme = {
            'month.day.fontSize': fontSizeMap[size],
            'month.dayname.fontSize': fontSizeMap[size],
            'month.schedule.fontSize': fontSizeMap[size],
            'week.dayname.fontSize': fontSizeMap[size],
            'week.timegridLeft.fontSize': fontSizeMap[size+"_time"],
            'week.currentTime.fontSize': fontSizeMap[size+"_time"],
        };

        calendar.setTheme(updatedTheme);
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
        {#if current_theme=="dark"}
        <button on:click={toggle_theme}><Sun width={26} height={26} /></button>
        {:else}
        <button on:click={toggle_theme}><CloudMoon width={26} height={26} /></button>
        {/if}
        <button on:click={() => set_fontsize("s")}><Fonts width={18} height={18} /></button>
        <button on:click={() => set_fontsize("m")}><Fonts width={22} height={22} /></button>
        <button on:click={() => set_fontsize("l")}><Fonts width={28} height={28} /></button>
        <button><a href='./help' target='_blank'><PatchQuestionFill width={26} height={26}/></a></button>
        <Img src="src/assets/user.png" width="60" height="40" alt="logo" />
        <div>Sophia Laxman</div>
    </div>
</div>



<div id="calendar"></div>
<div class="checkboxes">
    <label>
        <input type="checkbox" bind:checked={showAssignment}>
        Assignment
    </label>
    <label>
        <input type="checkbox" bind:checked={showQuiz}>
        Quiz
    </label>
    <label>
        <input type="checkbox" bind:checked={showClass}>
        Class
    </label>
</div> 

<style>
    @import "../../styles/pages/calendar.scss";
</style>
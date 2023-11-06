export default async function fetchEventsByMonth(year, month) {
    const response = await fetch(`http://localhost:3000/api/events/${year}/${month}`);
    const data = await response.json();
    console.log(data);
    return data;
}
import DayView from "~/components/common/calendar/DayView";


export default function Calendar() {



    return <DayView date={new Date()} appointments={[{
        id: "i",
        title: "Upen Dhakal",
        start: new Date("2025-06-25T12:00:00"),
        end: new Date("2025-06-25T15:00:00")
    }]} />
}
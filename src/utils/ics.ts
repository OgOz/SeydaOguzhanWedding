export const generateICS = (event: {
    title: string;
    description: string;
    location: string;
    start: string; // YYYYMMDDTHHMMSS
    end: string;
}) => {
    const { title, description, location, start, end } = event;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SeydaOguzhan//Wedding//TR
BEGIN:VEVENT
UID:${Date.now()}@seydaoguzhan.com
DTSTAMP:${start}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'seyda-oguzhan-nikah.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

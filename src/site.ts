import { Sessionize } from './definations/sessions';

if (typeof fetch === "undefined") {
    alert("Oh no 😢 We don't support your web browser. Please upgrade to a newer version!");
}

export function loadEventSessions(id: String, target: HTMLElement) {
    const parseEventData = (event: Sessionize.Event) => {
        event.sessions.map((session, index) => {
            const div = document.createElement('div');
            div.innerText = session.title;
            if (session.isPlenumSession) {
                div.classList.add("plenum");  
            }

            if (session.isServiceSession) {
                div.classList.add("service");
            }

            if (index % 2 === 0) {
                div.classList.add("altColour");
            }

            return div;
        }).forEach(div => {
            target.appendChild(div);
        });
    }

    const loadStoredData = () => {
        const sessionData = window.sessionStorage.getItem(`event${id}`);
        if (sessionData) {
            const event = JSON.parse(sessionData) as Sessionize.Event;
            parseEventData(event);
        } else {
            // TODO : wat
        }
    }

    if (navigator.onLine) {
        fetch(`https://sessionize.com/api/v2/${id}/view/all`).then(response => {
            switch (response.status) {
                case 200: {
                    response.json()
                        .then(value => value as Sessionize.Event)
                        .then(event => {
                            window.sessionStorage.setItem(`event${id}`, JSON.stringify(event));
                            parseEventData(event)
                        });

                    break;
                }
                case 304: {
                    loadStoredData();
                    break;
                }
            }
        });
    } else {
        loadStoredData();
    }
}
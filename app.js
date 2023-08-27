function createElement(tag,
                       textContent = "",
                       classes = [],
                       listener = null) {
    const element = document.createElement(tag);

    if (textContent) {
        element.textContent = textContent;
    }

    if (classes.length) {
        element.classList.add(...classes);
    }

    if (listener) {
        element.addEventListener("click", listener);
    }

    return element;
}


function sortByTimeRemaining() {
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const timeA = a.querySelectorAll('td')[2].textContent;
        const timeB = b.querySelectorAll('td')[2].textContent;

        const [hoursA, minutesA, secondsA] = timeA.split(':').map(Number);
        const [hoursB, minutesB, secondsB] = timeB.split(':').map(Number);

        if (hoursA !== hoursB) {
            return hoursA - hoursB;
        }
        if (minutesA !== minutesB) {
            return minutesA - minutesB;
        }
        return secondsA - secondsB;
    });

    rows.forEach(row => tableBody.appendChild(row));
}


function addBossTimer(e, fields) {
    e.preventDefault();

    if (Object.values(fields).some(input => !input.value)) {
        return null;
    }

    const row = createElement("tr", "", ["long-time-spawn"]);
    const location = createElement("td", fields.location.value, ["location"]);
    const bossName = createElement("td", fields.bossName.value, ["boss-name"]);
    const coolDown = createElement("td", fields.timer.value, ["timer-cooldown"]);

    const handler = createElement("td");
    const deleteBtn = createElement(
        "button",
        "Delete",
        [],
        (e) => e.target.parentElement.parentElement.remove()
    );

    row.appendChild(location);
    row.appendChild(bossName);
    row.appendChild(coolDown);

    handler.appendChild(deleteBtn);
    row.appendChild(handler);

    tableBody.appendChild(row)

    Object.values(fields).forEach(x => x.value = "")
    sortByTimeRemaining()
}

function updateTimer() {
    const allTimers = Array.from(document.querySelectorAll(".timer-cooldown"));

    if (!allTimers.length) {
        return null;
    }

    allTimers.forEach(timer => {
        const [hours, minutes, seconds] = timer.textContent.split(":");

        const hoursToSeconds = parseInt(hours) * 60 * 60
        const minutesToSeconds = parseInt(minutes) * 60
        let remainingSeconds = hoursToSeconds + minutesToSeconds + parseInt(seconds)

        if (remainingSeconds <= 0) {
            timer.textContent = `00:00:00`;

        } else {
            remainingSeconds -= 1

            const newHours = Math.floor(remainingSeconds / 3600);
            const newMinutes = Math.floor((remainingSeconds % 3600) / 60);
            const newSeconds = remainingSeconds % 60;

            if (remainingSeconds < 600) {
                timer.parentElement.className = "about-to-spawn"
            }

            timer.textContent = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
        }
    })

}

const fields = {
    location: document.querySelector("#map"),
    bossName: document.querySelector("#bossName"),
    timer: document.querySelector("#duration"),
};

const btn = document.querySelector("#add-button");
btn.addEventListener("click", (e) => addBossTimer(e, fields));

const tableBody = document.querySelector("table > tbody");

setInterval(updateTimer, 1000);
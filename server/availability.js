$ = function(id) {
  return document.getElementById(id);
}

var show = function(id) {
	$(id).style.display ='block';
}
var hide = function(id) {
	$(id).style.display ='none';
}

window.onload = function() {
    fetch(`/api/get-polls?id=${new URLSearchParams(window.location.search).get('id')}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        displayPolls(data)
    })
}

let dates = [];

function addDate() {
	let date = document.getElementById('addDate').value;
	if (date){
		dates.push(date);
	}
	document.getElementById('addDate').value = "";
    displayDates();
}

function displayDates() {
    let list = document.querySelector('.showDates');
    list.innerHTML="";
    for (i=0; i<dates.length; i++){
        let li = document.createElement('li');
        li.innerText = new Date(dates[i]).toLocaleString();
        list.appendChild(li);
    }
}

function createPoll() {
    console.log(dates)
    fetch('/api/create-poll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: document.getElementById('pollTitle').value, description: document.getElementById('pollDescription').value, dates: dates, channelID: new URLSearchParams(window.location.search).get('id') })
    })
}

function displayPolls(data) {

    for (let i = 0; i < data.polls.length; i++) {
        let poll = document.createElement('div')
        let dateTable = document.getElementById('dateTable')

        let titleRow = document.createElement('tr')
        dateTable.appendChild(titleRow)
        let titleText = document.createElement('td')
        titleText.colSpan = 3
        titleText.style.fontSize = "35px"
        titleText.textContent = data.polls[i].Title
        titleRow.appendChild(titleText)


        let dateItems = data.dates.filter((date) => data.polls[i].PollID == date.PollID)
        for (let j = 0; j < dateItems.length; j++) {
            let dateTableRow = document.createElement('tr')
            let dateItem = document.createElement('td')
            console.log(dateItems[j].Date)
            dateItem.textContent = dateItems[j].Date
            dateTableRow.appendChild(dateItem)
            dateTable.appendChild(dateTableRow)

            let voteButton = document.createElement('button')
            voteButton.onclick = function() {
    
            }
            voteButton.textContent = "Vote"
            dateTableRow.appendChild(voteButton)
        }

        document.getElementById("polls").appendChild(poll)
    }


}

/*function createPoll() {
    class Poll {
        constructor(root, title) {
            this.root = root;
            this.selected = sessionStorage.getItem("poll-selected");
            this.endpoint = "http://localhost:3000/availability.html";

            this.root.insertAdjacentHTML("afterbegin", `
                <div class="poll__title">${ title }</div>
            `);

            this._refresh();
        }

        async _refresh() {
            const response = await fetch(this.endpoint);
            const data = await response.json();

            this.root.querySelectorAll(".poll__option").forEach(option => {
                option.remove();
            });

            for (const option of dates) {
                const template = document.createElement("template");
                const fragment = template.content;

                template.innerHTML = `
                    <div class="poll__option ${ this.selected == option.label ? "poll__option--selected": "" }">
                        <div class="poll__option-fill"></div>
                        <div class="poll__option-info">
                            <span class="poll__label">${ option.label }</span>
                            <span class="poll__percentage">${ option.percentage }%</span>
                        </div>
                    </div>
                `;

                if (!this.selected) {
                    fragment.querySelector(".poll__option").addEventListener("click", () => {
                        fetch(this.endpoint, {
                            method: "post",
                            body: `add=${ option.label }`,
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        }).then(() => {
                            this.selected = option.label;

                            sessionStorage.setItem("poll-selected", option.label);

                            this._refresh();
                        })
                    });
                }

                fragment.querySelector(".poll__option-fill").style.width = `${ option.percentage }%`;

                this.root.appendChild(fragment);
            }
        }
    }

    const p = new Poll(
        document.querySelector(".poll"),
        "Choose available meeting times below."
    );

}*/
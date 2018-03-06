(function(){

	var originText;
	var entryWrapper = document.querySelector('#test-wrapper');
	var userEntry = document.querySelector('#test-area');
	var timer = document.querySelector('#timer');
	var btn = document.querySelector('#startbutton');
	var errors = document.querySelector('#error-count');
	var logScore = document.querySelector("#log_score");

	var interval;
	var timerRunning = false;

	var time = [0,0,0,0];
	var errorCount = 0;

	var baconReq;

	//TODOS
	// - get x number of text options from bacon ipsum
	// - store in json file
	// - make select dropdown for which one you want to test agains
	// - make table of times per text attempt
	// -

	//AJAX POST SCORES 
	const postScores = (time) => {
		xhr = new XMLHttpRequest();
		xhr.open('POST', 'write.php', true);	
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onload = () => {
		    if (xhr.status !== 200) {
		        alert('Request failed.  Returned status of ' + xhr.status);
		    }else {
		    	// alert('Request sent')
		    }
		};
		xhr.send("score=" + time);
	}
	const handleLog = (e) => {
		postScores("2:00");
	}

	//AJAX GET TEST TEXT
	const makeReq = () => {
		baconReq = new XMLHttpRequest();
		baconReq.responseType = "json";
		baconReq.onreadystatechange = getNewTestString;
		baconReq.open('GET', 'assets/text.json');
		baconReq.send();
	}
	const getNewTestString = () => {
		if (baconReq.readyState === XMLHttpRequest.DONE) {
	      if (baconReq.status === 200) {
	      	setRadioButtons(baconReq.response);
	      } else {
	        alert('There was a problem with the request.');
	      }
	    }
	}
	const setRadioButtons  = (json) => {
		let rbs = document.querySelector('#origin-text');
		let snippets = document.querySelector('#snippets');
		json.forEach((el)=>{

			let id = el.id;
			let t = el.text;

			let input = document.createElement("input");
			input.setAttribute("value", id);
			input.setAttribute("type", "radio");
			input.setAttribute("name", "snippet");
			input.setAttribute("id", "rb-" + id);
			input.addEventListener("click", selectTextSample);
			rbs.appendChild(input);
			
			let label = document.createElement("label");
			label.setAttribute("class", "label");
			label.setAttribute("id", "label" + id);
			label.setAttribute("for", "rb-" + id);
			label.textContent = "Option " + id;
			rbs.appendChild(label);

			let snippet = document.createElement("p");
			snippet.setAttribute("class", "snippet");
			snippet.setAttribute("id", "snippet-" + id);
			snippet.textContent = t;
			snippets.appendChild(snippet);
		});
		let first = document.querySelector("#rb-1");
		first.setAttribute("checked", "checked");

		let firstSnippet = document.querySelector("#snippet-1");
		firstSnippet.classList.add("active");

		originText = document.querySelector('.active');
	}

	const selectTextSample = (e) => {
		let id = e.target.id.substr(3,1); //extract numeral from id;
		// if(e.target.checked){ return };
		document.querySelectorAll('#snippets p').forEach((el)=>{
		
			if( el.id === ("snippet-" + id) ) {
				el.style.display = "block";
				el.classList.add("active");
			}else {
				el.style.display = "none";
				el.classList.remove("active");
			}
		})
	}

	// Test if user Entry matches
	const start = (e) => {
		let testAreaLength = userEntry.value.length;
		if (testAreaLength === 0 && !timerRunning ){
			interval = setInterval(runTimer, 10);
			timerRunning = true;
			//updates every hundredth of a second
		}
	}

	const runTimer = () => {;
		//calculate numbers for each slot
		time[0]++;
		time[1] = Math.floor(time[0]) % 100; // 1/100 secs
		time[2] = Math.floor(time[0] / 100) % 60; //secs
		time[3] = Math.floor( (time[0] / 100) / 60 ) % 60; //mins
		
		//prepend zeros as necessary
		time.forEach((num, index) => {
			time[index] = num <=9 ? ("0" + num) : num;
		});
		//output 
		timer.innerHTML =  time[3] + " : " + time[2] + " : " + time[1]; 
	}
	const resetTimer = () => {
		clearInterval(interval);
		interval = null; //ensures we don't set up a new interval for each test
	}

	const startOver = () => {
		resetTimer();
		time = [0,0,0,0];
		userEntry.value = '';
		timer.innerHTML = '00:00:00';
		userEntry.style.borderColor = 'gray';
		userEntry.disabled = false;
		timerRunning = false;
	}

	const spellCheck = (e) => {
		if(userEntry.value === originText.innerHTML.substr(0, userEntry.value.length) ){

			 if (userEntry.value.length === originText.innerHTML.length ){
			 	userEntry.style.borderColor = 'green';
			 	userEntry.disabled = true;
				resetTimer();

			 }else {
			 	userEntry.style.borderColor = 'blue';
			 }
		}else {
			userEntry.style.borderColor = 'red';
			if ( e.code !== "Backspace"){
				errorCount++;
				errors.textContent = errorCount;
			}
		}
	}

	userEntry.addEventListener('keypress', start, false);
	userEntry.addEventListener('keyup', spellCheck, false);
	btn.addEventListener('click', startOver, false);
	logScore.addEventListener('click', handleLog);
	// writebtn.addEventListener('click', fs.writeFile, false);

	window.onload = makeReq;
})();


// var fs = require("fs");
// var fileContent = "hello";

// fs.writeFile("./sample.txt", fileContent, (err) => {
//     if (err) {
//         console.error(err);
//         return;
//     };
//     console.log("File has been created");
// });
// fs.writeFile();

//node for writing to a file


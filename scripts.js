(function(){

	var testSnippet;
	// var entryWrapper = document.querySelector('#test-wrapper');
	var userEntry = document.querySelector('#test-area');
	var timer = document.querySelector('#timer');
	var btn = document.querySelector('#startbutton');
	var errors = document.querySelector('#error-count');
	var logScore = document.querySelector("#log_score");

	var interval;
	var timerRunning = false;

	var time = [0,0,0,0];
	var errorCount = 0;

	var txtReq;

	//TODOS
	// - make select dropdown for which one you want to test agains
	// - make table of times per text attempt

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
		txtReq = new XMLHttpRequest();
		txtReq.responseType = "json";
		txtReq.onreadystatechange = getNewTestString;
		txtReq.open('GET', 'assets/text.json');
		txtReq.send();
	}
	const getNewTestString = () => {
		if (txtReq.readyState === XMLHttpRequest.DONE) {
	      if (txtReq.status === 200) {
	      	setRadioButtons(txtReq.response);
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
			let count = el.count;
			
			//create buttons
			let opt = document.createElement("a");
			opt.setAttribute("class", "opt");
			opt.setAttribute("id", "opt" + id);
			opt.setAttribute("for", "rb-" + id);
			opt.textContent = id;
			opt.addEventListener("click", selectTextSample);
			rbs.appendChild(opt);

			//create text blocks
			let snippetContainer = document.createElement("div");
			let wc = document.createElement("span");
			let snippet = document.createElement("p");
			
			wc.textContent = "Word count: " + count;
			snippetContainer.appendChild(wc);
			snippetContainer.setAttribute("id", "snippet-" + id);
			snippetContainer.setAttribute("class", "snippet-container");
			
			snippet.setAttribute("class", "snippet");
			snippet.textContent = t;
			snippetContainer.appendChild(snippet);

			snippets.appendChild(snippetContainer);
		});
		let first = document.querySelector("#opt1");
		first.classList.add("active");

		let firstSnippet = document.querySelector("#snippet-1");
		firstSnippet.classList.add("active");

		testSnippet = document.querySelector('.snippet-container.active p');
	}

	const selectTextSample = (e) => {
		let buttonId = e.target.id.substr(3,1); //extract numeral from id;
		let buttons = document.querySelectorAll(".opt");
		if (e.target.classList.contains('active') ){
			//do nothing
		}else {
			buttons.forEach((el)=>{
				el.classList.remove("active");
				console.log(el);
			})
			e.target.classList.add('active');
		}
		document.querySelectorAll('.snippet-container').forEach((el)=>{
		
			if( el.id === ("snippet-" + buttonId) ) {
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
		if(userEntry.value === testSnippet.innerHTML.substr(0, userEntry.value.length) ){

			 if (userEntry.value.length === testSnippet.innerHTML.length ){
			 	userEntry.style.borderColor = '#6ab04c';
			 	userEntry.disabled = true;
				resetTimer();

			 }else {
			 	userEntry.style.borderColor = '#22a6b3';
			 }
		}else {
			userEntry.style.borderColor = '#eb4d4b';
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


import { postEncodeURIComponent, setCurrentTextSnippet, showPostScoreButton } from './modules/helpers.js';

(function(){


	// var testSnippet;
	// var entryWrapper = document.querySelector('#test-wrapper');
	var userEntry = document.querySelector('#test-area');
	var timer = document.querySelector('#timer');
	var btn = document.querySelector('#startbutton');
	var errors = document.querySelector('#error-count');
	var logScore = document.querySelector("#log_score");
	var postScore = document.querySelector("#post-score");

	var interval;
	var timerRunning = false;

	var time = [0,0,0,0];
	var errorCount = 0;

	// var txtReq;

	var xhr;
	
	const init = () => {
		userEntry.addEventListener('keypress', start, false);
		userEntry.addEventListener('keyup', spellCheck, false);
		btn.addEventListener('click', startOver, false);
		postScore.addEventListener('click', postScoreReq);
		// writebtn.addEventListener('click', fs.writeFile, false);

		window.onload = () => {
			
			//text
			makeAjaxCall('GET', 'http://localhost/typingtest/dist/api/v1/text_snippets', setRadioButtons);
			
			//scores
			makeAjaxCall('GET', 'http://localhost/typingtest/dist/api/v1/scores', listScores);
		}
		
	}

	//AJAX POST SCORES 
	const postScoreReq = () => {
		let date = new Date();
		let dateString = 
					date.getHours() 
					+ ':' 
					+ date.getSeconds() 
					+ ' ' 
					+ (date.getMonth() + 1)
					+ '-' 
					+ date.getDate() 
					+ '-' 
					+ date.getFullYear();

		let data = 'date=' + postEncodeURIComponent(dateString)
					+ '&score=' +  postEncodeURIComponent( timer.innerHTML.replace(/\s/g, '') );

		let xhr = new XMLHttpRequest();

		makeAjaxCall('POST', 'http://localhost/typingtest/dist/api/v1/scores',  listScores, data);
		//TODO ^^ modify ajax function to accept and test if args contain request header and data. Can these be passed as an object? Does ES6 do args?
		
		xhr.open('POST', 'http://localhost/typingtest/dist/api/v1/scores', true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = () => {
			if( xhr.readyState === 4 && xhr.status === 200){
			}
		};
		xhr.send(data);
		console.log(data);
	}


	
	const listScores = (resp) => {
		if (resp === null) {
			alert('Sorry, no scores');
			return;
		}
		// console.log(r);
		let list = document.querySelector('#scores');
		//remove list items if any
		while (list.firstChild) {
		  list.removeChild(list.firstChild);
		}
		resp.forEach((item)=>{
			let listItem = document.createElement('li');
			listItem.textContent = `${item.date}: ${item.score}`;
			list.appendChild(listItem);
		})
	}

	//AJAX GET TEST TEXT
	const makeAjaxCall = ( method, url, callback ) => {
		let txtReq = new XMLHttpRequest();

		txtReq.responseType = "json";
		txtReq.onreadystatechange = () => {
			if (txtReq.readyState === XMLHttpRequest.DONE) {
		      if (txtReq.status === 200) {
				console.log('xhr called for ' + url );
		      	callback( JSON.parse(txtReq.response) );
		      } else {
		        alert('There was a problem with the request.');
		      }
		    }
		};
		txtReq.open( method, url );
		txtReq.send();
	}

	
	const setRadioButtons = (json) => {
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

		setCurrentTextSnippet();

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
		setCurrentTextSnippet();
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
		updateErrors(0);
		time = [0,0,0,0];
		userEntry.value = '';
		timer.innerHTML = '00:00:00';
		userEntry.style.borderColor = 'gray';
		userEntry.disabled = false;
		timerRunning = false;
		showPostScoreButton(false);
	}
	
	const updateErrors = (count) => {
		errors.textContent = count;
	}
	
	const spellCheck = (e) => {

		let testSnippet = setCurrentTextSnippet();
		if(userEntry.value === testSnippet.innerHTML.substr(0, userEntry.value.length) ){

			 if (userEntry.value.length === testSnippet.innerHTML.length ){
			 	userEntry.style.borderColor = '#6ab04c';
			 	userEntry.disabled = true;
			 	showPostScoreButton(true);
				resetTimer();

			 }else {
			 	userEntry.style.borderColor = '#22a6b3';
			 }
		}else {
			userEntry.style.borderColor = '#eb4d4b';
			if ( e.code !== "Backspace"){
				errorCount++;
				updateErrors(errorCount);
			}
		}
	}



	init();
	
})();

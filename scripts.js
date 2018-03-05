(function(){

	var originText = document.querySelector('#origin-text p');
	var entryWrapper = document.querySelector('#test-wrapper');
	var userEntry = document.querySelector('#test-area');
	var timer = document.querySelector('#timer');
	var btn = document.querySelector('#startbutton');

	var interval;
	var timerRunning = false;

	var time = [0,0,0,0];

	var baconReq;

	//get bacon ipsum
	const makeReq = () => {
		baconReq = new XMLHttpRequest();
		baconReq.onreadystatechange = getNewTestString;
		baconReq.open('GET', 'https://baconipsum.com/api/?type=all-meat&sentences=1&format=text');
		baconReq.send();
	}
	const getNewTestString = () => {
		if (baconReq.readyState === XMLHttpRequest.DONE) {
	      if (baconReq.status === 200) {
	        originText.innerHTML = baconReq.responseText;

	      } else {
	        alert('There was a problem with the request.');
	      }
	    }
	}

	// Test if user Entry matches
	const start = (e) => {
		let testAreaLength = userEntry.value.length;
		if (testAreaLength === 0 && !timerRunning ){
			interval = setInterval(runTimer, 10);
			timerRunning = true;
			//updates every tenth of a second
		}
	}

	const runTimer = () => {;
		//calculate numbers for each slot
		time[0]++;
		time[1] = Math.floor(time[0]) % 100; //hundredth
		time[2] = Math.floor(time[0] / 100) % 60; //secs
		time[3] = Math.floor(time[0] / 1000) % 60; //mins
		
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
		makeReq();
	}

	const spellCheck = () => {
		if(userEntry.value === originText.innerHTML.substr(0, userEntry.value.length) ){
			console.log(userEntry.value.length);
			console.log(originText.innerHTML.length);

			 if (userEntry.value.length === originText.innerHTML.length ){
			 	userEntry.style.borderColor = 'green';
			 	userEntry.disabled = true;
				resetTimer();

			 }else {
			 	userEntry.style.borderColor = 'blue';
			 }
		}else {
			userEntry.style.borderColor = 'red';
		}
	}
	// Update Timer

	// Restart Test

	userEntry.addEventListener('keypress', start, false);
	userEntry.addEventListener('keyup', spellCheck, false);
	btn.addEventListener('click', startOver, false);

})();

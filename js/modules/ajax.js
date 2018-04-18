
//https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
export function makeRequest( method, url, query ) {
	
	//make arguments available to promise object
	const thisArgs = arguments;
	
	return new Promise(function(resolve, reject){
	
		let xhr = new XMLHttpRequest();

		xhr.responseType = "json";
		xhr.open( method, url );
		xhr.onload = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
		      if (xhr.status === 200) {
		      	resolve( JSON.parse(xhr.response) );
		      } else {
		        reject({
		        	status: this.status,
		        	statusText: xhr.status
		        });
		      }
		    }
		};
		//is this a GET or POST request? 
		if (method === 'POST' && thisArgs.length === 3){
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send(query)
		}else {
			xhr.send();
		}
	});
}
export const postEncodeURIComponent = (uri) => {
		uri = encodeURIComponent(uri)
		return uri.replace(/%20/g, "+");
}

export const setCurrentTextSnippet = () => {
	return document.querySelector('.snippet-container.active p');
}

export const showPostScoreButton = (on = false) => {
		if(on){
			document.querySelector("#post-score").classList.add('visible');
		} else {
			document.querySelector("#post-score").classList.remove('visible');	
		}
}
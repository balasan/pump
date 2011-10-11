function ajax(){

	this.sendRequest = function(){

		var ajaxRequest;  // The variable that makes Ajax possible!
			
		try{
			// Opera 8.0+, Firefox, Safari
			ajaxRequest = new XMLHttpRequest();
		} catch (e){
			// Internet Explorer Browsers
			try{
				ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try{
					ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e){
					// Something went wrong
					alert("Your browser broke!");
					return false;
				}
			}
		}
		
		
		ajaxRequest.onreadystatechange = function(){
			if(ajaxRequest.readyState == 4){		
				console.log(ajaxRequest.responseText)	
			}
		}
			
		var queryString = "test=test";


		var url = "/";
		ajaxRequest.open("POST", url, true);
			
		//Send the proper header information along with the request
		ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			


		ajaxRequest.send(queryString);
			
					
	}

}
var main =new main();

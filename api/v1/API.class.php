<?php
//http://coreymaynard.com/blog/creating-a-restful-api-with-php/
include('../../config.php');
abstract class API 
{
    //The HTTP method this request was made in, either GET, POST, PUT or DELETE
	protected $method = '';

    //The Model requested in the URI. eg: /files
	protected $endpoint = '';

	//An optional additional descriptor about the endpoint, used for things that can not be handled by the basic methods. eg: /files/process
	protected $verb = '';

	//Any additional URI components after the endpoint and verb have been removed, in our case, an integer ID for the resource. eg: /<endpoint>/<verb>/<arg0>/<arg1> or /<endpoint>/<arg0>
	protected $args = Array();

	//Stores the input of the PUT request
	protected $file = Null;

	public function __construct($request){
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Methods: *");
		header("Content-Type: application/json");
		
		//Once [the uri has] been exploded around the slash by pulling off the very first element we can grab the endpoint, if applicable the next slot in the array is the verb, and any remaining items are used as $args.
		$this->args = explode('/', rtrim($request, '/'));
		$this->endpoint = array_shift($this->args);

 
		if(array_key_exists(0, $this->args) && !is_numeric($this->args[0])) {
			$this->verb = array_shift($this->args);
		}

    	$this->method = $_SERVER['REQUEST_METHOD'];
    	if($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)){
    		//GET requests are easy to detect, but DELETE and PUT requests are hidden inside a POST request through the use of the HTTP_X_HTTP_METHOD header.
    		if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE'){
    			$this->method = 'DELETE';
    		} else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT'){
    			$this->method = 'PUT';
    		} else {
    			throw new Exception("Unexpected Header");
    		}
    	}

    	switch($this->method) {
            case 'DELETE':
            case 'POST':
                $this->request = $this->_cleanInputs($_POST);
                break;
            case 'GET':
                $this->request = $this->_cleanInputs($_GET);
                break;
            case 'PUT':
                $this->request = $this->_cleanInputs($_GET);
                $this->file = file_get_contents("php://input");
                break;
            default:
                $this->_response('Invalid Method', 405);
                break;
            }
    }


    //This is the one publicly exposed method in the API, and its job is to determine if the concrete class implements a method for the endpoint that the client requested. If it does, then it calls that method, otherwise a 404 response is returned.
    public function processAPI() {
        if (method_exists($this, $this->endpoint)) {
            return $this->_response($this->{$this->endpoint}($this->args));
        }
        return $this->_response("No Endpoint: $this->endpoint", 404);
    }

    private function _response($data, $status = 200) {
        header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
        return json_encode($data);
    }

    private function _cleanInputs($data) {
        $clean_input = Array();
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $clean_input[$k] = $this->_cleanInputs($v);
            }
        } else {
            $clean_input = trim(strip_tags($data));
        }
        return $clean_input;
    }

    private function _requestStatus($code) {
        $status = array(  
            200 => 'OK',
            404 => 'Not Found',   
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
        ); 
        return ($status[$code])?$status[$code]:$status[500]; 
    }

}
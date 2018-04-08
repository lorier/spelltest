<?php
require_once 'API.class.php';
class MyAPI extends API
{
    protected $User;

    public function __construct($request, $origin) {
        parent::__construct($request);

        // // Abstracted out for example
        // $APIKey = new Models\APIKey();
        // $User = new Models\User();

        // if (!array_key_exists('apiKey', $this->request)) {
        //     throw new Exception('No API Key provided');
        // } else if (!$APIKey->verifyKey($this->request['apiKey'], $origin)) {
        //     throw new Exception('Invalid API Key');
        // } else if (array_key_exists('token', $this->request) &&
        //      !$User->get('token', $this->request['token'])) {

        //     throw new Exception('Invalid User Token');
        // }

        // $this->User = $User;
    }

    /**
     * Example of an Endpoint
     */
     protected function post_score() {
        if ($this->method == 'GET') {
            // echo $this->endpoint;
            // return "Your name is " . $this->User->name;
        } else if($this->method == 'POST') {
            return 'Method is POST';
        } else {
            return "Only accepts GET requests";
        }
     }
     protected function scores(){
        if ($this->method == 'GET') {
            $file = ROOT_DIR .'/scores.json';
            $current = file_get_contents($file);
            // $current = json_encode($current);
            return $current;
        } else {
            return "Only accepts GET requests";
        }
     }
     protected function text_snippets(){
        if ($this->method == 'GET') {
            $file = ROOT_DIR .'/assets/text.json';
            $current = file_get_contents($file);
            // $current = json_encode($current);
            return $current;
        } else {
            return "Only accepts GET requests";
        }
     }
 }
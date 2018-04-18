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
     * Scores endpoint
     */
     protected function scores(){
        if ($this->method == 'GET') {
            $file = ROOT_DIR .'/scores.json';
            $current = file_get_contents($file);
            // $current = json_encode($current);
            return $current;
        } else if($this->method == 'POST') {

           if( $_POST["date"] || $_POST["score"] ) {
                $file = ROOT_DIR .'/scores.json';
                $current = json_decode(file_get_contents($file), true);
                
                $obj = new stdClass();
                $obj->date = urldecode($_POST["date"]);
                $obj->score = urldecode($_POST["score"]);
                array_unshift($current, $obj);
                
                file_put_contents($file, json_encode($current));

                // return file_get_contents($file);

           }
           exit();
        } else {
             return "Error, malformed request.";
        }
     }
     
     /**
     * Text Snippets endpoint
     */
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
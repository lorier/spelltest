<?php
	//parse query string and write a text file containing data
	
	if( isset($_POST["score"]) )
	{	
		$s = $_POST["score"];
		$file = 'scores.txt';
		$current = file_get_contents($file);
		$current .= $s;
		$current .= "\r\n";
		file_put_contents($file, $current);
	}else{
		$file = 'errors.txt';
		$errs = file_get_contents($file);
		$errs .= ' another error ';
		file_put_contents($file, $errs);
	}
?>
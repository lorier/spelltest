<?php
$scores = '';
$file = fopen("scores.txt", "r") or die("Error opening file");
$scores = fread( $file,filesize("scores.txt") );
fclose($file);

echo <<<EOT

<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Typing Test</title>
		<link href="https://fonts.googleapis.com/css?family=Nunito:400,700" rel="stylesheet">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
		<link rel="stylesheet" href="styles.css">
		<link rel="author" href="humans.txt">
	</head>
	<body>
		<div class="header">
			<div class="container">
				<h1>Typing Test</h1></div>
			</div>
		</div>
		<div class="container">
			<div class="columns">
				<div class="row">
					<div class="col-md-8">
						<div id="origin-text">
						<h4>Select your test snippet:</h4>
						</div>
						<div id="snippets">
						</div>
						<div id="test-wrapper">
							<textarea  id="test-area" rows="6" name="textarea" placeholder="Start typing."></textarea>
						</div>
						<div>
							<button id="startbutton" class="btn btn-lg btn-primary">Start Over</button>
							<button id="log_score" class="btn btn-outline-secondary">Log this test!</button>
						</div>
					</div>
					<div class="col-md-4 stats">
						<div>
							<h2>Timer</h2>
							<h3 id="timer">00:00:00</h3>
							<hr>
							<h2>Errors</h3>
							<h3 id="error-count">0</h3>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<h2>Best times:</h2>
						<p>$scores</p>
					</div>
				</div>
			</div>
		</div>
		<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.5/lodash.min.js"></script>
		<script src="scripts.js"></script>
	</body>
</html>

EOT;
?>
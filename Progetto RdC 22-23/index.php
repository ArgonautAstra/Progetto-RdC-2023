<!DOCTYPE html>
<html lang="en">
<head>
  <title>UNIHub</title>
  <meta charset="utf-8" content="width=device-width, initial-scale=1.0">
	
	<link rel="icon" href="img/UNIHub.png">
  
	<?php 
		require 'code/php/require/bootstrap_head.php';
	?>	
	
</head>	

<!-- CSS -->
	
<style>
	
	#body {
		background-color: #1F1F1F;
		overflow-x: hidden;
		font-size: 14px;
		color: white;
	}
	
	#main {
		padding: 20px;
	}
	
	#footer {
		background-color: white; 
		color: #1F1F1F;
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
	}
	
	#wallpaper {
		position: absolute;
		right: 0;
		height: 100%;
		width: auto;
		z-index: 0;
	}
	
	p { margin: 3px; }
	
	.btn { color: white; }
	
	.in {
		color: #1F1F1F;
		border-radius: 25px;
		background-color: white;
	}
	
	.up {
		margin-left: 5px;
		border-radius: 25px;
		background-color: #1F1F1F;
	}
	
	.in:hover {
		background-color: #1F1F1F;
		color: white;
		transition: 0.5s;
	}
	
	.up:hover {
		background-color: white;
		color: #1F1F1F;
		transition: 0.5s;
	}
	
	.form-control {
		height: 24px;
		margin-top: 3px;
		margin-bottom: 10px;
		border-radius: 100px;
		border: none;
	}
	
</style>
	
<!-- body --> 
	
<body id="body"> 
	
	<!-- wallpaper -->
	
	<img id="wallpaper" src="img/wallpaper.png" alt="wallpaper">
	
	<!-- navbar -->
	
	<div id="navbar" class="navbar justify-content-center">
		<div class="container-fluid">
			<img class="navbar-brand" src="img/UNIHub2.png" height="50px">
			
			<form class="d-flex justify-content-center">
		  		<input class="form-control" type="search" placeholder="Search" aria-label="Search">
			</form>
			
			<div class="d-flex">
				<a class="btn in" href="login.php">Sign in</a>
				<a class="btn up" href="register.php">Sign up</a>
			</div>
		  </div>
	</div>
	
	<!-- main -->
	
	<div id="main" class="row">
	
		<!-- body --> 

		<div>
			<h2>Lorem ipsum dolor sit amet</h2>
			<h2>consectetur adipiscing elit</h2>
			<h5>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</h5>
		</div>
		
	</div>
	
	<!-- footer -->
	
	<div id="footer" class="row" align="center">
		<p><b>Powered by</b>&emsp;Andrea Spinelli, Marco Valenti, Raffaele Terracino</p>
	</div>
	
</body>
	
<!-- script --> 
	
<script>
	
</script>
	
</html>
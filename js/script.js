$(function(){

	//VARIABLES --- 

		//CREATE DIVS ---
		var scoreBox = document.createElement('div');
		var goodBox = document.createElement('img');
		var badBox = document.createElement('img');
		var omgBox = document.createElement('img');
		var winBox = document.createElement('img');
		var highWord = document.createElement('div');
		var highBox = document.createElement('div');		
		var startBox = document.createElement('div');
		var movingBox = document.createElement('div');
		var i;
		var j;

		//PLAYER STATES ---
		var playerTurn; 

		
		//SPECS AT START OF GAME ---
			//MAIN CONTAINER
		var blockSpeed;
		var mainWidth;
		var towerHeight;
		var towerWidth;
		var boxCount;
		var scores = [];

			//LAST SET TOWER
		var lastWidth;
		var lastLeft;
		var visLeft;

	//ON LOAD ---

		$(document).ready(function () {
			startGame();
	    });


	//START GAME ---

	function startGame () {
		$('#main').empty();

		i = 0;
		j = i - 1;

		//PLAYER STATES ---
		playerTurn = 0;

		blockSpeed = 1200;
		mainWidth = $('#main').width();
		towerHeight = 0;
		towerWidth = [];
		boxCount = [];

		//LAST SET TOWER
		lastWidth =[];
		lastLeft = [];
		visLeft = [];

		//CREATES FIRST SET BOX
		$(scoreBox).attr('id', 'scoreShows'); 
		$('#main').append(scoreBox);	

		$(goodBox).attr({'id': 'goodShows', 'src': 'css/emoji1.jpg', 'class': 'emojis'}); 
		$('#main').append(goodBox);
		$('#goodShows').hide();

		$(badBox).attr({'id': 'badShows', 'src': 'css/emoji2.jpg', 'class': 'emojis'}); 
		$('#main').append(badBox);
		$('#badShows').hide();

		$(omgBox).attr({'id': 'omgShows', 'src': 'css/emoji3.jpg', 'class': 'emojis'}); 
		$('#main').append(omgBox);
		$('#omgShows').hide();

		$(winBox).attr({'id': 'winShows', 'src': 'css/cherry.png'}); 
		$('#main').append(winBox);
		$('#winShows').hide();

		$(highWord).attr('id', 'highScoreWord'); 
		$('#left').append(highWord);
		$('#highScoreWord').html('Highscore');

		$(highBox).attr('id', 'highScore'); 
		$('#left').append(highBox);

		$(startBox).attr('id', 'startTower'); 
		$('#main').append(startBox);

		towerWidth.push($('#startTower').width());
		lastWidth.push($('#startTower').width());
		var lastPosition = $('#startTower').position();
		lastLeft.push(lastPosition.left);
		visLeft.push(lastPosition.left);

		//CREATES FIRST MOVING BOX
		$('#main').css({
			'overflowY': 'hidden',
			'height': '500'});

		createBox();

	}

	$(window).keydown(function (e) {
		if (e.keyCode === 90 && playerTurn === 0) {
			click();
		}
		else if (e.keyCode === 191 && playerTurn ===1) {
			click();
		}
	});



	//ON CLICK ---

	function click() {
			
		i++;
		j++;

		$('#scoreShows').html(i);

		$('#topTower').stop();

		tradeDimensions();
		checkPlacement();

		$(movingBox).remove();

		boxCount.push(document.createElement('div'));
		$(boxCount[j]).attr({'id': 'lastTower-' + j, 'class': 'tower'});
		$('#main').append(boxCount[j]);

		$(boxCount[j]).css({
				'bottom': towerHeight,
				'width': towerWidth[i],
				'height': 40,
				'border-radius': '8px 8px 2px 2px',
				'left': function () {
					if (lastLeft[i] < visLeft[i]) {
						return visLeft[i];
					} else {
						return lastLeft[i];
					}
				},
				'background-image': function () {
					if (playerTurn === 0) {
						return 'url(css/player1-cake.jpg)';
					} else {
						return 'url(css/player2-cake.jpg)';
					}
				}
		}).effect('bounce');

		playerTurn = i % 2;

		checkLoser();
	};

	//CREATE BOX LOGIC ---

	function createBox () {
		

		$(movingBox).attr({id: 'topTower', class: 'tower'});
		$('#main').append(movingBox);
        
		towerHeight = towerHeight + 40;
		

		if (towerHeight > 240) {
			$('#main').css('height', '+=40');
		}

		$('#topTower').css({
				'bottom': towerHeight,
				'width': towerWidth[i],
				'left': function () {
					if (playerTurn === 0) {
						return -100;
					} else {
						return 400;
					}
				},
				'background-color': function () {
					if (playerTurn === 0) {
						return 'rgba(246, 213, 205, 0.5)';
					} else {
						return 'rgba(243, 202, 218, 0.5)';
					}
				}
			});

		if (playerTurn === 0 && i < 6 && towerWidth[i] > 185) {
			$('#topTower').html('Player 1 - Press "Z"');
		} else if (playerTurn === 1 && i < 6 && towerWidth[i] > 185) {
			$('#topTower').html('Player 2 - Press "/"');
		} else {
			$('#topTower').html('');
		}

		sideToside();
	}

	//SIDE TO SIDE LOGIC ---

	function sideToside () {
		if  (playerTurn === 0) {
			leftToRight();
		} else if (playerTurn === 1) {
			rightToLeft();
		}
	}

	function leftToRight() {
		$('#topTower').animate({
			left: (mainWidth - towerWidth[i])
		}, blockSpeed, function () {
			rightToLeft();
		});
	}

	function rightToLeft() {
		top.width = $('#topTower').width();

		$('#topTower').animate({
			left: '0px'
		}, blockSpeed, function() {
			leftToRight();
		});
	}

	//GET AND TRADE DIMENSIONS ---

	function tradeDimensions () {

		lastWidth.push($('#topTower').width());

		lastPosition = $('#topTower').position();
		lastLeft.push(lastPosition.left);

		if (lastLeft[i] < visLeft[j]) {
			visLeft.push(visLeft[j]);
		} else {
			visLeft.push(lastLeft[i])
		}
		
		towerWidth.push(towerWidth[j] - Math.abs(lastLeft[i] - visLeft[j]));
	}

	//WIN LOGIC ---

	function checkLoser () {
		if (lastLeft[i] > (visLeft[j] + lastWidth[i])) {
			$('#scoreShows').html(j);
			highScoreAdd();
			addCherry();

		} else if ((lastLeft[i] + lastWidth[i]) < visLeft[i]) {
			$('#scoreShows').html(j);
			highScoreAdd();
			addCherry();
			
		} else {
			createBox();
		}
	}

	//CHECK PLACEMENT ---

	function checkPlacement() {
		if ((towerWidth[i] + 8 >= towerWidth[j]) && (towerWidth[i] > 15)) {
			$('#goodShows').show().effect('puff');
		} else if ((towerWidth[i] <= towerWidth[j] - 80) && (towerWidth[i] > 15)) {
			$('#badShows').show().effect('puff');
		} else if (towerWidth[i] < 15) {
			$('#omgShows').show().effect('puff');
		}
	}

	function highScoreAdd () {
		scores.push(i);
		$('#highScore').html((Math.max.apply(Math, scores)-1));
	}

	function addCherry () {
		if (i > 5) {
			$('#winShows').css('left', (visLeft[j]));
			$('#winShows').show().effect('pulsate');

			$(window).keydown(function (e) {
				if (e.keyCode === 32) {
					$('#scoreShows').html('');
					startGame();
				} else if (e.keyCode != 32) {
					console.log('press space');
				}
			});
		}
	}
});




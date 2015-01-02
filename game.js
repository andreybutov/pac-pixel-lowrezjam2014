/*

#lowrezjam 2014

'Pac-Pixel'

Andrey Butov
http://www.andreybutov.com

*/


window.onload = function() 
{
	var _size = 32;
	var _fps = 5;
	var _canvas;
	var _zoomedCanvas;
	var _context;
	var _zoomedContext;

	var cell = {
		empty	: 0,
		wall 	: 1,
		food 	: 2,
	}

	var direction = {
		up 		: 0,
		right 	: 1,
		down 	: 2,
		left 	: 3,
	}

	var keycode = {
		up: 	38,
		right: 	39,
		down: 	40,
		left: 	37
	}


	var _prevPlayerX;
	var _prevPlayerY;
	var _playerX = 11;
	var _playerY = 17;
	var _playerDirection = direction.right;
	var _pendingPlayerDirection = _playerDirection;
	var _score = 0;
	var _firstRowOfGameArea = 6;
	var _lastBaddieAddedAtScore = 0;
	var _gameOver = false;
	var _gameOverSequenceComplete = false;
	var _currentGameOverRow = 0;
	var _endGameOverlay = [];


	var _level = 
	[
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

		[1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,1,1,0,1,1],
		[1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],
	];


	var _baddies = [];


	var _baddieEntryPoints = [
 		// from top
 		{ x: 5, y: _firstRowOfGameArea, direction: direction.down },
 		{ x: 11, y: _firstRowOfGameArea, direction: direction.down },
 		{ x: 20, y: _firstRowOfGameArea, direction: direction.down },
 		{ x: 26, y: _firstRowOfGameArea, direction: direction.down },
 		
 		// from bottom
 		{ x: 5, y: _size - 1, direction: direction.up },
 		{ x: 11, y: _size - 1, direction: direction.up },
 		{ x: 20, y: _size - 1, direction: direction.up },
 		{ x: 26, y: _size - 1, direction: direction.up },

 		// from left
 		{ x: 0, y: _firstRowOfGameArea + 2, direction: direction.right },
 		{ x: 0, y: _size - 3, direction: direction.right },

 		// from right
 		{ x: _size - 1, y: _firstRowOfGameArea + 2, direction: direction.left },
 		{ x: _size - 1, y: _size - 3, direction: direction.left },
	];

	
	function init()
	{
		_canvas = document.getElementById('game');
		
		_context = _canvas.getContext('2d');

		_zoomedCanvas = document.getElementById('zoomed');
		_zoomedContext = _zoomedCanvas.getContext('2d');
		_zoomedContext.imageSmoothingEnabled = false;
		_zoomedContext.mozImageSmoothingEnabled = false;
		_zoomedContext.webkitImageSmoothingEnabled = false;
		
		_context.fillStyle = 'black';

		loadAssets();

		seedFood();
		addBaddies(3);

		initInputHandler();

		setInterval ( tick, 1000 / _fps );
	}



	function loadAssets()
	{
		//_testImg = new Image();
		//_testImg.src = 'assets/images/test2.jpg';
	}



	function seedFood()
	{
		for ( var x = 0 ; x < _size ; ++x ) {
			for ( var y = _firstRowOfGameArea ; y < _size ; ++y ) {
				if ( getCell(x, y) == cell.empty ) {
					if ( Math.random() < 0.10 ) {
						setCell(x, y, cell.food);
					}
				}
			}
		}
	}


	
	function addBaddies(count)
	{
		while ( count ) {
			var entryPoint = randomArrayItem(_baddieEntryPoints);
			_baddies.push({ x: entryPoint.x, y: entryPoint.y, direction: entryPoint.direction });
			--count;
		}
	}



	function addFood()
	{
		var food = 0;
		var emptyCells = [];

		for ( var x = 0 ; x < _size ; ++x ) {
			for ( var y = _firstRowOfGameArea ; y < _size ; ++y ) {
				switch ( getCell(x, y) ) {
					case cell.food:
						food++;
						break;

					case cell.empty:
						emptyCells.push({ x: x, y: y });
						break;
				}
			}
		}

		// console.log("food: " + food);

		if ( food < 10 ) {
			var additional = randomInt(1, 5);
			// console.log("adding " + additional + " food");
			while ( additional > 0 ) {
				var emptyCell = randomArrayItem(emptyCells);
				setCell(emptyCell.x, emptyCell.y, cell.food);
				additional--;
			}
		}
	}


	function tick()
	{
		// Clear area
		_context.fillRect(0, 0, _size, _size);
		
		// _context.drawImage ( _testImg, 0, 0 );

		// Score
		drawScore();

		// Separator
		for ( var x = 0 ; x < _size ; ++x ) {
			putPixel(63, 51, 106, x, _firstRowOfGameArea - 1);
		}

		// Draw level
		for ( var x = 0 ; x < _size ; ++x ) {
			for ( var y = _firstRowOfGameArea ; y < _size ; ++y ) {
				var r = 0;
				var g = 0;
				var b = 0;
				var a = 255;
				switch ( getCell(x, y) ) {
					case cell.empty:
						break;
					
					case cell.wall:
						r = 94; g = 74; b = 162;
						break;
					
					case cell.food:
						r = 255; g = 255; b = 255;
						break;
				}

				putPixel(r, g, b, x, y);
			}
		}
		
		if ( _gameOver ) 
		{
			for ( var x = 0 ; x < _size ; ++x ) {
				for ( var y = 0 ; y < _endGameOverlay.length ; ++y ) {
					var endGamePixelData = _endGameOverlay[y][x];
					putPixel(endGamePixelData.r, endGamePixelData.g, endGamePixelData.b, x, y + _firstRowOfGameArea);
				}
			}

			drawGameOverSequence();
		}
		else 
		{
			// Update player position
			movePlayer();

			moveBaddies();

			if ( !_gameOver ) {
			
				drawBaddies();
			
				// Draw player
				putPixel(255, 255, 0, _playerX, _playerY);
			
				// Player ate food?
				playerAteFood();
			
				// Repopulate food if needed
				addFood();
			}
		}

		// Update the zoomed version of the canvas.
		// The zoomed version mirrors the original at a larger scale
		var scaledCanvas = resize(_canvas, 10);
		_zoomedContext.drawImage(scaledCanvas, 0, 0);
	}



	// creates a scaled copy of an image, without anti-aliasing, on most browsers
	function resize(img, scale) {
	    var widthScaled = img.width * scale;
	    var heightScaled = img.height * scale;
	    
	    var orig = document.createElement('canvas');
	    orig.width = img.width;
	    orig.height = img.height;
	    var origCtx = orig.getContext('2d');
	    origCtx.drawImage(img, 0, 0);
	    var origPixels = origCtx.getImageData(0, 0, img.width, img.height);
	    
	    var scaled = document.createElement('canvas');
	    scaled.width = widthScaled;
	    scaled.height = heightScaled;
	    var scaledCtx = scaled.getContext('2d');
	    var scaledPixels = scaledCtx.getImageData( 0, 0, widthScaled, heightScaled );
	    
	    for( var y = 0; y < heightScaled; y++ ) {
	        for( var x = 0; x < widthScaled; x++ ) {
	            var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
	            var indexScaled = (y * widthScaled + x) * 4;
	            scaledPixels.data[ indexScaled ] = origPixels.data[ index ];
	            scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ];
	            scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ];
	            scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ];
	        }
	    }
	    scaledCtx.putImageData( scaledPixels, 0, 0 );
	    return scaled;
	}



	function initInputHandler() {
		document.onkeydown = function(event) {
			var keyCode = (window.event) ? window.event.keyCode : event.which;
			switch ( keyCode ) {
				case keycode.left: _pendingPlayerDirection = direction.left; return false;
				case keycode.up: _pendingPlayerDirection = direction.up; return false;
				case keycode.right: _pendingPlayerDirection = direction.right; return false;
				case keycode.down: _pendingPlayerDirection = direction.down; return false;
				default: return true;
			}
		}
	}


	function movePlayer() 
	{
		var newX = _playerX;
		var newY = _playerY;

		if ( _pendingPlayerDirection != _playerDirection )
		{
			switch ( _pendingPlayerDirection ) 
			{
				case direction.up: newY = wrapYIfNeeded(_playerY - 1); break;
				case direction.right: newX = wrapXIfNeeded(_playerX + 1); break;
				case direction.down: newY = wrapYIfNeeded(_playerY + 1); break;
				case direction.left: newX = wrapXIfNeeded(_playerX - 1); break;
			}

			if ( canMoveTo(newX, newY) ) 
			{
				_playerDirection = _pendingPlayerDirection;
			}
		}

		newX = _playerX;
		newY = _playerY;

		switch ( _playerDirection ) 
		{
			case direction.up: newY = wrapYIfNeeded(_playerY - 1); break;
			case direction.right: newX = wrapXIfNeeded(_playerX + 1); break;
			case direction.down: newY = wrapYIfNeeded(_playerY + 1); break;
			case direction.left: newX = wrapXIfNeeded(_playerX - 1); break;
		}

		if ( canMoveTo(newX, newY) ) 
		{
			_prevPlayerX = _playerX;
			_prevPlayerY = _playerY;
			_playerX = newX;
			_playerY = newY;
		}
	}



	function moveBaddies() {
		for ( var i = 0 ; i < _baddies.length ; ++i ) {
			var possibleDirs = possibleDirections(_baddies[i].x, _baddies[i].y, reverseDirection(_baddies[i].direction));
			_baddies[i].direction = randomArrayItem(possibleDirs);
			var _prevBaddieX = _baddies[i].x;
			var _prevBaddieY = _baddies[i].y;
			switch ( _baddies[i].direction ) {
				case direction.up: _baddies[i].y = wrapYIfNeeded(_baddies[i].y - 1); break;
				case direction.right: _baddies[i].x = wrapXIfNeeded(_baddies[i].x + 1); break; 
				case direction.down: _baddies[i].y = wrapYIfNeeded(_baddies[i].y + 1); break;
				case direction.left: _baddies[i].x = wrapXIfNeeded(_baddies[i].x - 1); break;
			}
			// baddie touched player?
			if ( _baddies[i].x == _playerX && _baddies[i].y == _playerY ) {
				_gameOver = true;
			}
			// Also, if a baddie and the player "swapped positions" 
			// in this frame, we need to mark is as a "touch".
			if ( _playerX == _prevBaddieX && _playerY == _prevBaddieY && 
				 _prevPlayerX == _baddies[i].x && _prevPlayerY == _baddies[i].y ) 
			{
				_gameOver = true;
			}
		}
	}



	function drawBaddies() {
		for ( var i = 0 ; i < _baddies.length ; ++i ) {
			putPixel(175, 78, 78, _baddies[i].x, _baddies[i].y);
		}
	}



	function playerAteFood() {
		if ( getCell(_playerX, _playerY) == cell.food ) {
			_score++;
			if ( _score % 25 == 0 && _score != _lastBaddieAddedAtScore ) {
				addBaddies(1);
				_lastBaddieAddedAtScore = _score;
			}
			setCell(_playerX, _playerY, cell.empty);
		}
	}



	function getCell(x, y) {
		return _level[y][x];
	}



	function setCell(x, y, val) {
		_level[y][x] = val;
	}



	function canMoveTo(x, y) 
	{
		switch ( getCell(x, y) ) {
			case cell.empty:
			case cell.food:
				return true;
			default:
				return false;
		}
	}



	function possibleDirections(x, y, otherThan) {
		var canMoveUp = canMoveTo(x, wrapYIfNeeded(y - 1));
		var canMoveRight = canMoveTo(wrapXIfNeeded(x + 1), y);
		var canMoveDown = canMoveTo(x, wrapYIfNeeded(y + 1));
		var canMoveLeft = canMoveTo(wrapXIfNeeded(x - 1), y);
		var dirs = [];
		if ( canMoveUp && otherThan != direction.up ) dirs.push(direction.up);
		if ( canMoveRight && otherThan != direction.right ) dirs.push(direction.right);
		if ( canMoveDown && otherThan != direction.down ) dirs.push(direction.down);
		if ( canMoveLeft && otherThan != direction.left ) dirs.push(direction.left);
		return dirs;
	}



	function reverseDirection(dir) {
		switch(dir) {
			case direction.up: return direction.down;
			case direction.right: return direction.left;
			case direction.down: return direction.up;
			case direction.left: return direction.right;
		}
	}



	function wrapXIfNeeded(x) {
		if ( x > _size - 1 ) return 0;
		if ( x < 0 ) return _size - 1;
		return x;
	}



	function wrapYIfNeeded(y) {
		if ( y < _firstRowOfGameArea ) return _size - 1;
		if ( y > _size - 1 ) return _firstRowOfGameArea;
		return y;
	}



	function putPixel(r, g, b, x, y) {
		var pixel = _context.createImageData(1, 1);
		var pixelData = pixel.data;
		pixelData[0] = r;
		pixelData[1] = g;
		pixelData[2] = b;
		pixelData[3] = 255; // alpha
		_context.putImageData(pixel, x, y);
	}



	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}



	function randomArrayItem(items) {
		return items[Math.floor(Math.random() * items.length)];
	}



	function drawGameOverSequence() {
		if ( _gameOverSequenceComplete ) {
			return;
		}
		_endGameOverlay.push([]);
		for ( var i = 0 ; i < _size ; ++i ) {
			_endGameOverlay[_currentGameOverRow][i] = { r: randomInt(100, 200), g: randomInt(100, 200), b: randomInt(100, 200) };
		}
		_currentGameOverRow++;
		if ( _currentGameOverRow + _firstRowOfGameArea > _size - 1 ) {
			_gameOverSequenceComplete = true;
		}
	}


	// ========================================================================


	function drawScore() {
		var x = 0;
		var y = 0;
		var scoreStr = _score.toString();
		var len = scoreStr.length;
		for ( var i = 0 ; i < len ; ++i ) {
			switch ( scoreStr.charAt(i) ) {
				case '0': x += drawZero(x, y); break;
				case '1': x += drawOne(x, y); break;
				case '2': x += drawTwo(x, y); break;
				case '3': x += drawThree(x, y); break;
				case '4': x += drawFour(x, y); break;
				case '5': x += drawFive(x, y); break;
				case '6': x += drawSix(x, y); break;
				case '7': x += drawSeven(x, y); break;
				case '8': x += drawEight(x, y); break;
				case '9': x += drawNine(x, y); break;
			}
			
			x++; // gap
		}
	}


	
	function drawZero(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x + 1, y);
		putPixel(255, 255, 255, x + 2, y);
		putPixel(255, 255, 255, x + 3, y);

		putPixel(255, 255, 255, x, y + 1);
		putPixel(255, 255, 255, x + 1, y + 1);
		putPixel(255, 255, 255, x + 3, y + 1);

		putPixel(255, 255, 255, x, y + 2);
		putPixel(255, 255, 255, x + 1, y + 2);
		putPixel(255, 255, 255, x + 3, y + 2);

		putPixel(255, 255, 255, x, y + 3);
		putPixel(255, 255, 255, x + 1, y + 3);
		putPixel(255, 255, 255, x + 3, y + 3);
		
		putPixel(255, 255, 255, x, y + 4);
		putPixel(255, 255, 255, x + 1, y + 4);
		putPixel(255, 255, 255, x + 2, y + 4);
		putPixel(255, 255, 255, x + 3, y + 4);

		return 4;
	}



	function drawOne(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x, y + 1);
		putPixel(255, 255, 255, x, y + 2);
		putPixel(255, 255, 255, x, y + 3);
		putPixel(255, 255, 255, x, y + 4);
		putPixel(255, 255, 255, x + 1, y);
		putPixel(255, 255, 255, x + 1, y + 1);
		putPixel(255, 255, 255, x + 1, y + 2);
		putPixel(255, 255, 255, x + 1, y + 3);
		putPixel(255, 255, 255, x + 1, y + 4);

		return 2;
	}


	function drawTwo(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x + 1, y);
		putPixel(255, 255, 255, x + 2, y);
		putPixel(255, 255, 255, x + 3, y);

		putPixel(255, 255, 255, x + 2, y + 1);
		putPixel(255, 255, 255, x + 3, y + 1);

		putPixel(255, 255, 255, x, y + 2);
		putPixel(255, 255, 255, x + 1, y + 2);
		putPixel(255, 255, 255, x + 2, y + 2);
		putPixel(255, 255, 255, x + 3, y + 2);

		putPixel(255, 255, 255, x, y + 3);
		putPixel(255, 255, 255, x + 1, y + 3);

		putPixel(255, 255, 255, x, y + 4);
		putPixel(255, 255, 255, x + 1, y + 4);
		putPixel(255, 255, 255, x + 2, y + 4);
		putPixel(255, 255, 255, x + 3, y + 4);
		
		return 4;
	}


	function drawThree(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x + 1, y);
		putPixel(255, 255, 255, x + 2, y);
		putPixel(255, 255, 255, x + 3, y);

		putPixel(255, 255, 255, x + 2, y + 1);
		putPixel(255, 255, 255, x + 3, y + 1);

		putPixel(255, 255, 255, x, y + 2);
		putPixel(255, 255, 255, x + 1, y + 2);
		putPixel(255, 255, 255, x + 2, y + 2);
		putPixel(255, 255, 255, x + 3, y + 2);

		putPixel(255, 255, 255, x + 2, y + 3);
		putPixel(255, 255, 255, x + 3, y + 3);
		
		putPixel(255, 255, 255, x, y + 4);
		putPixel(255, 255, 255, x + 1, y + 4);
		putPixel(255, 255, 255, x + 2, y + 4);
		putPixel(255, 255, 255, x + 3, y + 4);
		
		return 4;
	}


	function drawFour(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x + 2, y);
		putPixel(255, 255, 255, x + 3, y);

		putPixel(255, 255, 255, x, y + 1);
		putPixel(255, 255, 255, x + 2, y + 1);
		putPixel(255, 255, 255, x + 3, y + 1);
		
		putPixel(255, 255, 255, x, y + 2);
		putPixel(255, 255, 255, x + 1, y + 2);
		putPixel(255, 255, 255, x + 2, y + 2);
		putPixel(255, 255, 255, x + 3, y + 2);
		
		putPixel(255, 255, 255, x + 2, y + 3);
		putPixel(255, 255, 255, x + 3, y + 3);

		putPixel(255, 255, 255, x + 2, y + 4);
		putPixel(255, 255, 255, x + 3, y + 4);
		
		return 4;
	}


	function drawFive(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x + 1, y);
		putPixel(255, 255, 255, x + 2, y);
		putPixel(255, 255, 255, x + 3, y);

		putPixel(255, 255, 255, x, y + 1);

		putPixel(255, 255, 255, x, y + 2);
		putPixel(255, 255, 255, x + 1, y + 2);
		putPixel(255, 255, 255, x + 2, y + 2);
		putPixel(255, 255, 255, x + 3, y + 2);

		putPixel(255, 255, 255, x + 2, y + 3);
		putPixel(255, 255, 255, x + 3, y + 3);

		putPixel(255, 255, 255, x, y + 4);
		putPixel(255, 255, 255, x + 1, y + 4);
		putPixel(255, 255, 255, x + 2, y + 4);
		putPixel(255, 255, 255, x + 3, y + 4);
		
		return 4;
	}


	function drawSix(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x + 1, y);
		putPixel(255, 255, 255, x + 2, y);
		putPixel(255, 255, 255, x + 3, y);

		putPixel(255, 255, 255, x, y + 1);

		putPixel(255, 255, 255, x, y + 2);
		putPixel(255, 255, 255, x + 1, y + 2);
		putPixel(255, 255, 255, x + 2, y + 2);
		putPixel(255, 255, 255, x + 3, y + 2);

		putPixel(255, 255, 255, x, y + 3);
		putPixel(255, 255, 255, x + 3, y + 3);

		putPixel(255, 255, 255, x, y + 4);
		putPixel(255, 255, 255, x + 1, y + 4);
		putPixel(255, 255, 255, x + 2, y + 4);
		putPixel(255, 255, 255, x + 3, y + 4);
		
		return 4;
	}


	function drawSeven(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x + 1, y);
		putPixel(255, 255, 255, x + 2, y);
		putPixel(255, 255, 255, x + 3, y);

		putPixel(255, 255, 255, x, y + 1);
		putPixel(255, 255, 255, x + 1, y + 1);
		putPixel(255, 255, 255, x + 2, y + 1);
		putPixel(255, 255, 255, x + 3, y + 1);

		putPixel(255, 255, 255, x + 3, y + 2);

		putPixel(255, 255, 255, x + 3, y + 3);

		putPixel(255, 255, 255, x + 3, y + 4);
		
		return 4;
	}


	function drawEight(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x + 1, y);
		putPixel(255, 255, 255, x + 2, y);
		putPixel(255, 255, 255, x + 3, y);

		putPixel(255, 255, 255, x, y + 1);
		putPixel(255, 255, 255, x + 1, y + 1);
		putPixel(255, 255, 255, x + 3, y + 1);

		putPixel(255, 255, 255, x, y + 2);
		putPixel(255, 255, 255, x + 1, y + 2);
		putPixel(255, 255, 255, x + 2, y + 2);
		putPixel(255, 255, 255, x + 3, y + 2);

		putPixel(255, 255, 255, x, y + 3);
		putPixel(255, 255, 255, x + 1, y + 3);
		putPixel(255, 255, 255, x + 3, y + 3);

		putPixel(255, 255, 255, x, y + 4);
		putPixel(255, 255, 255, x + 1, y + 4);
		putPixel(255, 255, 255, x + 2, y + 4);
		putPixel(255, 255, 255, x + 3, y + 4);
		
		return 4;
	}


	function drawNine(x, y) {
		putPixel(255, 255, 255, x, y);
		putPixel(255, 255, 255, x + 1, y);
		putPixel(255, 255, 255, x + 2, y);
		putPixel(255, 255, 255, x + 3, y);

		putPixel(255, 255, 255, x, y + 1);
		putPixel(255, 255, 255, x + 3, y + 1);

		putPixel(255, 255, 255, x, y + 2);
		putPixel(255, 255, 255, x + 1, y + 2);
		putPixel(255, 255, 255, x + 2, y + 2);
		putPixel(255, 255, 255, x + 3, y + 2);

		putPixel(255, 255, 255, x + 2, y + 3);
		putPixel(255, 255, 255, x + 3, y + 3);

		putPixel(255, 255, 255, x + 2, y + 4);
		putPixel(255, 255, 255, x + 3, y + 4);
		
		return 4;
	}


	// ========================================================================


	init();
}

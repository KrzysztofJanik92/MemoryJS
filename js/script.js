(function() {
    var tiles_count = 20; // number of tiles
    var tiles = []; // tile table
    var clickedTiles = []; //clicked tiles (max 2)
    var canGet = true; //is it possible to click on a tile
    var movesCount = 0; //number of player moves
    var tilesPair = 0; //found tiles
    var gameLevel = 1; // game level selected
    var engineSrc = 'miniengine.php'; //source to php
    
  
    startGame = function() {
        tiles = [];
        clickedTiles = [];
        canGet = true;
        movesCount = 0;
        tilesPair = 0;        

        var $gameBoard = $('#gameBoard').empty();

        for (var i=0; i<tiles_count; i++) {
            tiles.push(Math.floor(i/2));
        }

        for (i=tiles_count-1; i>0; i--) {
            var swap = Math.floor(Math.random()*i);
            var tmp = tiles[i];
            tiles[i] = tiles[swap];
            tiles[swap] = tmp;
        }

        for (i=0; i<tiles_count; i++) {            
            var $cell = $('<div class="cell"></div>');
            
            var $tile = $('<div class="tile"><span class="avers"></span><span class="revers tile-background"></span></div>');
        
            
            $tile.addClass('card-type-'+tiles[i]); 
            $tile.data('cardType', tiles[i])
            $tile.data('index', i);

            $cell.append($tile);
            $gameBoard.append($cell);                               
        }
        $gameBoard.find('.cell .tile').on('click', function() {
            tileClicked($(this))
        });     
    }
    
    showMoves = function(moves) {
        $('#gameMoves').html(moves);
        $('#mobileGameMoves').html(moves);
    }
    
    tileClicked = function(element) {
        if (canGet) {            
            if (!clickedTiles.length || (element.data('index') != clickedTiles[0].data('index'))) {                
                clickedTiles.push(element);
                element.addClass('show');                
            }          

            if (clickedTiles.length >= 2) {
                canGet = false;
                
                if (clickedTiles[0].data('cardType') === clickedTiles[1].data('cardType')) {
                    setTimeout(function() {deleteTiles()}, 500);
                } else {
                    setTimeout(function() {resetTiles()}, 500);
                }
                
            if (gameLevel === 1 || gameLevel === 2){
                movesCount++;
            } else {
                movesCount+=2;
            }
        
            if (gameLevel === 2 && movesCount >= 20){
                $("#gameBoard").html("<span class='game-over'>GAME OVER</span>");
            }  
            
            showMoves(movesCount);
            
            }
        }
    }
    
    resetTiles = function() {
        clickedTiles[0].removeClass('show');
        clickedTiles[1].removeClass('show');
        clickedTiles = new Array();
        canGet = true;
    }
    
    gameOver = function() {
        saveHighScore();        
    }

    deleteTiles = function() {     
        clickedTiles[0].fadeOut(function() {
            $(this).remove();
        });
        clickedTiles[1].fadeOut(function() {
            $(this).remove();                        
        });

        tilesPair++;
        clickedTiles = new Array();
        canGet = true;
        if (tilesPair >= tiles_count / 2) {
            gameOver();
        }        
    }
    
    showLoading = function() {
        $('.loading').show();
    }

    hideLoading = function() {
        $('.loading').hide();
    }
    
    showLevels = function() {
        showStage('stageLevels');
    }

    showPlayerName = function() {
        showStage('stagePlayerName');
        $('#checkName').on('click', function() {
            if ($('#playerName').val()!='') {
                $('.player-name-box').removeClass('error');
                startGame();
                showStage('stageGame');
            } else {
                $('.player-name-box').addClass('error');
                return false;
            }
        })                        
    }
    
    saveHighScore = function() {        
        showLoading();
        var playerName = $('#playerName').val();        
        $.ajax({
            url : engineSrc,
            type : 'POST',            
            data : {
                action : 'save',
                player : playerName,
                moves : movesCount
            },
            success : function() {

            },         
            error : function() {
                console.log('Wystąpił jakis błąd :(')
            },
            complete : function() {
                showHighScore();
                hideLoading();
            }
        })
    }

    showHighScore = function() {
        showLoading();
        $.ajax({
            url : engineSrc,
            type : 'POST',            
            data : {
                action : 'read'                
            },
            dataType : 'json',
            success : function(r) {                
                $('#highscoreBoard').empty();
                for (x=0; x<r.length; x++) {
                    var record = r[x];                    
                    var $div = $('<div class="line"><strong class="player">'+record.player+' :</strong><span class="moves">'+record.moves+'</span></div>');
                    $('#highscoreBoard').append($div);
                }                   
            },         
            error : function() {
                console.log('Wystąpił jakis błąd :(')                
            },
            complete : function() {
                hideLoading();
                showStage('stageHighscore');
            }
        })
        
    }

    showStage = function(stage) {
        $('[class^=slide-]').removeClass('show');
        $('#'+stage).addClass('show');
    }    

    
    bindEvents = function() {        
        $('#startGame').on('click', function(e) {
            e.preventDefault();
            showLevels();                
        });
        $('#easy').on('click', function(){
            showPlayerName();
            $("#sheet").attr('href', "css/memory-easy.css");
            $('#info').text(' EASY');
            $('#mobileInfo').text(' EASY');
            gameLevel = 0;
            tiles_count = 10;

        });
        $('#hard').on('click', function(){
            showPlayerName();
            gameLevel = 1;
            tiles_count = 20;
        });
        $('#extreme').on('click', function(){
            showPlayerName();
            $("#sheet").attr('href', "css/memory-extreme.css");
            $('#info').text(' EXTREME');
            $('#mobileInfo').text(' EXTREME');
            gameLevel = 2;
            tiles_count = 20;
        });
        $("#restart").on('click', function() {
            $('#gameMoves').text('');
            $('#mobileGameMoves').text('');
            startGame();
        }); 
        $("#mobileRestart").on('click', function() {
            $('#gameMoves').text('');
            $('#mobileGameMoves').text('');
            startGame();
        }); 
        $('#showHighscore').on('click', function(e) {
            e.preventDefault();
            showHighScore();
        })
        $('.close-highscore').on('click', function(e) {
            e.preventDefault();
            showStage('stageStart');
        })
    }    

    init = function() {
        $(function() {
            bindEvents();
        });
    }

    init();
})();    
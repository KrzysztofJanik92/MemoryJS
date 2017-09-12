<?php
$fileSrc = 'highscore.dat';
$resultsMaxCount = 10;
$action = (string)$_POST['action'];

if ($action == 'read') {
    $scoreBoard = readHighScore();
    echo json_encode($scoreBoard);
}
if ($action == 'save') {
    $player = (string)$_POST['player'];
    $playerMoves = (int)$_POST['moves'];
    saveHighScore($player, $playerMoves);
}
     
    function sortByScoreMaxToMin($a, $b) {
        if ($a['moves'] == $b['moves']) {
            return 0;
        } 
        return ($a['moves'] < $b['moves'])? -1 : 1;                
    }

    function saveHighScore($playerName, $playerMoves) {
        global $resultsMaxCount;
        global $fileSrc;

        $arrayTemp = Array(
            'player' => $playerName,
            'moves' => $playerMoves
        );

        $scoreBoard = readHighScore();
        
        array_push($scoreBoard, $arrayTemp);

        $length = min(count($scoreBoard), $resultsMaxCount);
        usort($scoreBoard, 'sortByScoreMaxToMin');
        
        $newScoreBoard = array_slice($scoreBoard, 0, $length);

        $fp = fopen($fileSrc, 'w');
        flock($fp, LOCK_EX);        
        foreach ($newScoreBoard as $record) {
            fwrite($fp, $record['player']."\r\n");
            fwrite($fp, $record['moves']."\r\n");
        }
        fclose($fp);
    }
    
    function readHighScore() {
        global $fileSrc;

        $fileLines = file($fileSrc);

        $highScore = Array();

        if (count($fileLines) > 1) {
            $i = 0;
            for ($x=0; $x<count($fileLines); $x+=2) {
                $highScore[$i] = Array(
                    'player' => trim($fileLines[$x]),
                    'moves' => trim($fileLines[$x+1])
                );
                $i++;
            }
        }
        return $highScore;
    }
?>
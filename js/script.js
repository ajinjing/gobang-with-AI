var chessBoard = [];
var me = true;
var over = false;

for (var i = 0; i < 15; i++) {
  chessBoard[i] = [];
  for (var j = 0; j < 15; j++) {
    chessBoard[i][j] = 0;
  }
}

//
// 赢法数组
//
var wins = [];
for (var i = 0; i < 15; i++) {
  wins[i] = [];
  for (var j = 0; j < 15; j++) {
    wins[i][j] = {};
  }
}

var count = 0;

// 竖向所有赢法, 五颗棋子竖着摆
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      // wins[距(0,0)点向右的偏移量][距(0,0)点向下的偏移量][某个赢法]
      wins[i][j + k][count] = true;
    }
    count++;
  }
}

// 横向所有赢法, 五颗棋子横着摆
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      // wins[距(0,0)点向右的偏移量][距(0,0)点向下的偏移量][某个赢法]
      wins[j + k][i][count] = true;
    }
    count++;
  }
}

// left-top to right-bottom line
for (var i = 0; i < 11; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j + k][count] = true;
    }
    count++;
  }
}

// right-top to left-bottom line
for (var i = 0; i < 11; i++) {
  for (var j = 14; j > 3; j--) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j - k][count] = true;
    }
    count++;
  }
}
console.log('Total ways to win: ' + count);

//
// 赢法统计数组
//
var myWin = [];
var computerWin = [];

for (var i = 0; i < count; i++) {
  myWin[i] = 0;
  computerWin[i] = 0;
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = "#BFBFBF";

var logo = new Image();
logo.src = "images/logo.jpg";
logo.onload = function() {
  context.drawImage(logo, 14, 14, 421, 421);
  drawChessBoard();
};
var drawChessBoard = function() {
  for (var i = 0; i < 15; i++) {
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
  }
};

var oneStep = function(i, j, me) {
  context.beginPath();
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
  context.closePath();
  var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
  if (me) {
    gradient.addColorStop(0, "#0A0A0A");
    gradient.addColorStop(1, "#636766");
  } else {
    gradient.addColorStop(0, "gold");
    gradient.addColorStop(1, "yellow");
  }
  context.fillStyle = gradient;
  context.fill();
};

chess.onclick = function(e) {
  if (over) {
    return;
  }
  if (!me) {
    return;
  }
  var x = e.offsetX;
  var y = e.offsetY;
  var i = Math.floor(x / 30);
  var j = Math.floor(y / 30);
  if (chessBoard[i][j] === 0) {
    oneStep(i, j, me);
    if (me) { chessBoard[i][j] = 1; }

    // 更新我方各赢法落子进度
    for (var k = 0; k < count; k++) {
      if (wins[i][j][k]) {
        myWin[k]++;
        computerWin[k] = 6;
        if (myWin[k] === 5) {
          window.alert("You Win!");
          over = true;
          break;
        }
      }
    }

    // 移交控制权,换下棋方
    if (!over) {
      me = !me;
      computerAI();
    }
  }


};

var computerAI = function() {
  var myScore = [];
  var computerScore = [];
  var max = 0;
  var u = 0,
    v = 0;
  for (var i = 0; i < 15; i++) {
    myScore[i] = [];
    computerScore[i] = [];
    for (var j = 0; j < 15; j++) {
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (chessBoard[i][j] === 0) {
        for (var k = 0; k < count; k++) {
          // 如果该点存在赢法, 根据该赢法去赢法数组找到该赢法目前的落子进度,
          // 根据落子进度赋予分值
          if (wins[i][j][k]) {
            // 去我方赢法数组查询落子进度, 并赋予分值
            if (myWin[k] == 1) {
              myScore[i][j] += 200;
            } else if (myWin[k] == 2) {
              myScore[i][j] += 400;
            } else if (myWin[k] == 3) {
              myScore[i][j] += 2000;
            } else if (myWin[k] == 4) {
              myScore[i][j] += 10000;
            }
            // 去computer的赢法数组查询落子进度, 并赋予分值
            if (computerWin[k] == 1) {
              computerScore[i][j] += 220;
            } else if (computerWin[k] == 2) {
              computerScore[i][j] += 420;
            } else if (computerWin[k] == 3) {
              computerScore[i][j] += 2100;
            } else if (computerWin[k] == 4) {
              computerScore[i][j] += 50000;

              // DEBUG
              console.log('four: ' + '(' + i + ',' + j + '): ' + computerScore[i][j] + ', ' + myScore[i][j]);
            }
          }
        }

        if (myScore[i][j] > max) {
          max = myScore[i][j];
          u = i;
          v = j;
        } else if (myScore[i][j] == max) {
          if (computerScore[i][j] > computerScore[u][v]) {
            u = i;
            v = j;
          }
        }
        if (computerScore[i][j] > max) {
          max = computerScore[i][j];
          u = i;
          v = j;
        } else if (computerScore[i][j] == max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i;
            v = j;
          }
        }
      }
    }
  }
  oneStep(u, v, false);
  chessBoard[u][v] = 2;

  // DEBUG
  console.log('max: ' + max + ' ai: ' + '(' + u + ',' + v + '). ' + 'computerScore: ' + computerScore[u][v] + ', ' + 'myScore: ' + myScore[u][v]);


  // 更新computer各赢法落子进度
  for (var k = 0; k < count; k++) {
    if (wins[u][v][k]) {
      computerWin[k]++;
      myWin[k] = 6;
      if (computerWin[k] === 5) {
        window.alert("Computer Win!");
        over = true;
        break;
      }

    }
  }
  if (!over) {
    me = !me;
  }
};


//
// DEBUG function
//
/**
 * [queryK find out which win way]
 * @param  {[number]} k [a certain win way]
 * @return {[undefined]}
 */
function queryK(k) {
  for (var x = 0; x < 15; x++) {
    for (var y = 0; y < 15; y++) {
      if (wins[x][y][k]) {
        console.log('(' + x + ',' + y + ')');
      }
    }
  }
  return;
}

/**
 * [queryCoordinate find out win ways involved in a specific coordinate]
 * @param  {[number]} i
 * @param  {[number]} j
 */
function queryCoordinate(i, j) {
  for (var k = 0; k < count; k++) {
    if (wins[i][j][k]) {
      console.log('win way index: ' + k + '. myWin progress: ' + myWin[k] + '. computerWin progress: ' + computerWin[k]);
    }
  }
}


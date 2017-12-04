var chessBoard = []; /*存储旗子*/
var me = true;
var over = false; //判断结束
//定义赢法三维数组
var wins = [];

//赢法统计数组
var myWin = [];
var computerWin = [];
for(var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for(var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}

for(var i = 0; i < 15; i++) {
	wins[i] = [];
	for(var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}

//定义赢法种类
var count = 0;
for(var i = 0; i < 15; i++) {
	for(var j = 0; j < 11; j++) { //所有横线赢法
		//wins[0][0][0] =true;
		//wins[0][1][0] =true;
		//wins[0][2][0] =true;
		//wins[0][3][0] =true;
		//wins[0][4][0] =true;

		//wins[0][1][1] =true;
		//wins[0][2][1] =true;
		//wins[0][3][1] =true;
		//wins[0][4][1] =true;
		//wins[0][5][1] =true;
		for(var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}

for(var i = 0; i < 15; i++) {
	for(var j = 0; j < 11; j++) { // 所有竖线赢法

		for(var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}

for(var i = 0; i < 11; i++) {
	for(var j = 0; j < 11; j++) { // 所有斜线赢法

		for(var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}

for(var i = 0; i < 11; i++) {
	for(var j = 14; j > 3; j--) { // 所有反斜线赢法

		for(var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}

//console.log(count);

for(var i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = '#bfbfbf' //线条样式
for(var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for(var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}

/*插入背景图片*/
var logo = new Image();
logo.src = '999.jpg';
logo.onload = function() {
	context.drawImage(logo, 0, 0, 450, 450)
	drawChessBoard();

	/*画棋子*/
	/*context.beginPath();
	context.arc(200,200,100,0,2*Math.PI);  /*坐标及其半径  弧度*/
	/*context.closePath();
	var gradient = context.createRadialGradient(200,200,50,200,200,20);  //返回旗子渐变对象     两个圆心坐标+半径 
	gradient.addColorStop(0,'#0a0a0a');
	gradient.addColorStop(1,'#636766');
	context.fillStyle =gradient
	context.fill(); */
	//oneStep(0,0,true);
}

var drawChessBoard = function() {
	for(var i = 0; i < 15; i++) { /*画棋盘 15行 每个30px*/
		/*横线*/
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		context.stroke();
		/*竖线*/
		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
	}
}

var oneStep = function(i, j, me) { /*i,j分别为圆心坐标  me代表我*/
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI); /*坐标及其半径*/
	context.closePath();
	var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0); //返回旗子渐变对象     两个圆心坐标+半径 
	if(me) { //黑棋
		gradient.addColorStop(0, '#0a0a0a');
		gradient.addColorStop(1, '#636766');
	} else { //白棋
		gradient.addColorStop(0, '#d1d1d1');
		gradient.addColorStop(1, '#f9f9f9');
	}
	context.fillStyle = gradient
	context.fill(); //填充    stroke  描边      fill 填充 
}

/*实现落子*/
chess.onclick = function(e) {
	if(over) {
		return;
	}
	if(!me) {
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	
	
	if(chessBoard[i][j] == 0) //防止重复落子
		oneStep(i, j, me);
	chessBoard[i][j] = 1;
   
   
	for(var k = 0; k < count; k++) {
		if(wins[i][j][k]) { //第k种赢法
			myWin[k]++;
			computerWin[k] = 6; //设置他为异常，不会加分
			if(myWin[k] == 5) {
				window.alert('你赢了！');
				over = true;
			}
		}
	}
		if(!over) {
			me =!me;
			computerAI();
		}
	}

var computerAI = function() { //初始化计算机AI
	var myScore = [];
	var computerScore = [];

	var max = 0; //保存最高分数
	var u = 0,
		v = 0; //保存最高分数的坐标
	for(var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for(var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}

	for(var i = 0; i < 15; i++) {
		for(var j = 0; j < 15; j++) {
			if(chessBoard[i][j] == 0) {
				for(var k = 0; k < count; k++) {
					if(wins[i][j][k]) {
						if(myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if(myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if(myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if(myWin[k] == 4) {
							myScore[i][j] += 10000;
						}

						if(computerWin[k] == 1) {
							computerScore[i][j] += 220;
						} else if(computerWin[k] == 2) {
							computerScore[i][j] += 420;
						} else if(computerWin[k] == 3) {
							computerScore[i][j] += 2200;
						} else if(computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				} //判断计算机和人要落下的子   uv代表计算机

				if(myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;

				} else if(myScore[i][j] == max) {
					if(computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}

				if(computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;

				} else if(computerScore[i][j] == max) {
					if(myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}

	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for(var k = 0; k < count; k++) {
		if(wins[u][v][k]) { //第k种赢法
			computerWin[k]++;
			myWin[k] = 6; //设置他为异常，不会加分

			if(computerWin[k] == 5) {
				window.alert('计算机赢了！');
				over = true;
			}
		}
	}
		if(!over) {
			me =!me;
		}
}
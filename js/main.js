const cvs = document.getElementById('snake');
const ctx = cvs.getContext('2d');
const unit = 32;

//load images   
const groundImg = new Image()
groundImg.src = 'assets/images/ground.png';

const foodImg = new Image();
foodImg.src = 'assets/images/food.png';

const gameOverImg = new Image();
gameOverImg.src = 'assets/images/gameover.png';


//load audio files
const dead = new Audio('assets/audios/dead.mp3');
const down = new Audio('assets/audios/down.mp3');
const eat = new Audio('assets/audios/eat.mp3');
const left = new Audio('assets/audios/left.mp3');
const right = new Audio('assets/audios/right.mp3');
const up = new Audio('assets/audios/up.mp3');


//create snake
let snake = [];

//snake's head
snake[0] = {x: 9 * unit, y: 10 * unit };

let food = generateFood();
let score = 0;
let game = setInterval(draw,100);

//left, right, up, down
let direction;

//control the snake
document.addEventListener('keydown',checkDirection);

//draws a food at random place inside the map
function generateFood() 
{
    return {
        x: Math.floor(Math.random() * 17 + 1) * unit,
        y: Math.floor(Math.random() * 15 + 3) * unit
    };
}


function checkBodyCollision(snakeHead, snakeElement) 
{
    if (snakeHead.x == snakeElement.x && snakeHead.y == snakeElement.y)
        return true;
    return false;
}

function draw() 
{     
    //draw the ground
    ctx.drawImage(groundImg,0,0);

    snake.forEach((value,i, arr) => 
    {         
        ctx.fillStyle = i == 0 ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y,unit,unit);
        
        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y,unit,unit);

        //Colission with snake's body
        if (i != 0 && checkBodyCollision(snake[0], snake[i])) 
        {
            clearInterval(game);
            dead.play();            
            gameOver(ctx);
        }
                                                            
    });
        ctx.drawImage(foodImg, food.x,food.y);                                    

        //we move the snake by adding a unit ahead the snake's head and removing the last tail if no food was eaten 

        //head position
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;
                
        if (direction == 'left') snakeX -= unit;
        if (direction == 'up') snakeY -= unit;
        if (direction == 'right') snakeX += unit;
        if (direction == 'down') snakeY += unit;                

        //add new head
        let newHead = {
            x: snakeX,
            y: snakeY
        };
        
        //snake's head ate the food
        if (snakeX == food.x && snakeY == food.y) 
        {
            eat.play();
            score++;
            food = generateFood();
        }
        else
        {
            //remove last tail so the snake
            snake.pop();
        }
        
        //add new head at the beginning of the array
        snake.unshift(newHead);
        
        if (checkWallsCollision(newHead)) 
        {
            dead.play();
            clearInterval(game);
            gameOver(ctx);            
        }                                              
        gameScore(ctx);            
}

function gameOver() 
{        
    ctx.clearRect(0, 0, cvs.width, cvs.height);    
    ctx.drawImage(groundImg,0,0);
    ctx.fillStyle = 'green';
    ctx.drawImage(gameOverImg, 1.8 * unit , 2.6 * unit ,500,500);
}

function gameScore(ctx) 
{
    ctx.fillStyle = 'white';
    ctx.font = '45px Changa One';
    ctx.fillText(score, 2 * unit, 1.6 * unit);
}

function checkWallsCollision(snakeHead) 
{   
    //left || right || up || down
    if (snakeHead.x < unit || snakeHead.x > 17 * unit || snakeHead.y < 3 * unit || snakeHead.y > 17 * unit) 
        return true;
    return false;
}

function checkDirection(event) 
{    
    switch (true) 
    {
        case (event.keyCode == 37 && direction != 'right'):
            direction = 'left';
            left.play();
            break;
        case (event.keyCode == 38 && direction != 'down'):
            direction = 'up';
            up.play();
            break;
        case (event.keyCode == 39 && direction != 'left'):
            direction = 'right';
            right.play();
            break;
        case (event.keyCode == 40 && direction != 'up'):
            direction = 'down';
            down.play();
            break;
        default:
            break;
    }      
}
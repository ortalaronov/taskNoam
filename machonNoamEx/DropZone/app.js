
var score=0;
var randomBonusTime=0;
var isBonusTime=false;
let timeBonusLeft=0;
const MAX_RAND_NUM = 30;
const MIN_RAND_NUM= 20;
const TIME_TIMER_LIMIT = 180;
const TIME_IMG_LIMIT = 7;
let timePassed = 0;
let timeRegularImgPassed=TIME_IMG_LIMIT;
let timeLeft = TIME_TIMER_LIMIT;
let timeImgBonusLeft=TIME_IMG_LIMIT;
let timerInterval = null;
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
var imgNumber=1;
var isPaused=false;
var flash=null;

const COLOR_CODES = {
    info: {
      color: "green"
    },
    warning: {
      color: "orange",
      threshold: WARNING_THRESHOLD
    },
    alert: {
      color: "red",
      threshold: ALERT_THRESHOLD
    }
  };
let remainingPathColor = COLOR_CODES.info.color;
document.getElementById("score").innerHTML =score;

  
  startGame();
/*----------Function-----------*/ 

function startGame() {
    randomNumber();
    timerInterval = setInterval(() => {
        handleGame()
    }, 1000);
  }

function handleGame()
{
    handleTimer();
    if (timeLeft > 1) {
    if(!isBonusTime)
        timeBonusLeft++;
    handleRagularImg();
    if(timeBonusLeft==randomBonusTime)
        handleBonus(); 
    }
}

  function handleRagularImg() {
    //timeRegularImgPassed=timeImgPassed==TIME_IMG_LIMIT?0:timeImgPassed+1;
    if(timeRegularImgPassed<0)
    {     
      
    flashBorder(true,true);
        timeRegularImgPassed=TIME_IMG_LIMIT;
        return;
    }
    if(timeRegularImgPassed==TIME_IMG_LIMIT|| document.contains(document.getElementById('regularImg')))
        handleImgTime(timeRegularImgPassed,'secondsRegular','regularImg','img/covid19_'+imgNumber+'.png',true);
    else
        $('#secondsRegular').css("visibility", "hidden");
    timeRegularImgPassed--;
}
  
  function handleBonus() {
    isBonusTime=true;
    if(timeImgBonusLeft<0)
    {
      
    flashBorder(true,true);
        randomNumber();
        timeBonusLeft=0;
        timeImgBonusLeft=TIME_IMG_LIMIT;
        isBonusTime=false;
        return;
    }
    if(timeImgBonusLeft==TIME_IMG_LIMIT|| document.contains(document.getElementById('bonusImg')))
      handleImgTime(timeImgBonusLeft,'secondsBonus','bonusImg','img/bonus.jpg',false);
    else
    {
        timeImgBonusLeft=-1;
      $('#secondsBonus').css("visibility", "hidden");
    }

    timeImgBonusLeft--;
}


function handleImgTime(timeLeft,secondsId,imgId,imgSrc,isRegularImg)
{
      if(timeLeft==TIME_IMG_LIMIT)
       {     
           if(isRegularImg)
                 imgNumber= imgNumber>=4?1:imgNumber+1;
            $('#'+secondsId).css("visibility", "hidden");
            if (document.contains(document.getElementById(imgId))) 
                 document.getElementById(imgId).remove();
            var img = $('<img />', { 
                id: imgId,
                src: imgSrc,
                draggable:'true',
                height:'90',
                width:'90',
                ondragstart:'drag(event)'
                });
            var div=isRegularImg?'#regular':'#bonus';
            img.appendTo($(div));
        }
        if(timeLeft<=4&& timeLeft>=0)
        {
            $('#'+secondsId).css("visibility", "visible");
           document.getElementById(secondsId).innerHTML =timeLeft;
        }
        if(timeLeft==0)
        {
            handleScore();
            $('#'+secondsId).css("visibility", "hidden");
        }
   } 

function handleScore()
{
   flashBorder(true,true);
    var bonusImgExists=document.contains(document.getElementById('bonusImg'));
    var regularImgExists=document.contains(document.getElementById('regularImg'));
   var regularTime=timeRegularImgPassed<=4&&timeRegularImgPassed>=0;
   var bounosTime=timeImgBonusLeft<=4&&timeImgBonusLeft>=0;
    var iswin=false;
    if(regularTime&&!bounosTime)
    {
        if(regularImgExists)
         {   
            document.getElementById('regularImg').remove();
            score--;
          }
        else{
            score++;
            iswin=true;
        }
    } else if(bounosTime&&!regularTime)
    {
        if(bonusImgExists)
            score-=2;
        else{
            score+=2;
            iswin=true;
        }
    } else if(bounosTime&&regularTime)
    {
        if(bonusImgExists&&regularImgExists)
            score-=2;
        if(bonusImgExists&&!regularImgExists)
            score-=4;
        if(!bonusImgExists)
        {
            score+=2; 
            iswin=true;
        }
        if(regularImgExists)
            document.getElementById('regularImg').remove();
        if(bonusImgExists)
            document.getElementById('bonusImg').remove();
    }
    document.getElementById("score").innerHTML =score; 
   
    flashBorder(false,iswin);
}

function flashBorder(stopFlash,isWin)
{
    var elm = document.getElementById('#garbage');  
    
    if(stopFlash)
    {
         $('#garbage').css("border", "none");
        if(flash!=null)
          clearInterval(flash);
    }
    else
    {
        var borderPattern = false;
        flash = setInterval(setBorder,300);

        function setBorder()
        {
            if(borderPattern)
            {
                borderPattern = false;
                $('#garbage').css("border", "none");
            }
            else
            {
                borderPattern = true;
                if(isWin)
                   $('#garbage').css("border", "solid 5px green");
                else
                  $('#garbage').css("border", "solid 5px red");
            }
        }
    }
}
function randomNumber()
{
    randomBonusTime=Math.floor(Math.random() * (MAX_RAND_NUM-MIN_RAND_NUM)) + MIN_RAND_NUM;
}
/****PAUSE/PLAY***** */

function playPauseClicked(){
  flashBorder(true,true);
    isPaused=!isPaused;
    if(timeLeft !== 0)
    {
        if(isPaused)
        {
            $('#playPause').attr("src", "img/playBtn.png");
            clearInterval(timerInterval);
        }
        else 
        {
            $('#playPause').attr("src", "img/pausebtn.png");
            timerInterval = setInterval(() => {
                handleGame()
            }, 1000);
        }
    }
}

/***Drag and drop****/ 
function allowDrop(ev) {
  if(!isPaused)
    ev.preventDefault();
  }
  
  function drag(ev) {
    if(!isPaused)
    {
      if(timeRegularImgPassed<=3&&timeRegularImgPassed>0 ||timeImgBonusLeft<=3&&timeImgBonusLeft>0 )
          ev.dataTransfer.setData("text", ev.target.id);
      else
      {
        ev.preventDefault();
        return false;
      }
    }
  }
  
  function drop(ev) {
    if(!isPaused)
    {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    if(document.getElementById(data))
        document.getElementById(data).remove();
    handleScore();
    }
  }

/****Timer****/ 
 
document.getElementById("timer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label" draggable="false">${formatTime(
    timeLeft
  )}</span>
</div>
`;
function showWinOrLose()
{   
    var isWin=score>=10?true:false;
    var img = $('<img />', { 
            id: 'winLose',
            src: isWin?"img/win.jpg":"img/lose.jpg",
            draggable:'true',
            height:'200',
            width:'290',
            ondragstart:'drag(event)'
            });;
        img.appendTo($('#regular'));
        flashBorder(true,true);
        if(document.contains(document.getElementById('garbage')))
             document.getElementById('garbage').remove();
        if(document.contains(document.getElementById('bonusImg')))
             document.getElementById('bonusImg').remove();
        if(document.contains(document.getElementById('regularImg')))
             document.getElementById('regularImg').remove();
        if(document.contains(document.getElementById('secondsRegular')))
             document.getElementById('secondsRegular').remove();
        if(document.contains(document.getElementById('secondsBonus')))
             document.getElementById('secondsBonus').remove();
             
}
function onTimesUp() {
  clearInterval(timerInterval);
  showWinOrLose();
}

function handleTimer()
{
    timePassed = timePassed += 1;
    timeLeft = TIME_TIMER_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_TIMER_LIMIT;
  return rawTimeFraction - (1 / TIME_TIMER_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

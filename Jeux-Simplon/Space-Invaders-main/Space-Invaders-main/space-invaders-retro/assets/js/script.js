const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let currentShooterIndex = 209
let width = 20
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0

for (let i = 0; i < 240; i++) {
    const squares = document.createElement('div')
    grid.appendChild(squares)

}

const squares = Array.from(document.querySelectorAll('.grid div'))

var alienInvaders = [];
console.log(alienInvaders)
 
 for (var ra = 0; ra < 50; ra++) {  
      alienInvaders.push(ra);  
      console.log(Math.floor(Math.random() * 50));
       
    }   


function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}

draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}
function remove1() {
    for (let i = 0; i < alienInvaders; i++) {
        
        squares[alienInvaders[i]].classList.remove('invader')
    }
}


squares[currentShooterIndex].classList.add('shooter')

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
}

document.addEventListener('keydown', moveShooter)

function xyToIndex(x, y) {
    return x + y * width;
}

function indexToXY(index) {
    console.log(index)
    _x = index % width;
    _y = Math.floor(index / width);
    return {
        x: _x,
        y: _y
    }
}

function moveInvaders(i) {
    const LeftEdge = alienInvaders[0] % width === 0
    const RightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1 
    let j=180; 
    console.log(alienInvaders[0])
    console.log(j === alienInvaders[0])
    if(j === alienInvaders[0]){
     
        for (let j = 180; j === alienInvaders[0];j++) {
                remove()           
                clearInterval(invadersId)
            
        }
    }else {
       
        remove()  
        if (RightEdge && goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width + 1
                direction = -1
                goingRight = false
            }
        }
        if (LeftEdge && !goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width - 1
                direction = 1
                goingRight = true
            }
        }
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction
        } 
    
        draw()
  
        }
     

    

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)

    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > squares.length) {
            resultsDisplay.innerHTML = 'GAME OVER TON SCORES EST DE :'+results
            clearInterval(invadersId)
        }
    }
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN TON SCORE EST DE :'+results
        clearInterval(invadersId)
    }
}




invadersId = setInterval(moveInvaders, 900)

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        let coords = indexToXY(currentLaserIndex)
        console.log(coords)
        if(coords.y < 1){
            squares[currentLaserIndex].classList.remove('laser')
            clearInterval(laserId)
        } else {
        console.log( squares[currentLaserIndex])
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')
        }

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 200)
            clearInterval(laserId)
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results
            console.log(aliensRemoved)
        }

    }
    switch (e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 400)

    }
}
// 32 :19
document.addEventListener('keydown', shoot)

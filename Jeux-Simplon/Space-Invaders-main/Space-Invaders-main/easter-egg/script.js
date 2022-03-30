const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

console.log(scoreEl)

//set canvas
canvas.width = innerWidth
canvas.height = innerHeight

class Player { //spaceship
    constructor() {
        this.velocity = { // ini move
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.opacity = 1
        
        const image = new Image() // ini img size
        image.src = './img/alcoolo.png'
        image.onload = () => {
            const scale = 0.3
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
       /*  c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height) */
        
        c.save()
        c.globalAlpha = this.opacity
        c.translate( // set rotate
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        )
        c.rotate(this.rotation)

        c.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        )

        c.drawImage( // set img position
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        c.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile { // projectile
    constructor({position, velocity, color = 'yellow'}) {
        this.position = position
        this.velocity = velocity

        this.radius = 4
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({position, velocity, radius, color, fades}) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades)
        this.opacity -= 0.01
    }
}

class InvaderProjectile { // invaders projectiles
    constructor({position, velocity,}) {
        this.position = position
        this.velocity = velocity

        this.width = 8
        this.height = 15
    }

    draw() {
        c.fillStyle = 'yellow'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader { //invader
    constructor({ position }) {
        this.velocity = { // ini move
            x: 0,
            y: 0
        }
        
        const image = new Image() // ini img size
        image.src = './img/beer.png'
        image.onload = () => {
            const scale = 0.05
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
       /*  c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height) */

        c.drawImage( // set img position
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles){
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 6
            }
        }))
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 35

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * 35,
                            y: y * 35
                        }
                    })
                )
            }
        }
        /* console.log(this.invaders) */
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        this.velocity.y = 0

        if (this.position.x +this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

class Bomb {
    static radius = 30
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 0
        this.color = 'green'
        this.opacity = 1
        this.active = false

        gsap.to(this, {
            radius: 30
        })
    }
    
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.closePath()
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (
            this.position.x + this.radius + this.velocity.x >= canvas.width || 
            this.position.x - this.radius + this.velocity.x <= 0
        ) { 
            this.velocity.x = -this.velocity.x
        } else if (
            this.position.y + this.radius + this.velocity.y >= canvas.height || 
            this.position.y - this.radius + this.velocity.y <= 0
        )   this.velocity.y = -this.velocity.y
    }

        explode() {
            this.active = true
            this.velocity.x = 0
            this.velocity.y = 0
            gsap.to(this, {
                radius: 500, //taille explosion bombe
                color: 'yellow'
            })

            gsap.to(this, {
                delay: .1,
                opacity: 0,
                duration: 0.15
            })
    }
}

class PowerUp { 
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#324C0E'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const bombs = []
const powerUps = []

const keys = { //ini input
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed : false
    }
}

let frames = 0
let randomInterval = (Math.floor(Math.random() * 500) + 500)
let game = {
    over: false,
    active: true
}

let score = 0

function createParticles({object, color, fades}) {
    for (let i = 0; i < 15; i++) { 
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) *2
            },
            radius: Math.random() * 15,
            color: color || 'white',
            fades: true
            })
        )
    }
}

function createScoreLabel({score = 100, object}) {
    const scoreLabel = document.createElement('label')
        scoreLabel.innerHTML = 100
        scoreLabel.style.position = 'absolute'
        scoreLabel.style.color = 'blue'
        scoreLabel.style.top = object.position.y + 'px'
        scoreLabel.style.left = object.position.x + 'px'
        scoreLabel.style.userSelect = 'none'
        document.querySelector('#parentDiv').appendChild(scoreLabel)
        gsap.to(scoreLabel, {
            opacity: 0,
            y: -30,
            duration: .75,
            onComplete: () => {
                document.querySelector('#parentDiv').removeChild(scoreLabel)
            }
        })
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = '#665A15'
    c.fillRect(0, 0, canvas.width, canvas.height)

    console.log(powerUps)

    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps [i]

        if (powerUp.position.x - powerUp.radius >= canvas.width)
            powerUps.splice(i, 1)
        else
            powerUp.update()
    }

    //spawn powerups
    if (frames % 450 === 0) { //apparition powerup toute les x frame et nombre de bombe max a l'ecran
        powerUps.push(
            new PowerUp({
                position: {
                    x: 0,
                    y: Math.random() * 300 + 15 
                },
                velocity: {
                    x: 5,
                    y: 0
                }
            })
        )
    }

    // spawn bombs
    if (frames % 200 === 0 && bombs.length < 3) { //apparition bombe toute les x frame et nombre de bombe max a l'ecran
        bombs.push(
            new Bomb({
                position: {
                    x: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
                    y: randomBetween(Bomb.radius, canvas.height - Bomb.radius)
                },
                velocity: {
                    x: (Math.random() - 0.5)  * 15, //vitesse x bomb
                    y: (Math.random() - 0.5) * 15 //vitesse y bomb
                }
            })
        )
    }

    for (let i = bombs.length - 1; i >= 0; i--) {
        const bomb = bombs[i]

        if (bomb.opacity <= 0) {
            bombs.splice(i, 1)
        } else {
        bomb.update()
        }
    } 

    player.update()
    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = particle.radius
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else {
            particle.update()
        }
    })

    /* console.log(particles) */

    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >=  canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0) 
        } else invaderProjectile.update()

        //projectile hits player
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x + invaderProjectile.width >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width
        ) {
            console.log('you lose')

            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0)

            setTimeout(() => {
                game.active = false
            }, 2000)

            setTimeout(() => {
                window.location.reload();
            }, 5000)

            createParticles({
                object: player,
                color: '#5F8C3B',
                fades: true
            })

        }
    })

/* console.log(invaderProjectiles) */

    for (let i = projectiles.length -1; i >= 0; i--) { 
        const projectile = projectiles [i]

    for (let j = bombs.length -1; j >= 0; j--) { 
        const bomb = bombs [j]

        // si le projectile touche la bombe, il disparait
        if (
            Math.hypot(
                projectile.position.x - bomb.position.x, projectile.position.y - bomb.position.y) < projectile.radius + bomb.radius && !bomb.active) {
            projectiles.splice(i, 1)
            bomb.explode()
        }
    }

        if (projectile.position.y + projectile.radius <= 0) {
            projectiles.splice(i, 1)
        } else {
            projectile.update()
        }
    

    for (let j = powerUps.length -1; j >= 0; j--) { 
        const powerUp = powerUps[j]

        // si le projectile touche la bombe, il disparait
        if (
            Math.hypot(
                projectile.position.x - powerUp.position.x, projectile.position.y - powerUp.position.y) < 
                projectile.radius + powerUp.radius) {
                projectiles.splice(i, 1)
                powerUps.splice(j, 1)
                player.powerUp = 'MachineGun'
                console.log('powerup started')

                setTimeout(() => {
                    player.powerUp = null
                    console.log('powerup endend')
                }, 2000) //time powerup
        }
    }

}

        
    grids.forEach((grid, gridIndex) => {
        grid.update()

        //spawn projectiles
    if (frames % 80 === 0 && grid.invaders.length > 0) { // frame % = un tir tout les x frame
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
            invaderProjectiles
        )
    }

    for (let i = grid.invaders.length -1; i >= 0; i--) {
        const invader = grid.invaders[i]

            invader.update({velocity: grid.velocity})
            
            for (let j = bombs.length -1; j >= 0; j--) { 
                const bomb = bombs [j]
                
                const invaderRadius = 15
                // si la bombe touche les invaders, ils disparaissent 
                if (
                    Math.hypot(
                        invader.position.x - bomb.position.x, invader.position.y - bomb.position.y) < invaderRadius + bomb.radius && bomb.active
                    ) {
                        score += 100
                        scoreEl.innerHTML = score
                        grid.invaders.splice(i, 1)
                        createScoreLabel({
                            object: invader,
                            score: 100
                        })

                        createParticles({
                            object: invader,
                            fades: true
                        })
                }
            }

            //projectiles hit enemy
            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius <=
                        invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >= 
                        invader.position.x && 
                    projectile.position.x - projectile.radius <= 
                        invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= 
                        invader.position.y) 
                    {

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                         (invader2) => invader2 === invader
                        )
                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        )
                        
                        //remove invader and projectile
                        if (invaderFound && projectileFound) {
                            score += 100
                            console.log(score)


                            scoreEl.innerHTML = score
                            
                        
                            //dynamic score level
                            createScoreLabel({
                                object: invader
                            })

                            createParticles({
                                object: invader,
                                fades: true
                            })

                            for (let i = 0; i < 15; i++) { 
                                particles.push(new Particle({
                                    position: {
                                        x: invader.position.x + invader.width / 2,
                                        y: invader.position.y + invader.height / 2
                                    },
                                    velocity: {
                                        x: (Math.random() - 0.5) * 30, //deplacement particule explosion invader
                                        y: (Math.random() - 0.5) * 30
                                    },
                                    radius: Math.random() * 8,
                                    color: 'yellow',
                                    fades: true
                                    })
                                )
                            }

                        grid.invaders.splice(i, 1)
                        projectiles.splice(j, 1)

                        if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length - 1]

                            grid.width = 
                                lastInvader.position.x -
                                firstInvader.position.x + 
                                lastInvader.width
                            grid.position.x = firstInvader.position.x
                        } else {
                            grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        }
    }) 

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -1
    } else if (keys.d.pressed  && player.position.x +player.width <= canvas.width) {
        player.velocity.x = 7
        player.rotation = 1
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    console.log(frames)
    //spawning enemies
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 200 + 400)
        frames = 0
        /* console.log(randomInterval) */
    }

    //spawning powerup

    if (keys.space.pressed && player.powerUp === 'MachineGun' && frames % 3 === 0)
    projectiles.push(
        new Projectile({
            position: {
                x: player.position.x + player.width / 2,
                y: player.position.y
            },
            velocity: {
                x: 0,
                y: -10
            },
            color: '#324C0E'
        })
    )
    
    frames++
}

animate()

var cheatCode = "";

addEventListener('keydown', ({key}) => { // when keydown -> move
    if (game.over) return

    switch (key) {
        case 'a':
            /* console.log('left') */
            keys.a.pressed = true
            cheatCode+="a";
            if (cheatCode!="a"){cheatCode=""}
            console.log(cheatCode)
            break
        case 'd':
            /* console.log('right') */
            keys.d.pressed = true
            break
        case ' ':
            /* console.log('space') */
            keys.space.pressed = true

            if (player.powerUp === 'MachineGun') return

            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    }
                })
            )
            /* console.log(projectiles) */
            break
        case 'l':
            cheatCode+="l";
            if (cheatCode!="al"&&cheatCode!="alcool"){cheatCode=""}
            if (cheatCode=="alcool"){cheat()}
            console.log(cheatCode)
            break

        case 'c':
            cheatCode+="c";
            if (cheatCode!="alc"){cheatCode=""}
            console.log(cheatCode)
            break

        case 'o':
            cheatCode+="o";
            if (cheatCode!="alco"&&cheatCode!="alcoo"){cheatCode=""}
            console.log(cheatCode)
            break
    }
})

addEventListener('keyup', ({key}) => { // when keyup -> stop move
    switch (key) {
        case 'a':
            /* console.log('left') */
            keys.a.pressed = false
            break
        case 'd':
            /* console.log('right') */
            keys.d.pressed = false
            break
        case ' ':
            /* console.log('space') */
            keys.space.pressed = false
            break
    }
})

function cheat(){
    console.log("je triche")
    location = "../space-invadersvg/index.html"
    }
    
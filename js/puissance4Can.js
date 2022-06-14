const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth
canvas.height = innerHeight

// CREATION DES MURS
class Boundary{
    static width = 40;
    static height = 40;
    constructor({position, image}){
        this.position = position;
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw(){
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y,
        )
    }

    
}
// CREATION DES CERCLE
class Circles{
    static width = 40;
    static height = 40;
    constructor({position, image}){
        this.position = position;
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw(){
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y,
        )
    }
}
// CREATION DES JOURS
class Player{
    constructor({position, velocity, colory, tour, id}){
        this.position = position;
        this.velocity = velocity;
        this.radius = 19;
        this.color = colory;
        this.tour = tour;
        this.id = id
    }
    draw(){
        c.beginPath()
        c.arc(
            this.position.x,
            this.position.y, 
            this.radius, 0,
            Math.PI * 2
        )
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
// LES CONSTANTS DU JEUX
const boundaries = []
const circles = []
const player1 = new Player({
    
    position: {
        x: Boundary.width + 20, 
        y: Boundary.height + 20
    },
    velocity: {
        x: 0, 
        y: 0
    },
    colory:'red',
    tour: false,
    id:'1'
})
const player2 = new Player({
    position: {
        x: Boundary.width / 2, 
        y: Boundary.height / 2
    },
    velocity: {
        x: 40, 
        y: 0
    },
    colory: 'yellow',
    tour: false,
    id:'2'
})
let turn
let firstRound = 0

const keys = {
    enter: {
        pressed: false
    },
    a: {
        pressed: false
    },
    z: {
        pressed: false
    },
    e: {
        pressed: false
    },
    r: {
        pressed: false
    },
    t: {
        pressed: false
    },
    y: {
        pressed: false
    },
    u: {
        pressed: false
    }
}
let lastkey = ''
// la map du terrain
const map = [
    ['1','-','-','-','-','-','-','-','2'],
    ['|',' ',' ',' ',' ',' ',' ',' ','|'],
    ['|','0','0','0','0','0','0','0','|'],
    ['|','0','0','0','0','0','0','0','|'],
    ['|','0','0','0','0','0','0','0','|'],
    ['|','0','0','0','0','0','0','0','|'],
    ['|','0','0','0','0','0','0','0','|'],
    ['|','0','0','0','0','0','0','0','|'],
    ['4','-','-','-','-','-','-','-','3']
]
// la fonction pour linsertion des image a la map
function creatImage(src) {
    const image = new Image()
    image.src = src
    return image
}
// creation du terrain
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                           x: Boundary.width * j,
                           y: Boundary.height * i,
                        },
                        image: creatImage('../img/BASMILLIEU.png')
                   })
                )
            break;
            case '0':
                circles.push(
                    new Circles({
                        position: {
                            x: Circles.width * j,
                            y: Circles.height * i,
                        }, 
                        image: creatImage('../img/les ronds.png')  
                   })
                )
            break;
            case '|':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, 
                        image: creatImage('../img/MILLIEUDROITE.png')  
                   })
                )
            break;
            case '1':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, 
                        image: creatImage('../img/HAUTGAUCHE.png')  
                   })
                )
            break;
            case '2':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, 
                        image: creatImage('../img/HAUTDROITE.png')  
                   })
                )
            break;
            case '3':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, 
                        image: creatImage('../img/BASDROITE.png')  
                   })
                )
            break;
            case '4':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, 
                        image: creatImage('../img/BASGAUCHE.png')  
                   })
                )
            break;
        }
    })
})
function playerColidesWithBottom({
    round,
    bottomBorder
}){
    return(
        round.position.y - round.radius + round.velocity.y <= bottomBorder.position.y + bottomBorder.height &&
        round.position.x + round.radius + round.velocity.x >= bottomBorder.position.x &&
        round.position.y + round.radius + round.velocity.y >= bottomBorder.position.y &&
        round.position.x - round.radius + round.velocity.x <= bottomBorder.position.x + bottomBorder.width
    )
}
function animate(){
    requestAnimationFrame(animate)
    // supression de la trainer du jours sur le platteau
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.enter.pressed && lastkey === 'Enter') {    
        player1.velocity.y = 5
    } else if (keys.a.pressed && lastkey === 'a') {
        player1.position.x = 60
    } else if (keys.z.pressed && lastkey === 'z') {
        player1.position.x = 100
    } else if (keys.e.pressed && lastkey === 'e') {
        player1.position.x = 140
    } else if (keys.r.pressed && lastkey === 'r') {
        player1.position.x = 180
    } else if (keys.t.pressed && lastkey === 't') {
        player1.position.x = 220
    } else if (keys.y.pressed && lastkey === 'y') {
        player1.position.x = 260
    } else if (keys.u.pressed && lastkey === 'u') {
        player1.position.x = 300
    }

    
    for(let i = 0; i < boundaries.length; i++) {
        console.log(i + ' ' + boundaries.length)
        const boundary = boundaries[i]
        boundary.draw()
        // les colisions
        if (
            playerColidesWithBottom({
                round: player1,
                bottomBorder: boundary
            }) 
        ){
            
            console.log('je suis bloqué')

            player1.velocity.y = 0
            player1.velocity.x = 0 
            player2.tour.true
        }
    }

    console.log("bruh")

    // boundaries.forEach((boundary)=>{
    //     boundary.draw()
    //     // les colisions
    //     if (
    //         plyerColidesWithBottom({
    //             round: player1,
    //             bottomBorder: boundary
    //         })
    //     ){
    //         console.log('je suis bloqué')
    //         player1.velocity.y = 0
    //         player1.velocity.x = 0 
            
    //     }
    // })
    
    
    // function switchPlayer(currentPlayer){
        
    //     if (currentPlayer === player1){
    //         currentP = player2;

    //     }else{
    //         currentP = player1;
    //     }
    //     return currentP;
    // }
    
    circles.forEach((circle)=>{
        circle.draw()
    })
   
    player1.update() 
    // player2.update()

}

function start() {
    if (firstRound == 0) turn = player1;
        turn.tour = true;
        
        if (turn.tour == true){
            animate()
            addEventListener('keydown', ({key})=>{
                
                switch (key) {
                    case 'Enter':
                        keys.enter.pressed = true
                        lastkey = 'Enter'
                        
                        break;
                    case 'a':
                        keys.a.pressed = true
                        lastkey = 'a'
                        break;
                    case 'z':
                        keys.z.pressed = true
                        lastkey = 'z'
                        break;
                    case 'e':
                        keys.e.pressed = true
                        lastkey = 'e'
                        break;
                    case 'r':
                        keys.r.pressed = true
                        lastkey = 'r'
                    break;
                    case 't':
                        keys.t.pressed = true
                        lastkey = 't'
                    break;
                    case 'y':
                        keys.y.pressed = true
                        lastkey = 'y'
                    break;
                    case 'u':
                        keys.u.pressed = true
                        lastkey = 'u'
                    break;
                }
            })
            // addEventListener('keyup', ({key})=>{
                
            //     switch (key) {
            //         case 'Enter':
            //             keys.enter.pressed = false
            //             lastkey = 'Enter'
            //         break;
                    
            //     }
            // })
            
            if (player1.velocity.y == 0 || player1.velocity.x == 0){
                turn.tour = false;
                if (turn.id == player1.id){
                    turn = player2.update()
                    firstRound++;
                } else{
                    turn = player1.update()
                    firstRound++;
                }
            }
        }

    
    
}
// animation pour mettre en place les mouvement et autre

const roll = document.getElementById("start");

roll.addEventListener("click", start);

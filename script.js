const BACKGROUND = "black"
const FOREGROUND = "green"

const canvas = document.getElementById("graph")

const ctx = canvas.getContext("2d")

function resize() { 
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    

    
}
resize()

function screen(p) {
    // converts -1 to 1 to width/height num
    return {
        x: (p.x + 1)/2 * canvas.width,
        y: (1 - (p.y + 1)/2) * canvas.height
    }
    
}

function point({x, y}) {
    const size = 20
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - size/2, y - size/2, size, size)

}



function project({x, y, z}) {
    //applies perspective projection
    return {
        x: x/z,
        y: y/z
    }
}

function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0,0, canvas.width, canvas.height)
}

const vs = [
    {x: 0.5, y: 0.5, z: 0.5},
    {x: -0.5, y: 0.5, z: 0.5},
    {x: 0.5, y: -0.5, z: 0.5},
    {x: -0.5, y: -0.5, z: 0.5},
    
    {x: 0.5, y: 0.5, z: -0.5},
    {x: -0.5, y: 0.5, z: -0.5},
    {x: 0.5, y: -0.5, z: -0.5},
    {x: -0.5, y: -0.5, z: -0.5}
    
]

const dots = [
    {x: -0.5, y: 0, z: 1},
    {x: 0.5, y: 0, z: 1},
    {x: 0, y: 0.5, z: 1},
    {x: 0,  y: -0.5,z:1 }
]
const FPS = 60 
let dz = 2
let angle = 0

function frame() {  
   
    const dt = 1/FPS
    //dz += 1 * dt

    angle += 0.5 * Math.PI* dt

    clear()
    for (const v of vs) {
        const rotated_v = rotate_xyz(v, angle)
        point(screen(project(translateZ(rotated_v, dz))))
        for (const dot of dots) {
            const dotToLine = screen(project(dot))
            line(screen(project(translateZ(rotated_v, dz))), dotToLine)
        }
        
    }   
    setTimeout(frame, 1000/FPS)
}

frame()

function translateZ({x, y, z}, dz) {
    return {x, y, z: z + dz}
}


function rotate_xyz({x, y, z}, angle) {
    
    const c = Math.cos(angle)
    const s = Math.sin(angle)

    //rotate in plane xz not xy so y stays the same
    return {
        x: x*c + z*s,
        y: y,   
        z: -x*s + z*c
    }
}


function line(p1, p2) {
    ctx.strokeStyle = "green"

    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)

    ctx.stroke()
}

window.addEventListener("resize", resize)




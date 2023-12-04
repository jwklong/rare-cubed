function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

var temp = {}

const mutations = [
    ['Transparent', 4, (cube) => {
        for (let side of Object.values(cube.children).filter(x => x.classList.contains('side'))) {
            side.style.opacity = "0.4"
        }
        return cube
    }, 0],
    ['Rotated', 5, (cube) => {
        temp.rotate = getRandomInt(-165, -105)
        cube.style.transform = `rotateX(235deg) rotateZ(${temp.rotate}deg)`
        return cube
    }, 100],
    ['Colored', 10, (cube) => {
      cube.style.setProperty("--color", `hsl(${Math.floor(Math.random()*360)}deg 100% 86.67%)`)
      return cube
    }, 0],
    ['Big', 12, (cube) => {
        cube.style.scale = "1.3"
        return cube
    }, 800],
    ['Tilted', 15, (cube) => {
        cube.style.transform = `rotateX(${getRandomInt(220, 250)}deg) rotateZ(${temp.rotate || -135}deg)`
        return cube
    }, 250],
    ['Ringed', 25, (cube) => {
        let ring = document.createElement('div')
        ring.classList.add('ring')
        cube.appendChild(ring)
        return cube
    }, 500],
    ['Inverted', 35, (cube) => {
        for (let side of Object.values(cube.children).filter(x => x.classList.contains('side'))) {
            side.style.filter += "invert()"
        }
        return cube
    }, 1500],
    ['Ghost', 40, (cube) => {
        cube.querySelector('.front').style.setProperty("-webkit-mask-image", "linear-gradient(#ffff, #fff0)")
        cube.querySelector('.left').style.setProperty("-webkit-mask-image", "linear-gradient(#ffff, #fff0)")
        return cube
    }, 10000],
    ['Outlined', 50, (cube) => {
        cube.classList.add("outlined")
        return cube
    }, 25000],
    ['Minecraft', 64, (cube) => {
        if (cube.style.getPropertyValue("--color") == "") cube.style.setProperty("--color", "#bbffc4")
        var mcside = document.createElement('div')
        mcside.classList.add('mcside')
        cube.querySelector('.front').appendChild(mcside.cloneNode())
        cube.querySelector('.left').appendChild(mcside)
        return cube
    }, 4000],
    ['Billy', 200, (cube) => {
        var billy = document.createElement('span')
        billy.classList.add('billy')
        billy.innerText = '¦)'
        cube.querySelector('.front').appendChild(billy)
        return cube
    }, 100000],
]

for (let mutation of mutations.sort((a, b) => a[3] - b[3])) {
    mutation[4] = mutation[3] == 0

    if (!mutation[4]) {
        let mutbuy = document.createElement('div')
        mutbuy.classList.add('mutation')
        mutbuy.innerHTML = `<span>${mutation[0]}</span> `
        let btn = document.createElement('div')
        btn.classList.add('buy')
        btn.innerText = '$' + notation(mutation[3])
        btn.onclick = function() {
            if (money >= mutation[3]) {
                money -= mutation[3]
                mutation[4] = true
                document.getElementById('money').innerText = "$" + notation(money)
                mutbuy.remove()
            }
        }
        mutbuy.appendChild(btn)
        buymutations.appendChild(mutbuy)
    }
}

let money = 0

//notation
function notation(number) {
    number = Number(number)
    if (number >= 1e18) {
      return (Math.floor(number / 1e16) / 100).toString() + 'Qi'
    } else if (number >= 1e15) {
      return (Math.floor(number / 1e13) / 100).toString() + 'Qa'
    } else if (number >= 1e12) {
      return (Math.floor(number / 1e10) / 100).toString() + 'T'
    } else if (number >= 1e9) {
      return (Math.floor(number / 1e7) / 100).toString() + 'B'
    } else if (number >= 1e6) {
      return (Math.floor(number / 1e4) / 100).toString() + 'M'
    } else if (number >= 1e3) {
      return (Math.floor(number / 1e1) / 100).toString() + 'K'
    }
    return number.toString()
  }

function reroll() {
    //init lads
    temp = {}
    let text = 'Cube'
    let cube = document.createElement('div')
    var rarity = 1 // people using hacks to automate, heres your golden ticket
    cube.id = 'cube'
    cube.innerHTML = `<div class="side top"></div><div class="side left"></div><div class="side front"></div>`
    //apply mutations
    for (var mutation of mutations.filter(x => x[4] == true)) {
        if (1/mutation[1] < Math.random()) continue
        
        cube = mutation[2](cube)
        text = mutation[0] + " " + text
        rarity *= mutation[1]
    }

    //name check
    if (text == 'Cube') text = 'Normal Cube'

    //end
    document.getElementById('cube').remove()
    document.getElementById('main').appendChild(cube)
    document.getElementById('cubename').innerText = text
    document.getElementById('cuberarity').innerText = "1 / " + notation(rarity)
    money += rarity
    document.getElementById('money').innerText = "$" + notation(money)

    //just sold my car to we buy any car
    if (rarity >= 1000) {
        if (rarelog.children.length >= 3) rarelog.children[2].remove()

        let logel = document.createElement('div')
        logel.innerHTML = `${text}<br>1 / ${notation(rarity)}`
        rarelog.insertBefore(logel, rarelog.firstChild)
    }
}
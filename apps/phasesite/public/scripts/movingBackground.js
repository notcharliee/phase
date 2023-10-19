'use strict'

let x = 0, y = 0
let bgGrid = document.getElementById('bg-grid').style

const updateBackgroundPosition = () => {
    if(document.body.clientWidth < 700) x += 0.5, y -= 0.5
    else x += 0.3, y -= 0.3

    bgGrid.backgroundPositionX = `${x}px`
    bgGrid.backgroundPositionY = `${y}px`

    requestAnimationFrame(updateBackgroundPosition)
}

requestAnimationFrame(() => { updateBackgroundPosition() })
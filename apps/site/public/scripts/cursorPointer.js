'use strict'

let blob = document.getElementById('cursor-blob')
    
window.onmousemove = event => { 
    let { clientX, clientY } = event
    if(!blob || document.body.clientWidth < 700) return

    let keyframes = { transform: `translate(${clientX}px, ${clientY}px)` }

    blob.style.opacity = '1'
    blob.style.scale = '1'

    blob.animate(keyframes, { duration: 1500, fill: 'forwards' })

    let target = event.target
    let interactable = target.closest('a')

    if(interactable) {
        blob.style.height = '1.25rem'
        blob.style.width = '1.25rem'
    } else {
        blob.style.height = '0.75rem'
        blob.style.width = '0.75rem'
    }
}
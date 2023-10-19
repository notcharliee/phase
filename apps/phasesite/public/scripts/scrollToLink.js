'use strict'

let urlParams = new URLSearchParams(window.location.search)
    let param = urlParams.get('scrollTo')

    if(param) {
        let paramData = param.split('-')
        let element = document.getElementById('#'+paramData[0])

        if(element) window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - (Number(paramData[1]) || 0))
    } else window.scrollTo(0, 0)

    document.querySelectorAll('a').forEach(el => {
        el.addEventListener('click', (ev) => {
            if(el.href.includes('scrollTo=')) {
                ev.preventDefault()

                let query = el.href.split('scrollTo=')[1].split(';')[0]

                let paramData = query.split('-')
                let element = document.getElementById('#'+paramData[0])

                if(element) window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - (Number(paramData[1]) || 0))
            }
        })
    })
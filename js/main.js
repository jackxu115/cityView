// 1 get all the relative dom elements to use for rendering
// 2 fetch pictures from backend
// 3 render them
let objs = {
    body: null,
    inputCity: null,
    btnSearch: null,
    carousel: null,
    preUrl: null,
    btnPrev: null,
    btnNext: null,
    page: {
        cursor: 1,
        total: 1
    }
}

const unsplashKey = `j1EC1BFWSwkAI48YZlUAfXjmVQn_mJJ4oFTgzd7X14E`
const strClassSelected = 'selected'


objs.body = document.querySelector('body')
objs.inputCity = document.querySelector('.searchBar input')
objs.btnSearch = document.querySelector('.searchBar button')
objs.carousel = document.querySelector('.gallery')
objs.btnPrev = document.querySelector('.btnNav.prev')
objs.btnNext = document.querySelector('.btnNav.next')

const cbInput = event => {
    if (event.key === 'Enter' && objs.inputCity.value.trim().length) {
        fetchData()
    }
}
const setKeyEvent = () => {
    objs.body.addEventListener('keyup', event => {
        if (event.key === 'ArrowLeft') prevPage()
        if (event.key === 'ArrowRight') nextPage()
    })

    let arrEle = [objs.inputCity, objs.btnPrev, objs.btnNext]
    let eventName = ['keyup', 'click', 'click']
    let arrCB = [cbInput, prevPage, nextPage]

    arrEle.forEach((element, index) => {
        element.addEventListener(eventName[index], arrCB[index])
    })
}

const prevPage = () => {
    if (objs.page.cursor > 1) {
        objs.page.cursor--
    }
    fetchData()
}

const nextPage = () => {
    if (objs.page.cursor < objs.page.total) {
        objs.page.cursor++
    }
    fetchData()
}

const fetchData = () => {
    const newCity = objs.inputCity.value.trim().toLowerCase() || 'macbook'
    fetch(`https://api.unsplash.com/search/photos?client_id=${unsplashKey}&query=${newCity}&orientation=landscape&page=${objs.page.cursor}`)
        .then(response => response.json())
        .then(data => {
            //todo: rendering carousel
            console.log('data raw', data)
            renderImages(data.results)
            objs.page.total = data.total_pages
        })
}

const renderImages = arrImages => {
    // set background image with new data got
    const img = arrImages[0].urls.full
    objs.body.style.background = `url('${img}') center center/cover fixed no-repeat`
    // create carousel
    createCarousel(arrImages)
}

const setImageSelected = eleImage => {
    let images = document.querySelectorAll('[data-index]')
    images.forEach(element => {
        element.className = ''
    })
    eleImage.className = strClassSelected
}

const updateBackgroundImage = event => {
    const img = event.target.dataset.url
    objs.body.style.background = `url('${img}') center center/cover fixed no-repeat`
    objs.preUrl = img
    setImageSelected(event.target)

}

const mouseenterBackgroundImage = event => {
    let img = event.target.dataset.url
    if(!objs.preUrl) {
        let str =  objs.body.style.background
        let iStart = str.indexOf('"')
        let iEnd = str.indexOf('"', iStart + 1)
        str = str.slice(iStart + 1, iEnd)
        objs.preUrl = str
    }
    objs.body.style.background = `url('${img}') center center/cover fixed no-repeat`
}

const mouseleaveBackgroundImage = event => {
    if(objs.preUrl) {
        objs.body.style.background = `url('${objs.preUrl}') center center/cover fixed no-repeat`
        objs.preUrl = null
    }
}

const  createCarousel = (arrImages) => {
    //
    objs.carousel.innerHTML = ''
    arrImages.forEach((element, index) => {
        let item = document.createElement('div')
        if(index === 0) {
            item.className = strClassSelected
        }

        const img = element.urls.regular
        item.style.background = `url('${img}') center center/cover fixed no-repeat`
        item.style.backgroundSize = 'cover'
        item.dataset.index = index
        item.style.animation = 'fadeIn 0.25s forwards'
        item.style.animationDelay = `${0.1 * index}s`
        item.dataset.url = element.urls.full
        objs.carousel.appendChild(item)

        item.addEventListener('click', updateBackgroundImage)

        item.addEventListener('mouseenter', mouseenterBackgroundImage)

        item.addEventListener('mouseleave', mouseleaveBackgroundImage)
    })
}

fetchData()
setKeyEvent()
objs.btnSearch.addEventListener('click', fetchData)



















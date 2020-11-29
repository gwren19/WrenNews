const BASE_URL = 'https://api.currentsapi.services/v1';
const KEY = config.api_key
const url = `${BASE_URL}/latest-news?${KEY}&language=en`;

async function fetchNews() {
    try {
        const response = await fetch(url);
        const { news } = await response.json();

        return news;
    } catch (error) {
        console.error(error);
    }
    
}

function photosHTML(image) {
    if (image !== 'None') {
        return `<img src='${image}' />`
    } else {
        return `<img src='https://joebalestrino.com/wp-content/uploads/2019/02/Marketplace-Lending-News.jpg' />`
    }
}

function createNewsCard(card) {
    const newsCard = $(`
        <div>
        <a href='${card.url}'>
            <article class='card'>
                ${ photosHTML(card.image)}
            <footer>
                <h4 class='card-header'>${card.title}</h4>
                <p class='card-body'>${card.description}</p>
                <div class='card-footer center text-center'><p>Author: ${card.author}</p></div>
            </footer>
        </a>        
        </div>      
    `)

    return newsCard
}

function renderCard(news) {
    news.forEach(card => {
        $('.flex.two').append(createNewsCard(card));
    });
}

async function fetchAllCategories() {
    const categoriesURL = `${BASE_URL}/available/categories?${KEY}`;

    if (localStorage.getItem('categories')) {
        return JSON.parse(localStorage.getItem('categories'))
    }

    try {
        const response = await fetch(categoriesURL);
        const { categories } = await response.json();

        localStorage.setItem('categories', JSON.stringify(categories));

        return categories;
    } catch (error) {
        console.error(error);
    }
}

async function fetchAllRegions() {
    const regionsURL = `${BASE_URL}/available/regions?${KEY}`;

    if (localStorage.getItem('regions')) {
        return JSON.parse(localStorage.getItem('regions'))
    }

    try {
        const response = await fetch(regionsURL);
        const { regions } = await response.json();

        localStorage.setItem('regions', JSON.stringify(regions));

        return regions;
    } catch (error) {
        console.error(error);
    }
}

async function fetchAllLanguages() {
    const languagesURL = `${BASE_URL}/available/languages?${KEY}`;

    if (localStorage.getItem('languages')) {
        return JSON.parse(localStorage.getItem('languages'))
    }

    try {
        const response = await fetch(languagesURL);
        const { languages } = await response.json();

        localStorage.setItem('languages', JSON.stringify(languages));
        return languages;
    } catch (error) {
        console.error(error);
    }
}

async function prefetchAllLists() {
    try {
        const [ categories, regions, languages ] = await Promise.all([fetchAllCategories(), fetchAllRegions(), fetchAllLanguages()]);

        categories.forEach(category => {
            const newOptionTag = $(`<option value="${category}">${category}</option>`);
            $('#select-category').append(newOptionTag);
        });

        for (const value in regions) {
            const newOptionTag = $(`<option value="${regions[value]}">${value}</option>`);
            $('#select-region').append(newOptionTag);
        };

        for (const value in languages) {
            const newOptionTag = $(`<option value="${languages[value]}">${value}</option>`);
            $('#select-language').append(newOptionTag);
        };

    } catch (error) {
        console.error(error);
    }
}

function buildSearchString() {
    const searchBarVal = $('#keywords').val();
    const categoryVal = $('#select-category').val();
    const regionVal = $('#select-region').val();
    const startVal = $('#select-start').val();
    const endVal = $('#select-end').val();
    const languageVal = $('#select-language').val();
    const buildSearchURL = `${BASE_URL}/search?keywords=${searchBarVal}&${KEY}&language=${languageVal}&country=${regionVal}&categories=${categoryVal}&start_date=${startVal}&end_date=${endVal}`;

    return encodeURI(buildSearchURL)
} 

$('#search').on('submit', async function(event) {
    event.preventDefault();

    try {
        const url = await buildSearchString();
        const response = await fetch(url);
        const data = await response.json();

        $('.flex.two').empty();
        data.news.forEach(data => {
            $('.flex.two').append(createNewsCard(data)); 
        });
    } catch (error) {
        console.error(error);
        
    }
});

function bootstrap() {
    fetchNews().then(renderCard);
    prefetchAllLists();  
}

bootstrap();
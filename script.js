var ulShow = document.querySelectorAll('.dropdown-text-icon');
var dropDown = document.querySelector('.dropdown-nav');
var container = document.querySelector('.container');
var dropDownNav = document.querySelectorAll('.nav-item');
var search = document.querySelector('#countrySearch');
var loading = document.querySelector('.load-cover');


for(var i=0; i<ulShow.length; i++){
    ulShow[i].addEventListener('click',()=>{
        dropDown.classList.toggle('ul-active');
    })
};

var theme = 'True';

// theme function
function changeTheme(){
    var themeText = document.querySelector('.themetext');

    dropDown.classList.toggle('true');
    if(dropDown.classList.contains('true')){
        themeText.textContent = 'Dark Mode';
        document.getElementById('change').setAttribute('src','images/icon-moon.svg');
        document.documentElement.style.setProperty('--secondary-color', 'hsl(0, 0%, 98%)');
        document.documentElement.style.setProperty('--white', 'hsl(200, 15%, 8%)');
        document.documentElement.style.setProperty('--primary-color', 'hsl(0, 0%, 100%)');
        document.documentElement.style.setProperty('--input-color', 'hsl(0, 0%, 52%)');
        document.documentElement.style.setProperty('--secondary-box-color', 'hsl(0, 0%, 93%)');
    }else{
        themeText.textContent = 'Light Mode';
        document.getElementById('change').setAttribute('src','images/icon-sun.svg');
        document.documentElement.style.setProperty('--secondary-color', 'hsl(207, 26%, 17%)');
        document.documentElement.style.setProperty('--white', 'hsl(0, 0%, 100%)');
        document.documentElement.style.setProperty('--primary-color', 'hsl(209, 23%, 22%)');
        document.documentElement.style.setProperty('--input-color', 'hsl(0, 0%, 100%)');
        document.documentElement.style.setProperty('--secondary-box-color', 'hsl(207, 26%, 15%)');
    }
};


// search handler
search.addEventListener('keyup',(e)=>{
    if(search.value.length === 0 && e.key === "Enter") {
        return alert("Is Like You're Not Ready...What do you want to do gan gan?");
    }
    else if(e.key === "Enter" || e.keyCode == 13) {
        const countryValue = e.target.value.trim();
        capitalize(countryValue);
        search.value = '';
    }
})

function capitalize(string){
    var captilized = string.charAt(0).toUpperCase() + string .slice(1);
    getLink(undefined, captilized);
}


// region filter
for(var i=0; i<dropDownNav.length; i++){
    dropDownNav[i].addEventListener('click',(e)=>{
        var region = e.target.textContent;
        getLink(region);
    });
}

var countriesList = [];



function saveLink(){
    var str = JSON.stringify(countriesList);
    localStorage.setItem('countriesHolder', str);
}

function getLink(regions, country){
    var region = 'all?';
    var str = localStorage.getItem('countriesHolder');
    countriesList = JSON.parse(str);

    if(countriesList == null || countriesList.length < 1 || countriesList == undefined){
        apiCountries(region);
        countriesList = [];
    }
    else if(regions !== undefined){
        var filtered = countriesList.filter((r)=> r.region == regions);
        container.textContent = '';
        filtered.forEach(data => {
            createCountryGrids(data)
        });
    }
    else if(country !== undefined){
        var filteredCountry = countriesList.filter((c)=> c.name == country);
        container.textContent = '';

        if(filteredCountry == null || filteredCountry.length < 1 || filteredCountry == undefined){
            container.textContent = 'No Country found. please check your spelling and try again';
            container.style.cssText = 'color:rgba(224, 169, 169, 0.849); text-align:center; width:100%;font-size:20px; margin:50px auto; display:flex; align-items:center; justify-content:center;';
        }else{
            filteredCountry.forEach(data => {
                createCountryGrids(data)
            });
        }  
    }
    else{
        countriesList.forEach(data => {
            createCountryGrids(data)
        });
    }
};


async function apiCountries(region) {
    loading.style.display = 'flex';
    const response = await fetch('https://restcountries.com/v2/'+ region +'access_key=78cc794a9f33b3d3eda816c3a09c25d9'); 
    const data = await response.json();
    if(response.status = 200){
        for(var i=0; i<data.length;i++){
            countriesList.push(data[i]);
            createCountryGrids(data[i])
            saveLink();
        }
    }else{
        container.textContent = 'Please Check Your Connection And Try Again'
    }
    loading.style.display = 'none';
};





function createCountryGrids(data){
    var countriesContainer = document.createElement('div');
    countriesContainer.classList.add('countries-container');

    var country = document.createElement('div');
    country.classList.add('countries');

    var countryImage = document.createElement('img');
    countryImage.setAttribute('src',data.flag);
    countryImage.setAttribute('alt','country-image');

    var countryDetail = document.createElement('div');
    countryDetail.classList.add('country-detail');

    var countryName = document.createElement('h4');
    countryName.classList.add('name-of-country');
    countryName.textContent = data.name;

    var otherDetails = document.createElement('div');
    otherDetails.classList.add('other-detail');

    var paragraphOne = document.createElement('p');
    if(data.population === undefined || data.population === null){
        paragraphOne.innerHTML ='';
    }else{
        paragraphOne.innerHTML = '<span>Population: </span>' + data.population;
    } 

    var paragraphTwo = document.createElement('p');
    if(data.region === undefined || data.region === null){
        paragraphTwo.innerHTML ='';
    }else{
        paragraphTwo.innerHTML = '<span>Region: </span>' + data.region;
    }
    
    var paragraphThree = document.createElement('p');
    if(data.capital === undefined || data.capital === null){
        paragraphThree.innerHTML ='';
    }else{
        paragraphThree.innerHTML =  `<span>Capital: </span>${data.capital}</p>`;
    }

    countriesContainer.appendChild(country);
    country.appendChild(countryImage);
    country.appendChild(countryDetail);
    countryDetail.appendChild(countryName);
    countryDetail.appendChild(otherDetails);
    otherDetails.appendChild(paragraphOne);
    otherDetails.appendChild(paragraphTwo);
    otherDetails.appendChild(paragraphThree);


    container.appendChild(countriesContainer);
}

getLink();
var wikipediaURL = "https://epaper.jagran.com/epaper/20-Oct-2023-84-patna-nagar-edition-patna-nagar-page-1.html";

console.log(wikipediaURL);

fetch(wikipediaURL)
    .then(response => response.text())
    .then(data => {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;
        console.log(tempDiv.innerHTML);
        let x = tempDiv.querySelector('#image1').getAttribute('data-src');
        console.log(x);
    })
    .catch(error => console.error('Error:', error));
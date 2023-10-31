const path = require('path')
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const app = express();
const port = 3000;

function dateOfNewspaper() {
    const date = new Date();
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let month = months[date.getMonth()];

    const year = date.getFullYear()
    return `${day}-${month}-${year}`;
}
const current_date = dateOfNewspaper()

const staticpath = path.join(__dirname, "../public");

app.use(express.static(staticpath))



const websites = [
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-1.html`, "id": "img1" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-2.html`, "id": "img2" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-3.html`, "id": "img3" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-4.html`, "id": "img4" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-5.html`, "id": "img5" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-6.html`, "id": "img6" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-7.html`, "id": "img7" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-8.html`, "id": "img8" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-9.html`, "id": "img9" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-10.html`, "id": "img10" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-11.html`, "id": "img11" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-12.html`, "id": "img12" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-13.html`, "id": "img13" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-14.html`, "id": "img14" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-15.html`, "id": "img15" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-16.html`, "id": "img16" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-17.html`, "id": "img17" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-18.html`, "id": "img18" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-19.html`, "id": "img19" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-20.html`, "id": "img20" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-21.html`, "id": "img21" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-22.html`, "id": "img22" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-23.html`, "id": "img23" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-24.html`, "id": "img24" },
    { "url": `https://epaper.jagran.com/epaper/${current_date}-84-patna-nagar-edition-patna-nagar-page-25.html`, "id": "img25" },
]
const images = []
websites.forEach((website, index) => {
    function EpaperImages() {
        axios.get(website.url)
            .then((response) => {
                if (response.status === 200) {
                    const html = response.data;
                    const $ = cheerio.load(html);

                    // Find the image element with the specified ID
                    const imageElement = $(`#${website.id}`);

                    if (imageElement.length > 0) {
                        // Get the value of the "src" attribute
                        let imageUrl = imageElement.attr('data-src');
                        imageUrl = imageUrl.replace('/Patna/', '/Patna/M-')
                        imageUrl = imageUrl.replace('ss', '')
                        images.push(imageElement);
                        // console.log('Image URL:', imageUrl);
                        const fileName = `images/image-${index}.jpg`;

                        // Fetch the image from the URL and save it to a file
                        request(imageUrl)
                            .on('error', (err) => {
                                console.error(err);
                            })
                            .pipe(fs.createWriteStream(path.join(staticpath, fileName)))
                            .on('close', () => {
                                console.log('Image downloaded successfully.');
                            });

                        // Define a route to fetch and serve the image
                        app.get(`/${index}`, async (req, res) => {
                            try {
                                // Fetch the image from the provided URL using axios
                                const { data, headers } = await axios.get(imageUrl, {
                                    responseType: 'arraybuffer',
                                });

                                // Set the Content-Type header based on the image's content type
                                const contentType = headers['content-type'];
                                res.setHeader('Content-Type', contentType);

                                // Send the image data as the response
                                res.send(data);
                            } catch (error) {
                                res.status(500).send('Internal Server Error');
                            }
                        });

                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    EpaperImages();
})


app.get("/about", (req, res) => {
    res.send("About")
});

app.get("/contact", (req, res) => {
    res.send("Contact")
});

app.get("/temp", (req, res) => {
    res.send("Temp")
});


app.listen(port, () => {
    console.log(`http://127.0.0.1/${port}`);
})








{ /* 
    const array = [
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg1-0013822300.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg2-0011545190.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg3-0013601727.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg4-0012058720.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg5-0014842853.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg6-0014930760.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg7-0014056473.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg8-0013321843.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg9-0015219630.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg10-0005146513.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg11-0012533717.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg12-0012810590.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg13-0020210467.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg14-0015925013.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg15-0013036407.png",
        "https://epaperapi.jagran.com/EpaperImages/30102023/Patna/M-29pat-pg16-0005416803.png"
    ]

    array.forEach((link) => {
        window.open(link)
    })
*/ }

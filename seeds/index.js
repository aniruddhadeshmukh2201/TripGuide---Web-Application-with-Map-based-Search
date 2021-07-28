const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Spot = require('../models/spot');

mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected", );
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Spot.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Spot({
            //YOUR USER ID
            author: {
                id: "60efcb738da0d4293c44aa85",
                username: 'aniruddha'
            },
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dtabeiiwr/image/upload/v1626450966/Reasons-to-settle-down-in-Pune_yu0q6f.png',
                    filename: 'Reasons-to-settle-down-in-Pune_yu0q6f'
                },
                {
                    url: 'https://res.cloudinary.com/dtabeiiwr/image/upload/v1626366063/sample.jpg',
                    filename: 'sample'
                }
            ]
        })
        await camp.save();
        console.log(camp);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
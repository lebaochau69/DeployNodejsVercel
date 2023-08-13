const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../model/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6233488b7382b2d52fbd40f9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            price: price,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum saepe iure nemo similique illo perspiciatis rem, quas reiciendis corporis eveniet debitis itaque iste modi ea earum eaque atque porro totam!',
            images: [
              {
                url: 'https://res.cloudinary.com/disdzwovt/image/upload/v1648128372/YelpCamp/kqouq4ad2dvbyn74ojmm.jpg',
                filename: 'YelpCamp/kqouq4ad2dvbyn74ojmm'
              },
              {
                url: 'https://res.cloudinary.com/disdzwovt/image/upload/v1648128372/YelpCamp/amirr57kfbs1md30q5zi.jpg',
                filename: 'YelpCamp/amirr57kfbs1md30q5zi'
              }
            ]
        });
        await camp.save();
    }
}

seedDB();
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedproducts = exports.seedcategory = exports.populateReviews = exports.populateFormats = void 0;
const review_services_1 = require("../../services/review.services");
const category_model_1 = __importDefault(require("../category.model"));
const product_model_1 = __importDefault(require("../product.model"));
const categories = [
    { name: "Fiction" },
    { name: "Non-Fiction" },
    { name: "Science Fiction" },
    { name: "Fantasy" },
    { name: "Biography" },
    { name: "Self-Help" },
    { name: "History" },
    { name: "Children's Books" },
    { name: "Mystery" },
    { name: "Romance" },
    { name: "Horror" },
    { name: "Thriller" },
    { name: "Travel" },
    { name: "Cookbooks" },
    { name: "Graphic Novels" },
    { name: "Young Adult" },
    { name: "Poetry" },
    { name: "Classics" },
    { name: "Art" },
    { name: "Music" },
    { name: "Sports" }
];
const products = [
    {
        title: 'Developing a Sense of Place',
        description: 'How do cultural planners and policymakers work through the arts to create communities? What do artists need to build a sense of place in their community? To discuss these issues, Developing a Sense of...',
        ISBN: '17873GDD57651',
        author: 'Tamara Ashley, Alexis Weedon',
        publisher: 'UCL Press',
        published_Date: '2020-01-01T00:00:00.000Z',
        noOfPages: 325,
        coverImage: ['https://www.dbooks.org/img/books/1787357651s.jpg'],
        categoryid: '6752a364e8267b14680cd570',
        language: 'english',
        user: '6792739e2226029550cfe0f2'
    },
    {
        title: 'Greedy Algorithms',
        description: 'Each chapter comprises a separate study on some optimization problem giving both an introductory look into the theory the problem comes from and some new developments invented by author(s). Usually so...',
        ISBN: '953515GD7981',
        author: 'Witold Bednorz',
        publisher: 'IntechOpen',
        published_Date: '2008-01-01T00:00:00.000Z',
        noOfPages: 600,
        coverImage: ['https://www.dbooks.org/img/books/9535157981s.jpg'],
        categoryid: '6752a364e8267b14680cd570',
        language: 'english',
        user: '6792739e2226029550cfe0f2'
    },
    {
        title: 'Who Saved the Parthenon?',
        description: 'In this magisterial book, William St Clair unfolds the history of the Parthenon throughout the modern era to the present day, with special emphasis on the period before, during, and after the Greek Wa...',
        ISBN: '1783744GDG634',
        author: 'William St Clair',
        publisher: 'Open Book Publishers',
        published_Date: '2022-01-01T00:00:00.000Z',
        noOfPages: 898,
        coverImage: ['https://www.dbooks.org/img/books/1783744634s.jpg'],
        categoryid: '6752a364e8267b14680cd570',
        language: 'english',
        user: '6792739e2226029550cfe0f2'
    },
    {
        title: 'History of International Relations',
        description: 'Existing textbooks on international relations treat history in a cursory fashion and perpetuate a Euro-centric perspective. This textbook pioneers a new approach by historicizing the material traditio...',
        ISBN: '17837402FS48',
        author: 'Erik Ringmar',
        publisher: 'Open Book Publishers',
        published_Date: '2019-01-01T00:00:00.000Z',
        noOfPages: 218,
        coverImage: ['https://www.dbooks.org/img/books/1783740248s.jpg'],
        categoryid: '6752a364e8267b14680cd570',
        language: 'english',
        user: '6792739e2226029550cfe0f2'
    },
    {
        title: 'Learn Ruby on Rails: Book Two',
        description: 'In this book, you&#039;ll build a working web application so you&#039;ll gain hands-on experience. Along the way, you&#039;ll practice techniques used by professional Rails developers. And I&#039;ll help you understand w...',
        ISBN: '567110HJ9817',
        author: 'Daniel Kehoe',
        publisher: 'Self-publishing',
        published_Date: '2017-01-01T00:00:00.000Z',
        noOfPages: 420,
        coverImage: ['https://www.dbooks.org/img/books/5671109817s.jpg'],
        categoryid: '6752a364e8267b14680cd570',
        language: 'english',
        user: '6792739e2226029550cfe0f2'
    }
];
const DEFAULT_PRICES = {
    ebook: 5000,
    physical: 15000,
    audiobook: 5000
};
const populateFormats = async () => {
    try {
        const products = await product_model_1.default.find();
        console.log(`Found ${products.length} products.`);
        for (const product of products) {
            const existingTypes = product.formats.map((format) => format.type);
            const formatsToAdd = ["ebook", "physical", "audiobook"].filter((type) => !existingTypes.includes(type));
            if (formatsToAdd.length > 0) {
                const newFormats = formatsToAdd.map((type) => ({
                    type, // No need to cast explicitly
                    price: DEFAULT_PRICES[type],
                    downloadLink: type === "ebook" ? `https://download.example.com/${product._id}` : undefined,
                    stock: type === "physical" ? 100 : undefined,
                    product: product._id,
                }));
                // Push new formats into the product's formats array
                product.formats.push(...newFormats); // Type assertion here
                // Save the updated product
                await product.save();
                console.log(`Added ${newFormats.length} formats to product ${product._id}`);
            }
        }
        console.log("Format population completed.");
    }
    catch (error) {
        console.error("Error populating formats:", error);
    }
};
exports.populateFormats = populateFormats;
const reviews = {
    bad: [
        "Terrible quality, wouldn't recommend.",
        "Not worth the money.",
        "Very disappointed with this product.",
        "I regret buying this.",
        "Poor quality and bad experience."
    ],
    average: [
        "It's okay, nothing special.",
        "Decent, but has some flaws.",
        "Average quality, could be better.",
        "Not the best, but not the worst.",
        "Fair for the price."
    ],
    good: [
        "Great product! Exceeded my expectations.",
        "Very satisfied, will buy again.",
        "High quality and worth every penny!",
        "Absolutely love it!",
        "One of the best purchases I've made!"
    ]
};
const populateReviews = async () => {
    try {
        const products = await product_model_1.default.find();
        console.log(`Found ${products.length} products.`);
        for (const product of products) {
            const rateNumber = Math.floor(Math.random() * 5) + 1; // Random rating between 1-5
            // Select review based on rating
            let review;
            if (rateNumber <= 2) {
                review = reviews.bad[Math.floor(Math.random() * reviews.bad.length)];
            }
            else if (rateNumber === 3) {
                review = reviews.average[Math.floor(Math.random() * reviews.average.length)];
            }
            else {
                review = reviews.good[Math.floor(Math.random() * reviews.good.length)];
            }
            await (0, review_services_1.createReview)(rateNumber, review, product._id, '679272e72226029550cfe0e6');
        }
        console.log("Rating population completed.");
    }
    catch (error) {
        console.error("Error populating Rating:", error);
    }
};
exports.populateReviews = populateReviews;
const seedcategory = async () => {
    await category_model_1.default.insertMany(categories);
    console.log('inserted');
};
exports.seedcategory = seedcategory;
const seedproducts = async () => {
    await product_model_1.default.insertMany(products);
    console.log('inserted');
};
exports.seedproducts = seedproducts;
// FICTION, POETRY, SELF-SERVICE, GRAPHIC

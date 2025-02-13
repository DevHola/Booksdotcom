"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedproducts = exports.seedcategory = void 0;
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

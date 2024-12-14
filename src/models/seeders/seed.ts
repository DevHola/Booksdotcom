import CategoryModel, { ICategory } from "../category.model";
import productModel, { IProduct } from "../product.model";
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
]
const products = [
    {
        title: "The Great Gatsby",
        description: "A novel written by American author F. Scott Fitzgerald.",
        ISBN: "9780743273565",
        author: "F. Scott Fitzgerald",
        price: 10.99,
        publisher: "Scribner",
        published_Date: new Date("1925-04-10"),
        noOfPages: 180,
        coverImage: "great_gatsby_cover.jpg",
        categoryid: "6752a364e8267b14680cd564", // Replace with actual category ID
        language:"english",
        user: "67507542988454964598814a" // Replace with actual user ID
    },
    {
        title: "To Kill a Mockingbird",
        description: "A novel by Harper Lee published in 1960.",
        ISBN: "9780061120084",
        author: "Harper Lee",
        price: 7.99,
        publisher: "J.B. Lippincott & Co.",
        published_Date: new Date("1960-07-11"),
        noOfPages: 281,
        coverImage: "to_kill_a_mockingbird_cover.jpg",
        categoryid: "6752a364e8267b14680cd565", // Replace with actual category ID
        language:"english",
        user: "67507542988454964598814a" // Replace with actual user ID
    },
    {
        title: "1984",
        description: "A dystopian social science fiction novel and cautionary tale by the English writer George Orwell.",
        ISBN: "9780451524935",
        author: "George Orwell",
        price: 8.99,
        publisher: "Secker & Warburg",
        published_Date: new Date("1949-06-08"),
        noOfPages: 328,
        coverImage: "1984_cover.jpg",
        categoryid: "6752a364e8267b14680cd566", // Replace with actual category ID
        language:"english",
        user: "67507542988454964598814a" // Replace with actual user ID
    },
    {
        title: "Pride and Prejudice",
        description: "A romantic novel of manners written by Jane Austen in 1813.",
        ISBN: "9781503290563",
        author: "Jane Austen",
        price: 9.99,
        publisher: "T. Egerton",
        published_Date: new Date("1813-01-28"),
        noOfPages: 279,
        coverImage: "pride_and_prejudice_cover.jpg",
        categoryid: "6752a364e8267b14680cd567", // Replace with actual category ID
        language:"english",
        user: "67507542988454964598814a" // Replace with actual user ID
    },
    {
        title: "The Hobbit",
        description: "A children's fantasy novel by English author J. R. R. Tolkien.",
        ISBN: "9780547928227",
        author: "J. R. R. Tolkien",
        price: 14.99,
        publisher: "George Allen & Unwin",
        published_Date: new Date("1937-09-21"),
        noOfPages: 310,
        coverImage: "the_hobbit_cover.jpg",
        categoryid: "6752a364e8267b14680cd568", // Replace with actual category ID
        language:"english",
        user: "67507542988454964598814a" // Replace with actual user ID
    }
]
export const seedcategory = async () => {
    await CategoryModel.insertMany(categories)
    console.log('inserted')
}
export const seedproducts = async () => {
    await productModel.insertMany(products)
    console.log('inserted')
}
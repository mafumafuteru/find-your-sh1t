import { faker, fakerDE } from "@faker-js/faker";

// Generate unique user
export const generateUser = () => {
  const userName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const emailAddress = faker.internet.email();
  const password = faker.internet.password();
  return { userName, lastName, emailAddress, password };
};

// Generate unique place
export const generatePlace = () => {
  const placeDescription = ["House", "Apartment", "Studio", "Office"];
  const streetName = fakerDE.location.city();

  const fullPlace =
    faker.helpers.arrayElement(placeDescription) + " " + streetName;

  return fullPlace;
};

// Generate list of unique room
export const generateRoomUniqueRooms = (amount) => {
  const roomNames = [
    "Living Room",
    "Bedroom",
    "Kitchen",
    "Bathroom",
    "Dining Room",
    "Home Office",
    "Garage",
    "Guest Room",
    "Laundry Room",
    "Basement",
    "Attic",
    "Pantry",
  ];

  const rooms = faker.helpers.arrayElements(roomNames, amount);
  return rooms;
};

// Generate List of unique Container
export const generateUniqueContainers = (amount) => {
  const containerNames = [
    "White Kallax",
    "Oak Drawer Unit",
    "Glass Kitchen Cabinet",
    "Matte Black Cupboard",
    "Pine Lowboard",
    "Walnut Sideboard",
    "Gray Storage Bench",
    "Small Metal Cabinet",
    "Tall Pantry Cabinet",
    "Red Tool Chest",
    "Blue Plastic Drawer",
    "Rustic Bookshelf",
    "Birch Wardrobe",
    "Bamboo Shoe Rack",
    "Chrome Rolling Cart",
    "Wicker Basket Tower",
    "Whitewashed TV Stand",
    "Mahogany Dresser",
    "Vintage Bar Cabinet",
    "Corner Cupboard",
    "Transparent Display Case",
    "Fabric Storage Ottoman",
    "Espresso Coffee Table Drawer",
    "Foldable Storage Box",
    "Modular Cube Shelf (Black)",
    "Underbed Storage Container",
    "Hanging Wall Cabinet",
    "Steel Filing Cabinet",
    "Beech Bathroom Cabinet",
    "Glass-Front Sideboard",
  ];
  const containers = faker.helpers.arrayElements(containerNames, amount);
  return containers;
};

// Generate list of unique item
export const generateUniqueItems = (amount) => {
  const containerItems = [
    "White Coffee Mug",
    "Blue Cereal Bowl",
    "Glass Jar of Rice",
    "Stainless Steel Pot",
    "Black Spatula",
    "Wooden Cutting Board",
    "Pack of Pasta",
    "Olive Oil Bottle",
    "Salt Shaker",
    "Pepper Grinder",
    "Silver Fork Set",
    "Set of Teal Plates",
    "Box of Tea Bags",
    "Tupperware Lid",
    "Plastic Food Container",
    "Rolling Pin",
    "Measuring Cups",
    "Recipe Book",
    "Red Oven Mitt",
    "Dish Towel",
    "Stack of Napkins",
    "Baking Tray",
    "Mixing Bowl",
    "Small Colander",
    "Kitchen Scale",
    "Electric Hand Mixer",
    "Spare Light Bulbs",
    "AA Batteries",
    "USB Cable",
    "Power Bank",
    "White Extension Cord",
    "Notebook with Lined Pages",
    "Ballpoint Pens",
    "Pack of Sticky Notes",
    "Black Marker",
    "Scissors",
    "Stapler",
    "Tape Dispenser",
    "Box of Paper Clips",
    "Envelopes",
    "Printer Paper",
    "Red Throw Blanket",
    "Pair of Wool Socks",
    "Leather Belt",
    "Folded Jeans",
    "Graphic T-Shirt",
    "Silk Scarf",
    "Winter Gloves",
    "Sports Shorts",
    "Hiking Socks",
    "Black Hoodie",
    "Cotton Pajamas",
    "Swim Trunks",
    "Tank Top",
    "Running Shoes",
    "Pair of Sandals",
    "Slippers",
    "Rain Jacket",
    "Umbrella",
    "Laundry Bag",
    "Toiletry Bag",
    "Electric Toothbrush",
    "Pack of Razors",
    "Bottle of Shampoo",
    "Bar of Soap",
    "Nail Clippers",
    "Hair Brush",
    "Travel-Sized Lotion",
    "First Aid Kit",
    "Box of Band-Aids",
    "Antiseptic Wipes",
    "Thermometer",
    "Pain Relievers",
    "Spare Glasses",
    "Sunglasses",
    "Watch Box",
    "Jewelry Organizer",
    "Gold Necklace",
    "Silver Bracelet",
    "Pearl Earrings",
    "Ring Box",
    "Candle in Glass Jar",
    "Essential Oil Bottle",
    "Bluetooth Speaker",
    "Charging Cable",
    "Instruction Manuals",
    "Old Phone",
    "Pack of Playing Cards",
    "Board Game Box",
    "Dice Set",
    "Photo Album",
    "Envelope of Stamps",
    "Passport",
    "Travel Documents",
    "Spare Keys",
    "Notebook with Sketches",
    "Box of Crayons",
    "Set of Watercolors",
    "Paint Brushes",
    "White Canvas Panel",
    "Plastic Toolbox",
    "Measuring Tape",
    "Screwdriver Set",
    "Box of Screws",
  ];

  const itemNameSlice = faker.helpers.arrayElements(containerItems, amount);
  let items: {
    itemName: string;
    purchaseDate: Date;
    expirationDate: Date;
    color: string;
    price: number;
  }[] = [];
  for (let name of itemNameSlice) {
    const newItem = {
      itemName: name,
      purchaseDate: faker.date.past(),
      expirationDate: faker.date.soon({ days: 500 }),
      color: faker.color.human(),
      price: faker.number.float({ min: 1, max: 500, fractionDigits: 2 }),
    };
    items.push(newItem);
  }
  return items;
};

/**
 * Database Initialization & Seed Script
 * Creates the database (if not exists), recreates the `orders` table,
 * and populates the required 12 sample restaurant order records in exact insertion order.
 * 
 * Usage: node createdatabase.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

// Original Assignment Seed Data (12 sample order items)
const sampleOrders = [
    { 
        _id: "d0975326-7b43-479e-a109-cb818abec62d", 
        title: "Chocolate Mousse Torte Cake", 
        description: "Two rich, chocolate cake layers are filled with luscious chocolate whipped cream mousse, then covered with milk chocolate frosting and a dark chocolate glaze. This best selling delight is then garnished with fudge rosettes and dark chocolate shaves. Includes a Chocolate Occasion Plaque, matching Greeting Card and is packaged in an elegant gift box!" 
    },
    { 
        _id: "ebed34eb-7533-49f5-91cb-37c12f20d4b1", 
        title: "Triple Chocolate Enrobed Brownie Cake", 
        description: "This is the perfect cake for the true chocolate lover. Our dense, moist brownie cake is covered in not one, but three layers of decadent chocolate. The cake is coated with a rich chocolate fondant icing, showered with dark chocolate shavings and then finally drizzled with milk and dark chocolate glazes. This triple-chocolate delight is sure to satisfy any sweet tooth. Each cake is delivered in an elegant gift box with a chocolate occasion plaque and personalized greeting card to celebrate any occasion." 
    },
    { 
        _id: "fb79562d-e470-4445-990b-06aa875d3e97", 
        title: "Reddi Wip Dairy Whipped Topping Extra Creamy Aerosol Refrigerated", 
        description: "Reddi Wip® Extra Creamy Sweetened Dairy Whipped Topping. Milk from cows. Not treated with artificial growth hormone*. Made with real cream. No artificial flavors or sweeteners. 15 calories per 2 tbsp. Ultra-pasteurized." 
    },
    { 
        _id: "61c79187-76f6-4747-a5cf-d7e26dcea535", 
        title: "Red Velvet Chocolate Cake", 
        description: "A truly decadent southern classic: two rich layers of red chocolate cake, fill and covered with the finest, pure cream cheese frosting, and then garnished with white chocolate sprinkles around the sides. Includes a Chocolate Occasion Plaque, matching Greeting Card and is packaged in an elegant gift box!" 
    },
    { 
        _id: "b72f5d8e-e586-47cd-aba7-202814ca6609", 
        title: "Rice Dream Original Non-Dairy Beverage Organic", 
        description: "Rice Dream® Organic Original Enriched Rice Drink. Value size. Calcium & vitamin D. Easy to digest. USDA Organic. Non GMO project." 
    },
    { 
        _id: "5ffd3e0b-2a31-4d97-aced-e242b5061b24", 
        title: "Member's Mark Mini Plain Sliced Bagels", 
        description: "Kettle boiled like they do in the Big Apple, these heat-and-serve mini bagels are made with premium ingredients like real yeast and triple-filtered water." 
    },
    { 
        _id: "b7399b85-6860-4b86-b169-3dc068d444ae", 
        title: "Daiya Dairy Free Greek Yogurt Black Cherry", 
        description: "Daiya Dairy Free Black Cherry Greek Yogurt Style. New. Rich & creamy & lots of fruit. Deliciously Dairy-Free®. Soy free. 8g protein*. 3g* fiber. Excellent source of calcium. Probiotics. Excellent source of Vitamin B12." 
    },
    { 
        _id: "c8d5c1c3-15e8-4112-a043-a0d33a8de28d", 
        title: "Daily Chef Mini Candy Cookies", 
        description: "Delicious mini candy cookies baked fresh in Club." 
    },
    { 
        _id: "74835a8d-b17b-4653-b1b1-fc58b4df19b9", 
        title: "So Delicious Cultured Coconut Milk Yogurt Vanilla Dairy & Soy Free Organic", 
        description: "So Delicious® Dairy Free Coconut Milk Yogurt Alternative Vanilla. Made with organic coconut. Net Wt. 5.3 oz (150 g). Certified Vegan. Certified Gluten-Free®." 
    },
    { 
        _id: "92de4c84-2f09-43c3-88e2-c0a000b93037", 
        title: "Gaston’s Bakery Small Puff Pastry Squares", 
        description: "Easily create delicious pies, savory hors d’oeuvres, tarts, baklava and more with these ready-to-use puff pastry squares. Puff pastry bakes up light and flaky and pairs perfectly with a wide range of toppings and fillings." 
    },
    { 
        _id: "df52c530-a741-4eb7-9558-d2faaacec380", 
        title: "Signature Bakery Assortment", 
        description: "Our Signature Bakery Assortment is ideal when you need a cookie delivery. This bakery gift is filled with baked goods such as lemon poppyseed coffee cake and baklava handcrafted in our own bakery. We've added some of our most popular cookie types, from raspberry galettes to Moose Munch® Cookies, to round out this generous collection." 
    },
    { 
        _id: "334d5358-3cdf-473b-b894-5115b0df7c6f", 
        title: "Gaston’s Bakery Croissants", 
        description: "Our vendor will ship directly to you. Allow 5-7 business days for delivery. Not available to ship to Hawaii or Alaska. $7.50 handling and shipping fee applied in cart to ensure freshness." 
    }
];

async function initializeDatabase() {
    const dbName = process.env.DB_NAME || 'zomato_orders';
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

    console.log(`[INFO] Connecting to MySQL server at ${host}:${port}...`);

    let connection;
    try {
        // Step 1: Connect to server without database selected to ensure DB exists
        connection = await mysql.createConnection({
            host,
            user,
            password,
            port
        });

        console.log(`[INFO] Connected to MySQL server successfully.`);

        // Step 2: Create database if it does not exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`[INFO] Database \`${dbName}\` ensured.`);

        // Step 3: Switch to target database
        await connection.changeUser({ database: dbName });

        // Step 4: Drop existing orders table if it exists
        await connection.query('DROP TABLE IF EXISTS `orders`;');
        console.log(`[INFO] Existing \`orders\` table dropped.`);

        // Step 5: Recreate orders table schema EXACTLY matching original assignment
        await connection.query(`
            CREATE TABLE \`orders\` (
                \`_id\` VARCHAR(200),
                \`title\` VARCHAR(100),
                \`description\` VARCHAR(1000)
            );
        `);
        console.log(`[INFO] Schema created: \`orders(_id, title, description)\`.`);

        // Step 6: Populate sample records in order
        for (let i = 0; i < sampleOrders.length; i++) {
            await connection.query(
                'INSERT INTO `orders` (`_id`, `title`, `description`) VALUES (?, ?, ?)',
                [sampleOrders[i]._id, sampleOrders[i].title, sampleOrders[i].description]
            );
        }
        console.log(`[SUCCESS] Seeded ${sampleOrders.length} records into \`orders\` table in exact order.`);

        // Step 7: Verify row count
        const [rows] = await connection.query('SELECT COUNT(*) AS count FROM `orders`');
        console.log(`[VERIFY] Total rows in \`orders\` table: ${rows[0].count}`);

    } catch (error) {
        console.error('[ERROR] Database initialization failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('[INFO] Connection closed cleanly.');
        }
    }
}

initializeDatabase();

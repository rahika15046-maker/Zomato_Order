/**
 * Database Initialization & Seed Script
 * Connects to MySQL, ensures the `orders` table exists,
 * and populates the required 12 sample restaurant order records in exact insertion order.
 * 
 * Supports local MySQL as well as cloud MySQL providers (e.g. Railway).
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
        title: "Gaston's Bakery Small Croissants", 
        description: "Our vendor will ship directly to you. Allow 5-7 business days for delivery. Not available to ship to Hawaii or Alaska. $7.50 handling and shipping fee applied in cart to ensure freshness." 
    },
    { 
        _id: "7217db53-fa9b-449e-b816-724d2719c298", 
        title: "Cento San Marzano Organic Peeled Tomatoes", 
        description: "Cento Certified Organic San Marzano Peeled Tomatoes. Certified organic by Bioagricert SRL. Net wt 28 oz (1 lb 12 oz) 794g." 
    },
    { 
        _id: "364585a2-c3da-47e0-b6f7-a9a7a63d4104", 
        title: "Suave Professionals Deep Moisture Shampoo", 
        description: "Suave Professionals Moisture Rich Shampoo for dry hair is made with a replenishing formula infused with panthenol and a keratin complex to help strengthen hair. This moisture shampoo gently cleanses and helps improve the look and feel of dry hair by delivering 2x more moisture* *vs non conditioning shampoo. For best results, pair this moisturizing shampoo with Suave Professionals Deep Moisture Conditioner." 
    },
    { 
        _id: "72691be0-80e4-4d2a-a921-1311ff04d98d", 
        title: "S&W Kidney Beans Dark Red", 
        description: "Dark Red Kidney Beans, canned dark red kidney beans." 
    },
    { 
        _id: "334d5358-3cdf-473b-b894-5115b0df7c6f", 
        title: "Gaston’s Bakery Croissants", 
        description: "Our vendor will ship directly to you. Allow 5-7 business days for delivery. Not available to ship to Hawaii or Alaska. $7.50 handling and shipping fee applied in cart to ensure freshness." 
    }
];

async function initializeDatabase() {
    const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;
    const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'zomato_orders';
    const host = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
    const user = process.env.DB_USER || process.env.MYSQLUSER || 'root';
    const password = process.env.DB_PASSWORD !== undefined
        ? process.env.DB_PASSWORD
        : (process.env.MYSQLPASSWORD !== undefined ? process.env.MYSQLPASSWORD : '');
    const port = process.env.DB_PORT
        ? parseInt(process.env.DB_PORT, 10)
        : (process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT, 10) : 3306);

    console.log(`[INFO] Initializing database target: ${connectionUri ? 'via connection URL' : `${host}:${port}/${dbName}`}...`);

    let connection;
    try {
        if (connectionUri) {
            connection = await mysql.createConnection(connectionUri);
        } else {
            // Attempt to connect to the specific database directly first
            try {
                connection = await mysql.createConnection({
                    host,
                    user,
                    password,
                    port,
                    database: dbName
                });
            } catch (initialErr) {
                // If database does not exist, connect to server without database and create it
                if (initialErr.code === 'ER_BAD_DB_ERROR') {
                    console.log(`[INFO] Database \`${dbName}\` does not exist yet. Connecting to MySQL server to create it...`);
                    const rootConn = await mysql.createConnection({ host, user, password, port });
                    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
                    await rootConn.end();
                    console.log(`[INFO] Database \`${dbName}\` created.`);
                    connection = await mysql.createConnection({ host, user, password, port, database: dbName });
                } else {
                    throw initialErr;
                }
            }
        }

        console.log(`[INFO] Connected to target database successfully.`);

        // Recreate orders table matching assignment schema
        await connection.query('DROP TABLE IF EXISTS `orders`;');
        console.log(`[INFO] Existing \`orders\` table dropped.`);

        await connection.query(`
            CREATE TABLE \`orders\` (
                \`_id\` VARCHAR(200),
                \`title\` VARCHAR(100),
                \`description\` VARCHAR(1000)
            );
        `);
        console.log(`[INFO] Schema created: \`orders(_id, title, description)\`.`);

        // Seed 12 sample records in exact order
        for (let i = 0; i < sampleOrders.length; i++) {
            await connection.query(
                'INSERT INTO `orders` (`_id`, `title`, `description`) VALUES (?, ?, ?)',
                [sampleOrders[i]._id, sampleOrders[i].title, sampleOrders[i].description]
            );
        }
        console.log(`[SUCCESS] Seeded ${sampleOrders.length} records into \`orders\` table in exact order.`);

        // Verify count
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

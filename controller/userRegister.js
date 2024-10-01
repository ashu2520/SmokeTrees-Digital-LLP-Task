const db = require('../config/database'); 
const { validateUserInput } = require('../utils/validation');

exports.register = async (req, res) => {
    const { name, number, address, city, state, postal_code, country } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE user_number = ?';
    
    try {
        const [users] = await db.query(checkUserQuery, [number]);

        const isNewUser = users.length === 0;
        
        const validationErrors = validateUserInput({ name, number, address, city, state, postal_code, country }, isNewUser);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }

        if (isNewUser) {
            const insertUserQuery = 'INSERT INTO users (user_name, user_number) VALUES (?, ?)';
            const [result] = await db.query(insertUserQuery, [name, number]);
            const userId = result.insertId;

            await insertAddress(userId, address, city, state, postal_code, country);
            return res.status(201).json({ message: 'User and address added successfully' });

        } else {
            const userId = users[0].user_id;
            await insertAddress(userId, address, city, state, postal_code, country);
            return res.status(201).json({ message: 'Address added successfully' });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
    }
};

async function insertAddress(userId, address, city, state, postal_code, country) {
    const insertAddressQuery = `
        INSERT INTO addresses (user_id, address, city, state, postal_code, country) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertAddressQuery, [userId, address, city, state, postal_code, country]);
}
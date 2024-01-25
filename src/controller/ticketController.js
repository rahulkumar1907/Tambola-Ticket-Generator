const ticketModel = require('../models/ticketModel.js');

const generateTambolaTickets = (numSets) => {
    const tickets = {};

    const isColumnEmpty = (ticket, col) => {
        return ticket.every(row => row[col] === 0);
    };

    const generateUniqueNumber = (usedNumbers) => {
        let num;
        do {
            num = Math.floor(Math.random() * 90) + 1;
        } while (usedNumbers.has(num));
        usedNumbers.add(num);
        return num;
    };

    for (let setNumber = 11; setNumber <= numSets + 10; setNumber++) {
        const set = {};

        for (let ticketNumber = 1; ticketNumber <= 6; ticketNumber++) {
            const ticket = [];

            const usedNumbers = new Set();

            // Fill the first column (1-9)
            for (let i = 0; i < 3; i++) {
                const row = Array(9).fill(0);
                const num = generateUniqueNumber(usedNumbers);
                row[i * 3] = num;
                ticket.push(row);
            }

            // Fill the rest of the columns
            for (let col = 1; col < 9; col++) {
                if (!isColumnEmpty(ticket, col)) {
                    for (let row = 0; row < 3; row++) {
                        const num = generateUniqueNumber(usedNumbers);
                        ticket[row][col] = num;
                    }
                }
            }

            // Add the ticket to the set
            set[ticketNumber] = ticket;
        }

        tickets[setNumber] = set;
    }

    return tickets;
};

const ticketGenerator = async (req, res) => {
    try {
        if (!req.params.setNumber || typeof req.params.setNumber !== 'string') {
            return res.status(400).send({ status: false, error: 'invalid/missing parameter setNumber' });
        }

        const numSets = Number(req.params.setNumber);
        const tickets = generateTambolaTickets(numSets);

        const result = { tickets };

        for (const setNumber in tickets) {
            const ticketData = tickets[setNumber];

            // Check if the ticketData already exists in the database
            const existingTicket = await ticketModel.findOne({ ticketData });

            if (!existingTicket) {
                // If not, save the new ticket
                const ticket = new ticketModel({ ticketData });
                await ticket.save();
            } else {
                console.log(`Ticket with data ${JSON.stringify(ticketData)} already exists in the database.`);
                return res.status(409).send({ status: true, data: `Ticket with data ${JSON.stringify(ticketData)} already exists in the database.` });
            }
        }

        return res.status(201).send({ status: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
};

const getTambolaSet = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 5;

        const skip = (page - 1) * itemsPerPage;

        const tambolaSet = await ticketModel.find().skip(skip).limit(itemsPerPage);

        return res.status(200).send({ status: true, data: tambolaSet });
    } catch (error) {
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
};


module.exports = { ticketGenerator, getTambolaSet };

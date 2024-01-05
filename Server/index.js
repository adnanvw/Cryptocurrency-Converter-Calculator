import express from "express"
import dotenv from "dotenv"
import axios from "axios";
import cors from "cors"

const app = express();

app.use(cors())
dotenv.config()
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.get('/getCryptoCurrencies', async (req, res) => {

    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map',
            { headers: { 'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_API_KEY, } }
        )


        res.status(200).json(response.data.data)

    } catch (error) {
        console.log("error", error)
        res.status(400).json("Something went wrong...")
    }
})


app.get('/getFiatCurrencies', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/fiat/map',
            { headers: { 'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_API_KEY, } }
        )


        res.status(200).json(response.data.data)

    } catch (error) {
        console.log("error", error)
        res.status(400).json("Something went wrong...")
    }
})



app.post("/convert", async (req, res) => {

    try {

        const { id, symbol, quantity } = req.body

        const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${quantity}&id=${id}&convert=${symbol}`,
            { headers: { 'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_API_KEY, } }
        )


        res.status(200).json(response.data.data)


    } catch (error) {
        console.log("error", error)
        res.status(400).json("Something went wrong...")
    }
})





// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
});

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const CryptoConverter = () => {
  const [quantity, setQuantity] = useState(1);
  const [cryptoCurrency, setCryptoCurrency] = useState('');
  const [fiat, setFiat] = useState('');
  const [cryptoCurrencies, setCryptoCurrencies] = useState([]);
  const [fiats, setFiats] = useState([]);

  const [convertedData, setConvertedData] = useState({})

  useEffect(() => {
    // Fetch the list of cryptocurrencies and fiat currencies
    const fetchData = async () => {
      try {
        const cryptoResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/getCryptoCurrencies`);
        const fiatResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/getFiatCurrencies`);

        setCryptoCurrencies(cryptoResponse.data);
        setFiats(fiatResponse.data);
        setCryptoCurrency(cryptoResponse.data[0].id); // Set default crypto
        setFiat(fiatResponse.data[0].symbol); // Set default fiat
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleConvert = async () => {

    try {

      if (!fiat || !quantity || !cryptoCurrency) {
        return
      }

      const convertResponse = await axios.post(`${import.meta.env.VITE_SERVER_URL}/convert`, {
        id: cryptoCurrency,
        symbol: fiat,
        quantity: quantity
      });

      setConvertedData(convertResponse.data)
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  useEffect(() => {
    setConvertedData({})
    const timeOutId = setTimeout(() => {
      handleConvert()
    }, 500)

    return () => {
      clearTimeout(timeOutId)
    }

  }, [fiat, cryptoCurrency, quantity])


  return (
    <div className="crypto-converter">
      <h1>Cryptocurrency Converter Calculator</h1>

      <form>
        <label>Quantity:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(+e.target.value?+e.target.value:1)} />
        <label> Crypto Currency:</label>
        <select value={cryptoCurrency} onChange={(e) => setCryptoCurrency(e.target.value)}>
          {cryptoCurrencies.map((crypto) => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name}
            </option>
          ))}
        </select>
        <label>Fiat Currency:</label>
        <select value={fiat} onChange={(e) => setFiat(e.target.value)}>
          {fiats.map((f) => (
            <option key={f} value={f.symbol}>
              {`${f.name}-${f.sign}-${f.symbol}`}
            </option>
          ))}
        </select>
      </form>
      <h2>
        {convertedData.amount && convertedData.name && convertedData.symbol && convertedData.quote && convertedData.quote[fiat] ?
          `${convertedData.amount} ${convertedData.name} (${convertedData.symbol}) = ${convertedData.quote[fiat].price.toFixed(2)} ${fiat}` :
           "Loading..."
        }
      </h2>
    </div>
  );
};

export default CryptoConverter;

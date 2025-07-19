import { fetchAndStoreCryptoData } from "../services/cryptoService";
export default async function handler(req, res) {
  console.log('Running hourly crypto data update...');
  
  try {
    await fetchAndStoreCryptoData();
    res.status(200).json({ message: 'Crypto data updated' });
  } catch (error) {
    console.error('Error updating crypto data:', error);
    res.status(500).json({ error: 'Update failed' });
  }
}
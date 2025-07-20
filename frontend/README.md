# CryptoTracker

## Tech Stack Used

**Frontend:**  
- React  
- Vite  
- Axios  
- Chart.js & react-chartjs-2 & chartjs-plugin-zoom,
- React Router  
- Tailwind CSS  

**Backend:**  
- Node.js  
- Express  
- MongoDB (via Mongoose)  
- node-cron  
- dotenv  
- Axios  

---

## Setup Instructions

### 1. Clone the repository
```sh
git clone https://github.com/Ranjit-Singh786/cryptotracker.git
cd cryptotracker
```

### 2. Install dependencies

#### Backend
```sh
cd backend
npm install
```

#### Frontend
```sh
cd ../frontend
npm install
```

### 3. Configure environment variables

- **Backend:**  
  Create a `.env` file in the `backend` folder.  
  Example:
  ```
  MONGODB_URI=your_mongodb_connection_string
  ```
- **Frontend:**  
  Edit `.env` in the `frontend` folder if needed:
  ```
  VITE_API_URL=http://localhost:5000/api
  ```

### 4. Start the servers

#### Backend
```sh
npm start
```

#### Frontend
```sh
npm run dev
```

### 5. Access the app

Open your browser at [http://localhost:5173](http://localhost:5173).

---

## How the Cron Job Works

The backend uses [`node-cron`](https://www.npmjs.com/package/node-cron) to schedule a task that runs every hour.  
- The cron job is defined in [backend/index.js](../backend/index.js).
- It calls [`fetchAndStoreCryptoData`](../backend/services/cryptoService.js) from [backend/services/cryptoService.js](../backend/services/cryptoService.js).
- This function fetches the latest top 10 cryptocurrencies from the CoinGecko API.
- It updates the current prices in the [`CryptoCurrent`](../backend/models/CryptoCurrent.js) collection and appends historical price data to [`CryptoHistory`](../backend/models/CryptoHistory.js).
- This keeps your database up-to-date and allows the frontend to display both current and historical data.

## Note
 Cron not working in vercel independently with node-cron package
 we have not found any solution in vercel free hosting platform.
 Then I simply make a endpoint individually for cron then create a cron job in different site-https://app.cronlytic.com/
 and given there cron endpoint with 1 hour time after it will excuted.
 example:-backend_url/api/cron
 Added this url over there and schedule the cron job with 1 hour.
 
 

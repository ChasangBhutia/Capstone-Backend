const axios = require("axios");

const openRouterConfig = axios.create({
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
        "Authorization": `Bearer ${process.env.OPEN_ROUTER_KEY}`,
        "HTTP-Referer": "https://capstone-backend-2yau.onrender.com",
        "Content-Type": "application/json"
    }
})

module.exports = openRouterConfig;
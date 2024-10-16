// fetchVault.js
const { fetchVaultData } = require('../utils/enzymeCronLogic'); // Adjust to your actual module file

const vaultId = '0x1b83ba4527c837d462d5b78d65a097dabae5ea89'; // Replace with your vault ID

require("dotenv").config();

const runFetch = async () => {
    await fetchVaultData(vaultId);
};

// Call the function immediately
runFetch();
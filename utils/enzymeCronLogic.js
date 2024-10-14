
// The function to fetch vault data
async function fetchVaultData(vaultId) {
  try {
    const myHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.ENZYME_API_KEY}`
    };
    const raw = JSON.stringify({ address: vaultId });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const response = await fetch("https://api.enzyme.finance/enzyme.enzyme.v1.EnzymeService/GetVault", requestOptions);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    console.log("Vault Data:", result);
    // You can add logic here to store or process the result as needed.
    return result;
  } catch (error) {
    console.error("Fetch error:", error.message || error);
  }
}

module.exports = { fetchVaultData };
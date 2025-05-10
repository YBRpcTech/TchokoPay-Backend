const axios = require("axios"); // Import axios for HTTP requests
require("dotenv").config();

const API_KEY = process.env.MOMO_API_KEY;
const BASE_URL = "https://api.pay.mynkwa.com";

// General function to make API requests
const makeApiRequest = async (url, method, data) => {
  try {
    console.log(`[API REQUEST] ${method} ${url} | Payload:`, data);
    const response = await axios({
      url: `${BASE_URL}${url}`,
      method: method,
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    });
    console.log(`[API RESPONSE] ${method} ${url} | Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `[API ERROR] ${method} ${url} |`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response ? JSON.stringify(error.response.data) : error.message
    );
  }
};

// Delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Momo Payments Controller
const momoPayments = async (req, res) => {
  const { amount, sendersNumber, receiversNumber } = req.body;

  console.log(
    `[MOMO PAYMENT INITIATED] Amount: ${amount}, Sender: ${sendersNumber}, Receiver: ${receiversNumber}`
  );

  try {
    // Step 1: Collect Payment
    console.log(
      `[STEP 1] Initiating collection payment from ${sendersNumber}...`
    );
    const collectData = await makeApiRequest("/collect", "POST", {
      amount: amount,
      phoneNumber: sendersNumber,
    });

    if (!collectData.id) {
      console.warn(
        "[STEP 1 FAILED] Collection initiation failed:",
        collectData
      );
      return res
        .status(400)
        .json({ error: "Failed to initiate collection payment" });
    }

    // Step 2: Poll for collection status
    console.log("[STEP 2] Polling collection status...");
    let collectionStatus;
    let attempts = 0;
    do {
      collectionStatus = await makeApiRequest(
        `/payments/${collectData.id}`,
        "GET"
      );
      console.log(
        `[STATUS CHECK] Collection Attempt ${attempts + 1}: Status = ${
          collectionStatus.status
        }`
      );
      if (collectionStatus.status === "success") break;
      attempts++;
      await delay(5000);
    } while (collectionStatus.status !== "success" && attempts < 100);

    if (collectionStatus.status !== "success") {
      console.warn(
        "[STEP 2 FAILED] Collection payment not completed after 10 attempts."
      );
      return res
        .status(400)
        .json({ error: "Collection payment failed after multiple attempts" });
    }

    // Step 3: Disburse Payment
    console.log(
      `[STEP 3] Initiating disburse payment to ${receiversNumber}...`
    );
    const disburseData = await makeApiRequest("/disburse", "POST", {
      amount: amount,
      phoneNumber: receiversNumber,
    });

    if (disburseData.status !== "pending") {
      console.warn("[STEP 3 FAILED] Disburse initiation failed:", disburseData);
      return res
        .status(400)
        .json({ error: "Failed to initiate disburse payment" });
    }

    // Step 4: Poll for disburse status
    console.log("[STEP 4] Polling disburse status...");
    let disburseStatus;
    attempts = 0;
    do {
      disburseStatus = await makeApiRequest(
        `/payments/${disburseData.id}`,
        "GET"
      );
      console.log(
        `[STATUS CHECK] Disburse Attempt ${attempts + 1}: Status = ${
          disburseStatus.status
        }`
      );
      if (disburseStatus.status === "success") break;
      attempts++;
      await delay(5000);
    } while (disburseStatus.status !== "success" && attempts < 100);

    if (disburseStatus.status !== "success") {
      console.warn(
        "[STEP 4 FAILED] Disburse payment not completed after 10 attempts."
      );
      return res
        .status(400)
        .json({ error: "Disburse payment failed after multiple attempts" });
    }

    // Step 5: Success response
    console.log("[SUCCESS] Payment collected and disbursed successfully.");
    res
      .status(200)
      .json({ message: "Payment collected and disbursed successfully" });
  } catch (error) {
    console.error("[FATAL ERROR] Error processing Momo payment:", error);
    res
      .status(500)
      .json({ error: "An error occurred during payment processing" });
  }
};

module.exports = { momoPayments };

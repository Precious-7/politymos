// netlify/functions/quote.js
export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { name, phone, email, plan } = JSON.parse(event.body || "{}");

        if (!name || !phone || !email || !plan) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Name, Phone, Email, Plan required" }),
            };
        }

        const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
        const QUOTE_TABLE = process.env.QUOTE_TABLE || "Quote Requests";

        if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
            return {
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Server env vars not set" }),
            };
        }

        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(QUOTE_TABLE)}`;

        const fields = {
            "Your Name": name,
            "Phone Number": phone,
            "Email Address": email,
            "Plan": plan,
        };

        const airtableRes = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${AIRTABLE_PAT}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fields }),
        });

        const text = await airtableRes.text();

        if (!airtableRes.ok) {
            return {
                statusCode: airtableRes.status,
                headers: { "Content-Type": "application/json" },
                body: text,
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: text,
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: String(err) }),
        };
    }
}

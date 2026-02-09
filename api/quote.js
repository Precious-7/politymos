// api/quote.js

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { name, phone, email, plan } = req.body;

        if (!name || !phone || !email || !plan) {
            return res.status(400).json({ error: "Name, Phone, Email, Plan required" });
        }

        const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
        const QUOTE_TABLE = process.env.QUOTE_TABLE || "Quote Requests";

        if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
            return res.status(500).json({ error: "Server env vars not set" });
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

        const data = await airtableRes.json();

        if (!airtableRes.ok) {
            return res.status(airtableRes.status).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: String(err) });
    }
}

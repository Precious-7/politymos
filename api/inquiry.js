// api/inquiry.js

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const body = req.body;

        const name = (body.name || "").trim();
        const phone = (body.phone || "").trim();
        const email = (body.email || "").trim();
        const service = (body.service || "").trim();
        const instructions = (body.instructions || "").trim();

        if (!name || !phone) {
            return res.status(400).json({ error: "Name and Phone required" });
        }

        const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
        const INQUIRY_TABLE = process.env.INQUIRY_TABLE || "Quick Inquiries";

        if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
            return res.status(500).json({ error: "Missing AIRTABLE_PAT or AIRTABLE_BASE_ID env vars" });
        }

        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(INQUIRY_TABLE)}`;

        const fields = {
            "Your Name": name,
            "Phone Number": phone,
            "Email": email,
            "Service Needed": service,
            "Special Instructions": instructions,
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

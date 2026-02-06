// netlify/functions/inquiry.js

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body || "{}");

        const name = (body.name || "").trim();
        const phone = (body.phone || "").trim();
        const email = (body.email || "").trim();
        const service = (body.service || "").trim();
        const instructions = (body.instructions || "").trim();

        if (!name || !phone) {
            return { statusCode: 400, body: JSON.stringify({ error: "Name and Phone required" }) };
        }

        const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
        const INQUIRY_TABLE = process.env.INQUIRY_TABLE || "Quick Inquiries";

        if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Missing AIRTABLE_PAT or AIRTABLE_BASE_ID env vars" }),
            };
        }

        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(INQUIRY_TABLE)}`;

        const fields = {
            "Your Name": name,
            "Phone Number": phone,
            "Email": email,
            "Service Needed": service,
            "Special Instructions": instructions,
        };

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${AIRTABLE_PAT}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fields }),
        });

        const text = await res.text();

        if (!res.ok) {
            return { statusCode: res.status, body: text };
        }

        return { statusCode: 200, body: text };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
    }
};

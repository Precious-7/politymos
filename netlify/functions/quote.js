export default async (req) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { name, phone, email, plan } = await req.json();

        if (!name || !phone || !email || !plan) {
            return new Response(JSON.stringify({ error: "Name, Phone, Email, Plan required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
        const QUOTE_TABLE = process.env.QUOTE_TABLE || "Quote Requests";

        if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
            return new Response(JSON.stringify({ error: "Server env vars not set" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
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
            return new Response(text, {
                status: airtableRes.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(text, {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

// ========= Global State =========
window.selectedPlan = "";

// ========= Helpers =========
function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ========= Main =========
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ main.js loaded");

    // ----- Navigation buttons -----
    document.getElementById("hero-book-pickup")
        ?.addEventListener("click", () => scrollToSection("#contact"));

    document.getElementById("hero-our-services")
        ?.addEventListener("click", () => scrollToSection("#services"));

    document.getElementById("nav-book-pickup")
        ?.addEventListener("click", () => scrollToSection("#contact"));

    // ----- Modal -----
    const modal = document.getElementById("subscription-modal");
    const closeBtn = document.getElementById("close-modal");

    function openModal() {
        modal?.classList.remove("hidden");
    }

    function closeModal() {
        modal?.classList.add("hidden");
    }

    document.getElementById("btn-get-quote")
        ?.addEventListener("click", openModal);

    closeBtn?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // ----- Plan selection -----
    window.selectPlan = (plan) => {
        window.selectedPlan = plan;

        document.getElementById("weekly-plan").checked = plan === "weekly";
        document.getElementById("monthly-plan").checked = plan === "monthly";

        document.querySelectorAll(".plan-card").forEach((el) => {
            const active = el.id === `plan-${plan}`;
            el.classList.toggle("border-amber-500", active);
            el.classList.toggle("bg-amber-50", active);
        });
    };

    document.getElementById("plan-weekly")
        ?.addEventListener("click", () => window.selectPlan("weekly"));

    document.getElementById("plan-monthly")
        ?.addEventListener("click", () => window.selectPlan("monthly"));

    // ----- Inquiry Form -----
    const inquiryForm = document.getElementById("inquiry-form");

    inquiryForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            name: document.getElementById("name")?.value.trim(),
            phone: document.getElementById("phone")?.value.trim(),
            email: document.getElementById("email")?.value.trim(),
            service: document.getElementById("service")?.value.trim(),
            instructions: document.getElementById("special-instructions")?.value.trim(),
        };

        if (!payload.name || !payload.phone) {
            alert("Please fill Name and Phone.");
            return;
        }

        try {
            const res = await fetch("/.netlify/functions/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Inquiry failed");

            inquiryForm.style.display = "none";
            document.getElementById("form-success")?.classList.remove("hidden");

            setTimeout(() => {
                inquiryForm.reset();
                inquiryForm.style.display = "block";
                document.getElementById("form-success")?.classList.add("hidden");
            }, 3000);

        } catch (err) {
            console.error("❌ Inquiry error:", err);
            alert("Inquiry submit failed.");
        }
    });

    // ----- Quote Form -----
    const quoteForm = document.getElementById("subscription-form");

    quoteForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!window.selectedPlan) {
            alert("Please select Weekly or Monthly plan.");
            return;
        }

        const payload = {
            name: document.getElementById("sub-name")?.value.trim(),
            phone: document.getElementById("sub-phone")?.value.trim(),
            email: document.getElementById("sub-email")?.value.trim(),
            plan: window.selectedPlan,
        };

        if (!payload.name || !payload.phone || !payload.email) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const res = await fetch("/.netlify/functions/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Quote failed");

            quoteForm.style.display = "none";
            document.getElementById("subscription-success")?.classList.remove("hidden");

            setTimeout(() => {
                document.getElementById("subscription-success")?.classList.add("hidden");
                quoteForm.reset();
                quoteForm.style.display = "block";
                window.selectedPlan = "";
                closeModal();
            }, 2500);

        } catch (err) {
            console.error("❌ Quote error:", err);
            alert("Quote submit failed.");
        }
    });
});

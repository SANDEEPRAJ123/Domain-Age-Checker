async function searchWebsite() {
    console.log("Search button clicked");

    const domainInput = document.getElementById("website").value.trim();
    const errorMessage = document.getElementById("error-message");
    const reportContainer = document.querySelector(".report-container");
    const loader = document.getElementById("loader");
    const progressBar = document.getElementById("progress-bar");
    const loadingText = document.getElementById("loading-text");

    // Clear any previous error message
    errorMessage.textContent = "";

    // Validate input
    if (!domainInput) {
        errorMessage.textContent = "Please enter a website URL.";
        reportContainer.style.display = "none"; // Ensure report is hidden
        return;
    }

    // Show loader and progress bar
    loader.style.display = "flex";
    let progress = 1;  // Start at 1%

    // Update the progress bar every 100ms until it reaches 100%
    const interval = setInterval(() => {
        if (progress < 100) {
            progress++;
            progressBar.style.width = `${progress}%`;
            loadingText.textContent = `Loading... ${progress}%`;
        }
    }, 100);  // Update every 100ms

    try {
        const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_CWbXZAw4hRggW8uIdpUZ2aArwczLs&domainName=${domainInput}&outputFormat=JSON`;
        console.log(`API URL: ${apiUrl}`); // Log the API URL being called

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        if (data && data.WhoisRecord) {
            const domainName = data.WhoisRecord.domainName || "N/A";
            const registered = data.WhoisRecord.createdDate ? "Yes" : "No";
            const creationDate = data.WhoisRecord.createdDate ? new Date(data.WhoisRecord.createdDate) : null;

            document.getElementById("domain-name").textContent = domainName;
            document.getElementById("domain-registered").textContent = registered;
            document.getElementById("creation-date").textContent = creationDate ? creationDate.toDateString() : "N/A";

            if (creationDate) {
                displayDomainAge(creationDate);
            } else {
                document.getElementById("age-days").textContent = "N/A";
                document.getElementById("age-months").textContent = "N/A";
                document.getElementById("age-years").textContent = "N/A";
            }

            // Show the report container after data is fetched
            reportContainer.style.display = "block";
        } else {
            errorMessage.textContent = "No data found for this domain.";
            reportContainer.style.display = "none"; // Ensure it's hidden if no data found
        }
    } catch (error) {
        console.error("Error fetching domain information:", error);
        errorMessage.textContent = "An error occurred while fetching the data."; // Display error message
        reportContainer.style.display = "none"; // Ensure it’s hidden on error
    } finally {
        // Stop the progress bar and hide the loader after 10 seconds
        setTimeout(() => {
            clearInterval(interval);  // Stop updating progress
            loader.style.display = "none"; // Hide the loader
        }, 10000); // Hide after 10 seconds
    }
}

function displayDomainAge(creationDate) {
    const now = new Date();
    const ageInMilliseconds = now - creationDate;

    const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
    const ageInMonths = Math.floor(ageInDays / 30.44);
    const ageInYears = Math.floor(ageInDays / 365.25);

    document.getElementById("age-days").textContent = `${ageInDays} days`;
    document.getElementById("age-months").textContent = `${ageInMonths} months`;
    document.getElementById("age-years").textContent = `${ageInYears} years`;
}

// Hamburger Menu Toggle Function
function toggleHamburgerMenu() {
    const menu = document.getElementById("menu");
    const hamburger = document.getElementById("hamburger");

    menu.classList.toggle("active");

    // Change the hamburger icon
    if (menu.classList.contains("active")) {
        hamburger.innerHTML = "X"; // Close menu
    } else {
        hamburger.innerHTML = "☰"; // Open menu
    }
}

// Add event listener to hamburger menu
document.getElementById("hamburger").addEventListener("click", toggleHamburgerMenu);

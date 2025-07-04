const API_BASE_URL = "/api/v1"; 


async function fetchAPI(endpoint, method = "GET", body = null) {
    const headers = {
        "Content-Type": "application/json",
    };

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (response.status==401) {
        sessionStorage.removeItem("user"); 
        window.location.href = "/login.html";
    }
    if (!response.ok) {
        throw new Error(data.message || "API request failed");
    }
    const data = await response.json();
    return data;
}

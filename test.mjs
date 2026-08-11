async function test() {
  try {
    const username = 'testuser' + Date.now() + '@example.com';
    const password = 'password123';

    console.log("Registering...", username);
    await fetch('http://localhost:3000/api/auth/register/patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    console.log("Logging in...");
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const loginData = await loginRes.json();
    console.log("Login Token:", loginData.token ? "YES" : "NO");

    if (!loginData.token) {
        console.log("Login failed", loginData);
        return;
    }

    console.log("Fetching appointments...");
    const apptsRes = await fetch('http://localhost:3000/api/patient/appointments', {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    console.log("Status:", apptsRes.status);
    const appts = await apptsRes.json();
    console.log("Appointments Count:", appts.length);
  } catch (err) {
    console.error("Test failed", err.message);
  }
}
test();

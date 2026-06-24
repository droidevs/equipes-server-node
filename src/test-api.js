const testAPI = async () => {
  // 1. Inscription
  const register = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'john@exemple.com',
      password: '123456',
      name: 'John Doe',
    }),
  });
  console.log('Inscription:', await register.json());

  // 2. Connexion
  const login = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'john@exemple.com',
      password: '123456',
    }),
  });
  const loginData = await login.json();
  console.log('Connexion:', loginData);

  // 3. Profil protégé
  if (loginData.token) {
    const profile = await fetch('http://localhost:3000/api/profile', {
      headers: { Authorization: `Bearer ${loginData.token}` },
    });
    console.log('Profil:', await profile.json());
  }
};

testAPI();

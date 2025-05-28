const Model = {
  async login(email, password) {
    try {
      const res = await fetch('https://story-api.dicoding.dev/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (err) {
      console.error('Login error:', err);
      return { error: true, message: 'Terjadi kesalahan saat login' };
    }
  },

  async register(name, email, password) {
    try {
      const res = await fetch('https://story-api.dicoding.dev/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return await res.json();
    } catch (err) {
      console.error('Register error:', err);
      return { error: true, message: 'Terjadi kesalahan saat registrasi' };
    }
  },

  async getStories(token) {
    try {
      const res = await fetch('https://story-api.dicoding.dev/v1/stories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (err) {
      console.error('Fetch stories error:', err);
      return { error: true, message: 'Gagal mengambil data stories' };
    }
  },

  async addStory(token, formData) {
    try {
      const res = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return await res.json();
    } catch (err) {
      console.error('Add story error:', err);
      return { error: true, message: 'Gagal menambah story' };
    }
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  getToken() {
    return localStorage.getItem('token');
  },
};

export default Model;

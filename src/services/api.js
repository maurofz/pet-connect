const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper method to handle responses
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    register: (userData) => this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

    login: (credentials) => this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

    getMe: () => this.request('/auth/me'),

    updateProfile: (profileData) => this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),

    changePassword: (passwordData) => this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    }),

    uploadAvatar: (file) => {
      const formData = new FormData();
      formData.append('image', file);

      return this.request('/auth/avatar', {
        method: 'POST',
        headers: {
          Authorization: this.getAuthHeaders().Authorization
        },
        body: formData
      });
    },

    logout: () => this.request('/auth/logout', {
      method: 'POST'
    })
  };

  // Users endpoints
  users = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/users?${queryString}`);
    },

    getById: (id) => this.request(`/users/${id}`),

    search: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/users/search?${queryString}`);
    },

    update: (id, userData) => this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),

    delete: (id) => this.request(`/users/${id}`, {
      method: 'DELETE'
    }),

    getStats: () => this.request('/users/stats/overview')
  };

  // Pets endpoints
  pets = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/pets?${queryString}`);
    },

    getById: (id) => this.request(`/pets/${id}`),

    create: (petData, files = []) => {
      const formData = new FormData();

      // Add pet data
      Object.keys(petData).forEach(key => {
        if (key === 'health' || key === 'behavior' || key === 'location') {
          formData.append(key, JSON.stringify(petData[key]));
        } else {
          formData.append(key, petData[key]);
        }
      });

      // Add images
      files.forEach(file => {
        formData.append('images', file);
      });

      return this.request('/pets', {
        method: 'POST',
        headers: {
          Authorization: this.getAuthHeaders().Authorization
        },
        body: formData
      });
    },

    update: (id, petData, files = []) => {
      const formData = new FormData();

      // Add pet data
      Object.keys(petData).forEach(key => {
        if (key === 'health' || key === 'behavior' || key === 'location') {
          formData.append(key, JSON.stringify(petData[key]));
        } else {
          formData.append(key, petData[key]);
        }
      });

      // Add images
      files.forEach(file => {
        formData.append('images', file);
      });

      return this.request(`/pets/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: this.getAuthHeaders().Authorization
        },
        body: formData
      });
    },

    delete: (id) => this.request(`/pets/${id}`, {
      method: 'DELETE'
    }),

    search: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/pets/search?${queryString}`);
    },

    getFeatured: () => this.request('/pets/featured'),

    toggleFavorite: (id) => this.request(`/pets/${id}/favorite`, {
      method: 'POST'
    }),

    applyForAdoption: (id, message) => this.request(`/pets/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify({ message })
    }),

    getMyPets: () => this.request('/pets/my-pets/list'),

    getFavorites: () => this.request('/pets/favorites/list')
  };

  // Posts endpoints
  posts = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/posts?${queryString}`);
    },

    getById: (id) => this.request(`/posts/${id}`),

    create: (postData, files = []) => {
      const formData = new FormData();

      // Add post data
      Object.keys(postData).forEach(key => {
        if (key === 'tags' || key === 'location') {
          formData.append(key, JSON.stringify(postData[key]));
        } else {
          formData.append(key, postData[key]);
        }
      });

      // Add images
      files.forEach(file => {
        formData.append('images', file);
      });

      return this.request('/posts', {
        method: 'POST',
        headers: {
          Authorization: this.getAuthHeaders().Authorization
        },
        body: formData
      });
    },

    update: (id, postData, files = []) => {
      const formData = new FormData();

      // Add post data
      Object.keys(postData).forEach(key => {
        if (key === 'tags' || key === 'location') {
          formData.append(key, JSON.stringify(postData[key]));
        } else {
          formData.append(key, postData[key]);
        }
      });

      // Add images
      files.forEach(file => {
        formData.append('images', file);
      });

      return this.request(`/posts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: this.getAuthHeaders().Authorization
        },
        body: formData
      });
    },

    delete: (id) => this.request(`/posts/${id}`, {
      method: 'DELETE'
    }),

    toggleLike: (id) => this.request(`/posts/${id}/like`, {
      method: 'POST'
    }),

    share: (id) => this.request(`/posts/${id}/share`, {
      method: 'POST'
    }),

    addComment: (id, content) => this.request(`/posts/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content })
    }),

    addReply: (postId, commentId, content) => this.request(`/posts/${postId}/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content })
    }),

    getUserPosts: (userId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/posts/user/${userId}?${queryString}`);
    },

    getTrending: () => this.request('/posts/trending'),

    search: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/posts/search?${queryString}`);
    }
  };

  // Feed endpoints
  feed = {
    getGeneral: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/feed?${queryString}`);
    },

    getPersonalized: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/feed/personalized?${queryString}`);
    },

    getStats: () => this.request('/feed/stats')
  };

  // Utility endpoints
  health = {
    check: () => this.request('/health')
  };
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 
/**
 * Newsletter API - subscribe (public)
 */
import api from '../axios.js';

export const newsletterService = {
  subscribe(email) {
    return api.post('/newsletter/subscribe', { email }).then((res) => res.data);
  },
};

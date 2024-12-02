import HttpClient from "../apis/HttpClient";

export default class CategoryService {
  static async get(id) {
    return HttpClient.get(`/category/${id}`);
  }
  static async gets(queryParams) {
    return HttpClient.get(`/category?${queryParams}`);
  }
  static async post(formData) {
    return HttpClient.post("/category", formData);
  }
  static async put(id, formData) {
    return HttpClient.put(`/category/${id}`, formData);
  }
  static async delete(id) {
    return HttpClient.delete(`/category/${id}`);
  }
}

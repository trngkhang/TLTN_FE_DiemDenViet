import HttpClient from "../apis/HttpClient";

export default class UserService {
  static async get(id) {
    return HttpClient.get(`/user/${id}`);
  }
  static async gets(queryParams) {
    return HttpClient.get(`/user?${queryParams}`);
  }
  static async post(formData) {
    return HttpClient.post("/user", formData);
  }
  static async delete(id) {
    return HttpClient.delete(`/user/${id}`);
  }
}

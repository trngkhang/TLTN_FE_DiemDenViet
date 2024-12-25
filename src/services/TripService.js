import HttpClient from "../apis/HttpClient";

export default class TripService {
  static async get(id) {
    return HttpClient.get(`/trip/${id}`);
  }
  static async gets(queryParams) {
    return HttpClient.get(`/trip?${queryParams}`);
  }
  static async postbyai(formData) {
    return HttpClient.post("/trip/byai", formData);
  }
  static async postfromdb(formData) {
    return HttpClient.post("/trip/fromdb", formData);
  }
  static async delete(id) {
    return HttpClient.delete(`/trip/${id}`);
  }
}

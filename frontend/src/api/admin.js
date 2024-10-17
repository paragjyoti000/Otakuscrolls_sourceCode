import conf from "../envConf/conf";
import { callAxios } from "./auth";

export class AdminService {
    config;

    constructor() {
        this.config = {
            headers: {
                "api-key": conf.apiKey,
            },
        };
    }

    async getGoogleCityWiseAnalytics(from = "7daysAgo") {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/admin/get-city-wise-analytics?from=${from}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }
    async getGoogleGraphAnalytics(from = "7daysAgo") {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/admin/get-graph-analytics?from=${from}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async getDashboardData() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/admin/dashboard-card-data`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async searchUser(query) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/admin/user-search/${query}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async updateUserRole(userId, role) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/admin/user-role-update`;
        this.config.data = { userId, role };

        return await callAxios(this.config).then((res) => res.data.data);
    }
    async updateUsersPermissions(userId, permissions) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/admin/user-permissions-update`;
        this.config.data = { userId, permissions };

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async updateUserLabels(userId, labels) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/admin/user-labels-update`;
        this.config.data = { userId, labels };

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async getLatestUsers() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/admin/get-latest-users`;

        return await callAxios(this.config).then((res) => res.data.data);
    }
    async getAdmins() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/admin/get-admins`;

        return await callAxios(this.config).then((res) => res.data.data);
    }
}

export default new AdminService();

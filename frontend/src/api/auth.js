import axios from "axios";
import conf from "../envConf/conf";
import Cookies from "js-cookie";

export const callAxios = async function (config) {
    config.headers["Authorization"] = `Bearer ${Cookies.get("accessToken")}`;

    return await axios.request(config);
};

export class AuthService {
    config;

    constructor() {
        this.config = {
            headers: {
                "api-key": conf.apiKey,
                "Content-Type": "application/json",
            },
        };
    }

    async createAccount({ username, email, password, rememberMe }) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/users/register`;
        this.config.data = {
            username,
            email,
            password,
        };
        const userAccount = await callAxios(this.config);

        if (userAccount.data.data) {
            return await this.login({
                usernameOrEmail: email,
                password,
                rememberMe,
            }).then((response) => {
                return response;
            });
        } else {
            return userAccount;
        }
    }

    async login({ usernameOrEmail, password, rememberMe }) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/users/login`;
        this.config.data = {
            usernameOrEmail,
            password,
        };

        return await callAxios(this.config).then((response) => {
            Cookies.set("accessToken", response.data.data.accessToken, {
                expires: 1,
            });
            Cookies.set("refreshToken", response.data.data.refreshToken, {
                expires: rememberMe ? 10 : 1,
            });
            return response.data.data;
        });
    }

    async getCurrentUser() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/users/current-user`;

        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        if (!accessToken && refreshToken) {
            this.config.method = "POST";
            this.config.url = `${conf.baseUrl}/api/v1/users/refresh-token`;
            this.config.data = {
                refreshToken,
            };

            await callAxios(this.config).then((response) => {
                Cookies.set("accessToken", response.data.data.accessToken, {
                    expires: 1,
                });
                Cookies.set("refreshToken", response.data.data.refreshToken, {
                    expires: 10,
                });
            });

            return;
        }

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async logout() {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/users/logout`;

        return await callAxios(this.config).then((response) => {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            return response.data.data;
        });
    }

    async changePassword({ oldPassword, newPassword }) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/users/change-password`;
        this.config.data = {
            oldPassword,
            newPassword,
        };
        return await callAxios(this.config).then(
            (response) => response.data.success
        );
    }

    async getUserProfile(username) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/users/profile/${username}`;
        return await callAxios(this.config).then((response) => {
            return response.data.data;
        });
    }

    async updateUserAccountName(name) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/users/update-account`;
        this.config.data = {
            name,
        };
        return await callAxios(this.config).then((response) => {
            return response.data.data;
        });
    }

    async getAllAvatarOptions() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/users/avatar-options`;
        return await callAxios(this.config).then((response) => {
            return response.data.data;
        });
    }

    async updateAvatar(avatar) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/users//update-avatar`;
        this.config.data = { avatar };

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async createRecoveryEmail({ email }) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/users/forgot-password-email`;
        this.config.data = { email };

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async passwordRecovery({ userId, secret, password }) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/users/reset-password`;
        this.config.data = { userId, secret, password };
        return await callAxios(this.config).then((response) => response.data);
    }

    async followUnfollowUser(userId) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/follow/${userId}`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async sendVerificationEmail() {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/users/send-otp`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async verifyEmail(otp) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/users/verify-otp`;
        this.config.data = { otp };
        return await callAxios(this.config).then((response) => response.data);
    }

    async updateChapterUserPrefs(prefs) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/users/update-chapter-user-prefs`;
        this.config.data = { prefs };
        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }
}

const authService = new AuthService();

export default authService;

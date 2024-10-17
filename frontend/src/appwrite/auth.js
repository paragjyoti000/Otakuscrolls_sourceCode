/* eslint-disable no-useless-catch */
import conf from "../envConf/conf";
import { Client, Account, ID, Storage } from "appwrite";

export class AuthService {
    client = new Client();
    account;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.bucket = new Storage(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }

    async createRecoveryEmail({ email }) {
        try {
            return await this.account.createRecovery(
                email,
                window.location.origin + "/password-recovery"
            );
        } catch (error) {
            throw error;
        }
    }

    async passwordRecovery({ userId, secret, password, passwordAgain }) {
        try {
            return await this.account.updateRecovery(
                userId,
                secret,
                password,
                passwordAgain
            );
        } catch (error) {
            throw error;
        }
    }

    profilePreview(fileId) {
        return this.bucket.getFilePreview(conf.appwriteProfileBucketId, fileId);
    }

    async updateName({ name }) {
        try {
            return await this.account.updateName(name);
        } catch (error) {
            throw error;
        }
    }

    async updateEmail({ email }) {}

    async updatePassword({ password }) {}

    async updatePrefs(pref) {
        try {
            return await this.account.updatePrefs(pref);
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;

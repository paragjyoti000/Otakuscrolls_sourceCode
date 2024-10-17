/* eslint-disable no-useless-catch */
import conf from "../envConf/conf";
import { Client, Storage, Databases, ID, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // Novels upload services

    async createNovel({
        title,
        slug,
        author,
        description,
        featuredImage,
        isPublished,
        genre,
        uploadedBy,
    }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNovelsId,
                slug,
                {
                    title,
                    author,
                    description,
                    featuredImage,
                    isPublished,
                    genre: [...genre],
                    uploadedBy,
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async updateNovels(
        slug,
        { title, author, description, featuredImage, isPublished, genre }
    ) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNovelsId,
                slug,
                {
                    title,
                    author,
                    description,
                    featuredImage,
                    isPublished,
                    genre: [...genre],
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteNovel(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNovelsId,
                slug
            );
            return true;
        } catch (error) {
            throw error;
            return false;
        }
    }

    async getNovel(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNovelsId,
                slug
            );
        } catch (error) {
            throw error;
            return false;
        }
    }

    async getNovels(isPublished = true, page = 1, limit = 6, queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteNovelsId,
                [
                    ...queries,
                    Query.equal("isPublished", isPublished),
                    Query.limit(limit),
                    Query.offset((page - 1) * limit),
                ]
            );
        } catch (error) {
            throw error;
        }
    }

    async searchNovels(attribute = "title", query, isPublished = true) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteNovelsId,
                [
                    Query.search(attribute, query),
                    Query.equal("isPublished", isPublished),
                ]
            );
        } catch (error) {
            throw error;
        }
    }

    // file upload services

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            throw error;
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
        } catch (error) {
            throw error;
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
    }

    // chapter upload services

    async createChapter(novelSlug, { title, content, isPublished }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteChaptersId,
                ID.unique(),
                {
                    title,
                    content,
                    isPublished,
                    novel: novelSlug,
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async updateChapter(slug, { title, content, isPublished }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteChaptersId,
                slug,
                { title, content, isPublished }
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteChapter(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteChaptersId,
                slug
            );
            return true;
        } catch (error) {
            throw error;
            return false;
        }
    }

    async getChapter(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteChaptersId,
                slug
            );
        } catch (error) {
            throw error;
            return false;
        }
    }
}

const service = new Service();
export default service;

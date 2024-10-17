import conf from "../envConf/conf";
import { callAxios } from "./auth";

export class Service {
    config;

    constructor() {
        this.config = {
            headers: {
                "api-key": conf.apiKey,
            },
        };
    }

    // Novels upload services

    async createNovel(formData) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/novels/add-novel`;
        this.config.data = formData;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async updateNovels(novelId, formData) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/novels//update-novel/${novelId}`;
        this.config.data = formData;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async deleteNovel(id) {
        this.config.method = "DELETE";
        this.config.url = `${conf.baseUrl}/api/v1/novels/delete-novel/${id}`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async getNovel(id, page = 1, limit = 20) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/novels/get-novel/${id}?page=${page}&limit=${limit}`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async getNovelWithHistory(id, page = 2, limit = 20) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/novels/get-novel-with-history/${id}?page=${page}&limit=${limit}`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async getNewNovels() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/novels/get-novels`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async getCompletedNovels() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/novels/get-completed-novels`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async getNewRelease() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/chapters/get-latest-chapters`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async getDraftNovels() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/novels/get-draft-novels`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async getNovelsByUser() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/novels/all-novels-by-user`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async searchNovels(query) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/novels/search/${query}`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    // chapter upload services

    async createChapter(
        novelId,
        { sequenceNumber, title, content, isPublished }
    ) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/chapters/add-chapter/${novelId}`;
        this.config.data = { sequenceNumber, title, content, isPublished };

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async updateChapter(
        chapterId,
        { sequenceNumber, title, content, isPublished }
    ) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/chapters/update-chapter/${chapterId}`;
        this.config.data = { sequenceNumber, title, content, isPublished };

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async updateChapterInfo(chapterId, { sequenceNumber, title, isPublished }) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/chapters/update-chapter-info/${chapterId}`;
        this.config.data = { sequenceNumber, title, isPublished };

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async deleteChapter(chapterId) {
        this.config.method = "DELETE";
        this.config.url = `${conf.baseUrl}/api/v1/chapters/delete-chapter/${chapterId}`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async getChapter(chapterId) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/chapters/get-chapter/${chapterId}`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async getChaptersByNovel(novelId) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/chapters/get-all-chapters-by-novel/${novelId}`;

        return await callAxios(this.config).then(
            (response) => response.data.data
        );
    }

    async rateANovel(novelId, rating) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/rating/add-rating/${novelId}`;
        this.config.data = { rating };

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async getUserRating(novelId) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/rating/get-user-rating/${novelId}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async addOrRemoveBookmark(novelId) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/bookmark/add-or-remove-bookmark/${novelId}`;

        return await callAxios(this.config).then((res) => res.data);
    }

    async getBookmarks() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/bookmark/get-bookmarks`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async deleteBookmark(novelId) {
        this.config.method = "DELETE";
        this.config.url = `${conf.baseUrl}/api/v1/bookmark/delete-single-bookmark/${novelId}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async isBookmarkedByUser(novelId) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/bookmark/is-bookmarked-by-user/${novelId}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async addNovelComment(novelId, content, parentId) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/comments/add-novel-comment/${novelId}`;
        this.config.data = {
            content,
            parentId: parentId || null,
        };

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async addChapterComment(chapterId, content, parentId) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/comments/add-chapter-comment/${chapterId}`;
        this.config.data = {
            content,
            parentId: parentId || null,
        };

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async getComments(commentFor) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/comments/get-comments/${commentFor}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async updateComment(commentId, content) {
        this.config.method = "PATCH";
        this.config.url = `${conf.baseUrl}/api/v1/comments/edit-comment/${commentId}`;
        this.config.data = { content };

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async deleteComment(commentId) {
        this.config.method = "DELETE";
        this.config.url = `${conf.baseUrl}/api/v1/comments/delete-comment/${commentId}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    // Read History

    async addHistory(novelId, chapterId) {
        this.config.method = "POST";
        this.config.url = `${conf.baseUrl}/api/v1/history/add-history/${novelId}`;
        this.config.data = { chapterId };

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async getReadHistory() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/history/get-read-history`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async deleteSingleHistory(historyId) {
        this.config.method = "DELETE";
        this.config.url = `${conf.baseUrl}/api/v1/history/delete-single-history/${historyId}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    // Novel getting

    async getTrendingNovels(from = "yesterday") {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/novels/get-top-five-novel?from=${from}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    // Getting novel for Carousel

    async getNovelForCarousel() {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/novels/get-carousal-novels`;

        return await callAxios(this.config).then((res) => res.data.data);
    }

    async getLatestFeed(page = 1, limit = 10) {
        this.config.method = "GET";
        this.config.url = `${conf.baseUrl}/api/v1/chapters/get-latest-feed?page=${page}&limit=${limit}`;

        return await callAxios(this.config).then((res) => res.data.data);
    }
}

const service = new Service();
export default service;

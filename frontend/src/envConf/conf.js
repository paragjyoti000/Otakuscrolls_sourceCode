const conf = {
    apiKey: String(import.meta.env.VITE_BACKEND_API_KEY),

    tinyMCEApiKey: String(import.meta.env.VITE_TINYMCE_API_KEY),

    discordBotToken: String(import.meta.env.VITE_DISCORD_BOT_TOKEN),

    googleAnalyticsMeasurementId: String(
        import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID
    ),

    discordMailboxUrl: String(import.meta.env.VITE_DISCORD_WEBHOOK_MAILBOX_URL),
    discordNovelUrl: String(import.meta.env.VITE_DISCORD_WEBHOOK_NOVEL_URL),
    discordChapterUrl: String(import.meta.env.VITE_DISCORD_WEBHOOK_CHAPTER_URL),

    baseUrl: String(import.meta.env.VITE_BACKEND_BASE_URL),

    allAvailableUserPermissions: [
        { name: "Add Novel", id: "add_novel" },
        { name: "Update Novel", id: "update_novel" },
        { name: "Delete Novel", id: "delete_novel" },
        { name: "Add Chapter", id: "add_chapter" },
        { name: "Edit Chapter", id: "edit_chapter" },
        { name: "Delete Chapter", id: "delete_chapter" },
        { name: "Publish Novel", id: "publish_novel" },
        { name: "View Unpublished Chapter", id: "view_unpublished_chapter" },
        { name: "View Only Staff content", id: "view_only_staff_content" },
        { name: "Manage Users", id: "manage_users" },
        { name: "Assign Labels", id: "assign_labels" },
        { name: "View Analytics", id: "view_analytics" },
        { name: "Access Admin Panel", id: "access_admin_panel" },
    ],
    userRoles: ["Admin", "Staff", "Member"],

    userLabels: [
        { label: "Newbie", value: "Newbie" },
        { label: "Explorer", value: "Explorer" },
        { label: "Pro User", value: "Pro User" },
        { label: "Power User", value: "Power User" },
        { label: "Influencer", value: "Influencer" },
        { label: "Mentor", value: "Mentor" },
        { label: "Trendsetter", value: "Trendsetter" },
        { label: "Rising Star", value: "Rising Star" },
        { label: "Elite Member", value: "Elite Member" },
        { label: "Champion", value: "Champion" },
        { label: "Veteran", value: "Veteran" },
        { label: "Guru", value: "Guru" },
    ],

    statusOptions: ["Ongoing", "Completed", "Abandoned"],

    langOfOriginOptions: ["Korean", "Japanese", "Chinese", "English"],

    textSizeOptions: [
        {
            label: "Xtra Small",
            value: "text-xs",
        },
        {
            label: "Small",
            value: "text-sm",
        },
        {
            label: "Normal",
            value: "text-base",
        },
        {
            label: "Large",
            value: "text-lg",
        },
        {
            label: "XL",
            value: "text-xl",
        },
        {
            label: "2XL",
            value: "text-2xl",
        },
        {
            label: "3XL",
            value: "text-3xl",
        },
        {
            label: "4XL",
            value: "text-4xl",
        },
    ],

    backgroundColorOptions: [
        {
            label: "Default",
            value: "bg-inherit",
        },
        {
            label: "Dark",
            value: "bg-gray-800 text-gray-300",
        },
        {
            label: "Light",
            value: "bg-gray-300 text-gray-800",
        },
        {
            label: "Light-Paper",
            value: "bg-lime-100 text-gray-800",
        },
    ],

    fontFamilyOptions: [
        {
            label: "sans-serif",
            value: "font-sans",
            className: "font-sans",
        },
        {
            label: "Serif",
            value: "font-serif",
            className: "font-serif",
        },
        {
            label: "Monospace",
            value: "font-mono",
            className: "font-mono",
        },
        {
            label: "Quicksand",
            value: "font-quicksand",
            className: "font-quicksand",
        },
        {
            label: "Tisa",
            value: "font-tisa",
            className: "font-tisa",
        },
        {
            label: "Playpen",
            value: "font-playpen",
            className: "font-playpen",
        },
    ],

    genreOptions: [
        "Action",
        "Adult",
        "Adventure",
        "Comedy",
        "Cyberpunk",
        "Drama",
        "Eastern",
        "Ecchi",
        "Fan-fiction",
        "Fantasy",
        "Game",
        "Gender bender",
        "Harem",
        "Hentai",
        "Historical",
        "Horror",
        "Isekai",
        "Josei",
        "Lgbt+",
        "Litrpg",
        "Magic",
        "Magical realism",
        "Martial Arts",
        "Mature",
        "Mecha",
        "Military",
        "Modern life",
        "Movies",
        "Music",
        "Mystery",
        "Other",
        "Psychological",
        "Realistic fiction",
        "Reincarnation",
        "Romance",
        "School",
        "School life",
        "Sci-Fi",
        "Seinen",
        "Shoujo",
        "Shoujo ai",
        "Shounen",
        "Shounen ai",
        "Slice of Life",
        "Smut",
        "Sports",
        "Supernatural",
        "Superpower",
        "System",
        "Thriller",
        "Tragedy",
        "Urban",
        "Urban life",
        "Vampire",
        "Video games",
        "Wuxia",
        "Xianxia",
        "Xuanhuan",
        "Yaoi",
        "Yuri",
        "Zombies",
    ],
};

export default conf;

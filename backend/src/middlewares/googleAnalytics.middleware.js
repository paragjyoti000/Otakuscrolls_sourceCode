const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");

const { BetaAnalyticsDataClient } = require("@google-analytics/data");

const analyticsDataClient = new BetaAnalyticsDataClient();

propertyId = String(process.env.GOOGLE_ANALYTICS_PROPERTY_ID);

const getGoogleAnalytics = (
    dimensions = ["pagePath"],
    metrics = ["activeUsers"]
) =>
    asyncHandler(async (req, res, next) => {
        try {
            const [response] = await analyticsDataClient.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [
                    {
                        startDate: req.query?.from || "yesterday",
                        endDate: "today",
                    },
                ],
                dimensions: dimensions.map((x) => ({ name: x })),
                metrics: metrics.map((x) => ({ name: x })),
            });

            if (!response.rows.length) {
                throw new ApiError(400, "No rows found");
            }

            req.googleAnalytics = response.rows;
            next();
        } catch (error) {
            throw new ApiError(500, error?.message || "Internal server error");
        }
    });

module.exports = { getGoogleAnalytics };

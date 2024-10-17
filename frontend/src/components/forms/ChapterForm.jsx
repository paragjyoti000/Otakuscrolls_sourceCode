import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Loading, PermissionProvider, RTE } from "../";
import apiService from "../../api/service";
import useDiscord from "../../hooks/useDiscord";
import conf from "../../envConf/conf";
import { useSelector } from "react-redux";

function ChapterForm({ chapter }) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [redirectUrl, setRedirectUrl] = useState(null);

    const { novelId } = useParams();

    const { register, handleSubmit, control, getValues } = useForm({
        defaultValues: {
            sequenceNumber: chapter?.sequenceNumber || "",
            title: chapter?.title || "",
            content: chapter?.content || "",
            novel: novelId || "",
            isPublished: chapter?.isPublished || false,
        },
    });

    const navigate = useNavigate();

    const discord = useDiscord();

    const onSubmit = async (data) => {
        setError(null);
        setIsLoading(true);
        try {
            if (chapter) {
                const dbpost = await apiService.updateChapter(chapter._id, {
                    ...data,
                });

                if (dbpost) {
                    setRedirectUrl(
                        `/novel/${novelId}/chapter/${dbpost.sequenceNumber}/${dbpost._id}`
                    );
                }
            } else {
                const dbpost = await apiService.createChapter(novelId, {
                    ...data,
                });

                if (dbpost) {
                    apiService.getNovel(novelId).then((data) => {
                        if (data)
                            discord(conf.discordChapterUrl, {
                                content: `https://otakuscrolls.com/novel/${novelId}/chapter/${dbpost.sequenceNumber}/${dbpost._id}`,
                                title: dbpost.title.toUpperCase(),
                                message: `**Novel:** [${data.title.toUpperCase()}](https://otakuscrolls.com/novel/${novelId})\n**Chapter No.:** ${
                                    dbpost.sequenceNumber
                                }\n\nNew Chapter Added\n\n***Check out NOW***`,
                                image: data.coverImage,
                            });
                    });

                    setRedirectUrl(`/novel/${novelId}`);
                }
            }
        } catch (error) {
            setError({
                status: error.response.status,
                message: error.response.statusText,
            });
        } finally {
            setShowConfirmation(true);
            setIsLoading(false);
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        navigate(redirectUrl || `/novel/${novelId}`);
    };

    return (
        <PermissionProvider
            permission={["add_chapter", "edit_chapter"]}
            autoRedirect
        >
            <div className="mx-auto p-4 rounded-md">
                {/* Chapter Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Heading */}
                    <div className="pl-4">
                        <h1 className="text-xl font-bold">
                            {chapter ? `Edit Chapter` : `Add a new chapter`}
                        </h1>
                        <p className="text-gray-500">
                            Fields with <span className="text-red-500">*</span>{" "}
                            are Mandatory.
                        </p>
                    </div>

                    {/* isPublished & Sequence Number Inputs */}
                    <div className="flex justify-around items-center">
                        {/* isPublished Checkbox */}
                        <div className="">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    value=""
                                    className="sr-only peer"
                                    {...register("isPublished", {})}
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {chapter
                                        ? chapter.isPublished
                                            ? "Status: Published"
                                            : "Status: Draft (not published)"
                                        : "Publish (yes/no)"}
                                </span>
                            </label>
                        </div>

                        {/* Sequence Number */}
                        <div className="">
                            <Input
                                label="Sequence Number"
                                type="number"
                                required
                                placeholder="Sequence Number"
                                {...register("sequenceNumber", {
                                    required: true,
                                })}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-4">
                        <Input
                            label="Title"
                            type="text"
                            required
                            placeholder="Title"
                            {...register("title", {
                                required: true,
                            })}
                        />
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                        <Suspense fallback={<Loading />}>
                            <RTE
                                label="Content"
                                name="content"
                                required
                                control={control}
                                defaultValue={getValues("content")}
                            />
                        </Suspense>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-2">
                        <Button
                            className={`bg-green-600 hover:bg-green-700 py-2 px-4 text-base ${
                                isLoading ? "cursor-not-allowed" : ""
                            }`}
                            type="submit"
                        >
                            {isLoading
                                ? "Saving..."
                                : chapter
                                ? "Update"
                                : "Submit"}
                        </Button>
                        <div
                            className="bg-red-600 hover:bg-red-700 rounded-md py-2 px-4 text-base"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </div>
                    </div>
                </form>
                {showConfirmation && (
                    <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white z-0 dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full">
                            {error ? (
                                <>
                                    <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">
                                        Error {error.status}
                                    </h3>
                                    <p className="text-smtext-red-500 dark:text-red-300 mb-4">
                                        {error.message}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        Error occurred. Please try again.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                                        {chapter
                                            ? "Chapter Updated"
                                            : "Chapter Added"}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        {chapter
                                            ? "Chapter updated successfully."
                                            : "Chapter added successfully."}
                                    </p>
                                </>
                            )}
                            <button
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                onClick={handleCloseConfirmation}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PermissionProvider>
    );
}

export default ChapterForm;

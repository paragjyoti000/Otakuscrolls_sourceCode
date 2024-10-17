import { Suspense, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input, PermissionProvider, RTE } from "../";
import conf from "../../envConf/conf";
import Select from "react-select";
import apiService from "../../api/service";
import MySelect from "../MySelect";
import useDiscord from "../../hooks/useDiscord";
import { useSelector } from "react-redux";
import Loading from "../Loading";

function NovelForm({ novel }) {
    const SelectOptions = conf.genreOptions?.map((option) => ({
        value: option,
        label: option,
    }));

    const { register, handleSubmit, control, getValues } = useForm({
        defaultValues: {
            title: novel?.title || "",
            author: novel?.author || "",
            translatedBy: novel?.translatedBy?.username || "",
            genres:
                novel?.genres.map((option) => ({
                    value: option,
                    label: option,
                })) || [],
            description: novel?.description || "",
            glossaries: novel?.glossaries || "",
            status: novel?.status || "",
            langOfOrigin: novel?.langOfOrigin || "",
            isPublished: novel?.isPublished || false,
        },
    });

    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [redirectUrl, setRedirectUrl] = useState(null);

    const discord = useDiscord();

    const onSubmit = async (data) => {
        setError(null);
        setIsLoading(true);
        const newGenres = Array.from(data.genres, ({ value }) => value);

        const formData = new FormData();
        newGenres.forEach((genre, index) =>
            formData.append(`genres[${index}]`, genre)
        );

        formData.append("title", data.title);
        formData.append("author", data.author);
        formData.append("translatedBy", data.translatedBy);
        formData.append("description", data.description);
        formData.append("isPublished", data.isPublished);
        formData.append("status", data.status);
        formData.append("coverImage", data.coverImage[0] || "");
        formData.append("langOfOrigin", data.langOfOrigin);
        formData.append("glossaries", data.glossaries);

        try {
            if (novel) {
                const dbpost = await apiService.updateNovels(
                    novel._id,
                    formData
                );

                if (dbpost) {
                    setRedirectUrl(`/novel/${dbpost._id}`);
                }
            } else {
                if (data) {
                    const dbpost = await apiService.createNovel(formData);

                    if (dbpost) {
                        discord(conf.discordNovelUrl, {
                            content: `https://otakuscrolls.com/novel/${dbpost._id}`,
                            title: dbpost.title.toUpperCase(),
                            message: `**Author:** ${dbpost.author}\n**Language Of Origin:** ${dbpost.langOfOrigin}\n\nNew Novel Added\n\n***Check out NOW***`,
                            image: dbpost.coverImage,
                        });
                        setRedirectUrl(`/novel/${dbpost._id}`);
                    }
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
        redirectUrl && navigate(redirectUrl);
    };

    return (
        <PermissionProvider
            permission={["add_novel", "update_novel"]}
            autoRedirect
        >
            <div className="w-full">
                <div className="m-2 p-4 rounded-md">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Heading */}
                        <div className="pl-3 pb-2">
                            <h1 className="text-xl font-bold">
                                {novel ? `Edit Novel` : `Add a new Novel`}
                            </h1>
                            <p className="text-gray-500">
                                Fields with{" "}
                                <span className="text-red-500">*</span> are
                                Mandatory.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between gap-2">
                            <div className="md:w-1/3 m-2 flex flex-col items-start">
                                {/* isPublished toggle button */}
                                <PermissionProvider
                                    permission={["publish_novel"]}
                                    messageRequired
                                    message={
                                        "Sorry, You don't have permission to Publish Novel"
                                    }
                                >
                                    <div className="mb-4 w-full">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value=""
                                                className="sr-only peer"
                                                {...register("isPublished", {})}
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                {novel
                                                    ? novel.isPublished
                                                        ? "Status: Published"
                                                        : "Status: Draft (not published)"
                                                    : "Publish (yes/no)"}
                                            </span>
                                        </label>
                                    </div>
                                </PermissionProvider>

                                {/* form inputs */}
                                <div className="mb-4 w-full">
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

                                {/* Author input */}
                                <div className="mb-4 w-full">
                                    <Input
                                        label="Author"
                                        type="text"
                                        required
                                        placeholder="Author"
                                        {...register("author", {
                                            required: true,
                                        })}
                                    />
                                </div>

                                {/* Translator input */}
                                <div className="mb-4 w-full">
                                    <Input
                                        label="Translator (username)"
                                        type="text"
                                        required
                                        placeholder="Username of the Translator"
                                        {...register("translatedBy", {
                                            required: true,
                                        })}
                                    />
                                </div>

                                {/* Status input */}
                                <div className="mb-4 w-full">
                                    <MySelect
                                        label="Status"
                                        placeholder="Select Status"
                                        required
                                        options={conf.statusOptions}
                                        {...register("status", {
                                            required: true,
                                        })}
                                    />
                                </div>

                                {/* Language Of Origin input */}
                                <div className="mb-4 w-full">
                                    <MySelect
                                        label="Language Of Origin"
                                        placeholder="Select Language Of Origin"
                                        required
                                        options={conf.langOfOriginOptions}
                                        {...register("langOfOrigin", {
                                            required: true,
                                        })}
                                    />
                                </div>

                                {/* Cover Image input */}
                                <div className="mb-4 w-full">
                                    <Input
                                        label="Cover Image"
                                        type="file"
                                        required
                                        accept="image/png, image/jpg, image/jpeg"
                                        {...register("coverImage", {})}
                                    />
                                </div>

                                {/* Image preview */}
                                {novel && (
                                    <div className="mb-2 w-8 flex">
                                        <img
                                            src={novel.coverImage}
                                            alt={novel.title}
                                        />
                                    </div>
                                )}

                                {/* Genres input */}
                                <div className="mb-4 w-full">
                                    <div className="flex flex-col items-start">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 ">
                                            Genre&nbsp;
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Controller
                                            name="genres"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    placeholder="Select Genres"
                                                    options={SelectOptions}
                                                    defaultValue={getValues(
                                                        "genres"
                                                    )}
                                                    isMulti
                                                    className="block w-full border-none bg-white dark:bg-slate-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    classNames={{
                                                        control: () =>
                                                            "dark:bg-gray-800",
                                                        input: () =>
                                                            "dark:text-gray-100",
                                                        menu: () =>
                                                            "scrollbar-css dark:bg-gray-800 ",
                                                        option: () =>
                                                            "dark:bg-gray-800 hover:dark:bg-gray-500",
                                                        multiValue: () =>
                                                            "dark:bg-gray-500",
                                                        multiValueLabel: () =>
                                                            "dark:text-gray-100",
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end gap-2">
                                    <Button
                                        className={`bg-green-600 hover:bg-green-700 py-2 px-4 text-base ${
                                            isLoading
                                                ? "cursor-not-allowed"
                                                : ""
                                        }`}
                                        type="submit"
                                    >
                                        {isLoading
                                            ? "Saving..."
                                            : novel
                                            ? "Update"
                                            : "Submit"}
                                    </Button>
                                    <div
                                        className="bg-red-600 rounded-md py-2 px-4 text-base"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-2/3 md:m-2">
                                {/* description input */}
                                <div className="mb-4">
                                    <Suspense fallback={<Loading />}>
                                        <RTE
                                            label="Description"
                                            name="description"
                                            control={control}
                                            required
                                            defaultValue={getValues(
                                                "description"
                                            )}
                                        />
                                    </Suspense>
                                </div>

                                {/* glossaries input */}
                                <div className="mb-4">
                                    <Suspense fallback={<Loading />}>
                                        <RTE
                                            label="Glossaries"
                                            name="glossaries"
                                            control={control}
                                            defaultValue={getValues(
                                                "glossaries"
                                            )}
                                        />
                                    </Suspense>
                                </div>
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
                                            {novel
                                                ? "Novel Updated"
                                                : "Novel Added"}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                                            {novel
                                                ? "Novel updated successfully."
                                                : "Novel added successfully."}
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
            </div>
        </PermissionProvider>
    );
}

export default NovelForm;

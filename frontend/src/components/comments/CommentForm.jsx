import React from "react";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";

function CommentForm({ onSubmit, defaultValue = null }) {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            content: defaultValue || "",
        },
    });

    return (
        <div className="w-full p-2">
            <form
                onSubmit={handleSubmit((data) => {
                    onSubmit(data.content);
                    reset();
                })}
            >
                <div className="p-2 flex items-center gap-2 border-2 border-gray-300 dark:border-gray-500 rounded-md">
                    <textarea
                        className="w-full h-12 px-2 pt-2 text-sm bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-white"
                        rows={1}
                        cols={50}
                        placeholder="Write Your Comments here..."
                        {...register("content", { required: true })}
                    />

                    <button type="submit" className="p-2">
                        <IoSend size={25} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CommentForm;

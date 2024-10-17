import React from "react";
import useRelativeTime from "../../hooks/useRelativeTime";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";

function Comment({
    comment,
    replyComments = [],
    addComment,
    deleteComment,
    activeComment,
    setActiveComment,
    updateComment,
    parentId = null,
}) {
    const navigate = useNavigate();

    const date = useRelativeTime();

    const authStatus = useSelector((state) => state.auth.status);
    const userId = useSelector((state) => state.auth.user?._id);

    const isReplying =
        activeComment &&
        activeComment.type === "replying" &&
        activeComment.id === comment._id;

    const isEditing =
        activeComment &&
        activeComment.type === "editing" &&
        activeComment.id === comment._id;

    const replyId = parentId ? parentId : comment._id;

    return (
        <div>
            <div className="">
                <div className="flex items-start justify-start">
                    <div
                        className="mt-1 flex items-start justify-start gap-1 cursor-pointer"
                        onClick={() =>
                            navigate(
                                `/user/profile?user=${comment.user.username}`
                            )
                        }
                    >
                        <img
                            src={comment.user.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full border-2 border-indigo-500"
                        />
                        <div className="text-sm flex flex-col items-start justify-between gap-1">
                            <div className="flex flex-col items-start ">
                                <div className="flex gap-1 font-semibold">
                                    <div className="text-blue-500 dark:text-blue-300 ">
                                        {comment.user.name}
                                    </div>
                                    {(comment.user.role === "Admin" ||
                                        comment.user.role === "Staff") && (
                                        <span className="text-xs text-gray-400 border border-slate-400 px-1.5 py-0.5 pb-1 rounded-md">
                                            {comment.user.role}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {date(comment.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-start justify-start">
                    <div className="ml-8">
                        <div className="text-sm flex flex-col items-start mb-1">
                            {isEditing ? (
                                <CommentForm
                                    onSubmit={(content) =>
                                        updateComment(content, comment._id)
                                    }
                                    defaultValue={comment.content}
                                />
                            ) : (
                                <div>{comment.content}</div>
                            )}

                            {/* Comments actions */}
                            <div className="text-xs text-gray-400 flex items-start gap-2">
                                <div
                                    className="cursor-pointer hover:underline"
                                    onClick={() =>
                                        authStatus
                                            ? setActiveComment({
                                                  type: "replying",
                                                  id: comment._id,
                                              })
                                            : navigate("/login")
                                    }
                                >
                                    Reply
                                </div>
                                {isEditing ? (
                                    <div
                                        className="cursor-pointer hover:underline"
                                        onClick={() => setActiveComment(null)}
                                    >
                                        Cancel
                                    </div>
                                ) : (
                                    <>
                                        {comment.user._id === userId && (
                                            <>
                                                <div
                                                    className="cursor-pointer hover:underline"
                                                    onClick={() =>
                                                        setActiveComment({
                                                            type: "editing",
                                                            id: comment._id,
                                                        })
                                                    }
                                                >
                                                    Edit
                                                </div>
                                                {new Date() -
                                                    new Date(
                                                        comment.createdAt
                                                    ) <
                                                    600000 && (
                                                    <div
                                                        className="cursor-pointer hover:underline"
                                                        onClick={() =>
                                                            deleteComment(
                                                                comment._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Reply form */}
                        {isReplying && (
                            <CommentForm
                                onSubmit={(content) => {
                                    addComment(content, replyId);
                                }}
                            />
                        )}

                        {/* Reply comments */}
                        {replyComments.length > 0 && (
                            <div>
                                {replyComments.map((com) => (
                                    <div key={com._id} className="ml-2">
                                        <Comment
                                            comment={com}
                                            addComment={addComment}
                                            deleteComment={deleteComment}
                                            updateComment={updateComment}
                                            activeComment={activeComment}
                                            setActiveComment={setActiveComment}
                                            parentId={comment._id}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;

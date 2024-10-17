import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import apiService from "../../api/service";
import { useSelector } from "react-redux";

function Comments({ commentFor, id = null }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);

    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (id) {
            apiService.getComments(id).then((data) => {
                if (data) setComments(data);
            });
        }
    }, [id]);

    const rootComments = comments.filter(
        (comment) => comment.parentId === null
    );

    const getReplies = (commentId) => {
        return comments
            .filter((comment) => comment.parentId === commentId)
            .sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );
    };

    const addComment = (content, parentId) => {
        if (commentFor === "novel") {
            if (id) {
                apiService
                    .addNovelComment(id, content, parentId)
                    .then((data) => {
                        setComments([
                            {
                                ...data,
                                user: {
                                    _id: user._id,
                                    name: user.name,
                                    username: user.username,
                                    avatar: user.avatar,
                                    role: user.role,
                                },
                            },
                            ...comments,
                        ]);
                    });
            }
        }

        if (commentFor === "chapter") {
            if (id) {
                apiService.addChapterComment(id, content).then((data) => {
                    setComments([
                        {
                            ...data,
                            user: {
                                _id: user._id,
                                name: user.name,
                                username: user.username,
                                avatar: user.avatar,
                                role: user.role,
                            },
                        },
                        ...comments,
                    ]);
                });
            }
        }
        setActiveComment(null);
    };

    const deleteComment = (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            apiService.deleteComment(commentId).then((res) => {
                if (res) {
                    setComments(
                        comments.filter((comment) => comment._id !== res._id)
                    );
                }
            });
        }
    };

    const updateComment = (content, commentId) => {
        apiService.updateComment(commentId, content).then((res) => {
            if (res) {
                setComments(
                    comments.map((comment) => {
                        if (comment._id === res._id) {
                            return {
                                ...comment,
                                content: res.content,
                            };
                        }
                        return comment;
                    })
                );
            }
        });

        setActiveComment(null);
    };

    return (
        <div className="container mx-auto py-4">
            {authStatus ? (
                <div className="mb-4">
                    <CommentForm onSubmit={addComment} />
                </div>
            ) : (
                <div className="mb-4">
                    Please login to add comment.{" "}
                    <Button
                        className="cursor-pointer bg-blue-500"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Button>
                </div>
            )}
            <div className="container md:ml-10 px-5 md:px-10">
                <div className="space-y-1 ">
                    {rootComments.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            replyComments={getReplies(comment._id)}
                            addComment={addComment}
                            deleteComment={deleteComment}
                            updateComment={updateComment}
                            activeComment={activeComment}
                            setActiveComment={setActiveComment}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Comments;

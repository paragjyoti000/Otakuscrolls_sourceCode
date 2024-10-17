import React from "react";

function Message({ required = false }) {
    return (
        required && (
            <div className="flex justify-center items-center">
                <div className="bg-red-500 rounded px-4 py-2 font-semibold font-mono text-center">
                    Due to a technical issue, some of our content has been
                    deleted.
                    <br />
                    We apologize for the inconvenience and appreciate your
                    understanding.
                </div>
            </div>
        )
    );
}

export default Message;

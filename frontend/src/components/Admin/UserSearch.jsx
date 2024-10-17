import { IoMdCloseCircle } from "react-icons/io";
import adminService from "../../api/admin";
import { useEffect, useState } from "react";
import { Input } from "../../components";

function UserSearch({ setUser = () => {} }) {
    const [query, setQuery] = useState("");

    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!query) {
            setUsers([]);
        }
        if (query) {
            adminService.searchUser(query).then((res) => setUsers(res));
        }
    }, [query]);

    return (
        <div>
            <div className="max-w-52 flex items-center gap-3">
                <Input
                    type="text"
                    name="searchUser"
                    placeholder="Search Users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <span>
                    {query && (
                        <button
                            className="text-lg text-red-500 hover:text-red-600"
                            type="cancel"
                            onClick={() => {
                                setQuery("");
                                setUsers(null);
                                setUser(null);
                            }}
                        >
                            <IoMdCloseCircle />
                        </button>
                    )}
                </span>
            </div>
            {query && (
                <div className="mx-2 my-4">
                    <h1 className="mb-2 text-lg font-bold">
                        Search results for {query}
                    </h1>
                    {users.length > 0 ? (
                        <ul className="rounded-lg p-2 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 max-h-[500px] overflow-auto gap-2">
                            {users?.map((user) => (
                                <li
                                    key={user._id}
                                    onClick={() => {
                                        setUser(user);
                                        setQuery("");
                                    }}
                                    className="border-2 border-dashed cursor-pointer rounded-xl p-1 flex gap-2"
                                >
                                    <div className="w-1/3 min-w-10 max-w-16 aspect-square rounded-full border-2 overflow-hidden">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <b>{user.name}</b>

                                        <div className="text-sm text-gray-800 dark:text-gray-300">
                                            <p>@{user.username}</p>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No users found</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserSearch;

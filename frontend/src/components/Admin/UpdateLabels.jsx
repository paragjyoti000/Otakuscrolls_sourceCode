import React, { useState } from "react";
import Select from "react-select";
import conf from "../../envConf/conf";
import { FaSquareCheck } from "react-icons/fa6";
import adminService from "../../api/admin";
import Loading from "../Loading";

function UpdateLabels({ user, setUser = () => {}, setIsEditing = () => {} }) {
    const [labels, setLabels] = useState(
        user.labels.map((label) => ({ value: label, label: label }))
    );
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        const userLabels = labels.map((label) => label.value);
        await adminService
            .updateUserLabels(user._id, userLabels)
            .then((res) => {
                if (res) {
                    setUser({
                        ...user,
                        labels: userLabels,
                    });
                }
            })
            .finally(() => {
                setLoading(false);
                setIsEditing({
                    editing: false,
                    element: null,
                });
            });
    };

    return (
        <>
            <div className="flex gap-2">
                <Select
                    name="labels"
                    placeholder="Select Genres"
                    options={conf.userLabels}
                    defaultValue={labels}
                    onChange={setLabels}
                    isMulti
                    className="block w-[80%] border-none bg-white dark:bg-slate-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    classNames={{
                        control: () => "dark:bg-gray-800 ",
                        input: () => "dark:text-gray-100",
                        menu: () => "scrollbar-css dark:bg-gray-800",
                        menuList: () => "h-60",
                        option: () =>
                            "dark:bg-gray-800 hover:dark:bg-gray-500 ",
                        multiValue: () => "dark:bg-gray-500",
                        multiValueLabel: () => "dark:text-gray-100",
                    }}
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`text-green-500 hover:text-green-600 text-4xl`}
                >
                    {loading ? <Loading /> : <FaSquareCheck />}
                </button>
            </div>
        </>
    );
}

export default UpdateLabels;

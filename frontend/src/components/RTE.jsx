import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import conf from "../envConf/conf";
import { useState } from "react";

function RTE({
    name,
    control,
    label,
    defaultValue = "",
    required,
    height = 400,
}) {
    const [setshowTextEditor, setSetshowTextEditor] = useState(false);

    return (
        <>
            <div className="w-full flex flex-col mb-4">
                {label && (
                    <label className="block mb-1 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}&nbsp;
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div
                    className={`p-2 rounded ${
                        setshowTextEditor
                            ? "cursor-not-allowed bg-red-500 opacity-50"
                            : "cursor-pointer bg-blue-500"
                    }`}
                    onClick={() => setSetshowTextEditor(true)}
                >
                    Click to edit on text editor
                </div>
                {setshowTextEditor && (
                    <Controller
                        name={name || "content"}
                        control={control}
                        render={({ field: { onChange } }) => (
                            <Editor
                                apiKey={conf.tinyMCEApiKey}
                                initialValue={defaultValue}
                                onEditorChange={onChange}
                                init={{
                                    height: height,
                                    imagetools_cors_hosts: ["picsum.photos"],
                                    menubar:
                                        "file edit view insert format tools table help",
                                    plugins:
                                        "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons",
                                    toolbar:
                                        "undo redo searchreplace | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview save print | insertfile image media link anchor codesample | ltr rtl",
                                    tinycomments_mode: "embedded",
                                    toolbar_sticky: true,
                                    autosave_ask_before_unload: true,
                                    autosave_interval: "30s",
                                    autosave_prefix: "{path}{query}-{id}-",
                                    autosave_restore_when_empty: false,
                                    autosave_retention: "2m",
                                    image_advtab: true,
                                    content_style:
                                        "body { font-family:Helvetica, Arial, sans-serif; font-size:14px }",
                                    toolbar_mode: "sliding",
                                    contextmenu: "link image imagetools table",
                                }}
                            />
                        )}
                    />
                )}
            </div>
        </>
    );
}

export default RTE;

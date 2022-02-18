import { redirect, Form, useActionData, useTransition } from "remix";
import { createPost } from "~/post";
import invariant from "tiny-invariant";
import type { ActionFunction } from "remix";


import newPostStyles from "~/styles/NewPost.css";

type NewPost = {
    title: string;
    slug: string;
    markdown: string;
};

type PostError = {
    title?: boolean;
    slug?: boolean;
    markdown?: boolean;
};

export const links = () => {
    return [{rel: "stylesheet", href: newPostStyles}];
};

export const action: ActionFunction = async ({ request })=> {

    //fake delay
    await new Promise(res => setTimeout(res, 1000));

    const formData = await request.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const markdown = formData.get("markdown");

    const errors: PostError = {};
    if (!title) errors.title = true;
    if (!slug) errors.slug = true;
    if (!markdown) errors.markdown = true;

    if(Object.keys(errors).length) {
        return errors;
    }

    invariant(typeof title === "string");
    invariant(typeof slug === "string");
    invariant(typeof markdown === "string");

    await createPost({ title, slug, markdown });
    return redirect("/admin");
}

export default function NewPost() {
    const errors = useActionData();
    const transition = useTransition();

    return (
        <Form method="post">
            <h2>New Post</h2>
            <label>
                {errors?.title ? (<em>Title is required</em>) : null}
                Post Title: <input type="text" name="title" />
            </label>
            <label>
                Post Slug:{" "}
                {errors?.slug ? <em>Slug is required</em> : null}
                <input type="text" name="slug" />
            </label>
            <label htmlFor="markdown">Markdown:</label> {" "}
                {errors?.markdown ? (<em>Markdown is required</em>) : null}
            <br />
            <textarea id="markdown" rows={20} name="markdown" />
            <button type="submit">
                {transition.submission ? "Creating..." : "Create Post"}
            </button>
        </Form>
    );
}

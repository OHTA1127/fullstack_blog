//投稿編集ページ
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type UpdateBlogParams = {
  title: string;
  description: string;
  id: number;
};

//投稿を編集して送信する関数
const updateBlog = async (data: UpdateBlogParams) => {
  const res = await fetch(`http://localhost:3000/api/blog${data.id}`, {
    //更新
    method: "PUT",
    //JSONとして送信する
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: data.title, description: data.description }),
  });
  return (await res).json();
};

//投稿されているブログの詳細情報を取得し、編集の際に表示する関数
const getBlogById = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog${id}`);
  const data = await res.json();
  return data.post;
};

//ブログ削除用関数
const deleteBlog = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

//next.jsでは引数にこのように記述することでidを取得できる
const EditBlog = ({ params }: { params: { id: number } }) => {
  const router = useRouter();

  //useStateでもOK
  //useRefはプロパティの属性を取得できる
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const handleDelete = async () => {
    await deleteBlog(params.id);

    router.push("/");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    //リロードを防ぐことができる
    e.preventDefault();

    //titleRef.current?.valueのようにすることで現在入力されている値を取得できる
    await updateBlog({
      title: titleRef.current!.value,
      description: descriptionRef.current!.value,
      id: params.id,
    });

    //投稿後に"/"に遷移させる
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    getBlogById(params.id)
      .then((data) => {
        if (titleRef.current && descriptionRef.current) {
          titleRef.current.value = data.title;
          descriptionRef.current.value = data.description;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.id]);

  return (
    <>
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 font-bold p-3">
            ブログの編集 🚀
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              placeholder="タイトルを入力"
              type="text"
              className="rounded-md px-4 w-full py-2 my-2"
            />
            <textarea
              ref={descriptionRef}
              placeholder="記事詳細を入力"
              className="rounded-md px-4 py-2 w-full my-2"
            ></textarea>
            <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              更新
            </button>
            <button
              onClick={handleDelete}
              className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100"
            >
              削除
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditBlog;

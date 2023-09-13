//use~~を使用する際はクライアントサイドにしないといけない「
"use client";

//"next/router"から"next/navigation"に変更する
import { useRouter } from "next/navigation";
import { useRef } from "react";

//ブログ投稿用の関数
const postBlog = async (
  title: string | undefined,
  description: string | undefined
) => {
  const res = await fetch(`http://localhost:3000/api/blog`, {
    //投稿
    method: "POST",
    //JSONとして送信する
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });
  return res.json();
};

//ブログの新規投稿
const PostBlog = () => {
  const router = useRouter();

  //useStateでもOK
  //useRefはプロパティの属性を取得できる
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    //リロードを防ぐことができる
    e.preventDefault();

    //titleRef.current?.valueのようにすることで現在入力されている値を取得できる
    await postBlog(titleRef.current?.value, descriptionRef.current?.value);

    //投稿後に"/"に遷移させる
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 font-bold p-3">
            ブログ新規作成 🚀
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
              投稿
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostBlog;

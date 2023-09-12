import { NextResponse } from "next/server";
import { main } from "../route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//ブログの詳細情報を取得するAPI
export const GET = async (req: Request, res: NextResponse) => {
  try {
    //URLからidを取得する(URLをブログで区切り、ブログより前を０番、後ろを１番とする)
    //parseIntで整数変換する
    const id: number = parseInt(req.url.split("/blog/")[1]);

    await main();

    //ポストモデルから特定の情報を取得する(whereで絞り込む)
    const post = await prisma.post.findFirst({ where: { id } }); //http://localhost:3000/api/blog/1 このidを取得する必要がある

    //json形式でサクセスメッセージとpostを返す（具体的なjsonの内容はthunder clientで関数を実行した時に右側で確認できる）
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    //データ取得に失敗した場合に、json形式でエラーメッセージとerrを返す
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    //データベースの接続を止める
    await prisma.$disconnect();
  }
};

//ブログ編集用API
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    //URLからidを取得する(URLをブログで区切り、ブログより前を０番、後ろを１番とする)
    //parseIntで整数変換する
    const id: number = parseInt(req.url.split("/blog/")[1]);

    const { title, description } = await req.json();

    await main();

    //ブログの内容を更新する
    const post = await prisma.post.update({
      data: { title, description }, //どの部分を更新するか記述する
      where: { id }, //http://localhost:3000/api/blog/1 このidを取得する必要がある
    });

    //json形式でサクセスメッセージとpostを返す（具体的なjsonの内容はthunder clientで関数を実行した時に右側で確認できる）
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    //データ取得に失敗した場合に、json形式でエラーメッセージとerrを返す
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    //データベースの接続を止める
    await prisma.$disconnect();
  }
};

//ブログ削除用API
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    //URLからidを取得する(URLをブログで区切り、ブログより前を０番、後ろを１番とする)
    //parseIntで整数変換する
    const id: number = parseInt(req.url.split("/blog/")[1]);

    await main();

    //ブログの内容を更新する
    const post = await prisma.post.delete({ where: { id } });

    //json形式でサクセスメッセージとpostを返す（具体的なjsonの内容はthunder clientで関数を実行した時に右側で確認できる）
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    //データ取得に失敗した場合に、json形式でエラーメッセージとerrを返す
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    //データベースの接続を止める
    await prisma.$disconnect();
  }
};

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//データベースに接続する
export async function main() {
  try {
    //データベースに接続する
    await prisma.$connect();
  } catch {
    return Error("DB接続に失敗しました");
  }
}

//ブログの全記事取得API
export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();

    //ポストモデルから全記事取得する
    const posts = await prisma.post.findMany();

    //json形式でサクセスメッセージとpostsを返す（具体的なjsonの内容はthunder clientで関数を実行した時に右側で確認できる）
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    //データ取得に失敗した場合に、json形式でエラーメッセージとerrを返す
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    //データベースの接続を止める
    await prisma.$disconnect();
  }
};

//ブログ投稿用のAPI
export const POST = async (req: Request, res: NextResponse) => {
  try {
    //投稿するために必要なtitleやdescriptionを取得する
    const { title, description } = await req.json();

    await main();

    //記事を投稿する
    const post = await prisma.post.create({ data: { title, description } });

    //json形式でサクセスメッセージとpostsを返す（具体的なjsonの内容はthunder clientで関数を実行した時に右側で確認できる）
    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (err) {
    //データ取得に失敗した場合に、json形式でエラーメッセージとerrを返す
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    //データベースの接続を止める
    await prisma.$disconnect();
  }
};

import Link from "next/link";

export const metadata = {
  title: "使用条款",
};

export default function AgreementPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <article className="mx-auto w-full max-w-3xl rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black">使用条款</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700">
          你应确保上传与填写内容不侵犯他人合法权益，不包含违法违规内容。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          你发布的分享页将通过公开链接访问，默认可被任何人查看、转发和引用。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          为保证服务稳定，平台可能对异常请求进行限流、拦截或删除处理。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          使用本服务即视为同意本条款；如不同意，请停止使用。
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-sky-700 hover:underline">
          返回首页
        </Link>
      </article>
    </main>
  );
}

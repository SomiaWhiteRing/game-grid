import Link from "next/link";

export const metadata = {
  title: "隐私政策",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <article className="mx-auto w-full max-w-3xl rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black">隐私政策</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700">
          本站仅提供“构成我的9款游戏”生成与分享功能。你提交的分享数据（昵称、9款游戏内容、评论）会被长期保存，用于分享展示与趋势统计。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          我们不会主动收集与展示你的真实身份信息，不会在页面公开你的 IP、邮箱或手机号。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          第三方服务（如 Vercel 平台统计、分享平台跳转）可能记录其必要日志，详情请参考对应平台隐私政策。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          继续使用本服务即表示你理解并同意上述处理方式。
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-sky-700 hover:underline">
          返回首页
        </Link>
      </article>
    </main>
  );
}

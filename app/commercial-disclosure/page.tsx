import Link from "next/link";

export const metadata = {
  title: "商业声明",
};

export default function CommercialDisclosurePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <article className="mx-auto w-full max-w-3xl rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black">商业声明</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700">
          当前版本以社区分享为主，不提供付费会员或付费解锁功能。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          若未来出现赞助、广告或合作内容，会在页面中明确标注“商业合作/推广”字样。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          本站展示的游戏名称、封面与商标归其各自权利人所有，仅用于用户生成内容展示与讨论。
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-sky-700 hover:underline">
          返回首页
        </Link>
      </article>
    </main>
  );
}

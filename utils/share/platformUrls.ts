function encode(value: string) {
  return encodeURIComponent(value);
}

export function buildXShareUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encode(text)}`;
}

export function buildWeiboShareUrl(params: {
  url: string;
  title: string;
  pic?: string | null;
}): string {
  const query = new URLSearchParams({
    url: params.url,
    title: params.title,
  });
  if (params.pic) {
    query.set("pic", params.pic);
  }
  return `https://service.weibo.com/share/share.php?${query.toString()}`;
}

export function buildQQFriendShareUrl(params: {
  url: string;
  title: string;
  summary: string;
  pics?: string | null;
}): string {
  const query = new URLSearchParams({
    url: params.url,
    title: params.title,
    summary: params.summary,
  });
  if (params.pics) {
    query.set("pics", params.pics);
  }
  return `https://connect.qq.com/widget/shareqq/index.html?${query.toString()}`;
}

export function buildQZoneShareUrl(params: {
  url: string;
  title: string;
  summary: string;
  pics?: string | null;
}): string {
  const query = new URLSearchParams({
    url: params.url,
    title: params.title,
    summary: params.summary,
  });
  if (params.pics) {
    query.set("pics", params.pics);
  }
  return `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?${query.toString()}`;
}


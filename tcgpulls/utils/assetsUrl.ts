export function assetsUrl(assetStorageUrl: string) {
  const formattedUrl = assetStorageUrl.startsWith("/")
    ? assetStorageUrl
    : `/${assetStorageUrl}`;
  return `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL}${formattedUrl}`;
}

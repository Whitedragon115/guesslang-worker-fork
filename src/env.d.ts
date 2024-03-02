declare module "*.bin" {
  const src: ArrayBuffer;
  export default src;
}

declare module "__STATIC_CONTENT_MANIFEST" {
  const manifest: Record<string, unknown>;
  export default manifest;
}

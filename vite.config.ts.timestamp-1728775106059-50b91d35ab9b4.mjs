// vite.config.ts
import { vitePlugin as remix } from "file:///C:/Users/User/Desktop/hw-website/node_modules/.pnpm/@remix-run+dev@2.12.1_@remix-run+react@2.12.1_react-dom@18.3.1_react@18.3.1__react@18.3.1_typ_47yxzc2wc7fekbzrweppfze2n4/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///C:/Users/User/Desktop/hw-website/node_modules/.pnpm/vite@5.1.0_@types+node@22.7.5/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///C:/Users/User/Desktop/hw-website/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.6.3_vite@5.1.0_@types+node@22.7.5_/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      },
      ssr: false,
      serverModuleFormat: "esm"
    }),
    tsconfigPaths()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERlc2t0b3BcXFxcaHctd2Vic2l0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXNlclxcXFxEZXNrdG9wXFxcXGh3LXdlYnNpdGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1VzZXIvRGVza3RvcC9ody13ZWJzaXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gJ0ByZW1peC1ydW4vZGV2JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtcblx0XHRyZW1peCh7XG5cdFx0XHRmdXR1cmU6IHtcblx0XHRcdFx0djNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXG5cdFx0XHRcdHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxuXHRcdFx0XHR2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdHNzcjogZmFsc2UsXG5cdFx0XHRzZXJ2ZXJNb2R1bGVGb3JtYXQ6ICdlc20nLFxuXHRcdH0pLFxuXHRcdHRzY29uZmlnUGF0aHMoKSxcblx0XSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0UixTQUFTLGNBQWMsYUFBYTtBQUNoVSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixNQUFNO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDUCxtQkFBbUI7QUFBQSxRQUNuQixzQkFBc0I7QUFBQSxRQUN0QixxQkFBcUI7QUFBQSxNQUN0QjtBQUFBLE1BQ0EsS0FBSztBQUFBLE1BQ0wsb0JBQW9CO0FBQUEsSUFDckIsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLEVBQ2Y7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

# Shopify Theme Test Environment Setup

## 1. Duplicate Your Live Theme
- In your Shopify admin, go to **Online Store > Themes**.
- Find your current live theme and click **Actions > Duplicate**.
- Rename the duplicate to something like `Test - Cleaned Theme`.

## 2. Upload/Apply Your Changes
- Make all code changes (JS, CSS, Liquid) to the duplicated theme, **not** the live one.
- Use Shopify's code editor or upload files via the Shopify CLI.

## 3. Preview the Test Theme
- In the theme list, click **Actions > Preview** on your test theme.
- Open the preview link in a new browser window.
- Test all navigation, dropdowns, cart, search, and interactive features.
- Check for console errors and network issues in browser dev tools.

## 4. Validate Performance
- Use [Google PageSpeed Insights](https://pagespeed.web.dev/) and [Lighthouse](https://developers.google.com/web/tools/lighthouse/) on the preview URL.
- Compare performance and functionality to your live site.

## 5. Rollback or Publish
- If issues are found, fix them in the test theme and re-preview.
- Once satisfied, click **Actions > Publish** to make the test theme live.
- If needed, you can always revert to the previous theme version from the theme history.

## 6. Automated Testing (Optional)
- Use the `/test/unit/ecommerce-unit-tests.js` for JS logic validation.
- Add more tests as needed for custom scripts.

---

**Never edit your live theme directly. Always use a test environment for major changes!** 
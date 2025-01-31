Everything Next.js - related.

(auth)/signup - no actual logic, only interactions with browser UI APIs and handling errors texts came from actions.
(auth)/actions.tsx - here we have logic which makes sense only for the UI/browser, which is checking input form data, setting session cookies returned from controller, redirecting to another UI route and catching errors from controller to return user-friendly error text to the UI.
Also here, based on errors returned from controller we can redirect to another page.
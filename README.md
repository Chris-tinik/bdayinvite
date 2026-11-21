# Harbour birthday page

A one-page site for the boat party: a short TL;DR of the event (with a link to the Facebook event), then the wishlist. It works on phones and needs no login.

Guests tap "I'll get this" on a gift so nobody doubles up. It's anonymous, with no names asked or shown. Only the phone that claimed a gift can unclaim it. The "open ideas" (cooking, house, jewellery) can't be claimed, since several people can go with them.

## 1. Make changes

Everything you can change is in `config.js`: the TL;DR lines, the wishlist, and `mapsQuery` (add the wharf address to show a Directions button). Double-click `index.html` to preview. Until step 2 is done, it runs in **demo mode** and only saves in your own browser.

## 2. Turn on shared claims with Firebase (free, about 5 min)

1. Go to https://console.firebase.google.com, click **Create a project**, and give it a name. Google Analytics isn't needed.
2. Go to **Build > Authentication > Get started**. Open the **Sign-in method** tab and enable **Anonymous**. Guests never see a login.
3. Go to **Build > Firestore Database > Create database**. Choose the `australia-southeast1 (Sydney)` location and start in **production mode**.
4. Open the **Rules** tab, replace everything there with the contents of `firestore.rules`, and click **Publish**.
5. Click the gear icon, then **Project settings**. Under **Your apps**, click the web icon `</>`, register the app, and copy the `firebaseConfig = { ... }` object.
6. In `config.js`, replace `window.FIREBASE_CONFIG = null;` with `window.FIREBASE_CONFIG = { ...what you copied... };`

The Firebase config isn't a secret. It's designed to sit in public pages, and the rules from step 4 control what people can do.

## 3. Put it online (2 min)

1. Go to https://app.netlify.com/drop and sign up for free.
2. Drag the whole `birthday-invite` folder onto the page to get a link. Optionally rename the site under **Site configuration > Change site name**.
3. Post the link in the Facebook event.

To update the site later, open it in Netlify, go to **Deploys**, and drag the folder in again.

## Good to know

- Claims are tied to the phone or browser people used, and they can only unclaim from that same device.
- To reset a claim yourself, delete it in the Firebase console under **Firestore Database > claims**. Looking there won't spoil anything, because claims don't include names.
- If you rename an item, keep its `id` the same, or its claim gets lost.

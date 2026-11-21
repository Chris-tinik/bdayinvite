# Tini's golden birthday

The invite site for the boat party: **https://chris-tinik.github.io/bdayinvite/**

It has three tabs:
- **Details:** when, where (with directions), what's on board, and what to bring.
- **Wishlist:** sizes, gifts with filters by type and price, and anonymous "I'll get this" claims.
- **Dress code:** the vibe, tips, and the Pinterest inspo board.

It works on phones and needs no login.

Guests tap "I'll get this" so nobody doubles up. Claims sync live across every device through Firebase. They're anonymous, so no names are asked or stored, and only the phone that claimed a gift can unclaim it. The "open ideas" (cooking, house, jewellery) can't be claimed, since several people can go with them.

## Making changes

Almost everything you'd want to change is in `config.js`:
- the party details and dress code
- your sizes
- the wishlist items, their prices and the filter labels

To preview, double-click `index.html`.

## Publishing

The site is hosted on **GitHub Pages** from the `main` branch of https://github.com/Chris-tinik/bdayinvite. Every push to `main` updates the live site within 1 to 2 minutes. You can watch the progress in the repo's **Actions** tab. If you still see the old version, do a hard refresh (Ctrl+F5).

After changing `style.css`, `app.js` or `config.js`, bump the `?v=` number on their links in `index.html`. That makes phones load the new files instead of a saved copy (GitHub Pages lets browsers keep files for 10 minutes).

Pages is set up under **Settings > Pages > Deploy from a branch > `main` / (root)**.

## The database (Firebase)

Claims are stored in the Firebase project **tini-bday**, at https://console.firebase.google.com/project/tini-bday.
- **Anonymous** sign-in is turned on under **Authentication > Sign-in method**.
- The database is Cloud Firestore in `australia-southeast1` (Sydney). Its security rules are in `firestore.rules`. If you ever change that file, paste it into **Firestore Database > Rules** and click **Publish**.
- The connection settings are at the bottom of `config.js` (`window.FIREBASE_CONFIG`). They aren't secret: they're designed to sit in public pages, and the rules control what people can do.

## Reading dietary requirements

Guests fill in the **Dietary requirements** form on the Details tab. Each person can only see their own answer, and nobody else on the site can read them.

To read them all, go to https://console.firebase.google.com/project/tini-bday/firestore and open **Data > dietary**. Each entry shows the guest's name, what they ticked (`needs`) and their notes.

## Good to know

- To reset a gift someone claimed by mistake, delete it under **Firestore Database > Data > claims**. Looking there won't spoil anything, because claims don't include names.
- Claims are tied to the phone or browser people used, so they can only unclaim from that same device.
- If you rename a wishlist item, keep its `id` the same, or its claim gets lost. Changing the title or note is fine.

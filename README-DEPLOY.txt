AL NOOR ENTERPRISES — Firebase Hosting deploy

1. Open this folder in Antigravity.
2. Install the Firebase CLI once:  npm install -g firebase-tools
3. Log in:  firebase login
4. From THIS folder:  firebase deploy
   (Pick your Firebase project when asked, or run: firebase use --add)
5. Your site goes live at https://<project-id>.web.app

Notes:
- public/index.html is the whole store (all 130 products + prices embedded).
- public/assets/products/ holds all 130 product photos.
- The cart works in the visitor's browser; checkout sends orders to WhatsApp 0313-8404464 (Cash on Delivery).
- Prices are placeholders — edit them in public/index.html (search for "price":) or ask Muse to apply the filled-in price sheet.
- If you already ran "firebase init", keep your own firebase.json instead of this one.

# Diet Crate Website

A static website made of plain HTML, CSS and JavaScript. It needs no server, database or build step. Customers add crates to a cart and send the order to your WhatsApp number.

## What is in this folder

| File | What it does |
|---|---|
| `index.html` | All page content: crates, prices, plans, sample menu, IT parks, footer. Edit text and prices here |
| `js/config.js` | Your WhatsApp number, footer phone and email, Google Analytics ID |
| `js/main.js` | Cart, WhatsApp links, enquiry form, mobile menu. Normally no edits needed |
| `css/style.css` | Colours, fonts and layout. Colours are at the top under `:root` |
| `img/` | The five food photos |
| `vercel.json` | Vercel configuration for clean URLs and static routing |
| `favicon.svg`, `robots.txt` | Browser tab icon, search engine permission |

## How everything connects

```
Visitor -> Website (hosted on Vercel)
             |-- Add to cart / Order buttons / enquiry form -> opens WhatsApp with your number and a ready message
             |-- Google Analytics (optional) -> counts visits, cart adds and WhatsApp clicks
```

Nothing is stored on a server. The cart is kept in the visitor's own browser. You receive orders as normal WhatsApp messages and confirm delivery and payment in that chat.

---

## Before you go live: replace these placeholders

1. **WhatsApp number** in `js/config.js`. Until you add it, WhatsApp buttons open WhatsApp without your number, so orders will not reach you.
2. **Footer phone and email.** The footer shows `+91 99999 99999` and `hello@dietcrate.in`, which are placeholders. Set `phoneDisplay` and `email` in `js/config.js`.
3. **Prices.** Per-crate prices (249, 289, 329, 269) and the plan prices (1,199 and 4,799) are sample values. In `index.html`, change the number you see on the page and the matching `data-price="..."` on each "Add to cart" button. Both must match, because the cart uses `data-price`.
4. **Claims you must confirm are true:** "0 preservatives", "Dietician-approved", "Free delivery to IT parks", "Save 400 / month", "Bonus dessert on Fridays", "Dietician consult", and the six IT Park names listed in the For IT Parks section. Delete or change anything you do not offer.
5. **Photos.** The photos in `img/` were cut from your design screenshots, so they are small and some are cropped. Replace them with your own food photos (at least 1200 px wide for `hero.jpg`, 800 px wide for the others), keeping the same file names. Compress to under 200 KB each.
6. **Calories and sample menu.** Check the calorie ranges and weekly menu against what you actually cook.

## Step 1. Edit your details

Open `js/config.js` in Notepad or VS Code:

```js
whatsapp: "919812345678",      // digits only, country code first, no + or spaces
phoneDisplay: "+91 98123 45678",
email: "hello@yourdomain.in",
gaId: ""                       // fill in after Step 4
```

Save the file.

## Step 2. Preview on your computer (Windows PowerShell)

Double-click `index.html` to open it, or serve it like a real website:

```powershell
cd C:\path\to\diet-crate-website
python -m http.server 8080
```

Open http://localhost:8080 and press Ctrl+C in PowerShell to stop. If `python` is not found, use `py -m http.server 8080`.

Check this list: all menu links scroll to the right section, **Add to cart** updates the cart count, the cart totals are right, **Send order on WhatsApp** opens WhatsApp with your number, and the enquiry form prepares a message. Also look at it on your phone.

## Step 3. Put it online with Vercel (free)

You have two easy ways to deploy to Vercel:

### Option A: GitHub (Recommended - Automatic deployments)

1. Create a free account at [vercel.com](https://vercel.com) if you haven't already.
2. Push your project to GitHub:
   ```powershell
   cd C:\path\to\diet-crate-website
   git init
   git add .
   git commit -m "Diet Crate website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/diet-crate.git
   git push -u origin main
   ```
3. In your Vercel Dashboard, click **Add New...** > **Project**.
4. Import your `diet-crate` repository.
5. In the configuration:
   - **Framework Preset**: Select **Other** (it's a plain static site).
   - **Root Directory**: Leave as `./` (or select the project subfolder if nested).
   - **Build Command** & **Output Directory**: Leave empty / default.
6. Click **Deploy**. Vercel will build and assign you a live URL (e.g., `diet-crate.vercel.app`).
   *Every future commit pushed to GitHub will automatically trigger a new deployment!*

---

### Option B: Deploy directly using Vercel CLI

1. Install Vercel CLI (requires Node.js / npm):
   ```powershell
   npm install -g vercel
   ```
2. In PowerShell, navigate to your project directory and run:
   ```powershell
   cd C:\path\to\diet-crate-website
   vercel
   ```
3. Follow the CLI prompts to log in and deploy.
4. For production deployment:
   ```powershell
   vercel --prod
   ```

## Step 4. Connect Google Analytics (optional)

1. Create a GA4 property at https://analytics.google.com and add a **Web** data stream for your site.
2. Copy the Measurement ID (looks like `G-XXXXXXXXXX`) into `gaId` in `js/config.js`.
3. Push to GitHub (or re-run `vercel --prod`), open your live site, and check **Reports > Realtime**.

The site already sends these events, which match your success metrics:

| Event | When it fires |
|---|---|
| `whatsapp_click` | Any WhatsApp button is clicked |
| `add_to_cart` | A crate is added to the cart |
| `whatsapp_order` | Someone sends a cart order to WhatsApp |
| `enquiry_prepared` | Someone fills in the contact form |

In GA4 open **Admin > Events** and mark `whatsapp_order` and `enquiry_prepared` as key events. If your audience needs a cookie notice, add one before turning analytics on.

## Step 5. Connect your own domain

1. Buy a domain from any domain registrar (e.g. GoDaddy, Namecheap, Google Domains/Squarespace).
2. In your Vercel project dashboard, go to **Settings** > **Domains**.
3. Enter your domain (e.g. `dietcrate.in` or `www.dietcrate.in`) and click **Add**.
4. Vercel will provide DNS records (an `A` record or `CNAME` record) to add at your domain provider.
5. Once DNS propagates, Vercel automatically generates and Renews free SSL/TLS certificates.
6. In `index.html`, find the comment near the top that starts "After you have a domain" and add the two tags it describes (canonical link and share image).

## Step 6. Basic search visibility

- Edit the `<title>` and `description` near the top of `index.html` if your wording changes.
- Add the site to Google Search Console (https://search.google.com/search-console) and request indexing of the home page.
- Create a Google Business Profile for your Bangalore service area.

## Changing content

- **Crate details, prices, plans, menu table:** edit `index.html`. Each crate is one `<article class="crate">` block, so copy one to add a crate. Give its button a new `data-add` id, `data-name` and `data-price`.
- **Colours:** edit the variables at the top of `css/style.css`. Each crate's accent colour is the `--c` value on its card.
- **Fonts:** Outfit and Work Sans load from Google Fonts. If a visitor blocks them, the site falls back to system fonts and still works.

## How the cart and forms work

- The cart saves in the visitor's browser, so it survives a page refresh but is not shared between devices.
- **Send order on WhatsApp** needs a name and an office or IT Park. It opens WhatsApp with the crates, quantities and estimated total already typed. The visitor must press send inside WhatsApp.
- The totals are estimates from the prices on the page. Because there is no server, anyone could change prices in their own browser, so always confirm the final amount and delivery charge in the WhatsApp chat before accepting payment.
- The contact form does not store or email anything. It prepares a WhatsApp message and shows an **Open WhatsApp** button.
- There is no online payment and no order database. If you later want UPI payment, order records in Google Sheets, or a staff dashboard, that needs a backend and can be built as a second phase.

## Limits to know about

- Vercel's Hobby (free) plan has generous limits for static websites, fast global edge caching, and automated HTTPS.
- Search engines read the page text directly, but ranking depends on your content, domain age and links.
- Calorie ranges are approximate. The site tells customers to mention allergies when ordering.

## Troubleshooting

| Problem | Fix |
|---|---|
| WhatsApp opens but no contact is selected | `whatsapp` in `js/config.js` is empty, or contains `+`, spaces or dashes |
| Page looks unstyled online | Check that `css/`, `js/`, and `img/` folders are included in the repository / root directory |
| Changes do not show | Hard refresh with Ctrl+F5, or wait a minute for Vercel's edge cache to refresh |
| Cart total does not match the price shown | The `data-price` on the button and the visible price in `index.html` are different |
| Analytics shows nothing | Check the ID format, redeploy, and switch off ad blockers while testing |
| Custom domain stays pending | Check the DNS A/CNAME records in your domain registrar's control panel |


# Diet Crate Website

A static website made of plain HTML, CSS and JavaScript. It needs no server, database or build step. Customers add crates to a cart and send the order to your WhatsApp number.

## What is in this folder

| File | What it does |
|---|---|
| `index.html` | All page content: crates, prices, plans, sample menu, IT parks, footer. Edit text and prices here |
| `js/config.js` | Your WhatsApp number, footer phone and email, Google Analytics ID |
| `js/main.js` | Cart, WhatsApp links, enquiry form, mobile menu. Normally no edits needed |
| `css/style.css` | Colours, fonts and layout. Colours are at the top under `:root` |
| `img/` | The five food photos |
| `vercel.json` | Vercel configuration for clean URLs and static routing |
| `favicon.svg`, `robots.txt` | Browser tab icon, search engine permission |

## How everything connects

```
Visitor -> Website (hosted on Vercel)
             |-- Add to cart / Order buttons / enquiry form -> opens WhatsApp with your number and a ready message
             |-- Google Analytics (optional) -> counts visits, cart adds and WhatsApp clicks
```

Nothing is stored on a server. The cart is kept in the visitor's own browser. You receive orders as normal WhatsApp messages and confirm delivery and payment in that chat.

---

## Before you go live: replace these placeholders

1. **WhatsApp number** in `js/config.js`. Until you add it, WhatsApp buttons open WhatsApp without your number, so orders will not reach you.
2. **Footer phone and email.** The footer shows `+91 99999 99999` and `hello@dietcrate.in`, which are placeholders. Set `phoneDisplay` and `email` in `js/config.js`.
3. **Prices.** Per-crate prices (249, 289, 329, 269) and the plan prices (1,199 and 4,799) are sample values. In `index.html`, change the number you see on the page and the matching `data-price="..."` on each "Add to cart" button. Both must match, because the cart uses `data-price`.
4. **Claims you must confirm are true:** "0 preservatives", "Dietician-approved", "Free delivery to IT parks", "Save 400 / month", "Bonus dessert on Fridays", "Dietician consult", and the six IT Park names listed in the For IT Parks section. Delete or change anything you do not offer.
5. **Photos.** The photos in `img/` were cut from your design screenshots, so they are small and some are cropped. Replace them with your own food photos (at least 1200 px wide for `hero.jpg`, 800 px wide for the others), keeping the same file names. Compress to under 200 KB each.
6. **Calories and sample menu.** Check the calorie ranges and weekly menu against what you actually cook.

## Step 1. Edit your details

Open `js/config.js` in Notepad or VS Code:

```js
whatsapp: "919812345678",      // digits only, country code first, no + or spaces
phoneDisplay: "+91 98123 45678",
email: "hello@yourdomain.in",
gaId: ""                       // fill in after Step 4
```

Save the file.

## Step 2. Preview on your computer (Windows PowerShell)

Double-click `index.html` to open it, or serve it like a real website:

```powershell
cd C:\path\to\diet-crate-website
python -m http.server 8080
```

Open http://localhost:8080 and press Ctrl+C in PowerShell to stop. If `python` is not found, use `py -m http.server 8080`.

Check this list: all menu links scroll to the right section, **Add to cart** updates the cart count, the cart totals are right, **Send order on WhatsApp** opens WhatsApp with your number, and the enquiry form prepares a message. Also look at it on your phone.

## Step 3. Put it online with Vercel (free)

You have two easy ways to deploy to Vercel:

### Option A: GitHub (Recommended - Automatic deployments)

1. Create a free account at [vercel.com](https://vercel.com) if you haven't already.
2. Push your project to GitHub:
   ```powershell
   cd C:\path\to\diet-crate-website
   git init
   git add .
   git commit -m "Diet Crate website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/diet-crate.git
   git push -u origin main
   ```
3. In your Vercel Dashboard, click **Add New...** > **Project**.
4. Import your `diet-crate` repository.
5. In the configuration:
   - **Framework Preset**: Select **Other** (it's a plain static site).
   - **Root Directory**: Leave as `./` (or select the project subfolder if nested).
   - **Build Command** & **Output Directory**: Leave empty / default.
6. Click **Deploy**. Vercel will build and assign you a live URL (e.g., `diet-crate.vercel.app`).
   *Every future commit pushed to GitHub will automatically trigger a new deployment!*

---

### Option B: Deploy directly using Vercel CLI

1. Install Vercel CLI (requires Node.js / npm):
   ```powershell
   npm install -g vercel
   ```
2. In PowerShell, navigate to your project directory and run:
   ```powershell
   cd C:\path\to\diet-crate-website
   vercel
   ```
3. Follow the CLI prompts to log in and deploy.
4. For production deployment:
   ```powershell
   vercel --prod
   ```

## Step 4. Connect Google Analytics (optional)

1. Create a GA4 property at https://analytics.google.com and add a **Web** data stream for your site.
2. Copy the Measurement ID (looks like `G-XXXXXXXXXX`) into `gaId` in `js/config.js`.
3. Push to GitHub (or re-run `vercel --prod`), open your live site, and check **Reports > Realtime**.

The site already sends these events, which match your success metrics:

| Event | When it fires |
|---|---|
| `whatsapp_click` | Any WhatsApp button is clicked |
| `add_to_cart` | A crate is added to the cart |
| `whatsapp_order` | Someone sends a cart order to WhatsApp |
| `enquiry_prepared` | Someone fills in the contact form |

In GA4 open **Admin > Events** and mark `whatsapp_order` and `enquiry_prepared` as key events. If your audience needs a cookie notice, add one before turning analytics on.

## Step 5. Connect your own domain

1. Buy a domain from any domain registrar (e.g. GoDaddy, Namecheap, Google Domains/Squarespace).
2. In your Vercel project dashboard, go to **Settings** > **Domains**.
3. Enter your domain (e.g. `dietcrate.in` or `www.dietcrate.in`) and click **Add**.
4. Vercel will provide DNS records (an `A` record or `CNAME` record) to add at your domain provider.
5. Once DNS propagates, Vercel automatically generates and Renews free SSL/TLS certificates.
6. In `index.html`, find the comment near the top that starts "After you have a domain" and add the two tags it describes (canonical link and share image).

## Step 6. Basic search visibility

- Edit the `<title>` and `description` near the top of `index.html` if your wording changes.
- Add the site to Google Search Console (https://search.google.com/search-console) and request indexing of the home page.
- Create a Google Business Profile for your Bangalore service area.

## Changing content

- **Crate details, prices, plans, menu table:** edit `index.html`. Each crate is one `<article class="crate">` block, so copy one to add a crate. Give its button a new `data-add` id, `data-name` and `data-price`.
- **Colours:** edit the variables at the top of `css/style.css`. Each crate's accent colour is the `--c` value on its card.
- **Fonts:** Outfit and Work Sans load from Google Fonts. If a visitor blocks them, the site falls back to system fonts and still works.

## How the cart and forms work

- The cart saves in the visitor's browser, so it survives a page refresh but is not shared between devices.
- **Send order on WhatsApp** needs a name and an office or IT Park. It opens WhatsApp with the crates, quantities and estimated total already typed. The visitor must press send inside WhatsApp.
- The totals are estimates from the prices on the page. Because there is no server, anyone could change prices in their own browser, so always confirm the final amount and delivery charge in the WhatsApp chat before accepting payment.
- The contact form does not store or email anything. It prepares a WhatsApp message and shows an **Open WhatsApp** button.
- There is no online payment and no order database. If you later want UPI payment, order records in Google Sheets, or a staff dashboard, that needs a backend and can be built as a second phase.

## Limits to know about

- Vercel's Hobby (free) plan has generous limits for static websites, fast global edge caching, and automated HTTPS.
- Search engines read the page text directly, but ranking depends on your content, domain age and links.
- Calorie ranges are approximate. The site tells customers to mention allergies when ordering.

## Troubleshooting

| Problem | Fix |
|---|---|
| WhatsApp opens but no contact is selected | `whatsapp` in `js/config.js` is empty, or contains `+`, spaces or dashes |
| Page looks unstyled online | Check that `css/`, `js/`, and `img/` folders are included in the repository / root directory |
| Changes do not show | Hard refresh with Ctrl+F5, or wait a minute for Vercel's edge cache to refresh |
| Cart total does not match the price shown | The `data-price` on the button and the visible price in `index.html` are different |
| Analytics shows nothing | Check the ID format, redeploy, and switch off ad blockers while testing |
| Custom domain stays pending | Check the DNS A/CNAME records in your domain registrar's control panel |

# Anniversary Wrapped: setup guide

You only ever edit **js/config.js** and add photos to **assets/photos/**.

## 1. Fill in your details
1. Open `js/config.js` in Notepad, TextEdit or VS Code.
2. Replace every `REPLACE...` text. Keep the quotes `" "` and the commas `,`.
3. Dates are `YYYY-MM-DD`, for example `2024-02-14`.
4. Copy a `{ ... },` block to add another milestone, photo or song. The last item in a list has no comma after it.
5. Spotify: open a song, choose Share, Copy link, and paste it into `spotify`.
6. Photos: your 8 photos are already in `assets/photos/` (1.jpg to 8.jpg). To swap one, replace the file with the same name.

## 2. Preview on your computer
Double-click `index.html`. (Spotify players may only appear once the site is online.)

## 3. Put it online with GitHub Pages (free)
1. Create an account at github.com.
2. Click **+** (top right), then **New repository**. Name it `our-wrapped`, choose **Public**, click **Create repository**.
3. On the next page click **uploading an existing file**.
4. Drag in **everything inside** the `anniversary-wrapped` folder (`index.html`, `css`, `js`, `assets`, `README.md`). Folders must stay as folders.
5. Click **Commit changes**.
6. Go to **Settings**, then **Pages**. Under **Branch** choose `main` and `/ (root)`, then **Save**.
7. Wait 1 to 2 minutes and refresh. Your link appears at the top:
   `https://YOUR-USERNAME.github.io/our-wrapped/`
8. Open it on your phone and test it before October 31st.

## 4. Changing things later
Open the file on GitHub, click the pencil icon, edit, **Commit changes**. The site updates in about a minute.

## Privacy note
Public repositories are visible to anyone who finds the link. Avoid last names, addresses or anything you would not want strangers to see. A private repo needs a paid GitHub plan for Pages.

## Troubleshooting
- **Blank page:** a comma or quote is missing in `config.js`. Check the line just before the error.
- **Photo missing:** the file name or capitals do not match exactly.
- **Slides won't move:** tap the right edge of the screen, or swipe left. Set `autoAdvance: true` for automatic play.
- **No Spotify player:** the link must come from Spotify's Share menu and contain `/track/`.

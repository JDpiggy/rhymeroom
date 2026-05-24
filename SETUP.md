# RapZone Setup Guide

## Quick Start

### Option 1: Open in Browser (Easiest)
1. **Navigate to** `c:\Users\jaron\Projex\Rapzone\app\`
2. **Double-click** `index.html`
3. **Done!** App opens in your default browser

### Option 2: Local Server (Recommended)

#### Windows - Using Python:
```powershell
# Navigate to app directory
cd c:\Users\jaron\Projex\Rapzone\app

# Python 3 (comes pre-installed on most Windows 10+)
python -m http.server 8000

# Then open browser: http://localhost:8000
```

#### Windows - Using Node.js:
```powershell
# Install http-server globally (one time)
npm install -g http-server

# Navigate to app directory
cd c:\Users\jaron\Projex\Rapzone\app

# Run server
http-server

# Then open browser: http://localhost:8080
```

#### Windows - Using Windows Subsystem for Linux (WSL):
```bash
cd /mnt/c/Users/jaron/Projex/Rapzone/app
python3 -m http.server 8000
# Then open: http://localhost:8000
```

#### macOS/Linux - Using Python:
```bash
cd ~/path/to/rapzone/app
python3 -m http.server 8000
# Then open: http://localhost:8000
```

#### macOS/Linux - Using Node.js:
```bash
cd ~/path/to/rapzone/app
npx http-server
```

## File Structure

```
rapzone/app/
├── index.html          # Main HTML structure
├── styles.css          # All styling and themes
├── app.js              # Main application controller
├── storage.js          # Local storage management
├── rhymeDetector.js    # Rhyme detection engine
├── beatEmbedder.js     # YouTube/Spotify embed handler
└── README.md           # Full documentation
```

## Features Ready to Use

✅ **Writing Features**
- Notebook-style lyric editor
- Line number toggle
- Auto-save to browser
- Multiple projects
- Sample lyrics included

✅ **Rhyme Checking**
- 4 comparison modes (Word, 2 Words, Syllable, 2 Syllables)
- Color-coded rhyme results (green/red)
- Rhyme strength scoring
- Real-time auto-check option

✅ **Beat Integration**
- YouTube URL support (paste any YouTube link)
- Spotify URL support (paste track/playlist links)
- Embedded players in side panel
- Easy add/remove

✅ **Customization**
- 6 beautiful themes (Dark, Light, Blue, Purple, Vinyl, Neon)
- Adjustable font size (14px-20px)
- Adjustable line height (3 options)
- Theme toggle in header

✅ **Project Management**
- Create/rename/delete projects
- Export as JSON
- Auto-save drafts
- Persistent local storage

## Browser Recommendations

**Best Experience:**
1. Google Chrome (Latest)
2. Microsoft Edge (Latest)
3. Firefox (Latest)
4. Safari (Latest)

**All browsers** support:
- localStorage (required)
- Modern CSS (Grid, Custom Properties)
- ES6+ JavaScript
- YouTube IFrames
- Spotify Embeds

## First Steps After Launch

1. **Explore sample projects** - 3 pre-loaded examples
2. **Try the rhyme checker** - Select a line and check
3. **Test themes** - Click theme buttons in the right panel
4. **Add a beat** - Paste a YouTube URL to test embedding
5. **Create new project** - Click + button to make your own

## Tips

- **Auto-save is enabled** - Changes save automatically every second
- **No internet required** for core features (except YouTube/Spotify embeds)
- **Data persists** - Close and reopen browser; your projects are still there
- **Export before clearing** - Back up projects as JSON before deleting

## Troubleshooting

### Port already in use?
```powershell
# Use a different port
python -m http.server 9000
# Then open: http://localhost:9000
```

### Module not loading?
- Check all files (storage.js, rhymeDetector.js, beatEmbedder.js, app.js) are in same directory
- Reload page (Ctrl+R or Cmd+R)
- Check browser console for errors (F12)

### YouTube embeds not working?
- Check internet connection
- Paste full YouTube URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Or just the video ID: `VIDEO_ID`
- Test with a known public video

### Projects disappeared?
- Ensure browser isn't in **private/incognito mode**
- LocalStorage is per-browser and per-domain
- Clearing browser cache clears LocalStorage

### Can't type or interact?
- Refresh the page (Ctrl+R)
- Check browser console for errors (F12)
- Try a different browser

## Performance

- **Light and fast** - No dependencies, pure vanilla JavaScript
- **Quick startup** - Loads in milliseconds
- **Smooth interactions** - No lag or jank
- **Auto-save debounced** - Saves every 1 second (not on every keystroke)
- **Efficient rendering** - Only updates what changed

## Privacy & Data

✅ **Your data stays local:**
- All data stored in browser's localStorage
- No network requests (except YouTube/Spotify embeds)
- No tracking
- No ads
- No login required
- Works offline (except beat embeds)

## Need Help?

Check the full **README.md** for:
- Detailed feature guide
- Rhyme detection algorithm explanation
- Writing tips and tricks
- Advanced settings

---

**Ready to write? Open index.html and start creating bars!** 🎤🔥

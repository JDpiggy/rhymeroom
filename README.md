# RhymeRoom - Free Online Rap Lyric Writing Studio

A modern, responsive web application designed for rappers and songwriters to write, edit, and test lyrics while listening to beats in real time.

## 🎤 Features

### Core Lyric Editing
- **Notebook-style editor** with a clean, distraction-free interface
- **Toggle line numbers** on and off for reference
- **Auto-save drafts** to browser local storage (saves every second)
- **Tab support** for indentation
- **Multiple project management** - create, rename, and delete lyric projects
- **Sample lyrics** included for new users

### 🔤 Rhyme Detection & Analysis
- **Real-time rhyme checking** with 4 comparison modes:
  - Last Word
  - Last 2 Words
  - Last Syllable
  - Last 2 Syllables
- **Visual rhyme matching**:
  - 🟢 Green highlighting for matching rhyme segments
  - 🔴 Red highlighting for non-matching segments
- **Rhyme strength scoring** (displayed as 🔥 for strong, ✓ for decent, ✗ for weak)
- **Auto-check mode** - automatically checks rhymes as you type
- **Configurable target lines** - compare against any line in your lyrics

### 🎵 Beat Integration
- **Local file upload** - upload MP3, WAV, or other audio files
- **Compact beat player** in side panel - listen while writing
- **Volume control** - adjust beat and metronome levels
- **Easy beat management** - add or remove beats instantly

### 🎙️ Recording
- **Audio recording** - record your flows over beats
- **Device selection** - choose input/output audio devices
- **Fullscreen record mode** - lyrics display with beat progress
- **Auto-named exports** - files saved with date, time, and project name
- **Format support** - save as WAV or MP3

### 🎨 Customization & Themes
- **6 creative themes**:
  - Dark (default studio-like)
  - Light (clean and bright)
  - Blue (calm water vibes)
  - Purple (creative mood)
  - Vinyl (classic record aesthetic)
  - Neon (cyberpunk energy)
- **Adjustable font size** (14px to 20px)
- **Adjustable line height** (Compact, Normal, Spacious)
- **Smooth theme transitions**

### 💾 Project Management
- **Multi-project support** - manage multiple lyric projects
- **Export projects** as JSON for backup or sharing
- **Auto-save to browser** - never lose your work
- **Project naming** - rename projects on the fly

### 📱 Responsive Design
- **Desktop optimized** with expandable control panels
- **Tablet friendly** with adaptive layout
- **Mobile compatible** - write lyrics on the go

## 🚀 Getting Started

### Setup Instructions

1. **Download/Clone the app files** to your local machine:
   ```
   index.html
   styles.css
   app.js
   rhymeDetector.js
   beatEmbedder.js
   storage.js
   ```

2. **Open in a web browser** - Simply double-click `index.html` or serve via a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the app**:
   - Local file: `file:///path/to/index.html`
   - Or navigate to: `http://localhost:8000`

### Browser Compatibility
- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile browsers**: Tested on iOS Safari and Chrome Mobile

### Storage
- **All data stored locally** in browser's localStorage
- **No server required** - runs entirely in the browser
- **Persistent storage** - your projects survive browser restarts
- **~5MB limit** per browser/domain (standard localStorage limit)

## 📖 How to Use

### Creating Your First Project

1. **Open the app** - Projects are auto-loaded from sample lyrics
2. **Click the "+" button** next to the project selector to create a new project
3. **Enter a project name** (e.g., "Summer Vibes", "Club Banger")
4. **Start typing** - Lyrics auto-save as you write

### Writing Lyrics

- **Type directly** in the main editor area
- **Press Enter** for new lines/bars
- **Press Tab** for indentation
- **Line numbers** - Toggle on/off using the "Line #" checkbox
- **Project name** - Edit the project name in the input field at the top

### Using the Rhyme Checker

1. **Select comparison mode**:
   - "Last Word" - Compares the final word of each line
   - "Last 2 Words" - Compares the last two words
   - "Last Syllable" - Phonetic comparison of final syllable
   - "Last 2 Syllables" - Phonetic comparison of final two syllables

2. **Enter target line number** - Choose which line to compare against

3. **Click "Check Rhymes"** - Displays matches color-coded:
   - Green = Rhyme match (strength 60+)
   - Red = No match

4. **Enable Auto-check** - Rhymes check automatically as you type (checks every 500ms)

### Adding a Beat

1. **Click "Upload Beat"** in the right panel
2. **Select an audio file** from your computer (MP3, WAV, etc.)
3. **Beat player appears** - Listen while you write
4. **Adjust volume** using the volume slider
5. **Remove beat** - Click "Remove Beat" to clear it

### Recording Your Flow

1. **Open the Record tab** in the header
2. **Select audio devices** - Choose your microphone and speakers
3. **Adjust volumes** - Set beat and metronome levels
4. **Click "Enter Record Mode"** - Fullscreen lyrics display appears
5. **Click "Start Recording"** - Beat plays and recording begins
6. **Perform your flow** over the beat
7. **Click "Stop Recording"** - File auto-downloads with date/time/project name
8. **Exit Record Mode** - Return to normal view

### Changing Themes

**Method 1: Theme buttons in right panel**
- Click any theme emoji button (🌑, ☀️, 🌊, 💜, 💿, ⚡)

**Method 2: Header theme toggle**
- Click the 🌙 icon in the header to toggle between dark/light

### Settings

1. **Click the ⚙️ icon** in the header
2. **Adjust settings**:
   - Font Size: Small, Medium, Large, Extra Large
   - Line Height: Compact, Normal, Spacious
3. **Export project** as JSON for backup
4. **Delete project** (with confirmation)

### Exporting & Backing Up

1. **Open Settings** (⚙️ button)
2. **Click "Export Project as JSON"**
3. **A JSON file downloads** with your project data
4. **Save it** for backup or sharing

## 🧠 Rhyme Detection Algorithm

### How It Works

The rhyme detection system uses a multi-layered phonetic matching approach:

#### Layer 1: Phonetic Mapping
- Maps common English rhyme patterns (ay, ee, igh, oh, etc.)
- Each pattern includes variant spellings (e.g., "ay" matches "ay", "a", "ey", "ai")

#### Layer 2: Word Extraction
Based on the selected comparison mode:
- **Last Word**: Extracts the final word from the line
- **Last 2 Words**: Takes the last two words as a phrase
- **Last Syllable**: Extracts vowel clusters (syllables) and takes the last one
- **Last 2 Syllables**: Takes the last two vowel clusters

#### Layer 3: Strength Scoring (0-100)
```
Perfect Rhyme (100):        Last 3+ characters match exactly
                           Example: "night" vs "light"

Near Rhyme (80):           Last 2 characters match exactly
                           Example: "cat" vs "hat"

Phonetic Rhyme (60):       Phonetic ending patterns match
                           Example: "face" vs "race"

Vowel Rhyme (40):          Last character (vowel) matches
                           Example: "beam" vs "team"

No Match (0-40):           Insufficient matching
```

#### Layer 4: Results Display
Results are sorted by rhyme strength and displayed with indicators:
- 🔥 = Strong rhyme (strength 80+)
- ✓ = Good rhyme (strength 60-79)
- ✗ = Weak rhyme (strength below 60)

### Rhyme Strength Formula

```
strength = (
    (matches_at_end_3_chars * 100) +
    (matches_at_end_2_chars * 80) +
    (phonetic_pattern_match * 60) +
    (vowel_match * 40)
) / weight
```

### Example Rhyme Detection

**Scenario**: Comparing line 5 against lines 1-4 (Last Word mode)

```
1. I'm the king of the mic, yeah I'm feeling alright
2. Every single night I'm making lyrics so tight  
3. Words flow smooth like butter, yeah it feels so right
4. Stepping on the beat, now I'm taking my flight
5. Crowd is going wild, yeah they love this sight

Comparison (Line 5 vs others):
- "sight" vs "alright"  → Phonetic: -ight → 100 (Perfect)
- "sight" vs "tight"    → Phonetic: -ight → 100 (Perfect)  
- "sight" vs "right"    → Phonetic: -ight → 100 (Perfect)
- "sight" vs "flight"   → Phonetic: -ight → 100 (Perfect)

Result: AABB rhyme scheme detected! 🔥
```

### Rhyme Detection Limitations

The system is **intentionally forgiving** to help with creative writing:
- Works best with English words
- Relies on orthographic patterns (not true phonetic pronunciation)
- May produce false positives with homophones
- Syllable detection is rule-based (not dictionary-backed)
- Slant rhymes are accepted as partial matches

## 🛠 Technical Details

### Architecture

**Modular JavaScript Design:**
- `storage.js` - Local storage management and project persistence
- `rhymeDetector.js` - Rhyme analysis and pattern matching
- `app.js` - Main controller and UI coordination
- `styles.css` - Theming and responsive layout

### Key Technologies
- **HTML5** - Semantic structure
- **CSS3** - Grid layout, custom properties, animations
- **Vanilla JavaScript** - No frameworks, no dependencies
- **LocalStorage API** - Browser-based persistence
- **MediaRecorder API** - Audio recording
- **Web Audio API** - Audio device management

### Performance
- **Auto-save**: Debounced at 1000ms intervals
- **Auto-rhyme check**: Debounced at 500ms intervals
- **Line number rendering**: Updated on each keystroke
- **Storage**: All operations are synchronous and instant

### Browser APIs Used
- `localStorage` - Project persistence
- `setTimeout/clearTimeout` - Debouncing
- `DOM APIs` - Element manipulation
- `CSS Custom Properties` - Dynamic theming
- `MediaRecorder API` - Audio recording
- `MediaDevices API` - Audio device enumeration
- `Web Audio API` - Metronome and audio control

## 🎯 Tips & Tricks

### Writing Tips
1. **Use the auto-save** - It's transparent; focus on writing
2. **Toggle line numbers** - Helpful for referencing lines in rhyme checker
3. **Use different themes** - They can inspire different moods
4. **Listen to beats** - The beat player is designed to stay out of your way

### Rhyme Checking Tips
1. **Start broad** - Use "Last Word" for big-picture rhyme schemes
2. **Get detailed** - Use "Last Syllable" for slant rhymes
3. **Compare key lines** - Use the target line selector strategically
4. **Enable auto-check** - Great for real-time feedback on new bars

### Project Management Tips
1. **Name projects clearly** - Easy reference later
2. **Export regularly** - Your browser might clear storage
3. **Test different themes** - They're free and can inspire creativity
4. **Use multiple projects** - Keep different songs separate

## 💡 Future Enhancement Ideas

- Dictionary-backed phonetic analysis
- Syllable counter with accent patterns
- Multi-line rhyme scheme visualization
- Song structure templates (Intro, Verse, Hook, Bridge, Outro)
- Collaboration features
- BPM sync'd rhyme timing
- Difficulty ratings based on rhyme complexity
- Cloud sync across devices
- Feedback from AI writing assistant

## 🐛 Troubleshooting

### Lyrics not saving?
- Check browser LocalStorage is enabled
- Try a different browser
- Check browser privacy settings

### Beat upload not working?
- Ensure you're selecting a valid audio file (MP3, WAV, etc.)
- Check file size isn't too large
- Try a different file format
- Clear the beat field and retry

### Recording not working?
- Grant microphone permissions when prompted
- Check your microphone is connected and working
- Select the correct input device in the Record tab
- Try a different browser (Chrome/Edge recommended)

### Rhyme detection seems off?
- Remember: It's rule-based, not AI
- Complex pronunciations may not match
- Try a different comparison mode
- Regional accents may affect results

### Line numbers not showing?
- Click the "Line #" checkbox to enable
- Check the checkbox is actually checked
- Reload the page if they still don't appear

### Projects disappeared?
- Check browser wasn't in private/incognito mode
- Try accessing from same browser/device
- LocalStorage is per-domain, not cloud-backed

## 📄 License

This project is provided as-is for educational and creative use.

## 🎤 Credits

Built for rappers, songwriters, and hip-hop artists who need a modern tool for crafting bars.

---

**Happy writing! Make some heat.** 🔥🎤
